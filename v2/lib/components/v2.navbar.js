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

    v2.use('navbar', {
        navbar: function () {
            /** 品牌 */
            this.brand = "代码艺术";
            /** 颜色反转 */
            this.inverse = false;
            /** 类型 */
            this.type = "default";//[default|top|fixed-top|fixed-bottom]
        },
        build: function (view) {
            this.$inner = this.$.appendChild('.navbar-inner>.container-fluid');

            v2.each(view, function (option) {
                option.tag = option.tag || "appbar";
                this.base.build(option);
            }, this);
        }
    });

    return function (options) {
        return v2('navbar', options);
    };
}));