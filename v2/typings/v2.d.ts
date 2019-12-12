declare namespace Use {

    /** 普通对象 */
    interface PlainObject<T = any> {
        [key: string]: T;
    }

    /** 堆载 */
    interface V2Stack {
        /** 当前需要渲染插件TAG */
        readonly tag: string;
        /** 当前等待渲染的插件总和 */
        readonly length: number;
        /** 承载的母控件为一身份认证 */
        readonly identity: number;
        /** 当前异步方法个数 */
        readonly readyWait: number;
        /**
         * 添加异步的回调函数。
         * @param tag 当前加载的插件TAG。
         * @param callback 回调函数。
         */
        waitSatck(tag: String, callback: Function): V2Stack;
        /**
         * 添加需要等待的回调函数。在其之前最近一个异步函数完成时，执行该函数。
         * @param callback 回调函数。
         */
        pushStack(callback: Function): V2Stack;
    }

    /** 普通事件 */
    interface PlainEvent extends Function {
        prototype: Element;
        arguments: Array<Event>;
    }

    /** 普通方法 */
    interface PlainMethod extends Function {
        prototype: V2Control;
    }

    /** 普通组件(key是“{TAG}”) */
    interface PlainComponents extends PlainObject<PlainObject>, V2ControlStandard { }

    /** 同步方法组件(key是“{TAG}”) */
    interface FunctionComponents extends PlainObject<(resolve: () => void) => void> { }

    /** 控件基类 */
    interface V2ControlBase {
		/**
         * 初始化控件（查询或 生产主元素）
         * @param tag 控件元素TAG，默认：div
         */
        init(tag?: string | RegExp | Array<string> | PlainObject<boolean> | ((nodeName: string) => boolean), tagName?: string): void;
        /**
        *  构建 HTML 代码。
        *  @param view 视图。
        */
        build(view?: any): void;
        /**
        * 建立属性监听。
        * @param watch 督查
        */
        usb(watch?: any): void;
        /**
        * 渲染子控件
        * @param tag TAG
        * @param options 配置信息
        */
        create<K extends keyof V2ControlMap>(tag: K, options?: V2ControlExtend<K>): V2ControlMap[K];
        /**
         * 渲染子控件
         * @param tag TAG
         * @param options 配置信息
         */
        create<K extends string>(tag: K, options?: V2Control<K>): V2Control<K>;
        /**
         * 渲染子控件
         * @param tag TAG
         * @param options 配置信息
         */
        create(options: PlainObject<(this: V2ControlStandard, ...args: any[]) => any>): V2ControlStandard;
        /**
         * 控件堆栈（控件会按照堆载顺序执行，当遇到异步加载的控件时，方法会被暂停，等待异步加载完成后继续执行。）
         * @param callback 回调函数
         */
        lazy(callback: Function): Function;
        /**
         * 控件堆栈（控件会按照堆载顺序执行，当遇到异步加载的控件时，方法会被暂停，等待异步加载完成后继续执行。）
         * @param loop 为真时返回回调函数，否则返回函数返回值或堆载队列。
         * @param callback 回调函数
         */
        lazy<T>(loop: boolean, callback: (...args: any[]) => T, ...args: any[]): (...args: any[]) => T | T | V2Stack;
        /**
         * 控件堆栈（控件会按照堆载顺序执行，当遇到异步加载的控件时，方法会被暂停，等待异步加载完成后继续执行。）
         * @param context 指定回调函数调用时的上下文对象。
         * @param callback 回调函数
         */
        lazy<T, TContext extends Object>(context: TContext, callback: (this: TContext, ...args: any[]) => T, ...args: any[]): (this: TContext, ...args: any[]) => T | T | V2Stack;
        /**
         * 控件堆栈（控件会按照堆载顺序执行，当遇到异步加载的控件时，方法会被暂停，等待异步加载完成后继续执行。）
         * @param loop 为真时返回回调函数，否则返回函数返回值或堆载队列。
         * @param context 指定回调函数调用时的上下文对象。
         * @param callback 回调函数
         */
        lazy<T, TContext extends Object>(loop: boolean, context: TContext, callback: (this: TContext, ...args: any[]) => T, ...args: any[]): (this: TContext, ...args: any[]) => T | T | V2Stack;
		/**
         * 控件堆栈（控件会按照堆载顺序执行，当遇到异步加载的控件时，方法会被暂停，等待异步加载完成后继续执行。）
         * @param callback 回调函数
         */
        lazy<T>(callback: () => T, arg: any, ...args: any[]): (arg: any, ...args: any[]) => T;
        /**
         * 调用控件“methods”属性中，指定属性名称为“name”的方法。
         * @param name 控件“methods”中属性名称为“name”的方法。
         * @param args 函数执行的参数。
         */
        invoke(name: string, ...args: any[]): any;
        /**
         * 调用指定方法。
         * @param fn 方法。
         * @param args 函数执行的参数。
         */
        invoke<T>(fn: (...args: any[]) => T, ...args: any[]): T;
        /**
         * 在当前控件主元素下查找满足选择器的第一个元素。
         * @param selectors 选择器
         */
        take(selectors: string): Element;
        /**
         * 在指定上下文中下查找满足选择器的第一个元素。
         * @param context 上下文
         * @param selectors 选择器
         */
        take(selectors: string, context: Element): Element;
        /**
         * 在指定上下文中下查找满足选择器的所有元素。
         * @param context 上下文
         * @param selectors 选择器
         * @param all 查找所有
         */
        take(selectors: string, context: Element, all: true): Element;
        /**
         * 返回只包含当前主元素的集合。
         */
        when(): ArrayThen<Element>;
        /**
         * 在当前控件主元素下查找满足选择器的所有元素。
         * @param selectors 选择器
         */
        when(selectors: string): ArrayThen<Element>;
        /**
         * 在指定上下文中下查找满足选择器的所有元素。
         * @param selectors 选择器
         * @param context 上下文
         */
        when(selectors: string, context: Element): ArrayThen<Element>;
        /**
         * 返回包含所有参数的集合。
         * @param elem 元素
         */
        when(...args: Element[]): ArrayThen<Element>;
        /**
         * 在指定上下文中下查找满足选择器的所有元素。
         * @param selectors 选择器
         * @param context 上下文
         */
        when(selectors: string, context: Element): ArrayThen<Element>;
        /** 使控件获取焦点 */
        focus(): void;
        /** 显示控件 */
        show(): void;
        /** 隐藏控件 */
        hide(): void;
        /** 反转当前控件显示/隐藏状态 */
        toggle(): boolean;
        /**
         * 隐藏或显示控件
         * @param toggle 为true时显示控件，否则隐藏控件
         */
        toggle(toggle: boolean): boolean;
    }

    /** 属性 */
    interface V2PropertyDescriptor<T> {
        configurable?: boolean;
        enumerable?: boolean;
        value?: any;
        writable?: boolean;
        get?(this: T): any;
        set?(this: T, v: any): void;
    }

    /** 控件标准 */
    interface V2ControlStandard extends V2ControlBase {
        /** 唯一身份标识 */
        readonly identity: number;
        /** 版本号 */
        readonly v2version: string;
        /** 是否已完成 */
        readonly completed: boolean;
        /** 限制高宽（采用“min-”方式） */
        limit: false;
        /** 自动取数 */
        access: false;
        /** 控件展示状态 */
        visible: true;
        /** 默认展示状态 */
        defaultVisible: true;
        /** 跳过事件绑定 */
        skipOn: false;
        /** 插件主元素 */
        $: Element;
        /** 插件主元素的父元素 */
        $$: Element;
        /** 部署（如：事件行为） */
        deployment: Element;
        /** 请求（如：获取数据） */
        request: Element;
        /** 响应（如：写入数据） */
        response: Element;
        /** 样式 */
        class: string;
        /** 变量 */
        variable: PlainObject<boolean | number | string | object>;
        /** 插件数据 */
        data: any;
        /** 视图渲染 */
        view: any;
        /** 监控数据变化，数据变化时，调用指定方法 */
        watch: PlainObject<Function>,
        /** 事件集合 */
        events: PlainObject<PlainEvent>;
        /** 方法集合 */
        methods: PlainObject<PlainMethod>;
        /** 通配符 */
        wildcards: PlainObject<WildCard>,
        /** 组件集合 */
        components: FunctionComponents | PlainComponents;
    }

    /** 通配符 */
    interface WildCard {
        /** 支持的类型，同时支持多种类型时，以“|”分隔。 */
        type: "*" | "string" | "boolean" | "number" | "date" | "array" | "regexp" | "function" | "object";
        /** 执行的别名 */
        hooks?: string;
        /**
         * 当值类型满足 “支持的类型” 时，执行此方法。
         * @param control 控件
         * @param key 属性名称
         * @param value 值
         */
        exec(control: V2Control, key: string, value: any): any;
    }

    /** 控件组 */
    interface V2ControlCollection extends ArrayLike<V2Control> {
        <T extends V2ControlStandard>(host: T): V2ControlCollection;
        /**
         * 添加控件。
         * @param control 控件
         */
        add<T extends V2Control>(control: T): T;
        /**
         * 移除控件
         * @param control 控件
         * @returns 返回移除控件的索引。
         */
        remove(control: V2Control): number;
        /** 摧毁当前控件组中所有控件 */
        destroy(): number;
        /**
         * 获取指定索引位的控件。
         * @param index 索引。小于0时，加上当前集合的长度作为索引。
         */
        eq(index: number): V2Control;
        /**
         * 获取满足函数条件的第一个元素。
         * @param callback 回调函数。
         */
        get(callback: (control: V2Control) => boolean): V2Control;
        /**
         * 获取基于【control】偏移【offset】索引次的控件。
         * @param control 控件。
         * @param offset 偏移量。
         */
        offset(control: V2Control, offset: number): V2Control;
    }

    /** 组件扩展 */
    interface V2ControlExtentions<T extends V2ControlBase, TFlowGraph extends FlowGraph<T>> extends TFlowGraph, T { }

    /** 基础组件 */
    interface V2Component<K> extends V2ControlExtentions<V2ControlBaseMap[K], FlowGraphMap<Dev.Develop<K>[K]>[K]> { }

    /** 组件扩展 */
    interface V2ComponentExtend<K = "*"> extends V2ComponentExtentions<Dev.Develop<K>[K]> {
        /**
         * 判断当前控件是否类似于指定TAG名称（即当前控件继承TAG对应的控件）。
         * @param tag 名称
         */
        like(tag: string): boolean;
        /**
         * 判断当前控件是否类似于指定TAG组名称（即当前控件继承TAG组中任意控件）。
         * @param args tag名称
         */
        like(...args: string[]): boolean;
        /**
        * 判断当前宿主控件是否类似于指定TAG名称（即当前控件继承TAG组中任意控件）。
        * @param tag 名称
        */
        hostlike(tag: string): boolean;
        /**
         * 判断当前宿主控件是否类似于指定TAG组名称（即当前宿主控件继承TAG对应的控件）。
         * @param args tag名称
         */
        hostlike(...args: string[]): boolean;
        /**
         * 按照状态流程持续构建插件。
         * @param state 状态，不传的时候取控件当前状态。
         * @param falseStop 状态对应方法返回 false 时，是否终止执行。
         */
        flow(state?: number, falseStop?: true): void;
        /** 启动 */
        startup(): void;
        /** 编译控件（属性继承和方法继承） */
        compile(): void;
        /**
         * 释放插件。
         * @param deep 是否深度释放插件。深度释放时，插件内属性以及属性对象包含的属性都会被释放。
         */
        destroy(deep?: false): void;
    }

    /** 组件扩展 */
    interface V2ComponentExtentions<T> {
        /**
         * 定义属性(无参函数表示定义只读属性，且必须有返回值)
         * @param prop 属性名称。
         * @param descriptor 设置属性值的方法。
         */
        define<TValue = boolean | number | string | object>(prop: string, descriptor: (this: T, value?: TValue, oldValue?: TValue) => TValue | void): T;
        /**
         * 定义多个属性
         * @param map 属性对象
         */
        define(map: PlainObject<(this: T, ...args: any[]) => any>): T;
        /**
         * 定义属性
         * @param prop 属性名称
         * @param descriptor 属性描述
         */
        define(prop: string, descriptor: V2PropertyDescriptor<T>): T;
        /**
         * 定义多个属性
         * @param map 属性对象
         */
        define(map: PlainObject<V2PropertyDescriptor<T>>): T;
        /**
         * 定义属性
         * @param props 多个名称用空格分开。
         */
        define(props: string): T;
    }

    /** 组件 */
    interface V2Control<K = "*", T = V2ControlBase> extends V2Component<K>, V2ComponentExtend<K>, V2ControlStandard {
        /** 控件TAG */
        readonly tag: K;
        /** 控件声明空间 */
        readonly namespace: string;
        /** 基础 */
        readonly base: T;
        /** 流程图 */
        readonly flowGraph: PlainObject<number>;
        /** 宿主插件 */
        readonly host: V2Control;
        /** 所有子控件 */
        readonly controls: V2ControlCollection;
        /** 上一个控件 */
        readonly previousSibling: V2Control;
        /** 下一个控件 */
        readonly nextSibling: V2Control;
    }

    /** 继承组件 */
    interface V2ControlExtend<K = "*", N = K> extends V2Control<K, V2Component<N>> { }

    /** 流程 */
    interface FlowGraph<T extends V2ControlBase = V2ControlBase> { }

    /** 流程 */
    interface DefaultFlowGraph<T extends V2ControlBase = V2ControlBase> extends FlowGraph<T> {
        /** 设计 */
        design(): void | false;
        /**
        * 初始化控件（查询或 生产主元素）
        */
        init(): void | false;
        /** 
         *  构建 HTML 代码。
         *  @param view 视图。
         */
        build(view?: T["view"]): void | false;
        /**
         * 渲染控件
         * @param variable 控件全局变量
         */
        render(variable?: T["variable"]): void | false;
        /**
         * 建立属性监听。
         * @param watch 督查
         */
        usb(watch?: T["watch"]): void | false;
        /** 就绪 */
        ready(): void | false;
        /** 取数（仅 access 为真时，会自动调用） */
        ajax(): void | false;
        /**
         * 加载数据。
         * @param data 数据。
         */
        load(data?: T["data"]): void | false;
        /**
         * 完成提交（绑定用户交互事件）
         * @param variable 控件全局变量
         */
        commit(variable?: T["variable"]): void | false;
    }
}

