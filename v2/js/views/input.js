require(['components/v2.input'], function (/**@type Develop<"input">*/input) {
    input({
        type: 'radio',
        focus: true
    });
    input({
        type: 'checkbox',
        focus: true
    });

    input({
        type: 'datetime',
        focus: true
    });

    input({
        type: 'datetime-local',
        showIcon: false
    });

    input({
        type: 'date',
        focus: true
    });

    input({
        type: 'time',
        focus: true
    });

    input({
        type: 'select',
        selectedIndex: 1,
        template: '<option value="{{ value }}">{{ text }}</option>',
        view: [{ value: 1, text: "男" }, { value: 2, text: "女" }]
    });

    input({
        type: 'select',
        multiple: true,
        selectedIndex: 1,
        template: '<option value="{{ value }}">{{ text }}</option>',
        view: [{ value: 1, text: "男" }, { value: 2, text: "女" }]
    });

    input({
        type: "file",
        name: "singleFile",
        action: "http://localhost:19059/file/upload/single"
    });
});
