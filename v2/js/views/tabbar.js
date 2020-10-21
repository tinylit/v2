require(['components/v2.tabbar'], function (/** @type Develop<"tabbar"> */tabbar) {
    v2.each(['top', 'right', 'left', 'bottom'], function (direction) {
        tabbar({
            direction: direction,
            components: {
                form: function (resovle) {
                    require(['components/v2.form'], resovle);
                }
            },
            view: [{
                text: "第一部分",
                content: "第一部分内容."
            }, {
                text: "第二部分",
                content: "第二部分内容."
            }, {
                text: "表单",
                content: {
                    tag: "form",
                    label: true,
                    inline: true,
                    view: {
                        id: {
                            title: "编号"
                        },
                        name: {
                            title: "名称"
                        },
                        status: {
                            type: "group",
                            title: "状态",
                            view: [{
                                type: 'radio',
                                value: 0,
                                text: "禁用"
                            }, {
                                type: 'radio',
                                value: 1,
                                text: "启用"
                            }]
                        },
                        created: {
                            title: "创建日期"
                        },
                        modified: {
                            title: "修改日期"
                        }
                    }
                }
            }]
        });
    });
});