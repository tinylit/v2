declare namespace CN {
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
         * @param callback 回调函数。
         */
        waitSatck(callback: Function): V2Stack;
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

    /** 组件 */
    interface Components<T = any> extends PlainObject<T> { }

    /** 普通组件(key是“{TAG}”) */
    interface PlainComponents<T> extends Components<T> { }

    /** 对象组件(key是“{TAG}”) */
    interface ObjectComponents extends PlainComponents<any> { }

    /** 同步方法组件(key是“{TAG}”) */
    interface FunctionComponents extends PlainComponents<(tag: string, options: PlainObject) => any> { }

    /** 异步方法组件（key必须是“{TAG}.async”） */
    interface AsyncFunctionComponents extends PlainComponents<(resolve: () => any) => any> { }

    /** 控件基类（可以继承） */
    interface V2ControlBase {
		/**
         * 初始化控件（查询或 生产主元素）
         * @param tag 控件元素TAG，默认：div
         */
        init(tag?: string, tagName?: string): any;
        /**
         * 渲染控件
         * @param variable 入参变量
         */
        render(variable: PlainObject): any;
        /** 取数（无论同步还是异步，控件都将在取数完成后自动继续渲染控件） */
        ajax(): any;
        /** 解决(生成控件内容，处理控件复杂逻辑) */
        resolve(): any;
        /** 将控件属性和核心元素属性进行绑定 */
        usb(): any;
        /** 完成提交（绑定事件） */
        commit(): any;
        /**
         * 按照状态持续构建插件。
         * @param state 状态，不传的时候取控件当前状态。
         * @param falseStop 状态对应方法返回 false 时，是否终止执行。
         */
        switchCase(state?: number, falseStop?: true): any;
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
         * @param callback 回调函数
         */
        lazy<T>(callback: () => T, arg: any, ...args: any[]): (arg: any, ...args: any[]) => T;
    }

    /** 控件（不可继承） */
    interface V2Control extends V2ControlBase {
        /** 唯一身份标识 */
        readonly identity: number;
        /** 控件TAG */
        readonly tag: "*";
        /** 版本号 */
        readonly v2version: string;
        /** 基础 */
        readonly base: V2ControlBase | null;
        /**
         * 渲染子控件
         * @param tag TAG
         * @param options 配置信息
         */
        create(options: V2ControlExtends, tag?: string): V2ControlExtends;
        /** 启动 */
        startup(): any;
        /** 构建插件 */
        build(): any;
        /** 编译控件（属性继承和方法继承） */
        compile(): any;
        /**
         * 释放插件。
         * @param deep 是否深度释放插件。深度释放时，插件内属性以及属性对象包含的属性都会被释放。
         */
        destroy(deep?: boolean): any;
        /**
         * 定义属性
         * @param props 多个名称用空格分开。
         */
        define(props: string): V2ControlExtends;
        /**
         * 定义多个属性
         * @param value 属性对象
         */
        define(value: PlainObject): V2ControlExtends;
        /**
         * 定义属性
         * @param prop 属性名称
         * @param descriptor 属性描述
         */
        define(prop: string, descriptor: PlainObject): V2ControlExtends;
        /**
         * 定义属性（设置只读方法）
         * @param prop 属性名称。
         * @param descriptorGet 设置属性值的方法。
         */
        define(prop: string, descriptorGet: () => any): V2ControlExtends;
        /**
         * 定义属性（设置只写方法）
         * @param prop 属性名称。
         * @param descriptorSet 设置属性值的方法。
         */
        define(prop: string, descriptorSet: (value: any) => any): V2ControlExtends;
        /**
         * 定义属性（设置可读写方法）
         * @param prop 属性名称。
         * @param descriptorGetSet 设置属性值的方法。
         */
        define(prop: string, descriptorGetSet: (value: any, isWrite: boolean) => any): V2ControlExtends;
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
        exec(control: V2ControlExtends, key: string, value: any): any;
    }

    /** 控件*/
    interface V2ControlExtends extends V2Control {
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
        $: Element | null;
        /** 插件主元素的父元素 */
        $$: Element | null;
        /** 需求、要求 */
        demand: Element | null;
        /** 请求元素 */
        request: Element | null;
        /** 响应元素 */
        response: Element | null;
        /** 宿主插件 */
        host: V2Control | null;
        /** 样式 */
        class: String | null;
        /** 变量 */
        variable: PlainObject<any>;
        /** 插件数据 */
        data: any;
        /** 视图渲染 */
        view: any;
        /** 监控数据变化，数据变化时，调用指定方法 */
        watch: PlainObject<Function> | null,
        /** 事件集合 */
        events: PlainObject<PlainEvent> | null;
        /** 方法集合 */
        methods: PlainObject<PlainMethod> | null;
        /** 通配符 */
        wildcards: PlainObject<WildCard> | null,
        /** 组件集合 */
        components: Components | null;
        /** 使控件获取焦点 */
        focus(): any;
        /** 显示控件 */
        show(): any;
        /** 隐藏控件 */
        hide(): any;
        /** 反转当前控件显示/隐藏状态 */
        toggle(): any;
        /**
         * 隐藏或显示控件
         * @param toggle 为true时显示控件，否则隐藏控件
         */
        toggle(toggle: boolean): any;
    }
}

