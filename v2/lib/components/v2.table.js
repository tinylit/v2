﻿(function (factory) {
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
    var
        userAgent = window.navigator.userAgent.toLowerCase(),
        isIE = /msie|trident/.test(userAgent),
        isIE8 = /msie\s+8/.test(userAgent),
        isIE9 = /msie\s+9/.test(userAgent),
        GLOBAL_ROWS_UNIQUNEID = 0;

    v2.use('table', {
        table: function () {
            /** 添加“table-bordered”样式 */
            this.border = true;
            /** 添加“table-hover”样式 */
            this.hover = true;
            /** 添加“table-condensed”样式 */
            this.condensed = false;
            /** 添加“table-striped”样式 */
            this.striped = true;

            /** 多表头 */
            this.multiple = false;

            /** 固定列头 */
            this.lockHead = false;
            /** 固定列 */
            this.lockCols = 0;

            /** 显示复选框 */
            this.checkbox = false;
            /** 支持多选 */
            this.multipleSelect = false;

            /** 索引 */
            this.pageIndex = 0;
            /** 每页条数 */
            this.pageSize = 10;
            /** 是否显示分页 */
            this.pagination = true;
            /** 是否循环分页 */
            this.paginationLoop = true;
        },
        build: function (view) {
            var vm = this;

            var htmls = ['.table-viewport>'];

            if (this.lockHead) {
                htmls.push('(.table-header>table.table)+');
            }

            htmls.push('(.table-container>(table.table>tbody)+.table-screen)');

            if (this.pagination) {
                htmls.push('+.table-pagination');
            }

            this.$viewport = this.$.appendChild(htmls.join('').htmlCoding().html());

            this.tables = this.when('.table', this.$viewport);

            this.$container = this.take('.table-container');

            this.$table = this.take('.table', this.$container);

            this.$body = this.$table.firstChild;

            this.$screen = this.take('.table-screen', this.$container);

            if (this.lockHead) {
                this.$header = this.take('.table-header', this.$viewport);
            }

            if (this.pagination) {
                this.$pagination = this.take('.table-pagination', this.$viewport);
            }

            var thead = this.thead(view);

            var html, colgroup = [];

            if (this.checkbox) {
                colgroup.push('<col align="center" valign="middle" width="36" />');
            }

            v2.each(view, function (col) {
                var width = col.width;
                colgroup.push('<col align="');
                colgroup.push(col.align || "center");
                colgroup.push('"');

                if (width) {
                    colgroup.push(' width="');

                    colgroup.push(width);

                    colgroup.push('"');
                }

                colgroup.push("/>");
            });

            html = colgroup.join('');

            this.tables.done(function (table) {
                table.insertBefore(thead.html(), table.firstChild);
                table.insertBefore(html.html(), table.firstChild);
            });

            if (this.lockCols > 0) {
                var lockCols = this.checkbox ? this.lockCols + 1 : this.lockCols;
                var html = '.table-reference'.htmlCoding();
                this.references = this.tables.map(function (table, index) {
                    var cols = 0, reference = table.cloneNode(true);

                    if (index === 0) {
                        v2.each(v2.take('th', reference, true), function (th) {

                            th.classList.add('layout-show');

                            cols += th.colSpan;

                            return cols < lockCols;
                        });
                    }

                    return table.parentNode
                        .appendChild(html.html())
                        .appendChild(reference);
                });

                this.$reference = this.take('.table-reference>.table', this.$container);
                this.$referenceBody = this.$reference.lastChild;
            }

            this.cols = this.cols || view;
        },
        thead: function (view) {
            if (this.multiple) {
                return this.complex(view);
            }
            return this.simple(view);
        },
        complex: function (view) {
            if (v2.all(view, function (option) { return option.title.indexOf('|') === -1; }))
                return this.simple(view);
            var maxRowcount = 1;

            this.cols = v2.map(view, function (col) {
                var texts = col.title.split('|');

                maxRowcount = Math.max(maxRowcount, texts.length);

                return v2.improve({
                    texts: texts
                }, col);
            });

            var nodes = []; //树结构 [{ text:"xxx", colspan:1, rowspan:1, items:[] }]
            var fn_find = function (p, t) {
                var tns = p ? p.items : nodes,
                    len = tns.length - 1;
                return len > -1 && tns[len].title === t ? tns[len] : null;
            }
            v2.each(this.cols, function (col) {
                var node, maxLevel = col.texts.length - 1;
                v2.each(col.texts, function (title, index) {

                    var n = fn_find(node, title);

                    if (n) {
                        return node = n;
                    }

                    var tn = { level: index, maxLevel: maxLevel, title: title, colspan: 1, rowspan: 1, items: [] };

                    if (node) {
                        node.items.push(tn);
                    } else {
                        nodes.push(tn);
                    }

                    if (index === maxLevel) {
                        tn.src = col;
                        col.title = title;
                    }

                    node = tn;
                });
            });

            //生成colspan
            var fn_colspan = function (tn) {
                if (tn.items.length > 0) {
                    tn.colspan = 0;
                    for (var i = tn.items.length - 1; i >= 0; i--)
                        tn.colspan += fn_colspan(tn.items[i]);
                }
                else {
                    tn.colspan = 1;
                }
                return tn.colspan;
            }

            for (var i = 0, len = nodes.length; i < len; i++)
                fn_colspan(nodes[i]);

            //由树生成到this.headerRows:{Array[Array[Object]]} 及 rowspan
            headerRows = [];
            for (var i = 0; i < maxRowcount; i++)
                headerRows[i] = [];

            var fn_tree = function (nodes) {
                v2.each(nodes, function (tn) {

                    headerRows[tn.level].push(tn);

                    if (tn.level === tn.maxLevel)
                        tn.rowspan = maxRowcount - tn.maxLevel;

                    if (tn.items.length > 0)
                        fn_tree(tn.items);
                });
            }

            fn_tree(nodes);

            var vm = this, htmls = ["<thead>"];

            v2.each(headerRows, function (headerRow, index) {
                htmls.push('<tr>');

                if (index === 0 && vm.checkbox) {
                    htmls.push('<th rowspan="');
                    htmls.push(maxRowcount);
                    htmls.push('" data-stamp="checkbox" style="vertical-align:middle;text-align:center;width:36px">');
                    if (vm.multipleSelect) {
                        htmls.push('<input data-role="head" type="checkbox"/>');
                    }
                    htmls.push('</th>');
                }

                v2.each(headerRow, function (col) {

                    htmls.push('<th');

                    if (col.src && 'tooltip' in col) {
                        htmls.push(' title="');
                        htmls.push(col.src.tooltip);
                        htmls.push('"');
                    }

                    htmls.push(' colspan="');
                    htmls.push(col.colspan);
                    htmls.push('" rowspan="');
                    htmls.push(col.rowspan);

                    htmls.push('" style="vertical-align: middle;text-align:');

                    htmls.push(col.align || "center");

                    htmls.push('"');

                    htmls.push('>');

                    htmls.push(col.title);

                    htmls.push('</th>');
                });

                htmls.push('</tr>');
            });

            htmls.push('</thead>');

            return htmls.join('');
        },
        simple: function (view) {
            var htmls = ['<thead><tr>'];

            if (this.checkbox) {
                htmls.push('<th data-stamp="checkbox" style="text-align:center;width:36px">');
                if (this.multipleSelect) {
                    htmls.push('<input data-role="head" type="checkbox"/>');
                }
                htmls.push('</th>');
            }

            v2.each(view, function (option) {

                htmls.push('<th');

                if ('tooltip' in option) {
                    htmls.push(' title="');
                    htmls.push(option.tooltip);
                    htmls.push('"');
                }

                htmls.push(' style="text-align:');

                htmls.push(option.align || "center");

                htmls.push('"');

                htmls.push('>');
                htmls.push(option.title);
                htmls.push('</th>');
            });

            htmls.push('</tr></thead>');

            return htmls.join('');
        },
        render: function () {
            var callback, vm = this;
            this.$.classList.add('table-component');
            if (this.border || this.hover || this.condensed || this.striped) {
                callback = function (table) {
                    if (vm.border) {
                        table.classList.add('table-bordered');
                    }
                    if (vm.hover) {
                        table.classList.add('table-hover');
                    }

                    if (vm.condensed) {
                        table.classList.add('table-condensed');
                    }

                    if (vm.striped) {
                        table.classList.add('table-striped');
                    }
                };

                this.tables.done(callback);

                if (this.lockCols > 0) {
                    this.references.done(callback);
                }
            }
        },
        setHeight: function (value) {
            if (this.lockHead || this.pagination) {

                if (this.lockHead) {
                    value -= this.$header.css('height');
                }

                if (this.pagination) {
                    value -= this.$pagination.css('height');
                }

                this.$container.styleCb('max-height', value);
            }

            return false;
        },
        setWidth: function (value) {
            var vm = this;
            if (this.lockHead) {
                setTimeout(function () {
                    var width = vm.$screen.css('width');
                    if (width < value) {
                        vm.$header.styleCb('max-width', width);
                    }
                }, 5);
            }

            if (this.lockCols > 0) {
                setTimeout(function () {
                    var width = vm.$table.offsetWidth;

                    if (width > value) {
                        width += 'px';
                        vm.tables.done(function (table) {
                            table.style.width = width;
                        });

                        if (vm.lockCols > 0) {
                            vm.references.done(function (table) {
                                table.style.width = width;
                            });

                            vm.$reference.parentNode.style.width = width;
                        }
                    }
                }, 5);
            }

            return false;
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
                url: null,
                method: "GET",
                params: {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize
                }
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
            var vm = this;
            var rows_id = ++GLOBAL_ROWS_UNIQUNEID;
            var hasFormat = v2.any(this.cols, function (col) { return 'format' in col; });

            this.$body
                .empty();

            if (this.lockCols > 0) {
                this.$referenceBody
                    .empty();
            }

            var lockCols = this.checkbox ? this.lockCols + 1 : this.lockCols;

            v2.each(data, function (data, index) {

                var map,
                    cels,
                    html,
                    tr = document.createElement('tr'),
                    rowIndex = index + vm.pageIndex * vm.pageSize;

                if ('rowStyle' in vm) {
                    map = vm.rowStyle(data, rowIndex);

                    if ('class' in map) {
                        tr.className = map['class'];
                    }

                    tr.styleCb(map.css);
                }

                if ('rowAttributes' in vm) {
                    v2.each(vm.rowAttributes(data, rowIndex), function (value, key) {
                        tr.setAttribute(key, value.toString());
                    });
                }

                if (hasFormat) {
                    if (vm.checkbox) {
                        if (isIE8 || isIE9) {
                            var td = document.createElement('td');

                            td.styleCb('text-align', 'center');

                            if (vm.multipleSelect) {
                                td.innerHTML = '<input type="checkbox" data-role="row" data-row="{0}"/>'.format(rowIndex);
                            } else {
                                td.innerHTML = '<input type="radio" name="__table_radio_{1}" data-role="row" data-row="{0}"/>'.format(rowIndex, rows_id);
                            }
                            tr.appendChild(td);

                        } else if (vm.multipleSelect) {
                            tr.innerHTML = '<td style="text-align:center;"><input type="checkbox" data-role="row" data-row="{0}"/></td>'.format(rowIndex);
                        } else {
                            tr.innerHTML = '<td style="text-align:center;"><input type="radio" name="__table_radio_{1}" data-role="row" data-row="{0}"/></td>'.format(rowIndex, rows_id);
                        }
                    }
                    v2.each(vm.cols, function (col) {
                        var value, td = document.createElement('td');

                        if ('align' in col) {
                            td.styleCb('text-align', col.align);
                        } else {
                            td.styleCb('text-align', 'center');
                        }

                        if ('format' in col) {

                            value = col.format(data[col.field], rowIndex, data, td);

                            if (value) {
                                td.innerHTML = value;
                            }

                        } else if (col.field in data) {
                            td.innerHTML = data[col.field];
                        }

                        tr.appendChild(td);
                    });
                } else {
                    cels = [];
                    if (vm.checkbox) {
                        if (vm.multipleSelect) {
                            cels.push('<td style="text-align:center;"><input type="checkbox" data-row="{0}"/></td>'.format(rowIndex));
                        } else {
                            cels.push('<td style="text-align:center;"><input type="radio" name="__table_radio_{1}" data-row="{0}"/></td>'.format(rowIndex, rows_id));
                        }
                    }
                    v2.each(vm.cols, function (col) {
                        cels.push('<td style="text-align:');

                        if ('align' in col) {
                            cels.push(col.align);
                        } else {
                            cels.push('center');
                        }

                        cels.push('">');

                        if (col.field in data) {
                            cels.push(data[col.field]);
                        } else {
                            cels.push('-');
                        }

                        cels.push('</td>');
                    });

                    html = cels.join('');

                    if (isIE8 || isIE9) {
                        tr.appendChild(html.html());
                    } else {
                        tr.innerHTML = html;
                    }
                }

                vm.$body.appendChild(tr);

                if (vm.lockCols > 0) {

                    var cols = 0;

                    var row = tr.cloneNode(true);

                    v2.each(row.childNodes, function (td) {

                        td.classList.add('layout-show');

                        cols += td.colSpan;

                        return cols < lockCols;
                    });

                    vm.$referenceBody
                        .appendChild(row);
                }
            });

            if (this.lockHead) {
                this.$header.styleCb('max-width', this.$screen.offsetWidth);
            }

            if (isIE) {
                var offset = 0, timer = setInterval(function () {
                    if (vm.$table.style.height == '100%') {
                        vm.$table.style.height = 'auto';
                    } else {
                        vm.$table.style.height = '100%';
                    }

                    offset++;

                    if (offset > 20) {
                        clearInterval(timer);
                    }
                }, 100);
            }

            if (this.checkbox && this.multipleSelect && this.isReady) {
                this.when('input[data-role="head"]').done(function (input) {
                    input.checked = false;
                });
            }
        },
        check: function (rowIndex) {
            if (!this.checkbox || !this.multipleSelect) return;

            var checked = this.when('[data-role="row"]')
                .then(function (input) {
                    var row = +input.getAttribute('data-row');

                    if (row === rowIndex) {
                        input.checked = true;
                    }
                }).all(function (input) { return input.checked });

            this.when('input[data-role="head"]').done(function (input) {
                input.checked = checked;
            });
        },
        uncheck: function (rowIndex) {
            if (!this.checkbox || !this.multipleSelect) return;

            this.when('[data-role="row"]')
                .then(function (input) {
                    var row = +input.getAttribute('data-row');
                    if (row === rowIndex) {
                        input.checked = false;
                    }
                }).destroy(true);

            this.when('input[data-role="head"]').done(function (input) {
                input.checked = false;
            });
        },
        uncheckAll: function () {
            if (!this.checkbox || !this.multipleSelect) return;

            this.when('[data-role="row"]')
                .done(function (input) {
                    input.checked = false;
                });

            this.when('input[data-role="head"]').done(function (input) {
                input.checked = false;
            });
        },
        checkAll: function () {
            if (!this.checkbox || !this.multipleSelect) return;

            this.when('[data-role="row"]')
                .done(function (input) {
                    input.checked = true;
                });

            this.when('input[data-role="head"]').done(function (input) {
                input.checked = true;
            });
        },
        getSelections: function () {
            if (!this.checkbox) return null;

            var input = this.when('[data-role="row"]', this.$table).one(function (input) {
                return input.checked;
            });

            if (!input) return null;

            var rowIndex = +input.getAttribute('data-row');

            return this.data[rowIndex - this.pageIndex * this.pageSize];
        },
        getAllSelections: function () {
            if (!this.checkbox) return null;

            var vm = this, minRowIndex = this.pageIndex * this.pageSize;

            return this.when('[data-role="row"]', this.$table).when(function (input) {
                return input.checked;
            }).map(function (input) {
                var rowIndex = +input.getAttribute('data-row');

                return vm.data[rowIndex - minRowIndex];
            });
        },
        commit: function () {
            var vm = this;
            if (this.checkbox) {
                if (this.multipleSelect) {
                    this.$.on('click', '[data-role="head"]', function () {
                        if (this.checked) {
                            vm.checkAll();
                        } else {
                            vm.uncheckAll();
                        }
                    });
                }

                this.$.on('click', '[data-role="row"]', function () {
                    var rowIndex = +this.getAttribute('data-row');
                    if (this.checked) {
                        vm.check(rowIndex);
                    } else {
                        vm.uncheck(rowIndex);
                    }
                });
            }

            if (this.lockCols > 0) {
                this.$container.on('scroll', function () {
                    var delta = vm.$container.scrollLeft;
                    if (vm.lockHead) {
                        vm.$header.scrollLeft = delta;
                    }
                    vm.references.done(function (table) {
                        table.style.marginLeft = delta + 'px';
                    });
                });
            }
        }
    });

    return function (options) {
        return v2('table', options);
    };
}));