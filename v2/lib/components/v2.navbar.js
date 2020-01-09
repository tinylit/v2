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
    var NAV_GUID = 0;

    v2.use('navbar', {
        navbar: function () {
            /** 品牌 */
            this.brand = "代码艺术";
            /** 颜色反转 */
            this.inverse = false;
            /** 类型 */
            this.type = "default";//[default|top|fixed-top|fixed-bottom]
        },
        components: {
            nav: function (resovle) {
                require(['components/v2.nav'], resovle);
            },
            form: function (resovle) {
                require(['components/v2.form'], resovle);
            }
        },
        build: function (view) {

            var vm = this, navSharp = "nav_component_" + (++NAV_GUID);

            this.$inner = this.$.appendChild('.container-fluid>.navbar-header>button.navbar-toggle[data-toggle="collapse"][data-target="#{0}"]>span.icon-bar+span.icon-bar+span.icon-bar'
                .format(navSharp)
                .htmlCoding()
                .html());

            this.$header = this.$inner.firstChild;

            this.$brand = this.$header.appendChild('a.navbar-brand[href="#"]'.htmlCoding().html());

            this.$nav = this.$inner.appendChild('#{0}.navbar-collapse.navbar-responsive-collapse.collapse'
                .format(navSharp)
                .htmlCoding()
                .html());

            v2.each(view, function (option) {
                option.tag = option.tag || "nav";
                option.$$ = this.$nav;
                option.methods = {
                    "select-changed": function () {
                        var that = this;
                        vm.controls.when(function (item) {
                            if (item === that) {
                                return false;
                            }
                            return item.like('nav');
                        }).done(function (item) {
                            item.selectedIndex = -1;
                        });
                    }
                };
                this.base.build(option);
            }, this);
        },
        render: function () {
            this.$.classList.add('navbar', 'navbar-default');
        },
        usb: function () {
            this.base.usb();

            this.define('brand', function (text) {
                this.$brand.empty()
                    .appendChild(document.createTextNode(text));
            });

            this.define('inverse', function (value) {
                this.$.classList.toggle('navbar-inverse', value);
            });

            this.define('type', function (value, oldValue) {
                switch (oldValue) {
                    case 'top':
                        this.$.classList.remove('navbar-static-top');
                        break;
                    case 'fixed-top':
                        this.$.classList.remove('navbar-fixed-top');
                        break;
                    case 'fixed-bottom':
                        this.$.classList.remove('navbar-fixed-bottom');
                        break;
                }
                switch (value) {
                    case 'top':
                        this.$.classList.add('navbar-static-top');
                        break;
                    case 'fixed-top':
                        this.$.classList.add('navbar-fixed-top');
                        break;
                    case 'fixed-bottom':
                        this.$.classList.add('navbar-fixed-bottom');
                        break;
                }
            });
        }
    });

    return function (options) {
        return v2('navbar', options);
    };
}));