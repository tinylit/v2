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
}(function (/** @type Use.V2 */v2) {

    var matchExpr = {
        number: /^[+-]?(0|[1-9][0-9]*)(?:\.([0-9]+))?$/,
        tel: /^(0[0-9]{2,3}-?)?(\+86\s+)?((1[3-9][0-9]{3}|[2-9])[0-9]{6,7})+(-[0-9]{1,4})?$/,
        email: /^\w[-\w.+]* @([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
        url: /^(([a-z]+:\/\/)|~?\/|\.?\.\/)/i
    };

    var patternCache = v2.makeCache(function (pattern) {
        try {
            return new RegExp(pattern);
        } catch (_) {
            return null;
        }
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

    function validity(/** @type Use.Input */vm) {
        var validity, validationMessage, core = vm.$core || vm['$' + vm.tag] || vm.$;

        vm.define('id name pattern min max minlength maxlength required readonly');

        if (core.validity === null || core.validity === undefined) {

            validationMessage = "";
            validity = new ValidityState();

            vm.define({
                validity: function () {
                    var type = v2.usb(this, "type"),
                        value = v2.usb(this, "value");

                    if (value) {
                        if (type === "number") {
                            validity.rangeOverflow = ~~value > v2.usb(this, "max");
                            validity.rangeUnderflow = ~~value < v2.usb(this, "min");
                        }
                        if (type in matchExpr) {
                            validity.badInput = validity.typeMismatch = !matchExpr[type].test(value);
                        }
                        validity.tooLong = value.length > v2.usb(this, "maxlength");
                        validity.tooShort = value.length < v2.usb(this, "minlength");
                        if ((pattern = v2.usb(this, "pattern")) && (pattern = patternCache(pattern))) {

                            validity.patternMismatch = true;

                            if ((pattern = pattern.exec(value)) && (pattern = pattern[0])) {
                                validity.patternMismatch = pattern.length < value.length;
                            }
                        }
                    }
                    validity.valueMissing = v2.usb(this, "required") && !value;
                    validity.valid = !(validity.valueMissing || validity.typeMismatch || validity.badInput || validity.patternMismatch || validity.rangeOverflow || validity.rangeUnderflow || validity.tooLong || validity.tooShort);
                    return validity;
                },
                validationMessage: function () {
                    var type, title;
                    if (validationMessage)
                        return validationMessage;
                    if (validity.valueMissing) {
                        return (title = v2.usb(this, "title")) ? "请填写“" + title + "”字段。" : "请填写此字段。";
                    }
                    if (validity.patternMismatch) {
                        return "请与所请求的格式保持一致。";
                    }

                    type = v2.usb(this, "type");

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
                            return "值必须大于或等于{0}。".format(v2.usb(this, "min"));
                        }
                        if (validity.rangeOverflow) {
                            return "值必须小于或等于{0}。".format(v2.usb(this, "max"));
                        }
                    }

                    if (validity.typeMismatch) {
                        if (type === "email") {
                            var value = v2.usb(this, "value"),
                                index = value.indexOf("@");
                            return (index > -1 ? "请在“@”内容" + (index > 0 ? "后面" : "前面") + "输入内容。{0}内容不完整。" : "请在邮箱地址中包含“@”。{0}缺少“@”。").format(value);
                        }
                    }
                    if (validity.tooShort) {
                        return "值必须大于或等于{0}个字符。".format(v2.usb(this, "minlength"));
                    }
                    if (validity.tooLong) {
                        return "值必须小于或等于{0}个字符。".format(v2.usb(this, "maxlength"));
                    }

                    return "";
                }
            });

            // 为元素设置自定义有效性消息。如果此消息不是空字符串，则元素将遭受自定义有效性错误，并且不验证。
            vm.setCustomValidity = function (message) {
                validationMessage = message;
            };
            // 返回一个布尔值，如果该元素是约束验证的候选项，且不满足其约束，则该布尔值为false。在本例中，它还在元素上触发一个无效事件。如果元素不是约束验证的候选项，或者满足其约束，则返回true。
            vm.checkValidity = function () {

                var validity = v2.usb(this, "validity");

                return validity.valid;
            };
        } else {
            vm.define({
                validity: function () {
                    return core.validity;
                },
                validationMessage: function () {
                    return core.validationMessage;
                }
            });
            // 为元素设置自定义有效性消息。如果此消息不是空字符串，则元素将遭受自定义有效性错误，并且不验证。
            vm.setCustomValidity = function (message) {
                core.setCustomValidity(message);
            };
            // 返回一个布尔值，如果该元素是约束验证的候选项，且不满足其约束，则该布尔值为false。在本例中，它还在元素上触发一个无效事件。如果元素不是约束验证的候选项，或者满足其约束，则返回true。
            vm.checkValidity = function () {
                return core.checkValidity();
            };
        }

        if (v2.isFunction(core.reportValidity)) {
            vm.reportValidity = function () {
                return core.reportValidity();
            };
        } else {
            var tooltip;
            vm.reportValidity = function () {
                if (this.checkValidity())
                    return true;

                this.focus();

                var message = v2.usb(this, "validationMessage");

                if (tooltip) {
                    v2.usb(tooltip, "content", message);
                    tooltip.show();
                } else {
                    tooltip = this.create('tooltip', {
                        $$: document.body,
                        request: core,
                        duration: 2000,
                        content: message
                    });
                }

                return false;
            };
        }
    }

    var supportHtml5 = true;

    var input = document.createElement('input');

    try {
        input.type = "datetime";
        input.type = "datetime-local";
    } catch (e) {
        supportHtml5 = false;
    }

    input = null;
    /** 所有类型 */
    v2.use('input', {
        components: {
            'tooltip': function (callback) {
                require(['components/v2.tooltip'], callback);
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
            /** 返回/设置元素的自动完成属性，指示控件的值是否可以由浏览器自动完成。如果类型属性的值隐藏、复选框、单选、文件或按钮类型(按钮、提交、重置、图像)，则忽略该属性。可能的值是:“打开”:浏览器可以使用先前存储的值自动完成该值 */
            this.autocomplete = true;

            /** 返回/设置元素的autofocus属性，该属性指定窗体控件在加载页面时应该具有输入焦点，除非用户覆盖它，例如输入另一个控件。文档中只有一个表单元素可以具有autofocus属性。如果type属性被设置为hidden(也就是说，您不能自动将焦点设置为隐藏控件)，则无法应用该属性。 */
            this.autofocus = false;

            /** 返回/设置元素的多个属性，指示是否可能有多个值(例如，多个文件)。 */
            this.multiple = false;

            /** ID */
            this.id = "";

            /** 名称 */
            this.name = "";

            /** 按钮类型 */
            this.type = "text";//[text|number|tel|email|url|search]

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
        },
        design: function () {
            this.defaultValue = this.value;
        },
        init: function (tag) {
            this.base.init(tag || 'input');
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
            var core = this.$core || this['$' + this.tag] || this.$;

            this.base.usb();

            if (this.tag === 'input') {
                this.define('type multiple placeholder');
            }

            this.define('autocomplete', {
                get: function () {
                    return core.autocomplete.toLowerCase() === 'on';
                },
                set: function (value) {
                    core.autocomplete = value ? 'on' : 'off';
                }
            });

            this.define('value', function (value) {
                if (this.checkValidity()) {
                    this.invoke('input-change', value);
                }
            });

            validity(this);
        },
        ready: function () {
            if (this.type === 'hidden') {
                this.hide();
            }
        },
        commit: function () {
            var core = this.$core || this['$' + this.tag] || this.$;
            var isChinese, vm = this;

            core.on("compositionstart", function () {
                isChinese = true;
            });

            core.on("compositionend", function () {
                isChinese = false;
            });

            core.on("input propertychange", function () {
                if (!isChinese) {
                    if (vm.valueSetter) {
                        vm.valueSetter(this.value);
                    } else {
                        vm.value = this.value;
                    }
                }
            });

            core.on("keyup", function (e) {
                var code = e.keyCode || e.which;
                if (code === 13 || code === 108) {
                    vm.invoke("keyboard-enter");
                }

                if (!isChinese) {
                    if (vm.valueSetter) {
                        vm.valueSetter(this.value);
                    } else {
                        vm.value = this.value;
                    }
                }
            });
        }
    });

    var GLOBAL_VARIABLE_CHECK_FOR = 0;

    v2.use('input', 'type === "checkbox" || type === "radio"', {
        components: {
            'tooltip': function (callback) {
                require(['components/v2.tooltip'], callback);
            }
        },
        input: function () {
            /** ID */
            this.id = "";

            /** 名称 */
            this.name = "";

            /** 对选项描述 */
            this.description = "";

            /** 按钮类型 */
            this.type = "redio";//[redio|checkbox]

            /** 按钮名称 */
            this.value = "";

            /** 同行显示 */
            this.inline = true;

            /** 选中状态 */
            this.checked = false;//[redio|checkbox]
        },
        design: function () {
            this.defaultValue = this.value;
            this.defaultChecked = this.checked;
        },
        init: function () {
            this.base.init();
        },
        build: function () {
            this.$.appendChild('label[for="__use_{0}"]>input#__use_{0}[type={1}]+span'
                .format(++GLOBAL_VARIABLE_CHECK_FOR, this.type)
                .htmlCoding()
                .html());

            this.$core = this.take('input');
            this.$txt = this.take('span');
        },
        render: function () {
            if (this.inline) {
                this.$.classList.add(this.type + '-inline');
            } else {
                this.$.classList.add(this.type);
            }

            if (this.autofocus) {
                this.focus();
            }
        },
        usb: function () {
            var core = this.$core || this['$' + this.tag] || this.$;

            this.base.usb();

            this.define('type placeholder');

            this.define('checked', function (checked) {
                this.invoke('checked-change', core.checked = checked);
            }, true);

            this.define('description', function (text) {
                this.$txt.empty()
                    .append(text);
            });

            validity(this);
        }
    });

    var datePikers = [];

    v2.use('input', 'type === "time" || type === "date" || type === "datetime" || type === "datetime-local"', {
        components: {
            'tooltip': function (callback) {
                require(['components/v2.tooltip'], callback);
            },
            'date-picker': function (callback) {
                require(['components/v2.date-picker'], callback);
            }
        },
        input: function () {
            /** 日期格式 */
            this.format = '';

            /** 显示图标 */
            this.showIcon = true;
        },
        design: function () {
            if (!this.format) {
                switch (this.type) {
                    case 'datetime-local':
                        this.format = 'yyyy-MM-ddThh:mm';
                        break;
                    case 'time':
                        this.format = 'HH:mm';
                        break;
                    case 'date':
                        this.format = 'yyyy-MM-dd';
                        break;
                    default:
                        this.format = 'yyyy-MM-dd HH:mm';
                        break;
                }
            }
            this.defaultValue = this.value;
            this.isGrouplike = this.hostlike(function (vm) {
                return vm.tag === 'input' && vm.type === 'group';
            });
        },
        init: function () {
            if (!this.showIcon || this.isHostlike) {
                this.base.init('input');
            } else {
                this.base.init();
            }
        },
        build: function () {
            if (this.showIcon) {
                var html = '.input-group-btn>button.btn.btn-default[type="button"]>i.glyphicon.glyphicon-calendar';

                if (this.isGrouplike) {
                    this.$icon = this.$.insertBefore(html.htmlCoding().html(), this.$.nextElementSibling);
                } else {
                    html = 'input.form-control+' + html;

                    this.$.appendChild(html.htmlCoding().html());

                    this.$core = this.take('input');

                    this.$icon = this.take('.input-group-btn');
                }
            }
        },
        render: function () {
            var core = this.$core || this['$' + this.tag] || this.$;
            if (this.showIcon && !this.isGrouplike) {
                this.$.classList.add('input-group');
            }

            core.classList.add('form-control');

            if (this.lg || this.sm || this.xs) {
                this.$.classList.add(this.lg ? 'input-lg' : this.sm ? 'input-sm' : 'input-xs');
            }

            if (this.autofocus) {
                this.focus();
            }
        },
        usb: function () {
            var type = this.type;
            var core = this.$core || this['$' + this.tag] || this.$;

            this.base.usb();

            if (supportHtml5) {
                this.define('type');
            } else {
                this.define('type', {
                    get: function () { return type; },
                    set: function (value) { type = value; }
                });
            }

            this.define('placeholder')
                .define('autocomplete', {
                    get: function () {
                        return core.autocomplete.toLowerCase() === 'on';
                    },
                    set: function (value) {
                        core.autocomplete = value ? 'on' : 'off';
                    }
                });

            this.define('value', function (value) {
                if (value) {
                    value = v2.date.format(value, this.format);
                }

                this.invoke('input-change', core.value = value);

                return value;
            }, true);

            validity(this);
        },
        ready: function () {
            var vm = this, deployment = this.$core || this['$' + this.tag] || this.$;

            if (this.showIcon) {
                deployment = this.$icon;
            }

            deployment.on('stop.click', function () {
                v2.GDir('date-picker').done(function (vm) {
                    vm.hide();
                });
                /** @type Develop<'date-picker'> */
                var picker, i = 0;
                while ((picker = datePikers[i++])) {
                    if (picker.format === vm.format) {
                        picker.deployment = deployment;
                        picker.min = vm.invoke("date-min");
                        picker.max = vm.invoke("date-max");
                        picker.host = vm;
                        picker.show();
                        return false;
                    }
                }
                datePikers.push(vm.create('date-picker', {
                    $$: document.body,
                    visible: true,
                    defaultVisible: false,
                    autoClose: true,
                    format: vm.format,
                    min: vm.invoke("date-min"),
                    max: vm.invoke("date-max"),
                    hide: function () {
                        this.base.hide();
                    }
                }));
            });
        }
    });

    v2.use('input', 'type === "group"', {
        input: function () {
            this.value = '';
        },
        init: function () {
            this.base.init();
        },
        build: function (view) {
            if ('previous' in view || 'nexts' in view) {
                return done(this, view.previous), done(this, view), done(this, view.nexts);
            }

            return done(this, view);

            function done(context) {
                var type;

                if (view === null || view === undefined)
                    return;

                type = v2.type(view);

                switch (type) {
                    case 'string':
                        return context.$.appendChild('span.input-group-addon'.htmlCoding().html())
                            .appendChild(view.html());
                    case 'array':
                        return v2.each(view, context.lazy(true, context.build));
                    case 'object':
                        if (view.nodeType) {
                            return context.$.appendChild('span.input-group-addon'.htmlCoding().html().appendChild(view));
                        }

                        view.name = view.name || context.name;

                        if ('tag' in view) {
                            if (view.tag === 'button' || view.tag === 'input' && (view.type === 'button' || view.type === 'reset' || view.type === 'submit')) {
                                view.$$ = context.$.appendChild('span.input-group-btn'.htmlCoding().html());
                            } else {
                                view.$$ = context.$.appendChild('span.input-group-addon'.htmlCoding().html());
                            }
                            return context.lazy(context.create, view);
                        }
                        return context.create('input', view);
                    case 'function':
                        return view.call(context);
                    default:
                        return v2.error('Unsupported exception:View types are not supported.');
                }
            }
        },
        render: function () {
            this.$.classList.add('input-group');
        },
        usb: function () {

            this.base.usb();

            this.define('value', function (value) {
                v2.when(this.controls)
                    .when(function (vm) { return vm.like('input', 'select'); })
                    .done(function (vm) {
                        if (vm.type === 'radio' || control.type === 'checkbox') {
                            vm.checked = vm.value === value;
                        } else {
                            vm.value = value;
                        }
                    })
                    .destroy(true);
            });
        },
        reportValidity: function () {
            return v2.all(this.controls, function (vm) {
                if (vm.like('input')) {
                    return vm.reportValidity();
                }
                return true;
            });
        }
    });

    v2.use('input.textarea', {
        textarea: function () {
            /** 显示几行 */
            this.rows = Infinity;
            /** 显示几列 */
            this.cols = Infinity;
        },
        init: function () {
            this.base.init('textarea');
        },
        usb: function () {
            this.base.usb('textarea');
            this.define('rows cols');
        }
    });

    v2.use('select', {
        select: function () {

            /** ID */
            this.id = "";

            /** 名称 */
            this.name = "";

            /** 多选 */
            this.multiple = false;

            /** 模板 */
            this.template = '';

            /** 选中的值 */
            this.value = '';

            /** 选中 */
            this.selectedIndex = -1;

            /** 超小输入框 */
            this.xs = false;
            /** 小输入框 */
            this.sm = false;
            /** 大输入框 */
            this.lg = false;
        },
        design: function () {
            this.defaultValue = this.value;
        },
        init: function () {
            this.base.init('select');
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
        build: function (view) {
            var template = this.template, htmls = [];
            if (template) {
                v2.each(view, function (option) {
                    switch (typeof option) {
                        case 'object':
                            htmls.push(template.withCb(option));
                            break;
                        default:
                            htmls.push(template.format(option));
                            break;
                    }
                });
            } else {
                v2.each(view, function (option) {
                    switch (typeof option) {
                        case 'object':
                            htmls.push('<option value="{0}">{1}</option>'.format(option.id || option.value, option.name || option.text));
                            break;
                        case 'array':
                            htmls.push('<option value="{0}">{1}</option>'.format(option));
                            break;
                        default:
                            htmls.push('<option value="{0}">{0}</option>'.format(option + ''));
                            break;
                    }
                });
            }
            this.$.empty()
                .appendChild(htmls.join('').html());
        },
        usb: function () {
            this.base.usb();

            this.define('multiple');

            this.define('selectedIndex', function (index) {

                v2.each(this.$.selectedOptions, function (option, i) {
                    option.selected = index === i;
                });

                this.invoke('select-changed', index);
            });

            this.define('value', {
                get: function () {
                    if (this.multiple) {
                        return v2.map(this.$.selectedOptions, function (option) {
                            return option.value || option.text;
                        }).join(',');
                    }

                    return this.$.value;
                },
                set: function (value) {
                    if (this.multiple) {
                        var arr = !!value && value.split(',');

                        v2.each(this.$.options, function (option) {
                            option.selected = arr && arr.indexOf(option.value || option.text) > -1;
                        });

                    } else {
                        v2.each(this.$.options, function (option, index) {
                            if ((option.value || option.text) === value) {
                                this.selectedIndex = index;
                                return false;
                            }
                        }, this);
                    }
                }
            }, true);
        }
    });

    //? 路由到【select】插件。
    v2.route('input', 'type === "select"', 'select');

    //? 路由到【textarea】插件。
    v2.route('input', 'type === "textarea"', 'textarea');

    //? 路由到【button】插件。
    v2.route('input', 'type === "button" || type === "reset" || type === "submit" || type === "image"', 'button');

    return function (option) {
        return v2('input', option);
    };
}));