/** 使用约定 */
declare namespace Use {
    /** 组件基类（可定义指定“tag”的“base”属性类型） */
    interface V2ControlBaseMap {
        [key: string]: Use.V2ControlBase;
    }

    /** 组件流程（可定义指定“tag”的控件流程） */
    interface FlowGraphMap<T> {
        [key: string]: Use.DefaultFlowGraph<T>;
    }

    /** 组件（可定义指定“tag”的提示控件） */
    interface V2ControlMap { }
}

/** 开发约定（添加含命名空间的组件） */
declare namespace Dev {
    /** 组件基类（可定义指定“tag”的“base”属性类型） */
    interface V2ControlBaseMap extends Use.V2ControlBaseMap {
        "input.textarea": V2ControlBaseMap["textarea"];
    }

    /** 组件（可定义指定“tag”的提示控件） */
    interface V2ControlMap extends Use.V2ControlMap {
        "input.textarea": V2ControlMap["textarea"];
    }
}

/** 定义控件基类方法 */
declare namespace Use {
    /** 基类 */
    interface V2ControlBaseMap {
        "input": InputBase;
        "textarea": InputBase;
        "select": SelectBase;
        "form": FormBase;
        "date-picker": DatePickerBase;
        "dropdown": DropdownBase;
        "pagingbar": PagingbarBase;
    }

