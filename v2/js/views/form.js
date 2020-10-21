require(['components/v2.form'], function (form) {
    form({
        label: true,
        //horizontal: true,
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
    });
});