declare namespace CN {

    /** 控件或基础方法 */
    interface V2kitStatic {
        /** 渲染控件 */
        (tag: string, options?: V2ControlExtends): V2ControlExtends;
        /** 控件原型 */
        readonly fn: V2ControlExtends;

        /**
         * 获取对象数据类型
         * @param obj 需要识别的对象。
         * @returns {String} 返回对象的类型字符串。
         */
        type(obj: any): typeof obj;
        /**
         * 为对象定义属性
         * @param obj 对象
         * @param prop 属性名称
         * @param attributes 属性配置
         */
        define(obj: any, prop: PropertyKey, attributes: PropertyDescriptor): any;
        /**
         * 定义只读或读写属性
         * @param obj 对象
         * @param prop 属性名称
         * @param writable 是否可写
         */
        define(obj: any, prop: PropertyKey, writable: boolean): any;
        /**
         * 为对象定义多个属性
         * @param obj 对象
         * @param properties 属性集合
         */
        define(obj: any, properties: PropertyDescriptorMap): any;
        /**
         * 设置只读属性
         * @param obj 对象
         * @param prop 属性名称
         * @param descriptor get 方法
         */
        define(obj: any, prop: PropertyKey, descriptor: () => any): any;
        /**
         * 设置只写属性
         * @param obj 对象
         * @param prop 属性名称
         * @param descriptor set方法
         */
        define(obj: any, prop: PropertyKey, descriptor: (value: any) => any): any;
        /**
         * 设置可读写属性
         * @param obj 对象
         * @param prop 属性名称
         * @param descriptor get 时参数“write”为假，否则为真。
         */
        define(obj: any, prop: PropertyKey, descriptor: (value: any, write: boolean) => any): any;
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
        forEach(callback: (value: T, index: number, array: ArrayThen<T>) => any): ArrayThen<T>;
        /**
         * 获取指定位置的元素
         * @param index 位置：小于 0 时，取 this.length + index 的元素。
         */
        eq(index: number): T | null;
        /**
        * 获取指定位置的元素
        * @param index 位置：小于 0 时，取 this.length + index 的元素。
        */
        nth(index: number): T | null;
        /** 移除集合中所有元素 */
        destroy(): number;
    }

    /** 数组或对象 */
    interface V2kitStatic {
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
        any<T, TArray extends ArrayLike<T>>(array: TArray, callback: (value: T, index: number, array) => any, thisArg?: any): boolean;
        /**
         * 判断对象中是否有属性满足函数条件
         * @param obj 对象
         * @param callback 条件函数
         * @param thisArg 条件函数中 this 对象
         */
        any<T, K extends keyof T>(obj: T, callback: (value: T[K], propertyName: K, obj) => boolean, thisArg?: any): boolean;
        /**
        * 遍历数组集合
        * @param array 数组
        * @param callback 函数（返回 false 时终止循环）
        * @param thisArg 函数中 this 对象
        */
        each<T, TArray extends ArrayLike<T>>(array: TArray, callback: (value: T, index: number, array) => any, thisArg?: any): boolean;
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
        sibling(node: Node, dir: string, contains?: boolean): Element | null;
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
        filter(option: V2ControlExtends): boolean;
        /**
         * 满足过滤函数返回的对象。
         */
        option: PlainObject | Function;
    }