    /** 输入框基类 */
    interface InputBase extends V2ControlBase {
        /**
         * 指定渲染的HTML TAG元素。
         * @param tag 元素TAG名称。
         */
        init(tag?: string): void | false;
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

    /** 日期选择框基类 */
    interface DatePickerBase extends V2ControlBase {
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
        /** 隐藏所有日期选择器 */
        hideAll(): void;
    }

    /** 选择框基类 */
    interface SelectBase extends V2ControlBase { }

    /** 表单基类 */
    interface FormBase extends V2ControlBase {
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

    /** 下拉菜单基类 */
    interface DropdownBase extends V2ControlBase { }

    /** 分页条基类 */
    interface PagingbarBase extends V2ControlBase { }
}

/** 默认支持的控件 */
declare namespace Use {
    /** 组件 */
    interface V2ControlMap {
        "button": Button;
        "wait": Wait;
        "modal": Modal;
    }

    /** 等待框 */
    interface Wait extends V2Control<"wait"> {
        /** 风格 */
        style: 1 | 2 | 3 | 4 | 5 | 6;
    }

    /** 按钮 */
    interface Button extends V2Control<"button"> {
        /** 小号（添加“btn-xs”样式） */
        xs: boolean;
        /** 中号（添加“btn-sm”样式） */
        sm: boolean;
        /** 大号（添加“btn-lg”样式）*/
        lg: boolean;
        /** 类型 */
        type: 'button' | 'submit' | 'reset';
        /** 按钮文字 */
        text: string;
        /** 内容 */
        html: string;
    }

