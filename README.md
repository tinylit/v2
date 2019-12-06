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
