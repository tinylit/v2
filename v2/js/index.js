function initPage() {

    var select = document.getElementById("my-select");

    var x = select.selectedOptions;
    var y = "`${x?.cc?[0]}`".withCb({ x: { cc: { 0: [1, 2, 3] } } });
    var y = "`${for(var item<index> in x?.cc[0]){ return '第{{index}}个是{{item}};'; }}`".withCb({ x: { cc: { 0: [1, 2, 3] } } });
    var html = 'form.form>label.control-label[for="form-1-{name}"]>span.control-stamp{*}+span{{title??name}}'.htmlCoding();
}