    /** 模态框 */
    interface Modal extends V2Control<"modal"> {
        /** 小号（添加“modal-xs”样式）*/
        xs: boolean;
        /** 中号（添加“modal-sm”样式）*/
        sm: boolean;
        /** 大号（添加“modal-lg”样式）*/
        lg: boolean;
        /** 是否显示遮罩层 */
        backdrop: boolean;
        /** ESC 关闭 */
        keyboard: boolean;
        /** 标题 */
        title: string;
        /** 是否显示按钮 */
        showBtn: boolean;
        /** 是否显示确定按钮 */
        showOk: boolean;
        /** 是否显示取消 */
        showCancel: boolean;
        /** 是否显示关闭 */
        showClose: boolean;
        /** 按钮组 */
        buttons: Array<Button>;
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
    }

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
        readonly $: HTMLInputElement;
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
        /** 类型 */
        type: "text" | "number" | "tel" | "email" | "url" | "search" | "hidden" | "password" | "color" | "month" | "week" | "range" | "file";
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
        /** 类型 */
        type: "redio" | "checkbox";
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
        /** 类型 */
        type: "time" | "date" | "datetime" | "datetime-local";
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

    /** 多行输入框 */
    interface Textarea extends V2ControlExtend<"textarea", "input"> {
        /** 主元素 */
        readonly $: HTMLTextAreaElement;
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
        /** 类型 */
        type: "text" | "number" | "tel" | "email" | "url" | "search" | "hidden" | "password" | "color" | "month" | "week" | "range" | "file";
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
        data: any[] | PlainObject<any>;
        view: PlainObject<Input | Select | Textarea> | Array<Input | Select | Textarea | Array<Input | Select | Textarea>>;
    }

    /** 配置项 */
    interface DropdownOption extends PlainObject<boolean | number | string> {
        /** 显示文字 */
        text: string;
        /** 跳转地址 */
        href?: string;
    }

    /** 下拉菜单 */
    interface Dropdown extends V2Control<"dropdown"> {
        /** 
         *  方位 
         *  @default bottom
         */
        direction: "bottom" | "top";
        /** 自主 */
        independent: boolean;
        /** 数据(从“view”中分析提取) */
        readonly data: Array<DropdownOption>;
        /**
         * 视图
         * 说明：Boolean 代表分割线。
         *       String 代表标题。
         *       Object 代表项数据。
         *       Array 代码子菜单。
         */
        view: Array<boolean | string | DropdownOption | Array<boolean | string | DropdownOption>>;
        /** 当前选中项 */
        selectedIndex: number;
        /** 当前选中的配置 */
        readonly selectedOptions: DropdownOption;
    }

    /** 分页条 */
    interface Pagingbar extends V2Control<"pagingbar"> { }
}

/** 静态方法 */
declare namespace Use {

    /** 控件或基础方法 */
    interface V2kitStatic {
        /** 渲染控件 */
        <K extends keyof V2ControlMap>(tag: K, options?: V2ControlExtend<K>): V2ControlMap[K];
        /** 渲染控件 */
        <K extends string>(tag: K, options?: V2Control<K>): V2Control<K>;
        /** 控件原型 */
        readonly fn: V2ControlBase;
        /**
         * 获取对象数据类型
         * @param obj 需要识别的对象。
         * @returns {string} 返回对象的类型字符串。
         */
        type(obj: any): "boolean" | "number" | "string" | "date" | "array" | "function" | "regex" | "error" | "undefined" | "object";
        /**
         * 为对象定义属性
         * @param obj 对象
         * @param prop 属性名称
         * @param attributes 属性配置
         */
        define<T>(obj: T, prop: PropertyKey, attributes: PropertyDescriptor): T;
        /**
         * 定义只读或读写属性
         * @param obj 对象
         * @param prop 属性名称
         * @param writable 是否可写
         */
        define<T>(obj: T, prop: PropertyKey, writable: boolean): T;
        /**
         * 为对象定义多个属性
         * @param obj 对象
         * @param properties 属性集合
         */
        define<T>(obj: T, properties: PropertyDescriptorMap): T;
        /**
         * 设置只读属性
         * @param obj 对象
         * @param prop 属性名称
         * @param descriptor get 方法
         */
        define<T>(obj: T, prop: PropertyKey, descriptor: () => void): T;
        /**
         * 设置只写属性
         * @param obj 对象
         * @param prop 属性名称
         * @param descriptor set方法
         */
        define<T>(obj: T, prop: PropertyKey, descriptor: (value: any) => void): T;
        /**
         * 设置可读写属性
         * @param obj 对象
         * @param prop 属性名称
         * @param descriptor get 时参数“write”为假，否则为真。
         */
        define<T>(obj: T, prop: PropertyKey, descriptor: (value: any, write: boolean) => void): T;
    }

    interface ArrayThen<T = any> extends ArrayLike<T> {
        /**
         * 添加元素
         * @param item 元素
         */
        add(item: T): any;
        /**
         * 添加元素
         * @param arr 元素集合
         */
        add(arr: ArrayLike<T>): any;
        /**
         * 移除元素
         * @param item 元素
         * @returns 移除元素在集合中的位置，-1代表元素不在集合中，移除失败。
         */
        remove(item: T): number;
        /**
         * 过滤元素
         * @param callback 过滤函数
         */
        when(callback: (value: T, index: number, array: ArrayThen<T>) => boolean): ArrayThen<T>;
        /**
         * 映射新的集合
         * @param callback 映射函数
         */
        map<TResult>(callback: (value: T, index: number, array: ArrayThen<T>) => TResult | ArrayLike<TResult>): ArrayThen<TResult>;
        /**
         * 集合中元素依次执行函数
         * @param callback 函数（返回 false 时终止循环）
         */
        then(callback: (value: T, index: number, array: ArrayThen<T>) => any): ArrayThen<T>;
        /**
        * 集合中元素依次执行函数
        * @param callback 函数（返回 false 时终止循环）
        */
        done(callback: (value: T, index: number, array: ArrayThen<T>) => any): ArrayThen<T>;
        /**
        * 集合中元素依次执行函数
        * @param callback 函数（返回 false 时终止循环）
        */
        forEach(callback: (value: T, index: number, array: ArrayThen<T>) => any): ArrayThen<T>;
        /**
         * 获取指定位置的元素
         * @param index 位置：小于 0 时，取 this.length + index 的元素。
         */
        eq(index: number): T;
        /**
        * 获取指定位置的元素
        * @param index 位置：小于 0 时，取 this.length + index 的元素。
        */
        nth(index: number): T;
        /** 
         *  移除集合中所有元素 
         *  @param deep 为真时，将摧毁根数据，否则仅摧毁当前集合数据，
         */
        destroy(deep: ?boolean): void;
    }

