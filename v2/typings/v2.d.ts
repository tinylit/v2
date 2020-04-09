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

    /** 普通组件(key是“{TAG}”) */
    interface PlainComponents extends PlainObject, V2ControlStandard { }

    /** 同步方法组件(key是“{TAG}”) */
    interface FunctionComponents extends PlainObject<(resolve: () => void) => void> { }

    /** 空基类 */
    interface V2EmptyBase { }

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
        create<K extends keyof V2ControlMap>(tag: K, options?: V2ControlMap[K]): V2ControlMap[K];
        /**
         * 渲染子控件
         * @param tag TAG
         * @param options 配置信息
         */
        create<K extends string>(tag: K, options?: ToDevelop<K>): ToDevelop<K>;
        /**
         * 渲染子控件
         * @param tag TAG
         * @param options 配置信息
         */
        create(options: PlainObject): V2ControlStandard;
        /**
         * 控件堆栈（控件会按照堆载顺序执行，当遇到异步加载的控件时，方法会被暂停，等待异步加载完成后继续执行。）
         * @param callback 回调函数
         */
        lazy<T extends Function>(callback: T): T;
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

    /** 类似控件 */
    interface V2Controllike extends PlainObject {
        tag?: string;
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
        /** 控件声明空间 */
        readonly namespace: string;
        /** 控件是否就绪 */
        readonly isReady: boolean;
        /** 已完成执行的流程状态 */
        readyState: number;
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
        /** 高度 */
        height: number | string;
        /** 宽度 */
        width: number | string;
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
        /** 监视器 */
        watch: PlainObject<Function>;
        /** 组件集合 */
        components: FunctionComponents | PlainComponents;
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

    /** 通配符 */
    interface WildCard<T extends V2ControlStandard = V2ControlStandard> {
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
        exec(control: T, key: string, value: any): any;
    }

    /** 控件组 */
    interface V2ControlCollection extends ArrayThen<V2ControlStandard> {
        <T extends V2ControlStandard>(...args: T[]): V2ControlCollection;
        /** 摧毁当前控件组中所有控件 */
        destroy(): number;
        /**
         * 获取基于【control】偏移【offset】索引次的控件。
         * @param control 控件。
         * @param offset 偏移量。
         */
        offset(control: V2Control, offset: number): V2Control;
    }

    /** 组件扩展 */
    // @ts-ignore
    interface V2ComponentExtention<TContext extends V2ControlStandard, T extends V2EmptyBase, TFlowGraph extends FlowGraph<TContext>> extends T, TFlowGraph { }

    /** 扩展组件 */
    interface V2ComponentExtend<K extends string, TContext extends V2ControlStandard> extends V2ComponentExtention<TContext, V2ControlBaseMap[K], FlowGraphMap<TContext>[K]>, V2ControlStandard { }

    /** 组件 */
    interface V2Component<T extends V2ControlStandard> {
        /** 事件集合 */
        events: PlainObject<(this: T, e: Event) => any>;
        /** 方法集合 */
        methods: PlainObject<(this: T, ...args: any[]) => any>;
        /** 通配符 */
        wildcards: PlainObject<WildCard>,
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
        /**
         * 定义属性(无参函数表示定义只读属性，且必须有返回值)
         * @param prop 属性名称。
         * @param descriptor 设置属性值的方法。
         * @param defineOnly 仅定义，不触发函数。
         */
        define<K extends keyof T>(prop: K, descriptor: (this: T, value?: T[K], oldValue?: T[K]) => T[K] | void, defineOnly?: true): T;
        /**
         * 定义多个属性
         * @param map 属性对象
         */
        define(map: PlainObject<(this: T, ...args: any[]) => any>, defineOnly?: true): T;
        /**
         * 定义属性
         * @param prop 属性名称
         * @param descriptor 属性描述
         * @param defineOnly 仅定义，不触发函数。
         */
        define(prop: string, descriptor: V2PropertyDescriptor<T>, defineOnly?: true): T;
        /**
         * 定义多个属性
         * @param map 属性对象
         * @param defineOnly 仅定义，不触发函数。
         */
        define(map: PlainObject<V2PropertyDescriptor<T>>, defineOnly?: true): T;
        /**
         * 定义属性
         * @param props 多个名称用空格分开。
         * @param defineOnly 仅定义，不触发函数。
         */
        define(props: string, defineOnly?: true): T;
    }

    /** 拓展 */
    interface V2Extend<K extends string, T extends V2ControlStandard> {
        /** TAG */
        readonly tag: K;
        /** 基础 */
        readonly base: V2ComponentExtend<K, T>;
    }

    /** 待开发控件扩展 */
    interface ToDevelopExtend<K extends string = "*", TContext extends V2ControlStandard = V2ControlMap[K]> extends V2Component<TContext>, V2ComponentExtention<TContext, V2EmptyBase, DefaultFlowGraph<TContext>> { }

    /** 已开发组件 */
    interface Develop<K extends string, TContext extends V2ControlStandard = V2ControlMap[K]> extends V2ControlExtend<K, K, TContext, TContext> { }

    /** 待开发的组件 */
    interface ToDevelop<K extends string = "*"> extends ToDevelopExtend<K> {
        /** TAG */
        readonly tag: K;
        /** 基础 */
        readonly base: V2ControlBase;
    }

    /** 组件 */
    interface V2Control<K extends string = "*", TContext extends V2ControlStandard = V2ControlMap[K]> extends V2Component<TContext>, V2ComponentExtend<K, TContext>, V2ControlStandard {
        /** TAG */
        readonly tag: K;
        /** 基础 */
        readonly base: V2ControlBase;
    }

    /** 有继承关系的组件【K】：当前控件TAG，【P】：父控件“TAG” */
    // @ts-ignore
    interface V2ControlExtend<K extends string, P extends string = K, TContext extends V2ControlStandard = V2ControlMap[K], THost extends V2ControlStandard = V2ControlMap[P]> extends V2Component<TContext>, V2Extend<K, THost>, V2ComponentExtend<K, TContext>, THost { }    // @ts-ignore

    /** 流程 */
    interface FlowGraph<T> { }

    /** 流程 */
    interface DefaultFlowGraph<T extends V2ControlStandard = V2ControlStandard> extends FlowGraph<T> {
        /** 设计 */
        design?: () => void | false;
        /**
        * 初始化控件（查询或 生产主元素）
        */
        init(): void | false;
        /** 
         *  构建 HTML 代码。
         *  @param view 视图。
         */
        build?: (view?: T["view"]) => void | false;
        /**
         * 渲染控件
         * @param variable 控件全局变量
         */
        render?: (variable?: T["variable"]) => void | false;
        /**
         * 建立属性监听。
         * @param watch 督查
         */
        usb?: (watch?: T["watch"]) => void | false;
        /** 就绪 */
        ready?: () => void | false;
        /** 取数（仅 access 为真时，会自动调用） */
        ajax?: () => void | false;
        /**
         * 加载数据。
         * @param data 数据。
         */
        load?: (data?: T["data"]) => void | false;
        /**
         * 完成提交（绑定用户交互事件）
         * @param variable 控件全局变量
         */
        commit?: (variable?: T["variable"]) => void | false;
    }
}

