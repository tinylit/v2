requirejs.config({
    //min: true,
    urlArgs: "r=" + (+new Date()),
    baseUrl: '/js',
    waitSeconds: 30000,
    paths: {
        v2: '/lib/v2',
        axios: '/lib/ajax/axios',
        components: '/lib/components'
    }
});
var r = /https?:\/\/[^\/]+\/(.+?)(\.[\w-]+|\?|#|$)/i;
var arr = ["v2"];
if (r = r.exec(location.href)) {
    arr.push(r[1]);
} else {
    arr.push("index");
}

require(arr, function (v2) {
    if (v2.isFunction(window.initPage))
        initPage(v2);
});