    /** 数组或对象 */
    interface V2kitStatic {
        /**
         * 生成 ArrayThen 集合
         * @param args 元素集合
         */
        when<T>(args: ArrayLike<T>): ArrayThen<T>;
        /**
         * 生成 ArrayThen 集合
         * @param args 元素集合
         */
        when<T>(...args: T[]): ArrayThen<T>;
        /**
         * 合并集合
         * @param results 结果集合
         * @param arr 需要合并到 results 的集合
         */
        merge<T>(results: ArrayLike<T>, arr: ArrayLike<T>): ArrayLike<T>;
        /**
        * 判断数组是否包含任意元素
        * @param array 数组
        */
        any<T>(array: ArrayLike<T>): boolean;
        /**
         * 判断对象中是否包含任意元素
         * @param obj 对象
         */
        any<T>(obj: PlainObject<T>): boolean;
        /**
        * 判断数组中是否有值满足函数条件
        * @param array 数组
        * @param callback 条件函数
        * @param thisArg 条件函数中 this 对象
        */
        any<T>(array: ArrayLike<T>, callback: (value: T, index: number, array) => any, thisArg?: any): boolean;
        /**
         * 判断对象中是否有属性满足函数条件
         * @param obj 对象
         * @param callback 条件函数
         * @param thisArg 条件函数中 this 对象
         */
        any<T, K extends keyof T>(obj: T, callback: (value: T[K], propertyName: K, obj) => boolean, thisArg?: any): boolean;
        /**
        * 判断对象中是否都满足函数条件
        * @param array 数组
        */
        all<T>(array: ArrayLike<T>): boolean;
        /**
         * 判断对象中是否所有属性都满足函数条件
         * @param obj 对象
         */
        all<T>(obj: PlainObject<T>): boolean;
        /**
        * 判断对象中是否都满足函数条件
        * @param array 数组
        * @param callback 条件函数
        * @param thisArg 条件函数中 this 对象
        */
        all<T>(array: ArrayLike<T>, callback: (value: T, index: number, array) => any, thisArg?: any): boolean;
        /**
         * 判断对象中是否所有属性都满足函数条件
         * @param obj 对象
         * @param callback 条件函数
         * @param thisArg 条件函数中 this 对象
         */
        all<T, K extends keyof T>(obj: T, callback: (value: T[K], propertyName: K, obj) => boolean, thisArg?: any): boolean;
        /**
        * 遍历数组集合
        * @param array 数组
        * @param callback 函数（返回 false 时终止循环）
        * @param thisArg 函数中 this 对象
        */
        each<T>(array: ArrayLike<T>, callback: (value: T, index: number, array) => any, thisArg?: any): boolean;
        /**
         * 判断对象集合
         * @param obj 对象
         * @param callback 函数（返回 false 时终止循环）
         * @param thisArg 函数中 this 对象
         */
        each<T, K extends keyof T>(obj: T, callback: (value: T[K], propertyName: K, obj) => boolean, thisArg?: any): boolean;
    }

    /** 异常 */
    interface V2kitStatic {
        /**
         * 普通异常
         * @param message 异常消息
         */
        error(message?: string): Error;
        /**
         * 语法异常
         * @param message 异常消息
         */
        syntaxError(message?: string): SyntaxError | Error;
    }

    /** 命名法 */
    interface V2kitStatic {
        /**
         * 下划线隔开式 命名法
         * @param content 名称
         * @example v2.urlCase("urlCase") => "url_case"
         */
        urlCase(content: string): string;
        /**
         * 短横线隔开式 命名法
         * @param content 内容
         * @example v2.kebabCase("kebabCase") => "kebab-case"
         */
        kebabCase(content: string): string;
        /**
        * 驼峰 命名法
        * @param content 内容
        * @example v2.kebabCase("camel-case") => "camelCase"
        * @example v2.kebabCase("camel_case") => "camelCase"
        */
        camelCase(content: string): string;
        /**
         * 帕斯卡 命名法
         * @param content 内容
         * @example v2.kebabCase("pascalCase") => "PascalCase"
         * @example v2.kebabCase("pascal-case") => "PascalCase"
         * @example v2.kebabCase("pascal_case") => "PascalCase"
         */
        pascalCase(content: string): string;
    }

    /** 类型判断 */
    interface V2kitStatic {
        /**
         * 是否为空（类数组 length 为 0 也视为空）
         * @param obj 对象。
         */
        isEmpty(obj: any): boolean;
        /**
         * 是否为 Window
         * @param obj 对象
         */
        isWindow(obj: any): obj is Window;
        /**
         * 是否为数字，或是否可以转为有效数字。
         * @param obj 对象
         */
        isNumber(obj: any): boolean;
        /**
         * 是否为日期
         * @param obj 对象
         */
        isDate(obj: any): obj is Date;
        /**
         * 是否为字符串
         * @param obj 对象
         */
        isString(obj: any): obj is String;
        /**
         * 是否为函数
         * @param obj 对象
         */
        isFunction(obj: any): obj is Function;
        /**
         * 是否为空对象
         * @param obj 对象
         */
        isEmptyObject(obj: PlainObject): boolean;
        /**
         * 是否为类数组
         * @param obj 对象
         */
        isArraylike(obj: any): obj is ArrayLike<any>;
        /**
         * 是否为数组
         * @param obj 对象
         */
        isArray(obj: any): obj is Array<any>;
        /**
         * 是否为普通对象
         * @param obj 对象
         */
        isPlainObject(obj: any): obj is PlainObject<any>;
    }