/** 静态方法 */
declare namespace Use {

    /** 控件或基础方法 */
    interface V2 {
        /** 渲染控件 */
        <K extends keyof V2ControlMap>(tag: K, options?: V2ControlMap[K]): V2ControlMap[K];
        /** 渲染控件 */
        <K extends string>(tag: K, options?: ToDevelop<K>): ToDevelop<K>;
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
        done(callback: (value: T, index: number, array: ArrayThen<T>) => any): void;
        /**
        * 集合中元素依次执行函数
        * @param callback 函数（返回 false 时终止循环）
        */
        forEach(callback: (value: T, index: number, array: ArrayThen<T>) => any): ArrayThen<T>;
        /**
        * 判断数组中是否有值满足函数条件
        * @param callback 条件函数
        */
        any(callback: (this: T, value: T, index?: number) => boolean): boolean;
        /**
        * 判断对象中是否都满足函数条件
        * @param callback 条件函数
        */
        all(callback: (this: T, value: T, index?: number) => boolean): boolean;
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
        /** 第一个元素 */
        first(): T;
        /**
        * 查找对象中第一个满足函数条件的元素。
        * @param callback 条件函数
        */
        first(callback: (this: T, value: T, index?: number) => boolean): T;
        /** 最后一个元素 */
        last(): T;
        /**
        * 查找对象中最后一个满足函数条件的元素。
        * @param callback 条件函数
        */
        last(callback: (this: T, value: T, index?: number) => boolean): T;
        /**
         * 求和
         * @param callback 返回数据。
         */
        sum(callback: (this: T, value: T, index?: number) => number): number;
        /**
         * 最大值
         * @param callback 返回数据。
         */
        max(callback: (this: T, value: T, index?: number) => number): number;
        /**
         * 最小值
         * @param callback 返回数据。
         */
        max(callback: (this: T, value: T, index?: number) => number): number;
        /**
         * 最小值
         * @param callback 返回数据。
         */
        avg(callback: (this: T, value: T, index?: number) => number): number;
    }

