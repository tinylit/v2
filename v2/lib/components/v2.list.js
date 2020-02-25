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

    v2.use('list', {
        list: function () {
            /** 类型 */
            this.type = "default";
        },
        init: function () {
            this.base.init(this.type === 'default' ? 'ul' : 'div');
        },
        build: function (view) {
            var vm = this;

            if (!view) return;

            v2.each(view, function (view) {
                var node;
                switch (vm.type) {
                    case 'link':
                        node = vm.$.appendChild('a[href="#"].list-group-item'.htmlCoding().html());
                        break;
                    case 'button':
                        node = vm.$.appendChild('button[type="button"].list-group-item'.htmlCoding().html());
                        break;
                    default:
                        node = vm.$.appendChild('li.list-group-item'.htmlCoding().html());
                        break;
                }

                if (v2.isString(view)) {
                    node.appendChild(view.html());
                } else {
                    if ('href' in view) {
                        node.href = view.href;
                    }

                    if (view.disabled) {
                        node.classList.add('disabled');
                    }

                    if ('title' in view) {
                        node.appendChild('h4.list-group-item-heading'.htmlCoding().html())
                            .appendChild(document.createTextNode(view.title));

                        node.appendChild('p.list-group-item-text'.htmlCoding().html())
                            .appendChild(document.createTextNode(view.text));
                    } else {
                        node.appendChild(document.createTextNode(view.text));
                    }

                    if ('style' in view) {
                        switch (view.style) {
                            case 'success':
                                node.classList.add('list-group-item-success');
                                break;
                            case 'info':
                                node.classList.add('list-group-item-info');
                                break;
                            case 'warning':
                                node.classList.add('list-group-item-warning');
                                break;
                            case 'danger':
                                node.classList.add('list-group-item-danger');
                                break;
                        }
                    }

                    if ('click' in view) {
                        node.on('click', function (e) {
                            view.click.call(vm, e);
                        });
                    }
                }
            });
        },
        render: function () {
            this.$.classList.add('list-group');
        },
        usb: function () {
            this.base.init();

            this.define('type', function (style, oldStyle) {
                if (style === 'default' || oldStyle === 'default') {
                    var node = this.$.nextSibling,
                        className = this.$.className,
                        cssText = this.$.cssText;

                    this.$$.removeChild(this.$);

                    this.$ = this.$$.insertBefore(document.createElement(type === 'default' ? 'ul' : 'div'), node);

                    this.$.className = className;

                    this.$.cssText = cssText;
                }

                this.build(this.view);
            });
        },
        commit: function () {
            var vm = this;
            this.$.on('click', '.list-group-item', function () {
                vm.when('.list-group-item')
                    .done(function (node) {
                        node.classList.remove('active');
                    });

                this.classList.add('active');
            });
        }
    });

    return function (options) {
        return v2('list', options);
    };
}));