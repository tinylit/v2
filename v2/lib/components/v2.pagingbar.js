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

    var disabledHtml = 'li.disabled>a[href="#"]{...}'.htmlCoding();

    v2.use('pagingbar', {
        pagingbar: function () {
            /** 中号（添加“pagination-sm”样式） */
            this.sm = false;
            /** 中号（添加“pagination-lg”样式） */
            this.lg = false;
            /** 循环页码 */
            this.paginationLoop = true;
            /** 上一页显示文字 */
            this.paginationPrevText = '&lsaquo;';
            /** 下一页显示文字 */
            this.paginationNextText = '&rsaquo;';
            /** 数据大小 */
            this.dataSize = 0;
            /** 每页显示条数 */
            this.pageSize = 10;
            /** 当前页码 */
            this.pageIndex = 0;
            /** 自动策划(总页数小于1时自动隐藏) */
            this.independent = true;
        },
        design: function () {
            this.visible = this.pageIndex > -1;
        },
        init: function () {
            this.base.init('ul');
        },
        build: function () {
            this.$.appendChild('(li>span[data-stamp="prev"])+li>span[data-stamp="next"]'.htmlCoding().html());

            this.$prev = this.take('[data-stamp="prev"]');

            this.$next = this.take('[data-stamp="next"]');
        },
        render: function () {
            this.$.classList.add('pagination');

            if (this.lg || this.sm) {
                this.$.classList.add(this.lg ? 'pagination-lg' : 'pagination-sm');
            }
        },
        usb: function () {
            this.base.usb();

            this.define('paginationPrevText', function (html) {
                this.$prev.empty()
                    .appendChild(html.html());
            }).define('paginationNextText', function (html) {
                this.$next.empty()
                    .appendChild(html.html());
            });

            this.totalRows = Math.ceil(this.dataSize / this.pageSize);

            this.define({
                dataSize: function (index) {

                    var totalRows = Math.ceil(index / this.pageSize);

                    if (totalRows === this.totalRows) {
                        return;
                    }

                    var index = this.pageIndex;

                    this.totalRows = totalRows;

                    if (totalRows <= index) {
                        this.go(index);
                    } else {
                        this.pagination();
                    }
                },
                pageSize: function (size) {
                    var totalRows = Math.ceil(this.dataSize / size);

                    if (totalRows === this.totalRows) {

                        this.invoke('paging-ajax', this.pageIndex, size);

                        return;
                    }

                    var index = this.pageIndex;

                    this.totalRows = totalRows;

                    if (totalRows <= index) {
                        this.go(index);
                    } else {

                        this.pagination(index, totalRows);

                        this.invoke('paging-ajax', index, size);
                    }
                }
            }, true);
        },
        pagination: function () {
            var from, to, offset,
                htmls = [],
                index = this.pageIndex,
                totalRows = this.totalRows;

            if (totalRows === 0 && this.independent) {
                this.hide();
                this.hideByIndependent = true;
                return;
            }

            this.when('a')
                .done(function (a) {
                    a.parentNode.remove();
                })
                .destroy();

            if (totalRows === 0) {
                if (!this.paginationLoop) {
                    this.$prev.parentNode.classList.add('disabled');
                    this.$next.parentNode.classList.add('disabled');
                }
                return;
            }

            if (this.hideByIndependent) {
                this.hideByIndependent = false;
                this.show();
            }

            index += 1;

            from = 1; to = index < 6 ? Math.min(totalRows, 5) : ~~(index > totalRows - 4) + 2;

            done(from, to);

            if (totalRows > 10) {
                if (index > 5) {
                    htmls.push(disabledHtml);
                }
                offset = ~~(index < 5 || index == totalRows - 4);
                from = index > (totalRows - 5) ? totalRows - offset - 4 : Math.max(to + 1, index - 1);

                done(from, to = Math.min(index + 1, totalRows - 1));

                if (index < (totalRows - 4)) {
                    htmls.push(disabledHtml);
                }
                to = Math.max(to, totalRows - offset - 2);
            }

            done(to + 1, totalRows);

            this.$prev.parentNode.after(htmls.join('').html());

            if (this.paginationLoop)
                return;

            this.$prev.parentNode.classList.toggle('disabled', index === 1);
            this.$next.parentNode.classList.toggle('disabled', index === totalRows);

            function done(i, length) {
                for (; i <= length; i++) {
                    htmls.push('<li ');
                    if (index === i) {
                        htmls.push('class="active" ');
                    }
                    htmls.push('data-role="pagination"><a href="#">' + i + '</a></li>');
                }
            }
        },
        go: function (index) {

            if (arguments.length === 0)
                return;

            var totalRows = this.totalRows;

            if (totalRows < 1)
                return;

            if (index < 0 || index >= totalRows) {

                while (index < 0) {
                    index += totalRows;
                }

                while (index >= totalRows) {
                    index -= totalRows;
                }
            }

            if (this.pageIndex === index) {
                return;
            }

            this.pageIndex = index;

            this.invoke('paging-ajax', index, this.pageSize);

            if (totalRows > 7) {

                this.pagination();
                return;
            }

            this.when('[data-role="pagination"]')
                .done(function (li, i) {
                    li.classList.toggle('active', index === i);
                })
                .destroy();

            if (this.paginationLoop)
                return;

            this.$prev.classList.toggle('disabled', index === 1);
            this.$next.classList.toggle('disabled', (index + 1) === totalRows);
        },
        prev: function () {
            this.go(this.pageIndex - 1);
        },
        next: function () {
            this.go(this.pageIndex + 1);
        },
        ready: function () {
            this.pagination();
        },
        commit: function () {
            var vm = this;

            this.$prev.on('click', function () {
                if (vm.paginationLoop || vm.pageIndex > 0) {
                    vm.prev();
                }
            });

            this.$next.on('click', function () {
                if (vm.paginationLoop || vm.totalRows > (vm.pageIndex + 1)) {
                    vm.next();
                }
            });

            this.$.on('click', 'a', function () {
                var index = this.innerHTML >>> 0;
                if (index > 0) {
                    vm.go(index - 1);
                }
            });
        }
    });

    return function (options) {
        return v2('pagingbar', options);
    };
}));