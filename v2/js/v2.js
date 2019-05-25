/*!
 * JavaScript v2 v1.1.1
 * https://github.com/yepsharp/v2
 *
 ** @author hyly
 ** @date 2019-05-20
 ** @descript a valuable technology object.
 */
(function (global, factory) {
    return typeof exports === 'object' && typeof module === "object" ?
        module.exports = global.document ?
            factory(global) :
            function (window) {
                if (window.document == null) throw new Error("v2 requires a window with a document");
                return factory(window);
            } :
        factory(global);
})(this, function () {
    'use strict';

    var docElem = document.documentElement;

    var
        version = "2.0.1.0",
        rtrim = /^[\x20\t\r\n\f]+|[\x20\t\r\n\f]+$/g,
        core_trim = version.trim || function () {
            if (this == null) {
                throw new Error("Uncaught TypeError:String.prototype.trim called on null or undefined at trim.");
            }
            return String(this).replace(rtrim, "");
        };
    var rdashAlpha = /[-_]([a-z])/img,
        fcamelCase = function (_, letter) {
            return letter.toUpperCase();
        };
    var rcapitalAlpha = /([A-Z])/gm,
        furlCase = function (_, letter) {
            return "_" + letter.toLowerCase();
        },
        fkebabCase = function (_, letter) {
            return "-" + letter.toLowerCase();
        };

    var class2type = {},
        coreCards = {},
        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty;
    var core_arr = [],
        core_pop = core_arr.pop,
        core_slice = core_arr.slice,
        core_splice = core_arr.splice,
        core_concat = core_arr.concat,
        core_indexOf = core_arr.indexOf || function (item, from) {
            if (this == null) {
                throw new Error("Uncaught TypeError: Array.prototype.indexOf called on null or undefined at indexOf.");
            }
            from = from >> 0;
            var len = this.length >>> 0;
            for (var i = Math.max(from > -1 ? from : len + from, 0); i < len; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };

    function returnTrue() {
        return true;
    }
    function returnFalse() {
        return false;
    }
    function makeMap(string, ignoreCase) {
        if (ignoreCase)
            string = string.toLowerCase();

        var map = {};
        var list = string.match(rnotwhite) || [];
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true;
        }
        return ignoreCase ?
            function (val) {
                return map[val.toLowerCase()];
            } :
            function (val) {
                return map[val];
            };
    };

    function makeCache(callback, ignoreCase) {
        var value, cache = {};
        return ignoreCase ? function (string) {
            value = cache[string.toLowerCase()];
            if (value != null) return value;
            return cache[string.toLowerCase()] = callback(string);
        } : function (string) {
            value = cache[string];
            if (value != null) return value;
            return cache[string] = callback(string);
        }
    }
    function isArraylike(object) {
        if (object == null) return false;
        var length = object.length,
            type = v2.type(object);

        if (type === "function" || type === "string" || v2.isWindow(object)) {
            return false;
        }
        if (object.nodeType === 1 && length) {
            return true;
        }
        try {
            return type === "array" || length === 0 || length > 0 && typeof length === "number" && (length - 1) in object;
        } catch (_) {
            return false;
        }
    }

    function ArrayThen() {
        if (arguments.length > 0) {
            v2.each(arguments, this.add, this);
        }
    }

    ArrayThen.prototype = {
        length: 0,
        add: function (item) {
            if (item === undefined) return this;

            if (isArraylike(item)) {
                return v2.merge(this, item);
            }
            this[this.length] = item;
            this.length += 1;
            return this;
        },
        remove: function (item) {
            if (item === undefined) return -1;

            var index = core_indexOf.call(this, item);

            if (index > -1) {
                core_splice.call(this, index, 1);
            }

            return index;
        },
        when: function (callback) {
            var i = -1, item, results = [];
            while (item = this[++i]) {
                if (callback(item, i, this)) {
                    results.push(item);
                }
            }
            return v2.merge(new ArrayThen(), results);
        },
        map: function () {
            var i = -1, item, results = new ArrayThen();
            while (item = this[++i]) {
                results.add(callback(item, i, this));
            }
            return results;
        },
        then: function (callback) {
            return v2.each(this, callback);
        },
        eq: function (index) {
            return this[index < 0 ? index + this.length : index] || null;
        },
        destroy: function () {
            return core_splice.call(this, 0, this.length);
        }
    };

    ArrayThen.prototype.nth = ArrayThen.prototype.eq;
    ArrayThen.prototype.forEach = ArrayThen.prototype.then;

    function v2(tag, option) {
        if (arguments.length === 1 && v2.isPlainObject(tag)) {
            option = tag;
            tag = option.tag;
        }
        return new v2.fn.init(tag, option);
    }

    v2.type = function (object) {
        return object == null ? String(object) : (typeof object === "object" || typeof object === "function") ? class2type[core_toString.call(object)] || "object" : typeof object;
    };

    v2.extension = function (callback, array) {
        if (arguments.length === 1) {
            array = callback;
            callback = undefined;
        }
        var isArray, key, deep, option;
        var i = 1, len = array.length, target = array[0];
        if (typeof target === "boolean") {
            deep = target;
            target = array[i++];
        }
        if (target && !(typeof target === 'object' || v2.isFunction(target))) {
            target = null;
        }
        if (i === len) {
            i -= 1;
            target = this;
        }
        var extension = function (value, option) {
            if (value === option || !deep && value === undefined) return option;
            if (option && deep && ((isArray = isArraylike(option)) || v2.isPlainObject(option))) {
                return v2.extension(callback, [deep, value || (isArray ? [] : {}), option]);
            }
            return callback ? callback(value, option) : option;
        };
        while ((option = array[i++]) != null) {
            if (typeof option === "boolean") {
                deep = option;
                continue;
            }
            if (target == null) {
                target = isArraylike(option) ? [] : {};
            }
            for (key in option) {
                target[key] = extension(target[key], option[key]);
            }
        }
        return target;
    };

    var improveCallbak = function (value, option) {
        return value == null ? option : value;
    };

    v2.extend = function () {
        return v2.extension.call(this, arguments);
    };

    v2.improve = function () {
        return v2.extension.call(this, improveCallbak, arguments);
    };

    v2.extend({
        when: function () {
            return new ArrayThen(arguments);
        },
        merge: function (results, arr) {
            results = results || [];
            if (!arr) return results;
            var len = arr.length,
                i = results.length,
                j = 0;

            if (typeof len === "number") {
                for (; j < len; j++) {
                    results[i++] = arr[j];
                }
            } else {
                while (arr[j] !== undefined) {
                    results[i++] = arr[j++];
                }
            }

            results.length = i;

            return results;
        },
        each: function (object, callback, context) {
            if (!object || !callback) return object;
            var i = 0;
            if (isArraylike(object)) {
                for (var len = object.length; i < len; i++) {
                    if (callback.call(context || object, object[i], i, object) === false) break;
                }
            }
            else {
                for (i in object) {
                    if (callback.call(context || object, object[i], i, object) === false) break;
                }
            }
            return object;
        },
        any: function (object, callback, context) {
            if (!object) return false;
            var i = 0;
            if (isArraylike(object)) {
                for (var len = object.length; i < len; i++) {
                    if (callback === undefined || callback.call(context || object, object[i], i, object)) return true;
                }
            } else {
                for (i in object) {
                    if (callback === undefined || callback.call(context || object, object[i], i, object)) return true;
                }
            }
            return false;
        }
    });

    v2.extend({
        error: function (msg) {
            throw new Error(msg);
        },
        syntaxError: window.SyntaxError ? function (msg) {
            throw new SyntaxError("Unrecognized expression: " + msg);
        } : function (msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        }
    });

    v2.extend({
        trim: function (string) {
            return string == null ? "" : core_trim.call(string);
        },
        urlCase: function (string) {
            return string.replace(rcapitalAlpha, furlCase);
        },
        kebabCase: function (string) {
            return string.replace(rcapitalAlpha, fkebabCase);
        },
        camelCase: function (string) {
            string = string.replace(rdashAlpha, fcamelCase);

            var code = string.charCodeAt();

            if (code === 65 || code === 90 || code > 65 && code < 90) {
                return string.charAt(0).toLowerCase() + string.slice(1);
            }

            return string;
        },
        pascalCase: function (string) {
            string = string.replace(rdashAlpha, fcamelCase);

            var code = string.charCodeAt();

            if (code < 65 || code > 90) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

            return string;
        }
    });

    v2.extend({
        isEmpty: function (object) {
            return !object || object.length === 0;
        },
        isWindow: function (object) {
            return object != null && object.window == object;
        },
        isNumber: function (object) {
            return object - parseFloat(object) >= 0;
        },
        isString: function (object) {
            return v2.type(object) === "string";
        },
        isFunction: function (object) {
            return v2.type(object) === "function";
        },
        isEmptyObject: function (object) {
            for (var i in object) {
                return false;
            }
            return true;
        },
        isArraylike: isArraylike,
        isArray: Array.isArray || function (object) {
            return v2.type(object) === "array";
        },
        isPlainObject: function (object) {
            if (!object || v2.type(object) !== "object" || object.nodeType || v2.isWindow(object)) {
                return false;
            }
            try {
                if (object.constructor &&
                    !core_hasOwn.call(object, "constructor") &&
                    !core_hasOwn.call(object.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            var key;
            for (key in object) { }
            return key === undefined || core_hasOwn.call(object, key);
        }
    });

    v2.each(["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error"], function (item) {
        class2type["[object " + item + "]"] = item.toLowerCase();
    });

    v2.date = function (date) {
        if (!date) return new Date();
        var type = v2.type(date);
        if (type === "date") return date;
        if (type === "string") {
            type = "number";
            date = Date.parse(date.replace(/[\u0391-\uFFE5-]+/g, "/")
                .replace(/([0-9])[a-zA-Z](?=[0-9])/g, function (_, letter) {
                    return letter + " ";
                }));
        }
        if (type === "number") {
            return isNaN(date) ? new Date() : new Date(date);
        }
        return new Date();
    }
    v2.extend({
        isDate: function (date) {
            return v2.type(date) === "date";
        }
    });
    var datePart = {
        Y: /(y+)/, //年
        M: /(M+)/, //月份
        D: /(d+)/, //日
        H: /(H+)/, //小时（24小时制）
        h: /(h+)/, //小时（12小时制）
        m: /(m+)/, //分
        s: /(s+)/, //秒
        f: /(f+)/ //毫秒
    };
    v2.extend(v2.date, {
        isLeapYear: function (year) {
            return (year % 400 == 0) || (year % 4 == 0) && (year % 100 > 0);
        },
        day: function (date) {
            return v2.date(date).getDate();
        },
        dayWeek: function (date) {
            return v2.date(date).getDay();
        },
        dayYear: function (date) {
            date = v2.date(date);
            return Math.ceil((date - new Date(date.getFullYear(), 1, 1)) / (24 * 60 * 60 * 1000)) + 1;
        },
        dayCount: function (year, month) {
            if (arguments.length < 2) {
                if (!v2.isDate(year)) return -1;
                month = year.getMonth() + 1;
                year = year.getFullYear();
            }
            if (month == 2) {
                return v2.date.isLeapYear(year) ? 29 : 28;
            }
            return (month % 2 == 0 ? month < 7 : month > 8) ? 30 : 31;
        },
        week: function (date) {
            date = v2.date(date);
            return Math.ceil((date.getDate() + 6 - date.getDay()) / 7);
        },
        weekYear: function (date) {
            date = v2.date(date);
            var date2 = new Date(date.getFullYear(), 0, 1);
            var day = Math.round((date.valueOf() - date2.valueOf()) / 86400000); //24 * 60 * 60 * 1000
            return Math.ceil((day + date2.getDay()) / 7);
        },
        month: function (date) {
            return v2.date(date).getMonth() + 1;
        },
        year: function (date) {
            return v2.date(date).getFullYear();
        },
        format: function (date, fmt) {
            date = v2.date(date);
            fmt = fmt || "yyyy-MM-dd";
            var C = {
                M: date.getMonth() + 1,
                D: date.getDate(),
                H: date.getHours(),
                m: date.getMinutes(),
                s: date.getSeconds()
            };
            C.h = C.H % 12 || 12;
            if (datePart.Y.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, ('' + date.getFullYear()).substring(4 - RegExp.$1.length));
            }
            if (datePart.f.test(fmt)) {
                C.f = date.getMilliseconds();
                fmt = fmt.replace(RegExp.$1, (('000' + C.f).substr(('' + C.f).length, RegExp.$1.length) + '00').slice(0, 3));
            }
            for (var A in C) {
                if (datePart[A].test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? C[A] : ('00' + C[A]).slice(-2));
            }
            return fmt;
        }
    });

    var defineSurport,
        defineFix = function (attributes, value) {
            var _value = attributes.value || value,
                descriptor = {
                    get: attributes.get || function () {
                        return _value;
                    }
                };
            if (attributes.writable || 'set' in attributes) {
                descriptor.set = attributes.set || function (value) {
                    _value = value;
                };
            }
            return descriptor;
        },
        changeType = function (value, conversionType, valueType) {
            if (conversionType === 'null' || conversionType === 'undefined') return value;
            var type = valueType || v2.type(value);
            if (type === conversionType) return value;
            switch (conversionType) {
                case 'array':
                    if (type === 'string') {
                        return value.split(',');
                    }
                    return [value];
                case 'object':
                    if (type === 'string') {
                        return (function () {
                            var map = {};
                            var arr = value.match(rnotwhite) || [];
                            for (var i = 0; i < arr.length; i++) {
                                map[arr[i]] = true;
                            }
                            return map;
                        })();
                    }
                    if (type === 'array') return value;
                case 'string':
                    return (value === null || value === undefined) ? '' : type === 'date' ? v2.date.format(value, 'yyyy-MM-dd HH:mm:ss') : value.toString();
                case 'number':
                    if (type === 'string') return parseFloat(value);
                    if (type === 'date') return +value;
                    if (type === 'boolean') return value ? 1 : 0;
                case 'function':
                    if (type === 'string') return new Function(value);
                case 'regex':
                    if (type === 'string') return new RegExp(value);
                case 'date':
                    if (type === 'number' || type === 'string') return v2.date(value);
                case 'boolean':
                    return !!value;
            }
            throw new Error('InvalidCastException:This conversion is not supported.');
        },
        makeDescriptor = function (source, callback, beforeSetting) {
            if (callback.length === 0) {
                return {
                    get: callback
                };
            }
            var threadGet,
                threadSet,
                conversionType = v2.type(source);
            if (callback.length === 1) {
                return {
                    get: function () { return source; },
                    set: function (value) {

                        if (value === source) return;

                        value = changeType(value, conversionType);

                        if (value === source) return;

                        source = value;

                        if (threadSet) return;

                        threadSet = true;

                        if (!beforeSetting || beforeSetting.call(this, source) !== false) {
                            callback.call(this, source);
                        }

                        threadSet = false;
                    }
                };
            }
            if (callback.length === 2) {
                return {
                    get: function () {

                        if (threadGet)
                            return v2.error("Methods fall into an endless loop.");

                        threadGet = true;

                        var value = callback.call(this, source, false);

                        threadGet = false;

                        return value;
                    },
                    set: function (value) {

                        if (value === source) return;

                        value = changeType(value, conversionType);

                        if (value === source) return;

                        source = value;

                        if (threadSet) return;

                        threadSet = true;

                        if (!beforeSetting || beforeSetting.call(this, source) !== false) {
                            callback.call(this, source, true);
                        }

                        threadSet = false;
                    }
                };
            }
            v2.error("Cannot analyze a callback function with a parameter length of " + callback.length + "”.");
        };

    v2.define = function (obj, prop, attributes) {
        if (obj == null) return obj;

        if (v2.isPlainObject(prop)) {
            return v2.each(prop, function (attributes, prop) {
                return v2.define(obj, prop, attributes);
            }), obj;
        }

        var contains = prop in obj,
            source = contains ? obj[prop] : null;

        if (attributes === true) {
            attributes = {
                get: function () {
                    return source;
                },
                set: function (value) {
                    source = value;
                }
            };
        }
        if (attributes === false) {
            attributes = {
                get: function () {
                    return source;
                }
            };
        }

        if (!attributes) return false;

        if (v2.isFunction(attributes)) {
            attributes = makeDescriptor(value, attributes);
        }

        try {
            Object.defineProperty(obj, prop, attributes);
            defineSurport = true;
        } catch (e) {
            if ((defineSurport || defineSurport === undefined) && ('value' in attributes || 'writable' in attributes || 'configurable' in attributes || 'enumerable' in attributes)) {
                return v2.define(obj, name, defineFix(attributes, value));
            } else if (defineSurport) {
                throw e;
            } else {
                defineSurport = false;
                console.log('The current browser version is too low, please use a mainstream browser or IE9+.');
            }
        }

        return obj;
    };


});