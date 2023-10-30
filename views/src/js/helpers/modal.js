class Modal {
    /**
     * @type {ModalOverlay|null}
     */
    static #overlay = null;


    /**
     * Make a new modal instance and only return it without opening it
     *
     * @returns {ModalContent}
     */
    static make() {
        return new ModalContent(this.#getOverlay());
    }


    /**
     * Make a new modal instance, open it and return it
     *
     * @param {string|null} content
     * @param {object} options - Modal options
     *
     * @returns {ModalContent}
     */
    static open(content = null, options = {}) {
        return new ModalContent(this.#getOverlay())
            .options(options)
            .open(content);
    }


    /**
     * Open modal using a template
     *
     * @param {string} template
     * @param {object} options
     */
    static async template(template, options = {}) {
        return new ModalContent(this.#getOverlay())
            .template(template, options);
    }


    /**
     * Open and set content from a fetch request
     *
     * @param {object|string} optionsOrUrl
     * @param {object} options - Modal options
     *
     * @returns {ModalContent}
     */
    static fetch(optionsOrUrl = {}, options = {}) {
        return new ModalContent(this.#getOverlay())
            .options(options)
            .fetch(optionsOrUrl);
    }

    /**
     * Close any open modal
     *
     * @returns {void}
     */
    static close() {
        this.#getOverlay().hide();
    }


    /**
     * Get the overlay instance
     *
     * @returns {ModalOverlay}
     */
    static #getOverlay() {
        if (this.#overlay === null) {
            this.#overlay = new ModalOverlay;
        }

        return this.#overlay;
    }
}

class ModalOverlay {
    /**
     * @type {HTMLDivElement}
     */
    #element = null;

    /**
     * @type {boolean}
     */
    #attached = false;

    /**
     * @type {boolean}
     */
    #dismissable = true;

    /**
     * @type {any}
     */
    #overflow = null;

    /**
     * @type {number}
     */
    #padding = 0;


    constructor() {
        this.#overflow = document.querySelector('body').style.overflow;

        this.#element = document.createElement('div');
        this.#element.setAttribute('id', 'modal-overlay');
        this.#element.addEventListener('click', (e) => {
            if (e.target !== this.#element) {
                return
            }

            e.preventDefault();
            if (this.#dismissable) {
                this.hide();
            }
        });

        onEvent('[data-modal-close]', 'click', function (e) {
            e.preventDefault();
            Modal.close();
        });
    }


    /**
     * Show the modal overlay and content
     *
     * @returns {void}
     */
    show() {
        if (this.#attached === false) {
            document.querySelector('body').appendChild(this.#element);
            this.#attached = true;
            document.querySelector('body').style.overflow = 'hidden';
            this.#adjustForScrollbar();
        }

        window.setTimeout(() => this.#element.classList.add('open'), 10);
    }


    /**
     * Hide the modal overlay and content
     *
     * @returns {void}
     */
    hide() {
        this.#element.classList.remove('open');

        window.setTimeout(() => {
            this.#element.remove();
            this.#attached = false;
            this.#dismissable = true;
            document.body.style.overflow = this.#overflow;
            document.body.style.paddingRight = `${this.#padding}px`;
        }, 200);
    }


    /**
     * @param {HTMLElement} content
     */
    content(content) {
        this.#element.replaceChildren(content);
    }


    /**
     * Set if the overlay can be dismissed by clicking on it
     *
     * @param {boolean} dismissable
     */
    dismissable(dismissable = true) {
        this.#dismissable = dismissable !== false;
    }


    /**
     * @returns {HTMLDivElement}
     */
    getElement() {
        return this.#element;
    }


    /**
     * Adjust padding right when body has scrollbar to prevent "jumping"
     *
     * @returns {void}
     */
    #adjustForScrollbar() {
        this.#padding = this.#getBodyRightPadding();

        if (document.body.scrollHeight <= document.body.clientHeight) {
            return;
        }

        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        document.body.appendChild(outer);

        const inner = document.createElement('div');
        outer.appendChild(inner);

        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        outer.parentNode.removeChild(outer);

        document.body.style.paddingRight = `${this.#padding + scrollbarWidth}px`;
    }


    /**
     * Get the default body right padding
     *
     * @returns {float}
     */
    #getBodyRightPadding() {
        const oElm = document.body;
        let strCssRule = 'padding-right';
        let strValue = "";

        if (document.defaultView && document.defaultView.getComputedStyle) {
            strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
        } else if (oElm.currentStyle) {
            strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
                return p1.toUpperCase();
            });
            strValue = oElm.currentStyle[strCssRule];
        }

        return parseFloat(strValue);
    }
}

