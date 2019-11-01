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

    v2.use('form', {
        components: {
            'input.async': function (callback) {
                require(['components/v2.input'], callback);
            },
            'button.async': function (callback) {
                require(['components/v2.button'], callback);
            }
        },
        form: function () {
            /** 行内显示 */
            this.inline = false;

            /** 水平布局 */
            this.horizontal = false;

            /** 超小按钮 */
            this.xs = false;

            /** 小按钮 */
            this.sm = false;

            /** 大按钮 */
            this.lg = false;

            /** 显示输入框名称 */
            this.label = true;

            /** 只读内容文本显示 */
            this.readonly2span = true;

            /** 证书 */
            this.withCredentials = true;

            /** 请求方式 */
            this.method = "GET";

            /** 请求地址 */
            this.action = location.href;

            /** 表单内容编码 */
            this.enctype = "application/x-www-form-urlencoded";
        },
        init: function () {
            this.base.init('form');
        },
        render: function () {

            if (this.inline) {
                this.$.classList.add('form-inline');
            }

            if (this.horizontal) {
                this.$.classList.add('form-horizontal');
            }

        },
        build: function (view) {
            var elem, group = this.lg ? '.form-group-lg' : this.sm ? '.form-group-sm' : this.xs ? '.form-group-xs' : '.form-group', type = v2.type(view);

            switch (type) {
                case 'array':
                    v2.each(view, this.lazy(function (option) {
                        if (v2.isArraylike(option)) {
                            var index = 12 / option.length;
                            var col = '.col-xs-12.col-sm-{0}.col-lg-{1}'.format(index < 6 ? index * 2 : index, index);
                            return v2.each(option, function (config) {
                                elem = this.$.appendChild(col.htmlCoding().html())
                                    .appendChild(group.htmlCoding().html());

                                if (this.label && config.label !== false) {
                                    elem.appendChild('label{{0}}'.format(config.title || config.name));
                                }

                                this.create(option.tag || 'input', v2.improve({
                                    $$: elem
                                }, config));
                            }, this);
                        }

                        elem = this.$.appendChild(group.htmlCoding().html());

                        if (this.label && option.label !== false) {
                            elem.appendChild('label{{0}}'.format(option.title || option.name));
                        }

                        this.create(option.tag || 'input', v2.improve({ $$: elem }, option));
                    }));
                    break;
                case 'object':
                    if ('tag' in view) {
                        return this.lazy(function (view) {
                            var elem = this.$.appendChild(group.htmlCoding().html());

                            if (this.label && option.label !== false) {
                                elem.appendChild('label{{0}}'.format(view.title || view.name));
                            }

                            return this.create(view.tag || 'input', v2.improve({ $$: elem }, view));
                        }, view);
                    }

                    v2.each(view, this.lazy(function (option, name) {
                        option.name = option.name || name;


                    }));

                    break;
                default:
                    break;
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
        reset: function () {
            this.$.reset();
        },
        submit: function () {
            console.log('submit');
        },
        ready: function () {
            var vm = this;

            this.$.on('stop.submit', function () {

                vm.submit();

                return false;
            });
            this.$.on('stop.reset', function () {

                vm.reset();

                return false;
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
        return v2('form', option);
    };
}));