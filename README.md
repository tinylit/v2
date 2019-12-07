# V2

> A valuable technology object.


# 使用说明

## 格式化字符串（一）
> ##### 直接使用字符串“.”方法的方式格式化字符串。
---
    String.format(...args：any[]) 或  String.format(arg:ArrayLike); 或  String.format(arg:any);
----

#### 格式化标准：\{N\}
    说明：`N`代表参数索引下标。

#### 用例:
``` js
    var x = "{0}是一个{2}的、基于{1}开发的前端框架。".format("v2","流程","轻量高效");
    // => v2是一个轻量高效的、基于流程开发的前端框架。
    var y = "{0}是一个{2}的、基于{1}开发的前端框架。".format(["v2","流程","轻量高效"]);
    // => v2是一个轻量高效的、基于流程开发的前端框架。
```

## 格式化字符串（二）
> ##### 直接使用字符串“.”方法的方式格式化字符串。
>> 将对象和字符串做关系映射。

---
    String.withCb(obj:Object);
----
#### 格式化标准：① \`$\{Expression\}\` 或 ② \{\{Expression\}\}

说明: Expression 是参数JSON的属性或属性运算。表达式支持“?.”的`非空试探符`。支持`三目合并运算符`，符号"?"和"!"出现一次或两次；

注：仅表达式 ① 支持 if/else/for 以及`$`编译符（$"{SimpleExpression}"，表达式【SimpleExpression】会被计算）；

+ 非空试探符:
  * x?.y 表示 x 为 **NULL** 时，返回 x ，否则返回 x.y 的值。
  
+ 三目合并运算符:
  * \{x?y\} 表示 x 为 **真** 时，返回 y 的值，否则表达式返回空字符串。
  * \{x!y\} 表示 x 为 **假** 时，返回 y 的值，否则表达式返回空字符串。
  * \{x??y\} 表示 x 为 **NULL** 时，返回 y 的值，否则返回 x 的值。 
  * \{x?!y\} 表示 x 为 **真** 或 y 为 **假** 时，返回 x 的值，否则返回 y 的值。
  * \{x!?y\} 表示 x 为 **假** 或 y 为 **真** 时，返回 x 的值，否则返回 y 的值。
  * \{x!!y\} 表示 x 为 **假** 或 y 为 **假** 时，返回 x 的值，否则返回 y 的值。

#### 用例:
``` js
    var x = "{{name}}是一个`${description}`的、基于{{mode}}开发的前端框架。".withCb({ name: "v2", description: "轻量高效", mode: "流程" });
    // => v2是一个轻量高效的、基于流程开发的前端框架。
    var y = "`${for(var item<index> in x?.cc[0]){ return $'第{index}个是{item};'; }}`".withCb({ x: { cc: { 0: [1, 2, 3] } } });
    // => 第0个是1;第1个是2;第2个是3;
```

#### HTML转码。
> ##### 直接使用字符串“.”方法的方式将字符串转为**HTML**字符串。
---
    String.htmlCoding();
----

说明：语法请参照 **ZenCoding** 或 **Emmet**。

#### 用例:
``` js
    var html = 'form.form>label.control-label[for="form-1-name"]>span.control-stamp{*}+span{标题}'.htmlCoding();
    // => <form class="form"><label class="control-label" for="form-1-name"><span class="control-stamp">*</span><span>标题</span></label></form>
```

#### 控件使用。
> ##### 注册控件。
---
    v2.use(tag:string,option:Object);
----

* 可使用 **v2(tag:string[,option:Object]):V2Contrl** 即可使用配置的控件。
* 可使用 **v2.useMap(tag:string,flowGraph:Object):void** 配置程序运行流程。
* 默认运行流程。
    + 构造函数：定义控件属性。
    + design：设计和规划程序运行中需要使用的属性。
    + init：初始化，生成主控件。
    + build：生成HTML代码。
    + render：渲染HTML。
    + usb：定义属性监听。
    + ready：控件加载就绪。
    + ajax：异步请求数据（仅 **access** 为 **真** 时，有 **ajax** 流程）。
    + load：加载页面数据。
    + commit：绑定页面交互事件。
* 可覆盖 **v2.useMvc(tag:string,resolve:()=>V2Control):V2Control** 方法，添加控件执行前或执行后处理逻辑。
* 可使用 **v2.route(tag:string,route-tag:string):void** 将“tag”控件使用“route-tag”控件实现。
* 可使用 **v2.use(option:Object)** 注册所有控件的默认属性或方法。
* 可使用 **v2.useCards(letter:char,{type:string,exec:(control:V2Contrl,value:V2Contrl[K],key:K)=>any})**定义更多通配符。 通配符（在方法名称前加上指定符号，程序运行时，参数中相同属性名称的属性值满足通配符条件时，将通配符指定方法）。
    + ? 当值为 **\{boolean\}** 时，执行方法。
    + % 当值为 **\{number\}** 时，执行方法。
    + " 或 ' 当值为 **\{string\}** 时，执行方法。
    + < 当值为 **\{Date\}** 时，执行方法。
    + [ 当值为 **\{Array\}** 时，执行方法。
    + / 当值为 **\{Regex\}** 时，执行方法。
    + \* 始终执行方法。
    + 还支持“&”，“!”，“.”，“{”，“#”等通配符。
* 支持依赖注入。
    
#### 用例:
``` js
    // 定义。
    v2.use('wait', {
        wait: function () { // 构造函数生成控件时调用。
            /** 风格 */
            this.style = 1;
        },
        "render(style)": function (style) { // 依赖注入【style】属性。
            if(style === this.style){
                this.$.classList.add('wait');
            }
        },
        build: function () {
            this.$backdrop = this.$.appendChild(".wait-backdrop".htmlCoding().html());
            this.$wait = this.$.appendChild(".wait-reveal>.shape.shape$*4".htmlCoding().html());
        },
        usb: function () {
            this.base.usb();
            this.define("style", function (style, oldStyle) {
                this.$wait.classList.remove('animation-' + oldStyle);
                this.$wait.classList.add('animation-' + style);
            });
        }
    });

    // 使用。
    var wait = v2("wait", { style: 2 });
```

#### 动态生成的HTML:

``` html
    <div class="wait">
        <div class="wait-backdrop"></div>
        <div class="wait-reveal animation-6">
            <div class="shape shape1"></div>
            <div class="shape shape2"></div>
            <div class="shape shape3"></div>
            <div class="shape shape4"></div>
        </div>
    </div>
```