    /** DOM 辅助 */
    interface V2kitStatic {
        /**
         * 查找当前DOM下满足指定选择器的第一个元素。
         * @param selectors 选择器
         */
        take(selectors: string): Element;
        /**
         * 查找指定上下文下满足指定选择器的第一个元素。
         * @param selectors 选择器
         * @param context 上下文
         */
        take(selectors: string, context: Element): Element;
        /**
         * 查找指定上下文下满足指定选择器的所有元素。
         * @param selectors 选择器
         * @param context 上下文
         * @param all 查找所有
         */
        take(selectors: string, context: Element, all: true): Element;
        /**
         * 指定元素是否满足自定选择器条件。
         * @param elem 元素
         * @param selectors 选择器
         */
        match(elem: Element, selectors: string): boolean;
        /**
         * 为指定元素注册订阅事件。
         * @param elem 元素
         * @param type 类型
         * @param listener 监听
         */
        subscribe<K extends keyof ElementEventMap>(elem: Element, type: K, listener: (this: Element, ev: ElementEventMap[K]) => any): void;
        /**
         * 为指定元素注册订阅事件。
         * @param elem 元素
         * @param type 类型
         * @param listener 监听
         */
        subscribe(elem: Element, type: string, listener: EventListener): void;
        /**
         * 为DOM注册订阅事件。
         * @param document DOM
         * @param type 类型
         * @param listener 监听
         */
        subscribe<K extends keyof DocumentEventMap>(document: Document, type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any): void;
        /**
        * 为DOM注册订阅事件。
        * @param document DOM
        * @param type 类型
        * @param listener 监听
        */
        subscribe(document: Document, type: string, listener: EventListener): void;
        /**
         * 取消指定元素订阅事件。
         * @param elem 元素
         * @param type 类型
         * @param listener 监听
         */
        unsubscribe<K extends keyof ElementEventMap>(elem: Element, type: K, listener: (this: Element, ev: ElementEventMap[K]) => any): void;
        /**
         * 取消指定元素订阅事件。
         * @param elem 元素
         * @param type 类型
         * @param listener 监听
         */
        unsubscribe(elem: Element, type: string, listener: EventListener): void;
        /**
         * 取消DOM订阅事件。
         * @param document DOM
         * @param type 类型
         * @param listener 监听
         */
        unsubscribe<K extends keyof DocumentEventMap>(document: Document, type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any): void;
        /**
        * 取消DOM订阅事件。
        * @param document DOM
        * @param type 类型
        * @param listener 监听
        */
        unsubscribe(document: Document, type: string, listener: EventListener): void;
        /**
         * 指定元素及在指定元素之后的兄弟元素集合。
         * @param elem 元素
         * @param excludeElem 排除的元素。
         */
        siblings(elem: Element, excludeElem?: Element): Array<Element>;
        /**
         * 指定节点的 dir 属性迭代的第一个元素。
         * @param node 节点
         * @param dir 属性路径
         * @param contains 节点本身是否可用。
         */
        sibling(node: Node, dir: string, contains?: boolean): Element;
        /**
        * 指定节点的 dir 属性迭代的所有元素。
        * @param node 节点
        * @param dir 属性路径
        * @param contains 节点本身是否可用。
        */
        dir(node: Node, dir: string, contains?: boolean): Array<Element>;
        /**
         * 判断指定节点是否包含在指定父节点中。
         * @param parentNode 父节点
         * @param node 节点
         */
        contains(parentNode: Node, node: Node): boolean;
    }

    /** 插件逻辑对象 */
    interface UseObject {
        /**
         * 设置过滤函数
         */
        filter(option: V2Control): boolean;
        /**
         * 满足过滤函数返回的对象。
         */
        option: PlainObject | Function;
    }

    /** 条件运用 */
    interface UseThen extends ArrayLike<UseObject> {
        /** TAG */
        readonly tag: string;
        /**
         * 添加始终需要的配置
         * @param option 配置
         */
        add(option: PlainObject | Function): PlainObject | Function;
        /** 始终需要的配置 */
        always(): PlainObject | Function;

        /**
         * 插件逻辑对象
         * @param filter 条件函数
         * @param option 配置
         */
        when(filter: (option: V2Control) => boolean, option: PlainObject | Function): void;
        /**
         * 返回插件逻辑对象中第一个满足过滤函数的配置。
         * @param option 控件
         */
        then(option: V2Control): PlainObject | Function;
    }

    /** 注册控件或获取控件配置 */
    interface V2kitStatic {
        /**
         * 全局控件收纳器
         * @param tag TAG
         */
        GDir<K extends keyof V2ControlMap>(tag: K): ArrayThen<V2ControlMap[K]>;
        /**
         * 全局控件收纳器
         * @param tag TAG
         */
        GDir<K extends string>(tag: K): ArrayThen<V2Control<K>>;
        /**
         * 指定控件是否已加载。
         * @param tag 控件
         */
        exists<K extends keyof V2ControlMap>(tag: K): boolean;
        /**
         * 指定控件是否已加载。
         * @param tag 控件
         */
        exists(tag: string): boolean;
        /**
         * 注册全局配置（将在所有组件中体现）
         * @param option 配置
         */
        use(option: V2Control): void;
        /**
         * 获取 TAG 配置
         * @param tag TAG
         */
        use(tag: string): UseThen;

