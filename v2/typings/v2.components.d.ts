/** 开发约定（添加含命名空间的组件） */
declare namespace Dev {
    /** 组件基类（可定义指定“tag”的“base”属性类型） */
    interface V2ControlBaseMap extends Use.V2ControlBaseMap {
        "input.textarea": V2ControlBaseMap["textarea"];
    }

    /** 组件（可定义指定“tag”的提示控件） */
    interface V2ControlMap extends Use.V2ControlMap {
        "input.textarea": Use.V2ControlMap["textarea"];
    }
}

/** 可能支持的控件 */
declare namespace Use {
    /** 插件 */
    interface V2ControlMap {
        "input": Input;
        "textarea": Textarea;
        "select": Select;
        "form": Form;
        "tooltip": Tooltip;
        "date-picker": DatePicker;
        "dropdown": Dropdown;
        "pagingbar": Pagingbar;
        "tabbar": Tabbar;
        "nav": Nav;
        "navbar": Navbar;
        "table": Table;
        "panel": Panel;
        "list": List;
        "progressbar": ProgressBar;
        'tree-view': TreeView;
        "layout": Layout;
    }

    /** 基类 */
    interface V2ControlBaseMap {
        "input": InputBase;
        "select": SelectBase,
        "textarea": InputBase;
        "form": FormBase;
        "date-picker": DatePickerBase;
        "pagingbar": PagingbarBase;
        "table": TableBase;
        "layout": LayoutBase;
    }
}


/** 定义控件基类方法 */
declare namespace Use {

    /** 输入框基类 */
    interface InputBase extends V2EmptyBase {
        /**
        *  自定义验证消息
        * @param message 消息
        */
        setCustomValidity(message: string): void;
        /** 检查是否验证成功 */
        checkValidity(): boolean;
        /** 验证报告 */
        reportValidity(): boolean;
    }

    /** 选择框基类 */
    interface SelectBase extends V2EmptyBase {
        /**
         * 多选时的返回值。
         * @param arr 选择的节点值数组。
         */
        valueTo(arr: Array<string>): boolean | number | string;
        /**
         * 多选时，设置节点是否选中。
         * @param option 节点。
         * @param value 值。
         */
        valueIs(option: HTMLOptionElement, value: string): boolean;
    }

    /** 日期选择框基类 */
    interface DatePickerBase extends V2EmptyBase {
        /**
         * 检查日期有效性
         * @param year 年
         * @param month 月
         * @param day 日
         */
        dateVoid(year: number, month: number, day: number): boolean;
        /**
         * 检查时间有效性
         * @param value 值
         * @param hms 0：时、1：分、2：秒
         */
        timeVoid(value: number, hms: 0 | 1 | 2): boolean;
        /** 检查初始日期的有效性 */
        checkVoid(): boolean;
        /**
         * 检查指定时间的有效性
         * @param ymd 年月日
         * @param hms 时分秒
         */
        checkVoid(ymd: number[], hms: number[]): boolean;
        /**
         * 月份切换
         * @param type 0：减一，1：加一。
         */
        tabMonth(type: 0 | 1): void;
        /**
         * 年份切换
         * @param type 0：减一，1：加一，2：减十，3：加十。
         */
        tabYear(type: 0 | 1 | 2 | 3): void;
        /**
         * 时间视图
         * @param hour 时
         * @param minute 分
         * @param second 秒
         */
        timeView(hour: number, minute: number, second: number): void;
        /**
         * 日期视图
         * @param year 年
         * @param month 月
         * @param day 日
         */
        dayView(year: number, month: number, day: number): void;
        /** 隐藏所有视图选择器 */
        hidePicker(): void;
        /**
         * 显示时间选择器
         * @param type 0：时、1：分、2：秒
         */
        timePicker(type: 0 | 1 | 2): void;
        /**
         * 显示月份选择器
         * @param month 月份
         */
        monthPicker(month: number): void;
        /**
         * 显示年份选择器
         * @param year 年份
         */
        yearPicker(year: number): void;
        /**
         * 提示
         * @param msg 消息
         */
        tip(msg: string): void;
        /**
         * 提示
         * @param msg 消息
         * @param title 标题
         */
        tip(msg: string, title: string): void;
    }