    interface UseThen extends ArrayLike<UseObject> {
        /** TAG */
        readonly tag: string;
        /**
         * 添加始终需要的配置
         * @param option 配置
         */
        add(option: PlainObject | Function): PlainObject | Function;
        /** 始终需要的配置 */
        always(): PlainObject | Function | null;

        /**
         * 插件逻辑对象
         * @param filter 条件函数
         * @param option 配置
         */
        when(filter: (option: V2ControlExtends) => boolean, option: PlainObject | Function): any;
        /**
         * 返回插件逻辑对象中第一个满足过滤函数的配置。
         * @param option 控件
         */
        then(option: V2ControlExtends): PlainObject | Function | null;
    }

    /** 注册控件或获取控件配置 */
    interface V2kitStatic {
        /**
         * 注册全局配置（将在所有组件中体现）
         * @param option 配置
         */
        use(option: PlainObject): any;
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
        use(tag: string, option: PlainObject): any;
        /**
         * 注册 TAG 条件配置
         * @param tag TAG
         * @param when 条件过滤函数
         * @param option 配置
         */
        use(tag: string, when: (option: V2ControlExtends) => boolean, option: PlainObject);
        /**
         * 注册 TAG 组件之前或之后处理一些事情。
         * @param tag TAG
         * @param resolve 解决方案
         */
        useMvc(tag: string, resolve: (tag: string) => UseThen): any;
    }

    /** 命名空间函数 */
    interface NamespaceCacheFunction<T, TOption> extends Function {
        /**
         * 获取命名空间缓存
         * @param this 函数
         * @param thisArg 函数的 this 对象。
         * @param name 类名
         */
        call(this: Function, thisArg: any, name: string): T;
        /**
         * 设置命名空间缓存
         * @param this 函数
         * @param thisArg 函数的 this 对象。
         * @param name 类名
         * @param option 配置信息
         */
        call(this: Function, thisArg: any, name: string, option: TOption, ...args: any[]): void;
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
        namespaceCache<T, TOption, TReadyOption>(readyCallback: (source: TOption, option: TOption) => TReadyOption | null, objectCreate: (name: string) => T, objectCallback: (obj: T, option: TReadyOption) => any): NamespaceCacheFunction<T, TReadyOption>;
        /**
        * 设置命名空间缓存
        * @param initCallback
        * @param readyCallback 在缓存数据时做一些事情
        * @param objectCreate 创建获取缓存对象
        * @param objectCallback 设置获取缓存的对象
        */
        namespaceCache<T, TOption, TInitOption>(initCallback: (name: string) => TInitOption, readyCallback: (source: TInitOption, option: TOption) => TInitOption | null, objectCreate: (name: string) => T, objectCallback: (obj: T, option: TInitOption) => any): NamespaceCacheFunction<T, TInitOption>;
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
        useCards(exec: (control: V2ControlExtends, key: string, value: any) => any): WildCard;
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
         * @param type 枚举值
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

declare const v2: UG.V2kitStatic;
declare const v2kit: UG.V2kitStatic;

/** 字符串 */
interface String {
    /** 将文本转为DOM元素 */
    html(): Element | Text;
    /** 将字符串选择器转为 html 代码 */
    htmlCoding(): string;
}

/** 元素拓展 */
interface Element {
    /**
     * 绑定事件
     * @param type 事件类型（如:click）
     * @param handle 事件
     */
    on(type: string, handle: Function): any;
    /**
     * 绑定事件
     * @param type 事件类型（如:click）
     * @param selector 选择器（触发元素满足选择器时触发事件）
     * @param handle 事件
     */
    on(type: string, selector: string, handle: Function): any;
    /**
     * 解绑事件
     * @param type 事件类型（如:click）
     * @param handle 事件
     */
    off(type: string, handle: Function): any;
    /**
     * 解绑事件
     * @param type 事件类型（如:click）
     * @param selector 选择器
     * @param handle 事件
     */
    off(type: string, selector: string, handle: Function): any;
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
    styleCb(name: string, value: any): any;
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
}
