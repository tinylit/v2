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
}(function (/** @type CN.V2kitStatic */v2) {
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
        show: function () {
            var direction = this.direction.toLowerCase();
            var x, y, vm = this,
                elem = this.request || this.host && this.host.$ || document.body,
                xy = elem.getBoundingClientRect(),
                top = xy.top - docEl.clientTop + docEl.scrollTop,//document.documentElement.clientTop 在IE67中始终为2，其他高级点的浏览器为0
                bottom = xy.bottom,
                left = xy.left - docEl.clientLeft + docEl.scrollLeft,//document.documentElement.clientLeft 在IE67中始终为2，其他高级点的浏览器为0
                right = xy.right,
                width = xy.width || (right - left), //IE67不存在width 使用right - left获得
                height = xy.height || (bottom - top);

            this.$.classList.add(direction.indexOf('bottom') > -1 ? 'bottom' : direction.indexOf('top') > -1 ? 'top' : direction, 'in');

            var offsetWidth = this.$.offsetWidth,
                offsetHeight = this.$.offsetHeight;

            if (direction === 'auto') {
                x = (this.fixed ? doc.scrollLeft || docEl.scrollLeft : 0) + docEl.clientWidth;
                y = (this.fixed ? doc.scrollTop || docEl.scrollTop : 0) + docEl.clientHeight;

                this.$.classList.remove(direction);

                if ((bottom + offsetHeight + 10) < y) {
                    direction = 'bottom';
                } else if (y > (top - offsetHeight - 10)) {
                    direction = 'top';
                } else if ((left - offsetWidth - 10) > x) {
                    direction = 'left';
                } else {
                    direction = "right";
                }

                this.$.classList.add(direction.indexOf('bottom') > -1 ? 'bottom' : direction.indexOf('top') > -1 ? 'top' : direction);

                offsetWidth = this.$.offsetWidth;
                offsetHeight = this.$.offsetHeight
            }

            if (this.duration > 0) {
                setTimeout(function () {
                    vm.hide();
                }, this.duration);
            }

            switch (direction) {
                case 'top':
                    return this.$.styleCb({
                        left: left + (width - offsetWidth) / 2,
                        top: top - offsetHeight
                    });
                case 'top-left':
                    return this.$.styleCb({
                        left: left,
                        top: top - offsetHeight
                    });
                case 'top-right':
                    return this.$.styleCb({
                        left: right,
                        top: top - offsetHeight
                    });
                case 'right':

                    var result = this.$.styleCb({
                        left: right,
                        top: top + (height - offsetHeight) / 2
                    });

                    if (this.$.offsetHeight > offsetHeight) {
                        return this.$.styleCb({
                            left: right,
                            top: top + (height - this.$.offsetHeight) / 2
                        });
                    }

                    return result;

                case 'bottom':
                    return this.$.styleCb({
                        left: left + (width - offsetWidth) / 2,
                        top: bottom
                    });
                case 'bottom-right':
                    return this.$.styleCb({
                        left: right,
                        top: bottom
                    });
                case 'left':
                    return this.$.styleCb({
                        left: left - offsetWidth,
                        top: top + (height - offsetHeight) / 2
                    });
                case 'bottom-left':
                default:
                    return this.$.styleCb({
                        left: left,
                        top: bottom
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