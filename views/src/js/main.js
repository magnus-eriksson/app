window.addEventListener('DOMContentLoaded', () => {
    if (Flash.has('successToast')) {
        Toasts.success(Flash.get('successToast'));
    }

    if (Flash.has('errorToast')) {
        Toasts.error(Flash.get('errorToast'));
    }
});
