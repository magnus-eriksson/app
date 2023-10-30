const Flash = new class {
    /**
     * @prop {object}
     */
    #flash = {};

    /**
     * @prop {object}
     */
    #newFlash = {};

    constructor() {
        const flash = localStorage.getItem('__flash');

        if (flash) {
            this.#flash = JSON.parse(flash);
            localStorage.removeItem('__flash');
        }
    }

    /**
     * @param {string} key
     * @param {any} value
     * @returns {Flash}
     */
    add(key, value) {
        this.#newFlash[key] = value;
        localStorage.setItem('__flash', JSON.stringify(this.#newFlash));
        return this;
    }

    /**
     * @param {string} key
     * @param {any} fallback
     * @returns {any}
     */
    get(key, fallback = null) {
        return this.has(key) ? this.#flash[key] : fallback;
    }

    /**
     * @param {string} key
     * @returns {bool}
     */
    has(key) {
        return typeof this.#flash[key] !== 'undefined';
    }
};