function initPage() {
    require(['components/v2.dropdown'], function (/** @type Develop<"dropdown"> */dropdown) {

        dropdown({
            //direction: "top",
            view: [{
                text: "操作"
            }, {
                text: "设置项目"
            }, {
                text: "更多设置"
            }, true, [{
                text: "操作"
            }, {
                text: "设置项目"
            }, {
                text: "更多设置"
            }]]
        });
    });
}