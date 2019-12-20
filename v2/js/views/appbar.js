function initPage() {
    require(['components/v2.appbar'], function (/** @type Develop<"appbar"> */appbar) {
        appbar({
            view: [{
                text: "首页",
                active: true
            }, {
                text: "资料"
            }, {
                text: "信息",
                disabled: true
            }, {
                dropdown: true,
                right: true,
                text: "下拉",
                view: [{
                    text: "操作"
                }, {
                    text: "设置栏目"
                }, {
                    text: "更多设置"
                }, true, {
                    text: "分割线"
                }]
            }]
        });

        appbar({
            stacked: true,
            view: [{
                text: "首页",
                active: true
            }, {
                text: "资料"
            }, {
                text: "信息",
                disabled: true
            }, {
                dropdown: true,
                right: true,
                text: "下拉",
                view: [{
                    text: "操作"
                }, {
                    text: "设置栏目"
                }, {
                    text: "更多设置"
                }, true, {
                    text: "分割线"
                }]
            }]
        });

        appbar({
            type: "thumbtack",
            stacked: true,
            view: [{
                text: "首页",
                active: true
            }, {
                text: "资料"
            }, {
                text: "信息",
                disabled: true
            }, {
                dropdown: true,
                right: true,
                text: "下拉",
                view: [{
                    text: "操作"
                }, {
                    text: "设置栏目"
                }, {
                    text: "更多设置"
                }, true, {
                    text: "分割线"
                }]
            }]
        });
    });
}