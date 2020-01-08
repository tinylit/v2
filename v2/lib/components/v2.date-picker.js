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
            factory(v2kit);
}(function (/** @type Use.V2 */v2) {
    var
        doc = document,
        docEl = doc.documentElement;

    function isLeapYear(y) {
        return (y % 400 == 0) || (y % 4 == 0) && (y % 100 > 0);
    }
    function dayCount(y, m) {
        if (m === 2) return isLeapYear(y) ? 29 : 28;
        return (m % 2 == 0 ? m < 7 : m > 8) ? 30 : 31;
    }
    function zoreFill(a) {
        return (a = 0 | a) ? a > 9 ? a : '0' + a : '00';
    }
    function toArray(date) {
        return [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
    }
    var rinputTag = /textarea|input/i;

    v2.use("date-picker", {
        datePicker: function () {

            /** 最小时间限制 */
            this.min = new Date(1900, 0, 1); //"1900-01-01 00:00:00";
            /** 最大时间限制 */
            this.max = new Date(2099, 11, 31, 23, 59, 59, 999);// "2099-12-31 23:59:59";

            /** 对话框模式 */
            this.dialog = true;

            /** 锁定显示 */
            this.fixed = false;

            /** 显示按钮 */
            this.showBtn = true;

            /** 显示取消按钮 */
            this.showClearBtn = true;

            /** 显示今天按钮 */
            this.showTodayBtn = true;

            /** 显示确定按钮 */
            this.showOkBtn = true;

            /** 自动关闭 */
            this.autoClose = false;

            /** 自动策划 */
            this.independent = false;

            /** 星期 */
            this.week = ["日", "一", "二", "三", "四", "五", "六"];

            /** 格式化字符串 */
            this.format = 'yyyy-MM-dd HH:mm:ss';
        },
        design: function () {

            this.showYmd = /y|M|d/.test(this.format);

            this.showHour = /H|h/.test(this.format);

            this.showMinute = /m/.test(this.format);

            this.showSec = /s/.test(this.format);

            this.showHms = this.showHour || this.showMinute || this.showSec;

            if (!this.showBtn || !(this.showBtn = this.showClearBtn || this.showTodayBtn || this.showOkBtn)) {
                this.showClearBtn = this.showTodayBtn = this.showOkBtn = false;
            }

            if (this.dialog) {
                this.dialog = !!(this.request || this.host);
            }
        },
        build: function () {
            var htmls;
            if (this.showYmd) {

                var y = '.ym.ym-y>.input-group>(span.input-group-addon[y-switch=0]>i.glyphicon.glyphicon-menu-left)+input.form-control[readonly]+(.dialog.ymd.hidden>(.ymd-addon[y-switch=2]>i.glyphicon.glyphicon-menu-up)+(ul.years>li*10>a[y][href="#"])+(.ymd-addon[y-switch=3]>i.glyphicon.glyphicon-menu-down)+.clearfix)+(span.input-group-addon[y-switch=1]>i.glyphicon.glyphicon-menu-right)';

                var m = '.ym.ym-m>.input-group>(span.input-group-addon[m-switch=0]>i.glyphicon.glyphicon-menu-left)+input.form-control[readonly]+(.dialog.ymd.hidden>(ul.months>li*12>a[m][href="#"]{$})+.clearfix)+(span.input-group-addon[m-switch=1]>i.glyphicon.glyphicon-menu-right)';

                var header = v2.htmlSerialize('.date-picker-header>(' + y + ')+(' + m + ')+.clearfix');

                this.$header = this.$.appendChild(header.html());

                this.$year = this.take('.ym-y .form-control', this.$header);

                this.$month = this.take('.ym-m .form-control', this.$header);

                this.$yearPicker = this.take('.ym-y .ymd', this.$header);

                this.$monthPicker = this.take('.ym-m .ymd', this.$header);

                this.$years = this.when('a', this.$yearPicker);

                this.$months = this.when('a', this.$monthPicker);

                var week = 'ul.weeks>`${for(var item<index> in week){ if(index > 0){ $"+li{{item}}" }else{ $"li{{item}}" } }}`'.withCb(this);

                var days = 'ul.days>li*35>a[href="#"]';

                var container = v2.htmlSerialize('.date-picker-container>(' + week + ')+(' + days + ')+.clearfix');

                this.$container = this.$.appendChild(container.html());

                this.$days = this.when('a', this.$container);
            }

            if (this.showHms) {
                var hms = '(.dialog.hms.hms-{0}.panel.panel-info.hidden>(.panel-heading>.text-center{{1}}+button[aria-close]>i.glyphicon.glyphicon-remove)+.panel-body>ul>li*{2}>a[href="#"]{^^})+input.hms-txt-{0}.form-control[readonly]';

                var names = ['时'];
                htmls = [hms.format('h', '时', 24)];

                if (this.showMinute) {
                    names.push('分');
                    htmls.push(hms.format('m', '时', 60));
                }

                if (this.showSec) {
                    names.push('秒');
                    htmls.push(hms.format('s', '秒', 60));
                }

                htmls.unshift('span.input-group-addon{{0}}'.format(names.join('、')));

                var footer = v2.htmlSerialize('.date-picker-footer>(.input-group>' + htmls.join('+') + ')+.clearfix');

                this.$footer = this.$.appendChild(footer.html());

                v2.each({ 'hour': 'h', 'minute': 'm', 'sec': 's' }, function (type, name) {
                    this['$' + name] = this.take('.hms-txt-' + type);
                    this['$' + name + 's'] = this.when('a', this['$' + name + 'Picker'] = this.take('.hms-' + type));
                }, this);

                this.$footer.classList.add(names.length > 2 ? 'hms-three' : names.length > 1 ? 'hms-two' : 'hms-only');
            }

            if (this.showBtn) {

                htmls = [];

                if (this.showClearBtn) {
                    htmls.push('button.btn.btn-info{清除}');
                }

                if (this.showTodayBtn) {
                    htmls.push('button.btn.btn-success{今天}');
                }

                if (this.showOkBtn) {
                    htmls.push('button.btn.btn-primary{确定}');
                }

                htmls.push('.clearfix');

                var btn = '.date-picker-btn>.btn-group.pull-right>' + htmls.join('+');

                this.$btn = this.$.appendChild(btn.htmlCoding().html());

                if (this.showClearBtn) {
                    this.$clear = this.take('.btn-info', this.$btn);
                }
                if (this.showTodayBtn) {
                    this.$now = this.take('.btn-success', this.$btn);
                }
                if (this.showOkBtn) {
                    this.$ok = this.take('.btn-primary', this.$btn);
                }
            }

            var tip = '.dialog.tip.panel.panel-warning.hidden>(.panel-heading>.text-center{提示})+.panel-body';

            this.$tip = this.$.appendChild(tip.htmlCoding().html());

            this.$tipTitle = this.take('.text-center', this.$tip);

            this.$tipMsg = this.take('.panel-body', this.$tip);

            this.$dialogs = this.when('.dialog');
        },
        render: function () {
            this.$.classList.add('date-picker');

            if (this.dialog) {
                this.$.classList.add('dialog');
            }
        },
        dateVoid: function (y, m, d) {
            var r;
            return y = 0 | y, m = (0 | m) - 1, d = 0 | d,
                y < this.mins[0] ? r = 'y' :
                    y > this.maxs[0] ? r = 'y' :
                        y >= this.mins[0] && y <= this.maxs[0] && (
                            y == this.mins[0] && (
                                m < this.mins[1] ? r = 'm' :
                                    m == this.mins[1] && d < this.mins[2] && (r = "d")
                            ),
                            y == this.maxs[0] && (
                                m > this.maxs[1] ? r = 'm' :
                                    m == this.maxs[1] && d > this.maxs[2] && (r = 'd')
                            )
                        ), r === 'y' || r === 'm' || arguments.length > 2 && r === 'd';
        },
        timeVoid: function (value, hms/*0:时,1:分，2:秒*/) {
            return this.showYmd ?
                (this.ymd[0] < this.mins[0] || this.ymd[0] == this.mins[0] && (this.ymd[1] < this.mins[1] || this.ymd[1] == this.mins[1] && (this.ymd[2] < this.mins[2] || this.ymd[2] == this.mins[2] && (hms > 0 && this.hms[0] < this.mins[3] || (hms < 1 || this.hms[0] == this.mins[3]) && (hms > 1 ? (this.hms[1] < this.mins[4] || this.hms[1] == this.mins[4] && this.mins[3 + hms] > value) : this.mins[3 + hms] > value))))) ||
                (this.ymd[0] > this.maxs[0] || this.ymd[0] == this.maxs[0] && (this.ymd[1] > this.maxs[1] || this.ymd[1] == this.maxs[1] && (this.ymd[2] > this.maxs[2] || this.ymd[2] == this.maxs[2] && (hms > 0 && this.hms[0] > this.maxs[3] || (hms < 1 || this.hms[0] == this.maxs[3]) && (hms > 1 ? (this.hms[1] > this.maxs[4] || this.hms[1] == this.maxs[4] && this.maxs[3 + hms] < value) : this.maxs[3 + hms] < value))))) :
                (hms > 0 && this.hms[0] < this.mins[3] || (hms < 1 || this.hms[0] == this.mins[3]) && (hms > 1 ? (this.hms[1] < this.mins[4] || this.hms[1] == this.mins[4] && this.mins[3 + hms] > value) : this.mins[3 + hms] > value)) ||
                (hms > 0 && this.hms[0] > this.maxs[3] || (hms < 1 || this.hms[0] == this.maxs[3]) && (hms > 1 ? (this.hms[1] > this.maxs[4] || this.hms[1] == this.maxs[4] && this.maxs[3 + hms] < value) : this.maxs[3 + hms] < value));
        },
        checkVoid: function (ymd, hms) {
            ymd = ymd || this.ymd;
            if (arguments.length === 1) {
                hms = Array.prototype.slice.call(ymd, 3);
            }
            hms = hms || this.hms;
            return this.showYmd ?
                (ymd[0] > this.mins[0] || ymd[0] == this.mins[0] && (ymd[1] > this.mins[1] || (ymd[1] == this.mins[1] && ymd[2] > this.mins[2] || ymd[2] == this.mins[2] && (!this.showHms || hms[0] > this.mins[3] || hms[0] == this.mins[3] && (!this.showMinute || hms[1] > this.mins[4] || hms[1] == this.mins[4] && (!this.showSec || hms[2] >= this.mins[5])))))) &&
                (ymd[0] < this.maxs[0] || ymd[0] == this.maxs[0] && (ymd[1] < this.maxs[1] || (ymd[1] == this.maxs[1] && ymd[2] < this.maxs[2] || ymd[2] == this.maxs[2] && (!this.showHms || hms[0] < this.maxs[3] || hms[0] == this.maxs[3] && (!this.showMinute || hms[1] < this.maxs[4] || hms[1] == this.maxs[4] && (!this.showSec || hms[2] <= this.maxs[5])))))) :
                (hms[0] > this.mins[3] || hms[0] == this.mins[3] && (!this.showMinute || hms[1] > this.mins[4] || hms[1] == this.mins[4] && (!this.showSec || hms[2] >= this.mins[5]))) &&
                (hms[0] < this.maxs[3] || hms[0] == this.maxs[3] && (!this.showMinute || hms[1] < this.maxs[4] || hms[1] == this.maxs[4] && (!this.showSec || hms[2] <= this.maxs[5])));
        },
        tabMonth: function (type) {//0:左、1:右
            this.hidePicker();
            var y = this.ymd[0], m = this.ymd[1] + (type ? 1 : -1), d = this.ymd[2];
            this.dayView(m < 0 ? y -= 1 : m > 11 ? y += 1 : y, m = m < 0 ? 11 : m > 11 ? 0 : m, (d < 29 || (y = dayCount(y, m + 1)) > d) ? d : y);
        },
        tabYear: function (type) {//0:左、1:右、2:上、3:下
            if ((type & 1) === 0) {
                this.year -= type > 1 ? 10 : 1;
            } else {
                this.year += type > 1 ? 10 : 1;
            }
            if (type > 1) {
                this.yearPicker(this.year);
            } else {
                this.hidePicker();
                this.dayView(this.year, this.ymd[1], this.ymd[2]);
            }
        },
        timeView: function (h, m, s) {
            if (this.showHour) {
                this.$hour.value = zoreFill(h);
            }
            if (this.showMinute) {
                this.$minute.value = zoreFill(m);
            }
            if (this.showSec) {
                this.$sec.value = zoreFill(s);
            }

            this.hms = [0 | h, 0 | m, 0 | s];

            if (this.showOkBtn) {
                this.$ok.classList[(this.valid = this.checkVoid()) ? "remove" : "add"]('disabled');
            }
        },
        dayView: function (y, m, d) {
            // 年份小于最小年份或大于最大年份处理
            y < (0 | this.mins[0]) && (y = 0 | this.mins[0]);
            y > (0 | this.maxs[0]) && (y = 0 | this.maxs[0]);

            y == (0 | this.mins[0]) && m < (0 | this.mins[1]) && (m = 0 | this.mins[1]);
            y == (0 | this.maxs[0]) && m > (0 | this.maxs[1]) && (m = 0 | this.maxs[1]);

            var vm = this, g = new Date(y, m, d), gb = {};

            vm.ymd = [g.getFullYear(), g.getMonth(), g.getDate()];

            g.setFullYear(vm.ymd[0], vm.ymd[1], 1);

            gb.FDay = g.getDay();
            gb.PDays = dayCount(y, m);
            gb.PDay = gb.PDays - gb.FDay + 1;
            gb.NDays = dayCount(y, m + 1);
            gb.NDay = 1;

            this.valid = true;
            this.$days.then(function (a, i) {
                var y = vm.ymd[0], m = vm.ymd[1] + 1, d;
                if (i < gb.FDay) {
                    a.className = 'last-month';
                    a.innerHTML = d = gb.PDay + i;
                    if (m === 1) {
                        y -= 1;
                        m = 12;
                    } else {
                        m -= 1;
                    }
                } else if ((gb.FDay + gb.NDays) > i) {
                    a.innerHTML = d = i - gb.FDay + 1;
                    a.className = d == vm.ymd[2] ? 'active' : '';
                } else {
                    a.className = 'follow-month';
                    a.innerHTML = d = gb.NDay++;
                    if (m === 12) {
                        m = 1;
                        y += 1;
                    } else {
                        m += 1;
                    }
                }
                if (vm.dateVoid(y, m, d)) {
                    if ((+vm.ymd[1] + 1) === m && d === +vm.ymd[2]) {
                        vm.valid = false;
                    }
                    a.classList.add('disabled');
                }
                a.setAttribute('y', y);
                a.setAttribute('m', m - 1);
                a.setAttribute('d', d);
            });

            this.$year.value = this.year = 0 | y;
            this.$month.value = +m + 1;

            this.valid = this.valid && this.checkVoid();

            if (this.showOkBtn) {
                this.$ok.classList[this.valid ? "remove" : "add"]('disabled');
            }
        },
        hidePicker: function () {
            this.$dialogs.then(function (div) {
                div.classList.add('hidden');
            });
        },
        timePicker: function (type) {//0:时、1:分、2:秒
            var when, vm = this;

            this.hidePicker();

            switch (type) {
                case 0:
                    this.$hourPicker
                        .classList
                        .remove('hidden');

                    when = this.$hours;
                    break;
                case 1:
                    this.$minutePicker
                        .classList
                        .remove('hidden');

                    when = this.$minutes;
                    break;
                case 2:
                    this.$secPicker
                        .classList
                        .remove('hidden');

                    when = this.$secs;
                    break;
                default:
                    return false;
            }

            when.then(function (a, i) {
                if (vm.timeVoid(i, type)) {
                    a.className = 'disabled';
                } else {
                    a.className = i == vm.hms[type] ? 'active' : '';
                }
            });

            return false;
        },
        monthPicker: function (m) {
            var vm = this;

            this.hidePicker();

            this.$monthPicker
                .classList
                .remove('hidden');

            m = 0 | m;
            this.$months.then(function (a, i) {
                if (vm.dateVoid(vm.ymd[0], i + 1)) {
                    a.className = 'disabled';
                } else {
                    a.className = i == m ? 'active' : '';
                }
            });
        },
        yearPicker: function (y) {
            var vm = this,
                year = vm.ymd[0];

            this.hidePicker();

            this.$yearPicker
                .classList
                .remove('hidden');

            var k = 10 * parseInt(y / 10);

            this.$years.then(function (a, i) {
                i = k + i;
                if (vm.mins[0] > i || i > vm.maxs[0]) {
                    a.className = 'disabled';
                } else {
                    a.className = i === year ? 'active' : '';
                }
                a.innerHTML = i;
            });
        },
        usb: function () {
            this.base.usb();
            var value, valueCall = function () {
                var elem = this.request;

                if (elem) {
                    return rinputTag.test(elem.tagName) ? elem.value : elem.innerHTML;
                }

                if (this.host) {

                    if ('value' in this.host) {
                        return this.host.value;
                    }

                    elem = this.host.$core || this.host['$' + this.host.tag] || this.host.$;

                    if (rinputTag.test(elem.tagName)) {
                        return elem.value;
                    }
                }

                return '';
            };

            this.define('value', {
                get: function () {
                    value = valueCall.call(this);
                    if (!value) {
                        var date = new Date();
                        return '{0}-{1}-{2} {3}:{4}:{5}'.format(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                    }

                    if (this.showYmd && this.showHour && this.showMinute && this.showSec) {
                        return value;
                    }

                    var vm = this, index = 0, ymd = value.match(/\d+/g);

                    if (ymd.length === 6) return value;

                    return 'yyyy-MM-dd HH:mm:ss'.replace(/yyyy|MM|dd|HH|mm|ss/g, function (pattern) {
                        if ((pattern === 'yyyy' || pattern === 'MM' || pattern === 'dd') && vm.showYmd ||
                            pattern === 'HH' && vm.showHour ||
                            pattern === 'mm' && vm.showMinute ||
                            pattern === 'ss' && vm.showSec) {
                            return zoreFill(ymd[index++]);
                        }
                        return '0';
                    });
                },
                set: function (value) {
                    if (value) {
                        var ymd = value.match(/\d+/g);

                        if (!((ymd.length > 3 || this.showYmd) ? this.checkVoid([0 | ymd[0], (0 | ymd[1]) - 1, 0 | ymd[2]], [0 | ymd[3], 0 | ymd[4], 0 | ymd[5]]) : this.checkVoid(null, ymd))) {
                            return this.tip('日期超出限制范围!');
                        }

                        if (this.showYmd) {
                            this.dayView(ymd[0], ymd[1] - 1, ymd[2]);
                        } else {
                            ymd = ymd.slice(3);
                        }

                        if (this.showHms) {
                            if (ymd.length > 3) {
                                this.timeView(ymd[3] | 0, ymd[4] | 0, ymd[5] | 0);
                            } else {
                                this.timeView(ymd[0], ymd[1] | 0, ymd[2] | 0);
                            }
                        }

                        value = v2.date.format(value, this.format);
                    }

                    var elem = this.response;

                    if (elem) {
                        return rinputTag.test(elem.tagName) ? elem.value = value : elem.innerHTML = value;
                    }

                    if (this.host) {
                        if ('value' in this.host) {
                            if (this.host.valueSetter) {
                                return this.host.valueSetter(value), value;
                            } else {
                                return this.host.value = value;
                            }
                        }

                        elem = this.host.$core || this.host['$' + this.host.tag] || this.host.$;

                        if (rinputTag.test(elem.tagName)) {
                            return elem.value = value;
                        }
                    }

                    return value;
                }
            });

            this.define({
                min: function (value) {
                    this.mins = toArray(value);
                    if (this.isReady) {
                        this.load();
                    }
                },
                max: function (value) {
                    this.maxs = toArray(value);
                    if (this.isReady) {
                        this.load();
                    }
                    if (this.showTodayBtn) {
                        this.$now.classList[value > new Date() ? 'remove' : 'add']('disabled');
                    }
                }
            });
        },
        show: function () {

            if (!this.dialog && this.visible)
                return;

            this.base.show();

            if (!this.dialog)
                return;

            this.load();

            var
                elem = this.request || this.host && this.host.$ || document.body,
                xy = elem.getBoundingClientRect(),
                top = xy.top - docEl.clientTop + docEl.scrollTop,//document.documentElement.clientTop 在IE67中始终为2，其他高级点的浏览器为0
                bottom = xy.bottom,
                left = xy.left - docEl.clientLeft + docEl.scrollLeft,//document.documentElement.clientLeft 在IE67中始终为2，其他高级点的浏览器为0
                height = this.$.offsetHeight,
                y = (this.fixed ? doc.scrollTop || docEl.scrollTop : 0) + docEl.clientHeight,
                t = (bottom + height) > y ? top - height : bottom;

            this.$.styleCb({
                position: this.fixed ? 'fixed' : 'absolute',
                left: left,
                top: t
            });
        },
        tip: function (msg, title) {
            var vm = this;

            this.hidePicker();

            this.$tipTitle.innerHTML = title || '提示';

            this.$tipMsg.innerHTML = msg;

            this.$tip
                .classList.remove('hidden');

            if (this.tipTimer) {
                clearTimeout(this.tipTimer);
                this.tipTimer = 0;
            }
            this.tipTimer = setTimeout(function () {
                vm.tipTimer = 0;
                vm.$tip.classList.add('hidden');
            }, 1200);
        },
        load: function (value) {
            this.ymd = (value || v2.usb(this, "value")).match(/\d+/g);
            if (this.showHms) {
                this.timeView(this.ymd[3], this.ymd[4], this.ymd[5]);
            }
            if (this.showYmd) {
                this.dayView(this.ymd[0], this.ymd[1] - 1, this.ymd[2]);
            }
            this.hms = this.hms || [0, 0, 0];
        },
        commit: function () {
            var vm = this, valueSet = function (y, M, d, h, m, s) {
                if (arguments.length === 1 && v2.isArraylike(y)) {
                    if (vm.valueSetter) {
                        vm.valueSetter('{0}-{1}-{2} {3}:{4}:{5}'.format(y[0], +y[1] + 1, y[2], y[3] | 0, y[4] | 0, y[5] | 0));
                    } else {
                        vm.value = '{0}-{1}-{2} {3}:{4}:{5}'.format(y[0], +y[1] + 1, y[2], y[3] | 0, y[4] | 0, y[5] | 0);
                    }
                } else {
                    if (vm.valueSetter) {
                        vm.valueSetter('{0}-{1}-{2} {3}:{4}:{5}'.format(y, +M + 1, d, 0 | h, 0 | m, 0 | s));
                    } else {
                        vm.value = '{0}-{1}-{2} {3}:{4}:{5}'.format(y, +M + 1, d, 0 | h, 0 | m, 0 | s);
                    }
                }

                if (vm.autoClose) {
                    vm.hide();
                }
            };

            if (this.showYmd) {
                this.$year.on('stop.click', function () {
                    if (vm.$yearPicker
                        .classList
                        .contains('hidden')) {
                        vm.yearPicker(+this.value);
                    } else {
                        vm.$yearPicker
                            .classList
                            .add('hidden');
                    }
                });

                this.$month.on('stop.click', function () {
                    if (vm.$monthPicker
                        .classList
                        .contains('hidden')) {
                        vm.monthPicker(+this.value - 1);
                    } else {
                        vm.$monthPicker
                            .classList
                            .add('hidden');
                    }
                });

                this.$header.on('stop.click', '[y-switch]', function () {
                    vm.tabYear(+this.getAttribute('y-switch'));
                });

                this.$header.on('stop.click', '[m-switch]', function () {
                    vm.tabMonth(+this.getAttribute('m-switch'));
                });

                this.$header.on('stop.click', '[y]', function () {
                    if (this.classList.contains('.disabled')) {
                        return;
                    }

                    vm.hidePicker();

                    vm.dayView(+this.innerHTML, vm.ymd[1], vm.ymd[2]);
                });

                this.$header.on('stop.click', '[m]', function () {
                    if (this.classList.contains('.disabled')) {
                        return;
                    }
                    vm.hidePicker();
                    vm.dayView(vm.ymd[0], +this.innerHTML - 1, vm.ymd[2]);
                });

                this.$.on('stop.click', '[d]', function () {
                    if (this.classList.contains('.disabled')) {
                        return;
                    }
                    vm.hidePicker();
                    if (vm.showHms && vm.showBtn) {
                        vm.dayView(+this.getAttribute('y'), +this.getAttribute('m'), +this.getAttribute('d'));
                    } else {
                        valueSet(this.getAttribute('y'), +this.getAttribute('m'), this.getAttribute('d'));
                    }
                });
            }

            if (this.showHms) {
                var hmsCallback = function (elem, hms) {
                    vm.hidePicker();
                    vm.hms[hms] = +elem.innerHTML;

                    if (vm.showBtn) {
                        vm.timeView(vm.hms[0], vm.hms[1], vm.hms[2]);
                    } else {
                        valueSet(vm.ymd[0], vm.ymd[1], vm.ymd[2], vm.hms[0], vm.hms[1], vm.hms[2]);
                    }
                };

                if (this.showHour) {
                    this.$hour.on('stop.click', function () {
                        return vm.timePicker(0);
                    });
                    this.$hourPicker.on('stop.click', 'a', function () {
                        if (this.classList.contains('.disabled')) {
                            return;
                        }
                        return hmsCallback(this, 0);
                    });
                }

                if (this.showMinute) {
                    this.$minute.on('stop.click', function () {
                        return vm.timePicker(1);
                    });

                    this.$minutePicker.on('stop.click', 'a', function () {
                        if (this.classList.contains('.disabled')) {
                            return;
                        }
                        return hmsCallback(this, 1);
                    });
                }

                if (this.showSec) {
                    this.$sec.on('stop.click', function () {
                        return vm.timePicker(2);
                    });
                    this.$secPicker.on('stop.click', 'a', function () {
                        if (this.classList.contains('.disabled')) {
                            return;
                        }
                        return hmsCallback(this, 2);
                    });
                }
            }

            if (this.showBtn) {
                if (this.showClearBtn) {
                    this.$clear.on('stop.click', function () {
                        if (vm.valueSetter) {
                            vm.valueSetter('');
                        } else {
                            vm.value = '';
                        }

                        if (vm.dialog) {
                            vm.hide();
                        }
                    });
                }

                if (this.showTodayBtn) {
                    this.$now.on('stop.click', function () {
                        valueSet(toArray(new Date()));

                        if (vm.dialog) {
                            vm.hide();
                        }
                    });
                }

                if (this.showOkBtn) {
                    this.$ok.on('stop.click', function () {
                        valueSet(vm.ymd[0], vm.ymd[1], vm.ymd[2], vm.hms[0], vm.hms[1], vm.hms[2]);

                        if (vm.dialog) {
                            vm.hide();
                        }
                    });
                }
            }

            this.$.on('stop.click', '[aria-close]', function () {
                for (var node = this; node; node = node.parentNode) {
                    if (node.classList.contains('dialog')) {
                        node.classList.add('hidden');
                        return false;
                    }
                }
                return false;
            });

            this.$.on('stop.click', function (e) {
                if (vm.showYmd && v2.contains(vm.$header, e.target) || vm.showHms && v2.contains(vm.$footer, e.target))
                    return false;

                vm.hidePicker();
            });

            if (this.deployment) {
                this.deployment.on('click', this.host ? function () {
                    hideAll();
                    vm.min = vm.host.invoke("date-min");
                    vm.max = vm.host.invoke("date-max")
                    vm.show();
                } : function () {
                    hideAll();
                    vm.show();
                });

            } else if (this.host && this.independent) {
                var core = this.host.$core || this.host['$' + this.host.tag] || this.host.$;
                core.on('click', function () {
                    hideAll();
                    vm.min = vm.host.invoke("date-min");
                    vm.max = vm.host.invoke("date-max")
                    vm.show();
                });
            }
        }
    });

    v2.subscribe(document, 'click', function (e) {
        var elem = e.target || e.srcElement;
        v2.each(v2.GDir('date-picker'), function (vm) {
            var touch = vm.host && vm.host.$ || vm.deployment;

            if (!vm.visible) return;

            if (!touch || !vm.dialog || elem === touch || v2.contains(touch, elem)) {
                vm.hidePicker();
            } else {
                vm.hide();
            }
        });
    });

    function hideAll() {
        v2.GDir('date-picker').when(function (vm) {
            return vm.visible;
        }).done(function (vm) {
            vm.hide();
        }).destroy();
    }

    return function (options) {
        return v2('date-picker', options);
    };
}));