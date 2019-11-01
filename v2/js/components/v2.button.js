(function (factory) {
    return typeof define === 'function' ?
        define(['v2'], factory) :
        typeof module === 'object' && module.exports ?
            module.exports = function (root, v2kit) {
                if (typeof v2kit === 'undefined') {
                    if (typeof window === 'undefined') {
                        v2kit = require('v2')(root);
                    }
                    else {
                        v2kit = require('v2');
                    }
                }
                return factory(v2kit);
            } :
            factory(v2kit);
}(function (v2) {

    v2.use('button', {
        button: function () {
            /** 按钮类型 */
            this.type = "button";
            /** 按钮名称 */
            this.text = '';
            /** 用于替换按钮的所有子元素 */
            this.html = '';
            /** 超小按钮 */
            this.xs = false;
            /** 小按钮 */
            this.sm = false;
            /** 大按钮 */
            this.lg = false;
        },
        init: function () {
            this.base.init('button');
        },
        render: function () {

            this.$.classList.add('btn');

            if (this.lg || this.sm || this.xs) {
                this.$.classList.add(this.lg ? 'btn-lg' : this.sm ? 'btn-sm' : 'btn-xs');
            }

            if (this.host && this.host.isInstanceOf('navbar')) {
                this.$.classList.add('navbar-btn');
            }

            if (this.type === 'submit') {
                this.$.classList.add('btn-primary');
            } else if (this.type === 'reset') {
                this.$.classList.add('btn-warning');
            }
        },
        usb: function () {
            this.base.usb();

            this.define('type');

            this.define({
                text: function (text) {
                    this.$.empty()
                        .append(document.createTextNode(text));
                },
                html: function (html) {
                    this.$.empty()
                        .append(html.withCb(this));
                }
            });
        },
        commit: function () {
            var vm = this;
            this.base.commit();
            this.$.on("keyup", function (e) {
                var code = e.keyCode || e.which;
                if (code === 13 || code === 108) {
                    vm.invoke("keyboard-enter");
                }
            });
        }
    });

    return function (option) {
        return v2('button', option);
    };
}));