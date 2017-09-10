window.onload=function () {
    var pack={
        init:function () {
            this.ajaxRender();

        },
        initDom:function () {
            $contents=$('.js-contents');
            $footer=$('.js-footer');
            $voice=$('#js-voice');
            $txt=$('#js-txt');
            $voices=$('.js-audio');
            $red=$voices.find('.red');
            $voiceImg=$('.auto-voice');
            $Ico=$('.Ico');
            $allAudio=$('.audioPlay');
            $audiolong=$('.js-long');
            $con=$('.con');
            $Images=$('.images');
        },
        clickAudio:function () {
            var timer='';
            var flag=true;
            var num=0;
            var _this=this;
            for(var i=0;i<$voices.length;i++){
                (function (i) {
                $voices.eq(i).on('click','.con',function(){
                        var IcoLength=$voiceImg.eq(i).children('img');
                        var len=IcoLength.length;
                        var allIco=$voiceImg.children('img');
                        var audio=$(this).find('.audioPlay')[0];
                        if(flag){
                            // for(var s=0;s<$allAudio.length;s++){
                            //     _this.pausePlay($allAudio[s]);
                            // }
                            _this.audioPlay(audio);
                            var as=setInterval(function () {
                                if(audio.ended){
                                    clearInterval(timer);
                                    allIco.removeClass('imgActive');
                                    $Ico.addClass('imgActive');
                                    flag=true;
                                    clearInterval(as);
                                }
                            },500);
                            $red.eq(i).find('p').css("display","none");
                            timer=setInterval(function(){
                                num++;
                                if(num>=len){
                                    num=0
                                }
                                IcoLength.removeClass('imgActive');
                                IcoLength.eq(num).addClass('imgActive');
                            },500);
                            flag=false;
                        }else{
                            clearInterval(timer);
                            allIco.removeClass('imgActive');
                            $Ico.addClass('imgActive');
                            flag=true;
                            _this.pausePlay(audio);
                            audio.currentTime=0;
                        }
                })
                })(i)
            }
        },
        audioLong:function () {
                setInterval(function () {
                    for(var i=0;i<$audiolong.length;i++){
                        $con.eq(i).width($audiolong.eq(i).html()*0.06+"rem");
                    }
                }.bind(this),500);

        },
        ImgScale:function () {
            var sta=true;
            var a=1;
            for(var i=0;i<$Images.length;i++){
                $Images.eq(i).on('click','.smallImg',function () {
                        if(sta){
                            var pI=(this.width/this.height).toFixed(2);
                            var innerWidth=$(window).width();
                            var creHeight=$(window).height();
                            var innerHeight=parseInt(innerWidth/pI);
                            var cha=parseInt(creHeight-innerHeight)/2;
                            $(this).css({"min-width":innerWidth+"px","z-index":a+1,"min-height":innerHeight+"px","position":"absolute","left":"0","top":cha+"px"});
                            $('.posi').css({"position":"absolute","background":"#000","width":"100%","height":"100%"});
                            sta=false;
                        }else{
                            $(this).attr("style","");
                            $('.posi').attr("style","");
                            sta=true;
                        }
                })
            }
        },
        audioPlay:function (domNode) {
              domNode.play();
        },
        pausePlay:function (domNode) {
            domNode.pause();
        },
        ajaxRender:function () {
            $.get("http://localhost:3000/communication",(data)=>{
                //第一：函数    （html字符串，data）；
                data.end == "0" ? this.renderHtml($('.js-contents').html(),data.posts) : "";
            });
        },
        renderHtml:function (htmls,data) {
            // htmls:字符串    data:数据


            // 第二 :    htmls  \r \n    分割成数组
                var htmlArr=htmls.replace(/[\r\n]/g,'').split("#");
                var reg=/{{(\w+.?\w+)}}/g;
                // 第三   ：   建一个 查找 {{aaaaaa}}正则
                function replaceVar(str,data) {
                    // 第五  ：通过循环   正则匹配   {{aaaa}}  直到 空 为止
                        while((res=reg.exec(str))!==null){
                            // 注意：   判断带点的  字符  并且分割成数组
                            if(res[1].indexOf('.') !== -1){
                                var arrs =res[1].split('.');
                                var first = arrs[0];
                                var two = arrs[1];
                                // 替换成数据
                                str=str.replace(res[0],data[first][two]);
                            }
                            // 替换不带点的  数据
                            str=str.replace(res[0],data[res[1]]);

                        }
                        //正则 过滤掉  ：  ：
                       return str.replace(/[\:+]/g,'');
                        
                }

                // 第四  调用函数    传数组其中一个字符串     data  replaceVar(htmlArr[0],data[i]);

                var htmlTemplate = '';
                // 循环data
                for(var i=0;i<data.length;i++){
                    switch(data[i].type){
                        case "leftText":
                           htmlTemplate += replaceVar(htmlArr[0],data[i]);
                            break;
                        case "rightText":
                            htmlTemplate += replaceVar(htmlArr[1],data[i]);
                            break;
                        case "leftSound":
                            htmlTemplate += replaceVar(htmlArr[2],data[i]);
                            break;
                        case "rightSound":
                            htmlTemplate += replaceVar(htmlArr[3],data[i]);
                            break;
                        case "leftImage":
                            htmlTemplate += replaceVar(htmlArr[4],data[i]);
                            break;
                        case "rightImage":
                            htmlTemplate += replaceVar(htmlArr[5],data[i]);
                            break;
                    }
                }
                $('.js-contents').html(htmlTemplate);
                this.initDom();
                this.audioLong();
                this.clickAudio();
                this.keyChange();
                this.ImgScale();



        },
        keyChange:function () {
            var flag=true;
            $footer.on('click','.footer-keyboard',function () {
                    if(flag){
                        $(this).attr("src","./imgs/yuyin_03.png");
                        $voice.removeClass('active');
                        $txt.addClass('active');
                        $txt.focus();
                        flag=false;
                    }else{
                        $(this).attr("src","./imgs/wei_03.jpg");
                        $txt.removeClass('active');
                        $voice.addClass('active');
                        flag=true;
                    }
            })
        }
};
pack.init();
};