    /** 数组或对象 */
    interface V2 {
        /**
         * 对象继承。
         * @param callback 目标属性值和对象属性值分析。
         * @param target 目标对象。
         * @param obj 对象。
         */
        extension<T, U>(callback: <K1, K2>(targetPropertyValue: K1, objPropertyValue: K2) => K1 | K2 | void, target: T, obj: U): T & U;
        /**
         * 对象继承。
         * @param callback 目标属性值和对象属性值分析。
         * @param target 目标对象。
         * @param obj 对象。
         * @param obj2 对象2。
         */
        extension<T, U, V>(callback: <K1, K2>(targetPropertyValue: K1, objPropertyValue: K2) => K1 | K2 | void, target: T, obj: U, obj2: V): T & U & V;
        /**
         * 对象继承。
         * @param callback 目标属性值和对象属性值分析。
         * @param target 目标对象。
         * @param obj 对象。
         * @param objectN 对象组。
         */
        extension(callback: <K1, K2>(targetPropertyValue: K1, objPropertyValue: K2) => K1 | K2 | void, target: any, obj: any, objectN: any): any;
        /**
         * 对象继承。
         * @param callback 目标属性值和对象属性值分析。
         * @param deep 是否深度继承（深度继承是指当属性值为对象时，会递归执行对象的继承）。
         * @param target 目标对象。
         * @param obj 对象。
         */
        extension<T, U>(callback: <K1, K2>(targetPropertyValue: K1, objPropertyValue: K2) => K1 | K2 | void, deep: boolean, target: T, obj: U): T & U;
        /**
         * 对象继承。
         * @param callback 目标属性值和对象属性值分析。
         * @param deep 是否深度继承（深度继承是指当属性值为对象时，会递归执行对象的继承）。
         * @param target 目标对象。
         * @param obj 对象。
         * @param obj2 对象2。
         */
        extension<T, U, V>(callback: <K1, K2>(targetPropertyValue: K1, objPropertyValue: K2) => K1 | K2 | void, deep: boolean, target: T, obj: U, obj2: V): T & U & V;
        /**
         * 对象继承。
         * @param callback 目标属性值和对象属性值分析。
         * @param deep 是否深度继承（深度继承是指当属性值为对象时，会递归执行对象的继承）。
         * @param target 目标对象。
         * @param obj 对象。
         * @param objectN 对象组。
         */
        extension(callback: <K1, K2>(targetPropertyValue: K1, objPropertyValue: K2) => K1 | K2 | void, deep: boolean, target: any, obj: any, objectN: any): any;
        /**
         * 将指定对象继承到目标对象上，替换目标对象原属性值。
         * @param target 目标对象。
         * @param obj 对象。
         */
        extend<T, U>(target: T, obj: U): T & U;
        /**
         * 将指定对象继承到目标对象上，替换目标对象原属性值。
         * @param target 目标对象。
         * @param obj 对象。
         * @param obj2 对象2。
         */
        extend<T, U, V>(target: T, obj: U, obj2: V): T & U & V;
        /**
         * 将指定对象组继承到目标对象上，替换目标对象原属性值。
         * @param target 目标对象。
         * @param obj 对象。
         * @param objectN 对象组。
         */
        extend(target: any, obj: any, ...objectN: any): any;
        /**
         * 将指定对象继承到目标对象上，替换目标对象原属性值。
         * @param deep 是否深度继承（深度继承是指当属性值为对象时，会递归执行对象的继承）。
         * @param target 目标对象。
         * @param obj 对象。
         */
        extend<T, U>(deep: boolean, target: T, obj: U): T & U;
        /**
         * 将指定对象继承到目标对象上，替换目标对象原属性值。
         * @param deep 是否深度继承（深度继承是指当属性值为对象时，会递归执行对象的继承）。
         * @param target 目标对象。
         * @param obj 对象。
         * @param obj2 对象2。
         */
        extend<T, U, V>(deep: boolean, target: T, obj: U, obj2: V): T & U & V;
        /**
         * 将指定对象组继承到目标对象上，替换目标对象原属性值。
         * @param deep 是否深度继承（深度继承是指当属性值为对象时，会递归执行对象的继承）。
         * @param target 目标对象。
         * @param obj 对象。
         * @param objectN 对象组。
         */
        extend(deep: boolean, target: any, obj: any, ...objectN: any): any;
        /**
         * 将指定对象继承到目标对象上，保留目标对象的属性值。
         * @param target 目标对象。
         * @param obj 对象。
         */
        improve<T, U>(target: T, obj: U): T & U;
        /**
         * 将指定对象继承到目标对象上，保留目标对象的属性值。
         * @param target 目标对象。
         * @param obj 对象。
         * @param obj2 对象2。
         */
        improve<T, U, V>(target: T, obj: U, obj2: V): T & U & V;
        /**
         * 将指定对象继承到目标对象上，保留目标对象的属性值。
         * @param target 目标对象。
         * @param obj 对象。
         * @param objectN 对象组。
         */
        improve(target: any, obj: any, ...objectN: any): any;
        /**
         * 将指定对象继承到目标对象上，保留目标对象的属性值。
         * @param deep 是否深度继承（深度继承是指当属性值为对象时，会递归执行对象的继承）。
         * @param target 目标对象。
         * @param obj 对象。
         */
        improve<T, U>(deep: boolean, target: T, obj: U): T & U;
        /**
         * 将指定对象继承到目标对象上，保留目标对象的属性值。
         * @param deep 是否深度继承（深度继承是指当属性值为对象时，会递归执行对象的继承）。
         * @param target 目标对象。
         * @param obj 对象。
         * @param obj2 对象2。
         */
        improve<T, U, V>(deep: boolean, target: T, obj: U, obj2: V): T & U & V;
        /**
         * 将指定对象继承到目标对象上，保留目标对象的属性值。
         * @param deep 是否深度继承（深度继承是指当属性值为对象时，会递归执行对象的继承）。
         * @param target 目标对象。
         * @param obj 对象。
         * @param objectN 对象组。
         */
        improve(deep: boolean, target: any, obj: any, ...objectN: any): any;
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
        any<T>(array: ArrayLike<T>, callback: (value: T, index: number, array: ArrayLike<T>) => boolean, thisArg?: any): boolean;
        /**
         * 判断对象中是否有属性满足函数条件
         * @param obj 对象
         * @param callback 条件函数
         * @param thisArg 条件函数中 this 对象
         */
        any<T, K extends keyof T>(obj: T, callback: (value: T[K], propertyName: K, obj: T) => boolean, thisArg?: any): boolean;
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
        */
        all<T>(array: ArrayLike<T>, callback: (this: T, value: T, index?: number) => boolean): boolean;
        /**
        * 判断对象中是否都满足函数条件
        * @param array 数组
        * @param callback 条件函数
        * @param thisArg 条件函数中 this 对象
        */
        all<T, TContext>(array: ArrayLike<T>, callback: (this: TContext, value: T, index?: number) => boolean, thisArg: TContext): boolean;
        /**
         * 判断对象中是否所有属性都满足函数条件
         * @param obj 对象
         * @param callback 条件函数
         */
        all<T, K extends keyof T>(obj: T, callback: (this: T[K], value: T[K], propertyName?: K) => boolean): boolean;
        /**
         * 判断对象中是否所有属性都满足函数条件
         * @param obj 对象
         * @param callback 条件函数
         * @param thisArg 条件函数中 this 对象
         */
        all<T, K extends keyof T, TContext>(obj: T, callback: (this: TContext, value: T[K], propertyName?: K) => boolean, thisArg: TContext): boolean;
        /**
        * 查找对象中第一个满足函数条件的元素。
        * @param array 数组
        * @param callback 条件函数
        */
        find<T>(array: ArrayLike<T>, callback: (this: T, value: T, index?: number) => boolean): T | null;
        /**
        * 查找对象中第一个满足函数条件的元素。
        * @param array 数组
        * @param callback 条件函数
        * @param thisArg 条件函数中 this 对象
        */
        find<T, TContext>(array: ArrayLike<T>, callback: (this: TContext, value: T, index?: number) => boolean, thisArg: TContext): T | null;
        /**
         * 查找对象中第一个满足函数条件的元素。
         * @param obj 对象
         * @param callback 条件函数
         */
        find<T, K extends keyof T>(obj: T, callback: (this: T[K], value: T[K], propertyName?: K) => boolean): T | null;
        /**
         * 查找对象中第一个满足函数条件的元素。
         * @param obj 对象
         * @param callback 条件函数
         * @param thisArg 条件函数中 this 对象
         */
        find<T, K extends keyof T, TContext>(obj: T, callback: (this: TContext, value: T[K], propertyName?: K) => boolean, thisArg: TContext): T | null;
        /**
        * 查找对象中所有满足函数条件的元素。
        * @param array 数组
        * @param callback 条件函数
        */
        filter<T>(array: ArrayLike<T>, callback: (this: T, value: T, index?: number) => boolean): Array<T>;
        /**
        * 查找对象中所有满足函数条件的元素。
        * @param array 数组
        * @param callback 条件函数
        * @param thisArg 条件函数中 this 对象
        */
        filter<T, TContext>(array: ArrayLike<T>, callback: (this: TContext, value: T, index?: number) => boolean, thisArg: TContext): Array<T>;
        /**
         * 查找对象中所有满足函数条件的元素。
         * @param obj 对象
         * @param callback 条件函数
         */
        filter<T, K extends keyof T>(obj: T, callback: (this: T[K], value: T[K], propertyName?: K) => boolean): Array<T>;
        /**
         * 查找对象中所有满足函数条件的元素。
         * @param obj 对象
         * @param callback 条件函数
         * @param thisArg 条件函数中 this 对象
         */
        filter<T, K extends keyof T, TContext>(obj: T, callback: (this: TContext, value: T[K], propertyName?: K) => boolean, thisArg: TContext): Array<T>;
        /**
        * 遍历数组集合
        * @param array 数组
        * @param callback 函数（返回 false 时终止循环）
        * @param thisArg 函数中 this 对象
        */
        each<T>(array: ArrayLike<T>, callback: (this: T, value: T, index?: number) => boolean | void): void;
        /**
        * 遍历数组集合
        * @param array 数组
        * @param callback 函数（返回 false 时终止循环）
        * @param thisArg 函数中 this 对象
        */
        each<T, TContext>(array: ArrayLike<T>, callback: (this: TContext, value: T, index?: number) => boolean | void, thisArg: TContext): void;
        /**
         * 判断对象集合
         * @param obj 对象
         * @param callback 函数（返回 false 时终止循环）
         */
        each<T, K extends keyof T>(obj: T, callback: (this: T[K], value: T[K], propertyName?: K) => boolean | void): void;
        /**
         * 判断对象集合
         * @param obj 对象
         * @param callback 函数（返回 false 时终止循环）
         * @param thisArg 函数中 this 对象
         */
        each<T, K extends keyof T, TContext>(obj: T, callback: (this: TContext, value: T[K], propertyName?: K) => boolean | void, thisArg: TContext): void;
        /**
        * 遍历数组集合
        * @param array 数组
        * @param callback 函数
        */
        map<T, TResult>(array: ArrayLike<T>, callback: (this: T, value: T, index?: number) => TResult | ArrayLike<TResult>): Array<TResult>;
        /**
        * 遍历数组集合
        * @param array 数组
        * @param callback 函数
        * @param thisArg 函数中 this 对象
        */
        map<T, TResult, TContext>(array: ArrayLike<T>, callback: (this: TContext, value: T, index?: number) => TResult | ArrayLike<TResult>, thisArg: TContext): Array<TResult>;
        /**
         * 遍历数组集合
         * @param obj 对象
         * @param callback 函数
         */
        map<T, K extends keyof T, TResult>(obj: T, callback: (this: T[K], value: T[K], propertyName?: K) => TResult | ArrayLike<TResult>): Array<TResult>;
        /**
         * 遍历数组集合
         * @param obj 对象
         * @param callback 函数
         * @param thisArg 函数中 this 对象
         */
        map<T, K extends keyof T, TResult, TContext>(obj: T, callback: (this: TContext, value: T[K], propertyName?: K) => TResult | ArrayLike<TResult>, thisArg: TContext): Array<TResult>;
    }