    /** 表单基类 */
    interface FormBase extends V2EmptyBase {
        /**
         * 等待框
         * @param show 显示或隐藏等待框。
         */
        wait(show?: boolean): void;
        /** 取数 */
        ajax(): void;
        /** 检查是否验证成功 */
        checkValidity(): boolean;
        /** 验证报告 */
        reportValidity(): boolean;
        /** 重置表单数据 */
        reset(): void;
        /** 表单提交 */
        submit(): void;
    }

    /** 分页条基类 */
    interface PagingbarBase extends V2EmptyBase {
        /** 生成分页条 */
        pagination(): void;
        /**
         * 跳转到指定页。
         * @param index 页索引。
         */
        go(index: number): void;
        /** 上一页 */
        prev(): void;
        /** 下一页 */
        next(): void;
    }

    /** 表格基类 */
    interface TableBase extends V2EmptyBase {
        /**
         * 等待框
         * @param toggle 开关
         */
        wait(toggle?: boolean): void;
        /**
         * 更新数据。
         * @param rowIndex 行索引
         * @param rowValue 行数据
         */
        updateAt(rowIndex: number, rowValue: PlainObject): void;
        /**
         * 移除指定行
         * @param rowIndex 行索引
         */
        deleteAt(rowIndex: number): void;
        /**
         * 插入指定数据
         * @param rowIndex 行索引
         * @param rowValue 行数据
         */
        insertAt(rowIndex: number, rowValue: PlainObject): void;
        /**
         * 选中指定行
         * @param rowIndex 行索引
         */
        check(rowIndex: number): void;
        /**
        * 取消选中指定行
        * @param rowIndex 行索引
        */
        uncheck(rowIndex: number): void;
        /** 选中所有行 */
        checkAll(): void;
        /** 取消选中所有行 */
        uncheckAll(): void;
        /** 获取第一条选中行数据 */
        getSelections(): PlainObject | null;
        /** 获取所有选中的数据 */
        getAllSelections(): ArrayThen<PlainObject>;
    }

    /** 架构 */
    interface LayoutBase extends V2EmptyBase {
        /** 查询 */
        query: (this: Layout, keywords: string) => void;
    }
}

/** 定义控件 */
declare namespace Use {
    /** 提示工具 */
    interface Tooltip extends V2Control<"tooltip"> {
        /** 是否脱离文档显示 */
        fixed: boolean;
        /** 提示内容 */
        content: string;
        /** 
         *  持续时间（单位：ms）：指定多少时间后自动关闭，大于零时生效。
         *  @default 0
         */
        duration: number;
        /** 显示方位 */
        direction: "auto" | "top-start" | "top" | "top-end" | "right" | "bottom-start" | "bottom" | "bottom-end" | "left";
    }

    /** 日期选择器 */
    interface DatePicker extends V2Control<"date-picker"> {
        /** 
         *  最小值
         *  @default new Date(1900, 0, 1)
         */
        min: Date;
        /**
         * 最大值
         * @default new Date(2099, 11, 31, 23, 59, 59, 999)
         */
        max: Date;
        /** 当前选中日期 */
        value: string;
        /**
         * 显示为对话框
         * @default true
         */
        dialog: boolean;
        /** 对话框为锁定显示【position:fixed】 */
        fixed: boolean;
        /** 显示按钮 */
        showBtn: boolean;
        /** 显示取消按钮 */
        showClearBtn: boolean;
        /** 显示现在按钮 */
        showTodayBtn: boolean;
        /** 显示确定按钮 */
        showOkBtn: boolean;
        /** 自动关闭 */
        autoClose: boolean;
        /** 自主 */
        independent: boolean;
        /** 周-至周日标题 */
        week: Array<string>;
        /** 日期格式 */
        format: string;
    }