class ModalContent {
    /**
     * Main modal element
     *
     * @type {HTMLDivElement}
     */
    #element = null;

    /**
     * @type {ModalOverlay}
     */
    #overlay = null;

    /**
     * Modal options
     *
     * @type {object}
     */
    #options = {
        dismissable: true,
        onOpen: () => { },
        onClose: () => { }
    }


    /**
     * @param {ModalOverlay} overlay
     */
    constructor(overlay) {
        this.#overlay = overlay;
        this.#element = document.createElement('div');
        this.#element.setAttribute('id', 'modal');

        this.#element.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.getOption('dismissable')) {
                this.close();
            }
        });
    }


    /**
     * Set modal options
     *
     * @param {object} options
     *
     * @returns {ModalContent}
     */
    options(options = {}) {
        this.#options = { ...this.#options, ...options };
        return this;
    }


    /**
     * Get an option value
     *
     * @param {string} name
     * @param {any} fallback
     *
     * @returns {any}
     */
    getOption(name, fallback = null) {
        return typeof this.#options[name] !== 'undefined' ? this.#options[name] : fallback;
    }


    /**
     * Add one or more CSS classes to the modal
     *
     * @param {...string[]} className
     *
     * @returns {ModalContent}
     */
    addClass(...className) {
        this.#element.classList.add(...className);
        return this;
    }


    /**
     * Remove one or more CSS classes from the modal
     *
     * @param  {...string[]} className
     *
     * @returns {ModalContent}
     */
    removeClass(...className) {
        this.#element.classList.remove(...className);
        return this;
    }


    /**
     * Set if the modal should be dismissable or not
     *
     * @param {boolean} dismissable
     *
     * @returns {ModalContent}
     */
    dismissable(dismissable = true) {
        this.options({ dismissable: dismissable !== false });
        this.#overlay.dismissable(this.getOption('dismissable'));

        return this;
    }


    /**
     * Set the content
     *
     * @param {string} content
     *
     * @returns {ModalContent}
     */
    content(content = '') {
        this.#element.innerHTML = content;
        return this;
    }


    /**
     * Open modal using a template
     *
     * @param {string} templateName
     * @param {object} options
     */
    async template(templateName, options = {}) {
        this.open('', options);

        let data = options.data || {};

        if (options.url || null) {
            const request = await fetch(options.url);
            const response = await request.json();
            data = response.success ? response.data || {} : {};

            if (options.middleware || null) {
                data = options.middleware.call(this, data);
            }
        }

        this.content(Hbs[templateName](data));

        const focus = this.#element.querySelector('[data-autofocus]');
        focus && focus.focus();

        if (options.onLoad || null) {
            options.onLoad.call(this, this);
        }
    }


    /**
     * Show the modal
     *
     * @param {object|string|null} contentOrOptions
     *
     * @returns {ModalContent}
     */
    open(contentOrOptions = null) {
        if (typeof contentOrOptions === 'object') {
            this.options(contentOrOptions);
        } else if (typeof contentOrOptions === 'string') {
            this.content(contentOrOptions);
        }

        this.#overlay.content(this.#element);
        this.#overlay.dismissable(this.getOption('dismissable', true));
        this.#overlay.show();

        this.getOption('onOpen').call(this, this);

        return this;
    }


    /**
     * Open and set content from a fetch request
     *
     * @param {object|string} optionsOrUrl
     *
     * @returns {ModalContent}
     */
    fetch(optionsOrUrl = {}) {
        const defaults = {
            url: '',
            method: 'GET',
            middleware: (content) => content,
            onLoad: () => { }
        };

        if (typeof optionsOrUrl === 'string') {
            optionsOrUrl = {
                url: optionsOrUrl
            }
        }

        const options = { ...defaults, ...optionsOrUrl };

        this.open();

        fetch(options.url, options)
            .then(response => response.text())
            .then(response => {
                this.content(options.middleware.call(this, response));
                options.onLoad.call(this, this);
            });

        return this;
    }


    /**
     * Hide the modal
     *
     * @returns {ModalContent}
     */
    close() {
        if (this.getOption('onClose').call(this, this) === false) {
            return this;
        }

        this.#overlay.hide();
        return this;
    }


    /**
     *
     * @returns {HTMLDivElement}
     */
    getElement() {
        return this.#element;
    }
}