    /** 异常 */
    interface V2 {
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
    interface V2 {
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
    interface V2 {
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
    interface V2 {
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
        take(selectors: string, context: Element, all: true): NodeListOf<Element>;
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
        filter(option: V2ControlStandard): boolean;
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
        when(filter: (option: V2ControlStandard) => boolean, option: PlainObject | Function): void;
        /**
         * 返回插件逻辑对象中第一个满足过滤函数的配置。
         * @param option 控件
         */
        then(option: V2ControlStandard): PlainObject | Function;
    }

    /** 注册控件或获取控件配置 */
    interface V2 {
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
        use<K extends string>(tag: K, option: ToDevelop<K>): void;
        /**
         * 注册全局配置（将在所有组件中体现）
         * @param option 配置
         */
        use(option: V2ControlStandard): void;
        /**
         * 获取 TAG 配置
         * @param tag TAG
         */
        use(tag: string): UseThen;
        /**
        * 注册 TAG 始终需要的配置
        * @param tag TAG
        * @param when 条件过滤字符串 => new Function("vm", "try{  with(vm){ with(option) { return " + when + "; } } }catch(_){ return false; }")
        * @param option 配置
        */
        use<K extends keyof Dev.V2ControlMap>(tag: K, when: string, option: Dev.V2ControlMap[K]): void;
        /**
        * 注册 TAG 始终需要的配置
        * @param tag TAG
        * @param when 过滤条件
        * @param option 配置
        */
        use<K extends keyof Dev.V2ControlMap>(tag: K, when: (option: Dev.V2ControlMap[K]) => boolean, option: Dev.V2ControlMap[K]): void;
        /**
         * 注册 TAG 条件配置
         * @param tag TAG
         * @param when 条件过滤函数
         * @param option 配置
         */
        use<K extends string>(tag: K, when: (option: V2Control<K>) => boolean, option: V2Control<K>): void;
        /**
         * 注册 TAG 条件配置
         * @param tag TAG
         * @param when 条件过滤字符串 => new Function("vm", "try{  with(vm){ with(option) { return " + when + "; } } }catch(_){ return false; }")
         * @param option 配置
         */
        use<K extends string>(tag: K, when: string, option: ToDevelop<K>): void;
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
        useMvc<K extends string>(tag: K, resolve: () => ToDevelop<K>): ToDevelop<K>;
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
        route<K extends string>(tag: K, when: (option: ToDevelop<K>) => boolean, route: string): void;
        /**
         * 控件路由
         * @param tag 当前控件TAG
         * @param when 条件过滤函数
         * @param route 路由配置。
         */
        route<K extends string>(tag: K, when: (option: ToDevelop<K>) => boolean, route: (option: ToDevelop<K>) => void): void;
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
    interface V2 {
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
    interface V2 {
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
        useCards(exec: (control: V2ControlStandard, key: string, value: any) => any): WildCard;
    }

