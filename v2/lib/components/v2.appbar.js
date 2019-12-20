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
        more = 'a.dropdown-toggle[href=#]{更多选项}>b.caret'.htmlCoding();

    v2.use("appbar", {
        appbar: function () {
            /** 类型 */
            this.type = "default";//"default" | "tab" | "thumbtack";

            /** 选中项 */
            this.selectedIndex = -1;

            /** 堆放 */
            this.stacked = false;
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
                        if (view) {
                            htmls.push(divider);
                        }
                        break;
                    case "object":
                        if (view.dropdown) {

                            if (view.right) {
                                htmls.push('<li class="dropdown pull-right">');
                            } else {
                                htmls.push('<li class="dropdown">');
                            }

                            htmls.push(view.text ? 'a.dropdown-toggle[href=#]{{0}}>b.caret'.format(view.text).htmlCoding() : more);

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

                        htmls.push('<a href="{0}" data-bit={2}>{1}</a>'.format(view.href || "#", view.text, data.length));

                        htmls.push('</li>');

                        data.push(view);

                        break;
                    case "array":
                        htmls.push('<li class="dropdown">', more, '<ul class="dropdown-menu">');
                        v2.each(view, done);
                        htmls.push('</ul></li>');
                        break;
                }
            });

            this.data = data;

            this.$.empty()
                .appendChild(htmls.join('').html());

            this.dropdowns = this.when('.dropdown');
        },
        render: function () {
            var clazz;

            this.$.classList.add("nav");

            switch (this.type) {
                case 'tab':
                    clazz = "nav-tabs";
                    break;
                case 'thumbtack':
                    clazz = "nav-pills";
                    break;
            }

            if (clazz) {
                this.$.classList.add(clazz);
            }

            if (this.stacked) {
                this.$.classList.add('nav-stacked');
            }
        },
        usb: function () {
            this.base.usb();

            var vm = this, then = this.when('li');

            this.define('selectedIndex', function (index) {

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

                this.invoke('select-changed', index);

            }).define("selectedOptions", function () {
                return this.data[v2.usb(this, "selectedIndex")];
            });
        },
        commit: function () {
            var vm = this;

            this.$.on('click', '.dropdown-toggle', function () {
                this.parentNode.classList.toggle('open');
            });

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

    v2.subscribe(document, 'click', function (e) {
        var elem = e.target || e.srcElement;

        if (elem.classList.contains('dropdown-toggle'))
            return false;

        v2.GDir('appbar').when(function (vm) {
            return vm.visible;
        }).done(function (vm) {
            vm.dropdowns.done(function (li) {
                li.classList.remove('open');
            });
        }).destroy();
    });

    return function (options) {
        return v2('appbar', options);
    };
}));