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
                data.end == "0" ? this.renderHtml($('.js-contents').html(),data.posts) : "";
            });
        },
        renderHtml:function (htmls,data) {
            var htmlArr=htmls.replace(/[\r\n]/g,'').split('#');
            function replaceHtml(str,data) {
                var reg=/{{(\w+\.?\w+)}}/g;
                while((res=reg.exec(str))!==null){
                        if(res[0].indexOf('.')!== -1){
                            var strArr=res[1].split(".");
                            var first=strArr[0];
                            var two=strArr[1];
                            str=str.replace(res[0],data[first][two])
                        }
                    str=str.replace(res[0],data[res[1]])
                }
                return str.replace(/[:+]/g,'');
            }
            var appendHtmls='';
            for(var i=0;i<data.length;i++) {
                switch (data[i].type) {
                    case "leftText":
                        appendHtmls += replaceHtml(htmlArr[0], data[i]);
                        break;
                    case "rightText":
                        appendHtmls += replaceHtml(htmlArr[1], data[i]);
                        break;
                    case "leftSound":
                        appendHtmls += replaceHtml(htmlArr[2], data[i]);
                        break;
                    case "rightSound":
                        appendHtmls += replaceHtml(htmlArr[3], data[i]);
                        break;
                    case "leftImage":
                        appendHtmls += replaceHtml(htmlArr[4], data[i]);
                        break;
                    case "rightImage":
                        appendHtmls += replaceHtml(htmlArr[5], data[i]);
                        break;
                }
            }
            console.log(appendHtmls);
            $('.js-contents').html(appendHtmls);
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