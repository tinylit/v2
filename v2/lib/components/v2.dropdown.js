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
}(function (/** @type Use.V2kitStatic */v2) {

    var divider = 'li.divider'.htmlCoding(),
        more = 'a[data-ignore][href=#]{更多选项}'.htmlCoding();

    v2.use('dropdown', {
        dropdown: function () {
            /** 方位 */
            this.direction = "bottom";

            /** 请求 */
            this.deployment = '[data-toggle="dropdown"]';

            /** 自动策划 */
            this.independent = false;

            /** 选中项 */
            this.selectedIndex = -1;

            /** 设置初始状态 */
            this.visible = false;
            this.defaultVisible = false;
        },
        init: function () {
            this.base.init('ul');
        },
        build: function (view) {
            if (view === null || view === undefined)
                return;

            var data = [], htmls = [];

            v2.each(view, function done(view) {
                switch (v2.type(view)) {
                    case "string":
                        htmls.push('<li class="nav-header">', view, "</li>");
                        break;
                    case "boolean":
                        htmls.push(divider);
                        break;
                    case "object":
                        htmls.push('<li>');

                        htmls.push('<a href="{0}" data-bit={2}>{1}</a>'.format(view.href || "#", view.text, data.push(view)));

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
            this.base.usb();

            var vm = this, then = this.when('li');

            this.define('direction', function (dir) {
                this.$$.classList.toggle('dropup', dir === 'top');
            }).define('selectedIndex', function (index) {
                var node = this.take('[data-bit="{0}"]'.format(index));

                then.done(function (elem) {
                    elem.classList.remove('active');
                });

                if (!node) return -1;

                while ((node = node.parentNode)) {
                    if (node.nodeName.toLowerCase() === 'li') {
                        node.classList.add('active');
                    } else if (node === vm.$) {
                        break;
                    }
                }

            }).define("selectedOptions", function () {
                return this.data[this.selectedIndexGetter ? this.selectedIndexGetter() : this.selectedIndex];
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
            } else if (this.independent) {
                this.$$.on('click', '[data-toggle="dropdown"]', function () {
                    vm.toggle();
                });
            }

            this.$.on('click', "a", function () {

                var bit = this.getAttribute("data-bit");

                if (bit == null) return false;

                if (vm.selectedIndexSetter) {
                    vm.selectedIndexSetter(bit >>> 0);
                } else {
                    vm.selectedIndex = bit >>> 0;
                }
            });
        }
    });

    v2.subscribe(document, 'click', function (e) {
        var elem = e.target || e.srcElement;

        if (v2.match(elem, '[data-toggle="dropdown"]'))
            return false;

        v2.GDir('dropdown').when(function (vm) {
            return vm.visible;
        }).done(function (vm) {
            vm.hide();
        }).destroy();
    });

    return function (options) {
        return v2('dropdown', options);
    };
}));