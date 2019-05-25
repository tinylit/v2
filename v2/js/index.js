function initPage() {

    var select = document.getElementById("my-select");

    var x = select.selectedOptions; 
    var html = 'form.form>label.control-label[for="form-1-{name}"]>span.control-stamp{*}+span{{title??name}}'.htmlCoding();
    require(['components/v2.input'], function (input) {/* 引用库、插件 */
        input({
            '#template': 'input[type="time"][required]',
            events: {
                $click: 'click'
            },
            'date-min': function () {
                var date = new Date();
                return '{0}-{1}-{2} {3}:{4}:{5}'.format(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
            },
            'date-max': function () {
                var date = new Date();
                return '{0}-{1}-{2} {3}:{4}:{5}'.format(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
            },
            inputChange: function (value) {
                console.log(value);
            },
            methods: {
                click: function () {
                    console.log('click');
                    this.reportValidity();
                }
            }
        });
        input({
            name: 'name',
            type: 'radio',
            events: {
                $click: 'click'
            },
            inputChange: function (value) {
                console.log(value);
            },
            methods: {
                click: function () {
                    console.log('click');
                    this.reportValidity();
                }
            }
        });
        input({
            name: "name",
            type: 'radio',
            events: {
                $click: 'click'
            },
            inputChange: function (value) {
                console.log(value);
            },
            methods: {
                click: function () {
                    console.log('click');
                    this.reportValidity();
                }
            }
        });
    });
}