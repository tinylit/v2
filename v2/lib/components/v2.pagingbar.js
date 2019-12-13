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
            this.pageIndex = -1;
        },
        design: function () {
            this.visible = this.pageIndex > -1;
        },
        render: function () {
            this.$.classList.add('pagination');

            if (this.lg || this.sm) {
                this.$.classList.add(this.lg ? 'pagination-lg' : 'pagination-sm');
            }
        },
        build: function () {
            this.$ul = this.appendChild('ul>(li>span[data-stamp="prev"])+li>span[data-stamp="next"]'.htmlCoding().html());

            this.$prev = this.take('[data-stamp="prev"]', this.$ul);

            this.$next = this.take('[data-stamp="next"]', this.$ul);
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

            this.totalRows = 0;

            this.define({
                dataSize: function (index) {
                    this.totalRows = Math.ceil(index / this.pageSize);

                    this.go(this.pageIndex);
                },
                pageSize: function (size) {

                    this.totalRows = Math.ceil(this.dataSize / size);

                    this.go(this.pageIndex);
                }
            }, true);

            this.define('pageIndex', function (index) {
                this.go(index);
            });
        },
        go: function (index) {
            var totalRows = this.totalRows;

            if (totalRows < 1)
                return;

            index = index || this.pageIndex;

            if (this.paginationLoop) {
                while (index < 0) {
                    index += totalRows;
                }

                while (index > totalRows) {
                    index -= totalRows;
                }
            }

            if (index < 0 || index > totalRows)
                return;


        },
        commit: function () {
            var vm = this;

            this.$prev.on('click', function () {
                vm.go(vm.pageIndex - 1);
            });

            this.$next.on('click', function () {
                vm.go(vm.pageIndex + 1);
            });

            this.$.on('click', 'a', function () {
                vm.go(+this.innerHTML);
            });
        }
    });

    return function (options) {
        return v2('pagingbar', options);
    };
}));