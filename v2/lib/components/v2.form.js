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
            this.method = "GET";

            /** 请求地址 */
            this.action = location.href;

            /** 表单内容编码 */
            this.enctype = "application/x-www-form-urlencoded";

            /** 按钮组 */
            this.buttons = [];
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

            var elem, vm = this, group = this.lg ? '.form-group-lg' : this.sm ? '.form-group-sm' : this.xs ? '.form-group-xs' : '.form-group', type = v2.type(view);

            switch (type) {
                case 'array':
                    v2.each(view, this.lazy(done));
                    break;
                case 'object':
                    if ('tag' in view) {
                        this.lazy(done, view);
                    } else {
                        v2.each(view, this.lazy(true, function (option, name) {
                            option.name = option.name || name;
                            return done(option);
                        }));
                    }
                    break;
                default:
                    done(view);
                    break;
            }
            v2.each(this.buttons, this.lazy(true, function (button) {
                vm.create('button', button);
            }));

            function done(option) {
                if (v2.isArraylike(option)) {
                    var index = 12 / option.length;
                    var col = '.col-xs-12.col-sm-{0}.col-lg-{1}'.format(index < 6 ? index * 2 : index, index);
                    return v2.each(option, vm.lazy(true, function (config) {
                        elem = vm.$.appendChild(col.htmlCoding().html())
                            .appendChild(group.htmlCoding().html());

                        if (vm.label && config.label !== false) {
                            elem.appendChild('label.control-label{{0}}'.format(config.title || config.name).htmlCoding().html());
                        }

                        vm.create(option.tag || 'input', v2.improve({ $$: elem }, config));
                    }));
                }

                elem = vm.$.appendChild(group.htmlCoding().html());

                if (vm.label && option.label !== false) {
                    elem.appendChild('label.control-label{{0}}'.format(option.title || option.name).htmlCoding().html());
                }

                vm.create(option.tag || 'input', v2.improve({ $$: elem }, option));
            }
        },
        wait: function (show) {
            if (show || this.__wait_) {
                if (this.__wait_) {
                    return show ? this.__wait_.show() : this.__wait_.hide();
                }

                if (show) {
                    this.__wait_ = v2('wait', { style: 2 });
                }
            }
        },
        ajax: function () {
            var vm = this, ajax = {
                url: this.action,
                method: "GET",
                params: {},
                data: {}
            };

            if (this.invoke("ajax-ready", ajax) === false) {
                return;
            }

            this.wait(true);

            return axios.request(ajax)
                .then(function (response) {
                    vm.invoke("ajax-success", response);
                })
            ["catch"](function (error) {
                vm.invoke("ajax-fail", error);
            })
            ["finally"](function () {
                vm.wait();
            });
        },
        load: function (data) {
            var
                controls = this.controls,
                isArraylike = v2.isArraylike(data);

            v2.each(data, function (value, key) {
                var control = isArraylike ? controls.eq(key) : controls.first(function (vm) { return vm.name == key; });

                if (!control) return;

                if (control.like('input', 'textarea', 'select')) {
                    if (control.type == 'radio' || control.type == 'checkbox') {
                        control.checked = control.value == value;
                    } else {
                        control.value = value;
                    }
                }
            });
        },
        checkValidity: function () {
            var that = this;
            return v2.all(this.controls, function (vm) {
                if (vm.like('input')) {
                    if (that.trim) {
                        vm.value = vm.value.trim();
                    }
                    return vm.checkValidity();
                }
                return true;
            });
        },
        reportValidity: function () {
            var that = this;
            return v2.all(this.controls, function (vm) {
                if (vm.like('input')) {

                    if (that.trim) {
                        vm.value = vm.value.trim();
                    }

                    return vm.reportValidity();
                }
                return true;
            });
        },
        reset: function () {
            v2.each(this.controls, function (control) {
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

            var vm = this, ajax = {
                url: this.action,
                method: this.method,
                data: {}
            };

            if (this.invoke("submit-ready", ajax) === false) {
                return;
            }

            this.wait(true);

            return axios.request(ajax)
                .then(function (response) {
                    vm.invoke("submit-success", response);
                })
            ["catch"](function (error) {
                vm.invoke("submit-fail", error);
            })
            ["finally"](function () {
                vm.wait();
            });
        },
        ready: function () {
            var vm = this;
            this.$.on('stop.prev.submit', function () {
                try {
                    vm.submit();
                } catch (_) { }
            });
            this.$.on('stop.prev.reset', function () {
                try {
                    vm.reset();
                } catch (_) { }

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

    return function (option) {
        return v2('form', option);
    };
}));