    /** 输入框 */
    interface Input extends V2Control<"input"> {
        $: HTMLInputElement;
        /** 小号（添加“input-xs”样式） */
        xs: boolean;
        /** 中号（添加“input-sm”样式） */
        sm: boolean;
        /** 大号（添加“input-lg”样式） */
        lg: boolean;
        /** 最小值限制 */
        min: number;
        /** 最大值限制 */
        max: number;
        /** 字符串长度最短限制 */
        minlength: number;
        /** 最大长度限制 */
        maxlength: number;
        /** 必填 */
        required: boolean;
        /** 只读 */
        readonly: boolean;
        /** 正则表达式验证 */
        pattern: string;
        /** 禁用 */
        disabled: boolean;
        /** 自动填充 */
        autocomplete: boolean;
        /** 自动获取焦点 */
        autofocus: boolean;
        /** 支持多个值 */
        multiple: boolean;
        /** 是否去除空格 */
        trim: boolean;
        /** ID */
        id: string;
        /** 名称 */
        name: string;
        /** 类型 */
        type: "text" | "number" | "tel" | "email" | "url" | "search" | "hidden" | "password" | "color" | "month" | "week" | "range" | "file" | "redio" | "checkbox" | "time" | "date" | "datetime" | "datetime-local" | "file";
        /** 值 */
        value: string;
        /** 初始值 */
        defaultValue: string;
        /** 空内容时提示消息 */
        placeholder: string;
        /** 验证 */
        validity: ValidityState;
        /** 验证消息 */
        validationMessage: string;
    }

    /** 选项框 */
    interface Input {
        /** 是否选中 */
        checked: false;
        /** 初始选中状态 */
        defaultChecked: boolean;
        /** 同行显示 */
        inline: true;
        /** 选项描述 */
        description: string;
    }

    /** 日期输入框 */
    interface Input {
        /** 
         * 日期格式。
         * @example yyyy-MM-dd HH:mm:ss
         * @example yyyy-MM-dd
         * @example HH:mm:ss
         * @example HH:mm
         */
        format: string;
        /** 显示图标 */
        showIcon: true;
    }

    /** 搜索框/文件输入框 */
    interface Input {
        /** 接口地址 */
        action: string;
        /** 请求方式 */
        method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "PATCH";
    }

    /** 多行输入框 */
    interface Textarea extends V2ControlExtend<"textarea", "input"> {
        /** 主元素 */
        $: HTMLTextAreaElement;
        /** 小号（添加“input-xs”样式） */
        xs: boolean;
        /** 中号（添加“input-sm”样式） */
        sm: boolean;
        /** 大号（添加“input-lg”样式） */
        lg: boolean;
        /** 最小值限制 */
        min: number;
        /** 最大值限制 */
        max: number;
        /** 字符串长度最短限制 */
        minlength: number;
        /** 最大长度限制 */
        maxlength: number;
        /** 必填 */
        required: false;
        /** 只读 */
        readonly: false;
        /** 正则表达式验证 */
        pattern: string;
        /** 禁用 */
        disabled: false;
        /** 自动填充 */
        autocomplete: false;
        /** 自动获取焦点 */
        autofocus: false;
        /** 支持多个值 */
        multiple: false;
        /** ID */
        id: string;
        /** 名称 */
        name: string;
        /** 值 */
        value: string;
        /** 初始值 */
        defaultValue: string;
        /** 空内容时提示消息 */
        placeholder: string;
        /** 显示几行 */
        rows: number;
        /** 显示几列 */
        cols: number;
    }

    /** 选择框 */
    interface Select extends V2Control<"select"> {
        /** 主元素 */
        readonly $: HTMLSelectElement;
        /** 小号（添加“input-xs”样式） */
        xs: boolean;
        /** 中号（添加“input-sm”样式） */
        sm: boolean;
        /** 大号（添加“input-lg”样式） */
        lg: boolean;
        /** 只读 */
        readonly: boolean;
        /** 禁用 */
        disabled: boolean;
        /** 自动填充 */
        autocomplete: boolean;
        /** 自动获取焦点 */
        autofocus: boolean;
        /** 支持多个值 */
        multiple: boolean;
        /** 默认选中项 */
        selectedIndex: -1;
        /** 值 */
        value: string;
        /** 初始值 */
        defaultValue: string;
        /** 空内容时提示消息 */
        placeholder: string;
        /** 模板 */
        template: string;
    }

