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
                if (window.document === null || window.document === undefined) throw new Error("v2 requires a window with a document");
                return factory(window);
            } :
        factory(global);
})(this, function (window) {
    'use strict';

    var
        version = "2.0.1.0",
        rtrim = /^[\x20\t\r\n\f]+|[\x20\t\r\n\f]+$/g,
        core_trim = version.trim || function () {
            if (this === null || this === undefined) {
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

    var
        runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
        funescape = function (_, letter) {
            var high = "0x" + letter - 0x10000;
            return high === high ?
                high < 0 ?
                    String.fromCharCode(high + 0x10000) :
                    String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00) :
                letter;
        };

    var timestamp = +new Date(),
        class2type = {},
        coreCards = {},
        baseCards = {},
        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty;

    var core_arr = [],
        core_join = core_arr.join,
        core_slice = core_arr.slice,
        core_splice = core_arr.splice,
        core_concat = core_arr.concat,
        core_indexOf = core_arr.indexOf || function (item, from) {
            if (this === null || this === undefined) {
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
    }

    function makeCache(callback, ignoreCase) {
        var value, cache = {};
        return ignoreCase ? function (string) {
            value = cache[string.toLowerCase()];
            if (value === undefined)
                return cache[string.toLowerCase()] = callback(string);
            return value;
        } : function (string) {
            value = cache[string];
            if (value === undefined)
                return cache[string] = callback(string);
            return value;
        };
    }

    var tag = "[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*";
    var rany = /\*/g,
        rtag = new RegExp("^" + tag + "$", "i"),
        rnamespace = new RegExp("^(?:(" + tag + "(?:\\.(?:" + tag + "|\\*))*" + ")\\.)?(" + tag + ")$", "i"),
        rnamespaceGet = new RegExp("^(?:(" + tag + "(?:\\.(?:" + tag + "|\\*))*" + ")\\.)?(\\*|" + tag + ")$", "i");

    function mergeOption(source, option) {
        if (!source || !option || source === option) return source || option;

        if (!v2.isFunction(option)) return v2.extend(true, source, option);

        if (!v2.isFunction(source)) return v2.extend(true, option, source);

        var callback = function () {
            source.apply(this, arguments);
            option.apply(this, arguments);
        };

        v2.extend(callback.prototype = source.prototype, option.prototype);

        return callback;
    }

    function namespaceCache(initCallback, readyCallback, objectCreate, objectCallback) {
        if (arguments.length < 4) {
            objectCallback = objectCreate;
            objectCreate = readyCallback;
            readyCallback = initCallback;
            initCallback = function () {
                return {};
            };
        }
        if (arguments.length < 3) {
            objectCallback = objectCreate;
            objectCreate = readyCallback;
            readyCallback = function (source, option) {
                return mergeOption(source, option);
            };
        }
        var cache = {},
            matchCache = makeCache(function (namespace) {
                return new RegExp("^" + namespace.replace(/\./g, "\\.").replace(rany, "[^\\.]+") + "$", "i");
            }, true),
            namespaceCache = makeCache(function (string, namespace) {
                return (!namespace || namespace === "*") ? string : namespace + "." + string;
            }),
            fnGet = function (namespace, tag) {
                tag = tag || "*";
                namespace = namespace || "*";
                var data, cached = cache[namespace];
                if (!cached) {
                    if (namespace.indexOf("*") > 1) {
                        var rmatch = matchCache(namespace);
                        for (data in cache) {
                            if (rmatch.test(data)) {
                                return fnGet(data, tag);
                            }
                        }
                    }
                    return false;
                }
                if (tag === "*") {
                    tag = namespace.split(".").pop();
                }
                return cached[tag];
            },
            fnSet = function (namespace, tag, option, args) {

                option.tag = tag;
                namespace = namespaceCache(tag, namespace || "*");

                var source, value, cached = cache[namespace] || (cache[namespace] = {});

                source = cached[tag] || initCallback(tag);

                value = args.length > 0 ?
                    readyCallback.apply(null, core_concat.call([source, option], args)) :
                    readyCallback(source, option);

                if (value) {
                    return cached[tag] = value;
                }

                return cached[tag] = source;
            };
        return function (string, option) {

            var match, namespace;

            string = v2.kebabCase(string);

            if (option === undefined) {
                var results = objectCreate(string);
                while ((match = rnamespaceGet.exec(namespace = namespace || namespaceCache(string)))) {
                    if ((option = fnGet(namespace, string = match[2]))) {
                        objectCallback(results, option);
                    }
                    namespace = match[1];
                    if (!namespace || namespace === "*") break;
                }
                return results;
            }

            if ((match = rnamespace.exec(string))) {
                return fnSet(match[1], match[2], option, core_slice.call(arguments, 2));
            }

            v2.error("string:" + string + ",Invalid class name space.");
        };
    }

    function isArraylike(object) {
        var len, type;

        if (object === null || object === undefined) return false;

        type = v2.type(object);

        if (type === "function" || type === "string" || v2.isWindow(object)) {
            return false;
        }

        len = object.length;

        if (object.nodeType === 1 && len) {
            return true;
        }
        try {
            return type === "array" || len === 0 || len > 0 && typeof length === "number" && (len - 1) in object;
        } catch (_) {
            return false;
        }
    }

    function analyzeWildcards(wildCards, key, type, define) {
        if (!wildCards || !key) return key;

        var item, config;
        if ((item = coreCards[key[0]])) {
            key = key.slice(1);
            if (item.type === "*" || typeCache(type)(item.type)) {
                config = {
                    type: type,
                    exec: item.exec
                };
            }
        }

        if (define ? type === 'function' : config) {
            if (key.indexOf('set') === 0 && key.length > 4) {
                key = key[3].toLowerCase() + key.slice(4);
                config.hooks = key;
            }
            wildCards[key] = config;
        } else if (config) {
            v2.log("When defining a component, it is only possible to define wildcards for a method's properties!", 15);
        }

        return key;
    }

    function computeWildcards(context, type, not) {
        var variable = context.variable,
            compute = function (wildcard, key) {
                var value = wildcard.type === 'function' ? variable[key] : context[key];

                if (value === undefined) return;

                value = wildcard.exec(context, value, wildcard.hooks || key);

                if (value === undefined) return;

                if (wildcard.type === 'function') {
                    variable[key] = value;
                } else {
                    context[key] = value;
                }
            };

        v2.each(context.wildcards, function (wildcard, key) {
            if (not ? wildcard.type !== type : wildcard.type === type) {
                return compute(wildcard, key);
            }
        });
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
            var i = -1,
                item, results = [];
            while ((item = this[++i])) {
                if (callback(item, i, this)) {
                    results.push(item);
                }
            }
            return v2.merge(new ArrayThen(), results);
        },
        map: function (callback) {
            var i = -1,
                item, results = new ArrayThen();
            while ((item = this[++i])) {
                results.add(callback(item, i, this));
            }
            return results;
        },
        then: function (callback) {
            return v2.each(this, callback);
        },
        any: function (callback) {
            return v2.any(this, callback);
        },
        all: function (callback) {
            return v2.all(this, callback);
        },
        eq: function (index) {
            return this[index < 0 ? index + this.length : index] || null;
        },
        destroy: function () {
            return core_splice.call(this, 0, this.length);
        }
    };

    ArrayThen.prototype.nth = ArrayThen.prototype.eq;
    ArrayThen.prototype.forEach = ArrayThen.prototype.each = ArrayThen.prototype.then;

    function v2(tag, option) {
        if (arguments.length === 1 && v2.isPlainObject(tag)) {
            option = tag;
            tag = option.tag;
        }
        return new v2.fn.init(tag, option);
    }

    v2.type = function (object) {
        return (object === null || object === undefined) ? String(object) : (typeof object === "object" || typeof object === "function") ? class2type[core_toString.call(object)] || "object" : typeof object;
    };

    function extension(context, callback, array) {
        var key, deep, value, infer, option;
        var i = 1,
            len = array.length,
            target = array[0];

        if (typeof target === "boolean") {
            deep = target;
            target = array[i++];
        }
        if (!(typeof target === 'object' || v2.isFunction(target))) {
            target = null;
        }
        if (i === len) {
            i -= 1;
            target = context;
        }

        infer = target === null || target === undefined;

        for (; i < len; i++) {

            option = array[i];

            if (option === undefined || option === null)
                continue;

            if (typeof option === "boolean") {
                deep = option;
                continue;
            }

            if (infer) {
                infer = false;
                target = isArraylike(option) ? [] : {};
            }

            for (key in option) {
                if ((value = done(target[key], option[key], key)) !== undefined) {
                    target[key] = value;
                }
            }
        }

        return target;

        function done(value, option, key) {
            var isArray;
            if (value === option || !deep && value === undefined) return option;
            if (option && deep && ((isArray = isArraylike(option)) || v2.isPlainObject(option))) {
                return extension(context, callback, [deep, value || (isArray ? [] : {}), option]);
            }
            return callback ? callback(value, option, key) : option;
        }
    }

    v2.extension = function (callback) {
        return extension(this, callback, core_slice.call(arguments, 1));
    };

    var improveCallbak = function (value, option) {
        return (value === null || value === undefined) ? option : value;
    };

    v2.extend = function () {
        return extension(this, null, arguments);
    };

    v2.improve = function () {
        return extension(this, improveCallbak, arguments);
    };

    v2.extend({
        when: function () {
            var when = new ArrayThen();
            if (arguments.length > 0) {
                v2.each(arguments, when.add, when);
            }
            return when;
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
            } else {
                for (i in object) {
                    if (callback.call(context || object, object[i], i, object) === false) break;
                }
            }
            return object;
        },
        map: function (object, callback, context) {
            var value, arr = [];
            if (!object || !callback) return arr;
            var i = 0;
            if (isArraylike(object)) {
                for (var len = object.length; i < len; i++) {
                    value = callback.call(context || object, object[i], i, object);
                    if (value != null) arr.push(value);
                }
            } else {
                for (i in object) {
                    value = callback.call(context || object, object[i], i, object);
                    if (value != null) arr.push(value);
                }
            }
            return core_concat.apply([], arr);
        },
        all: function (object, callback, context) {
            if (!object || !callback) return false;
            var i = 0;
            if (isArraylike(object)) {
                for (var len = object.length; i < len; i++) {
                    if (!callback.call(context || object, object[i], i, object)) return false;
                }
            } else {
                for (i in object) {
                    if (!callback.call(context || object, object[i], i, object)) return false;
                }
            }
            return true;
        },
        any: function (object, callback, context) {
            if (!object || !callback) return false;
            var i = 0;
            if (isArraylike(object)) {
                for (var len = object.length; i < len; i++) {
                    if (callback.call(context || object, object[i], i, object)) return true;
                }
            } else {
                for (i in object) {
                    if (callback.call(context || object, object[i], i, object)) return true;
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
            return (string === null || string === undefined) ? "" : core_trim.call(string);
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
            return object !== null && object !== undefined && object.window === object;
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
            for (key in object);

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
        Y: /(y+)/,
        M: /(M+)/,
        D: /(d+)/,
        H: /(H+)/,
        h: /(h+)/,
        m: /(m+)/,
        s: /(s+)/,
        f: /(f+)/
    };
    v2.extend(v2.date, {
        isLeapYear: function (year) {
            return (year % 400 === 0) || (year % 4 === 0) && (year % 100 > 0);
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
            if (month === 2) {
                return v2.date.isLeapYear(year) ? 29 : 28;
            }
            return ((month & 1) === 0 ? month < 7 : month > 8) ? 30 : 31;
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
                if (datePart[A].test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? C[A] : ('00' + C[A]).slice(-2));
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
            if (conversionType === 'null' || conversionType === 'undefined')
                return value;

            if (value === null || value === undefined)
                return null;

            var type = valueType || v2.type(value);
            if (type === conversionType)
                return value;

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
                    break;
                case 'string':
                    return (value === null || value === undefined) ? '' : type === 'date' ? v2.date.format(value, 'yyyy-MM-dd HH:mm:ss') : value.toString();
                case 'number':
                    if (type === 'string') return parseFloat(value);
                    if (type === 'date') return +value;
                    if (type === 'boolean') return value ? 1 : 0;
                    break;
                case 'function':
                    if (type === 'string') return new Function(value);
                    break;
                case 'regex':
                    if (type === 'string') return new RegExp(value);
                    break;
                case 'date':
                    if (type === 'number' || type === 'string')
                        return v2.date(value);
                    break;
                case 'boolean':
                    return !!value;
            }
            throw new Error('InvalidCastException:This conversion is not supported.');
        },
        makeDescriptor = function (source, callback, beforeSetting, conversionType, allowFirstSet) {
            var threadGet,
                threadSet;

            conversionType = conversionType || v2.type(source);

            if (callback.length === 0) {
                return {
                    configurable: true,
                    get: function () {
                        return changeType(callback.call(this), conversionType);
                    }
                };
            }

            if (callback.length === 1) {
                return {
                    configurable: true,
                    get: function () {
                        return source;
                    },
                    set: function (value) {

                        if (allowFirstSet) {

                            allowFirstSet = false;

                            if (source === undefined || source === null) {
                                conversionType = v2.type(value);
                            }

                        } else {

                            if (value === source) return;

                            value = changeType(value, conversionType);

                            if (value === source) return;

                            if (value === null && (conversionType === 'boolean' || conversionType === 'date' || conversionType === 'number'))
                                return;
                        }

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
                    configurable: true,
                    get: function () {

                        if (threadGet)
                            return v2.error("Methods fall into an endless loop.");

                        threadGet = true;

                        var value = callback.call(this, source, false);

                        threadGet = false;

                        return value;
                    },
                    set: function (value) {

                        if (allowFirstSet) {

                            allowFirstSet = false;

                            if (source === undefined || source === null) {
                                conversionType = v2.type(value);
                            }

                        } else {
                            if (value === source) return;

                            value = changeType(value, conversionType);

                            if (value === source) return;

                            if (value === null && (conversionType === 'boolean' || conversionType === 'date' || conversionType === 'number'))
                                return;
                        }

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
            v2.error("Cannot analyze a callback function with a parameter length of " + callback.length + ".");
        };

    v2.define = function (obj, prop, attributes) {
        if (obj === null || obj === undefined) return obj;

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

    var rnative = /^[^{]+\{\s*\[native code/;
    var docElem = document.documentElement;

    v2.extend({
        siblings: function (elem, exclude) {
            var r = [];
            for (; elem; elem = elem.nextSibling) {
                if (elem.nodeType === 1 && (!exclude || exclude !== elem)) {
                    r.push(elem);
                }
            }
            return r;
        },
        sibling: function (elem, dir, contains) {

            var node = contains ? elem : elem && elem[dir];

            for (; node; node = node[dir]) {
                if (node.nodeType === 1) return node;
            }
        },
        dir: function (elem, dir, contains) {

            var
                node = contains ? elem : elem && elem[dir],
                results = [];

            for (; node; node = node[dir]) {

                if (node.nodeType === 9) break;

                if (node.nodeType === 1) {
                    results.push(node);
                }
            }

            return results;
        },
        contains: (rnative.test(docElem.compareDocumentPosition) || rnative.test(docElem.contains)) ?
            function (a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a,
                    bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && (
                    adown.contains ?
                        adown.contains(bup) :
                        a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
                ));
            } : function (a, b) {
                if (b) {
                    while ((b = b.parentNode)) {
                        if (b === a) {
                            return true;
                        }
                    }
                }
                return false;
            }
    });

    v2.improve(HTMLSelectElement.prototype, {
        remove: function (index) {
            if (arguments.length === 0) {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            } else {
                var node = this.selectedOptions[index];

                if (node) {
                    this.removeChild(node);
                }
            }
        }
    });

    v2.each({
        options: function () {
            return v2.when(this.children).when(function (item) {
                return item.nodeName.toLowerCase() === 'option';
            });
        },
        selectedOptions: function () {
            return v2.when(this.children).when(function (item) {
                return item.selected && item.nodeName.toLowerCase() === 'option';
            });
        }
    }, function (polyfill, name) {
        if (!(name in HTMLSelectElement.prototype))
            Object.defineProperty(HTMLSelectElement.prototype, name, {
                get: polyfill
            });
    });

    var rclass = /[\t\r\n]/g,
        rnotwhite = /\S+/g,
        classCache = makeCache(function (string) {
            return new RegExp("(^|" + whitespace + ")" + string + "(" + whitespace + "|$)");
        });

    function DOMClassList(node) {

        var i = 0,
            token, tokens = node.className.match(rnotwhite);

        if (tokens) {

            tokens = tokens.sort();

            while ((token = tokens[i++])) { // ȥ��
                while (token === tokens[i]) {
                    core_splice.call(tokens, i, 1);
                }
            }

            v2.merge(this, tokens);

            node.className = tokens.join(" ");
        }

        Object.defineProperty(this, "value", {
            get: function () {
                return node.className;
            },
            set: function (value) {

                var arr = value
                    .replace(rclass, " ")
                    .match(rnotwhite);

                if (this.length > 0)
                    core_splice.call(this, 0, this.length);

                if (arr && arr.length > 0) {

                    v2.merge(this, arr);

                    value = arr.join(" ");
                }

                node.className = value;
            }
        });
    }

    DOMClassList.prototype = {
        add: function () {
            var i = 0,
                token,
                contains,
                value = this.value;

            while ((token = arguments[i++])) {

                token = token.toString();

                if (token.indexOf(" ") > -1)
                    return v2.error("Uncaught DOMException: Failed to execute 'add' on 'DOMTokenList': The token provided ('" + clazz + "') contains HTML space characters, which are not valid in tokens.");

                if (classCache(token).test(value)) continue;

                contains = true;

                value += " " + token;
            }

            if (contains) this.value = value;
        },
        remove: function () {
            var i = 0,
                token,
                pattern,
                contains,
                value = this.value;

            while ((token = arguments[i++])) {

                token = token.toString();

                if (token.indexOf(" ") > -1)
                    return v2.error("Uncaught DOMException: Failed to execute 'add' on 'DOMTokenList': The token provided ('" + clazz + "') contains HTML space characters, which are not valid in tokens.");

                pattern = classCache(token);

                if (!pattern.test(value)) continue;

                contains = true;

                value = value.replace(pattern, " ");
            }

            if (contains) this.value = value;
        },
        contains: function (value) {
            if (arguments.length === 0)
                return v2.error("Uncaught TypeError: Failed to execute 'contains' on 'DOMTokenList': 1 argument required, but only 0 present.");
            return classCache(value + "").test(this.value);
        },
        toggle: function (token, toggle) {
            if (arguments.length === 0)
                return v2.error("Uncaught TypeError: Failed to execute 'toggle' on 'DOMTokenList': 1 argument required, but only 0 present.");

            token = token.toString();

            if (token.indexOf(" ") > -1)
                return v2.error("Uncaught DOMException: Failed to execute 'toggle' on 'DOMTokenList': The token provided ('" + token + "') contains HTML space characters, which are not valid in tokens.");


            var value = this.value,
                pattern = classCache(token);

            if (arguments.length === 1) {
                if (pattern.test(value)) {
                    this.value = value.replace(pattern, " ");
                    return false;
                }
                return true;
            }

            if (toggle) {
                this.value = value + " " + token;
            } else {
                this.value = value.replace(pattern, " ");
            }

            return !!toggle;
        }
    };

    v2.improve(Element.prototype, {
        remove: function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }
    });

    v2.each({
        classList: function () {
            return this["class_" + timestamp] || (this["class_" + timestamp] = new DOMClassList(this));
        },
        parentElement: function () {
            return v2.sibling(this.parentNode, "parentNode", true);
        },
        children: function () {
            return v2.siblings(this.firstChild);
        },
        firstElementChild: function () {
            return v2.sibling(this.firstChild, "nextSibling", true);
        },
        lastElementChild: function () {
            return v2.sibling(this.lastChild, "previousSibling", true);
        },
        previousElementSibling: function () {
            return v2.sibling(this.previousSibling, "previousSibling", true);
        },
        nextElementSibling: function () {
            return v2.sibling(this.nextSibling, "nextSibling", true);
        }
    }, function (polyfill, name) {
        if (!(name in Element.prototype))
            Object.defineProperty(Element.prototype, name, {
                get: polyfill
            });
    });

    var matches = docElem.matchesSelector ||
        docElem.mozMatchesSelector ||
        docElem.webkitMatchesSelector ||
        docElem.oMatchesSelector ||
        docElem.msMatchesSelector;

    if (!rnative.exec(matches))
        v2.error('The current browser version is too low.');

    var rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

    var
        GLOBAL_VARIABLE_GUID = 0,
        GLOBAL_VARIABLE_EVENT = 0,
        nodeCache = {};

    var eventMap = {
        on: function (type, selector, hanlde) {
            var guid, match, namespaces, map, cache, self, typeHandle, typeCache;
            if (arguments.length < 3) {
                hanlde = selector;
                selector = undefined;
            }

            if (!selector && type.indexOf('.') === -1) {
                if (this.addEventListener) {
                    this.addEventListener(type, hanlde, false);
                } else {
                    this.attachEvent("on" + type, hanlde);
                }

                return;
            }

            type = type.split(".").sort().join(".");

            guid = this[timestamp] || (this[timestamp] = ++GLOBAL_VARIABLE_GUID);

            cache = nodeCache[guid] || (nodeCache[guid] = {});

            self = this;
            match = rtypenamespace.exec(type);

            type = match[1];

            namespaces = match[2] || "";

            if (namespaces) {
                namespaces = namespaces.split(".").sort();
            }

            map = namespaces ?
                makeMap(namespaces.join(" "), true) :
                returnFalse;

            typeHandle = function (e) {
                var value, node = e.target || (e.target = e.srcElement);
                if (map("self") && self !== node) {
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopPropagation)
                        e.stopPropagation();
                    else
                        e.cancelBubble = true;
                    return false;
                }

                if (!selector) {
                    return done(this);
                }

                if (node.nodeType && (!e.button || e.type !== "click")) {
                    for (; node != this; node = node.parentNode) {
                        if (node.match(selector))
                            return done(node);
                    }
                }
                function done(elem) {
                    value = hanlde.call(elem, e);

                    if (value === false && map('abort')) {
                        if (e.preventDefault) e.preventDefault();
                        if (e.stopPropagation)
                            e.stopPropagation();
                        else
                            e.cancelBubble = true;

                        return false;
                    }

                    if (map("prev")) {
                        if (e.preventDefault) e.preventDefault();
                    }

                    if (map("stop")) {

                        if (e.stopPropagation)
                            e.stopPropagation();
                        else
                            e.cancelBubble = true;
                    }

                    return value;
                }
            };

            typeCache = cache[type] || (cache[type] = []);

            typeCache.push({
                guid: hanlde.guid || (hanlde.guid = ++GLOBAL_VARIABLE_EVENT),
                namespace: namespaces && namespaces.join("."),
                selector: selector,
                hanlde: typeHandle
            });

            if (this.addEventListener) {
                this.addEventListener(type, typeHandle, false);
            } else {
                this.attachEvent("on" + type, typeHandle);
            }
        },
        off: function (type, selector, hanlde) {
            var guid, namespaces, cache, match, typeCache;
            if (arguments.length < 3) {
                hanlde = selector;
                selector = undefined;
            }

            if (!selector && type.indexOf('.') === -1) {
                if (this.addEventListener) {
                    this.removeEventListener(type, hanlde, false);
                } else {
                    this.detachEvent("on" + type, hanlde);
                }
                return;
            }

            if (!hanlde.guid) return;

            guid = this[timestamp];

            if (!guid) return;

            cache = nodeCache[guid];

            if (!cache) return;

            match = rtypenamespace.exec(type);

            typeCache = cache[type = match[1]];

            if (!typeCache) return;

            namespaces = match[2] || "";

            if (namespaces) {
                namespaces = namespaces.split(".").sort().join(".");
            }

            var i = 0,
                obj;

            while ((obj = typeCache[i++])) {
                if (obj.guid === hanlde.guid && obj.namespace === namespaces && obj.selector === selector) {
                    if (this.addEventListener) {
                        this.removeEventListener(type, obj.hanlde, false);
                    } else {
                        this.detachEvent("on" + type, obj.hanlde);
                    }
                }
            }
        }
    };

    v2.improve(Element.prototype, {
        match: function (expr) {
            return !expr || matches.call(this, expr);
        }
    });

    v2.improve(Element.prototype, eventMap);

    v2.improve(Document.prototype, eventMap);

    function getStyles(elem) {
        var view = elem.ownerDocument.defaultView;

        if (!view || !view.opener) {
            view = window;
        }

        return view.getComputedStyle(elem);
    }

    var rmargin = /^margin/i,
        rnumnonpx = /^([+-]?(\d+\.)?\d+)(?!px)[a-z%]+$/i;

    function curCSS(elem, name) {
        var width, minWidth, maxWidth, r, style = elem.style;

        var computed = getStyles(elem);
        if (computed) {
            r = computed.getPropertyValue(name) || computed[name];

            if (r === "" && !v2.contains(elem.ownerDocument, elem)) {
                r = elem.styleCb(name);
            }
            if (rnumnonpx.test(r) && rmargin.test(name)) {

                width = style.width;
                minWidth = style.minWidth;
                maxWidth = style.maxWidth;

                style.minWidth = style.maxWidth = style.width = r;
                r = computed.width;

                style.width = width;
                style.minWidth = minWidth;
                style.maxWidth = maxWidth;
            }
        }

        return r === undefined ? r : r + "";
    }

    function adjustCSS(elem, prop, valueParts) {
        var adjusted, scale,
            maxIterations = 20,
            initial = v2.css(elem, prop, ""),
            unit = valueParts && valueParts[3] || (v2.cssNumber[prop] ? "" : "px"),
            initialInUnit = (v2.cssNumber[prop] || unit !== "px" && +initial) &&
                rcssNum.exec(v2.css(elem, prop));

        if (initialInUnit && initialInUnit[3] !== unit) {

            initial = initial / 2;

            unit = unit || initialInUnit[3];

            initialInUnit = +initial || 1;

            while (maxIterations--) {
                v2.style(elem, prop, initialInUnit + unit);
                if ((1 - scale) * (1 - (scale = v2.css(elem, prop, "") / initial || 0.5)) <= 0) {
                    maxIterations = 0;
                }
                initialInUnit = initialInUnit / scale;
            }

            initialInUnit = initialInUnit * 2;
            v2.style(elem, prop, initialInUnit + unit);
            valueParts = valueParts || [];
        }

        if (valueParts) {
            initialInUnit = +initialInUnit || +initial || 0;
            adjusted = valueParts[1] ?
                initialInUnit + (valueParts[1] + 1) * valueParts[2] :
                +valueParts[2];
        }
        return adjusted;
    }

    var cssPrefixes = ["Webkit", "O", "Moz", "ms"];

    function vendorPropName(style, name) {
        if (name in style) {
            return name;
        }

        var capName = name.charAt(0).toUpperCase() + name.slice(1),
            origName = name,
            i = cssPrefixes.length;

        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in style) {
                return name;
            }
        }

        return origName;
    }

    v2.extend({
        cssNumber: {
            "columnCount": true,
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },
        cssProps: {
            "float": "cssFloat"
        }
    });

    var rcssZoom = /^([+-])=((?:\d+\.)\d+)([a-z%]*)$/i,
        rcssMulti = /^([*/])=((?:\d+\.)\d+)(%)?$/i,
        cssNormalTransform = {
            letterSpacing: 0,
            fontWeight: 400
        };

    v2.extend(Element.prototype, {
        css: function (name, same) {
            var elem = this,
                style = this.style;
            if (v2.isArray(name)) {
                var map = {};
                v2.each(name, function (name) {
                    map[name] = done(name);
                });
                return map;
            }

            return done(name);

            function done(name) {
                var value,
                    origName = v2.camelCase(name);

                name = v2.cssProps[origName] || (v2.cssProps[origName] = vendorPropName(style, origName));

                value = curCSS(elem, name);

                if (value === "normal" && name in cssNormalTransform) {
                    value = cssNormalTransform[name];
                }

                if (same) return value;

                return parseFloat(value) || 0;
            }
        },
        styleCb: function (name, value) {
            var match,
                origName,
                elem = this,
                style = this.style;

            if (v2.isPlainObject(name)) {
                return v2.each(name, done);
            }

            return done(value, name);

            function done(value, name) {

                origName = v2.camelCase(name);

                name = v2.cssProps[name] || (v2.cssProps[name] = vendorPropName(style, name));

                if (value === undefined) return style[name];

                var type = typeof value;

                if (type === "string") {
                    if ((match = rcssZoom.exec(value))) {
                        adjustCSS(this, name, match);
                    } else if ((match = rcssMulti.exec(value))) {

                        if (match[3]) match[2] /= 100;

                        value = (new Function("source", "return source" + match[1] + match[2]))(elem.css(name));
                    }

                    if (match) type = "number";
                }

                if (value === null || value === undefined || value !== value) {
                    return;
                }

                if (type === "number" && !v2.cssNumber[origName]) {
                    value += "px";
                }

                if (value === "" && name.indexOf("background") === 0) {
                    value = "inherit";
                }

                style[name] = value;
            }
        }
    });

    v2.improve(Element.prototype, {
        empty: function () {
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }
            return this;
        },
        append: function () {
            var docFrag = safeFragment.cloneNode();

            v2.each(arguments, function (node) {
                docFrag.appendChild(node.nodeType ? node : document.createTextNode(node));
            });

            this.appendChild(docFrag);
        },
        prepend: function () {
            var docFrag = safeFragment.cloneNode();

            v2.each(arguments, function (node) {
                docFrag.appendChild(node.nodeType ? node : document.createTextNode(node));
            });

            this.insertBefore(docFrag, this.firstChild);
        }
    });

    var logCb = {
        debug: 16,
        error: 8,
        warn: 4,
        info: 2,
        log: 1
    };
    v2.extend({
        typeCb: function (typeCb, type, callback) {
            if (!type || !typeCb || !callback || !(type = type >>> 0)) return;
            v2.each(typeCb, function (typeCb, key) {
                if ((typeCb & type) === typeCb) {
                    return callback(key, typeCb);
                }
            });
        },
        log: function (message, type, logAll) {
            return v2.typeCb(logCb, type || 1, function (log) {
                if (log in console) {
                    console[log](message);
                    return !!logAll;
                }
            });
        }
    });

    v2.extend({
        makeMap: makeMap,
        makeCache: makeCache,
        makeNamespaceCache: namespaceCache
    });

    var typeCache = makeCache(function (type) {
        var pattern = new RegExp("(^|\\|)" + type + "(\\||$)");
        return function (type) {
            return pattern.test(type);
        };
    });

    function mergeCards(source, superior) {
        if (source.type === "*" && superior.type === "*")
            return superior;

        return {
            type: (source.type === "*" || superior.type === "*") ? "*" : superior.type + "|" + source.type,
            exec: superior.type === "*" ? function (control, value, key) {
                var type = v2.type(value);

                if (typeCache(type)(source.type)) {
                    return source.exec(control, value, key);
                }

                return superior.exec(control, value, key);

            } : function (control, value, key) {
                var type = v2.type(value);

                if (typeCache(type)(superior.type)) {
                    return superior.exec(control, value, key);
                }

                return source.exec(control, value, key);
            }
        };
    }

    v2.useCards = function (letter, value) {
        if (v2.isPlainObject(letter)) {
            return v2.each(letter, function (value, key) {
                letter[key] = v2.useCards(key, value);
            });
        }
        if (v2.isFunction(value)) {
            value = {
                type: '*',
                exec: value
            };
        }
        if (letter in coreCards) {
            return coreCards[letter] = mergeCards(coreCards[letter], value);
        }
        return coreCards[letter] = value;
    };

    v2.extend(coreCards, {
        "&": { //true
            type: "function",
            exec: function (control, value, key) {
                if (value) {
                    control[key](value);
                }
            }
        },
        "!": { //false
            type: "function",
            exec: function (control, value, key) {
                if (!value) {
                    control[key](value);
                }
            }
        },
        '{': { // object
            type: 'function',
            exec: function (control, value, key) {
                if (v2.isPlainObject(value)) {
                    control[key](value);
                }
            }
        },
        '.': { // any
            type: 'function',
            exec: function (control, value, key) {
                if (value !== null && value !== undefined) {
                    control[key](value);
                }
            }
        },
        '#': {
            type: "string",
            exec: function (control, value) {
                control[key] = v2.htmlSerialize(value);
            }
        }
    });

    v2.each({
        '?': 'boolean',
        '%': 'number',
        '"': 'string',
        "'": 'string',
        '<': 'date',
        '[': 'array',
        '/': 'regexp',
        '*': '*'
    }, function (type, name) {
        coreCards[name] = {
            type: 'function',
            exec: function (control, value, key) {
                if (type === '*' || v2.type(value) === type) {
                    control[key](value);
                }
            }
        };
    });

    function createSafeFragment(document) {
        var list = nodeNames.split("|"),
            safeFrag = document.createDocumentFragment();

        if (safeFrag.createElement) {
            while (list.length) {
                safeFrag.createElement(
                    list.pop()
                );
            }
        }
        return safeFrag;
    }

    var rhtml = /<|&#?\w+;/,
        rtagName = /<([\w:]+)/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
            "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        wrapMap = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        },
        safeFragment = createSafeFragment(document);

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    String.prototype.html = function () {
        if (!rhtml.test(this))
            return document.createTextNode(this);

        var i,
            node,
            value = this,
            nodes = [],
            safe = safeFragment.cloneNode(),
            tmp = safe.appendChild(document.createElement("div")),
            match = rtagName.exec(value),
            wrap = match && wrapMap[match[1]] || wrapMap._default;

        tmp.innerHTML = wrap[1] + value.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

        i = wrap[0];

        while (i--) {
            tmp = tmp.lastChild;
        }

        v2.merge(nodes, tmp.childNodes);

        tmp.textContent = "";

        while (tmp.firstChild) {
            tmp.removeChild(tmp.firstChild);
        }

        if (safe.lastChild) {
            safe.removeChild(safe.lastChild);
        }

        i = 0;

        while ((node = nodes[i++])) {
            safe.appendChild(node);
        }

        if (safe.childNodes.length == 1) {
            safe = safe.firstChild;
        }

        tmp = null;

        return safe;
    };

    var
        rbatch = /\$+/g,
        rbatchZore = /\^+/g,
        whitespace = "[\\x20\\t\\r\\n\\f]",
        characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        identifier = characterEncoding.replace("w", "w#"),
        combinator = whitespace + "*([>+])" + whitespace + "*",
        attributes = "\\[" + whitespace + "*(" +
            characterEncoding + ")" + whitespace + "*(?:=" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|(" + identifier + ")|)|)" + whitespace + "*\\]",
        rchild = new RegExp("^" + whitespace + "*>"),
        rgroup = new RegExp("^" + whitespace + "*\\("),
        rcombinators = new RegExp("^" + combinator),
        rreturn = new RegExp("\\breturn" + whitespace + "+"),
        rfixcombinators = new RegExp(combinator + '(' + combinator + ')+', 'gm'),
        rsingleTag = /area|br|col|embed|hr|img|input|link|meta|param/i,
        rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
        htmlSerializeExpr = {
            "ID": new RegExp("^#(" + characterEncoding + ")"),
            "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
            "TAG": new RegExp("^(" + characterEncoding + ")"),
            "ATTR": new RegExp("^" + attributes),
            "MULTI": new RegExp("^" + whitespace + "*\\*([1-9][0-9]*)"),
            "TEXT": new RegExp("^\\{(.*?)\\}" + whitespace + "*(?=[+>]|\\*|$)")
        },
        fhtmlSerializeCache = function (selector) {
            var i, arr, charAt, counter, token, type, match, matched, groups = [],
                string = selector,
                serialize = htmlSerialize.serialize;
            while (string) {
                if (!matched || (match = rcombinators.exec(string))) {
                    if (match && (token.TAG === 'a' || token.TAG === 'A') && !("ATTR" in token && v2.any(token['ATTR'], function (attr) {
                        return attr.name.toLowerCase() === "href";
                    }))) {
                        arr = token["ATTR"] || (token["ATTR"] = []);
                        arr.push(new Attr('href', '#'));
                    }
                    groups.unshift(token = {});
                    if (match) {
                        matched = match.shift();
                        token.type = match.shift();
                        string = string.slice(matched.length);
                    }
                    if ((match = rgroup.exec(string))) {
                        i = 0;
                        counter = 1;
                        matched = match.shift();
                        string = string.slice(matched.length);
                        while ((charAt = string[i++])) {
                            if (charAt === "(") {
                                counter++;
                            } else if (charAt === ")") {
                                if (counter === 1) break;
                                counter--;
                            }
                        }
                        token.groups = htmlSerializeCache(string.slice(0, i - 1));
                        if (rchild.test(string = string.slice(i))) break;
                        continue;
                    }
                }
                matched = false;
                for (type in htmlSerializeExpr) {
                    if ((match = htmlSerializeExpr[type].exec(string))) {
                        matched = match.shift();
                        if (type in serialize) {
                            arr = token[type] || (token[type] = []);
                            arr.push(serialize[type](match));
                        } else {
                            token[type] = match[0];
                        }
                        string = string.slice(matched.length);
                    }
                }
                if (!matched) break;
            }
            return string ? v2.syntaxError(selector) : groups;
        },
        htmlSerializeCache = makeCache(fhtmlSerializeCache),
        htmlDeserialize = function (groups) {
            var i = 0,
                html, token, next;
            while ((token = groups[i++])) {
                if (!html) {
                    html = token.groups ? htmlDeserializeGroup(token) : htmlDeserializeToken(token);
                }
                if ((next = groups[i])) {
                    if (next.groups) {
                        html = htmlDeserializeGroup(next) + html;
                    } else {
                        html = htmlDeserializeToken(next, token.type, html);
                    }
                }
            }
            return html;
        },
        htmlDeserializeGroup = function (token) {
            var htmls, multi = +token["MULTI"],
                html = htmlDeserialize(token.groups);
            if (multi > 0) {
                htmls = [];
                while (multi--) {
                    htmls.unshift(html.replace(rbatch, multi + 1));
                }
                html = htmls.join('');
            }
            return html;
        },
        htmlDeserializeToken = function (token, relative, xhtml) {
            var type,
                htmls,
                multi = +token["MULTI"],
                tag = token["TAG"] || 'div',
                html = ['<' + tag],
                content = token["TEXT"] || "",
                deserialize = htmlSerialize.deserialize;
            for (type in deserialize) {
                if (type in token) {
                    html.push(' ');
                    html.push(deserialize[type](token[type]));
                }
            }
            if (rsingleTag.test(tag)) {
                html.push('/>');
            } else {
                html.push('>');
                html.push(content);
                if (relative === ">") html.push(xhtml);
                html.push('</' + tag + '>');
            }
            html = html.join('');
            if (multi > 0) {
                htmls = [];

                do {
                    htmls.unshift(html.replace(rbatch, function (v) {
                        var value = multi + '';
                        for (var i = value.length, len = v.length; i < len; i++) {
                            value = '0' + value;
                        }
                        return value;
                    }).replace(rbatchZore, function (v) {
                        var value = (multi - 1) + '';
                        for (var i = value.length, len = v.length; i < len; i++) {
                            value = '0' + value;
                        }
                        return value;
                    }));

                } while ((--multi) > 0);

                html = htmls.join('');
            }
            if (relative === "+") html += xhtml;
            return html;
        };

    function htmlSerialize(selector) {
        return htmlDeserialize(htmlSerializeCache(selector.replace(rfixcombinators, '$1')));
    }

    function Attr(name, value) {
        this.name = name;
        this.value = value;
    }
    Attr.prototype.toString = function () {
        return this.value ? this.name + '="' + this.value + '"' : this.name;
    };
    v2.extend(v2.htmlSerialize = htmlSerialize, {
        serialize: {
            "CLASS": function (match) {
                return match[0];
            },
            "ATTR": function (match) {
                if (match[3]) {
                    match[2] = match[3];
                }
                if (match[2] === undefined && rboolean.test(match[0])) {
                    match[2] = match[0];
                }
                return new Attr(match[0].replace(runescape, funescape), match[2] && match[2].replace(runescape, funescape));
            }
        },
        deserialize: {
            "ID": function (id) {
                return 'id="' + id + '"';
            },
            "CLASS": function (arr) {
                return 'class="' + arr.join(' ') + '"';
            },
            "ATTR": function (arr) {
                return arr.join(' ');
            }
        }
    });

    String.prototype.htmlCoding = function () {
        return htmlSerialize(this);
    };

    var formatCache = makeCache(function (i) {
        return new RegExp("\\{" + i + "\\}", "gm");
    });

    String.prototype.format = function () {
        var string = this;
        if (!string) return string;
        if (arguments.length < 1) return string;

        for (var i = 0, len = arguments.length; i < len; i++) {
            string = string.replace(formatCache(i), arguments[i]);
        }
        return string;
    };

    var rcompile = new RegExp('(`\\$\\{(.+?)\\}`|\\{' + whitespace + '*\\{' + whitespace + '*([^\\{].+?)' + whitespace + '*\\}' + whitespace + '*\\})', 'gm'); // /`\$\{(.*)?\}`/gm;
    var word = '[_a-z][_a-z0-9]*',
        rquotes = new RegExp("(['\"])(?:\\\\.|[^\\\\])+\\1", 'gm'),
        rbraceCode = new RegExp('(\\{' + whitespace + '*)*\\{' + whitespace + '*\\{(.+?)\\}' + whitespace + '*\\}', 'gm'),
        rternaryCode = new RegExp('^(((?:\\w+\\.)?\\w+(?:\\(.*?\\))?)' + whitespace + '*([?!])' + whitespace + '*(.+?))$'),
        tryCode = word + '(?:\\??(?:\\.' + word + '|\\[.+?\\]))*',
        rtryCode = new RegExp(tryCode, 'img'),
        rtry = new RegExp('(' + word + '|\\])\\?(?=(\\.|\\[))', 'i'),
        rforin = new RegExp('\\bfor' + whitespace + '*\\(' + whitespace + '*(?:var' + whitespace + '+)?(' + word + ')(?:<(' + word + ')>)?' + whitespace + '+in' + whitespace + '+(' + tryCode + ')' + whitespace + '*\\)', 'ig'),
        rword = new RegExp('\\b' + word + '\\b', 'gi'),
        rkey = new RegExp('^' + word + '$', 'i'),
        rif = new RegExp('\\bif' + whitespace + '*\\(.+?\\)' + whitespace + '*\\{' + whitespace + "*(.+)"),
        relse = new RegExp('\\belse' + whitespace + '*\\{' + whitespace + "*(.+)"),
        rinject = new RegExp("^" + whitespace + "*(" + word + ")\\(((" + whitespace + "*" + word + whitespace + "*,)*" + whitespace + "*" + word + ")?" + whitespace + "*\\)" + whitespace + "*$", "i");

    var tryCode = makeCache(function (string) {
        var match, results = [];
        if (string.indexOf('?') === -1)
            return string;
        while ((match = rtry.exec(string))) {

            results.push('(__v_ = ');
            if (results.length > 1) {
                results.push('__v_');
            }
            results.push(string.slice(0, match[1].length + match.index));
            results.push(')');
            results.push(' == null', ' ? ', '""', ' : ');

            string = string.slice(match.index + match[0].length);
        }

        if (results.length === 0)
            return string;

        results.unshift('(');

        results.push('__v_');
        results.push(string);

        results.push(')');

        return results.join('');
    });

    function forCode(_, item, index, data, guid) {
        var fn = 'for_done_' + guid,
            results = ['return window.v2.map(', data, ',', fn, ');'];

        results.push('function ', fn, '(', item);
        if (index) {
            results.push(',', index);
        }
        results.push(')');

        return results.join('');
    };

    function ifElseCode(all, code) {
        if (!rreturn.test(code))
            return all.slice(0, -code.length) + 'return ' + code;
        return all;
    }

    function joinCode(string, quote) {
        return string.replace(rbraceCode, function (_, reserved, code) {
            return (reserved || '') + quote + '+ (' + code + ') +' + quote;
        });
    }
    function ternaryCode(_, _2, left, symbol, right) {
        if (symbol == '?') {
            return left + '?' + right + ':""';
        }
        return left + '?"":' + right;
    }
    var compileCache = makeCache(function (value) {
        var callback, body = value.replace(rforin, forCode)
            .replace(rif, ifElseCode)
            .replace(relse, ifElseCode)
            .replace(rquotes, joinCode)
            .replace(rtryCode, tryCode);

        if (!rreturn.test(body)) {
            body = 'return ' + body;
        }

        try {
            callback = new Function('__json_', 'var __v_; with(__json_){ ' + body + ' }');
        } catch (_) {
            v2.syntaxError(value + '=>' + body);
        }

        return function (json) {
            var val;

            if (json === null || json === undefined)
                return '';

            val = callback(json);

            return val === undefined ? '' : isArraylike(val) ? core_join.call(val, '') : val;
        };
    });

    var simpleCache = makeCache(function (value) {
        if (rkey.test(value)) {
            return function (json) {
                if (json === null || json === undefined)
                    return '';

                return json[value];
            };
        }
        var callback, body = value
            .replace(rternaryCode, ternaryCode)
            .replace(rtryCode, tryCode);

        if (!rreturn.test(body)) {
            body = 'return ' + body;
        }

        try {
            callback = new Function('__json_', 'var __v_; with(__json_){ ' + body + ' }');
        } catch (_) {
            v2.syntaxError(value + '=>' + body);
        }

        return function (json) {
            var val;

            if (json === null || json === undefined)
                return '';

            val = callback(json);

            return val === undefined ? '' : isArraylike(val) ? core_join.call(val, '') : val;
        };
    });

    String.prototype.withCb = function (json) {
        return this.replace(rcompile, function (_, _2, lamda, simple) {
            var callback = lamda
                ? compileCache(lamda)
                : simpleCache(simple);

            return callback(json);
        });
    };

    function UseThen(tag) {
        var options;

        this.tag = tag;

        this.add = function (option) {
            return options = mergeOption(options, option);
        };

        this.always = function () {
            return options;
        };
    }

    UseThen.prototype = {
        length: 0,
        when: function (when, option) {
            if (arguments.length === 1)
                return this.add(when || option);

            if (v2.isString(when)) {
                when = new Function("vm", "try{ with(vm){  if(option) with(option) { return " + when + "; } return " + when + ";} }catch(_){ return false; }");
            }

            this[this.length] = {
                filter: when,
                option: option
            };

            this.length += 1;
        },
        then: function (vm) {
            var i = 0,
                use;
            while ((use = this[i++])) {
                if (use.filter(vm))
                    return use.option;
            }
            return null;
        }
    };

    function dependencyInjection(context, key, inject, value) {
        if (!inject) return value;
        var callback, baseArgs, args = [],
            injections = inject.match(rword);
        if (callback = context[key]) {
            context[key] = function () {
                return applyCallback(callback, baseArgs, context, true);
            };
            return function () {
                for (key in injections) {
                    args[key] = (key = injections[key]) in context.variable ? context.variable[key] : context[key];
                }
                baseArgs = core_slice.call(arguments);
                return applyCallback(value, core_concat.call(args, baseArgs), context, true);
            };
        }
        return function () {
            for (key in injections) {
                args[key] = (key = injections[key]) in context.variable ? context.variable[key] : context[key];
            }
            return applyCallback(value, args, context, true);
        };
    }

    function dependencyInjectionFn(key, inject, value) {
        if (!inject) return value;
        return function () {
            for (key in injections) {
                args[key] = (key = injections[key]) in this.variable ? this.variable[key] : this[key];
            }
            return applyCallback(value, args, this, true);
        };
    }

    var use = namespaceCache(function (tag) {
        return new UseThen(tag);
    }, function (source, option, when) {
        if (when === undefined) {
            source.when(option);
        } else {
            source.when(when, option);
        }
    }, function () {
        return [];
    }, function (results, option) {
        results.unshift(option);
    });

    var useConfig = function (option) {
        var type, match, fn = v2.fn;

        v2.each(option, function (value, name) {

            type = v2.type(value);

            if (!(name in fn)) {
                name = analyzeWildcards(baseCards, name, type, true);
            }

            if (name === 'enumState') {
                return v2.log('Attribute enumState can only be injected by fn[v2.useMap(,{enumState:{}})].', 15);
            }

            if (type === 'function' && (match = rinject.exec(name))) {
                value = dependencyInjectionFn(match[1], match[2], value);
            }

            fn[name] = value;
        });
    };

    v2.extend({
        use: function (tag, when, option) {
            if (arguments.length < 3) {
                option = when;
                when = undefined;
            }
            if (v2.isString(tag)) {
                if (arguments.length === 1) {
                    return use(tag);
                }

                return v2.useMvc(tag, function () {
                    return use(tag, option, when);
                });
            }

            if (v2.isPlainObject(tag)) {
                return useConfig(tag);
            }
        },
        useMap: function (tag, enumState) {
            switch (typeof tag) {
                case 'string':
                    tag = v2.kebabCase(tag.toLowerCase());
                    return useMap.when(function (vm) {
                        return v2.kebabCase(vm.tag) === tag;
                    }, enumState);
                case 'function':
                    return useMap.when(tag, enumState);
                case 'regex':
                    return useMap.when(function (vm) {
                        return tag.test(vm.tag);
                    }, enumState);
                case 'boolean':
                    if (tag) {
                        return useMap.when(returnTrue, enumState);
                    }
                default:
                    return v2.error('Type is not supported(' + tag + ')!');
            }
        },
        useMvc: function (_, resolve) {
            return resolve();
        }
    });


    var stackCache = {};

    function V2Stack(master) {
        this.ready(this.master = master);
    }
    V2Stack.prototype = {
        tag: "*",
        length: 0,
        identity: 0,
        readyWait: 0,
        ready: function (master) {
            master.sleep(true);
            stackCache[this.identity = master.identity] = this;
        },
        complete: function (tag) {
            var i = 0,
                j,
                group,
                callback,
                readyWait = this.readyWait -= 1;

            while ((callback = this[i++])) {

                if (callback.tag === '*' | callback.tag === tag || readyWait === 0) {

                    if (callback(this.master) === false) {
                        group = callback.group;
                        if (group > 0) {

                            j = i;
                            while ((callback = this[j])) {
                                if (callback.group === group) {
                                    core_splice.call(this, j, 1);
                                } else {
                                    j++;
                                }
                            }

                        }
                    }

                    core_splice.call(this, i -= 1, 1);
                }

                if (this.readyWait > readyWait) return false;
            }
            if (this.readyWait === 0) {
                this.master.sleep(false);
                return true;
            }
        },
        waitSatck: function (tag, callback) {
            this.tag = tag;
            this.readyWait += 1;
            return this.pushStack(callback);
        },
        pushStack: function (callback, group) {
            if (this.readyWait === 0)
                return callback(this.master);

            callback.group = group;

            callback.tag = this.tag;
            callback.readyWait = this.readyWait;

            this[this.length] = callback;
            this.length += 1;
            return this;
        }
    };

    function V2Controls() { }

    V2Controls.prototype = {
        length: 0,
        add: function (control) {

            this[this.length] = control;
            this.length += 1;

            return control;
        },
        remove: function (control) {

            var index = core_indexOf.call(this, control);

            if (index > -1) return core_splice.call(this, index, 1);

            return index;
        },
        destory: function () {

            var i = 0,
                control;

            while ((control = this[i++])) {
                control.destory();
            }
        },
        eq: function (index) {
            return this[index < 0 ? this.length + index : index] || null;
        },
        offset: function (control, offset) {

            var index = core_indexOf.call(this, control);

            if (index === -1) return null;

            return this[index + offset] || null;
        }
    };

    function applyCallback(callback, args, context, sliced) {
        if (!args || args.length === 0) return callback.call(context);
        if (args.length === 1) return callback.call(context, args[0]);
        if (args.length === 2) return callback.call(context, args[0], args[1]);
        if (args.length === 3) return callback.call(context, args[0], args[1], args[2]);
        return callback.apply(context, sliced ? args : core_slice.call(args));
    }

    var
        GLOBAL_VARIABLE_IDENTITY = 0,
        GLOBAL_VARIABLE_LOOP_GROUP = 0,
        GLOBAL_VARIABLE_STARTUP_COMPLETE = true,
        GLOBAL_VARIABLE_CURRENT_CONTROL = null;

    v2.GDir = makeCache(function (tag) {
        var fn = (new Function("return function " + v2.pascalCase(tag) + "Colection(){}"))();

        fn.prototype = new ArrayThen();

        return v2.GDir[tag + "s"] = new fn();
    }, true);

    function destroyObject(object, deep, excludes) {

        var i, isControl, isArray;

        if (!object) return null;

        isControl = object.v2version === version;
        isArray = excludes && v2.isArray(excludes);

        for (i in object) {

            done(i, object[i]);

            if (!(isArray ? core_indexOf.call(excludes, key) > -1 : excludes[key])) {
                object[i] = null;
            }
        }

        return object[i] = null;

        function done(key, value) {
            if (!value || !deep || value === object || (isArray ? core_indexOf.call(excludes, key) > -1 : excludes[key]))
                return;

            if (value.v2version === version) {
                if (isControl && object.host === value)
                    return value.controls.remove(object);
                else
                    return value.destory && value.destory(true);
            }

            if (value.nodeType) {
                if (isControl && value.nodeType === 1 && object.$ === value)
                    return value.remove();

                return;
            }

            if (v2.isPlainObject(value) || isArraylike(value)) {
                return destroyObject(object, excludes, true);
            }
        }
    }

    var useMap = new UseThen('*');

    useMap.when({
        design: 0.5, // 设计
        init: 1, // 初始化
        build: 2, // 构建
        render: 4, // 渲染
        usb: 8, // 监听
        ready: 16, // 就绪
        load: 32, // 加载数据
        commit: 64 // 完成提交
    });

    v2.fn = v2.prototype = {
        version: version,
        create: function (tag, options) {

            if (arguments.length === 1 && v2.isPlainObject(tag)) {
                options = tag;
                tag = options.tag;
            }

            options = v2.extend(true, {}, options);

            options.host = this;
            options.$$ = options.$$ || this.$;

            if (!this.components)
                return this.controls.add(v2(tag, options));

            var stack = stackCache[this.identity] || new V2Stack(this);

            var component = this.components[tag = v2.kebabCase(tag)];

            GLOBAL_VARIABLE_STARTUP_COMPLETE = false;

            var control = component ? v2.isFunction(component) ? component(tag, options) : v2(tag, v2.improve(options, component)) : v2(tag, options);

            GLOBAL_VARIABLE_STARTUP_COMPLETE = true;

            component = this.components[tag + ".async"];

            if (component) {
                stack.waitSatck(tag, function () {
                    control.startup();
                });
                component(function () {
                    stack.complete(tag);
                });
            } else {
                stack.pushStack(function () {
                    control.startup();
                });
            }

            return this.controls.add(control);
        },
        width: null,
        height: null,
        limit: false,
        access: false,
        skipOn: false,
        visible: true,
        defaultVisible: true,
        init: function (tag, option) {
            this.tag = tag;
            this.option = option;

            this.host = null;

            this.class = "";

            this.$ = this.$$ = null;

            this.demand = this.request = this.response = null;

            this.view = this.watch = this.data = null;

            var identity = ++GLOBAL_VARIABLE_IDENTITY;

            v2.define(this, "identity", {
                get: function () {
                    return identity;
                }
            });

            if (GLOBAL_VARIABLE_STARTUP_COMPLETE) {
                this.startup();
            }
        },
        startup: function () {

            this.events = {};
            this.methods = {};
            this.components = {};

            this.enumState = v2.extend({}, useMap.then(this) || useMap.always());

            this.wildcards = v2.extend(true, {}, baseCards);

            this.compile();

            this.switchCase();
        },
        compile: function () {
            var fn,
                timer,
                controls,
                sleep = false,
                isReady = false,
                core_namespace = "",
                variable = {},
                descriptors = {},
                callbacks = [],
                watchStack = [],
                context = this,
                excludes = {
                    identity: true
                },
                wildcards = this.wildcards,
                makeCallback = function (callback, key, namespace) {

                    if (callback.identity === context.identity)
                        return callback;

                    var _callback = function () {
                        var base = context.base,
                            tmp_namespace = context.namespace,
                            value = context.enumState[key] >>> 0;

                        context.base = base.base;
                        core_namespace = namespace;

                        value = value <= 1 ?
                            applyCallback(callback, arguments, context) :
                            value >= 64 ?
                                callback.call(context) :
                                value < 4 ?
                                    callback.call(context, context.view) :
                                    value < 8 ?
                                        callback.call(context, context.variable) :
                                        value < 16 ?
                                            callback.call(context, context.watch) :
                                            value < 32 ?
                                                callback.call(context, context.variable, context.watch) :
                                                value < 64 ?
                                                    callback.call(context, context.data) :
                                                    callback.call(context, context.view, context.data);

                        context.base = base;
                        core_namespace = tmp_namespace;

                        return value;
                    };

                    _callback.identity = context.identity;

                    return _callback;
                },
                extendsCallback = function (base, key, value, namespace) {
                    if (base[key]) {
                        extendsCallback(base.base = base.base || {}, key, base[key]);
                    }
                    base[key] = makeCallback(value, key, namespace);
                },
                initControls = function (option, define, highest) {
                    var tag, type;

                    if (!option) return option;

                    tag = option.tag;

                    if (define && !highest) {
                        if (core_namespace) {
                            core_namespace += '.' + tag;
                        } else {
                            core_namespace = tag;
                        }
                    }

                    type = v2.type(option);

                    if (type === "function") {

                        option.call(context);

                        return v2.each(option.prototype, done);
                    }

                    if (tag && (fn = option[tag] || option[v2.camelCase(tag)]) && v2.isFunction(fn)) {

                        fn.call(context, option);
                    }

                    return v2.each(option, done);

                    function done(value, key) {
                        var match,
                            type,
                            sourceValue,
                            conversionType;

                        if (key === tag || key === 'tag' || key === 'constructor' || value === undefined) return;

                        if (key === 'enumState') {
                            return v2.log('Attribute enumState can only be injected by fn[v2.use({enumState:{}})].', 15);
                        }

                        if (key in context) {
                            sourceValue = context[key];
                        } else {
                            key = analyzeWildcards(wildcards, key, type, define);

                            if (key in context) {
                                sourceValue = context[key];
                            }
                        }

                        type = v2.type(value);

                        if (type === 'function' && (match = rinject.exec(key))) {
                            value = dependencyInjection(context, key = match[1], match[2], value);
                        }

                        if (sourceValue === null || sourceValue === undefined) {

                            if (!define || type === 'function') {

                                context[key] = value;

                            } else {
                                variable[key] = value;
                            }

                            return;
                        }

                        conversionType = v2.type(sourceValue);

                        if (type === 'function') {

                            if (conversionType === "function") {

                                context[key] = value;

                                if (highest && highest[key] === sourceValue) {
                                    return;
                                }

                                return extendsCallback(context.base || (context.base = {}), key, sourceValue, core_namespace);
                            }

                            excludes[key] = true;

                            return descriptors[key] = {
                                value: sourceValue,
                                callback: value,
                                beforeSetting: null,
                                conversionType: conversionType,
                                allowFirstSet: true
                            };
                        }

                        if (key in context.enumState) {
                            return v2.error("The enumerated state property value must be a function!");
                        }

                        if (key in wildcards) {
                            variable[key] = value;
                        } else {
                            value = changeType(value, conversionType, type);

                            if (type === "object" || type === "array")
                                return context[key] = v2.extend(define, sourceValue, value);

                            context[key] = value;
                        }
                    }
                };

            this.init = function (tag, tagName) {
                var node, parentNode, type;

                if (arguments.length === 0) {
                    tag = "*";
                    tagName = "div";
                }

                type = v2.type(tag);

                if (tagName === undefined) {
                    if (type !== "string")
                        return v2.error("The tag name provided ('" + tagName + "') is not a valid name.");

                    tagName = tag === '*' ? 'div' : tag;
                }

                if (!(!(node = this.demand) ||
                    v2.isString(node) && !(node = this.take(node, parentNode)) ||
                    isArraylike(node) && !(node = node[0]) ||
                    (node.version === version) && (node = node.$core) ||
                    !(node.nodeType === 1))) {
                    this.demand = node;
                }

                if (!(!(node = this.request) ||
                    v2.isString(node) && !(node = this.take(node, parentNode)) ||
                    isArraylike(node) && !(node = node[0]) ||
                    (node.version === version) && (node = node.$core) ||
                    !(node.nodeType === 1))) {
                    this.request = node;
                }

                if (!(!(node = this.response) ||
                    v2.isString(node) && !(node = this.take(node, parentNode)) ||
                    isArraylike(node) && !(node = node[0]) ||
                    (node.version === version) && (node = node.$core) ||
                    !(node.nodeType === 1))) {
                    this.response = node;
                }

                if (!(parentNode = this.$$) ||
                    v2.isString(parentNode) && !(parentNode = this.take(parentNode, this.host ? this.host.$ : document)) ||
                    isArraylike(parentNode) && !(parentNode = parentNode[0]) ||
                    !(parentNode.nodeType === 1)) {

                    parentNode = this.host ? this.host.$ : document.body;
                }

                if (!(node = this.$) ||
                    v2.isString(node) && !(node = this.take(node, parentNode)) ||
                    isArraylike(node) && !(node = node[0]) ||
                    !(node.nodeType === 1)) {

                    return this.$$ = parentNode, this.$ = this.$$.appendChild(node || document.createElement(tagName));
                }

                if (node.parentNode) {
                    parentNode = node.parentNode;
                } else {
                    parentNode.appendChild(node);
                }

                switch (type) {
                    case "string":
                        if (tag === '*' || node.nodeName.toLowerCase() === tag)
                            return this.$$ = parentNode, this.$ = node;
                        break;
                    case "array":
                        if (core_indexOf.call(tag, node.nodeName.toLowerCase()) > -1)
                            return this.$$ = parentNode, this.$ = node;
                        break;
                    case "object":
                        if (tag[node.nodeName.toLowerCase()])
                            return this.$$ = parentNode, this.$ = node;
                        break;
                    case "function":
                        if (tag(node.nodeName.toLowerCase()))
                            return this.$$ = parentNode, this.$ = node;
                        break;
                    case "regex":
                        if (tag.test(node.nodeName.toLowerCase()))
                            return this.$$ = parentNode, this.$ = node;
                        break;
                    default:
                        return v2.error("Validation of type " + type + " is not supported.");
                }

                v2.error("Components do not support elements whose NodeName is " + node.nodeName.toLowerCase() + ".");
            };

            v2.each(v2.use(this.tag), function (then) {
                var option = then.always(),
                    supper = then.then(context);

                if (!option || !supper) {
                    return initControls(option || supper, true);
                }
                initControls(option, true);
                initControls(supper, true, option);
            });

            initControls(this.option);

            v2.each(core_namespace.split('.'), function (name) {
                if (rtag.test(name))
                    v2.GDir(name).add(context);
            });

            var namespaces = core_namespace.split('.');

            this.like = function () {
                return v2.any(arguments, function (tag) {
                    if (v2.isFunction(tag)) {
                        return tag(context);
                    }
                    return namespaces.indexOf(v2.kebabCase(tag + '')) > -1;
                });
            };
            this.hostlike = function () {
                if (this.host) {
                    return applyCallback(this.host.like, arguments, this.host);
                }
            };

            v2.each(descriptors, function (map, key) {
                v2.define(context, key, makeDescriptor(map.value, map.callback, map.beforeSetting, map.conversionType, map.allowFirstSet));
            });

            this.sleep = function (extra) {
                if (arguments.length === 0)
                    return sleep;

                var type = v2.type(extra);

                if (type === "boolean") {
                    extra = ~~sleep + ~~extra;
                    sleep = !!(extra - ~~sleep);
                    extra = !!(extra - ~~sleep);

                    if (extra && !sleep) {
                        this.lazy(function () {

                            this.switchCase();

                            while ((extra = callbacks.shift())) {
                                extra.call(this);
                            }
                        });
                    }
                    return extra === sleep;
                }
                if (type === "function") {
                    if (sleep) {
                        callbacks.push(extra);
                    } else {
                        this.lazy(false, extra);
                    }
                } else if (type === "number") {

                    sleep = true;

                    if (timer) clearTimeout(timer);

                    timer = setTimeout(function () {
                        timer = null;
                        context.lazy(function () {

                            this.switchCase();

                            while ((extra = callbacks.shift())) {
                                extra.call(this);
                            }
                        });
                    }, extra);
                }
                return sleep;
            };

            this.switchCase = function (state, falseStop) {
                var i, value, control, prevValue, _isReady = true;

                if (isReady) return;

                if (typeof state === "boolean") {
                    falseStop = state;
                    state = undefined;
                }

                falseStop = falseStop || falseStop === undefined;

                control = GLOBAL_VARIABLE_CURRENT_CONTROL;

                GLOBAL_VARIABLE_CURRENT_CONTROL = this;

                if (v2.isString(state)) {
                    state = this.enumState[state];
                }

                prevValue = state = +state || 0;

                this.readyState = +this.readyState || 0;

                for (i in this.enumState) {

                    value = +this.enumState[i] || 0;

                    if (value <= this.readyState) continue;

                    this.readyState = value;

                    if (value <= state) continue;

                    if (!this[i]) continue;

                    if (this.access && prevValue < 32 && value <= 32) {
                        if (falseStop && (this.ajax() === false || this.sleep())) {
                            _isReady = false;
                            break;
                        }
                    }

                    prevValue = value;

                    if (value > 8) {

                        if (prevValue <= 8) {
                            computeWildcards(this, 'function');
                        }

                        while (value = watchStack.shift()) {
                            value();
                        }

                        value = prevValue;
                    }

                    value = (value <= 1 || value >= 64) ?
                        this[i]() :
                        value < 4 ?
                            this[i](this.view) :
                            value < 8 ?
                                this[i](this.variable) :
                                value < 16 ?
                                    this[i](this.watch) :
                                    value < 32 ?
                                        this[i](this.variable, this.watch) :
                                        value < 64 ?
                                            this[i](this.data) :
                                            this[i](this.view, this.data);

                    if (falseStop && (value === false || this.sleep())) {
                        _isReady = false;
                        break;
                    }
                }

                if (isReady = _isReady) {

                    this.define('visible', function (value) {
                        if (value) {
                            this.show();
                        } else {
                            this.hide();
                        }
                    }, this.visible == this.defaultVisible);

                    watchStack = null;
                }

                GLOBAL_VARIABLE_CURRENT_CONTROL = control;
            };

            this.define = function (prop, descriptor, elem, defineOnly) {
                var isFunction;

                if (descriptor && descriptor.nodeType === 1) {

                    defineOnly = arguments.length < 4 ? !!elem : defineOnly;

                    elem = descriptor;

                    descriptor = undefined;

                } else if (typeof elem === 'boolean') {

                    defineOnly = elem;
                    elem = undefined;

                } else if (typeof descriptor === 'boolean') {

                    defineOnly = descriptor;
                    descriptor = undefined;
                }


                if (v2.isPlainObject(prop)) {
                    elem = descriptor || this.$core;

                    return v2.each(prop, function (attributes, name) {
                        done(name, attributes);
                    }), this;
                }


                elem = elem || this.$core;

                isFunction = v2.isFunction(descriptor);

                return v2.each(prop.match(rnotwhite), function (name) {
                    done(name, descriptor);
                }), this;

                function done(name, attributes) {
                    var contains = elem && (name in elem),
                        sourceValue = context[name],
                        conversionType,
                        typeOnly;

                    if (name in excludes) {
                        return v2.log('Attributes cannot be repeatedly defined(' + name + ').', 15);
                    }
                    if (name in descriptors) {
                        v2.log('Attributes is overridden by control definitions(' + name + ').', 7);
                    }
                    excludes[name] = true;

                    if (contains && (sourceValue === null || sourceValue === undefined)) {
                        typeOnly = true;
                        sourceValue = elem[name];
                    }

                    if (isFunction || isFunction === undefined && v2.isFunction(attributes)) {
                        attributes = makeDescriptor(sourceValue, attributes, contains && function (value) {
                            elem[name] = value;
                        }, null, true);
                    }

                    if (attributes === undefined || attributes === null) {

                        conversionType = v2.type(sourceValue);

                        attributes = {
                            configurable: true,
                            get: contains ? function () {
                                return elem[name];
                            } : conversionType === 'boolean' ? function () {
                                return elem.getAttribute(name) === name;
                            } : function () {
                                return elem.getAttribute(name);
                            },
                            set: contains ? function (value) {
                                elem[name] = value;
                            } : conversionType === 'boolean' ? function (value) {
                                if (value) {
                                    elem.setAttribute(name, name);
                                } else {
                                    elem.removeAttribute(name);
                                }
                            } : function (value) {
                                elem.setAttribute(name, value);
                            }
                        };
                    }

                    v2.define(context, name, attributes);

                    if (defineOnly || typeOnly || sourceValue === undefined || sourceValue === null || sourceValue === Infinity || sourceValue === -Infinity || sourceValue !== sourceValue) {
                        if (contains && (attributes === true || "set" in attributes || attributes.writable === true)) {
                            if (isReady) {
                                elem[name] = sourceValue;
                            } else {
                                watchStack.push(function () {
                                    elem[name] = sourceValue;
                                });
                            }
                        }
                    } else if (attributes === true || "set" in attributes || attributes.writable === true) {
                        if (isReady) {
                            context[name] = sourceValue;
                        } else {
                            watchStack.push(function () {
                                context[name] = sourceValue;
                            });
                        }
                    }
                }
            };

            this.destory = function (deep) {

                v2.each(core_namespace.split('.'), function (name) {
                    if (rtag.test(name))
                        v2.GDir(name).remove(context);
                });

                destroyObject(controls, true);

                destroyObject(variable, true);

                destroyObject(descriptors, true);

                destroyObject(this.base, true);

                destroyObject(this, deep || arguments.length === 0, excludes);

                context = null;
                core_namespace = null;
                variable = wildcards = excludes = controls = callbacks = descriptors = null;
            };

            this.define('isReady', function () { return isReady; });

            this.define({
                tag: function () {
                    return core_namespace.split('.').pop();
                },
                namespace: function () {
                    return core_namespace;
                },
                wildcards: function () {
                    return wildcards;
                },
                variable: function () {
                    return variable;
                }
            });

            this.define('class', function (value) {
                if (value) {
                    v2.each(value.match(rnotwhite), function (clazz) {
                        context.$.classList.add(clazz);
                    });
                }
            });

            this.define('$core', function (value, iswite) {

                if (iswite) return value;

                return value || this['$' + this.tag] || this.$;
            });

            this.define({
                controls: function () {
                    return controls || (controls = new V2Controls());
                },
                firstChild: function () {
                    return this.controls.eq(0);
                },
                lastChild: function () {
                    return this.controls.eq(-1);
                },
                previousSibling: function () {
                    return this.host && this.host.controls.offset(this, -1);
                },
                nextSibling: function () {
                    return this.host && this.host.controls.offset(this, 1);
                }
            });

            computeWildcards(wildcards, 'function', true);
        },
        lazy: function () {
            var i = 0,
                fn,
                loop,
                args,
                stack,
                context = this,
                identity = this.identity;

            while ((fn = arguments[i++]) && !v2.isFunction(fn)) {
                if (typeof fn === 'boolean') {
                    loop = fn;
                } else {
                    context = fn;
                }
            }

            if (!fn) return false;

            if (loop) {

                var group = ++GLOBAL_VARIABLE_LOOP_GROUP;

                return function () {
                    var args, stack;

                    if ((stack = stackCache[identity])) {

                        args = core_slice.call(arguments);

                        return stack.pushStack(function () {
                            return applyCallback(fn, args, context, true);
                        }, group);
                    }

                    return applyCallback(fn, arguments, context);
                };
            }

            args = core_slice.call(arguments, i);

            if (!!(stack = stackCache[identity])) {
                return stack.pushStack(function () {
                    return applyCallback(fn, args, context, true);
                });
            }

            return applyCallback(fn, args, context, true);
        },
        when: function (extra, context) {
            if (v2.isString(extra) && (!context || context.nodeType == 1)) {
                return v2.when(this.take(extra, context || this.$, true));
            }
            if (arguments.length > 1) {
                return v2.when.apply(v2, core_slice.call(arguments, 0));
            }
            return v2.when(extra || this.$);
        },
        take: function (selector, context, all) {

            if (arguments.length === 2 && typeof context === 'boolean') {
                all = context;
                context = undefined;
            }

            context = context || this.$;

            return all ? context.querySelectorAll(selector) : context.querySelector(selector);
        }
    };

    var inlineTag = "a|abbr|acronym|b|bdo|big|br|cite|code|dfn|em|font|i|img|kbd|label|q|s|samp|small|span|strike|strong|sub|sup|tt|u|var",
        rinlineTag = new RegExp('^(' + inlineTag + ")$");

    function makeUsbDescriptor(prop, getter, setter) {
        name = v2.pascalCase(prop);
        return {
            get: function () {
                var callback = this['get' + name];

                return callback ? callback.call(this) : getter.call(this);
            },
            set: function (value) {
                var callback = this['set' + name];

                if (callback) {
                    callback.call(this, value);
                } else {
                    setter.call(this, value);
                }
            }
        };
    }

    v2.extend(v2.fn, {
        usb: function (watch) {
            this.define('disabled', function (value) {
                this.$.classList[value ? "add" : "remove"]('disabled');
            });

            this.define({
                width: makeUsbDescriptor('width', function () {
                    return this.$.css('width');
                }, function (value) {
                    this.$.styleCb('width', value);
                }),
                height: makeUsbDescriptor('height', function () {
                    return this.$.css('height');
                }, function (value) {
                    this.$.styleCb('height', value);
                })
            });

            if (v2.isPlainObject(watch))
                this.define(watch);
        },
        commit: function () {
            if (this.skipOn) return;

            v2.each(this.events, function (handle, type) {
                this.$.on(type, handle);
            }, this);
        },
        invoke: function (fn) {

            if (!fn) return;

            if (v2.isString(fn)) {
                fn = this.methods[fn] || this.methods[v2.camelCase(fn)];
            }
            if (v2.isFunction(fn)) {
                if (arguments.length > 1)
                    return fn.apply(this, core_slice.call(arguments, 1));
                return fn.call(this);
            }
        },
        build: function (view) {
            var type;

            if (view === null || view === undefined)
                return;

            type = v2.type(view);

            switch (type) {
                case 'string':
                    return this.$.appendChild(view.html());
                case 'array':
                    return v2.each(view, this.lazy(true, this.build));
                case 'object':
                    if (view.nodeType) {
                        return this.$.appendChild(view);
                    }
                    if ('tag' in view) {
                        return this.lazy(this.create, view);
                    }
                    return v2.each(view, this.lazy(true, this.create));
                case 'function':
                    return view.call(this);
                default:
                    return v2.error('Unsupported exception:View types are not supported.');
            }
        }
    });

    v2.use({
        '&focus': function () {
            try {
                this.$.focus();
            } catch (_) { }
        },
        "?toggle": function (toggle) {
            if (arguments.length > 0) {

                return this.visible = !!toggle;
            }
            return this.visible = !this.visible;
        },
        "&show": function () {
            var nodeName = this.$.nodeName.toLowerCase(),
                display = nodeName === 'table' ?
                    'table' :
                    nodeName === 'tr' ?
                        'table-row' :
                        (nodeName === 'td' || nodeName === 'th') ?
                            'table-cell' :
                            rinlineTag.test(nodeName) ?
                                'inline' :
                                '';

            this.$.styleCb('display', display);
            this.visible = true;
        },
        "&hide": function () {
            this.$.styleCb('display', 'none');
            this.visible = false;
        }
    });

    v2.fn.init.prototype = v2.fn;

    function noop() { }

    var xhrCb = window.XMLHttpRequest,
        xhr = new xhrCb(),
        xhrId = 0,
        xhrWait = {},
        xhrCallbacks = {},
        xhr_send = xhr.send,
        xhr_open = xhr.open,
        xhr_abort = xhr.abort;
    v2.extend(xhrCb.prototype, {
        open: function (_method, _url, async) {
            if (async && GLOBAL_VARIABLE_CURRENT_CONTROL) {
                var status, xhr = this,
                    v2Control = GLOBAL_VARIABLE_CURRENT_CONTROL,
                    identity = v2Control.identity;
                v2Control.sleep(true);
                if (xhrWait[identity]) {
                    xhrWait[identity] += 1;
                } else {
                    xhrWait[identity] = 1;
                }
                xhrCallbacks[xhr.xhrId = ++xhrId] = function () {
                    if (xhr.readyState === 4) {
                        status = xhr.status;
                        xhr.onreadystatechange = noop;
                        if (status >= 200 && status < 300 || status === 304 || status === 1223) {
                            if (!(xhrWait[identity] -= 1)) {
                                v2Control.sleep(false);
                            }
                        }
                        delete xhrCallbacks[xhr.xhrId];
                    }
                };
            }
            return applyCallback(xhr_open, arguments, this);
        },
        send: function (data) {
            var xhr = this,
                xhr_id = xhr.xhrId;
            if (xhr_id && xhr_id > 0) {
                setTimeout(function () {
                    if (xhr.readyState === 4) {
                        if (xhr_id in xhrCallbacks) {
                            xhrCallbacks[xhr_id]();
                        }
                        return;
                    }
                    var onchange, callback = xhr.onreadystatechange;
                    xhr.onreadystatechange = callback ? (onchange = function () {
                        applyCallback(callback, arguments, this);
                        if (xhr_id in xhrCallbacks) {
                            xhrCallbacks[xhr_id]();
                        }
                        if (xhr_id in xhrCallbacks && onchange !== xhr.onreadystatechange) {
                            callback = xhr.onreadystatechange || noop;
                            xhr.onreadystatechange = onchange;
                        }
                    }) : xhrCallbacks[xhr_id];
                });
            }
            return data ? xhr_send.call(this, data) : xhr_send.call(this);
        },
        abort: function () {
            if (this.xhrId) {
                delete xhrCallbacks[this.xhrId];
            }
            return xhr_abort.call(this);
        }
    });

    if (typeof define === "function") {
        define("v2", [], function () {
            return v2;
        });
    }

    window.v2Kit = window.v2 = v2;
});