    /** 辅助方法 */
    interface V2 {
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
        log(message: any, type: number, logAll?: boolean): void;
        /**
         * 获取对象属性的值（兼容处理）。
         * @param obj 对象
         * @param prop 属性名称
         */
        usb<T, K extends keyof T>(obj: T, prop: K): T[K];
        /**
         * 设置对象属性值（兼容处理）；
         * @param obj 对象
         * @param prop 属性名称
         * @param value 需要设置的属性值
         */
        usb<T, K extends keyof T, D extends T[K]>(obj: T, prop: K, value: D): void;
    }
}

/** 日期 */
declare namespace Use {
    interface V2 {
        /**
         * 是否为日期型。
         * @param obj 对象。
         */
        isDate(obj: any): obj is Date;
        /** 日期助手 */
        date: DateAssistant;
    }

    /** 日期助手 */
    interface DateAssistant {
        /** 获取当前日期 */
        (): Date;
        /** 
         *  将数据分析为日期类型，未知的类型返回当前日期。
         * @param dateLike 疑似日期。
         */
        (dateLike: Date | number | string | unknown): Date;
        /**
         * 是否为闰年。
         * @param year 年份。
         */
        isLeapYear(year: number): boolean;
        /** 返回当前月的第几天 */
        day(): number;
        /**
         * 返回指定日期所在月份的第几天。
         * @param dateLike 将数据分析为日期类型，未知的类型返回当前日期。
         */
        day(dateLike: Date | number | string | unknown): number;
        /** 今天是星期几 */
        dayOfWeek(): 1 | 2 | 3 | 4 | 5 | 6 | 7;
        /**
        * 指定日期是星期几。
        * @param dateLike 将数据分析为日期类型，未知的类型返回当前日期。
        */
        dayOfWeek(dateLike: Date | number | string | unknown): 1 | 2 | 3 | 4 | 5 | 6 | 7;
        /** 今天是今年的第几天 */
        dayOfYear(): number;
        /**
         * 指定日期是一年中的第几天。
         * @param dateLike 将数据分析为日期类型，未知的类型返回当前日期。
         */
        dayOfYear(dateLike: Date | number | string | unknown): number;
        /**
         * 指定日期月份，一共有多少天。 
         * @param date 日期。
         */
        dayCount(date: Date): number;
        /**
         * 指定年的指定月一共有多少天。
         * @param year 年份。
         * @param month 月份。
         */
        dayCount(year: number, month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12): number;
        /** 今天是本月的第几周 */
        week(): number;
        /**
         * 指定日期中，当前日期是指定日期月份的第几周。
         * @param dateLike 将数据分析为日期类型，未知的类型返回当前日期。
         */
        week(dateLike: Date | number | string | unknown): number;
        /** 今天是今年的第几周 */
        weekOfYear(): number;
        /**
         * 指定日期中，当前日期是指定日期年份的第几周。
         * @param dateLike 将数据分析为日期类型，未知的类型返回当前日期。
         */
        weekOfYear(dateLike: Date | number | string | unknown): number;
        /** 当前月份 */
        month(): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
        /**
         * 指定日期中月份。
         * @param dateLike 将数据分析为日期类型，未知的类型返回当前日期。
         */
        month(dateLike: Date | number | string | unknown): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
        /** 当前年份 */
        year(): number;
        /**
         * 指定日期中年份。
         * @param dateLike 将数据分析为日期类型，未知的类型返回当前日期。
         */
        year(dateLike: Date | number | string | unknown): number;
        /**
         * 按照指定格式生成字符串。
         * @param dateLike 将数据分析为日期类型，未知的类型返回当前日期。
         * @param fmt 格式化日期字符串，默认:yyyy-MM-dd。y:年，M:月，d:日，H:24小时制的时，h:12小时制的时，m:分，s:秒，f:毫秒。
         */
        format(dateLike?: Date | number | string | unknown, fmt?: string): string;
    }
}

/** 开发 */
declare namespace Dev {
    /** 开发者 */
    interface Develop<TContext extends Use.V2ControlStandard> {
        /** requireJs 支持 */
        (option: TContext): TContext;
    }
}

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
    /**
     * 指定元素是否满足自定选择器条件。
     * @param selectors 选择器
     */
    match(selectors: string): boolean;
    /**
     * 获取指定环境配置下，调用回调函数返回的值。
     * @param options 环境配置（在“style”属性中体现）。
     * @param callback 回调函数。
     * @param args 回调函数的参数。
     */
    swap<T>(options: Use.PlainObject, callback: (this: Element, ...args: any[]) => T, ...args: any[]): T;
}

/** ----------------------------------------------------------------------------------- 【约定及案例】 ---------------------------------------------------------------------------- */

declare namespace Use {
    /** 组件基类（可定义指定“tag”的“base”属性类型） */
    interface V2ControlBaseMap {
        [key: string]: V2EmptyBase;
    }

    /** 组件流程（可定义指定“tag”的控件流程） */
    interface FlowGraphMap<T extends V2ControlStandard> {
        [key: string]: DefaultFlowGraph<T>;
    }

    /** 组件（可定义指定“tag”的提示控件） */
    interface V2ControlMap {
        [key: string]: any;
    }
}

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
        /** 一次性的（关闭时会摧毁控件） */
        singleUse: boolean;
        /** 按钮组 */
        buttons: Array<Button>;
    }
}

/** ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/** 
 *  辅助开发 
 *  
 *  @example \/** @type Develop<"button"> *\/ var button; // 使用“button”时，将会出现“button”组件的相关语法提示。
 */
interface Develop<K extends string> extends Dev.Develop<Dev.V2ControlMap[K]> { }

/** v2轻量库 */
declare const v2: Use.V2;