    /** 表单 */
    interface Form extends V2Control<"form"> {
        /** 主元素 */
        readonly $: HTMLFormElement;
        /** 行内布局：添加【form-inline】类 */
        inline: boolean;
        /** 垂直布局：添加【form-horizontal】类 */
        horizontal: boolean;
        /** 显示【label】标签 */
        label: boolean;
        /** 只读内容使用【span】标签显示 */
        readonly2span: boolean;
        /** 使用证书 */
        withCredentials: boolean;
        /** 是否去除输入框空格 */
        trim: boolean;
        /** 请求方式 */
        method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "PATCH";
        /**
         * 请求地址
         * @default 当前页面地址。 
         */
        action: string;
        /** 编码方式 */
        enctype: "application/x-www-form-urlencoded" | "application/json" | "application/xml";
        /** 按钮组 */
        buttons: Array<Button>;
        /** 快速显示/隐藏控件 */
        inputs: PlainObject<boolean>;
        /** 数据 */
        data: any[] | PlainObject<any>;
        /** 视图 */
        view: PlainObject<Input | Select | Textarea> | Array<Input | Select | Textarea | Array<Input | Select | Textarea>>;
    }

    /** 配置项 */
    interface DropdownOption extends PlainObject<boolean | number | string | any> {
        /** 显示文字 */
        text: string;
        /** 实际值 */
        value: string;
        /** 跳转地址 */
        href?: string;
        /** 居右显示（添加“pull-right”样式） */
        right?: boolean;
        /** 是否禁用（添加“disabled”样式） */
        disabled?: boolean;
        /** 是否是下拉列表 */
        dropdown?: boolean;
        /** 视图（仅下拉列表时有效） */
        view: Array<DropdownOption | string | boolean | Array<DropdownOption | string | boolean>>;
    }

    /** 下拉菜单 */
    interface Dropdown extends V2Control<"dropdown"> {
        /** 
         *  方位 
         *  @default bottom
         */
        direction: "bottom" | "top";
        /** 数据(从“view”中分析提取) */
        readonly data: Array<DropdownOption>;
        /**
         * 视图
         * 说明：Boolean 代表分割线。
         *       String 代表标题。
         *       Object 代表项数据。
         *       Array 代码子菜单。
         */
        view: Array<DropdownOption | string | boolean | Array<DropdownOption | string | boolean>>;
        /** 当前选中项 */
        selectedIndex: number;
        /** 当前选中的配置 */
        readonly selectedOptions: DropdownOption;
    }

    /** 分页条 */
    interface Pagingbar extends V2Control<"pagingbar"> {
        /** 中号（添加“pagination-sm”样式） */
        sm: boolean;
        /** 大号（添加“pagination-lg”样式）*/
        lg: boolean;
        /** 自动策划（当总页数小于1时自动隐藏，否则自动显示） */
        independent: boolean;
        /** 页码循环 */
        paginationLoop: boolean;
        /** 上一页显示文本 */
        paginationPrevText: string;
        /** 下一页显示文本 */
        paginationNextText: string;
        /** 数据大小（总条数） */
        dataSize: number;
        /** 单页数据大小（一页显示多少条数据） */
        pageSize: number;
        /** 当前页码（索引从0开始） */
        pageIndex: number;
    }

    /** 导航 */
    interface Nav extends V2Control<"nav"> {
        /** 类型 */
        type: "default" | "tab" | "thumbtack";
        /** 堆放（添加“nav-stacked”样式） */
        stacked: boolean;
        /** 调整（添加“nav-justified”样式） */
        justified: boolean;
        /**
        * 视图
        * 说明：Boolean 代表分割线。
        *       String 代表标题。
        *       Object 代表项数据。
        *       Array 代码子菜单。
        */
        view: Array<DropdownOption | string | boolean | Array<DropdownOption | string | boolean>>;
        /** 数据(从“view”中分析提取) */
        readonly data: Array<DropdownOption>;
        /** 当前选中项 */
        selectedIndex: number;
        /** 当前选中的配置 */
        readonly selectedOptions: DropdownOption;
    }

