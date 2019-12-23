function initPage() {
    require(['components/v2.navbar'], function (/** @type Develop<"navbar"> */navbar) {

        navbar({
            view: [{
                view: [{
                    text: "首页"
                }, {
                    text: "链接"
                }, {
                    text: "链接"
                }, {
                    text: "下拉菜单",
                    dropdown: true,
                    view: [{
                        text: "下拉导航1"
                    }, {
                        text: "下拉导航2"
                    }, {
                        text: "其他"
                    }, true, "标签", {
                        text: "链接1"
                    }, {
                        text: "链接2"
                    }]
                }]
            }, {
                tag: "form",
                left: true,
                label: false,
                view: {
                    type: "text"
                },
                buttons: {
                    text: "提交"
                }
            }, {
                right: true,
                view: [{
                    text: "右边链接"
                }, {
                    text: "下拉菜单",
                    dropdown: true,
                    view: [{
                        text: "下拉导航1"
                    }, {
                        text: "下拉导航2"
                    }, {
                        text: "其他"
                    }, true, "标签", {
                        text: "链接3"
                    }]
                }]
            }]
        });
    });
}