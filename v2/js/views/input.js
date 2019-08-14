function initPage() {
    require(['components/v2.input'], function (input) {
        input({
            type: 'radio',
            focus: true
        });
        input({
            type: 'checkbox',
            focus: true
        });
    });
}