    /** 选项卡 */
    interface TabbarOption extends DropdownOption {
        /** 内容 */
        content: string | Element | V2ControlStandard;
    }

    /** 选项卡 */
    interface Tabbar extends V2Control<"tabbar"> {
        /** 选项卡位于内容的指定方位 */
        direction: "top" | "right" | "bottom" | "left";
        /** 视图 */
        view: Array<TabbarOption>;
        /** 数据(从“view”中分析提取) */
        readonly data: Array<string | Element | V2ControlStandard>;
        /** 当前选中项 */
        selectedIndex: number;
        /** 当前选中的配置 */
        readonly selectedOptions: TabbarOption;
    }

    /** 导航条配置 */
    interface NavbarOption {
        /** 靠右显示 */
        right?: boolean;
        /** 靠左显示 */
        left?: boolean;
        /**
        * 视图
        * 说明：Boolean 代表分割线。
        *       String 代表标题。
        *       Object 代表项数据。
        *       Array 代码子菜单。
        */
        view: Array<DropdownOption | string | boolean | Array<DropdownOption | string | boolean>>
    }

    /** 导航条 */
    interface Navbar extends V2Control<"navbar"> {
        /** 品牌 */
        brand: string;
        /** 反转 */
        inverse: boolean;
        /** 类型 */
        type: "default" | "top" | "fixed-top" | "fixed-bottom";
        /** 视图 */
        view: Array<NavbarOption | V2Controllike>;
    }

    /** 表头 */
    interface TableOption {
        /** 标题 */
        title: string;
        /** 字段 */
        field: string;
        /** 标题提示（仅“th”有效） */
        tooltip?: string;
        /** 宽度（仅“th”有效） */
        width?: number | string;
        /** 水平布局 */
        align?: "right" | "left" | "center" | "justify" | "char";
        /** 垂直布局 */
        valign?: "top" | "middle" | "bottom" | "baseline";
        /** 排序能力（仅“th”有效） */
        sortable?: boolean;
        /** 格式化（仅“td”有效） */
        format?(value: any, rowIndex?: number, rowValue?: PlainObject, td?: HTMLTableDataCellElement): string | void;
    }

    /** CSS风格 */
    interface CssStyleObject {
        /** style 属性 */
        css: PlainObject<string>;
        /** 类 */
        class: string;
    }

    /** 表格 */
    interface Table extends V2Control<"table"> {
        /** 标题 */
        caption: string;
        /** 添加“table-bordered”样式 */
        border: boolean;
        /** 添加“table-hover”样式 */
        hover: boolean;
        /** 添加“table-condensed”样式 */
        condensed: boolean;
        /** 添加“table-striped”样式 */
        striped: boolean;
        /** 复选框 */
        checkbox: boolean;
        /** 多表头（税率|3%,税率|7%,税率|10%，生成【税率】为一级表头，【3%】、【7%】和【10%】是二级表头） */
        multiple: boolean;
        /** 多选 */
        multipleSelect: boolean;
        /** 锁定列头 */
        lockHead: boolean;
        /** 锁定列数（复选框不参与计数） */
        lockCols: number;
        /** 行风格 */
        rowStyle?: (rowValue: PlainObject, rowIndex: number) => CssStyleObject;
        /** 行属性 */
        rowAttributes?: (rowValue: PlainObject, rowIndex: number) => PlainObject<string>;
        /** 视图（列信息） */
        view: Array<TableOption>;
        /** 列 */
        readonly cols: Array<TableOption>;
        /** 数据 */
        data: Array<PlainObject>;
        /** 行 */
        readonly rows: Array<PlainObject>;
        /** 当前页码（索引从“0”开始） */
        pageIndex: number;
        /** 单页数据大小 */
        pageSize: number;
        /** 数据量 */
        dataSize: number;
        /** 分页条 */
        pagination: boolean;
        /** 循环分页 */
        paginationLoop: boolean;
    }

