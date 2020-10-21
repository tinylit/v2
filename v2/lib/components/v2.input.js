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

        vm.define('id name pattern min max minlength maxlength required readonly', core);

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
                            var value = core.value,
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

                if (this.trim) {
                    this.value = core.value = core.value.trim();
                }

                var validity = v2.usb(this, "validity");

                return validity.valid;
            };
        } else {
            vm.define('validity validationMessage setCustomValidity checkValidity', core);
        }

        if (v2.isFunction(core.reportValidity)) {
            vm.define('reportValidity', core);
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
            this.autocomplete = false;

            /** 返回/设置元素的autofocus属性，该属性指定窗体控件在加载页面时应该具有输入焦点，除非用户覆盖它，例如输入另一个控件。文档中只有一个表单元素可以具有autofocus属性。如果type属性被设置为hidden(也就是说，您不能自动将焦点设置为隐藏控件)，则无法应用该属性。 */
            this.autofocus = false;

            /** 返回/设置元素的多个属性，指示是否可能有多个值(例如，多个文件)。 */
            this.multiple = false;

            /** 是否去除空格 */
            this.trim = true;

            /** ID */
            this.id = "";

            /** 名称 */
            this.name = "";

            /** 按钮类型 */
            this.type = "text";//[text|number|tel|email|url|search]

            /** 步长 */
            this.step = 1;

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

            if (this.type === 'number') {
                this.define('step', core);
            }

            this.define('type multiple placeholder', core);

            this.define('autocomplete', {
                get: function () {
                    return core.autocomplete.toLowerCase() === 'on';
                },
                set: function (value) {
                    core.autocomplete = value ? 'on' : 'off';
                }
            });

            this.define('value', function (value, oldValue) {
                if (this.trim) {

                    value = value.trim();
                }

                if (oldValue === undefined) {
                    return value;
                }

                if (oldValue === value) {
                    return value;
                }

                if (this.checkValidity()) {
                    this.invoke('input-change', value);
                }
            }, core);

            validity(this);
        },
        ready: function () {
            if (this.type === 'hidden') {
                this.$.styleCb('display', 'none');
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

    v2.use('input', 'type === "search"', {
        components: {
            'dropdown': function (callback) {
                require(['components/v2.dropdown'], callback);
            }
        },
        input: function () {
            /** 搜索地址 */
            this.action = location.href;
            /** 请求方式 */
            this.method = "GET";
        },
        init: function () {
            this.base.init();
        },
        build: function () {
            this.$code = this.$.appendChild('span.input-group-btn>button.btn.btn-default[type="button"]>i.glyphicon.glyphicon-star-empty'.htmlCoding().html());
            this.$icon = this.take('i', this.$code);
            this.$core = this.$.appendChild('input.form-control'.htmlCoding().html());
            this.$btn = this.$.appendChild('span.input-group-btn>button.btn.btn-default.dropdown-toggle[type="button"][data-toggle="dropdown"]>span.caret+span.sr-only'.htmlCoding().html());

            this.$dropdown = this.create('dropdown', {
                $$: this.$btn,
                view: this.data,
                methods: {
                    "select-changed(?input)": function (input) {
                        var options = this.selectedOptions;
                        if (options) {
                            input.text = options.text;
                            input.code = options.value;
                        } else {
                            input.code = "";
                            input.text = "";
                        }
                    }
                }
            });
        },
        render: function () {
            this.$.classList.add('input-group');
        },
        usb: function () {
            var valueOld = this.value,
                core = this.$core;

            this.base.usb();

            this.define('placeholder', core);

            this.define('autocomplete', {
                get: function () {
                    return core.autocomplete.toLowerCase() === 'on';
                },
                set: function (value) {
                    core.autocomplete = value ? 'on' : 'off';
                }
            });

            this.define('code', function (code) {
                if (code) {
                    this.$icon.classList.add('glyphicon-star');
                    this.$icon.classList.remove('glyphicon-star-empty');
                } else {
                    this.$icon.classList.remove('glyphicon-star');
                    this.$icon.classList.add('glyphicon-star-empty');
                }

                this.invoke('input-change', code);
            });

            this.define('value', {
                get: function () {
                    return this.code;
                },
                set: function (value) {
                    if (this.trim) {

                        value = value.trim();
                    }

                    if (valueOld === value) {
                        return value;
                    }

                    this.$core.value = valueOld = value;

                    this.code = "";

                    this.$dropdown.selectedIndex = -1;

                    if (this.checkValidity()) {
                        this.ajax();
                    }
                }
            });

            validity(this);
        },
        ajax: function () {
            var vm = this,
                value = this.$core.value,
                ajax = {
                    url: this.action,
                    method: this.method,
                    params: {
                        keywords: this.trim ? value.trim() : value
                    },
                    data: {}
                };

            if (this.invoke("ajax-ready", ajax) === false) {
                return;
            }

            return axios.request(ajax)
                .then(function (response) {
                    vm.invoke("ajax-success", response);
                })
            ["catch"](function (error) {
                vm.invoke("ajax-fail", error);
            });
        },
        load: function (data) {
            if (data === null || data === undefined) {
                return;
            }

            if (this.isReady) {
                this.$dropdown.show();
                this.$dropdown.build(data);
            }
        },
        ready: function () {
            var tooltip, that = this;

            this.$core.on('stop.click', function () {
                return false;
            });

            this.$code.on('click', function () {
                var message = that.code ? that.text + "(" + that.code + ")" : "未选中代码!";

                if (tooltip) {
                    tooltip.content = message;
                    tooltip.show();
                } else {
                    tooltip = that.create('tooltip', {
                        $$: document.body,
                        request: that.$core,
                        duration: 2000,
                        content: message
                    });
                }
            });

            this.$core.on("keyup", function (e) {
                var code = e.keyCode || e.which;

                if (code !== 38 && code !== 40) {
                    return;
                }

                that.$dropdown.show();

                var
                    index = that.$dropdown.selectedIndex,
                    data = that.$dropdown.data;

                if (v2.isEmpty(data)) {
                    return;
                }

                var len = data.length;

                if (code === 38) {
                    index -= 1;
                } else {
                    index += 1;
                }

                if (index < 0) {
                    do {
                        index += len;
                    } while (index < 0);
                } else if (index >= len) {
                    index = index % len;

                    if (index === 0) {
                        index = len;
                    }

                    index -= 1;
                }

                that.$dropdown.selectedIndex = index;
            });
        }
    });

    var GLOBAL_VARIABLE_CHECK_FOR = 0;

    v2.use('input', 'type === "checkbox" || type === "radio"', {
        input: function () {
            /** ID */
            this.id = "";

            /** 名称 */
            this.name = "";

            /** 对选项描述 */
            this.description = "";

            /** 按钮类型 */
            this.type = "redio";//[redio|checkbox]

            /** 值 */
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
        },
        ready: function () {
            var that = this;
            var core = this.$core || this['$' + this.tag] || this.$;

            this.$.on('click', function () {
                that.checked = core.checked;
            });
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
            if (!this.showIcon || this.isGrouplike) {
                this.base.init('input');
            } else {
                this.base.init();
            }
        },
        build: function () {
            if (this.showIcon) {
                var html = '.input-group-btn>button.btn.btn-default[type="button"]>i.glyphicon.glyphicon-calendar';

                if (this.isGrouplike) {
                    this.$icon = this.$$.insertBefore(html.htmlCoding().html(), this.$.nextElementSibling);
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
            var vm = this, deployment;

            if (this.showIcon) {
                deployment = this.$icon;
            } else {
                deployment = this.$core || this['$' + this.tag] || this.$;
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
                    max: vm.invoke("date-max")
                }));
            });
        }
    });

    var
        userAgent = window.navigator.userAgent.toLowerCase(),
        isIE = /msie|trident/.test(userAgent),
        GLOBAL_VARIABLE_IFRAME_ID = 0;

    v2.use('input', 'type === "file"', {
        input: function () {
            /** 接口地址 */
            this.action = "";
            /** 调用方式 */
            this.method = "POST";
        },
        init: function () {
            this.base.init();
        },
        build: function () {
            this.$target = this.$.appendChild('a[href="#"]{添加}'.htmlCoding().html());
            this.$core = this.$.appendChild('input.hidden[type=file]'.htmlCoding().html());
        },
        render: function () {
            this.$.classList.add('form-control', 'form-annex');
            if (this.lg || this.sm || this.xs) {
                this.$.classList.add(this.lg ? 'input-lg' : this.sm ? 'input-sm' : 'input-xs');
            }

            if (this.autofocus) {
                this.focus();
            }
        },
        upload: function () {
            if (this.invoke('upload-ready') === false)
                return;

            var vm = this,
                url = this.action,
                id = "__file_upload_ifr_" + (++GLOBAL_VARIABLE_IFRAME_ID),
                core = this.$core || this['$' + this.tag] || this.$,
                parentNode = core.parentNode,
                nextSibling = core.nextSibling;

            url += (url.indexOf("?") >= 0 ? "&" : "?") + "r=" + (+new Date());

            var ifr = document.createElement('iframe');

            ifr.id = ifr.name = id;

            if (isIE) {
                ifr.src = "javascript:false";
            }

            document.body.appendChild(ifr);

            if (isIE)
                document.frames[id].name = id;

            var form = document.createElement("form");
            form.target = id;
            form.method = this.method;
            form.enctype = form.encoding = "multipart/form-data";
            form.action = url;

            form.appendChild(core);

            document.body.appendChild(form);

            function done(callback) {
                ifr.onload = ifr.onreadystatechange = null;

                parentNode.insertBefore(core, nextSibling);

                callback.call(this);

                setTimeout(function () {
                    document.body.removeChild(ifr);
                }, 100);
            }

            ifr.onload = ifr.onreadystatechange = function () {
                try {
                    if (this.contentWindow && this.contentWindow.document && (!isIE || this.contentWindow.document.readyState == "complete")) {
                        done(function () {
                            var result = {
                                fileName: core.value.replace(/.*(\/|\\)/, ""),
                                url: uploadEl.value
                            };

                            if (this.contentWindow.uploadResult) {
                                v2.extend(result, this.contentWindow.uploadResult);
                            };

                            vm.invoke('upload-success', result);
                        });
                    }
                } catch (e) {
                    done(function () {
                        vm.invoke('upload-fail', e);
                    });
                }
            };

            form.submit();

            document.body.removeChild(form);
        },
        commit: function () {
            var vm = this, core = this.$core || this['$' + this.tag] || this.$;

            this.$target.on('click', function () {
                core.click();
            });

            core.on("change", function (e) {

                var fileName = this.value.replace(/.*(\/|\\)/, "");

                if (vm.invoke('file-select', { event: e, file: fileName }) === false)
                    return false;

                vm.upload();
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
                return done(this, view.previous), done(this, view.nexts);
            }

            return done(this, view);

            function done(context, view) {
                var type;

                if (view === null || view === undefined)
                    return;

                type = v2.type(view);

                switch (type) {
                    case 'string':
                        return context.$.appendChild('span.input-group-addon'.htmlCoding().html())
                            .appendChild(view.html());
                    case 'array':
                        return v2.each(view, context.lazyFor(context.build));
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
        valueIs: function (control, value) {
            return control.value === value;
        },
        usb: function () {

            var that = this;

            this.base.usb();

            this.define('value', function (value) {
                var isPlainObject = v2.isPlainObject(value);

                this.controls
                    .when(function (vm) { return vm.like('input', 'select'); })
                    .done(function (vm) {
                        if (isPlainObject) {
                            if (vm.type === 'radio' || vm.type === 'checkbox') {
                                vm.checked = that.valueIs(vm, value[vm.name]);
                            } else {
                                vm.value = value[vm.name];
                            }
                        } else if (vm.type === 'radio' || vm.type === 'checkbox') {
                            vm.checked = that.valueIs(vm, value);
                        } else {
                            vm.value = value;
                        }
                    });
            });
        },
        reportValidity: function () {
            return this.controls.all(function (vm) {
                if (vm.like('input')) {
                    return vm.reportValidity();
                }
                return true;
            });
        }
    });

    v2.use('input.static', {
        init: function () {
            this.base.init('p');
        },
        render: function () {
            this.$.classList.add('form-control-static');

            if (this.lg || this.sm || this.xs) {
                this.$.classList.add(this.lg ? 'input-lg' : this.sm ? 'input-sm' : 'input-xs');
            }
        },
        usb: function () {
            var core = this.$core || this['$' + this.tag] || this.$;

            this.define('id name');

            this.define('value', function (value, oldValue) {
                if (this.trim) {
                    value = value.trim();
                }

                if (oldValue === undefined) {
                    return core.innerHTML = value;
                }

                if (oldValue === value) {
                    return value;
                }

                if (this.checkValidity()) {
                    core.innerHTML = value;

                    this.invoke('input-change', value);
                }
            });

            this.define({
                validity: function () {
                    return true;
                },
                validationMessage: function () {
                    return "";
                }
            });
            // 为元素设置自定义有效性消息。如果此消息不是空字符串，则元素将遭受自定义有效性错误，并且不验证。
            this.setCustomValidity = function () { };
            // 返回一个布尔值，如果该元素是约束验证的候选项，且不满足其约束，则该布尔值为false。在本例中，它还在元素上触发一个无效事件。如果元素不是约束验证的候选项，或者满足其约束，则返回true。
            this.checkValidity = this.reportValidity = function () {
                return true;
            };
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
                            htmls.push('<option value="{0}">{1}</option>'.format((option.id || option.id === 0) ? option.id : (option.value || option.value === 0) ? option.value : "", option.name || option.text));
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
        valueTo: function (arr) {
            return arr.join(',');
        },
        valueIs: function (option, value) {
            return (',' + value + ',').indexOf(',' + option.value + ',') > -1;
        },
        usb: function () {
            this.base.usb();

            this.define('multiple');

            this.define('selectedIndex', function (index) {
                if (!this.multiple) {
                    v2.each(this.$.options, function (option, i) {
                        option.selected = index === i;
                    });
                }

                this.invoke('select-changed', index);
            });

            this.define('value', {
                get: function () {
                    if (this.multiple) {

                        var arr = v2.map(this.$.selectedOptions, function (option) {
                            return option.value;
                        });

                        return this.valueTo(arr);
                    }

                    return this.$.value;
                },
                set: function (value) {
                    if (this.multiple) {

                        v2.each(this.$.options, function (option) {
                            option.selected = this.valueIs(option, value);
                        }, this);

                    } else {
                        v2.each(this.$.options, function (option) {
                            option.selected = option.value === value;
                        });
                    }

                    this.selectedIndex = this.$.selectedIndex;
                }
            }, true);
        },
        commit: function () {
            var vm = this;
            this.$.on("change", function (e) {
                vm.invoke('select-changed', this.selectedIndex);
            });
        }
    });

    //? 路由到【select】插件。
    v2.useRoute('input', 'type === "select"', 'select');

    //? 路由到【textarea】插件。
    v2.useRoute('input', 'type === "textarea"', 'textarea');

    //? 路由到【button】插件。
    v2.useRoute('input', 'type === "button" || type === "reset" || type === "submit" || type === "image"', 'button');

    return function (option) {
        return v2('input', option);
    };
}));