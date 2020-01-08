function initPage() {
    require(['components/v2.table'], function (/**@type Develop<'table'>*/table) {
        var thisYear = (new Date()).getFullYear();

        var data = [];

        for (var i = 0, len = thisYear - 1993; i < len; i++) {
            data.push({
                id: 100 + i,
                name: "测试" + i,
                birth: (1993 + i) + "-01-01"
            });
        }

        var vm = table({
            checkbox: true,
            lockHead: true,
            multipleSelect: true,
            width: 500,
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
        });

        var vm = table({
            checkbox: true,
            lockHead: true,
            multiple: true,
            multipleSelect: true,
            width: 500,
            height: 407,
            view: [{
                title: "编号",
                field: "id",
                align: 'center'
            }, {
                title: "人员|名称",
                field: "name"
            }, {
                title: "人员|敏感信息|年龄",
                field: "age",
                format: function (value, index, data) {
                    var date = v2.date(data.birth);

                    return thisYear - date.getFullYear();
                }
            }, {
                title: "人员|敏感信息|出生日期",
                field: "birth"
            }, {
                title: "操作",
                field: "id"
            }],
            data: data
        });


        var vm = table({
            checkbox: true,
            lockHead: true,
            multiple: true,
            lockCols: 1,
            multipleSelect: true,
            width: 500,
            height: 407,
            view: [{
                title: "编号",
                field: "id",
                align: 'center',
                width: 100
            }, {
                title: "人员|名称",
                field: "name",
                width: 150
            }, {
                title: "人员|敏感信息|年龄",
                field: "age",
                width: 100,
                format: function (value, index, data) {
                    var date = v2.date(data.birth);

                    return thisYear - date.getFullYear();
                }
            }, {
                title: "人员|敏感信息|出生日期",
                field: "birth",
                width: 280
            }, {
                title: "操作",
                field: "id",
                width: 100
            }],
            data: data
        });
    });
}