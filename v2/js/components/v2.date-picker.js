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
            factory(v2kit);
}(function (v2) {
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
            /** 涉及到的控件 */
            this.touch = null;

            /** 最小时间限制 */
            this.min = new Date(1900, 0, 1); //"1900-01-01 00:00:00";
            /** 最大时间限制 */
            this.max = new Date(2099, 11, 31, 23, 59, 59, 999);// "2099-12-31 23:59:59";

            /** 对话框模式 */
            this.dialog = true;

            /** 锁定显示 */
            this.fixed = false;

            // 显示按钮
            this.showBtn = true;

            // 显示取消按钮
            this.showClearBtn = true;

            // 显示今天按钮
            this.showTodayBtn = true;

            // 显示确定按钮
            this.showOkBtn = true;

            // 自动关闭
            this.autoClose = false;

            /** 星期 */
            this.week = ["日", "一", "二", "三", "四", "五", "六"];

            /** 格式化字符串 */
            this.format = 'yyyy-MM-dd HH:mm:ss';
        },
        render: function () {
            this.base.render();
            this.$.classList.add('date-picker');

            if (this.showYmd = /y|M|d/.test(this.format)) {

                var y = '.ym.ym-y>.input-group>(span.input-group-addon[y-switch=0]>i.glyphicon.glyphicon-menu-left)+input.form-control+(.dialog.ymd.hidden>(.ymd-addon[y-switch=2]>i.glyphicon.glyphicon-menu-up)+(ul.years>li*10>a[y][href="#"])+(.ymd-addon[y-switch=3]>i.glyphicon.glyphicon-menu-down)+.clearfix)+(span.input-group-addon[y-switch=1]>i.glyphicon.glyphicon-menu-right)';

                var m = '.ym.ym-m>.input-group>(span.input-group-addon[m-switch=0]>i.glyphicon.glyphicon-menu-left)+input.form-control+(.dialog.ymd.hidden>(ul.months>li*12>a[m][href="#"]{$})+.clearfix)+(span.input-group-addon[m-switch=1]>i.glyphicon.glyphicon-menu-right)';

                var header = v2.htmlSerialize('.date-picker-header>(' + y + ')+(' + m + ')+.clearfix');

                this.$header = this.$.appendChild(header.html());

                this.$year = this.take('.ym-y .form-control', this.$header);

                this.$month = this.take('.ym-m .form-control', this.$header);

                this.$yearPicker = this.take('.ym-y .ymd', this.$header);

                this.$monthPicker = this.take('.ym-m .ymd', this.$header);

                this.$years = this.when('a', this.$yearPicker);

                this.$months = this.when('a', this.$monthPicker);

                var week = 'ul.weeks>`${for(var item<index> in week){ if(index > 0){ "+li{{{item}}}" }else{ "li{{{item}}}" } }}`'.withCb(this);

                var days = 'ul.days>li*35>a[href="#"]';

                var container = v2.htmlSerialize('.date-picker-container>(' + week + ')+(' + days + ')+.clearfix');

                this.$container = this.$.appendChild(container.html());

                this.$days = this.when('a', this.$container);
            }

            this.showHour = /H|h/.test(this.format);

            this.showMinute = /m/.test(this.format);

            this.showSec = /s/.test(this.format);

            if (this.showHms = this.showHour && (this.showSec === this.showMinute || this.showMinute)) {
                var hms = 'input.{0}.form-control+(.dialog.hms.hms-{0}.panel.panel-info.hidden>(.panel-heading>.text-center{{1}}+button[aria-close]>i.glyphicon.glyphicon-remove)+.panel-body>ul>li*{2}>a[href="#"]{^^})';
                var footer = v2.htmlSerialize('.date-picker-footer>(.input-group>span.input-group-addon{时、分、秒}+' + hms.format('h', '时', 24) + '+' + hms.format('m', '分', 60) + '+' + hms.format('s', '秒', 60) + ')+.clearfix');

                this.$footer = this.$.appendChild(footer.html());

                v2.each({ 'hour': 'h', 'minute': 'm', 'sec': 's' }, function (type, name) {
                    this['$' + name] = this.take('.' + type);
                    this['$' + name + 's'] = this.when('a', this['$' + name + 'Picker'] = this.take('.hms-' + type));
                }, this);
            }

            if (this.showBtn && (this.showBtn = this.showClearBtn || this.showTodayBtn || this.showOkBtn)) {

                var htmls = [];

                if (this.showClearBtn) {
                    htmls.push('button.btn.btn-info{取消}');
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
            } else {
                this.showClearBtn = this.showTodayBtn = this.showOkBtn = false;
            }

            var tip = '.dialog.tip.panel.panel-warning.hidden>(.panel-heading>.text-center{提示})+.panel-body';

            this.$tip = this.$.appendChild(tip.htmlCoding().html());

            this.$tipTitle = this.take('.text-center', this.$tip);

            this.$tipMsg = this.take('.panel-body', this.$tip);

            this.$dialogs = this.when('.dialog');

            if (this.dialog && (this.dialog = !!this.touch)) {
                this.$.classList.add('dialog');
            }
        },
        checkVoid: function (y, m, d) {
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
        isValid: function (ymd, hms) {
            ymd = ymd || this.ymd;
            if (arguments.length === 1) {
                hms = ymd.slice(3);
            }
            hms = hms || this.hms;
            return this.showYmd ?
                (ymd[0] > this.mins[0] || ymd[0] == this.mins[0] && (ymd[1] > this.mins[1] || (ymd[1] == this.mins[1] && ymd[2] > this.mins[2] || ymd[2] == this.mins[2] && (!this.showHms || hms[0] > this.mins[3] || hms[0] == this.mins[3] && (!this.showMinute || hms[1] > this.mins[4] || hms[1] == this.mins[4] && (!this.showSec || hms[2] >= this.mins[5])))))) &&
                (ymd[0] < this.maxs[0] || ymd[0] == this.maxs[0] && (ymd[1] < this.maxs[1] || (ymd[1] == this.maxs[1] && ymd[2] < this.maxs[2] || ymd[2] == this.maxs[2] && (!this.showHms || hms[0] < this.maxs[3] || hms[0] == this.maxs[3] && (!this.showMinute || hms[1] < this.maxs[4] || hms[1] == this.maxs[4] && (!this.showSec || hms[2] <= this.maxs[5])))))) :
                (hms[0] > this.mins[3] || hms[0] == this.mins[3] && (!this.showMinute || hms[1] > this.mins[4] || hms[1] == this.mins[4] && (!this.showSec || hms[2] >= this.mins[5]))) &&
                (hms[0] < this.maxs[3] || hms[0] == this.maxs[3] && (!this.showMinute || hms[1] < this.maxs[4] || hms[1] == this.maxs[4] && (!this.showSec || hms[2] <= this.maxs[5])));
        },
        dayRender: function () {
            this.ymd = this.value.match(/\d+/g);
            if (this.showHms) {
                this.timeView(this.ymd[3], this.ymd[4], this.ymd[5]);
            }
            if (this.showYmd) {
                this.dayView(this.ymd[0], this.ymd[1] - 1, this.ymd[2]);
            }
            this.hms = this.hms || [0, 0, 0];
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
            if (this.showHms) {
                this.$hour.value = zoreFill(h);
                this.$minute.value = zoreFill(m);
                this.$sec.value = zoreFill(s);
            }

            this.hms = [0 | h, 0 | m, 0 | s];

            if (this.showOkBtn) {
                this.$ok.classList[(this.valid = this.isValid()) ? "remove" : "add"]('disabled');
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
                if (vm.checkVoid(y, m, d)) {
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

            this.valid = this.valid && this.isValid();

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
                if (vm.checkVoid(vm.ymd[0], i + 1)) {
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
                if (!this.touch) return '';

                if ('value' in this.touch) {
                    return this.touch.value;
                }

                var elem = this.touch.$ || this.touch;

                return rinputTag.test(elem.tagName) ? elem.value : elem.innerHTML;
            };
            this.define('value', {
                get: function () {
                    value = valueCall.call(this);
                    if (!value) {
                        var date = new Date();
                        return '{0}-{1}-{2} {3}:{4}:{5}'.format(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                    }
                    if (this.showYmd && this.showHms) {
                        return value;
                    }
                    if (this.showYmd) {
                        return value + ' 00:00:00';
                    }
                    return '1900-01-01 ' + value;
                },
                set: function (value) {
                    if (value) {
                        var ymd = value.match(/\d+/g);

                        if (!((ymd.length > 3 || this.showYmd) ? this.isValid([0 | ymd[0], (0 | ymd[1]) - 1, 0 | ymd[2]], [0 | ymd[3], 0 | ymd[4], 0 | ymd[5]]) : this.isValid(null, ymd))) {
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

                        value = this.format.replace(/yyyy|MM|dd|HH|mm|ss/g, function () {
                            return ymd.index = 0 | ++ymd.index, zoreFill(ymd[ymd.index]);
                        });
                    }

                    if (!this.touch) return value;

                    if ('value' in this.touch) {
                        return this.touch.value = value;
                    }
                    var elem = this.touch.$ || this.touch;

                    return rinputTag.test(elem.tagName) ? elem.value = value : elem.innerHTML = value;
                }
            }).define({
                min: function (value) {
                    this.mins = toArray(value);
                    if (this.isReady) {
                        this.resolve();
                    }
                },
                max: function (value) {
                    this.maxs = toArray(value);
                    if (this.isReady) {
                        this.resolve();
                    }
                    if (this.showTodayBtn) {
                        this.$now.classList[value > new Date() ? 'remove' : 'add']('disabled');
                    }
                }
            });
        },
        show: function () {
            if (this.visible)
                return;
            this.base.show();
            this.resolve();
        },
        scroll: function (a) {
            return a = a ? "scrollLeft" : "scrollTop",
                doc.body[a] | docEl[a];
        },
        area: function (a) {
            return docEl[a ? "clientWidth" : "clientHeight"];
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
        resolve: function () {
            this.dayRender();
            if (!this.dialog) return;
            var elem = this.touch ? this.touch.$ || this.touch : document.body;
            var xy = elem.getBoundingClientRect(),
                l = xy.left + (this.fixed ? 0 : this.scroll(1)),
                t = xy.bottom + elem.offsetHeight / 1.5 <= this.area() ?
                    xy.bottom - 1 :
                    xy.top > elem.offsetHeight / 1.5 ?
                        xy.top - elem.offsetHeight + 1 :
                        this.area() - elem.offsetHeight;
            this.$.styleCb({
                position: this.fixed ? 'fixed' : 'absolute',
                left: l,
                top: t + (this.fixed ? 0 : this.scroll())
            });
        },
        commit: function () {
            var vm = this, valueSet = function (y, M, d, h, m, s) {
                if (arguments.length === 1 && v2.isArraylike(y)) {
                    vm.value = '{0}-{1}-{2} {3}:{4}:{5}'.format(y[0], +y[1] + 1, y[2], y[3] | 0, y[4] | 0, y[5] | 0);
                } else {
                    vm.value = '{0}-{1}-{2} {3}:{4}:{5}'.format(y, +M + 1, d, 0 | h, 0 | m, 0 | s);
                }
                if (vm.autoClose) {
                    vm.hide();
                }
            };
            if (this.showYmd) {
                this.$year.on('stop.click', function () {
                    vm.yearPicker(+this.value);
                });

                this.$month.on('stop.click', function () {
                    vm.monthPicker(+this.value - 1);
                });

                this.$header.on('stop.click', '[y-switch]', function () {
                    vm.tabYear(+this.getAttribute('y-switch'));
                });

                this.$header.on('stop.click', '[m-switch]', function () {
                    vm.tabMonth(+this.getAttribute('m-switch'));
                });

                this.$header.on('stop.click', '[y]:not(.disabled)', function () {
                    vm.hidePicker();

                    vm.dayView(+this.innerHTML, vm.ymd[1], vm.ymd[2]);
                });

                this.$header.on('stop.click', '[m]:not(.disabled)', function () {
                    vm.hidePicker();
                    vm.dayView(vm.ymd[0], +this.innerHTML - 1, vm.ymd[2]);
                });

                this.$.on('stop.click', '[d]:not(.disabled)', function () {
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

                this.$hour.on('stop.click', function () {
                    return vm.timePicker(0);
                });

                this.$minute.on('stop.click', function () {
                    return vm.timePicker(1);
                });

                this.$sec.on('stop.click', function () {
                    return vm.timePicker(2);
                });

                this.$hourPicker.on('stop.click', 'a:not(.disabled)', function () {
                    return hmsCallback(this, 0);
                });
                this.$minutePicker.on('stop.click', 'a:not(.disabled)', function () {
                    return hmsCallback(this, 1);
                });
                this.$secPicker.on('stop.click', 'a:not(.disabled)', function () {
                    return hmsCallback(this, 2);
                });
            }

            if (this.showBtn) {
                if (this.showClearBtn) {
                    this.$clear.on('stop.click', function () {
                        vm.value = '';

                        if (vm.dialog) {
                            vm.hide();
                        }
                    });
                }

                if (this.showTodayBtn) {
                    this.$now.on('stop.click', function () {
                        valueSet(toArray(new Date()));
                    });
                }

                if (this.showOkBtn) {
                    this.$ok.on('stop.click', function () {
                        valueSet(vm.ymd[0], vm.ymd[1], vm.ymd[2], vm.hms[0], vm.hms[1], vm.hms[2]);
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

            if (this.touch && this.touch.version == v2.version) {
                this.touch.$.on('click', function () {
                    vm.min = vm.touch.invoke("date-min");
                    vm.max = vm.touch.invoke("date-max")
                    vm.show();
                });
            }
        }
    });

    document.body.on('click', function (e) {
        var elem = e.target || e.srcElement;
        v2.each(v2.GDir('date-picker'), function (vm) {
            var touch = vm.touch && vm.touch.$ || vm.touch;

            if (!touch || !vm.dialog) return;

            if (elem === touch || v2.contains(touch, elem)) {
                vm.hide();
            }
        });
    });

    return function (options) {
        return v2('date-picker', options);
    };
}));