    /** 面板视图 */
    interface PanelView extends PlainObject {
        /** TAG */
        tag: string;
        /** 头部 */
        head?: string | { tagName: string, text: string };
        body?: string | V2Controllike;
        /** 底部 */
        foot?: string | V2Controllike;
    }

    /** 面板 */
    interface Panel extends V2Control<"panel"> {
        /** 类型 */
        style: "default" | "primary" | "success" | "info" | "warning" | "danger";
        /** 视图 */
        view: string | PanelView;
    }

    /** 列表项 */
    interface ListItem {
        /** 风格 */
        style?: "default" | "success" | "info" | "warning" | "danger";
        /** 链接（风格为“link”时有效） */
        href?: string;
        /** 禁用 */
        disabled?: boolean;
        /** 标题 */
        title?: string;
        /** 文本 */
        text: string;
        /** 点击事件 */
        click?: (this: List, e: Event) => any;
    }

    /** 列表 */
    interface List extends V2Control<"list"> {
        /** 类型 */
        type: "default" | "link" | "button";
        /** 视图 */
        view: Array<string | ListItem>;
    }

    /** 进度条 */
    interface ProgressBar extends V2Control<"progressbar"> {
        /** 类型 */
        style: "default" | "primary" | "success" | "info" | "warning" | "danger";
        /** 分割线 */
        striped: boolean;
        /** 活动的 */
        active: boolean;
        /** 进度 0~100 */
        data: number;
    }

    /** 树节点 */
    interface TreeItem {
        /** 主键 */
        id: number | string;
        /** 名称 */
        name: string;
        /** 图标 */
        icon?: string;
        /** 是否包含子节点 */
        hasChild?: boolean;
        /** 子节点 */
        view?: Array<TreeItem>;
    }

    /** 树形结构 */
    interface TreeView extends V2Control<"tree-view"> {
        /** 类型 */
        type: "none" | "radio" | "checkbox" | "radio-by-view" | "checkbox-by-view";
        /** 是否具备最小话的能力 */
        miniable: boolean;
        /** 显示参考线 */
        indentGuide: boolean;
        /** 参考线颜色（索引加“一”：即为树结构层级），如:["red","blue"]，标识第一层为红色，第二层为蓝色，其它层级颜色默认 */
        indentGuideColors: Array<string>,
        /** 树 */
        view: Array<TreeItem>;
        /** 树 */
        data: Array<TreeItem>;
    }

    /** 导航项 */
    interface NavSubItem {
        /** 标题   */
        title: string;
        /** 链接 */
        src: string;
    }

    /** 根导航项 */
    interface NavItem {
        /** 标题   */
        title: string;
        /** 图标 */
        icon: string;
        /** 链接 */
        src: string;
    }

    /** 导航菜单 */
    interface NavMenu {
        /** 标题 */
        title: string;
        /** 图标 */
        icon: string;
        /** 菜单 */
        menu: Array<NavSubItem>;
    }

    /** 导航工具 */
    interface NavTool {
        /** 标题   */
        title: string;
        /** 图标 */
        icon: string;
        /** 链接 */
        src?: string;
        /** 点击事件（调用“methods”中的函数） */
        click?: string;
    }

    /** 导航消息 */
    interface NavMsg {
        /** 标题 */
        title: string;
        /** 头像 */
        avatar: string;
        /** 点击事件 */
        click: string;
        /** 描述 */
        description: string;
    }

    /** 导航通知 */
    interface NavNotify {
        /** 标题 */
        title: string;
        /** 图标 */
        icon: string;
        /** 点击事件 */
        click: string;
        /** 内容 */
        content: string;
    }

    /** 布局 */
    interface Layout extends V2Control<"layout"> {
        /** 用户姓名 */
        userName: string;
        /** 头像 */
        userAvatar: string;
        /** 显示搜索宽 */
        search: boolean;
        /** 搜索去除空格框 */
        trimOnSearch: boolean;
        /** 导航 */
        data: Array<NavItem | NavMenu>;
        /** 工具 */
        view: Array<NavTool>;
        /** 消息 */
        messages: Array<NavMsg>;
        /** 通知 */
        notifies: Array<NavNotify>;
    }
}