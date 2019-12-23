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

    v2.use('tabbar', {
        tabbar: function () {
            /** 选项卡位于内容的指定方位 */
            this.direction = "top";//[top|right|bottom|left]

            /** 选中项 */
            this.selectedIndex = 0;
        },
        components: {
            nav: function (resovle) {
                require(['components/v2.nav'], resovle);
            }
        },
        render: function () {
            this.$.classList.add('tabbar');
        },
        build: function (view) {
            if (view === undefined || view === null)
                return;

            var vm = this;

            this.$bar = this.$.appendChild(document.createElement('ul'));

            this.$content = this.$.appendChild('.tab-content'.htmlCoding().html());

            this.$clearfix = this.$.appendChild('.clearfix'.htmlCoding().html());

            this.viewports = v2.when();

            v2.each(view, function (option, index) {
                var content = option.content,
                    node = vm.$content.appendChild('.tab-pane[data-content="{0}"]'.format(index).htmlCoding().html()),
                    viewport = {
                        viewport: node
                    };

                if (content.nodeType) {
                    node.appendChild(content);
                } else if (v2.isString(content)) {
                    node.appendChild(content.html());
                } else if ('tag' in content) {
                    content.$$ = node;
                    viewport.build = function () {
                        vm.create(content.tag, content);
                    };
                } else {
                    v2.log(content, 15);
                }

                vm.viewports.add(viewport);
            });

            this.nav = this.create('nav', {
                $$: this.$,
                $: this.$bar,
                type: "tab",
                view: view,
                methods: {
                    "select-changed": function (index) {
                        v2.usb(vm, 'selectedIndex', index);
                    }
                }
            });
        },
        usb: function () {
            this.base.usb();

            this.define('direction', function (direction, oldDirection) {

                if (direction === 'bottom') {
                    this.$.insertBefore(this.$content, this.$.firstChild);
                } else {
                    this.$.insertBefore(this.$content, this.$clearfix);
                }

                switch (oldDirection) {

                    case 'bottom':
                        this.$.classList.remove('tabs-below');
                        break;
                    case 'left':
                        this.$.classList.remove('tabs-left');
                        break;
                    case 'right':
                        this.$.classList.remove('tabs-right');
                }

                switch (direction) {
                    case 'bottom':
                        this.$.classList.add('tabs-below');
                        break;
                    case 'left':
                        this.$.classList.add('tabs-left');
                        break;
                    case 'right':
                        this.$.classList.add('tabs-right');
                }
            });

            this.define('selectedIndex', function (index) {

                v2.usb(this.nav, 'selectedIndex', index);

                this.viewports.done(function (viewport, i) {
                    if (index === i) {

                        viewport.viewport.classList.add('active');

                        if (viewport.build) {

                            viewport.build();

                            viewport.build = undefined;
                        }

                    } else {
                        viewport.viewport.classList.remove('active');
                    }
                });

                this.invoke('select-changed', index);

            }).define("selectedOptions", function () {
                return v2.usb(this.nav, "selectedOptions");
            });
        }
    });

    return function (options) {
        return v2('tabbar', options);
    };
}));