(function (factory) {
    return typeof define === 'function' ?
        define(['v2'], factory) :
        typeof module === 'object' && module.exports ?
            module.exports = function (root, v2kit) {
                if (typeof v2kit === 'undefined') {
                    if (typeof window === 'undefined') {
                        v2kit = require('v2')(root);
                    }
                    else {
                        v2kit = require('v2');
                    }
                }
                return factory(v2kit);
            } :
            factory(v2kit);
}(function (v2) {

    var matchExpr = {
        number: /^[+-]?(0|[1-9][0-9]*)(?:\.([0-9]+))?$/,
        tel: /^(0[0-9]{2,3}-?)?(\+86\s+)?((1[3-9][0-9]{3}|[2-9])[0-9]{6,7})+(-[0-9]{1,4})?$/,
        email: /^\w[-\w.+]* @([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
        url: /^(([a-z]+:\/\/)|~?\/|\.?\.\/)/i
    };

    var patternCache = v2.makeCache(function (pattern) {
        try {
            return new RegExp(pattern);
        } catch (_) { }
    });

    function ValidityState() {
        /** 该元素的自定义有效性消息已经通过调用元素的setCustomValidity() 方法设置成为一个非空字符串. */
        this.customError = false;

        /** 该元素的值与指定的pattern属性不匹配. */
        this.patternMismatch = false;

        /** 该元素的值大于指定的 max属性. */
        this.rangeOverflow = false;

        /** 该元素的值小于指定的 min属性. */
        this.rangeUnderflow = false;

        /** 该元素的值不符合由step属性指定的规则. */
        this.stepMismatch = false;

        /** 该元素的值的长度超过了HTMLInputElement 或者 HTMLTextAreaElement 对象指定的maxlength属性中的值. */
        this.tooLong = false;

        /** 该元素的值不符合元素类型所要求的格式(当type 是 email 或者 url时). */
        this.typeMismatch = false;

        /** 其他的约束验证条件都不为true. */
        this.valid = false;

        /** 该元素有 required 属性,但却没有值. */
        this.valueMissing = false;
    }

    function usb() {
        var validity, validationMessage;

        this.base.usb();

        this.define('name multiple pattern min max minlength maxlength required readonly placeholder');

        this.define('autocomplete', {
            get: function () {
                return this.$main.autocomplete.toLowerCase() === 'on';
            },
            set: function (value) {
                this.$main.autocomplete = value ? 'on' : 'off';
            }
        });

        this.define('value', function (value) {
            if (this.checkValidity()) {
                this.invoke('input-change', value);
            }
        });

        if (this.$main.validity == null) {

            validationMessage = "";
            validity = new ValidityState();

            this.define({
                validity: function () {
                    var type = this.type,
                        value = this.value;
                    if (value) {
                        if (type === "number") {
                            validity.rangeOverflow = ~~value > this.max;
                            validity.rangeUnderflow = ~~value < this.min;
                        }
                        if (type in matchExpr) {
                            validity.badInput = validity.typeMismatch = !matchExpr[type].test(value);
                        }
                        validity.tooLong = value.length > validity.maxlength;
                        validity.tooShort = value.length < validity.minlength;
                        if ((pattern = this.pattern) && (pattern = patternCache(pattern))) {

                            validity.patternMismatch = true;

                            if ((pattern = pattern.exec(value))) {
                                validity.patternMismatch = pattern.length < value.length;
                            }
                        }
                    }
                    validity.valueMissing = validity.required && !value;
                    validity.valid = !(validity.valueMissing || validity.typeMismatch || validity.badInput || validity.patternMismatch || validity.rangeOverflow || validity.rangeUnderflow || validity.tooLong || validity.tooShort);
                    return validity;
                },
                validationMessage: function () {
                    var type;
                    if (validationMessage)
                        return validationMessage;
                    if (validity.valueMissing) {
                        return this.title ? "请填写“" + this.title + "”字段。" : "请填写此字段。";
                    }
                    if (validity.patternMismatch) {
                        return "请与所请求的格式保持一致。";
                    }

                    type = this.type;

                    if (validity.badInput) {
                        if (type === "number") {
                            return "请输入一个数字。";
                        }
                        if (type === "tel") {
                            return "请输入一个电话号码。";
                        }
                    }
                    if (type === "number") {
                        if (validity.rangeUnderflow) {
                            return "值必须大于或等于{0}。".format(control.min);
                        }
                        if (validity.rangeOverflow) {
                            return "值必须小于或等于{0}。".format(control.max);
                        }
                    }

                    if (validity.typeMismatch) {
                        if (type === "email") {
                            var value = this.value,
                                index = value.indexOf("@");
                            return (index > -1 ? "请在“@”内容" + (index > 0 ? "后面" : "前面") + "输入内容。{0}内容不完整。" : "请在邮箱地址中包含“@”。{0}缺少“@”。").format(value);
                        }
                    }
                    if (validity.tooShort) {
                        return "值必须大于或等于{0}个字符。".format(this.minlength);
                    }
                    if (validity.tooLong) {
                        return "值必须小于或等于{0}个字符。".format(this.maxlength);
                    }
                }
            });

            /** 为元素设置自定义有效性消息。如果此消息不是空字符串，则元素将遭受自定义有效性错误，并且不验证。 */
            this.setCustomValidity = function (message) {
                validationMessage = message;
            };
            /** 返回一个布尔值，如果该元素是约束验证的候选项，且不满足其约束，则该布尔值为false。在本例中，它还在元素上触发一个无效事件。如果元素不是约束验证的候选项，或者满足其约束，则返回true。 */
            this.checkValidity = function () {
                return this.validity.valid;
            };
        } else {
            this.define({
                validity: function () {
                    return this.$main.validity;
                },
                validationMessage: function () {
                    return this.$main.validationMessage;
                }
            });
            /** 为元素设置自定义有效性消息。如果此消息不是空字符串，则元素将遭受自定义有效性错误，并且不验证。 */
            this.setCustomValidity = function (message) {
                this.$main.setCustomValidity(message);
            };
            /** 返回一个布尔值，如果该元素是约束验证的候选项，且不满足其约束，则该布尔值为false。在本例中，它还在元素上触发一个无效事件。如果元素不是约束验证的候选项，或者满足其约束，则返回true。 */
            this.checkValidity = function () {
                return this.$main.checkValidity();
            };
        }

        if (v2.isFunction(this.$main.reportValidity)) {
            this.reportValidity = function () {
                return this.$main.reportValidity();
            };
        } else {
            this.reportValidity = function () {
                if (this.checkValidity())
                    return true;
                this.focus();
                return false;
            };
        }
    }

    /** 所有类型 */
    v2.use('input', {
        input: function () {
            /** 最小值 */
            this.min = -Infinity;
            /** 最大值 */
            this.max = Infinity;
            /** 最小长度 */
            this.minlength = -Infinity;
            /** 最大长度 */
            this.maxlength = Infinity;
            /** 是否必填 */
            this.required = false;
            /** 只读 */
            this.readonly = false;
            /** 正则验证 */
            this.pattern = '';
            /** 禁用 */
            this.disabled = false;
            /** 返回/设置元素的自动完成属性，指示控件的值是否可以由浏览器自动完成。如果类型属性的值隐藏、复选框、单选、文件或按钮类型(按钮、提交、重置、图像)，则忽略该属性。可能的值是:“打开”:浏览器可以使用先前存储的值自动完成该值 */
            this.autocomplete = true;

            /** 返回/设置元素的autofocus属性，该属性指定窗体控件在加载页面时应该具有输入焦点，除非用户覆盖它，例如输入另一个控件。文档中只有一个表单元素可以具有autofocus属性。如果type属性被设置为hidden(也就是说，您不能自动将焦点设置为隐藏控件)，则无法应用该属性。 */
            this.autofocus = false;

            /** 返回/设置元素的多个属性，指示是否可能有多个值(例如，多个文件)。 */
            this.multiple = false;

            /** 名称 */
            this.name = "";
            /** 按钮类型 */
            this.type = "text";//[text|number|tel|email|url|search|date|datetime|time|redio|checkbox]
            /** 按钮名称 */
            this.value = "";
            /** 默认提示 */
            this.placeholder = '';

            /** 超小输入框 */
            this.xs = false;
            /** 小输入框 */
            this.sm = false;
            /** 大输入框 */
            this.lg = false;

            /** 指示元素是否为约束验证的候选项。如果有条件阻止约束验证，则为false。 */
            this.willValidate = "";

            /** 返回一个本地化消息，该消息描述控件不满足的验证约束(如果有的话)。如果控件不是约束验证的候选项(willvalidate为false)，或者它满足约束，则该字符串为空。 */
            this.validationMessage = "";
        },
        pending: function () {
            this.defaultValue = this.value;
        },
        init: function () {
            this.base.init('input');
        },
        render: function () {
            this.$.classList.add('form-control');
            if (this.lg || this.sm || this.xs) {
                this.$.classList.add(this.lg ? 'input-lg' : this.sm ? 'input-sm' : 'input-xs');
            }

            if (this.autofocus) {
                this.focus();
            }
        },
        usb: function () {
            usb.call(this);

            this.define('type');
        }
    });

    v2.use('input', 'type === "checkbox" || type === "radio"', {
        input: function () {

            /** 对选项描述 */
            this.text = "";

            /*选中状态*/
            this.checked = false;//[redio|checkbox]
        },
        pending: function () {
            this.defaultValue = this.value;
            this.defaultChecked = this.checked;
        },
        init: function () {
            this.base.init('label');
        },
        load: function () {

            this.$.appendChild(('input+span')
                .htmlCoding()
                .html());

            this.$core = this.$.firstElementChild;
            this.$txt = this.$.lastElementChild;
        },
        usb: function () {

            usb.call(this);

            this.define('checked', function (checked) {
                this.$.classList.toggle('checked', checked = !!checked);
                this.invoke('checked-change', checked);
            });

            this.define('text', function (text) {
                this.$txt.empty()
                    .append(text);
            });

            this.define('type', function (type) {
                this.$core.setAttribute('type', type);

                this.$.classList.remove('checkbox', 'redio');
                this.$.classList.add(type);
            });
        },
        commit: function () {
            var vm = this;

            this.base.commit();

            this.$.on('click', function () {
                vm.checked = vm.$core.checked;
            });
        }
    });


    return function (option) {
        return v2('input', option);
    }
}));