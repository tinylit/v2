(function (factory) {
    return typeof define === 'function' ?
        define(['v2'], factory) :
        typeof module === 'object' && module.exports ?
            module.exports = function (root, v2) {
                if (typeof v2 === 'undefined') {
                    if (typeof window === 'undefined') {
                        v2 = require('v2')(root);
                    }
                    else {
                        v2 = require('v2');
                    }
                }
                return factory(v2);
            } :
            factory(v2);
}(function (/** @type Use.V2 */v2) {

    v2.use('form', {
        components: {
            input: function (resovle) {
                require(['components/v2.input'], resovle);
            },
            static: function (resovle) {
                require(['components/v2.input'], resovle);
            },
            textarea: function (resovle) {
                require(['components/v2.input'], resovle);
            },
            select: function (resovle) {
                require(['components/v2.input'], resovle);
            }
        },
        form: function () {
            /** 行内显示 */
            this.inline = false;

            /** 水平布局 */
            this.horizontal = false;

            /** 去除【value】空格 */
            this.trim = true;

            /** 超小按钮 */
            this.xs = false;

            /** 小按钮 */
            this.sm = false;

            /** 大按钮 */
            this.lg = false;

            /** 显示输入框名称 */
            this.label = true;

            /** 只读内容文本显示 */
            this.readonly2span = true;

            /** 证书 */
            this.withCredentials = true;

            /** 请求方式 */
            this.method = "POST";

            /** 请求地址 */
            this.action = location.href;

            /** 表单内容编码 */
            this.enctype = "application/x-www-form-urlencoded";

            /** 按钮组 */
            this.buttons = [];
        },
        design: function () {
            this.inputs = {};
            this.formControls = [];
        },
        init: function () {
            this.base.init('form');
        },
        render: function (variable) {

            if (this.hostlike('navbar')) {

                this.$.classList.add('navbar-form');

                if (variable.right) {
                    this.$.classList.add('navbar-right');
                } else if (variable.left) {
                    this.$.classList.add('navbar-left');
                }
            }

            if (this.inline) {
                this.$.classList.add('form-inline');
            }

            if (this.horizontal) {
                this.$.classList.add('form-horizontal');
            }
        },
        build: function (view) {

            if (view === undefined || view === null)
                return;

            var vm = this,
                type = v2.type(view),
                options = {
                    xs: this.xs,
                    sm: this.sm,
                    lg: this.lg,
                    host: this,
                    readonly2span: this.readonly2span,
                    components: this.components
                };

            switch (type) {
                case 'array':
                    v2.each(view, this.lazyFor(done));
                    break;
                case 'object':
                    if ('tag' in view) {
                        this.lazy(done, view);
                    } else {
                        v2.each(view, this.lazyFor(function (option, name) {
                            option.name = option.name || name;
                            return done(option);
                        }));
                    }
                    break;
                default:
                    done(view);
                    break;
            }

            v2.each(this.buttons, this.lazyFor(function (button) {
                vm.create('button', button);
            }));

            vm.lazy(function () {
                this.$.appendChild('.clearfix'.htmlCoding().html());
            });

            function done(option) {
                if (v2.isArraylike(option)) {
                    var index = 12 / option.length;

                    v2.each(option, vm.lazyFor(function (config) {
                        if (config.name) {
                            vm.inputs[config.name] = true;
                        }

                        vm.formControls.push(v2('form-control', v2.extend({
                            cols: index,
                            title: config.title,
                            view: config,
                            label: config.label || vm.label && config.label !== false,
                            name: config.name,
                            value: config.value,
                            required: !!config.required
                        }, options)));
                    }));

                } else if (option.type === 'hidden') {
                    vm.lazy(vm.create, 'input', option);
                } else {
                    if (option.name) {
                        vm.inputs[option.name] = true;
                    }
                    vm.formControls.push(v2('form-control', v2.extend({
                        title: option.title,
                        view: option,
                        label: option.label || vm.label && option.label !== false,
                        name: option.name,
                        value: option.value,
                        required: !!option.required
                    }, options)));
                }
            }
        },
        ajax: function () {
            var vm = this,
                ajax = {
                    url: this.action,
                    method: "GET",
                    params: {},
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
            var that = this,
                controls = this.controls,
                isArraylike = v2.isArraylike(data);

            v2.each(data, isArraylike ? function (value, index) {
                var control = controls.eq(index);

                if (!control) return;

                if (control.like('form-control')) {
                    control = control.$input;
                }

                if (!control) return;

                if (control.like('input', 'textarea', 'select')) {
                    if (control.type == 'radio' || control.type == 'checkbox') {
                        control.checked = that.valueIs(control, value);
                    } else {
                        control.value = value;
                    }
                }
            } : function (value, name) {
                controls.when(function (vm) {
                    return vm.name == name;
                }).map(function (vm) {
                    if (vm.like('form-control')) {
                        return vm.$input;
                    }
                    return vm;
                }).done(function (vm) {
                    if (vm.like('input', 'textarea', 'select')) {
                        if (vm.type == 'radio' || vm.type == 'checkbox') {
                            vm.checked = that.valueIs(vm, value);
                        } else {
                            vm.value = value;
                        }
                    }
                });
            });
        },
        valueIs: function (control, value) {
            return control.value == value;
        },
        valueTo: function (control, value) {
            return value + ',' + control.value;
        },
        usb: function () {
            var that = this;

            this.base.usb();

            v2.each(this.inputs, function (_, name) {
                v2.define(that.inputs, name, function (value) {
                    that.formControls.forEach(function (control) {
                        if (control.name === name) {
                            if (typeof value === 'boolean') {
                                control.visible = value;
                            } else {
                                if ((value & 1) === 1) {
                                    control.visible = true;
                                } else {
                                    control.visible = false;
                                }

                                if ((value & 2) === 2) {
                                    control.required = true;
                                } else {
                                    control.required = false;
                                }

                                if ((value & 4) === 4) {
                                    control.disabled = true;
                                } else {
                                    control.disabled = false;
                                }

                                if ((value & 8) === 8) {
                                    control.disabled = true;
                                } else {
                                    control.disabled = false;
                                }
                            }
                        }
                    });
                });
            });

            function getValue(control) {
                var value = control.value;

                if (that.trim && v2.isString(value)) {
                    return value.trim();
                }

                return value;
            }

            function done(vm, data) {
                vm.controls.done(function (control) {
                    if (control.visible && control.name && control.host.visible && control.like('input', 'select') && !that.formControls.some(function (ctrl) {
                        return !ctrl.visible && ctrl.name == vm.name;
                    })) {
                        if (control.type == 'radio' || control.type == 'checkbox') {
                            if (control.checked) {
                                if (control.name in data) {
                                    data[control.name] = vm.valueTo(control, data[control.name]);
                                } else {
                                    data[control.name] = getValue(control);
                                }
                            }
                        } else if (control.type == 'group') {
                            done(control, data);
                        } else {
                            data[control.name] = getValue(control);
                        }
                    }
                });

                return data;
            }

            this.define("value", {
                get: function () {
                    return done(this, {});
                },
                set: this.load
            });
        },
        checkValidity: function () {
            var that = this;
            return this.controls.all(function (vm) {
                if (vm.visible && vm.like('input', 'form-control') && !that.formControls.some(function (ctrl) {
                    return !ctrl.visible && ctrl.name == vm.name;
                })) {
                    return vm.checkValidity();
                }
                return true;
            });
        },
        reportValidity: function () {
            var that = this;
            return this.controls.all(function (vm) {
                if (vm.visible && vm.like('input', 'form-control') && !that.formControls.some(function (ctrl) {
                    return !ctrl.visible && ctrl.name == vm.name;
                })) {
                    return vm.reportValidity();
                }
                return true;
            });
        },
        reset: function () {

            if (this.data) {
                return this.load(this.data);
            }

            this.controls.map(function (vm) {
                if (vm.like('form-control')) {
                    return vm.$input;
                }
                return vm;
            }).done(function (control) {
                if (control.like('input', 'select')) {
                    if (control.type == 'radio' || control.type == 'checkbox') {
                        control.checked = control.defaultChecked;
                    } else {
                        control.value = control.defaultValue;
                    }
                }
            });
        },
        submit: function () {
            if (!this.reportValidity())
                return;

            var vm = this,
                ajax = {
                    url: this.action,
                    method: this.method,
                    data: this.value
                };

            if (this.invoke("submit-ready", ajax) === false) {
                return;
            }

            return axios.request(ajax)
                .then(function (response) {
                    vm.invoke("submit-success", response);
                })
            ["catch"](function (error) {
                vm.invoke("submit-fail", error);
            });
        },
        ready: function () {
            var vm = this;
            this.$.on('stop.prev.submit', function () {
                try {
                    vm.submit();
                } catch (e) { console.error(e); }

                return false;
            });
            this.$.on('stop.prev.reset', function () {
                try {
                    vm.reset();
                } catch (e) { console.error(e); }

                return false;
            });
        },
        commit: function () {
            var vm = this;
            this.$.on("keyup", function (e) {
                var code = e.keyCode || e.which;
                if (code === 13 || code === 108) {
                    vm.invoke("keyboard-enter");
                }
            });
        }
    });

    v2.use('form-control', {
        "form-control": function () {
            /** 标题 */
            this.title = "";

            /** 超小按钮 */
            this.xs = false;

            /** 小按钮 */
            this.sm = false;

            /** 大按钮 */
            this.lg = false;

            /** 显示输入框名称 */
            this.label = true;

            /** 名称 */
            this.name = "";

            /** 值 */
            this.value = "";

            /** 列 */
            this.cols = 12;

            /** 只读内容文本显示 */
            this.readonly2span = true;

            /** 必填 */
            this.required = false;
        },
        render: function () {

            this.$.classList.add(this.lg ? 'form-group-lg' : this.sm ? 'form-group-sm' : this.xs ? 'form-group-xs' : 'form-group');

            if (this.host.inline && this.cols === 12) {
                return;
            }

            this.$.classList.add('col-xs-12');

            if (this.cols < 12) {
                this.$.classList.add('col-sm-' + this.cols);
            }
        },
        build: function (view) {
            if (this.label) {
                this.$label = this.$.appendChild('label.control-label'.htmlCoding().html());
            }

            view.$$ = this.$;

            this.$input = this.host.create(view.tag || (this.readonly2span && view.readonly ? 'static' : 'input'), view);
        },
        usb: function () {
            if (this.label) {
                this.define('title', function (value) {
                    this.$label.innerHTML = value;
                }, false);
            }

            this.define('required', function (value) {
                this.$input.required = !!value;

                if (this.label) {
                    this.$label.classList.toggle('required', !!value);
                }
            });

            this.define('value', {
                get: function () {
                    return this.$input.value;
                },
                set: function (value) {
                    this.$input.value = value;
                }
            });

        }
    });

    return function (option) {
        return v2('form', option);
    };
}));