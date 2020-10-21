/*!
 * JavaScript v2 v1.1.1
 * https://github.com/tinylit/v2
 *
 ** @author tinylit
 ** @date 2019-05-20
 ** @descript a valuable technology object.
 */
(function (global, factory) {
    return typeof exports === 'object' && typeof module === "object" ?
        module.exports = global.document ?
            factory(global) :
            function (window) {
                if (window.document === null || window.document === undefined)
                    throw new Error("v2 requires a window with a document");

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
        if (!source || !option || source === option)
            return source || option;

        if (!v2.isFunction(option))
            return v2.extend(true, source, option);

        if (!v2.isFunction(source))
            return v2.extend(true, option, source);

        var callback = function () {
            var sourceConfig = applyCallback(source, arguments, this);
            var optionConfig = applyCallback(option, arguments, this);

            if (sourceConfig === undefined) {
                return optionConfig;
            }

            if (optionConfig === undefined) {
                return sourceConfig;
            }

            return v2.extend(sourceConfig, optionConfig);
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
            tagCache = {},
            matchCache = makeCache(function (namespace) {
                return new RegExp("^" + namespace.replace(/\./g, "\\.").replace(rany, "[^\\.]+") + "$", "i");
            }, true),
            namespaceCache = function (tag, namespace) {
                var value = tagCache[tag];
                if (value === undefined) {
                    return tagCache[tag] = !namespace || namespace === "*" ? tag : namespace + "." + tag;
                }
                return value;
            },
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

        function done(string, option) {

            var namespace;

            string = v2.kebabCase(string);

            if (option === undefined) {
                var results = objectCreate(string);
                while (rnamespaceGet.test(namespace = namespace || namespaceCache(string))) {
                    option = fnGet(namespace, string = RegExp.$2);
                    if (option) {
                        objectCallback(results, option);
                    }
                    namespace = RegExp.$1;
                    if (!namespace || namespace === "*") break;
                }
                return results;
            }

            if (rnamespace.test(string)) {
                return fnSet(RegExp.$1, RegExp.$2, option, core_slice.call(arguments, 2));
            }

            v2.error("string:" + string + ",Invalid class name space.");
        };

        done.exists = function (string) {
            var namespace;

            string = v2.kebabCase(string);

            while (rnamespaceGet.test(namespace = namespace || namespaceCache(string))) {

                if (fnGet(namespace, string = RegExp.$2)) {
                    return true;
                }

                namespace = RegExp.$1;

                if (!namespace || namespace === "*") break;
            }

            return false;
        };

        return done;
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
            return type === "array" || len === 0 || len > 0 && typeof length === "number" && len - 1 in object;
        } catch (_) {
            return false;
        }
    }

    function analyzeWildcards(wildCards, key, type, define) {
        if (!wildCards || !key) return key;

        var config, item = coreCards[key[0]];
        if (item) {
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
        for (var i = 0; i < arguments.length; i++) {
            this.add(arguments[i]);
        }
    }

    ArrayThen.prototype = {
        length: 0,
        add: function (item) {
            if (item === undefined)
                return this;

            if (isArraylike(item)) {
                return v2.merge(this, item);
            }
            this[this.length] = item;
            this.length += 1;

            return this;
        },
        insert: function (index, item) {
            if (item === undefined) {
                return this;
            }

            for (var i = index, len = this.length; len > i; i++) {
                this[i + 1] = this[i];
            }

            this[index] = item;

            this.length += 1;

            return this;
        },
        remove: function (item) {
            if (item === undefined) return -1;

            var index = core_indexOf.call(this, item);

            if (index > -1) {

                if (isIE8) {
                    for (var i = 0, length = this.length; i < length; i++) {
                        if (index >= i)
                            continue;

                        if (i > index) {
                            this[i - 1] = this[i];
                        }
                    }

                    this.length--;

                    delete this[this.length];
                } else {
                    core_splice.call(this, index, 1);
                }
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
        first: function (callback) {
            if (arguments.length > 0) {
                return v2.find(this, callback);
            }

            return this.eq(0);
        },
        last: function (callback) {
            if (arguments.length === 0) {
                return this.eq(-1);
            }

            for (var i = this.length - 1; i > -1; i--) {
                var item = this[i];
                if (callback.call(item, item, i, this))
                    return item;
            }

            return null;
        },
        eq: function (index) {
            var value = this[index < 0 ? index + this.length : index];

            if (value || value === 0) {
                return value;
            }
            return null;
        },
        sum: function (callback) {
            var i = 0, item, value, result;
            while ((item = this[i++])) {
                value = callback.call(item, item, i, this);
                if (result === undefined) {
                    result = value;
                } else {
                    result += value;
                }
            }
            return result;
        },
        max: function (callback) {
            var i = 0, item, value, result;
            while ((item = this[i++])) {
                value = callback.call(item, item, i, this);

                if (result === undefined || value > result) {
                    result = value;
                }
            }
            return result;
        },
        min: function (callback) {
            var i = 0, item, value, result;
            while ((item = this[i++])) {
                value = callback.call(item, item, i, this);

                if (result === undefined || value < result) {
                    result = value;
                }
            }
            return result;
        },
        avg: function (callback) {
            var value = this.sum(callback);

            return value / this.length;
        }
    };

    ArrayThen.prototype.nth = ArrayThen.prototype.eq;
    ArrayThen.prototype.forEach = ArrayThen.prototype.each = ArrayThen.prototype.done = ArrayThen.prototype.then;

    var
        GLOBAL_VARIABLE_IDENTITY = +(new Date()), //? 唯一身份ID
        GLOBAL_VARIABLE_LOOP_GROUP = 0, //? 唯一迭代器组ID
        GLOBAL_VARIABLE_KNOWN_NODE_REMOVED = false, //? 移除节点
        GLOBAL_VARIABLE_ON_ROUTES = false, //? 是否处于路由中
        GLOBAL_VARIABLE_STARTUP_COMPLETE = true, //? 控制是否自动提交渲染
        GLOBAL_VARIABLE_CURRENT_CONTROL = null; //? 当前渲染控件

    function v2(tag, option) {
        if (arguments.length === 1 && v2.isPlainObject(tag)) {
            option = tag;
            tag = option.tag;
        }

        if (GLOBAL_VARIABLE_ON_ROUTES) {
            return v2.error('禁止在路由中生成新组件!');
        }

        return v2.useMvc(tag, function () {
            return new v2.fn.init(tag, option);
        });
    }

    v2.type = function (object) {
        return object === null || object === undefined ? String(object) : typeof object === "object" || typeof object === "function" ? class2type[core_toString.call(object)] || "object" : typeof object;
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

                value = done(target[key], option[key], key);

                if (value === undefined) {
                    delete target[key];
                } else {
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
        return value === null || value === undefined ? option : value;
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
                    if (i in object && callback.call(context || object[i], object[i], i, object) === false) break;
                }
            } else {
                for (i in object) {
                    if (callback.call(context || object[i], object[i], i, object) === false) break;
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

                    if (i in object) {

                        value = callback.call(context || object[i], object[i], i, object);

                        if (value === undefined || value === null)
                            continue;

                        arr.push(value);
                    }
                }
            } else {
                for (i in object) {
                    value = callback.call(context || object[i], object[i], i, object);

                    if (value === undefined || value === null)
                        continue;

                    arr.push(value);
                }
            }
            return core_concat.apply([], arr);
        },
        all: function (object, callback, context) {
            if (!object || !callback) return false;
            var i = 0;
            if (isArraylike(object)) {
                for (var len = object.length; i < len; i++) {
                    if (i in object && !callback.call(context || object[i], object[i], i, object)) return false;
                }
            } else {
                for (i in object) {
                    if (!callback.call(context || object[i], object[i], i, object)) return false;
                }
            }
            return true;
        },
        any: function (object, callback, context) {
            if (!object) return false;
            var i = 0;
            if (isArraylike(object)) {
                for (var len = object.length; i < len; i++) {
                    if (i in object) {
                        if (!callback || callback.call(context || object[i], object[i], i, object)) return true;
                    }
                }
            } else {
                for (i in object) {
                    if (!callback || callback.call(context || object[i], object[i], i, object)) return true;
                }
            }
            return false;
        },
        find: function (object, callback, context) {
            if (!object || !callback)
                return undefined;

            var i = 0;
            if (isArraylike(object)) {
                for (var len = object.length; i < len; i++) {
                    if (i in object && callback.call(context || object[i], object[i], i, object)) return object[i];
                }
            } else {
                for (i in object) {
                    if (callback.call(context || object[i], object[i], i, object)) return object[i];
                }
            }
            return undefined;
        },
        filter: function (object, callback, context) {
            var results = [];
            if (!object || !callback) return results;
            var i = 0;
            if (isArraylike(object)) {
                for (var len = object.length; i < len; i++) {
                    if (i in object && callback.call(context || object[i], object[i], i, object)) {
                        results.push(object[i]);
                    }
                }
            } else {
                for (i in object) {
                    if (callback.call(context || object[i], object[i], i, object)) {
                        results.push(object[i]);
                    }
                }
            }
            return results;
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
            return string === null || string === undefined ? "" : core_trim.call(string);
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
        if (arguments.length === 0) {
            return new Date();
        }
        if (!date) return new Date(0);

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
        return new Date(0);
    };

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
            return year % 400 === 0 || year % 4 === 0 && year % 100 > 0;
        },
        day: function (date) {
            return v2.date(date).getDate();
        },
        dayOfWeek: function (date) {
            return v2.date(date).getDay();
        },
        dayOfYear: function (date) {
            date = v2.date(date);
            return Math.ceil((date - new Date(date.getFullYear(), 1, 1)) / (24 * 60 * 60 * 1000)) + 1;
        },
        dayCount: function (year, month) {
            if (arguments.length < 2) {
                if (!v2.isDate(year))
                    return -1;

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
        weekOfYear: function (date) {
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

    var ruri = /^(\w+:)\/\/(([\w-]+\.)*[\w-]+)(:(\d+))?/;

    var locationHref;

    try {
        locationHref = location.href;
    } catch (e) {
        var a = document.createElement('a');
        a.href = "";
        locationHref = a.href;
    }

    v2.uri = function (url) {
        return new Uri(url || locationHref);
    };

    var r20 = /%20/g,
        rbracket = /\[\]$/,
        uriInit = function (url) {
            var match = ruri.exec(url);

            if (!match) {
                return v2.syntaxError("无效地址!");
            }

            this.href = url;
            this.origin = match.shift();
            this.protocol = match.shift();
            this.hostname = match.shift();
            this.port = match.pop() || "";
            this.host = this.hostname + (match.pop() || "");

            var indexOfSearch = url.indexOf('?');
            var indexOfHash = url.indexOf('#');

            if (indexOfSearch > -1) {
                if (indexOfHash > -1) {
                    this.search = url.substring(indexOfSearch, indexOfHash);
                } else {
                    this.search = url.slice(indexOfSearch);
                }
            } else {
                this.search = "";
            }

            if (indexOfHash > -1) {
                this.hash = url.slice(indexOfHash);
            } else {
                this.hash = "";
            }

            if (indexOfSearch > -1 || indexOfHash > -1) {
                this.path = url.substring(this.origin.length, indexOfSearch > -1 ? indexOfSearch : indexOfHash);
            } else {
                this.path = url.slice(this.origin.length);
            }
        };

    function Uri(url) {
        uriInit.call(this, url);

        v2.define(this, {
            href: uriInit,
            origin: function (value) {
                this.href = value + this.path + this.search + this.hash;
            },
            protocol: function (value) {
                this.href = value + "//" + this.host + this.path + this.search + this.hash;
            },
            host: function (value) {
                this.href = this.protocol + "//" + value + this.path + this.search + this.hash;
            },
            hostname: function (value) {
                if (!value || value === "80" || value === 80) {
                    this.href = this.protocol + "//" + value + this.path + this.search + this.hash;
                } else {
                    this.href = this.protocol + "//" + value + ":" + this.port + this.path + this.search + this.hash;
                }
            },
            port: function (value, oldValue) {
                if (value && value.charAt(0) === ':') {
                    value = value.slice(1);
                }
                if (!value || value === "80" || value === 80) {
                    this.href = this.protocol + "//" + this.hostname + this.path + this.search + this.hash;
                } else {
                    this.href = this.protocol + "//" + this.hostname + ":" + value + this.path + this.search + this.hash;
                }
            },
            search: function (value) {
                if (value && value.charAt(0) !== '?') {
                    value = '?' + value;
                }
                this.href = this.origin + this.path + value + this.hash;
            },
            hash: function (value) {
                if (value && value.charAt(0) !== '#') {
                    value = '#' + value;
                }
                this.href = this.origin + this.path + this.search + value;
            },
            path: function (value) {
                this.href = this.origin + value + this.search + this.hash;
            }
        });
    }

    function buildParams(prefix, obj, traditional, add) {
        var name;

        if (v2.isArray(obj)) {
            v2.each(obj, function (i, v) {
                if (traditional || rbracket.test(prefix)) {
                    add(prefix, v);
                } else {
                    buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                }
            });

        } else if (!traditional && v2.type(obj) === "object") {
            for (name in obj) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }

        } else {
            add(prefix, obj);
        }
    }

    var rmath = /^[+-]?(0|[1-9][0-9]*\.)?[0-9]+$/,
        numberEquals = function (text, value) {
            if (text === value.toString()) {
                return true;
            }

            var i, indexOfDot = text.indexOf('.');

            if (indexOfDot > -1) {
                for (i = text.length - 1; i > indexOfDot; i--) {
                    if (text.charAt(i) !== '0') {
                        break;
                    }
                }

                if (i === indexOfDot) {
                    return text.substring(0, indexOfDot) === value.toString();
                }
            }

            return false;
        },
        text2valueConvert = function (text, same) {
            if (text === undefined || text === null) {
                return "";
            }

            if (same || !text) {
                return text;
            }

            var value;

            if (text === 'true') {
                return true;
            }

            if (text === 'false') {
                return false;
            }

            if (rmath.test(text)) {
                value = parseFloat(text);

                if (numberEquals(text, value)) {
                    return value;
                }

                return text;
            }

            if (text.charAt(0) === '{' && text.charAt(-1) === '}' || text.charAt(0) === '[' && text.charAt(-1) === ']') {
                try {
                    return (new Function('return ' + text))();
                } catch (e) { }
            }

            return text;
        },
        uriCache = makeCache(function (name) {
            return new RegExp('(\\?|&)' + name + '=(.*?)(&|$)');
        });

    Uri.prototype = {
        toQueryString: function (a, traditional) {
            var prefix,
                s = [],
                add = function (key, value) {
                    if (v2.isFunction(value)) {
                        value = value();
                    }
                    s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
                };

            if (v2.isArray(a)) {
                v2.each(a, function (b) {
                    add(b.name, b.value);
                });

            } else {
                for (prefix in a) {
                    buildParams(prefix, a[prefix], traditional, add);
                }
            }

            return this.search += (this.search ? "&" : "?") + s.join("&").replace(r20, "+");
        },
        get: function (name, same) {
            var text = this.search ? this.search.slice(1) : "";
            if (arguments.length === 1 && typeof name === 'boolean') {
                same = name;
                name = undefined;
            }

            if (name === undefined) {
                var map = {};

                if (!text) {
                    return map;
                }

                var arr = text.split('&');

                arr.forEach(function (b) {
                    var k = b.split('='), n = k.shift();

                    map[n] = k.length > 1 ? decodeURIComponent(k.join('=')) : text2valueConvert(decodeURIComponent(k.pop()), same);
                });

                return map;
            }

            if (text) {
                return null;
            }

            var rname = uriCache(name);
            var match = rname.exec(this.search);

            if (!match) {
                return null;
            }

            return text2valueConvert(decodeURIComponent(match[2]), same);
        },
        toJSON: function () {
            return this.toString();
        },
        toString: function () {
            return this.origin + this.path + this.search + this.hash;
        }
    };


    var
        defaultConverter = {
            read: function (value) {
                return value.replace(/%3B/g, ';')
                    .replace(/%3D/g, '=');
            },
            write: function (value) {
                return value.replace(/;/g, '%3B')
                    .replace(/=/g, '%3D');
            }
        },
        cookieCache = makeCache(function (name) {
            return new RegExp('(^|;\\s+)' + name + '=(.*?)(;|$)');
        });

    v2.cookie = function (_defaultConverter, _defaultAttributes) {
        _defaultConverter = _defaultConverter || defaultConverter;
        _defaultAttributes = _defaultAttributes || {};
        function set(key, value, attributes) {
            attributes = v2.extend({}, _defaultAttributes, attributes);

            if (typeof attributes.expires === 'number') {
                attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
            }
            if (attributes.expires) {
                attributes.expires = attributes.expires.toUTCString();
            }
            if (v2.isPlainObject(value) || v2.isArray(value)) {
                value = JSON.stringify(value);
            }

            if ('write' in _defaultConverter) {
                key = _defaultConverter.write(key);

                value = _defaultConverter.write(String(value), key);
            } else {

                key = defaultConverter.write(key);

                value = defaultConverter.write(String(value), key);
            }

            var stringifiedAttributes = '';
            for (var attributeName in attributes) {
                if (!attributes[attributeName]) {
                    continue;
                }

                stringifiedAttributes += '; ' + attributeName;

                if (attributes[attributeName] === true) {
                    continue;
                }

                stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
            }

            return (document.cookie = key + '=' + value + stringifiedAttributes);
        }

        function get(key, same) {
            if (arguments.length === 1 && typeof key === 'boolean') {
                same = key;
                key = undefined;
            }

            if (key === undefined) {
                var jar = {};
                var cookies = document.cookie ? document.cookie.split('; ') : [];

                for (var i = 0; i < cookies.length; i++) {
                    var parts = cookies[i].split('=');
                    if ('read' in _defaultConverter) {
                        key = _defaultConverter.read(parts.shift());
                    } else {
                        key = defaultConverter.read(parts.shift());
                    }

                    if ('read' in _defaultConverter) {
                        jar[key] = parts.length > 1 ? _defaultConverter.read(parts.join('='), key) : text2valueConvert(_defaultConverter.read(parts.pop(), key), same);
                    } else {
                        jar[key] = parts.length > 1 ? defaultConverter.read(parts.join('='), key) : text2valueConvert(defaultConverter.read(parts.pop(), key), same);
                    }
                }

                return jar;
            }

            var rcookie = cookieCache(key);

            if (rcookie.test(document.cookie)) {
                if ('read' in _defaultConverter) {
                    return text2valueConvert(_defaultConverter.read(RegExp.$2, key), same);
                } else {
                    return text2valueConvert(defaultConverter.read(RegExp.$2, key), same);
                }
            }
        }

        return {
            set: set,
            get: get,
            remove: function (key, attributes) {
                set(
                    key,
                    '',
                    v2.extend({}, attributes, { expires: -1 })
                );
            },
            withConverter: function (converter) {
                return v2.cookie(v2.extend({}, _defaultConverter, converter), _defaultAttributes)
            },
            withAttributes: function (attributes) {
                return v2.cookie(_defaultConverter, v2.extend({}, _defaultAttributes, attributes))
            }
        };
    };

    v2.extend(v2.cookie, v2.cookie(defaultConverter, { path: '/' }));

    if (typeof sessionStorage === 'undefined') {
        v2.storage = {
            get: function (name, same) {
                return v2.cookie.get(name, same);
            },
            set: function (key, value) {
                v2.cookie.set(key, value);
            },
            remove: function (key) {
                v2.cookie.remove(key);
            }
        };
    } else {
        v2.storage = {
            get: function (key, same) {
                return text2valueConvert(sessionStorage.getItem(key), same);
            },
            set: function (key, value) {
                if (v2.isPlainObject(value) || v2.isArray(value)) {
                    sessionStorage.setItem(key, JSON.stringify(value));
                } else {
                    sessionStorage.setItem(key, value.toString());
                }
            },
            remove: function (key) {
                sessionStorage.removeItem(key);
            }
        };
    }

    var defineSurport,
        defineFix = function (attributes) {
            var _value = attributes.value,
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

            if (value === null || value === undefined) {
                switch (conversionType) {
                    case 'array':
                        return [];
                    case 'string':
                        return '';
                    case 'number':
                        return 0;
                    case 'function':
                        return returnFalse;
                    case 'date':
                        return new Date(0);
                    case 'boolean':
                        return false;
                    default:
                        return value;
                }
            }

            var type = valueType || v2.type(value);
            if (type === conversionType) {
                return value;
            }

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
                    if (type === 'array') {
                        return value;
                    }
                    break;
                case 'string':
                    return value === null || value === undefined ? '' : type === 'date' ? v2.date.format(value, 'yyyy-MM-dd HH:mm:ss') : value.toString();
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
        makeDescriptor = function (source, callback, conversionType, allowFirstSet, defaultGetter, defaultSetter) {

            var threadGet = false, threadSet = false, threadValue = source, threadCount = 0;

            conversionType = conversionType || v2.type(source);

            if (callback.length === 0) {
                return {
                    configurable: true,
                    get: function () {
                        if (threadGet) {
                            return source;
                        }
                        threadGet = true;
                        try {
                            return source = changeType(callback.call(this), conversionType);
                        } finally {
                            threadGet = false;
                        }
                    }
                };
            }

            var attributes = {
                configurable: true,
                get: defaultGetter || function () {
                    return threadSet ? threadValue : source;
                }
            };

            if (callback.length > 2) {

                v2.log("无法分析参数长度为“" + callback.length + "”的函数！", 15);

                return attributes;
            }

            attributes.set = function (value) {

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

                if (threadSet && value === threadValue) return;

                var result;

                threadValue = value;

                if (threadSet) {

                    if (threadCount > 15) {
                        v2.log("疑似属性内出现死循环调用!", 7);
                    }

                    return;
                }

                threadSet = true;
                threadCount = 0;
                try {
                    result = callback.call(this, value, value === source ? undefined : source);
                } finally {
                    threadSet = false;
                }

                if (result === undefined) {
                    source = value;
                } else {
                    source = changeType(value, conversionType);
                }

                if (defaultSetter) {
                    defaultSetter.call(this, value);
                }
            };

            return attributes;
        };

    v2.define = function (obj, prop, attributes) {

        if (obj === null || obj === undefined) {
            return obj;
        }
        if (attributes === true) {
            return obj;
        }

        if (arguments.length === 2 && v2.isPlainObject(prop)) {
            v2.each(prop, done);
        } else {
            done(attributes, prop);
        }

        function done(attributes, prop) {

            var setter, source = prop in obj ? obj[prop] : null;

            if (attributes === false) {
                attributes = {
                    get: function () {
                        return source;
                    }
                };
            }

            if (!attributes) return false;

            if (v2.isFunction(attributes)) {
                attributes = makeDescriptor(source, attributes);
            }

            try {
                Object.defineProperty(obj, prop, attributes);
                defineSurport = true;
            } catch (e) {
                if ((defineSurport || defineSurport === undefined) && ('value' in attributes || 'writable' in attributes || 'configurable' in attributes || 'enumerable' in attributes)) {
                    try {

                        Object.defineProperty(obj, prop, defineFix(attributes));

                        return obj;
                    } catch (_) {
                        defineSurport = false;
                    }
                }

                if (defineSurport) {
                    throw e;
                }

                if ('value' in attributes) {
                    obj[prop] = attributes.value;
                }

                if ('get' in attributes) {
                    obj[prop + "Getter"] = attributes.get;
                }

                if ('set' in attributes) {
                    setter = attributes.set;
                    obj[prop + "Setter"] = function (value) {

                        var result = setter.call(this, value);

                        obj[prop] = result === undefined ? value : result;

                        return result;
                    };
                }
            }
        }

        return obj;
    };

    var rnative = /^[^{]+\{\s*\[native code/;
    var docElem = document.documentElement;

    function destroyObject(object, deep, excludes) {

        var i, isControl, isArray, hasExcludes;

        if (!object) return null;

        isControl = object.version === version;
        hasExcludes = !(excludes === null || excludes === undefined);
        isArray = hasExcludes && v2.isArray(excludes);

        if (object instanceof V2Controls) {
            for (var i = 0; i < object.length; i++) {
                done(i, object[i]);
            }

            object.length = 0;

            return object = null;
        }

        if (isControl) {
            object.destroy = returnFalse;
        }

        for (i in object) {

            if (!hasExcludes || !(isArray ? core_indexOf.call(excludes, key) > -1 : excludes[i])) {
                if (done(i, object[i]) === false) {
                    continue;
                }
            }

            try {
                delete object[i];
            } catch (_) { /** do something. */ }
        }

        return object = null;

        function done(key, value) {
            if (!value || !deep || value === object || hasExcludes && (isArray ? core_indexOf.call(excludes, key) > -1 : excludes[key]))
                return;

            if (value.version === version) {

                if (isControl && value.controls && object.host === value) {
                    return value.controls.remove(object);
                }

                return value.destroy && value.destroy(true);
            }

            if (value.nodeType) {
                if (isControl && value.nodeType === 1 && object.$ === value) {
                    return value.remove();
                }
            } else if (v2.isPlainObject(value) || isArraylike(value)) {
                return destroyObject(value, true, excludes);
            } else if (isControl && v2.isFunction(value)) {
                object[key] = returnFalse;

                return false;
            }
        }
    }

    v2.extend({
        destroy: destroyObject,
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
        contains: rnative.test(docElem.compareDocumentPosition) || rnative.test(docElem.contains) ?
            function (a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a,
                    bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && (
                    adown.contains ?
                        adown.contains(bup) :
                        a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
                ));
            } : function (a, b) {

                while (b && (b = b.parentNode)) {
                    if (b === a) {
                        return true;
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
            token,
            tokens = node.className.match(rnotwhite);

        if (tokens) {

            tokens = tokens.sort();

            while ((token = tokens[i++])) {
                while (token === tokens[i]) {
                    core_splice.call(tokens, i, 1);
                }
            }

            v2.merge(this, tokens);

            node.className = tokens.join(" ");
        }

        v2.define(this, "value", {
            get: function () {
                return node.className;
            },
            set: function (value) {

                var arr = value
                    .replace(rclass, " ")
                    .match(rnotwhite);

                if (this.length > 0) {
                    if (isIE8) {
                        for (var i = 0; i < this.length; i++) {
                            delete this[i];
                        }
                    }
                    core_splice.call(this, 0, this.length);
                }

                if (arr && arr.length > 0) {

                    v2.merge(this, arr);

                    value = arr.join(" ");
                }

                node.className = value;
            }
        });
    }

    DOMClassList.prototype = {
        length: 0,
        add: function () {
            var i = 0,
                token,
                contains,
                value = v2.usb(this, "value");

            while ((token = arguments[i++])) {

                token = token.toString();

                if (token.indexOf(" ") > -1)
                    return v2.error("Uncaught DOMException: Failed to execute 'add' on 'DOMTokenList': The token provided ('" + clazz + "') contains HTML space characters, which are not valid in tokens.");

                if (classCache(token).test(value)) continue;

                contains = true;

                value += " " + token;
            }

            if (contains) {
                v2.usb(this, "value", value);
            }
        },
        remove: function () {
            var i = 0,
                token,
                pattern,
                contains,
                value = v2.usb(this, "value");

            while ((token = arguments[i++])) {

                token = token.toString();

                if (token.indexOf(" ") > -1)
                    return v2.error("Uncaught DOMException: Failed to execute 'add' on 'DOMTokenList': The token provided ('" + clazz + "') contains HTML space characters, which are not valid in tokens.");

                pattern = classCache(token);

                if (!pattern.test(value)) continue;

                contains = true;

                value = value.replace(pattern, " ");
            }

            if (contains) {
                v2.usb(this, "value", value);
            }
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


            var value = v2.usb(this, "value"),
                pattern = classCache(token);

            if (arguments.length === 1) {
                if (pattern.test(value)) {
                    v2.usb(this, "value", value.replace(pattern, " "));
                    return false;
                }

                v2.usb(this, "value", value + " " + token);
                return true;
            }

            v2.usb(this, "value", toggle ? value + " " + token : value.replace(pattern, " "));

            return !!toggle;
        }
    };

    var
        userAgent = window.navigator.userAgent.toLowerCase(),
        isIE = /msie|trident/.test(userAgent),
        isIE8 = /msie\s+8/.test(userAgent),
        isOpera = window.opera && window.opera.toString() === '[object Opera]';

    var tokenList = window.DOMTokenList;

    if ((isIE || isOpera) && !!tokenList) {
        var toggle = tokenList.prototype.toggle;

        if (isIE) {
            var add = tokenList.prototype.add,
                remove = tokenList.prototype.remove;

            tokenList.prototype.add = function () {
                v2.each(arguments, function (arg) {
                    return add.call(this, arg);
                }, this);
            };

            tokenList.prototype.remove = function () {
                v2.each(arguments, function (arg) {
                    return remove.call(this, arg);
                }, this);
            };
        }

        tokenList.prototype.toggle = function (token, _toggle) {
            if (arguments.length > 1) {
                if (_toggle) {
                    this.add(token);
                } else {
                    this.remove(token);
                }
                return !!_toggle;
            }
            return toggle.call(this, token);
        };
    }

    function IE8Callback(callback) {
        if (isIE) {
            return function (value) {
                try {
                    return callback.call(this, value);
                } catch (e) {
                    v2.log(e.message, isIE8 ? 7 : 15);
                }
            };
        }

        return callback;
    }

    function IECall(elem, name, value) {
        if (isIE) {
            try {
                elem[name] = value;
            } catch (e) {
                v2.log("元素【{0}】的属性【{1}】赋值【{2}】，{3}".format(elem.nodeName.toLowerCase(), name, value, e.message), isIE8 ? 7 : 15);
            }
        } else {
            elem[name] = value;
        }
    }

    function DOMNodeRemoved(node) {
        var component;

        if (node.nodeType > 1 || GLOBAL_VARIABLE_KNOWN_NODE_REMOVED) return;

        if (v2.match(node, '[ref]')) {
            if (component = node['component']) {
                component.$ = undefined;
                component.destroy();
            }
        }

        v2.each(v2.take('[ref]', node, true), function (node) {
            if (component = node['component']) {
                component.$ = undefined;
                component.destroy();
            }
        });
    }

    v2.improve(Element.prototype, {
        remove: function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }
    });

    var tokenCache = {},
        GLOBAL_VARIABLE_CLASS_TOKEN = 0;

    v2.each({
        classList: function () {
            var token = this['class-token'] || (this['class-token'] = ++GLOBAL_VARIABLE_CLASS_TOKEN);

            return tokenCache[token] || (tokenCache[token] = new DOMClassList(this));
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
        if (name in Element.prototype) return;

        Object.defineProperty(Element.prototype, name, {
            get: polyfill
        });
    });

    var matches = docElem.matchesSelector ||
        docElem.mozMatchesSelector ||
        docElem.webkitMatchesSelector ||
        docElem.oMatchesSelector ||
        docElem.msMatchesSelector ||
        docElem.matches || function (selectors) {
            var element = this,
                results = v2.take(selectors, this.document || this.ownerDocument, true);

            return v2.any(results, function (elem) { return elem === element; });
        };

    v2.take = function (selector, context, all) {

        if (arguments.length === 2 && typeof context === 'boolean') {
            all = context;
            context = undefined;
        }

        context = context || document;

        return all ? context.querySelectorAll(selector) : context.querySelector(selector);
    };

    v2.match = function (elem, selector) {
        return !selector || elem && matches.call(elem, selector);
    };

    v2.subscribe = document.addEventListener
        ? function (context, type, handle) {
            context.addEventListener(type, handle, false);
        }
        : function (context, type, handle) {
            context.attachEvent('on' + type, handle);
        };

    v2.unsubscribe = document.addEventListener
        ? function (context, type, handle) {
            context.removeEventListener(type, handle, false);
        }
        : function (context, type, handle) {
            context.detachEvent('on' + type, handle);
        };

    /** 兼容IE8 */
    v2.usb = isIE8 ? function (obj, prop, value) {
        var result, callback;
        if (!obj) return obj;

        if (arguments.length === 2) {
            if ((callback = obj[prop + "Getter"])) {
                return callback.call(obj);
            }
            return obj[prop];
        }

        if ((callback = obj[prop + "Setter"])) {
            result = callback.call(obj, value);
            return result === undefined ? value : result;
        }

        return obj[prop] = value;

    } : function (obj, prop, value) {

        if (!obj) return obj;

        if (arguments.length === 2) {
            return obj[prop];
        }

        return obj[prop] = value;
    };

    var rtypenamespace = /^(?:(.+)\.)?([^.]*)$/;

    var
        GLOBAL_VARIABLE_GUID = 0,
        GLOBAL_VARIABLE_EVENT = 0,
        nodeCache = {};

    v2.improve(Element.prototype, {
        match: function (expr) {
            return v2.match(this, expr);
        },
        take: function (selector, all) {
            return v2.take(selector, this, all);
        },
        on: function (type, selector, hanlde) {
            var guid, match, namespaces, map, cache, self, typeHandle, typeCache;
            if (arguments.length < 3) {
                hanlde = selector;
                selector = undefined;
            }

            if (!selector && type.indexOf('.') === -1) {
                return v2.subscribe(this, type, hanlde);
            }

            guid = this[timestamp] || (this[timestamp] = ++GLOBAL_VARIABLE_GUID);

            cache = nodeCache[guid] || (nodeCache[guid] = {});

            self = this;

            match = rtypenamespace.exec(type);

            type = match[2];

            namespaces = match[1] || "";

            if (namespaces) {
                namespaces = namespaces.split(".").sort();
            }

            map = namespaces ?
                makeMap(namespaces.join(" "), true) :
                returnFalse;

            typeHandle = function (e) {
                var value, node = e.target || (e.target = e.srcElement);
                if (!selector && map("self") && self !== node) {
                    if (e.preventDefault) { e.preventDefault(); }
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    else {
                        e.cancelBubble = true;
                    }

                    return false;
                }

                if (!selector) {
                    return done(this);
                }

                if (node.nodeType && (!e.button || e.type !== "click")) {
                    if (map("self")) {
                        if (node.match(selector)) {
                            return done(node);
                        }
                    } else {
                        for (; node !== self; node = node.parentNode) {
                            if (node.match(selector)) {
                                return done(node);
                            }
                        }
                    }
                }

                function done(elem) {
                    value = hanlde.call(elem, e);

                    if (map('abort')) {
                        if (e.preventDefault && (!selector || e.target === node)) {
                            e.preventDefault();
                        }
                        if (e.stopPropagation) {
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                        }
                        else {
                            e.cancelBubble = true;
                        }

                        return false;
                    }

                    if (map("prev") && (!selector || e.target === node)) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        }
                        else {
                            value = false;
                        }
                    }

                    if (map("stop")) {

                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }
                        else {
                            e.cancelBubble = true;
                        }
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

            return v2.subscribe(this, type, typeHandle);
        },
        off: function (type, selector, hanlde) {
            var guid, namespaces, cache, match, typeCache;
            if (arguments.length < 3) {
                hanlde = selector;
                selector = undefined;
            }

            if (!selector && type.indexOf('.') === -1) {
                return v2.unsubscribe(this, type, hanlde);
            }

            if (!hanlde.guid) return;

            guid = this[timestamp];

            if (!guid) return;

            cache = nodeCache[guid];

            if (!cache) return;

            match = rtypenamespace.exec(type);

            typeCache = cache[type = match[2]];

            if (!typeCache) return;

            namespaces = match[1] || "";

            if (namespaces) {
                namespaces = namespaces.split(".").sort().join(".");
            }

            var i = 0,
                obj;

            while ((obj = typeCache[i++])) {
                if (obj.guid === hanlde.guid && obj.namespace === namespaces && obj.selector === selector) {
                    v2.unsubscribe(this, type, obj.hanlde);
                }
            }
        }
    });

    var getStyles, curCSS;
    var rmargin = /^margin/i,
        rposition = /^(top|right|bottom|left)$/,
        rnumnonpx = /^([+-]?(\d+\.)?\d+)(?!px)[a-z%]+$/i;

    if (docElem.currentStyle) {
        getStyles = function (elem) {
            return elem.currentStyle;
        };

        curCSS = function (elem, name) {
            var left, rs, rsLeft,
                computed = getStyles(elem),
                r = computed ? computed[name] : undefined,
                style = elem.style;

            if (r == null && style && style[name]) {
                r = style[name];
            }

            if (rnumnonpx.test(r) && !rposition.test(name)) {

                left = style.left;
                rs = elem.runtimeStyle;
                rsLeft = rs && rs.left;

                if (rsLeft) {
                    rs.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : r;
                r = style.pixelLeft + "px";

                style.left = left;
                if (rsLeft) {
                    rs.left = rsLeft;
                }
            }

            return r === "" ? "auto" : r;
        };
    }
    else {
        getStyles = function (elem) {

            var view = elem.ownerDocument.defaultView;

            if (!view || !view.opener) {
                view = window;
            }

            return view.getComputedStyle(elem);
        };

        curCSS = function (elem, name) {
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
        };
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

    v2.hooks = {
        height: {
            get: function (elem) {
                return Math.max(elem.clientHeight, elem.offsetHeight);
            }
        },
        width: {
            get: function (elem) {
                return Math.max(elem.clientHeight, elem.offsetWidth);
            }
        }
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
                    hooks,
                    origName = v2.camelCase(name);

                name = v2.cssProps[origName] || (v2.cssProps[origName] = vendorPropName(style, origName));

                hooks = v2.hooks[name] || v2.hooks[origName];

                if (!hooks || !('get' in hooks) || (value = hooks.get(elem, name)) === false) {

                    value = curCSS(elem, name);

                    if (value === "normal" && name in cssNormalTransform) {
                        value = cssNormalTransform[name];
                    }
                }

                if (same) return value;

                return parseFloat(value) || 0;
            }
        },
        styleCb: function (name, value) {
            var match,
                hooks,
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

                hooks = v2.hooks[name] || v2.hooks[origName];

                if (value === undefined) {
                    if (!hooks || !('get' in hooks) || (value = hooks.get(elem, name)) === false) {
                        return style[name];
                    }
                    return value;
                }

                var type = typeof value;

                if (type === "string") {
                    if ((match = rcssZoom.exec(value))) {
                        adjustCSS(this, name, match);
                    } else if ((match = rcssMulti.exec(value))) {

                        if (match[3]) match[2] /= 100;

                        value = new Function("source", "return source" + match[1] + match[2])(elem.css(name));
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

                if (!hooks || !('set' in hooks) || (value = hooks.set(elem, value, name)) === false) {
                    style[name] = value;
                }
            }
        },
        swap: function (options, callback) {
            var val, name,
                map = {};

            for (name in options) {
                map[name] = this.style[name];
                this.style[name] = options[name];
            }

            val = callback.apply(this, core_slice.call(arguments, 2));

            for (name in options) {
                this.style[name] = map[name];
            }

            return val;
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
        },
        insertAfter: function (newNode, refNode) {
            if (refNode) {
                return this.parentNode.insertBefore(newNode, refNode.previousSibling);
            }
            return this.parentNode.appendChild(newNode);
        },
        after: function () {
            if (arguments.length === 0)
                return;

            if (arguments.length === 1) {

                var node = arguments[0];

                if (node === null || node === undefined) {
                    return;
                }

                this.parentNode.insertBefore(node.nodeType ? node : document.createTextNode(node), this.nextSibling);

                return;
            }

            var docFrag = safeFragment.cloneNode();

            v2.each(arguments, function (node) {
                if (node === null || node === undefined) {
                    return;
                }

                docFrag.appendChild(node.nodeType ? node : document.createTextNode(node));
            });

            this.parentNode.insertBefore(docFrag, this.nextSibling);
        },
        replaceChild: function (newNode, oldNode) {
            if (oldNode) {
                var node = this.parentNode.insertBefore(newNode, oldNode);

                this.parentNode.removeChild(oldNode);

                return node;
            }
            return this.parentNode.appendChild(newNode);
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
        namespaceCache: namespaceCache
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
            type: source.type === "*" || superior.type === "*" ? "*" : superior.type + "|" + source.type,
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
                if (value === true) {
                    control[key](value);
                }
            }
        },
        "!": { //false
            type: "function",
            exec: function (control, value, key) {
                if (value === false) {
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
                if (!(value === null || value === undefined)) {
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

        if (safe.childNodes.length === 1) {
            safe = safe.firstChild;
        }

        tmp = null;

        return safe;
    };

    v2.improve(String.prototype, {
        trim: function () {
            return v2.trim(this);
        }
    });

    var
        rbatch = /\$+/g,
        rbatchZore = /\^+/g,
        whitespace = "[\\x20\\t\\r\\n\\f]",
        characterEncoding = "(?:\\\\.|[\\w-]|\\$|[^\\x00-\\xa0])+",
        identifier = characterEncoding.replace("w", "w#"),
        combinator = whitespace + "*([>+])" + whitespace + "*",
        attributes = "\\[" + whitespace + "*(" +
            characterEncoding + ")" + whitespace + "*(?:=" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|(" + identifier + ")|)|)" + whitespace + "*\\]",
        rchild = new RegExp("^" + whitespace + "*>"),
        rgroup = new RegExp("^" + whitespace + "*\\("),
        rcombinators = new RegExp("^" + combinator),
        rfixcombinators = new RegExp(combinator + '(' + combinator + ')+', 'gm'),
        rsingleTag = /area|br|col|embed|hr|img|input|link|meta|param/i,
        rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
        htmlSerializeExpr = {
            "ID": new RegExp("^#(" + characterEncoding + ")"),
            "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
            "TAG": new RegExp("^(" + characterEncoding + ")"),
            "ATTR": new RegExp("^" + attributes),
            "MULTI": new RegExp("^" + whitespace + "*\\*([1-9][0-9]*)"),
            "TEXT": new RegExp("^\\{([\\s\\S]*?)\\}" + whitespace + "*(?=[+>]|\\*|$)")
        },
        fhtmlSerializeCache = function (selector) {
            var i, arr, charAt, counter, token, type, match, matched, groups = [],
                string = selector,
                serialize = htmlSerialize.serialize;
            while (string) {
                if (!matched || (match = rcombinators.exec(string))) {
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
                if (relative === ">") {
                    html.push(xhtml);
                }
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
                        var value = multi - 1;
                        for (var i = value.length, len = v.length; i < len; i++) {
                            value = '0' + value;
                        }
                        return value;
                    }));

                } while (--multi);

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

    var rcompile = new RegExp('`\\$\\{(.+?)\\}`|\\$\\{' + whitespace + '*(.+?)' + whitespace + '*\\}|\\{' + whitespace + '*\\{' + whitespace + '*([^\\{].+?)' + whitespace + '*\\}' + whitespace + '*\\}', 'gm'); // /`\$\{(.*)?\}`/gm;
    var word = '[_a-z][_a-z0-9]*',
        rreturn = new RegExp("^(\\b|" + whitespace + "+)return" + whitespace + "+"),
        rquotes = new RegExp("\\$(['\"])(?:\\\\.|[^\\\\])*?\\1", 'gm'),
        rbraceCode = new RegExp('\\{([^\\{]+?)\\}', 'g'),
        rternaryCode = new RegExp('^((?:\\w+\\.)?\\w+(?:\\(.*?\\))?)' + whitespace + '*([?!]{1,2})' + whitespace + '*([^:]+?)$'),
        tryCode = word + '(?:\\??(?:\\.' + word + '|\\[.+?\\]))*',
        rtryCode = new RegExp(tryCode, 'img'),
        rtry = new RegExp('(' + word + '|\\])\\?(?=(\\.|\\[))', 'i'),
        rforin = new RegExp('\\bfor' + whitespace + '*\\(' + whitespace + '*(?:var' + whitespace + '+)?(' + word + ')(?:<(' + word + ')>)?' + whitespace + '+in' + whitespace + '+(' + tryCode + ')' + whitespace + '*\\)', 'ig'),
        rword = new RegExp('\\b' + word + '\\b', 'gi'),
        rkey = new RegExp('^' + word + '$', 'i'),
        rif = new RegExp('\\bif' + whitespace + '*\\(.+?\\)' + whitespace + '*\\{' + whitespace + '*(.+)\\}', 'g'),
        relse = new RegExp('\\belse' + whitespace + '*\\{' + whitespace + '*(.+)\\}', 'g'),
        rinject = new RegExp("^" + whitespace + "*(" + word + ")\\(((" + whitespace + "*" + word + whitespace + "*,)*" + whitespace + "*" + word + ")?" + whitespace + "*\\)" + whitespace + "*$", "i");

    var tryCodeFn = makeCache(function (string) {
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

    function forCodeFn(_, item, index, data, guid) {
        var fn = 'for_done_' + guid,
            results = ['return window.v2.map(', data, ',', fn, ');'];

        results.push('function ', fn, '(', item);
        if (index) {
            results.push(',', index);
        }
        results.push(')');

        return results.join('');
    }

    function ifElseCodeFn(all, code) {
        if (!rreturn.test(code)) {
            var indexOf = all.indexOf(code);

            return all.slice(0, indexOf - 1) + 'return ' + code + all.slice(indexOf + code.length);
        }
        return all;
    }

    function joinCodeFn(string, quote) {
        return string.slice(1).replace(rbraceCode, function (_, code) {
            return quote + '+ (' + code.replace(rternaryCode, ternaryCode) + ') +' + quote;
        });
    }
    function ternaryCode(_, left, symbol, right) {
        switch (symbol) {
            case '?':
                return left + ' ? ' + right + ' : ""';
            case '!!':
                return '(' + left + ' ||' + left + ' === 0 ) ? (' + right + ' || ' + right + ' === 0) ? ' + left + ' : ""';
            case '??':
                return left + ' == null ? ' + right + ' == null ? "" :' + right + ' : ' + left;
            case '?!':
                return '(' + left + ' == null || ' + right + ' || ' + right + ' === 0) ? "" : ' + left;
            case '!?':
                return '(' + left + ' || ' + left + ' === 0) && (' + right + ' == null) ? "" : ' + right;
            default:
                return left + ' ? "" :' + right;
        }
    }
    var compileCache = makeCache(function (value) {
        var callback, body = value
            .replace(rforin, forCodeFn)
            .replace(rif, ifElseCodeFn)
            .replace(relse, ifElseCodeFn)
            .replace(rquotes, joinCodeFn)
            .replace(rtryCode, tryCodeFn)
            .replace(rternaryCode, ternaryCode);

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
            .replace(rtryCode, tryCodeFn)
            .replace(rternaryCode, ternaryCode);

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
        return this.replace(rcompile, function (_, lamda, dollarSimple, braceSimple) {
            var callback = lamda
                ? compileCache(lamda)
                : simpleCache(dollarSimple || braceSimple);

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
                when = new Function("vm", "try{  with(vm){ with(option) { return " + when + "; } } }catch(_){ return false; }");
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
                if (use.filter(vm)) {
                    return use.option;
                }
            }
            return null;
        }
    };

    function dependencyInjection(context, key, inject, value) {
        if (!inject) return value;
        var callback, baseArgs, args = [],
            injections = inject.match(rword);
        if ((callback = context[key])) {
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
        return new ArrayThen();
    }, function (results, option) {
        results.insert(0, option);
    });

    var useConfig = function (option) {
        var type, match, fn = v2.fn;

        v2.each(option, function (value, name) {

            type = v2.type(value);

            if (!(name in fn)) {
                name = analyzeWildcards(baseCards, name, type, true);
            }

            if (name === 'flowGraph') {
                return v2.log('Attribute flowGraph can only be injected by fn[v2.useMap(tag,{flowGraph:{}})].', 15);
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

                return use(tag, option, when);
            }

            if (v2.isPlainObject(tag)) {
                return useConfig(tag);
            }
        },
        exists: use.exists,
        useMap: function (tag, flowGraph) {
            switch (typeof tag) {
                case 'string':
                    tag = v2.kebabCase(tag.toLowerCase());
                    return useMap.when(function (vm) {
                        return vm.tag === tag;
                    }, flowGraph);
                case 'function':
                    return useMap.when(tag, flowGraph);
                case 'regex':
                    return useMap.when(function (vm) {
                        return tag.test(vm.tag);
                    }, flowGraph);
                default:
                    return v2.error('Type is not supported(' + tag + ')!');
            }
        },
        useMvc: function (_, resolve) {
            return resolve();
        },
        useRoute: function (tag, when, route) {
            var router = routeCache(v2.kebabCase(tag));

            if (arguments.length === 2) {
                route = when;
                when = returnTrue;
            }

            return router.when(when, route);
        }
    });

    var stackCache = {};

    function StackCallback(callback, tag, readyWait, group) {
        this.callback = callback;
        this.tag = tag;
        this.readyWait = readyWait;
        this.group = group || 0;
    }

    function V2Stack(master) {
        this.ready(this.master = master);
    }
    V2Stack.prototype = {
        tag: "*",
        length: 0,
        identity: 0,
        readyWait: 0,
        ready: function (master) {
            stackCache[this.identity = master.identity] = this;
        },
        complete: function (tag) {
            var i = 0,
                j,
                group,
                stack,
                readyWait = this.readyWait -= 1;

            while (i < this.length && (stack = this[i++])) {

                if (stack.tag === '*' | stack.tag === tag || readyWait === 0) {

                    if (stack.callback(this.master) === false) {
                        group = stack.group;

                        if (group > 0) {

                            j = i;
                            while ((stack = this[j])) {
                                if (stack.group === group) {
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
            this.master.sleep(true);

            return this.pushStack(callback);
        },
        pushStack: function (callback, group) {
            if (this.readyWait === 0) {
                return callback(this.master);
            }

            this[this.length] = new StackCallback(callback, this.tag, this.readyWait, group);
            this.length += 1;
            return this;
        }
    };

    function V2Controls(host) {
        this.add = function (control) {
            if (control.host === host) {
                if (core_indexOf.call(this, control) > -1) {
                    return control;
                }
            } else if (control.host) {
                control.host
                    .controls
                    .remove(control);
            }

            control.host = host;

            this[this.length] = control;
            this.length += 1;

            return control;
        };
    }

    V2Controls.prototype = v2.extend({
        length: 0,
        destroy: function () {

            var i = 0,
                control;

            while ((control = this[i++])) {
                control.destroy();
            }
        },
        offset: function (control, offset) {

            var index = core_indexOf.call(this, control);

            if (index === -1) return null;

            return this[index + offset] || null;
        }
    }, ArrayThen.prototype);

    function applyCallback(callback, args, context, sliced) {
        if (!args || args.length === 0) return callback.call(context);
        if (args.length === 1) return callback.call(context, args[0]);
        if (args.length === 2) return callback.call(context, args[0], args[1]);
        if (args.length === 3) return callback.call(context, args[0], args[1], args[2]);
        return callback.apply(context, sliced ? args : core_slice.call(args, 0));
    }

    v2.GDir = makeCache(function (tag) {
        var fn = new Function("return function " + v2.pascalCase(tag) + "Collection(){}")();

        fn.prototype = ArrayThen.prototype;

        return v2.GDir[tag + "s"] = new fn();
    }, true);

    function MapThen() {
        var options, accessOptions;

        this.add = function (option, accessOption) {
            options = mergeOption(options, option);
            accessOptions = mergeOption(accessOption, accessOptions || options);
        };

        this.always = function (option) {
            return option.access ? accessOptions : options;
        };
    }

    MapThen.prototype = UseThen.prototype;

    var useMap = new MapThen('*');

    useMap.add({
        design: 0.5, // 设计
        init: 1, // 初始化
        build: 2, // 构建
        render: 4, // 渲染
        usb: 8, // 监听
        ready: 16, // 就绪
        load: 32, // 加载数据
        commit: 64 // 完成提交
    }, {
        design: 0.5, // 设计
        init: 1, // 初始化
        build: 2, // 构建
        render: 4, // 渲染
        usb: 8, // 监听
        ready: 16, // 就绪
        ajax: -1, // 异步取数
        load: 32, // 加载数据
        commit: 64 // 完成提交
    });

    var routeCache = makeCache(function (tag) {
        return new UseThen(tag);
    });

    v2.fn = v2.prototype = {
        version: version,
        create: function (tag, options) {
            var pNode, control, component, isFunction;

            if (v2.isPlainObject(tag)) {
                options = tag;
                tag = options.tag;
            }

            tag = v2.kebabCase(tag);

            options = v2.extend(true, {}, options);

            pNode = options.$$ = options.$$ || this.$;

            options.host = this;

            if (!this.components || !(component = this.components[tag] || this.components[v2.camelCase(tag)])) {
                return this.controls.add(v2(tag, options));
            }

            isFunction = v2.isFunction(component);

            if (isFunction && v2.exists(tag)) {
                return this.controls.add(v2(tag, options));
            }

            GLOBAL_VARIABLE_STARTUP_COMPLETE = false;

            control = isFunction ? v2(tag, options) : v2(tag, v2.improve(options, component));

            GLOBAL_VARIABLE_STARTUP_COMPLETE = true;

            this.controls.add(control);

            if (isFunction) {
                var stack, complete = false, lazy = true;

                component(function () {
                    lazy = false;

                    if (complete) {
                        stack.complete(tag);
                    }
                });

                if ((complete = lazy)) {
                    stack = stackCache[this.identity] || new V2Stack(this);

                    var node = document.createElement('div');

                    pNode.appendChild(node);

                    stack.waitSatck(tag, function () {

                        control.startup();

                        GLOBAL_VARIABLE_KNOWN_NODE_REMOVED = true;

                        if (control.dynamicElement && pNode === control.$$) {
                            pNode.replaceChild(control.$, node);
                        } else {
                            pNode.removeChild(node);
                        }
                        GLOBAL_VARIABLE_KNOWN_NODE_REMOVED = false;
                    });

                    return control;
                }
            }

            this.lazy(function () {
                control.startup();
            });

            return control;
        },
        width: null,
        height: null,
        limit: false,
        access: false,
        skipOn: false,
        visible: true,
        defaultVisible: true,
        init: function (tag, option) {
            this.tag = v2.kebabCase(tag);
            this.option = option || {};

            this.host = null;

            this.name = "";

            this['class'] = "";

            this.$ = this.$$ = null;

            this.deployment = this.request = this.response = null;

            this.view = this.watch = this.data = null;

            var identity = ++GLOBAL_VARIABLE_IDENTITY;
            v2.define(this, "identity", {
                value: identity,
                get: function () {
                    return identity;
                }
            });

            this.like = returnFalse;

            if (GLOBAL_VARIABLE_STARTUP_COMPLETE) {
                this.startup();
            }
        },
        startup: function () {

            this.events = {};
            this.methods = {};
            this.components = {};

            this.wildcards = v2.extend(true, {}, baseCards);

            var route = routeCache(this.tag);

            var router = route.then(this);

            if (router) {
                switch (v2.type(router)) {
                    case 'string':
                        this.tag = router;
                        break;
                    case 'function':
                        GLOBAL_VARIABLE_ON_ROUTES = true;
                        try {
                            router.call(this);
                        } finally {
                            GLOBAL_VARIABLE_ON_ROUTES = false;
                        }
                        break;
                    default:
                        return v2.error('路由数据类型【' + type + '】不被支持!');
                }

                this.tag = v2.kebabCase(this.tag);
            }

            var flowGraph = useMap.then(this);

            if ('flowGraph' in this.option) {
                this.flowGraph = this.option.flowGraph;

                if (flowGraph) {
                    for (var i in flowGraph) {
                        if (i in this.flowGraph) {
                            continue;
                        }

                        return v2.syntaxError("自定义流程项必须覆盖控件定义流程项!");
                    }
                }
            } else {
                this.flowGraph = v2.extend({}, flowGraph || useMap.always(this.option));
            }

            this.compile();

            this.flow();

            this.$.setAttribute("component", this.identity);

            this.$.setAttribute('ref', this.tag);

            if (this.skipOn) return;

            v2.each(this.events, function (handle, type) {
                var context = this;

                this.$.on(type, function (e) {
                    return handle.call(context, e);
                });
            }, this);
        },
        compile: function () {
            var fn,
                timer,
                controls,
                root_base,
                sleep = false,
                isReady = false,
                classOld = "",
                core_tag = "*",
                core_namespace = "*",
                baseMap = {},
                flowMap = {},
                variable = {},
                descriptors = {},
                namespaceGraph = {},
                callbacks = [],
                todoStack = [],
                watchStack = [],
                context = this,
                internalCall = true,
                excludes = {
                    identity: true
                },
                wildcards = this.wildcards,
                makeInternalCall = function (callback, visible) {
                    return function () {
                        if (internalCall) {
                            return applyCallback(callback, arguments, this);
                        }
                        internalCall = false;
                        try {
                            return applyCallback(callback, arguments, this);
                        } finally {
                            v2.usb(this, "visible", visible);
                            internalCall = true;
                        }
                    };
                },
                invokeCallback = function (callback, value, args) {
                    return value <= 1 || args.length > 0 ?
                        applyCallback(callback, args, context) :
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
                                                callback.call(context, context.variable);
                },
                makeCallback = function (callback, key, namespace) {
                    var value = +context.flowGraph[key] || 0;

                    return function () {
                        var current_base = context.base,
                            control = GLOBAL_VARIABLE_CURRENT_CONTROL;

                        context.base = baseMap[namespace];
                        GLOBAL_VARIABLE_CURRENT_CONTROL = context;

                        try {
                            return invokeCallback(callback, value, arguments);
                        } finally {
                            context.base = current_base;
                            if (control !== context) {
                                setTimeout(function () {
                                    GLOBAL_VARIABLE_CURRENT_CONTROL = control;
                                });
                            }
                        }
                    };
                },
                extendsCallback = function (base, key, value, namespace, define) {
                    var
                        map = baseMap[namespace],
                        name = namespace === '*' ? "" : namespace.slice(0, -core_tag.length - 1);

                    if (!map) {
                        map = baseMap[namespace] = define ? v2.extend({}, base) : base;
                    }

                    base[key] = map[key] = makeCallback(value, key, name);
                },
                initControls = function (option, define, highest) {

                    var skip_tags = [];

                    if (option && option.tag) {
                        skip_tags.push(option.tag);
                        skip_tags.push(v2.camelCase(option.tag));
                    }

                    if (highest && highest.tag) {
                        skip_tags.push(highest.tag);
                        skip_tags.push(v2.camelCase(highest.tag));
                    }

                    v2.each(option, function (value, key) {
                        var match,
                            type,
                            sourceValue,
                            conversionType;

                        if (key === 'tag' || key === 'constructor' || value === undefined || skip_tags.indexOf(key) > -1) return;

                        if (key === 'flowGraph') {
                            if (define) {
                                return v2.log('Attribute flowGraph can only be injected by fn[v2.use({flowGraph:{}})].', 15);
                            }
                            return;
                        }

                        if (key === 'variable') {
                            return v2.extend(variable, value);
                        }

                        if (!(key in context)) {
                            key = analyzeWildcards(wildcards, key, type, define);
                        }

                        type = v2.type(value);

                        if (type === 'function' && (match = rinject.exec(key))) {
                            value = dependencyInjection(context, key = match[1], match[2], value);
                        }

                        if (key in context) {
                            sourceValue = context[key];
                        } else {
                            if (type === 'function') {

                                if (key === 'show' || key === 'hide') {
                                    value = makeInternalCall(value, key === 'show');
                                }

                                namespaceGraph[key] = core_namespace;

                                context[key] = value;

                            } else if (define) {
                                variable[key] = value;
                            } else {
                                context[key] = variable[key] = value;
                            }

                            return;
                        }

                        conversionType = v2.type(sourceValue);

                        if (type === 'function') {

                            if (conversionType === "function") {

                                if (key === 'show' || key === 'hide') {
                                    value = makeInternalCall(value, key === 'show');
                                }

                                context[key] = value;

                                namespaceGraph[key] = core_namespace;

                                if (highest && highest[key] === sourceValue) {
                                    return;
                                }

                                extendsCallback(root_base || (root_base = {}), key, sourceValue, core_namespace, define);

                                return;
                            }

                            excludes[key] = true;

                            descriptors[key] = {
                                value: sourceValue,
                                callback: value,
                                conversionType: conversionType,
                                allowFirstSet: true
                            };

                            return;
                        }

                        if (key in context.flowGraph) {
                            return v2.error("The enumerated state property value must be a function!");
                        }

                        if (key in wildcards) {
                            variable[key] = value;
                        } else if (sourceValue === null || sourceValue === undefined) {
                            context[key] = value;
                        } else if (sourceValue !== value) {
                            value = changeType(value, conversionType, type);

                            if (type === "object" || type === "array") {
                                return context[key] = v2.extend(!!define, sourceValue, value);
                            }

                            context[key] = value;
                        }
                    });

                    if (define && !highest) {

                        core_tag = v2.kebabCase(option.tag || context.tag);

                        core_namespace += "." + core_tag;
                    }
                };

            this.init = function (tag, tagName) {
                var node, parentNode, type, dynamicElement = false;

                if (arguments.length === 0) {
                    tag = "*";
                    tagName = "div";
                }

                v2.define(this, {
                    dynamicElement: function () {
                        return dynamicElement;
                    }
                });

                type = v2.type(tag);

                if (tagName === undefined) {
                    if (type !== "string")
                        return v2.error("The tag name provided ('" + tagName + "') is not a valid name.");

                    tagName = tag === '*' ? 'div' : tag;
                }

                if (!(parentNode = this.$$) ||
                    typeof parentNode === 'string' && !(parentNode = this.take(parentNode, this.host ? this.host.$ : document)) ||
                    !(parentNode instanceof Element) && isArraylike(parentNode) && !(parentNode = parentNode[0]) ||
                    !(parentNode.nodeType === 1)) {

                    parentNode = this.host ? this.host.$ : document.body;
                }

                if (!(node = this.deployment) ||
                    typeof node === 'string' && !(node = this.take(node, parentNode)) ||
                    !(node instanceof Element) && isArraylike(node) && !(node = node[0]) ||
                    node.version === version && (node = node.$core || node["$" + node.tag] || node.$) ||
                    !(node.nodeType === 1)
                ) {
                    this.deployment = null;
                } else {
                    this.deployment = node;
                }

                if (!(node = this.request) ||
                    typeof node === 'string' && !(node = this.take(node, parentNode)) ||
                    !(node instanceof Element) && isArraylike(node) && !(node = node[0]) ||
                    node.version === version && (node = node.$core || node["$" + node.tag] || node.$) ||
                    !(node.nodeType === 1)
                ) {
                    this.request = null;
                } else {
                    this.request = node;
                }

                if (!(node = this.response) ||
                    typeof node === 'string' && !(node = this.take(node, parentNode)) ||
                    !(node instanceof Element) && isArraylike(node) && !(node = node[0]) ||
                    node.version === version && (node = node.$core || node["$" + node.tag] || node.$) ||
                    !(node.nodeType === 1)
                ) {
                    this.response = null;
                } else {
                    this.response = node;
                }

                if (!(node = this.$) ||
                    typeof node === 'string' && !(node = this.take(node, parentNode)) ||
                    !(node instanceof Element) && isArraylike(node) && !(node = node[0]) ||
                    !(node.nodeType === 1)) {

                    dynamicElement = !node;

                    return this.$$ = parentNode, this.$ = node ? this.$$.replaceChild(document.createElement(tagName), node) : this.$$.appendChild(document.createElement(tagName));
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
                        return v2.error("Validation of type “" + type + "” is not supported.");
                }

                if (node.nodeName.toLowerCase() === 'div') {
                    var elem = document.createElement(tagName);

                    elem.cssText = node.cssText;
                    elem.className = node.className;

                    parentNode.replaceChild(elem, node);

                    return this.$$ = parentNode, this.$ = elem;
                }

                v2.error("Components do not support elements whose NodeName is " + node.nodeName.toLowerCase() + ".");
            };

            function done(option) {
                var tag, type;

                if (!option) {
                    return option;
                }

                type = v2.type(option);

                if (type === "function") {

                    var config = option.call(context);

                    if (config === undefined) {
                        return option.prototype;
                    }

                    return v2.improve(config, option.prototype);
                }

                tag = option.tag;

                if (tag && (fn = option[tag] || option[v2.camelCase(tag)]) && v2.isFunction(fn)) {
                    fn.call(context, option);
                }

                return option;
            }

            v2.use(this.tag)
                .map(function (then) {
                    var option = then.always();

                    return {
                        always: done(option),
                        option: done(then.then(context))
                    };
                })
                .done(function (use) {
                    var always = use.always,
                        option = use.option;

                    if (!always || !option) {
                        return initControls(always || option, true);
                    }
                    initControls(always, true);
                    initControls(option, true, always);
                });

            initControls(this.option, core_namespace === '*');

            var methods = {};

            function makeDI(obj, value, key) {

                var di, r = rcontext.exec(key);

                if (!r) {
                    return obj[key] = value;
                }

                di = r.pop();

                r = r.shift();

                obj[key.slice(0, -r.length)] = function () {
                    var args = analyzeExp(this, di);

                    if (arguments.length === 0) {
                        return value.apply(this, args);
                    }

                    return value.apply(this, args.concat(core_slice.call(arguments, 0)));
                };
            }

            v2.each(this.methods, function (value, key) {
                makeDI(methods, value, key);
            });

            this.methods = methods;

            var events = {};

            v2.each(this.events, function (value, key) {
                makeDI(events, value, key);
            });

            this.events = events;

            var namespaces = core_namespace.split('.');

            v2.each(namespaces, function (name) {
                if (rtag.test(name)) {
                    v2.GDir(name).add(context);
                }
            });

            this.like = function () {
                return v2.any(arguments, function (tag) {
                    if (v2.isFunction(tag)) {
                        return tag(context);
                    }
                    return namespaces.indexOf(v2.kebabCase(tag)) > -1;
                });
            };
            this.hostlike = function () {
                if (this.host) {
                    return applyCallback(this.host.like, arguments, this.host);
                }
                return false;
            };

            v2.each(descriptors, function (map, key) {
                v2.define(context, key, makeDescriptor(map.value, map.callback, map.conversionType, map.allowFirstSet, map.defaultGetter, map.defaultSetter));
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

                            this.flow();

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
                        this.lazy(extra);
                    }
                } else if (type === "number") {

                    sleep = true;

                    if (timer) clearTimeout(timer);

                    timer = setTimeout(function () {
                        timer = null;
                        context.lazy(function () {

                            this.flow();

                            while ((extra = callbacks.shift())) {
                                extra.call(this);
                            }
                        });
                    }, extra);
                }
                return sleep;
            };

            this.flow = function (state, falseStop) {
                var i, value, control, prevValue, ready = true;

                if (isReady) return;

                if (typeof state === "boolean") {
                    falseStop = state;
                    state = undefined;
                }

                falseStop = falseStop || falseStop === undefined;

                control = GLOBAL_VARIABLE_CURRENT_CONTROL;

                GLOBAL_VARIABLE_CURRENT_CONTROL = this;

                if (v2.isString(state)) {
                    state = this.flowGraph[state];
                }
                prevValue = state = +state || 0;

                this.readyState = +this.readyState || 0;

                for (i in this.flowGraph) {

                    value = +this.flowGraph[i] || 0;

                    if (flowMap[i]) continue;

                    flowMap[i] = true;

                    prevValue = value;

                    this.readyState = value;

                    if (value > 8) {

                        if (prevValue <= 8) {
                            computeWildcards(this, 'function');
                        }

                        while ((value = watchStack.shift())) {
                            value.call(this);
                        }

                        value = prevValue;
                    }

                    if (!this[i]) continue;

                    value = value <= 1 || value >= 64 ?
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
                                            this[i](this.variable);

                    if (falseStop && (value === false || this.sleep())) {
                        ready = false;
                        break;
                    }
                }
                if (defineSurport) {
                    isReady = ready;
                } else {
                    this.isReady = isReady = ready;
                }

                if (ready) {
                    this.define('visible', function (value) {
                        if (internalCall) {
                            if (value) {
                                this.show();
                            } else {
                                this.hide();
                            }
                        }
                    }, this.visible === this.defaultVisible);

                    while ((value = todoStack.shift())) {
                        value.call(this);
                    }

                    watchStack = todoStack = null;
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

                if (isReady || elem) {
                    ready(prop, descriptor, elem || this.$core || this['$' + this.tag] || this.$, defineOnly);
                } else {
                    watchStack.push(function () {
                        ready(prop, descriptor, this.$core || this['$' + this.tag] || this.$, defineOnly);
                    });
                }

                return this;

                function ready(prop, descriptor, elem, defineOnly) {
                    if (v2.isPlainObject(prop)) {

                        return v2.each(prop, done);
                    }

                    isFunction = v2.isFunction(descriptor);

                    return v2.each(prop.match(rnotwhite), function (name) {
                        done(descriptor, name);
                    });

                    function done(attributes, name) {
                        var contains = name in elem,
                            sourceValue = context[name],
                            conversionType,
                            typeOnly,
                            valueGetter,
                            valueSetter,
                            isFn = isFunction,
                            allowFirstSet = true;

                        if (name in excludes) {
                            return v2.log('Attributes cannot be repeatedly defined(' + name + ').', 15);
                        }

                        if (name in descriptors) {
                            v2.log('Attributes is overridden by control definitions(' + name + ').', 7);
                        }

                        excludes[name] = true;

                        if (contains && v2.type(elem[name]) === 'object') {
                            contains = false;
                        }

                        if (contains && (sourceValue === null || sourceValue === undefined)) {
                            typeOnly = true;
                            sourceValue = elem[name];
                        }

                        if (isFn === undefined) {
                            isFn = v2.isFunction(attributes);
                        }

                        conversionType = v2.type(sourceValue);

                        if (isFn) {
                            if (contains && attributes.length > 0) {
                                attributes = makeDescriptor(sourceValue, attributes, null, allowFirstSet, function () {
                                    return elem[name];
                                }, IE8Callback(function (value) {
                                    if (allowFirstSet) {
                                        if (value && !(value === Infinity || value === -Infinity) && (elem[name] != value)) {
                                            elem[name] = value;
                                        }
                                        allowFirstSet = false;
                                    } else if (elem[name] != value) {
                                        elem[name] = value;
                                    }
                                }));
                            } else {
                                attributes = makeDescriptor(sourceValue, attributes, null, allowFirstSet);
                            }
                        } else if (attributes && conversionType !== 'null' && conversionType !== 'undefined') {
                            if ('set' in attributes) {
                                valueSetter = attributes.set;

                                attributes.set = function (value) {
                                    return valueSetter.call(this, changeType(value, conversionType));
                                };
                            }

                            if ('get' in attributes) {
                                valueGetter = attributes.get;

                                attributes.get = function () {
                                    return changeType(valueGetter.call(this), conversionType);
                                };
                            } else if (contains) {
                                attributes.get = function () {
                                    return elem[name];
                                };
                            }
                        }

                        if (attributes === undefined || attributes === null) {

                            attributes = {
                                configurable: true,
                                get: contains ? conversionType === 'function' ? function () {
                                    var value = elem[name];

                                    return value && function () {
                                        return applyCallback(value, arguments, elem);
                                    };
                                } : function () {
                                    return elem[name];
                                } : conversionType === 'boolean' ? function () {
                                    return elem.getAttribute(name) === name;
                                } : function () {
                                    return elem.getAttribute(name);
                                },
                                set: contains ? IE8Callback(function (value) {
                                    if (allowFirstSet) {
                                        if (value === 0 || value && !(value === Infinity || value === -Infinity)) {
                                            elem[name] = value;
                                        }
                                        allowFirstSet = false;
                                    } else {
                                        elem[name] = value;
                                    }
                                }) : conversionType === 'boolean' ? function (value) {
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

                        if (typeOnly || sourceValue === undefined || sourceValue === null || sourceValue === Infinity || sourceValue === -Infinity || sourceValue !== sourceValue) {
                            return;
                        }

                        if (contains && isFn && (attributes === true || "set" in attributes || attributes.writable === true)) {
                            if (isReady) {
                                IECall(elem, name, sourceValue);
                            } else {
                                watchStack.push(function () {
                                    IECall(elem, name, sourceValue);
                                });
                            }
                        }

                        if (defineOnly) return;

                        if (attributes === true || "set" in attributes || attributes.writable === true) {
                            if (isReady) {
                                v2.usb(context, name, sourceValue);
                            } else {
                                watchStack.push(function () {
                                    v2.usb(context, name, sourceValue);
                                });
                            }
                        }
                    }
                }
            };

            this.destroy = function (deep) {
                v2.each(namespaces, function (name) {
                    if (rtag.test(name)) {
                        v2.GDir(name).remove(context);
                    }
                });

                destroyObject(baseMap);

                destroyObject(descriptors);

                destroyObject(this.base);

                destroyObject(variable, true);

                destroyObject(controls, true);

                destroyObject(this, deep || arguments.length === 0, excludes);

                core_namespace = classOld = null;
                variable = wildcards = excludes = controls = callbacks = descriptors = flowMap = null;
            };

            this.todo = function () {
                var i = 1,
                    args,
                    fn = arguments[0],
                    context = this;

                if (!v2.isFunction(fn)) {
                    context = fn;
                    fn = arguments[++i];
                }

                if (!fn) return;

                args = core_slice.call(arguments, i);

                if (isReady) {
                    applyCallback(fn, args, context, true);
                } else {
                    todoStack.push(function () {
                        applyCallback(fn, args, context, true);
                    });
                }
            };

            this.define('class', {
                get: function () {
                    return this.$.className;
                },
                set: function (value) {
                    if (classOld) {
                        v2.each(classOld.match(rnotwhite), function (value) {
                            this.$.classList.remove(value);
                        }, this);
                    }

                    if (value) {
                        v2.each(value.match(rnotwhite), function (value) {
                            this.$.classList.add(value);
                        }, this);
                    }

                    classOld = value;
                }
            });

            this.base = baseMap[""] = {};

            if (root_base) {
                v2.each(namespaceGraph, function (namespace, key) {

                    var
                        callback = context[key],
                        value = +context.flowGraph[key] || 0;

                    context[key] = function () {

                        var
                            current_base = context.base,
                            control = GLOBAL_VARIABLE_CURRENT_CONTROL;

                        context.base = baseMap[namespace];
                        GLOBAL_VARIABLE_CURRENT_CONTROL = context;

                        try {
                            return invokeCallback(callback, value, arguments);
                        } finally {
                            context.base = current_base;

                            if (control !== context) {
                                setTimeout(function () {
                                    GLOBAL_VARIABLE_CURRENT_CONTROL = control;
                                });
                            }
                        }
                    };
                });
            }

            if (defineSurport) {
                v2.define(this, {
                    isReady: function () {
                        return isReady;
                    },
                    tag: function () {
                        return core_tag;
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
            } else {
                this.tag = core_tag;
                this.namespace = core_namespace;
                this.wildcards = wildcards;
                this.variable = variable;
                this.isReady = isReady;
            }

            excludes["controls"] = true;

            if (defineSurport) {
                v2.define(this, {
                    controls: function () {
                        return controls || (controls = new V2Controls(this));
                    },
                    previousSibling: function () {
                        return this.host && this.host.controls.offset(this, -1);
                    },
                    nextSibling: function () {
                        return this.host && this.host.controls.offset(this, 1);
                    }
                });

                excludes["nextSibling"] = excludes["previousSibling"] = true;

            } else {
                this.controls = controls = new V2Controls(this);
            }

            computeWildcards(wildcards, 'function', true);

            namespaceGraph = null;
        },
        lazy: function () {
            var i = 1,
                fn = arguments[0],
                args,
                stack,
                context = this,
                identity = this.identity;

            if (!v2.isFunction(fn)) {
                context = fn;
                fn = arguments[++i];
            }

            if (!fn) return false;

            args = core_slice.call(arguments, i);

            if ((stack = stackCache[identity])) {
                return stack.pushStack(function () {
                    return applyCallback(fn, args, context, true);
                });
            }

            return applyCallback(fn, args, context, true);
        },
        lazyFor: function () {
            var i = 1,
                fn = arguments[0],
                group,
                context = this,
                identity = this.identity;

            if (!v2.isFunction(fn)) {
                context = fn;
                fn = arguments[++i];
            }

            if (!fn) {
                return returnFalse();
            }

            group = ++GLOBAL_VARIABLE_LOOP_GROUP;

            return function () {
                var args, stack;

                if ((stack = stackCache[identity])) {

                    args = core_slice.call(arguments, 0);

                    return stack.pushStack(function () {
                        return applyCallback(fn, args, context, true);
                    }, group);
                }

                return applyCallback(fn, arguments, context);
            };
        },
        when: function (extra, context) {
            if (v2.isString(extra) && (!context || context.nodeType === 1)) {
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

            return v2.take(selector, context || this.$, all);
        }
    };

    var inlineTag = "a|abbr|acronym|b|bdo|big|br|cite|code|dfn|em|font|i|img|kbd|label|q|s|samp|small|span|strike|strong|sub|sup|tt|u|var",
        rinlineTag = new RegExp('^(' + inlineTag + ")$");

    function makeUsbDescriptor(prop, getter, setter) {
        var name = v2.pascalCase(prop);
        return {
            get: function () {
                var callback = this['get' + name];

                return callback ? callback.call(this) : getter.call(this);
            },
            set: function (value) {
                var callback = this['set' + name];

                if (!callback || callback.call(this, value) === false) {
                    setter.call(this, value);
                }
            }
        };
    }

    var rcontext = /\((.*)\)$/i;

    function analyzeExp(context, selector) {
        if (!selector) {
            return [];
        }

        return selector.split(',').map(function (a) {
            return done(context, a.trim());
        });

        function done(context, selector) {

            if (selector === '?') {
                return context.host;
            }

            if (selector === '*') {
                do {
                    if (!context.host) {
                        break;
                    }

                } while ((context = context.host));

                return context;
            }

            if (selector === '~') {
                return context.previousSibling;
            }

            if (selector === '+') {
                return context.nextSibling;
            }

            var charAt = selector[0];

            if (charAt === '?' || charAt === '+' || charAt === '~') {

                selector = selector.slice(1);

                while ((context = charAt === '?' ? context.host : charAt === '+' ? context.nextSibling : context.previousSibling)) {
                    if (context.like(selector)) {
                        break;
                    }
                }

                return context;
            }

            if (charAt === '*') {
                var result;

                selector = selector.slice(1);

                while ((context = charAt === '*' ? context.host : charAt === '+' ? context.nextSibling : context.previousSibling)) {
                    if (context.like(selector)) {
                        result = context;
                    }
                }

                return result;
            }

            return v2.usb(context, selector)
        }
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

            if (v2.isPlainObject(watch)) {
                this.define(watch);
            }
        },
        invoke: function (fn) {

            if (!fn) return;

            if (v2.isString(fn)) {
                fn = this.methods[fn] || this.methods[v2.camelCase(fn)];
            }

            if (!v2.isFunction(fn)) {
                return;
            }

            return arguments.length > 1 ? fn.apply(this, core_slice.call(arguments, 1)) : fn.call(this);
        },
        build: function (view, node) {
            if (view === null || view === undefined)
                return;

            node = node || this.$;

            var vm = this;

            (function done(view) {

                var type = v2.type(view);

                switch (type) {
                    case 'string':
                        node.appendChild(view.html());
                        break;
                    case 'array':
                        v2.each(view, vm.lazyFor(done));
                        break;
                    case 'object':
                        if (view.nodeType) {
                            node.appendChild(view);

                            break;
                        }

                        if ('tag' in view) {

                            view.$$ = node;

                            vm.lazy(vm.create, view);

                            break;
                        }

                        v2.each(view, vm.lazyFor(function (view, tag) {

                            view.$$ = node;

                            vm.create(tag, view);
                        }));
                        break;
                    case 'function':
                        view.call(vm);
                        break;
                    default:
                        v2.error('Unsupported exception:View types are not supported.');
                        break;
                }
            })(view);
        }
    });

    v2.use({
        '&focus': function () {
            try {
                this.$.focus();
            } catch (_) { /* do something! */ }
        },
        "?toggle": function (toggle) {
            if (arguments.length > 0 && typeof toggle === 'boolean') {

                return v2.usb(this, "visible", toggle);
            }
            return v2.usb(this, "visible", !this.visible);
        },
        "&show": function () {
            var nodeName = this.$.nodeName.toLowerCase(),
                display = nodeName === 'table' ?
                    'table' :
                    nodeName === 'tr' ?
                        'table-row' :
                        nodeName === 'td' || nodeName === 'th' ?
                            'table-cell' :
                            rinlineTag.test(nodeName) ?
                                'inline' :
                                '';
            this.$.styleCb('display', display);
        },
        "&hide": function () {
            this.$.styleCb('display', 'none');
        }
    });

    v2.fn.init.prototype = v2.fn;

    v2.use('wait', {
        wait: function () {
            this.style = 1;
            this.defaultVisible = false;
        },
        render: function () {
            this.$.classList.add('wait');
        },
        build: function () {
            this.$backdrop = this.$.appendChild(".wait-backdrop".htmlCoding().html());
            this.$wait = this.$.appendChild(".wait-reveal>.shape.shape$*4".htmlCoding().html());
        },
        usb: function () {
            this.base.usb();
            this.define("style", function (style, oldStyle) {
                this.$wait.classList.remove('animation-' + oldStyle);
                this.$wait.classList.add('animation-' + style);
            });
        },
        show: function () {
            this.autoOpen = !this.$$.classList.contains('modal-open');

            if (this.autoOpen) {
                this.$$.classList.add('modal-open');
            }

            this.base.show();
        },
        hide: function () {
            this.base.hide();

            if (this.autoOpen) {
                this.$$.classList.remove('modal-open');
            }
        }
    });

    window.wait = {
        __wait_: null,
        show: function (style) {
            if (this.__wait_) {
                this.__wait_.style = style || 2;
                this.__wait_.show();
            } else {
                this.__wait_ = v2("wait", { style: style || 2 });
            }
        },
        hide: function () {
            if (this.__wait_) {
                this.__wait_.hide();
            }
        }
    };

    var defaultWaits = {
        _default: function (showOrHide, style) {
            if (showOrHide) {
                window.wait.show(style);
            } else {
                window.wait.hide();
            }
        }
    };

    v2.use('button', {
        button: function () {
            /** 按钮类型 */
            this.type = "button";
            /** 按钮名称 */
            this.text = '';
            /** 用于替换按钮的所有子元素 */
            this.html = '';
            /** 超小按钮 */
            this.xs = false;
            /** 小按钮 */
            this.sm = false;
            /** 大按钮 */
            this.lg = false;
        },
        init: function () {
            this.base.init('button');
        },
        render: function () {
            if (this.hostlike('navbar')) {
                this.$.classList.add('navbar-btn');
            } else {
                this.$.classList.add('btn');
            }

            if (this.lg || this.sm || this.xs) {
                this.$.classList.add(this.lg ? 'btn-lg' : this.sm ? 'btn-sm' : 'btn-xs');
            }

            if (this.type === 'submit') {
                this.$.classList.add('btn-primary');
            } else if (this.type === 'reset') {
                this.$.classList.add('btn-warning');
            }
        },
        usb: function () {

            this.base.usb();

            this.define('type');

            this.define({
                text: function (text) {
                    this.$.empty()
                        .append(document.createTextNode(text));
                },
                html: function (html) {
                    if (html) {
                        this.$.empty()
                            .append(html.html());
                    }
                }
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

    v2.use('modal', {
        modal: function () {
            /** 显示遮罩层 */
            this.backdrop = true;
            /** Esc 关闭 */
            this.keyboard = true;
            /** 标题 */
            this.title = "模态框";
            /** 显示按钮 */
            this.showBtn = true;
            /** 显示确定按钮 */
            this.showOk = true;
            /** 显示取消按钮 */
            this.showCancel = true;
            /** 显示关闭按钮 */
            this.showClose = true;
            /** 一次性的，在关闭时摧毁控件。 */
            this.singleUse = true;
            /** 按钮组 */
            this.buttons = [];

            this.xs = false;
            this.sm = false;
            this.lg = false;
        },
        design: function () {
            var vm = this;
            this.defaultVisible = false;

            if (this.showBtn && v2.isEmpty(this.buttons)) {

                this.buttons = [];

                if (this.showCancel) {
                    this.buttons.push({
                        text: "取消",
                        "class": "btn-warning",
                        events: {
                            click: function () {
                                if (vm.invoke('cancel-event') !== false) {
                                    if (vm.singleUse) {
                                        vm.close();
                                    } else {
                                        vm.hide();
                                    }
                                }
                            }
                        }
                    });
                }

                if (this.showOk) {
                    this.buttons.push({
                        text: "确定",
                        type: "submit",
                        events: {
                            click: function () {
                                if (vm.invoke('ok-event') !== false) {
                                    if (vm.singleUse) {
                                        vm.close();
                                    } else {
                                        vm.hide();
                                    }
                                }
                            }
                        }
                    });
                }
            }
        },
        render: function () {
            this.$.classList.add('modal', 'fade');
        },
        build: function (view) {
            var vm = this, htmls = ['.modal-dialog'];

            if (this.lg || this.sm || this.xs) {
                htmls.push(this.lg ? '.modal-lg' : this.sm ? '.modal-sm' : '.modal-xs');
            }

            htmls.push('>.modal-content>(.modal-header>h5.modal-title{', this.title, '}');

            if (this.showClose) {
                htmls.push('+button.close[data-dismiss="modal"]>span{&times;}');
            }

            htmls.push(')+.modal-body');

            if (this.showBtn) {
                htmls.push('+.modal-footer');
            }

            var html = htmls.join('');

            this.$modal = this.$.appendChild(html.htmlCoding().html());

            this.$content = this.$modal.firstChild;

            this.$header = this.$content.firstChild;

            this.$body = this.$header.nextSibling;

            if (this.showBtn) {

                this.$footer = this.$body.nextSibling;

                v2.each(this.buttons, function (button) {
                    button.$$ = vm.$footer;
                    vm.create('button', button);
                });
            }

            if (this.backdrop) {
                this.$backdrop = this.$.appendChild('.modal-backdrop.fade'.htmlCoding().html());
            }

            return this.base.build(view, this.$body);
        },
        show: function () {
            if (this.backdrop) {
                this.$backdrop.classList.add('in');
            }
            this.autoOpen = !this.$$.classList.contains('modal-open');

            if (this.autoOpen) {
                document.body.classList.add('modal-open');
            }

            this.$.classList.add('in');
        },
        hide: function () {
            this.$.classList.remove('in');

            if (this.backdrop) {
                this.$backdrop.classList.remove('in');
            }

            if (this.autoOpen) {
                document.body.classList.remove('modal-open');
            }
        },
        close: function () {
            this.hide();
            this.destroy(true);
        },
        getHeight: function () {
            return this.$modal.css('height');
        },
        setHeight: function (value) {
            this.$modal.styleCb('height', value);
        },
        getWidth: function () {
            return this.$modal.css('width');
        },
        setWidth: function (value) {
            this.$modal.styleCb('width', value);
        },
        commit: function () {
            var vm = this;

            if (this.keyboard) {
                this.$.on('keyup', function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 27) {
                        if (vm.singleUse) {
                            vm.close();
                        } else {
                            vm.hide();
                        }
                    }
                });
            }

            if (this.showClose) {
                this.$header.on('click', '[data-dismiss="modal"]', function () {
                    if (vm.invoke('close-event') !== false) {
                        if (vm.singleUse) {
                            vm.close();
                        }
                        else {
                            vm.hide();
                        }
                    }
                });
            }
        }
    });

    v2.use('message', {
        design: function () {
            this.defaultVisible = false;
        },
        message: function () {
            /** 对话框风格 */
            this.type = "success";
            /** 显示关闭按钮 */
            this.showClose = false;
            /** 提示框显示时间，超时自动关闭并摧毁（“0”表示不自动摧毁）。 */
            this.delayed = 2000;
            /** 提示信息 */
            this.data = "";
        },
        build: function () {
            this.$icon = this.$.appendChild('i.message-icon'.htmlCoding().html());

            if (this.showClose) {
                this.$close = this.$.appendChild('a.message-close{&times;}'.htmlCoding().html());
            }

            this.$tip = this.$.appendChild('.message-tip'.htmlCoding().html());
        },
        render: function () {
            this.$.classList.add('message', 'fade');
        },
        usb: function () {
            this.base.usb();

            this.define('type', function (type, oldType) {
                this.$icon.classList.remove('message-' + oldType);
                this.$icon.classList.add('message-' + type);
            });
        },
        load: function (data) {
            this.$tip.innerHTML = data || "";

            if (this.visible) {
                this.show();
            }
        },
        hide: function () {
            this.$.classList.remove('in');
        },
        close: function () {
            var that = this;

            this.hide();

            setTimeout(function () {
                that.destroy();
            }, 600);
        },
        show: function () {
            var that = this;

            v2.GDir('message')
                .done(function (vm) {
                    if (that !== vm) {
                        vm.destroy();
                    }
                });

            if (this.delayed > 0 && this.delayed <= 9007199254740991) {
                setTimeout(function () {
                    that.close();
                }, this.delayed);
            }

            this.$.classList.add('in');

            var width = this.$.offsetWidth;

            this.$.styleCb('margin-left', -(width / 2));
        },
        commit: function () {
            var that = this;
            if (this.showClose) {
                this.$close.on('prev.click', function () {
                    that.close();
                });
            }
        }
    });

    v2.each({ ok: "success", alert: "info", warn: "warning", fail: "danger" }, function (type, i) {
        v2[i] = function (msg, delay) {
            if (arguments.length === 0 && type === 'success') {
                msg = "操作成功!";
            }

            return v2('message', arguments.length > 1
                ? {
                    type: type,
                    data: msg,
                    delayed: delay
                }
                : {
                    type: type,
                    data: msg
                });
        }
    });

    if (isIE8) {
        var removeChild = Element.prototype.removeChild;
        Element.prototype.removeChild = function (node) {

            removeChild.call(this, node);

            DOMNodeRemoved(node);

        };
    } else {
        v2.subscribe(document, 'DOMNodeRemoved', function (e) {
            DOMNodeRemoved(e.target || e.srcElement);
        });
    }

    function noop() { }

    var xhrCb = window.XMLHttpRequest,
        xhr = new xhrCb(),
        xhrId = 0,
        xhrWait = {},
        xhrCallbacks = {},
        xhr_send = xhr.send,
        xhr_open = xhr.open,
        xhr_abort = xhr.abort;

    v2.ajaxWait = 1;

    v2.extend(xhrCb.prototype, {
        open: function () {
            var status,
                wait,
                xhr = this,
                waitCallbak,
                v2Control = GLOBAL_VARIABLE_CURRENT_CONTROL;

            if (v2Control) {
                var hasThis = false,
                    identity = v2Control.identity;

                v2Control.sleep(true);

                if ((hasThis = v2.isFunction(wait = v2Control.wait))) {
                    waitCallbak = wait;
                } else if (v2.isNumber(wait)) {
                    waitCallbak = function (showOrHide) {
                        defaultWaits._default(showOrHide, wait);
                    };
                } else {
                    waitCallbak = defaultWaits._default;
                }

                if (hasThis) {
                    waitCallbak.call(v2Control, true);
                } else {
                    waitCallbak(true);
                }

                if (xhrWait[identity]) {
                    xhrWait[identity] += 1;
                } else {
                    xhrWait[identity] = 1;
                }

                xhrCallbacks[xhr.xhrId = ++xhrId] = function () {

                    if (!(xhrWait[identity] -= 1)) {

                        status = xhr.status;

                        if (hasThis) {
                            waitCallbak.call(v2Control, false);
                        } else {
                            waitCallbak(false);
                        }

                        v2Control.sleep(!(status >= 200 && status < 300 || status === 304 || status === 1223));
                    }
                };
            }
            else if ((wait = v2.ajaxWait)) {
                if (v2.isFunction(wait)) {
                    waitCallbak = wait;
                } else if (v2.isNumber(wait)) {
                    waitCallbak = function (showOrHide) {
                        defaultWaits._default(showOrHide, wait);
                    };
                } else {
                    waitCallbak = defaultWaits._default;
                }

                xhrCallbacks[xhr.xhrId = ++xhrId] = waitCallbak;
            }

            return applyCallback(xhr_open, arguments, this);
        },
        send: function (data) {
            var xhr = this,
                xhr_id = xhr.xhrId;
            if (xhr_id && xhr_id > 0) {
                setTimeout(function () {
                    if (xhr.readyState === 4) {
                        if (xhr.xhrId in xhrCallbacks) {

                            xhrCallbacks[xhr.xhrId]();

                            delete xhrCallbacks[xhr.xhrId];
                        }

                        return;
                    }

                    var onreadystatechange = xhr.onreadystatechange;

                    var callback = function () {
                        if (this.readyState === 4) {

                            if (this.xhrId in xhrCallbacks) {

                                xhrCallbacks[this.xhrId]();

                                delete xhrCallbacks[this.xhrId];
                            }

                            this.onreadystatechange = noop;
                        }
                    };

                    xhr.onreadystatechange = onreadystatechange ? function () {

                        applyCallback(onreadystatechange, arguments, this);

                        callback.call(this);

                    } : callback;
                });
            }
            return data ? xhr_send.call(this, data) : xhr_send.call(this);
        },
        abort: function () {

            if (this.xhrId in xhrCallbacks) {

                xhrCallbacks[this.xhrId]();

                delete xhrCallbacks[this.xhrId];
            }

            return xhr_abort.call(this);
        }
    });

    v2.improve(Array.prototype, {
        map: function (callback, thisArg) {
            var results = [];
            for (var i = 0; i < this.length; i++) {
                results.push(callback.call(thisArg, this[i], i, this));
            }
            return results;
        },
        indexOf: core_indexOf,
        lastIndexOf: function (item, fromIndex) {
            if (arguments.length > 1) {
                fromIndex = fromIndex >> 0;
                fromIndex = fromIndex >= 0 ? Math.min(fromIndex, this.length - 1) : this.length + fromIndex;
            } else {
                fromIndex = this.length - 1;
            }

            for (var i = fromIndex; i >= 0; i--) {
                if (this[i] === item)
                    return i;
            }

            return -1;
        },
        includes: function (item, fromIndex) {
            return this.indexOf(item, fromIndex) > -1;
        },
        find: function (callback, thisArg) {
            return v2.find(this, callback, thisArg);
        },
        filter: function (callback, thisArg) {
            return v2.filter(this, callback, thisArg);
        },
        forEach: function (callback, thisArg) {
            v2.each(this, callback, thisArg);
        },
        some: function (callback, thisArg) {
            return v2.any(this, callback, thisArg);
        },
        every: function (callback, thisArg) {
            return v2.all(this, callback, thisArg);
        },
        zip: function (arr, callback, thisArg) {
            var results = [];

            if (!arr || arr.length === 0) {
                return results;
            }

            for (var i = 0, len = Math.min(this.length, arr.length); i < len; i++) {
                results.push(callback.call(thisArg, this[i], arr[i], i));
            }

            return results;
        },
        zipAny: function (arr, callback, thisArg) {
            if (!arr || arr.length === 0) {
                return false;
            }

            for (var i = 0, len = Math.min(this.length, arr.length); i < len; i++) {
                if (callback.call(thisArg, this[i], arr[i], i)) {
                    return true;
                }
            }

            return false;
        },
        zipAll: function (arr, callback, thisArg) {
            if (!arr || arr.length === 0) {
                return this.length === 0;
            }

            if (this.length !== arr.length) {
                return false;
            }

            for (var i = 0, len = this.length; i < len; i++) {
                if (!callback.call(thisArg, this[i], arr[i], i)) {
                    return false;
                }
            }

            return true;
        }
    });

    if (typeof Object.assign !== 'function') {
        Object.assign = function (target) {
            if (target === null || target === undefined) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            if (typeof target === 'boolean') {
                arguments[0] = new Object(target);
            }

            return extension(this, null, arguments);
        }
    }

    if (typeof define === "function") {
        define("v2", [], function () {
            return v2;
        });
    }

    window.v2 = v2;
    window.ArrayThen = ArrayThen;
});