        /**
        * 注册 TAG 始终需要的配置
        * @param tag TAG
        * @param option 配置
        */
        use<K extends keyof Dev.V2ControlMap>(tag: K, option: Dev.V2ControlMap[K]): void;
        /**
         * 注册 TAG 始终需要的配置
         * @param tag TAG
         * @param option 配置
         */
        use<K extends string>(tag: K, option: V2Control<K>): void;
        /**
        * 注册 TAG 始终需要的配置
        * @param tag TAG
        * @param option 配置
        */
        use<K extends keyof Dev.V2ControlMap>(tag: K, when: (option: Dev.V2ControlMap[K]) => boolean, option: Dev.V2ControlMap[K]): void;
        /**
         * 注册 TAG 条件配置
         * @param tag TAG
         * @param when 条件过滤函数
         * @param option 配置
         */
        use<K extends string>(tag: K, when: (option: V2Control<K>) => boolean, option: V2Control<K>);
        /**
        * 注册 TAG 始终需要的配置
        * @param tag TAG
        * @param when 条件过滤字符串 => new Function("vm", "try{  with(vm){ with(option) { return " + when + "; } } }catch(_){ return false; }")
        * @param option 配置
        */
        use<K extends keyof Dev.V2ControlMap>(tag: K, when: string, option: Dev.V2ControlMap[K]): void;
        /**
         * 注册 TAG 条件配置
         * @param tag TAG
         * @param when 条件过滤字符串 => new Function("vm", "try{  with(vm){ with(option) { return " + when + "; } } }catch(_){ return false; }")
         * @param option 配置
         */
        use<K extends string>(tag: K, when: string, option: V2Control<K>);
        /**
         * 注册 TAG 组件之前或之后处理一些事情。
         * @param tag TAG
         * @param resolve 解决方案
         */
        useMvc<K extends keyof Dev.V2ControlMap>(tag: K, resolve: () => Dev.V2ControlMap[K]): Dev.V2ControlMap[K];
        /**
         * 注册 TAG 组件之前或之后处理一些事情。
         * @param tag TAG
         * @param resolve 解决方案
         */
        useMvc<K extends string>(tag: K, resolve: () => V2Control<K>): V2Control<K>;
        /**
         * 控件路由
         * @param tag 当前控件TAG
         * @param when 条件过滤函数
         * @param route 新的控件TAG
         */
        route<K extends keyof Dev.V2ControlMap>(tag: K, when: (option: Dev.V2ControlMap[K]) => boolean, route: string): void;
        /**
         * 控件路由
         * @param tag 当前控件TAG
         * @param when 条件过滤函数
         * @param route 路由配置。
         */
        route<K extends keyof Dev.V2ControlMap>(tag: K, when: (option: Dev.V2ControlMap[K]) => boolean, route: (option: Dev.V2ControlMap[K]) => void): void;
        /**
         * 控件路由
         * @param tag 当前控件TAG
         * @param when 条件过滤函数
         * @param route 新的控件TAG
         */
        route<K extends string>(tag: K, when: (option: V2Control<K>) => boolean, route: string): void;
        /**
         * 控件路由
         * @param tag 当前控件TAG
         * @param when 条件过滤函数
         * @param route 路由配置。
         */
        route<K extends string>(tag: K, when: (option: V2Control<K>) => boolean, route: (option: V2Control<K>) => void): void;
    }

    /** 命名空间函数 */
    interface NamespaceCacheFunction<T, TOption> extends Function {
        /**
         * 获取命名空间缓存
         * @param name 类名
         */
        (name: string): T;
        /**
         * 设置命名空间缓存
         * @param namespace 命名空间
         * @param option 配置信息
         */
        (namespace: string, option: TOption, ...args: any[]): void;
        /**
         * 缓存中是否存在满足指定类名的缓存信息。
         * @param name 类名
         */
        exists(name: string): boolean;
    }

    /** 缓存 */
    interface V2kitStatic {
        /**
         * 生成映射函数（如果 name 时映射内容中独立的单词，则返回 true，否则 false。）
         * @param content 映射内容（空格分割）
         * @param ignoreCase 是否忽略大小写
         */
        makeMap(content: string, ignoreCase?: boolean): (name: string) => boolean;
        /**
         * 生成缓存（当 name 不在缓存中时，调用函数工厂生成，否则直接返回缓存数据。）
         * @param factory 函数工厂
         * @param ignoreCase 是否忽略大小写
         */
        makeCache<T>(factory: (name: string, ...args: any[]) => T, ignoreCase?: boolean): (name: string, ...args: any[]) => T;
        /**
         * 设置命名空间缓存
         * @param objectCreate 创建获取缓存对象
         * @param objectCallback 设置获取缓存的对象
         */
        namespaceCache<T, TOption>(objectCreate: (name: string) => T, objectCallback: (obj: T, option: TOption) => any): NamespaceCacheFunction<T, TOption>;
        /**
        * 设置命名空间缓存
        * @param readyCallback 在缓存数据时做一些事情
        * @param objectCreate 创建获取缓存对象
        * @param objectCallback 设置获取缓存的对象
        */
        namespaceCache<T, TOption, TReadyOption>(readyCallback: (source: TOption, option: TOption) => TReadyOption, objectCreate: (name: string) => T, objectCallback: (obj: T, option: TReadyOption) => any): NamespaceCacheFunction<T, TReadyOption>;
        /**
        * 设置命名空间缓存
        * @param initCallback
        * @param readyCallback 在缓存数据时做一些事情
        * @param objectCreate 创建获取缓存对象
        * @param objectCallback 设置获取缓存的对象
        */
        namespaceCache<T, TOption, TInitOption>(initCallback: (name: string) => TInitOption, readyCallback: (source: TInitOption, option: TOption) => TInitOption, objectCreate: (name: string) => T, objectCallback: (obj: T, option: TInitOption) => any): NamespaceCacheFunction<T, TInitOption>;
    }

