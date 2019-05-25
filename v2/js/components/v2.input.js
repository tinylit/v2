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
        if (pattern[0] != "^") pattern = "^" + pattern;
        if (pattern[pattern.length - 1] != "$") pattern += "$";
        try {
            return new RegExp(pattern);
        } catch (_) {
            return /.*/;
        }
    });
    function inputValidity(control) {
        var pattern;
        function ValidityState() {
            this.valid = true;//是否有效
            this.badInput = false;//无效内容
            this.patternMismatch = false;//正则表达式验证失败
            this.rangeOverflow = false;//输入值超过max的限定
            this.rangeUnderflow = false;//输入值小于min的限定
            this.tooLong = false;//输入的字符数超过maxlength
            this.tooShort = false;//输入的字符数小于minlength
            this.typeMismatch = false;//输入值不符合email、url的验证
            this.valueMissing = false;//未输入值，违反了required要求
            this.customError = false;//是否存在自定义错误
        }
        ValidityState.prototype = {
            isValid: function (value) {
                var type = control.type;
                value = value == null ? control.value : value;
                if (value) {
                    if (type === "number") {
                        this.rangeOverflow = ~~value > control.max;
                        this.rangeUnderflow = ~~value < control.min;
                    }
                    if (type in matchExpr) {
                        this.badInput = this.typeMismatch = !matchExpr[type].test(value);
                    }
                    this.tooLong = value.length > control.maxlength;
                    this.tooShort = value.length < control.minlength;
                    if ((pattern = control.pattern) && (pattern = patternCache(pattern))) {
                        this.patternMismatch = !pattern.test(value);
                    }
                }
                this.valueMissing = control.required && !value;
                return this.valid = !(this.valueMissing || this.typeMismatch || this.badInput || this.patternMismatch || this.rangeOverflow || this.rangeUnderflow || this.tooLong || this.tooShort);
            }
        };
        return new ValidityState();
    };
    function inputValidityError(control) {
        var timer, validity = control.validity;
        function ValidityStateError() { }
        ValidityStateError.prototype = {
            validError: function () {
                if (validity.customError) {
                    return control.ValidityError;
                }
                if (validity.valueMissing) {
                    return control.title ? "请填写“" + control.title + "”字段。" : "请填写此字段。";
                }
                if (validity.patternMismatch) {
                    return "请与所请求的格式保持一致。";
                }
                if (validity.badInput) {
                    if (control.type === "number") {
                        return "请输入一个数字。";
                    }
                    if (control.type === "tel") {
                        return "请输入一个电话号码。";
                    }
                }
                if (control.type === "number") {
                    if (validity.rangeUnderflow) {
                        return "值必须大于或等于{0}。".format(control.min);
                    }
                    if (validity.rangeOverflow) {
                        return "值必须小于或等于{0}。".format(control.max);
                    }
                }
                var value = control.value;
                if (validity.typeMismatch) {
                    if (control.type === "email") {
                        var index = value.indexOf("@");
                        return (index > -1 ? "请在“@”内容" + (index > 0 ? "后面" : "前面") + "输入内容。{0}内容不完整。" : "请在邮箱地址中包含“@”。{0}缺少“@”。").format(value);
                    }
                }
                if (validity.tooShort) {
                    return "值必须大于或等于{0}个字符。".format(control.minlength);
                }
                if (validity.tooLong) {
                    return "值必须小于或等于{0}个字符。".format(control.maxlength);
                }
            },
            reportValidity: function () {
                if (control.checkValidity()) return true;
                var massage = this.validError();
                if (!this.isReady) {
                    var node = control.prepend('<div class="input-validity"><div class="validity-status">!</div><span class="validity-massage"></span></div>').first();
                    v2.on(document, function (e) {
                        var elem = e.target || e.srcElement;
                        if (v2.contains(control.$, elem) && v2.nodeName(elem, 'input')) {
                            v2.addClass(node, 'hidden');
                        }
                    });
                    this.isReady = true;
                    this.$ = node;
                }
                //this.$.find(".validity-massage").text(massage);
                //this.$.removeClass("hidden");
                //if (timer) clearTimeout(timer);
                //timer = setTimeout(function () {
                //    vm.$.addClass("hidden");
                //    timer = null;
                //}, 3000);
                return false;
            }
        };
        return new ValidityStateError();
    }

    v2.use('input', {
        components: {
            datePicker: function (resolve) {
                return require(['components/v2.datePicker'], resolve);
            }
        },
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
            /** 多行（textarea|input） */
            this.multiple = false;

            /** 缓存记录 */
            this.autocomplete = true;
            /*选中状态*/
            this.checked = false;//[redio|checkbox]

            /** 标题 */
            this.title = '';
            /** 内容（仅checkbox和radio） */
            this.text = '';
            /** 名称 */
            this.name = "";
            /** 按钮类型 */
            this.type = "text";//[text|number|tel|email|url|search|date|datetime|time|redio|checkbox]
            /** 按钮名称 */
            this.value = "";
            /** 超小输入框 */
            this.xs = false;
            /** 小输入框 */
            this.sm = false;
            /** 大输入框 */
            this.lg = false;
            /** 默认提示 */
            this.placeholder = '';
            /** 验证实体 */
            this.validity = null;
            /** 验证错误 */
            this.validityError = null;
        },
        init: function () {
            this.base.init(this.type === 'radio' || this.type === 'checkbox' ? 'label' : this.multiple ? 'textarea' : 'input');
        },
        checkValidity: function () {
            return this.validitySurpport ? this.$core.checkValidity() : this.validity.isValid();
        },
        reportValidity: function () {
            if (this.reportSurpport) {
                return this.$core.reportValidity();
            }
            this.validityError = this.validityError || inputValidityError(this);
            return this.validityError.reportValidity();
        },
        setCustomValidity: function (massage) {
            if (this.validitySurpport) {
                this.$core.setCustomValidity(message);
            } else if (this.validity.customError = !!massage && v2.isString(massage)) {
                this.ValidityError = massage;
            }
        },
        render: function (variable) {
            this.base.render();
            switch (this.type) {
                case 'button':
                case 'reset':
                case 'submit':
                    this.addClass('btn');
                    switch (this.type) {
                        case 'submit':
                            this.addClass('btn-primary');
                            break;
                        case 'reset':
                            this.addClass('btn-warning');
                            break;
                        default:
                            if (!variable.addClass) {
                                this.addClass('btn-default');
                            }
                            break;
                    }
                    if (this.lg || this.sm || this.xs) {
                        this.addClass(this.lg ? 'btn-lg' : this.sm ? 'btn-sm' : 'btn-xs');
                    }
                    break;
                case 'radio':
                case 'checkbox':
                    this.addClass(this.type);
                    this.$massage = this.append(v2.htmlSerialize('input[type="{type}"]+span'.withCb(this))).last();
                    this.$core = this.$massage.previousSibling;
                    break;
                default:
                    this.addClass('form-control');
                    if (this.lg || this.sm || this.xs) {
                        this.addClass(this.lg ? 'input-lg' : this.sm ? 'input-sm' : 'input-xs');
                    }
                    break;
            }

            var node = this.$core || this.$;

            var validity = node.validity;

            this.validitySurpport = !!validity;
            this.reportSurpport = v2.isFunction(node.reportValidity);

            this.validity = validity || this.validity || inputValidity(this);

            this.$core = node;
        },
        usb: function () {
            this.base.usb();
            this.define('name pattern min max minlength maxlength placeholder validationMessage')
                .define('type', true)
                .define({
                    value: function (value) {
                        if (this.checkValidity()) {
                            this.invoke('input-change', value);
                        }
                    },
                    required: function (value) {
                        this.toggleClass('required', !!value);
                    },
                    readonly: function (value) {
                        this.toggleClass('readonly', !!value);
                    },
                    disabled: function (value) {
                        this.toggleClass('disabled', !!value);
                    }
                }).define('autocomplete', {
                    get: function () {
                        var autocomplete = this.$core.autocomplete;
                        return !autocomplete || autocomplete.toLowerCase() === 'on';
                    },
                    set: function (value) {
                        this.$core.autocomplete = value ? 'on' : 'off';
                    }
                });
            if (this.type === 'radio' || this.type === 'checkbox') {
                this.define('checked', function (checked) {
                    if (checked && this.type === 'radio') {
                        var radioGroup = radioCache(this.name);
                        radioGroup.checked(this);
                    }
                    this.toggleClass('checked', checked = !!checked);
                    this.invoke('checked-change', checked);
                }).define('text', function (text) {
                    this.emptyAt(this.$massage)
                        .appendAt(this.$massage, document.createTextNode(text));
                }, true);
            }
        },
        resolve: function () {
            if (this.type === 'date' || this.type === 'time' || this.type === 'datetime' || this.type === 'datetime-local') {
                this.$sharp = this.constructor('date-picker', {
                    visible: false,
                    touch: this,
                    $$: document.body,
                    min: this.invoke("date-min"),
                    max: this.invoke("date-max"),
                    format: this.type === 'date' ? 'yyyy-MM-dd' : this.type === 'time' ? 'HH:mm' : this.type === 'datetime' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd HH:mm'
                });
            }
        },
        commit: function () {
            this.base.commit();
            if (this.type === 'radio' || this.type === 'checkbox') {
                if (this.type === 'radio' && this.name) {
                    var radioGroup = radioCache(this.name);
                    radioGroup.add(this);
                }
                return this.on('$click', function () {
                    if (this.type === 'checkbox') {
                        this.checked = !this.checked;
                    } else {
                        this.checked = true;
                    }
                    return false;
                });
            }

            var isChinese,
                vm = this,
                value = vm.value,
                fixCallbackChange = function () {
                    if (isChinese || value === this.value) return;
                    if (this.checkValidity()) {
                        return vm.invoke('input-change', value = this.value);
                    }
                    return value = this.value;
                };
            this.on("compositionstart", function () {
                isChinese = true;
            }).on("compositionend", function () {
                isChinese = false;
            });
            this.on("input propertychange", fixCallbackChange)
                .on("keyup", function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 13 || code === 108) {
                        vm.invoke("keyboard-enter");
                    }
                    fixCallbackChange.call(this);
                });
        }
    });
    return function (options) {
        return v2('input', options);
    };
}));