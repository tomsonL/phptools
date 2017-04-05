'use strict';
(function () {
    Vue.component('vue-item', {
        props: ['jsondata'],
        template: '#item-template'
    })

    Vue.component('vue-outer', {
        props: ['jsondata', 'isend'],
        template: '#outer-template'
    })

    Vue.component('vue-expand', {
        props: [],
        template: '#expand-template'
    })

    Vue.component('vue-val', {
        props: ['field', 'val', 'isend'],
        template: '#val-template'
    })


    Vue.use({
        install: function (Vue, options) {

            // 判断数据类型
            Vue.prototype.getTyp = function (val) {
                return toString.call(val).split(']')[0].split(' ')[1]
            }

            // 判断是否是对象或者数组，以对下级进行渲染
            Vue.prototype.isObjectArr = function (val) {
                return ['Object', 'Array'].indexOf(this.getTyp(val)) > -1
            }

            // 折叠
            Vue.prototype.fold = function ($event) {
                var target = Vue.prototype.expandTarget($event)
                target.siblings('svg').show()
                target.hide().parent().siblings('.expand-view').hide()
                target.parent().siblings('.fold-view').show()
            }
            // 展开
            Vue.prototype.expand = function ($event) {
                var target = Vue.prototype.expandTarget($event)
                target.siblings('svg').show()
                target.hide().parent().siblings('.expand-view').show()
                target.parent().siblings('.fold-view').hide()
            }

            //获取展开折叠的target
            Vue.prototype.expandTarget = function ($event) {
                switch ($event.target.tagName.toLowerCase()) {
                    case 'use':
                        return $($event.target).parent()
                    case 'label':
                        return $($event.target).closest('.fold-view').siblings('.expand-wraper').find('.icon-square-plus').first()
                    default:
                        return $($event.target)
                }
            }

            // 格式化值
            Vue.prototype.formatVal = function (val) {
                switch (Vue.prototype.getTyp(val)) {
                    case 'String':
                        return '"' + val + '"'
                        break

                    case 'Null':
                        return 'null'
                        break

                    default:
                        return val

                }
            }

            // 判断值是否是链接
            Vue.prototype.isaLink = function (val) {
                return /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(val)
            }

            // 计算对象的长度
            Vue.prototype.objLength = function (obj) {
                return Object.keys(obj).length
            }
        }
    })

    var timeNow = new Date();


    var initJson = '{\n\
      "name": "Json on",\n\
      "description": "一个简洁的在线 JSON 查看器",\n\
      "open source": {\n\
        "是否开源": true,\n\
        "GitHub": "https://github.com/bimohxh/jsonon"\n\
      }\n\
  }'
    var unixTimestampToHuman = function (timestamp, isms) {
        timestamp = timestamp || '';
        isms = isms || 0;
        if (isNaN(timestamp)) {
            timestamp = timestamp.trim()
        }
        var v = timestamp;
        if (isms == "0") {
            if (/^(-)?\d{1,10}$/.test(v)) {
                v = v * 1000;
            } else if (/^(-)?\d{1,13}$/.test(v)) {
                v = v * 1000;
            } else if (/^(-)?\d{1,14}$/.test(v)) {
                v = v * 100;
            } else if (/^(-)?\d{1,15}$/.test(v)) {
                v = v * 10;
            } else if (/^(-)?\d{1,16}$/.test(v)) {
                v = v * 1;
            } else {
                App.jsonhtml = "时间戳格式不正确";
                return;
            }
        } else {
            v = v * 1;
        }
        var dateObj = new Date(v);
        if (dateObj.getFullYear() == "NaN") {
            /*alert("时间戳格式不正确");*/
            App.jsonhtml = "时间戳格式不正确"
            return;
        }
        return dateObj.getFullYear() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getDate() + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds();
    }

    var unixHumanToTimestamp = function (humanFormatTime, isms) {

        humanFormatTime = humanFormatTime|| '';
        isms = isms || 0;
        var datetime = humanFormatTime;
        if (!datetime) return;
        var ndate = new Date(datetime);
        var year = ndate.getFullYear();
        var month = ndate.getMonth();
        var day = ndate.getDate();
        var hour = ndate.getHours();
        var minute = ndate.getMinutes();
        var second = ndate.getSeconds();
        var ms = ndate.getMilliseconds();
        //var humanDate = new Date(Date.UTC(year, month, day, hour, minute, second));
        var humanDate;
        if (isms == 0) {
            humanDate = new Date(year, month, day, hour, minute, second);
            var re = Math.round(humanDate.getTime() / 1000)
        }
        else {
            humanDate = new Date(year, month, day, hour, minute, second, ms);
            var re = humanDate.getTime()
        }
        if (humanDate.getYear() == "NaN") {
            /*alert("时间格式不正确");*/
            return;
        }
        return re;
    }


    var App = new Vue({
        el: '#app',
        data: {
            baseview: 'formater',
            view: '',
            timestamp: '',
            search:'',
            timestamp_human: unixTimestampToHuman(Math.round(timeNow.getTime() / 1000), 0),
            encrypt: '',
            isms: '0',
            isms2: '0',
            jsoncon: '',
            newjsoncon: '{"name": "Json on"}',
            jsonhtml: '',
            compressStr: '',
            error: {},
            historys: [],
            history: {name: ''},
            noActive: true,
            code: '',
            curltophp:'',
            php:'',
        },
        methods: {
            searchGo:function () {
                window.open('https://google.gg-g.org/#q=' + App.search + '&*', Math.random());
            },
            searchKeyup:function () {
                if(window.event.keyCode==13){
                    window.open('https://google.gg-g.org/#q=' + App.search + '&*', Math.random());
                }
            },
            // 全部展开
            expandAll: function () {
                $('.icon-square-min').show()
                $('.icon-square-plus').hide()
                $('.expand-view').show()
                $('.fold-view').hide()
            },

            // 全部折叠
            collapseAll: function () {
                $('.icon-square-min').hide()
                $('.icon-square-plus').show()
                $('.expand-view').hide()
                $('.fold-view').show()
            },

            // 压缩
            compress: function () {
                App.jsoncon = Parse.compress(App.jsoncon)
            },

            // diff
            diffTwo: function () {
                var oldJSON = {}
                var newJSON = {}
                App.view = 'code'
                try {
                    oldJSON = jsonlint.parse(App.jsoncon)
                } catch (ex) {
                    App.view = 'error'
                    App.error = {
                        msg: '原 JSON 解析错误\r\n' + ex.message
                    }
                    return
                }
                try {
                    newJSON = jsonlint.parse(App.newjsoncon)
                } catch (ex) {
                    App.view = 'error'
                    App.error = {
                        msg: '新 JSON 解析错误\r\n' + ex.message
                    }
                    return
                }

                var base = difflib.stringAsLines(JSON.stringify(oldJSON, '', 4))
                var newtxt = difflib.stringAsLines(JSON.stringify(newJSON, '', 4))
                var sm = new difflib.SequenceMatcher(base, newtxt)
                var opcodes = sm.get_opcodes()
                $('#diffoutput').empty().append(diffview.buildView({
                    baseTextLines: base,
                    newTextLines: newtxt,
                    opcodes: opcodes,
                    baseTextName: '原 JSON',
                    newTextName: '新 JSON',
                    contextSize: 2,
                    viewType: 0
                }))
            },

            // 清空
            clearAll: function () {
                App.jsoncon = ''
            },

            // 美化
            beauty: function () {
                App.jsoncon = JSON.stringify(JSON.parse(App.jsoncon), '', 4)
            },

            baseViewToDiff: function () {
                App.baseview = 'diff'
                App.diffTwo()
            },

            // 回到格式化视图
            baseViewToFormater: function () {
                App.baseview = 'formater'
                App.view = 'code'
                App.showJsonView()
            },

            // 根据时间戳显示格式化后的时间
            showDatetimeInHuman: function (timestamp) {
                if (App.baseview === 'diff') {
                    return
                }
                try {
                    if (timestamp.trim() === '') {
                        App.view = 'empty'
                    } else {
                        App.view = 'code'
                        App.jsonhtml = unixTimestampToHuman(timestamp.trim(), this.isms);
                    }
                } catch (ex) {
                    App.view = 'error'
                    App.error = {
                        msg: ex.message
                    }
                }
            },
            //
            // 根据时间戳显示格式化后的时间
            showDatetime: function () {
                if (App.baseview === 'diff') {
                    return
                }
                try {
                    if (this.timestamp_human.trim() === '') {
                        App.view = 'empty'
                    } else {
                        App.view = 'code'
                        App.jsonhtml = unixHumanToTimestamp(this.timestamp_human, this.isms2);
                    }
                } catch (ex) {
                    App.view = 'error'
                    App.error = {
                        msg: ex.message
                    }
                }
            },

            unencrypt: function () {

                try {
                    var inp = this.encrypt;

                    //\u8FD8\u73E0\u683C\u683C
                    var pattern = /\\u[0-9a-fA-F]{4}/;
                    if (pattern.test(inp)) {
                        var unescaped = unescapeFromUtf16(inp);
                    }

                    // r'\U00003042\U00003044 => "あい"
                    var pattern = /\\U[0-9a-fA-F]{8}/;
                    if (pattern.test(inp)) {
                        var unescaped = unescapeFromUtf32(inp);
                    }

                    //&#x8FD8;&#x73E0;&#x683C;&#x683C; =>'还珠格格'
                    var pattern = /&#x[0-9a-fA-F]{4}\;/;
                    if (pattern.test(inp)) {
                        var unescaped = unescapeFromNumRef(inp, 16);
                    }

                    //\xE8\xBF\x98\xE7\x8F\xA0\xE6\xA0\xBC\xE6 =>'还珠格格'
                    var pattern = /\\x[0-9a-fA-F]{2}/;
                    if (pattern.test(inp)) {
                        var unescaped = unescapeFromEscapedBytes(inp, 16, 'UTF-8');
                    }

                    //%E8%BF%98%E7%8F%A0%E6%A0%BC%0E =>'还珠格格'
                    var pattern = /\%[0-9a-fA-F]{2}/;
                    if (pattern.test(inp)) {
                        var unescaped = unescapeFromUrl(inp, 'UTF-8');
                    }

                    //\350\277\230\347\217\240\346\240\274\346\240\274 =>'还珠格格'
                    var pattern = /\\[0-9]{3}/;
                    if (pattern.test(inp)) {
                        var unescaped = unescapeFromEscapedBytes(inp, 8, 'UTF-8');
                    }

                    //&#36824;&#29664;&#26684;&#26684 =>'还珠格格'
                    var pattern = /&#[0-9]{5};/;
                    if (pattern.test(inp)) {
                        var unescaped = unescapeFromNumRef(inp, 10);
                    }
                    App.view = 'code'
                    App.jsonhtml = unescaped;
                } catch (ex) {
                    App.view = 'error'
                    App.error = {
                        msg: ex.message
                    }
                }
            },

            active:function () {
                this.noActive = false;
            },

            noactive:function () {
                this.noActive = true;
            },

            showCodeMysqli:function(){
                App.view = "";
                App.code = "mysqli";
            },
            showCodeCurlGet:function(){
                App.view = "";
                App.code = "curl-get";
            },
            showCodeCurlPost:function(){
                App.view = "";
                App.code = "curl-post";
            },
            showCodeCurlFile:function(){
                App.view = "";
                App.code = "curl-file";
            },
            hideCode:function(){
                App.code = "";
            },


            // 根据json内容变化格式化视图
            showJsonView: function () {
                if (App.baseview === 'diff') {
                    return
                }
                try {
                    if (this.jsoncon.trim() === '') {
                        App.view = 'empty'
                    } else {
                        App.view = 'code'
                        App.jsonhtml = jsonlint.parse(this.jsoncon)
                    }
                } catch (ex) {
                    App.view = 'error'
                    App.error = {
                        msg: ex.message
                    }
                }
            },

            // 保存当前的JSON
            save: function () {
                if (App.history.name.trim() === '') {
                    Helper.alert('名称不能为空！', 'danger')
                    return
                }
                var val = {
                    name: App.history.name,
                    data: App.jsoncon
                }
                var key = String(Date.now())
                localforage.setItem(key, val, function (err, value) {
                    Helper.alert('保存成功！', 'success')
                    val.key = key
                    App.historys.push(val)
                })
            },

            // 删除已保存的
            remove: function (item, index) {
                localforage.removeItem(item.key, function () {
                    App.historys.splice(index, 1)
                })
            },

            // 根据历史恢复数据
            restore: function (item) {
                localforage.getItem(item.key, function (err, value) {
                    App.jsoncon = item.data
                })
            },

            // 获取所有保存的json
            listHistory: function () {
                localforage.iterate(function (value, key, iterationNumber) {
                    value.key = key
                    App.historys.push(value)
                })
            }
        },
        watch: {
            jsoncon: function () {
                App.code = "";
                App.showJsonView();
            },
            timestamp: function () {
                App.code = "";
                App.showDatetimeInHuman(this.timestamp)
            },
            isms: function () {
                App.code = "";
                App.showDatetimeInHuman(this.timestamp)

            },
            timestamp_human: function () {
                App.code = "";
                this.noActive = false;
                App.showDatetime()
            },
            isms2: function () {
                App.code = "";
                App.showDatetime()
            },
            encrypt: function () {
                App.code = "";
                App.unencrypt();
            },
            curltophp: function( ){
                App.code = "";
                App.view = 'php'
                var o = curl_to_php.transform(App.curltophp, 'php')
                console.log(o);
                // if (o) {
                //     o = hljs.highlight("php", o).value
                //     o = o.replace(/\*([^*]+)+\*/g, '<b>\$1</b>')
                //     o = o.replace(/`([^`]+)`/g, function(s, p) {
                //         return '<a href="#' + encodeURI(p) + '">' + p + '</a>'
                //     })
                // }
                App.php = o;
                //App.php =  o;
            }
        },
        created: function () {
            this.listHistory()
        }
    })
})()