    /** 注册通配符 */
    interface V2kitStatic {
        /**
         * 注册通配符
         * @param letter 符号
         * @param wildcard 通配符
         */
        useCards(letter: string, wildcard: WildCard): WildCard;
        /**
         * 批量注册通配符
         * @param wildcards 通配符集合
         */
        useCards(wildcards: PlainObject<WildCard>): PlainObject<WildCard>;

        /**
         * 注册 “*” 通配符
         * @param wildcards 通配符
         */
        useCards(exec: (control: V2Control, key: string, value: any) => any): WildCard;
    }

    /** 辅助方法 */
    interface V2kitStatic {
        /**
         * 二进制的方式遍历对象中值A, 满足 (A & type) === A 时调用函数。
         * @param typeCb 集合
         * @param type 枚举值
         * @param callback 函数
         */
        typeCb<T extends PlainObject<number>, K extends keyof T>(typeCb: T, type: number, callback: (name: K, type: T[K]) => any): any;

        /**
         * 记录日志
         * @param message 消息
         * @param type 枚举值【1~31】
         * @param logAll 为真的时候只要满足条件都记录，否则只记录首次。
         * @see var logCb = {
         *       debug: 16,
         *       error: 8,
         *       warn: 4,
         *       info: 2,
         *       log: 1
         *   };
         */
        log(message: string, type: number, logAll?: boolean): any;
    }
}

/** 开发 */
declare namespace Dev {

    /** 仅开发使用，请勿修改 */
    interface Develop<K = "*"> extends V2ControlMap {
        [key: string]: Use.V2Control<K>;
    }

    /** 对象组件(K是“{TAG}”) */
    interface V2ControlExtend<K = "*"> extends Use.V2ControlExtend<K> {
        /** requireJs 支持 */
        (option: V2ControlExtend<K>): V2ControlMap<K>[K];
    }
}

/** 辅助开发 */
interface Develop<K extends string> extends Dev.V2ControlExtend<K> { }

/** v2轻量库 */
declare const v2: Use.V2kitStatic;

/** 字符串 */
interface String {
    /**
     * 格式化字符串
     * @param args 格式化内容。
     */
    format(...args: any[]): string;
    /**
    * 格式化字符串
    * @param args 格式化内容。
    */
    format(args: ArrayLike<any>): string;
    /** 将文本转为DOM元素 */
    html(): Element | Text;
    /** 将字符串选择器转为 html 代码 */
    htmlCoding(): string;
    /**
     * 通过with关键字分析字符串中表达式，并加以计算。
     * @param json JSON
     */
    withCb(json: Use.PlainObject): string;
}

/** 元素拓展 */
interface Element {
    /**
     * 绑定事件
     * @param type 事件类型（如:click）
     * @param handle 事件
     */
    on<K extends keyof HTMLElementEventMap>(type: K, handle: (this: Element, e: HTMLElementEventMap[K]) => any): void;
    /**
     * 绑定事件
     * @param type 事件类型
     * @param handle 事件
     */
    on(type: string, handle: (this: Element, e: Event) => any): void;
    /**
     * 绑定事件
     * @param type 事件类型（如:click）
     * @param selector 选择器（触发元素满足选择器时触发事件）
     * @param handle 事件
     */
    on<K extends keyof HTMLElementEventMap>(type: K, selector: string, handle: (this: Element, e: HTMLElementEventMap[K]) => any): void;
    /**
     * 绑定事件
     * @param type 事件类型（如:click）
     * @param selector 选择器（触发元素满足选择器时触发事件）
     * @param handle 事件
     */
    on(type: string, selector: string, handle: (this: Element, e: Event) => any): void;
    /**
     * 解绑事件
     * @param type 事件类型（如:click）
     * @param handle 事件
     */
    off<K extends keyof HTMLElementEventMap>(type: K, handle: (this: Element, e: HTMLElementEventMap[K]) => any): void;
    /**
     * 解绑事件
     * @param type 事件类型（如:click）
     * @param handle 事件
     */
    off(type: string, handle: (this: Element, e: Event) => any): void;
    /**
     * 解绑事件
     * @param type 事件类型（如:click）
     * @param selector 选择器
     * @param handle 事件
     */
    off<K extends keyof HTMLElementEventMap>(type: K, selector: string, handle: (this: Element, e: HTMLElementEventMap[K]) => any): void;
    /**
     * 解绑事件
     * @param type 事件类型（如:click）
     * @param selector 选择器
     * @param handle 事件
     */
    off(type: string, selector: string, handle: (this: Element, e: Event) => any): void;
    /**
     * 查找当前元素下满足指定选择器的第一个元素。
     * @param selectors 选择器
     */
    take(selectors: string): Element;
    /**
     * 查找当前元素下满足指定选择器的所有元素。
     * @param selectors 选择器
     * @param all 查询所有
     */
    take(selectors: string, all: true): NodeListOf<Element>;
    /** 移除所有子节点 */
    empty(): Element;
    /**
     * 返回style属性值
     * @param name 属性名称
     */
    styleCb(name: string): string;
    /**
     * 设置style属性值
     * @param name 属性名称
     * @param value 属性值
     */
    styleCb(name: string, value: any): void;
    /**
     * 设置style属性值
     * @param nameMap 属性对象
     */
    styleCb(nameMap: Use.PlainObject): void;
    /**
     * 获取当前元素实际数据(并转为数字)
     * @param name 属性名称
     */
    css(name: string): number;
    /**
     * 获取当前元素实际数据(原样输出)
     * @param name 属性名称
     * @param same 是否保持原数据
     */
    css(name: string, same: true): string;
    /**
     * 获取当前元素实际数据(并转为数字)
     * @param names 属性名称集合
     */
    css(names: string[]): Use.PlainObject<number>;
    /**
     * 获取当前元素实际数据(原样输出)
     * @param names 属性名称
     * @param same 是否保持原数据
     */
    css(names: string[], same: true): Use.PlainObject<string>;
}
