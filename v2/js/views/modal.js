function initPage() {
    require(['components/v2.form'], function () {

        /** @type Develop<"form"> */
        var view = {
            tag: "form",
            label: true,
            //horizontal: true,
            //inline: true,
            data: {
                //id: 12264836578,
                name: "测试",
                status: 0,
                created: "2019-12-01 12:00:00",
                modified: "2019-12-01 12:00:00"
            },
            view: {
                id: {
                    title: "编号",
                    required: true
                },
                name: {
                    title: "名称"
                },
                describe: {
                    tag: 'textarea',
                    title: "描述",
                    value: "做一下事情"
                },
                status: {
                    type: "group",
                    title: "状态",
                    value: 1,
                    view: [{
                        type: 'radio',
                        value: 0,
                        description: "禁用"
                    }, {
                        type: 'radio',
                        value: 1,
                        description: "启用"
                    }]
                },
                created: {
                    title: "创建日期",
                    type: 'datetime'
                },
                modified: {
                    title: "修改日期",
                    type: 'datetime'
                }
            },
            /**
             * 依赖注入
             * @param {Use.PlainObject} view
             * @param {Array<Use.Button>} buttons
             */
            "build(view, buttons)": function (view, buttons) {
                console.log("view:", this.view === view);
                console.log("buttons:", this.buttons === buttons);
                this.base.build();
                this.base.b
            },
            buttons: [{
                text: "重置",
                type: "reset"
            }, {
                text: "确定",
                type: "submit"
            }]
        };

        v2('modal', {
            variable: {
                isClose: true
            },
            isClose: false,
            /**
             * 依赖注入(优先注入【variable】中的属性)
             * @param {boolean} isClose 全局变量中定义的【isClose】
             */
            "commit(isClose)": function (isClose) {
                if (isClose) {
                    v2.log('成功注入【isClose】依赖', 3);
                }
                this.base.commit();
            },
            view: view
        });
    });
}