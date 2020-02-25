function initPage() {
    require(['components/v2.panel'], function (/** @type Develop<"panel"> */panel) {

        panel({
            style: 'primary',
            view: {
                head: "中国名校",
                body: "爱我中华!",
                foot: "版权-影子和树",
                tag: "list",
                view: ["清华大学", "北京大学", "成都理工大学", "电子科大", "泸州医学院"]
            }
        });

        var data = [];
        var thisYear = (new Date()).getFullYear();
        for (var i = 0, len = thisYear - 1993; i < len; i++) {
            data.push({
                id: 100 + i,
                name: "测试" + i,
                birth: (1993 + i) + "-01-01"
            });
        }

        panel({
            style: 'info',
            view: {
                head: "中国名校",
                foot: "版权-影子和树",
                tag: "table",
                checkbox: true,
                lockHead: true,
                multipleSelect: true,
                height: 407,
                view: [{
                    title: "编号",
                    field: "id",
                    align: 'center'
                }, {
                    title: "名称",
                    field: "name"
                }, {
                    title: "年龄",
                    field: "age",
                    format: function (value, index, data) {
                        var date = v2.date(data.birth);

                        return thisYear - date.getFullYear();
                    }
                }, {
                    title: "出生日期",
                    field: "birth"
                }, {
                    title: "操作",
                    field: "id"
                }],
                data: data
            }
        });
    });
}