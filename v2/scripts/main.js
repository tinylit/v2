var version = "1.0.1.1";
var r = /^https?:\/\/[^/]+\/(([^?/#]+\/)*([^?/#]+?))(\.[\w-]+|\?|#|$)/i;
var ry = /(\?|&)__yep_=(.*?)(&|$)/i;
var deps = ['v2'];
var ALL_FNCODINGS = {};
var PAGED_FNCODINGS = {};

requirejs.config({
    urlArgs: "r=" + version,
    baseUrl: '/js',
    waitSeconds: 30000,
    deps: [],
    paths: {
        v2: '/lib/v2',
        vue: '/lib/vue/vue',
        axios: '/lib/ajax/axios',
        components: '/lib/components',
        'es6-promise.auto': '/lib/es6-promise.auto'
    }
});


if (typeof Promise === 'undefined') {
    deps.unshift('es6-promise.auto');
}

if (r.test(location.href)) {
    deps.unshift(RegExp.$1);
} else {
    deps.unshift('index');
}

function ready() {
    var node = document.getElementById('wait');

    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}


function SetViewsFnCodings(value) {
    if (window === top) {
        ALL_FNCODINGS = value || {};
    } else {
        top.SetViewsFnCodings(value);
    }
}

function GetViewFnCodings(key) {
    if (window === top) {
        return ALL_FNCODINGS[key] || {};
    }

    return top.GetViewFnCodings(key);
}

if (ry.test(location.search || location.href)) {
    PAGED_FNCODINGS = GetViewFnCodings(RegExp.$2);
}

require(deps, function (startup) {
    if (v2.isFunction(startup)) {
        require(['axios'], function (axios) {

            axios.defaults.crossDomain = true;
            axios.defaults.baseURL = 'http://localhost:2023/';//正式

            axios.defaults.headers.common['Authorization'] = v2.storage.get("token");

            axios.interceptors.response.use(function (response) {
                if (response.status === 401) {
                    v2.storage.remove('token');

                    location.href = '/';

                    return {
                        success: false,
                        msg: "登录令牌已失效!"
                    };
                }

                if (response.status === 403) {
                    return {
                        success: false,
                        msg: "非法操作，权限不足!"
                    };
                }

                // 对响应数据做点什么
                return response.data;
            }, function (error) {
                if (error.response.status === 405) {
                    return {
                        success: false,
                        msg: "服务异常，请联系优易票相关人员!"
                    };
                }
                // 对响应错误做点什么
                return Promise.reject(error);
            });

            ready();

            window.axios = axios;

            if (startup.length === 1) {
                startup(axios);
            } else {
                startup();
            }
        });
    } else {
        ready();
    }
});