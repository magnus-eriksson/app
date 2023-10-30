window.addEventListener('DOMContentLoaded', function () {
    const textareas = document.querySelectorAll('textarea[data-auto-resize]') || [];

    const resize = function (element, ghost) {
        ghost.innerText = element.value + "\nx";

        let newHeight = ghost.clientHeight - 15;

        console.log(newHeight);
        element.style.height = newHeight < 300 ? '300px' : `${newHeight}px`;
    };

    textareas.forEach((element) => {
        let container = document.createElement('div');
        let ghost = document.createElement('div');
        let style = getComputedStyle(element);

        element.style.overflowY = 'hidden';

        container.style.height = 0;
        container.style.width = 0;
        container.style.overflow = 'hidden';

        ghost.style.width = style.width;
        ghost.style.padding = style.padding;
        ghost.style.lineHeight = style.lineHeight;
        ghost.style.border = style.border;
        ghost.style.font = style.font;
        ghost.style.fontSize = style.fontSize;

        container.appendChild(ghost);
        element.parentNode.appendChild(container);

        onEvent(element, 'input', function (e) {
            resize(e.target, ghost);
        });

        resize(element, ghost);
    });
});