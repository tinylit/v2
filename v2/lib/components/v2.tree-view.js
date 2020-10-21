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

    function findNode(that, node) {
        var code, parentCode = "*";

        for (; node; node = node.parentNode) {
            if (node.nodeName.toLowerCase() === 'li') {
                code = node.getAttribute('data-code');
                break;
            }
        }

        for (node = node.parentNode; node !== that.$; node = node.parentNode) {
            if (node.nodeName.toLowerCase() === 'li') {
                parentCode = node.getAttribute('data-code');
                break;
            }
        }

        return that.codes[parentCode].find(function (node) {
            return node.id == code;
        });
    }

    v2.use('tree-view', {
        treeView: function () {
            /** 多选框 */
            this.type = "none"; // [none|radio|checkbox|radio-by-view|checkbox-by-view]

            /** 是否具备最小化的能力 */
            this.miniable = false;

            /** 是否显示基准线 */
            this.indentGuide = true;

            /** 参考线颜色 */
            this.indentGuideColors = [];
        },
        render: function () {
            /** 当前编码 */
            this.code = "*";
            this.codes = {};
            this.$.classList.add("tree-view");

            if (this.indentGuide) {
                this.$.classList.add("tree-view-indent-guide");
            }
        },
        build: function (view) {
            if (this.miniable) {
                var htmls = ['<div data-toggle="mini" class="tree-view-stretch">',
                    '<i class="glyphicon glyphicon-chevron-left"></i>',
                    '<i class="glyphicon glyphicon-chevron-right"></i>',
                    '</div>'];

                this.$.innerHTML = htmls.join('');
            }

            this.load(view);
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
        isChecked: function (view) {
            return view.checked;
        },
        selectOptions: function () {
            var that = this;

            if (this.type === 'none') {
                return this.when('.active')
                    .map(function (elem) {
                        var parentCode = "*",
                            code = elem.getAttribute('data-code');

                        for (var node = elem.parentNode; node !== that.$; node = node.parentNode) {
                            if (node.nodeName.toLowerCase() === 'li') {
                                parentCode = node.getAttribute('data-code');
                                break;
                            }
                        }

                        var codes = that.codes[parentCode];

                        if (!codes) {
                            return;
                        }

                        return codes.find(function (node) {
                            return node.id == code;
                        });
                    });
            }

            return this.when('input')
                .when(function (node) {
                    return node.checked;
                })
                .map(function (node) {
                    return findNode(that, node);
                });
        },
        ajax: function () {
            var vm = this,
                ajax = {
                    url: null,
                    method: "GET",
                    params: {
                        code: this.code
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
            if (data === undefined || data === null)
                return;

            var elem,
                that = this,
                level = 0,
                htmls = [],
                colors = this.indentGuideColors;

            if (this.code === '*') {
                elem = this.$;
            } else {
                elem = this.take('[data-code="' + this.code + '"]');

                if (!elem) {
                    return;
                }

                level += +elem.parentNode.getAttribute('data-level');
            }

            done(this.code, level, data);

            var html = htmls.join('');

            for (var node = elem.firstChild; node; node = node.nextSibling) {
                if (node.nodeName.toLowerCase() == 'ul') {
                    elem.removeChild(node);
                }
            }

            elem.appendChild(html.html());

            function done(code, level, view) {


                that.codes[code] = view;

                htmls.push('<ul data-level="');

                htmls.push(level + 1);

                if (level > 0 && colors.length > 0) {
                    htmls.push('" style="border-color:');
                    htmls.push(colors[(level - 1) % colors.length]);
                }

                htmls.push('">');

                v2.each(view, function (item) {
                    htmls.push('<li data-code="');
                    htmls.push(item.id);
                    htmls.push('">');

                    if (item.hasChild) {
                        htmls.push('<em data-sign="+">+</em><em data-sign="-">-</em>');
                    }

                    if (item.icon) {
                        if (/\.[a-zA-Z]+$/.test(item.icon)) {
                            htmls.push('<img class="tree-icon" src="');
                            htmls.push(item.icon);
                            htmls.push('/>');
                        } else {
                            htmls.push('<i class="tree-icon ');
                            htmls.push(item.icon);
                            htmls.push('"></i>');
                        }
                    }

                    switch (that.type) {
                        case 'radio-by-view':
                        case 'checkbox-by-view':
                            htmls.push('<label>');
                            htmls.push('<input type="');
                            htmls.push(that.type.slice(0, -8));
                            if (that.type === 'radio-by-view') {
                                htmls.push('" name="');
                                htmls.push('radio-');
                                htmls.push(that.identity);
                            }

                            if (that.isChecked(item)) {
                                htmls.push('" checked="checked');
                            }

                            htmls.push('"/>');
                            htmls.push('<span>');
                            htmls.push(item.name || item.text);
                            htmls.push('</span>');
                            htmls.push('</label>');
                            break;
                        case 'radio':
                        case 'checkbox':
                            htmls.push('<input type="');
                            htmls.push(that.type);
                            if (that.type === 'radio') {
                                htmls.push('" name="');
                                htmls.push('radio-');
                                htmls.push(that.identity);
                            }

                            if (that.isChecked(item)) {
                                htmls.push('" checked="checked');
                            }

                            htmls.push('"/>');
                        default:
                            htmls.push('<span>');
                            htmls.push(item.name || item.text);
                            htmls.push('</span>');
                            break;
                    }

                    htmls.push('</li>');

                    if (item.view) {
                        done(item.id, level + 1, item.view);
                    }
                });

                htmls.push("</ul>");
            }
        },
        expand: function (code) {
            if (code === null || code === undefined) {
                code = '*';
            }

            var node = code === '*' ? this.$ : this.take('[data-code="' + code + '"]');

            if (!node || node.classList.contains('expand')) {
                return;
            }

            node.classList.add('expand');

            if (code in this.codes) {
                return;
            }

            this.code = code;

            this.ajax();
        },
        refresh: function (code, name) {
            if (arguments.length === 0) {
                this.ajax();
                return;
            }

            var elem = this.take('[data-code="' + code + '"]>span');

            if (!elem) {
                return;
            }

            elem.innerHTML = name;
        },
        ready: function () {
            var vm = this;

            this.$.on("prev.stop.click", '[data-sign="+"]', function () {
                vm.expand(this.parentElement.getAttribute('data-code'));
            });

            this.$.on("prev.stop.click", '[data-sign="-"]', function () {
                this.parentElement.classList.remove('expand');
            });

            this.$.on('stop.click', '[data-code]', function () {
                if (this.classList.contains('active')) {
                    return;
                }

                vm.when('.active')
                    .done(function (node) {
                        node.classList.remove('active');
                    });

                this.classList.add('active');

                var node = findNode(vm, this);

                vm.invoke('select-changed', node);
            });

            if (this.miniable) {
                this.$.on('prev.stop.click', '[data-toggle="mini"]', function () {
                    vm.$.classList.toggle('tree-view-mini');
                });
            }

            if (this.type === 'none') {
                return;
            }

            var defaultCode;

            this.$.on('click', 'input', this.type.indexOf('radio') > -1
                ? function () {
                    if (defaultChecked === undefined && this.defaultChecked) {
                        return;
                    }

                    var node = findNode(vm, this);

                    if (defaultCode === node.code) {
                        return;
                    }

                    defaultCode = node.code;

                    vm.invoke('checked-changed', node, this.checked);
                }
                : function () {

                    var node = findNode(vm, this);

                    vm.invoke('checked-changed', node, this.checked);
                });
        }
    });

    return function (option) {
        return v2('tree-view', option);
    };
}));