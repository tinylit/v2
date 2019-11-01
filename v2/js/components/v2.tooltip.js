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
            factory(v2kit);
}(function (v2) {
    var
        doc = document,
        docEl = doc.documentElement;

    v2.use('tooltip', {
        tooltip: function () {
            // 内容
            this.content = '';

            // 持续时间
            this.duration = 0; // 持续多久后自动关闭，大于零时有效。（单位：毫秒）

            // 方位
            this.direction = 'auto';//[auto|top-left|top|top-right|right|bottom-left|bottom|bottom-right|left]
        },
        design: function () {
            this.defaultVisible = false;
        },
        render: function () {
            this.$.classList.add('tooltip', 'fade');

            this.$viewport = v2.isString(this.viewport) ? document.querySelector(this.viewport) : this.viewport;
        },
        build: function () {
            this.$.appendChild('.tooltip-arrow+.tooltip-inner'.htmlCoding().html());

            this.$inner = this.take('.tooltip-inner');
        },
        usb: function () {
            this.base.usb();
            this.define('content', function (html) {
                this.$inner.empty()
                    .appendChild(html.html());
            });

            var direction = this.direction.toLowerCase();
            this.define('direction', function (_) {

                this.$.classList.remove(direction);

                if (this.visible) {
                    this.show();
                }
            }, true);
        },
        scroll: function (a) {
            return a = a ? "scrollLeft" : "scrollTop",
                doc.body[a] | docEl[a];
        },
        area: function (a) {
            return docEl[a ? "clientWidth" : "clientHeight"];
        },
        show: function () {
            var direction = this.direction.toLowerCase();
            var vm = this,
                elem = this.request || this.host && this.host.$ || document.body,
                xy = {
                    top: elem.offsetTop,
                    right: elem.offsetLeft + elem.offsetWidth,
                    bottom: elem.offsetTop + elem.offsetHeight,
                    left: elem.offsetLeft,
                    width: elem.offsetWidth,
                    height: elem.offsetHeight
                };


            this.$.classList.add(direction.indexOf('bottom') > -1 ? 'bottom' : direction.indexOf('top') > -1 ? 'top' : direction, 'in');

            var width = this.$.offsetWidth,
                height = this.$.offsetHeight;

            if (direction === 'auto') {
                var x = (this.fixed ? this.scroll(1) : 0) + this.area(1),
                    y = (this.fixed ? this.scroll() : 0) + this.area();

                this.$.classList.remove(direction);

                if ((xy.bottom + height + 10) < y) {
                    direction = 'bottom-left';
                } else if (y > (xy.top - height - 10)) {
                    direction = 'top-left';
                } else if ((xy.left - width - 10) > x) {
                    direction = 'left';
                } else {
                    direction = "right";
                }

                this.$.classList.add(direction.indexOf('bottom') > -1 ? 'bottom' : direction.indexOf('top') > -1 ? 'top' : direction);

                width = this.$.offsetWidth;
                height = this.$.offsetHeight
            }

            if (this.duration > 0) {
                setTimeout(function () {
                    vm.hide();
                }, this.duration);
            }

            switch (direction) {
                case 'top':
                    return this.$.styleCb({
                        left: xy.left + (xy.width - width) / 2,
                        top: xy.top - height
                    });
                case 'top-left':
                    return this.$.styleCb({
                        left: xy.left,
                        top: xy.top - height
                    });
                case 'top-right':
                    return this.$.styleCb({
                        left: xy.right,
                        top: xy.top - height
                    });
                case 'right':

                    var result = this.$.styleCb({
                        left: xy.right,
                        top: xy.top + (xy.height - height) / 2
                    });

                    if (this.$.offsetHeight > height) {
                        return this.$.styleCb({
                            left: xy.right,
                            top: xy.top + (xy.height - this.$.offsetHeight) / 2
                        });
                    }

                    return result;

                case 'bottom':
                    return this.$.styleCb({
                        left: xy.left + (xy.width - width) / 2,
                        top: xy.bottom
                    });
                case 'bottom-right':
                    return this.$.styleCb({
                        left: xy.right,
                        top: xy.bottom
                    });
                case 'left':
                    return this.$.styleCb({
                        left: xy.left - width,
                        top: xy.top + (xy.height - height) / 2
                    });
                case 'bottom-left':
                default:
                    return this.$.styleCb({
                        left: xy.left,
                        top: xy.bottom
                    });
            }
        },
        hide: function () {
            this.$.classList.remove('in');
        }
    });

    return function (options) {
        return v2('tooltip', options);
    };
}));