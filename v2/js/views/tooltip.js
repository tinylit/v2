function initPage() {
    require(['components/v2.tooltip'], function (tooltip) {
        tooltip({
            request: document.getElementById('tooltip'),
            content: '该项为必填项!'
        });
        tooltip({
            request: document.getElementById('tooltip'),
            content: '该项为必填项!',
            direction: 'top'
        });
        tooltip({
            request: document.getElementById('tooltip'),
            content: '该项为必填项!',
            direction: 'right'
        });
        tooltip({
            request: document.getElementById('tooltip'),
            content: '该项为必填项!',
            direction: 'bottom'
        });
        tooltip({
            request: document.getElementById('tooltip'),
            content: '该项为必填项!',
            direction: 'left'
        });
    });
}