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

    var divider = 'li.divider'.htmlCoding(),
        more = 'a[href=#]{更多选项}'.htmlCoding();

    v2.use('dropdown', {
        dropdown: function () {
            /** 方位 */
            this.direction = "bottom";

            /** 请求 */
            this.deployment = ''; //'[data-toggle="dropdown"]';

            /** 选中项 */
            this.selectedIndex = -1;
        },
        design: function () {
            /** 设置初始状态 */
            this.visible = false;
            /** 默认隐藏 */
            this.defaultVisible = false;
        },
        init: function () {
            this.base.init('ul');
        },
        build: function (view) {

            var data = [], htmls = [];

            if (v2.isEmpty(view)) {
                view = [{
                    value: "",
                    disabled: true,
                    text: "无匹配数据！"
                }];
            }

            v2.each(view, function done(view) {

                switch (v2.type(view)) {
                    case "string":
                        htmls.push('<li class="nav-header">', view, "</li>");
                        break;
                    case "boolean":
                        if (view) {
                            htmls.push(divider);
                        }
                        break;
                    case "object":
                        if (view.dropdown) {
                            htmls.push('<li class="dropdown">');

                            htmls.push(view.text ? 'a[href=#]{{0}}'.format(view.text).htmlCoding() : more);

                            htmls.push('<ul class="dropdown-menu">');

                            v2.each(view.view, done);

                            htmls.push('</ul></li>');
                            break;
                        }

                        if (view.disabled) {
                            htmls.push('<li class="disabled">');
                        } else {
                            htmls.push('<li>');
                        }

                        var option = {
                            href: 'href' in view ? view.href : "#"
                        };

                        if ('text' in view) {
                            option.text = view.text;
                        } else {
                            option.text = view.name;
                        }

                        if ('value' in view) {
                            option.value = view.value;
                        } else {
                            option.value = (view.id || view.id === 0) ? view.id : (view.value || view.value === 0) ? view.value : "";
                        }

                        htmls.push('<a href="{0}" data-bit={2}>{1}</a>'.format(option.href || "#", option.text, data.length));

                        data.push(option);

                        htmls.push('</li>');
                        break;
                    case "array":
                        htmls.push('<li class="dropdown-submenu">', more, '<ul class="dropdown-menu">');
                        v2.each(view, done);
                        htmls.push('</ul></li>');
                        break;
                }
            });

            this.data = data;

            this.$.empty()
                .appendChild(htmls.join('').html());
        },
        render: function () {
            this.$$.classList.add('dropdown');
            this.$.classList.add('dropdown-menu');
        },
        usb: function () {
            var selectedIndex = this.selectedIndex;

            this.base.usb();

            this.define('direction', function (dir) {
                this.$$.classList.toggle('dropup', dir === 'top');
            }).define("selectedOptions", function () {
                return this.data[selectedIndex];
            });

            this.define('selectedIndex', {
                get: function () { return selectedIndex; },
                set: function (index) {

                    this.when('li')
                        .done(function (elem) {
                            elem.classList.remove('active');
                        });

                    if (v2.isEmpty(this.data)) {
                        return selectedIndex = -1;
                    }

                    var len = this.data.length;

                    if (index < 0 || index >= len) {
                        return selectedIndex = - 1;
                    }

                    var node = this.take('[data-bit="{0}"]'.format(index));

                    if (!node) return selectedIndex = -1;

                    while ((node = node.parentNode)) {
                        if (node.nodeName.toLowerCase() === 'li') {
                            if (node.classList.contains('disabled')) {

                                if (selectedIndex === -1) {
                                    return -1;
                                }

                                index = -1;

                                break;
                            }

                            node.classList.add('active');
                        } else if (node === this.$) {
                            break;
                        }
                    }

                    this.invoke('select-changed', selectedIndex = index);
                }
            });
        },
        show: function () {
            this.$$.classList.add('open');
        },
        hide: function () {
            this.$$.classList.remove('open');
        },
        commit: function () {
            var vm = this;

            if (this.deployment) {
                this.deployment.on('click', function () {
                    vm.toggle();
                });
            }

            this.$.on('click', "a", function () {

                var bit = this.getAttribute("data-bit");

                if (bit == null) return false;

                if (this.parentNode.classList.contains('disabled')) {
                    return false;
                }

                v2.usb(vm, "selectedIndex", bit >>> 0);
            });
        }
    });

    return function (options) {
        return v2('dropdown', options);
    };
}));