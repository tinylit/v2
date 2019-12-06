function initPage() {

    var select = document.getElementById("my-select");
    debugger;
    var x = select.selectedOptions;
    var y = "`${x?.cc?[0]}`".withCb({ x: { cc: { 0: [1, 2, 3] } } });
    var y = "`${for(var item<index> in x?.cc[0]){ return $'第{index}个是{item};'; }}`".withCb({ x: { cc: { 0: [1, 2, 3] } } });
    var html = 'form.form>label.control-label[for="form-1-name"]>span.control-stamp{*}+span{标题}'.htmlCoding();

    var str = "{0}是一个{2}的、基于{1}开发的前端框架。".format("v2", "流程", "轻量高效");
    // => v2是一个轻量高效的、基于流程开发的前端框架。
    var str2 = "{0}是一个{2}的、基于{1}开发的前端框架。".format(["v2", "流程", "轻量高效"]);
    // => v2是一个轻量高效的、基于流程开发的前端框架。

    var str = "{{name}}是一个`${description}`的、基于{{mode}}开发的前端框架。".withCb({ name: "v2", description: "轻量高效", mode: "流程" });
}