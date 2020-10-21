(function (factory) {
    return typeof define === 'function' ?
        define(['v2'], factory) :
        typeof module === 'object' && module.exports ?
            module.exports = function (root, v2kit) {
                if (typeof v2kit === 'undefined') {
                    if (typeof window === 'undefined') {
                        v2kit = require('v2')(root);
                    } else {
                        v2kit = require('v2');
                    }
                }
                return factory(v2kit);
            } :
            factory(v2);
}(function (/** @type Use.V2 */v2) {

    v2.use('panel', {
        components: {
            list: function (resovle) {
                require(['components/v2.list'], resovle);
            },
            table: function (resovle) {
                require(['components/v2.table'], resovle);
            }
        },
        panel: function () {
            /** 风格 */
            this.style = "default";
        },
        build: function (view) {

            if (!view) return;

            if (v2.isString(view)) {

                this.$body = this.appendChild('.panel-body'.htmlCoding().html());

                this.$body.appendChild(view.html());

                return;
            }

            var head = view.head,
                foot = view.foot,
                body = view.body;
            if (head) {
                this.$head = this.$.appendChild('.panel-heading'.htmlCoding().html());
                if (v2.isString(head)) {
                    this.$head.appendChild(head.html());;
                } else {
                    this.$head.appendChild('{{tagName}}.panel-title{{{text}}}'.withCb(head).htmlCoding().html());
                }
            }

            if (body) {
                this.$body = this.$.appendChild('.panel-body'.htmlCoding().html());

                this.base.build(body, this.$body);
            }

            if ('tag' in view) {
                this.create(view.tag, view);
            }

            if (foot) {
                this.$foot = this.$.appendChild('.panel-footer'.htmlCoding().html());

                this.base.build(foot, this.$foot);
            }
        },
        render: function () {
            this.$.classList.add('panel');
        },
        usb: function () {
            this.base.usb();
            this.define('style', function (style, oldStyle) {
                this.$.classList.remove('panel-' + oldStyle);
                this.$.classList.add('panel-' + style);
            });
        }
    });

    return function (options) {
        return v2('panel', options);
    };
}));