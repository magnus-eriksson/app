const Toasts = new class {
    #toasts = null;

    /**
     * @param {string} message
     * @param {object} options {duration: 5000, dismissable: true, raw: false}
     *
     * @returns {Toast}
     */
    info(message, options = {}) {
        const toast = this.#createToast('info', message, options);
        return this.#append(toast);
    }

    /**
     * @param {string} message
     * @param {object} options {duration: 5000, dismissable: true, raw: false}
     *
     * @returns {Toast}
     */
    success(message, options = {}) {
        const toast = this.#createToast('success', message, options);
        return this.#append(toast);
    }

    /**
     * @param {string} message
     * @param {object} options {duration: 5000, dismissable: true, raw: false}
     *
     * @returns {Toast}
     */
    error(message, options = {}) {
        const toast = this.#createToast('error', message, options);
        return this.#append(toast);
    }

    /**
     *
     * @param {Toast} toast
     *
     * @returns {Toast}
     */
    #append(toast) {
        if (this.#toasts === null) {
            this.#toasts = document.createElement('div');
            this.#toasts.setAttribute('id', 'toasts');
            document.querySelector('body').appendChild(this.#toasts);
        }

        this.#toasts.appendChild(toast.getElement());
        toast.display();

        const duration = toast.getOption('duration', 5000);
        if (duration > 0) {
            window.setTimeout(() => toast.remove(), duration);
        }

        return toast;
    }

    /**
     * Create a new Toast instance
     *
     * @param {string} type
     * @param {string} message
     * @param {object} options
     *
     * @returns {Toast}
     */
    #createToast(type, message, options = {}) {
        return new class Toast {
            #element = null;
            #content = null;
            #options = {};

            constructor(type, message, options) {
                this.#options = options;

                this.#element = document.createElement('div');
                this.#element.classList.add('toast', type);

                this.#content = document.createElement('div');
                this.#element.appendChild(this.#content);

                this.update(message, this.getOption('raw', false));

                if (this.getOption('dismissable', true) === true) {
                    const dismiss = document.createElement('a');
                    dismiss.classList.add('toast-dismiss');
                    dismiss.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.remove();
                    });
                    this.#element.appendChild(dismiss);
                }
            }

            /**
             * Display the toast
             *
             * @returns {void}
             */
            display() {
                window.setTimeout(() => this.#element.classList.add('show'), 1);
            }

            /**
             * Remove the toast
             *
             * @returns {void}
             */
            remove() {
                this.#element.classList.remove('show');
                window.setTimeout(() => this.#element.remove(), 200);
            }

            /**
             * Update the content
             *
             * @param {string} content
             * @param {bool} raw
             */
            update(content, raw = false) {
                raw ? this.#content.innerHTML = content : this.#content.innerText = content;
            }

            /**
             * Get the current content
             *
             * @returns {string}
             */
            getContent() {
                return this.#content;
            }

            /**
             * Get the toast HTML element
             *
             * @returns {HTMLElement}
             */
            getElement() {
                return this.#element;
            }

            /**
             * Get a value from the toast options
             *
             * @param {string} key
             * @param {mixed} fallback
             *
             * @returns {mixed}
             */
            getOption(key, fallback = null) {
                return typeof this.#options[key] !== 'undefined' ? this.#options[key] : fallback;
            }
        }(type, message, options);
    }
}