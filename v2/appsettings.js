requirejs.config({
    //min: true,
    urlArgs: "r=" + (+new Date()),
    baseUrl: '/js',
    waitSeconds: 30000,
    paths: {
        vue: 'lib/vue/vue',
        axios: 'lib/ajax/axios'
    }
});
var r = /https?:\/\/([\w-]+\.)*[\w-]+(?::\d+)?\/(([\w-]+\/)+)?(([\w-]+)(\.[\w-]+|\?|#|$)|\?|#|$)/i;
var arr = ["v2"];
if (r = r.exec(location.href)) {
    arr.push((r[2] || '') + (r[5] || "index"));
} else {
    arr.push("index");
}

require(arr, function (v2) {
    if (v2.isFunction(window.initPage))
        initPage(v2);
});