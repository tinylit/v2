require(['components/v2.pagingbar'], function (/** @type Develop<"pagingbar"> */pagingbar) {
    var x = pagingbar({
        //dataSize: 35,
        pageSize: 10,
        independent: false,
        methods: {
            pagingAjax: function (index, size) {
                console.log(index, size);
            }
        }
    });
    setTimeout(function () {
        x.dataSize = 35;
    }, 500);

    setTimeout(function () {
        x.pageSize = 25;
    }, 1000);
});