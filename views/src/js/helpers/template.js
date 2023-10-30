const Templates = new class {
    /**
     * @param {string|array|NodeList|HTMLCollection} selector
     * @param {string} template
     * @param {object} data
     * @param {bool} append
     * @returns {void}
     */
    template(selector, template, data = {}, append = false) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            const tpl = Hbs[template](data);
            elements.forEach(el => {
                el.innerHTML = append ? el.innerHTML + tpl : tpl;
            });
        }
    }

    /**
     * @param {string|array|NodeList|HTMLCollection} selector
     * @param {string} template
     * @param {object} data
     * @param {bool} append
     * @returns {void}
     */
    partial(selector, template, data = {}, append = false) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            const tpl = Hbs.partial[template](data);
            elements.forEach(el => {
                el.innerHTML = append ? el.innerHTML + tpl : tpl;
            });
        }
    }
};

Handlebars.registerHelper('ifNull', (value) => value === null);
Handlebars.registerHelper('ifEqual', (value1, value2) => value1 === value2);
Handlebars.registerHelper('ifNotEqual', (value1, value2) => value1 !== value2);
Handlebars.registerHelper('excerpt', function (content) {
    return content.split('\n')[0] || '';
});

Handlebars.registerHelper('displayDate', function (date) {
    date = new Date(date);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
});
