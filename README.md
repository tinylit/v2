# V2
 
>[![Build Status](https://travis-ci.org/cocsharp/v2.svg?branch=master)](https://travis-ci.org/cocsharp/v2) [![Gitter](https://badges.gitter.im/v2-gitter/community.svg)](https://gitter.im/v2-gitter/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
>
> A valuable technology object.


# 使用说明

## 格式化字符串（一）
> ##### 直接使用字符串“.”方法的方式格式化字符串。
---
    String.format(...args) 或  String.format([...args]); 或  String.format(arg);
----

参考解说：[Blog](https://www.cnblogs.com/vbing/p/10048351.html "format")


## 格式化字符串（二）
> ##### 直接使用字符串“.”方法的方式格式化字符串。
>> 将对象和字符串做关系映射。

---
    String.withCb({JSON},|Boolean|?)
----

参考解说：[Blog](https://www.cnblogs.com/vbing/p/10048901.html "withCb")

# 格式化字符串（三）
> #### 直接使用字符串“.”方法的方式格式化字符串。
>> 字符串增加`ifCb`方法，使用判断的方式格式化字符串。

---
    String.ifCb({JSON},|Boolean|?)
----

参考解说：[Blog](https://www.cnblogs.com/vbing/p/10050075.html "ifCb")

# 格式化字符串（四）
> #### 直接使用字符串“.”方法的方式格式化字符串。
>> 字符串增加`forCb`方法，使用遍历的方式格式化字符串。

---
    String.forCb({Array|JSON},|Boolean|?)
----

参考解说：[Blog](https://www.cnblogs.com/vbing/p/10050240.html "forCb")

# 格式化字符串（五）
> #### 直接使用字符串“.”方法的方式格式化字符串。
>> 将对象和字符串做关系映射并进行运算。

---
    String.compileCb({Array|JSON},|Boolean|?)
----

参考解说：[Blog](https://www.cnblogs.com/vbing/p/10321024.html "compileCb")