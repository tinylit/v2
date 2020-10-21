(function (factory) {
    return typeof define === 'function' ?
        define(['v2'], factory) :
        typeof module === 'object' && module.exports ?
            module.exports = function (root, v2) {
                if (typeof v2 === 'undefined') {
                    if (typeof window === 'undefined') {
                        v2 = require('v2')(root);
                    }
                    else {
                        v2 = require('v2');
                    }
                }
                return factory(v2);
            } :
            factory(v2);
}(function (/** @type Use.V2 */v2) {
    var GLOBAL_SEARCH = location.search;

    if (GLOBAL_SEARCH === undefined) {
        var href = location.href;
        var indexOfQuestion = href.indexOf('?');
        if (indexOfQuestion > -1) {
            var indexOfHash = href.indexOf('#');
            if (indexOfHash > -1) {
                GLOBAL_SEARCH = href.substring(indexOfQuestion, indexOfHash);
            } else {
                GLOBAL_SEARCH = href.substring(indexOfQuestion);
            }
        } else {
            GLOBAL_SEARCH = "";
        }
    }

    function GetText(node) {
        if (typeof node.textContent === "string") {
            return node.textContent;
        }

        if (node.nodeType === 3) {
            return node.nodeValue;
        }

        var text = "";

        if (node.nodeType === 1) {
            for (node = node.firstChild; node; node = node.nextSibling) {
                text += GetText(node);
            }
        }

        return text;
    }

    v2.use('layout', {
        components: {
            input: function (resovle) {
                require(['components/v2.input'], resovle);
            },
            dropdown: function (resovle) {
                require(['components/v2.dropdown'], resovle);
            }
        },
        layout: function () {
            /** 用户名称 */
            this.userName = "管理员";

            /** 用户头像 */
            this.userAvatar = "images/faces/face5.jpg";

            /** 显示搜索 */
            this.search = true;

            /** 搜索去除空格 */
            this.trimOnSearch = true;

            /** 默认页 */
            this.indexUrl = "/views/index";

            /** 工具 */
            this.tools = [];

            /** 消息 */
            this.messages = [];

            /** 通知 */
            this.notifies = [];
        },
        design: function () {
            this.defaultVisible = false;
        },
        build: function (view) {
            var vm = this;

            this.$$.classList.add('lyt');
            this.$.classList.add('container-scroller');

            this.$.appendChild('(.navbar>(.navbar-brand-wrapper>.navbar-brand-inner-wrapper>(a.navbar-brand.brand-logo>img[src="images/logo.svg"])+(a.navbar-brand.brand-logo-mini>img[src="images/logo-mini.svg"])+(button.navbar-toggler.visible-lg-block.visible-md-block[type="button"][data-toggle="minimize"]>i.glyphicon.glyphicon-th-list)+.clearfix)+.navbar-menu-wrapper>.nav-wrapper>.nav-main-wrapper>(.nav-search-wrapper>.nav-search.visible-lg.visible-md)+(button.navbar-toggler.navbar-toggler-right.pull-right.visible-sm-block.visible-xs-block[type="button"][data-toggle="offcanvas"]>i.glyphicon.glyphicon-th-list)+(.nav-profile-wrapper>ul.navbar-nav.navbar-nav-right>(li.nav-item.dropdown.messages>a.nav-link.count-indicator.dropdown-toggle[href="#"][data-toggle="dropdown"]>i.glyphicon.glyphicon-envelope)+(li.nav-item.dropdown.notifies>a.nav-link.count-indicator.dropdown-toggle.notification-dropdown[href="#"][data-toggle="dropdown"]>i.glyphicon.glyphicon-bell)+li.nav-item.nav-profile.dropdown>(a.nav-link.dropdown-toggle[href="#"][data-toggle="dropdown"]>img[src="{{userAvatar}}"]+span.nav-profile-name{{{userName}}})+ul.dropdown-menu.dropdown-menu-right.navbar-dropdown)+.clearfix)+.container-fluid.page-body-wrapper>#sidebar_{{identity}}.sidebar.sidebar-offcanvas+.main-panel>.content-wrapper>(.main-nav>ul)+.main-body>ul'.withCb(this).htmlCoding().html());

            this.$sidebar = this.take("#sidebar_" + this.identity);

            this.$search = this.take('.nav-search');

            if (this.search) {
                this.$inputGroup = this.$search.appendChild('.input-group>.input-group-prepend>span.input-group-text>i.glyphicon.glyphicon-search'.htmlCoding().html());

                this.$input = this.create('input', {
                    $$: this.$inputGroup,
                    placeholder: "Search now",
                    trim: this.trimOnSearch,
                    methods: {
                        "input-change": function (value) {
                            vm.query(value);
                        },
                        "keyboard-enter": function () {
                            vm.query(this.value);
                        }
                    }
                });
            }

            this.$profileWrapper = this.take('.nav-profile-wrapper');

            this.$tools = this.take('.nav-profile > .dropdown-menu', this.$profileWrapper);

            this.$navUl = this.take('.main-nav>ul');

            this.$bodyUl = this.take('.main-body>ul');

            this.$messages = this.take('.messages', this.$profileWrapper);

            this.$notifies = this.take('.notifies', this.$profileWrappe);

            this.tool(view);
        },
        render: function () {
            var g_hash,
                vm = this,
                _onhashchange = window.onhashchange = document.body.onhashchange,
                onhashchange = function () {
                    if (_onhashchange) {
                        _onhashchange.apply(this, Array.prototype.slice.call(arguments, 0));
                    }
                    var hash = location.hash;
                    if (hash == null) {
                        var href = location.href;

                        var index = href.indexOf('#');

                        if (index > -1) {
                            hash = href.substring(index);
                        }
                    }
                    if (!hash || hash === g_hash) {
                        return;
                    }

                    var node = vm.take('[href="' + hash + '"]', vm.$sidebar);

                    if (!node) {
                        return;
                    }

                    g_hash = hash;

                    var title = GetText(node);

                    vm.tab(title, hash, true, true);
                };
            window.onhashchange = document.body.onhashchange = this.onhashchange = onhashchange;
        },
        tab: function (title, src, active, allowDelete) {
            var hasNavDomain, context = this.$sidebar, whenNav = this.when('li', this.$navUl);

            if (allowDelete === undefined) {
                allowDelete = true;
            }

            this.when('.active', this.$sidebar)
                .done(function (node) {
                    node.classList.remove('active');
                });
            this.when('[data-domain="' + src + '"]', this.$sidebar)
                .done(function (node) {
                    do {
                        if (node.nodeName.toLowerCase() == 'li') {
                            node.classList.add('active');

                            var elem = node.firstElementChild;

                            if (elem && elem.nodeName.toLowerCase() === 'a' && elem.getAttribute('aria-expanded') === 'false') {

                                elem.setAttribute('aria-expanded', 'true');

                                elem = elem.nextElementSibling;

                                if (elem && elem.classList.contains('collapse')) {
                                    elem.classList.add('in');
                                }
                            }
                        }
                    } while ((node = node.parentNode) && (node != context));
                });

            if (active) {
                whenNav.done(function (node) {
                    var domain = node.getAttribute('data-domain');
                    if (domain === src) {
                        hasNavDomain = true;
                        node.classList.add('active');
                    } else {
                        node.classList.remove('active');
                    }
                });
            }

            if (active ? !hasNavDomain : !whenNav.any(function (node) {
                return node.getAttribute('data-domain') == src;
            })) {
                var htmls = ['<li data-domain="'];

                htmls.push(src);

                htmls.push('"');

                if (active) {
                    htmls.push(' class="active"');
                }

                htmls.push('><a href="');

                htmls.push(src);

                htmls.push('">');

                htmls.push(title);

                if (allowDelete) {
                    htmls.push('<i class="glyphicon glyphicon-remove"></i>');
                }

                htmls.push('</a></li>');

                var html = htmls.join('');

                this.$navUl.appendChild(html.html());
            }

            if (!active) {
                return;
            }

            var hasBodyDomain, whenBodyArr = this.when('li', this.$bodyUl);

            if (active) {
                whenBodyArr.done(function (node) {
                    var domain = node.getAttribute('data-domain');
                    if (domain === src) {
                        hasBodyDomain = true;
                        node.classList.add('active');
                    } else {
                        node.classList.remove('active');
                    }
                });
            }

            if (active ? !hasBodyDomain : !whenBodyArr.any(function (node) {
                return node.getAttribute('data-domain') == src;
            })) {
                var htmls = ['<li data-domain="'];

                htmls.push(src);

                htmls.push('"');

                if (active) {
                    htmls.push(' class="active"');
                }

                htmls.push('><iframe class="ifr" src="');

                if (src.indexOf('#') === 0) {
                    src = src.substring(1);
                }

                var indexOf = src.indexOf('?');

                if (indexOf === -1) {
                    indexOf = src.indexOf('#');
                }

                if (indexOf > -1) {
                    htmls.push(src.slice(0, indexOf));

                    if (src.indexOf('.htm') === -1) {
                        htmls.push('.html');
                    }

                    htmls.push(src.slice(indexOf));
                } else {

                    htmls.push(src);

                    if (src.indexOf('.htm') === -1) {
                        htmls.push('.html');
                    }
                }

                if (src.indexOf('?') === -1) {
                    htmls.push(GLOBAL_SEARCH);
                }

                htmls.push('"></iframe>');

                var html = htmls.join('');

                this.$bodyUl.appendChild(html.html());
            }
        },
        query: function (keywords) {
            if (v2.isEmpty(keywords)) {
                this.load(this.data);
                return;
            }
            var data = [];
            this.data.forEach(function (item) {
                if (item.menu) {
                    data.push(v2.improve({
                        menu: item.menu.filter(function (menu) {
                            return menu.title.indexOf(keywords) > -1;
                        })
                    }, item));
                } else if (item.title.indexOf(keywords) > -1) {
                    data.push(item);
                }
            });

            this.load(data);
        },
        wait: function (show) {
            if (show || this.__wait_) {
                if (this.__wait_) {
                    return show ? this.__wait_.show() : this.__wait_.hide();
                }

                if (show) {
                    this.__wait_ = v2('wait', { style: 2 });
                }
            }
        },
        ajax: function () {
            var vm = this,
                ajax = {
                    url: document.href,
                    method: "GET",
                    params: {},
                    data: {}
                };

            if (this.invoke("ajax-ready", ajax) === false) {
                return;
            }
            return axios.request(ajax)
                .then(function (response) {
                    vm.invoke("ajax-success", response);
                })
            ["catch"](function (error) {
                vm.invoke("ajax-fail", error);
            });
        },
        usb: function () {
            this.base.usb();

            var userEl = this.take('.nav-profile-name');
            var userAvatarEl = userEl.previousElementSibling;

            this.define({
                userName: function (name) {
                    userEl.innerHTML = name;
                },
                userAvatar: function (url) {
                    if (url) {
                        userAvatarEl.src = url;
                    }
                }
            });
        },
        load: function (data) {

            var sidebar = "sidebar_" + this.identity,
                htmls = ['<ul class="nav">', '<li class="nav-item active"><a class="nav-link" data-domain="#{{indexUrl}}" href="#{{indexUrl}}"><i class="glyphicon glyphicon-home menu-icon"></i><span class="menu-title">首页</span></a></li>'.withCb(this)];

            v2.each(data || [], function (item, index) {

                if (item.navs && item.navs.length === 0 || item.items && item.items.length === 0) {
                    return;
                }

                if (item.navs) {
                    htmls.push('<li class="nav-header"><p>');
                    htmls.push(item.name);
                    htmls.push('</p></li>');

                    v2.each(item.navs, function (subItem, subIndex) {
                        done(subItem, (index + 1) * 1000000 + subIndex);
                    });
                } else {
                    done(item, index);
                }
            });

            function done(item, index) {
                htmls.push('<li class="nav-item">');
                htmls.push('<a class="nav-link" ');
                if (item.items) {
                    item.src = '#' + sidebar + "_" + index;
                    htmls.push('data-toggle="collapse" data-viewport="#{0}" aria-expanded="false" '.format(sidebar));
                } else {
                    htmls.push('data-domain="{{src}}" '.withCb(item));
                }

                htmls.push('href="{{src}}"><i class="glyphicon glyphicon-{{icon}} menu-icon"></i><span class="menu-title">{{title}}</span>'.withCb(item));

                if (item.items) {
                    htmls.push('<i class="menu-arrow"></i>');
                    htmls.push('</a>');
                    htmls.push('<div class="collapse" id="{0}">'.format(sidebar + '_' + index));
                    htmls.push('<ul class="nav flex-column sub-menu">');
                    v2.each(item.items, function (subitem) {
                        htmls.push('<li class="nav-item" data-domain="{{src}}"><a class="nav-link" title="{{title}}" href="{{src}}">{{title}}</a></li>'.withCb(subitem));
                    });
                    htmls.push('</ul>');
                    htmls.push('</div>');
                } else {
                    htmls.push('</a>');
                }
                htmls.push('</li>');
            }

            htmls.push('</ul>');

            this.$sidebar.innerHTML = htmls.join('');

            this.$navUl.innerHTML = 'li.active[data-domain="#{{indexUrl}}"]>a[href="#{{indexUrl}}"]{首页}'.withCb(this).htmlCoding();

            this.$bodyUl.innerHTML = 'li.active[data-domain="#{{indexUrl}}"]>iframe.ifr[src="{{indexUrl}}.html?r={{identity}}"]'.withCb(this).htmlCoding();

            this.onhashchange();
        },
        tool: function (view) {
            if (!view || view.length === 0) {
                this.$tools.classList.add('hide');
                return;
            }

            var htmls = [];
            v2.each(view, function (item) {
                htmls.push('<li><a href="');

                htmls.push(item.src || "#");

                if (item.click) {
                    htmls.push('" data-invoke="');
                    htmls.push(item.click);
                }
                htmls.push('">');

                if (item.icon) {
                    htmls.push('<i class="glyphicon glyphicon-{{icon}} text-primary"></i>'.withCb(item));
                }

                htmls.push(item.title);

                htmls.push('</a></li>');
            });

            this.$tools.classList.remove('hide');

            this.$tools.innerHTML = htmls.join('');
        },
        ready: function () {
            var vm = this;
            this.$.on('click', '[data-toggle="minimize"]', function () {
                vm.$$.classList.toggle('sidebar-icon-only');
            });
            this.$.on('click', '[data-toggle="offcanvas"]', function () {
                vm.$sidebar.classList.toggle('active');
            });
            this.$.on('click', '[data-invoke]', function () {
                vm.invoke(this.getAttribute('data-invoke'));
            });
            this.$navUl.on('stop.prev.click', '.glyphicon.glyphicon-remove', function () {
                for (var node = this; node; node = node.parentNode) {
                    if (node.nodeName.toLowerCase() === 'li') {

                        var domain = node.getAttribute('data-domain');
                        var relation_node = vm.take('[data-domain="' + domain + '"]', vm.$bodyUl);

                        if (node.classList.contains("active")) {
                            var elem = node.nextElementSibling || node.previousElementSibling;
                            if (elem) {
                                var title = GetText(elem);
                                var src = elem.getAttribute('data-domain');
                                vm.tab(title, src, true);
                            }
                        }

                        if (relation_node) {
                            relation_node.remove();
                        }

                        node.remove();

                        break;
                    }
                }

                return false;
            });
        },
        show: function () {
            document.documentElement.styleCb('height', '100%');
            this.base.show();
        },
        hide: function () {
            document.documentElement.styleCb('height', 'auto');
            this.base.hide();
        },
        commit: function () {
            var vm = this;
            this.$.on("keyup", function (e) {
                var code = e.keyCode || e.which;
                if (code === 13 || code === 108) {
                    vm.invoke("keyboard-enter");
                }
            });
        }
    });

    return function (option) {
        return v2('layout', option);
    };
}));