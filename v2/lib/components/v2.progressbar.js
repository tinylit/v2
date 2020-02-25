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

    v2.use('progressbar', {
        progressbar: function () {
            /** 风格 */
            this.style = "default";
            /** 分割线 */
            this.striped = true;
            /** 活动的 */
            this.active = false;
        },
        build: function () {
            this.$bar = this.$.appendChild('.progress-bar'.htmlCoding().html());
        },
        render: function () {
            this.$.classList.add('progress');
        },
        usb: function () {
            this.base.usb();

            this.define('style', function (style, oldStyle) {
                this.$bar.classList.remove('progress-bar-' + oldStyle);
                this.$bar.classList.add('progress-bar-' + style);
            });

            this.define('striped', function (striped) {
                this.$bar.classList.toggle('progress-bar-striped', striped);
            });

            this.define('active', function (active) {
                this.$bar.classList.toggle('active', active);
            });

            this.define('data', function (data, oldData) {
                this.load(data);
            }, true);
        },
        load: function (data) {
            if (data < 0)
                return;

            data = Math.min(data, 100);

            this.$bar.empty();
            this.$bar.styleCb('width', data + '%');
            this.$bar.appendChild(document.createTextNode(data + '%'));
        }
    });

    return function (options) {
        return v2('progressbar', options);
    };
}));