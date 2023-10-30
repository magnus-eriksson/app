/**
 * Add event listener (uses event delegation)
 *
 * @param {string|Node} selector
 * @param {string} action
 * @param {function} callback
 * @param {boolean} [preventDefault=false] Set to true to automatically invoke event.preventDefault.
 */
const onEvent = (selector, action, callback, preventDefault = false, capture = false) => {
    capture = !capture ? ['blur', 'focus', 'change'].includes(action.toLowerCase()) : capture;

    // If we have a list if items, let's register the event on each of them
    if (Array.isArray(selector) || selector instanceof NodeList || selector instanceof HTMLCollection) {
        selector.forEach((element) => {
            onEvent(element, action, callback);
        });
        return;
    }

    document.addEventListener(action, function (e) {
        let isSame = false;
        if (typeof selector === 'string') {
            isSame = e.target && e.target.matches && e.target.matches(selector);
        }

        if (selector instanceof Node) {
            isSame = e.target && e.target === selector;
        }

        if (isSame) {
            if (preventDefault) {
                e.preventDefault();
            }

            callback.call(this, e);
        }
    }, capture);
};
