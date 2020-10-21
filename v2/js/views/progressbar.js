require(['components/v2.progressbar'], function (/** @type Develop<"progressbar"> */progressbar) {
    progressbar({
        style: 'info',
        striped: false,
        data: 15
    });

    var bar = progressbar({
        style: 'primary',
        active: true,
        data: 15
    });

    var timer = setInterval(function () {
        bar.data = Math.floor(bar.data * 1.5);

        if (bar.data >= 100) {
            bar.active = false;
            clearInterval(timer);
        }
    }, 75);

});