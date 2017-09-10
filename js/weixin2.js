$(function () {
    var weixin={
        init:function () {
            $contents=$('.js-contents');
            this.initDom();
            this.ajaxRender();
            this.keyChange();
            this.clickAudio();
            this.audioLong();
        },
        initDom:function () {
            $footer=$('.js-footer');
            $voice=$('#js-voice');
            $txt=$('#js-txt');
        },
        ajaxRender:function () {
            $.get("http://localhost:3000/communication",(data)=>{
                data.end == "0" ? this.renderHtml(data.posts) : "";
            });
        },
        renderHtml:function (posts) {
            var html="";
            for(var i=0;i<posts.length;i++){
                switch(posts[i].type){
                    case "leftText":
                        html+=['<div class="left TextLeft">',
                            '              <a href="javascript:;"><img class="headImg" src="'+posts[i].headImage +'" alt=""></a>',
                            '              <p class="left-word">'+posts[i].content+'</p>',
                            ' </div>'].join("");
                        break;
                    case "rightText":
                        html+=['<div class="right TextRight">',
                            '    <a href="javascript:;"><img class="headImg" src="'+posts[i].headImage +'" alt=""></a>',
                            '    <p class="left-word">'+posts[i].content+'</p>',
                            '</div>'].join("");
                        break;
                    case "leftSound":
                        html+=['<div class="left audioLeft js-audio">',
                            '              <a href="javascript:;"><img class="headImg" src="'+posts[i].headImage +'" alt=""></a>',
                            '              <p class="con audioLeft">',
                            '              <span class="auto-voice">',
                            '                   <img class="imgActive Ico" src="./imgs/au3.png" alt="">',
                            '                   <img src="./imgs/au1.png" alt="">',
                            '                   <img src="./imgs/au2.png" alt="">',
                            '              </span>',
                            '              <audio class="audioPlay" src="'+posts[i].sound.url +'"></audio>',
                            '              </p>',
                            '              <div class="red">',
                            '                   <p></p>',
                            '                   <span class="js-long">'+posts[i].sound.duration +'</span><b>"</b>',
                            '              </div>',
                            '</div>'].join("");
                        break;
                    case "rightSound":
                        html+=['<div class="right audioRight js-audio">',
                            '              <a href="javascript:;"><img class="headImg" src="'+posts[i].headImage +'" alt=""></a>',
                            '              <p class="con audioRight">',
                            '              <span class="auto-voice">',
                            '                   <img class="imgActive Ico" src="./imgs/au3.png" alt="">',
                            '                   <img src="./imgs/au1.png" alt="">',
                            '                   <img src="./imgs/au2.png" alt="">',
                            '              </span>',
                            '              <audio class="audioPlay" src="'+posts[i].sound.url +'"></audio>',
                            '              </p>',
                            '              <div class="red">',
                            '                   <p></p>',
                            '                   <span class="js-long">'+posts[i].sound.duration +'</span><b>"</b>',
                            '              </div>',
                            '</div>'].join("");
                        break;
                    case "leftImage":
                        html+=['<div class="left ImgLeft images">',
                            '                <a href="javascript:;"><img class="headImg" src="'+posts[i].headImage +'" alt=""></a>',
                            '                <img class="smallImg" src="'+posts[i].imageArray[0].turl+'" alt="">',
                            '</div>'].join("");
                        break;
                    case "rightImage":
                        html+='<div class="right ImgRight images">'+
                            '                <a href="javascript:;"><img class="headImg" src="'+posts[i].headImage +'" alt=""></a>'+
                            '                   <img class="smallImg" src="'+posts[i].imageArray[0].turl+'" alt="">'+
                            '</div>';
                        break;
                }
            }
            $contents.append(html);

        },
        clickAudio:function () {
            var timer='';
            var num=0;
            var flag=true;
            var _this=this;
            var stop=true;
            $contents.on('click','.con',function () {
                var autoVoice=$(this).find('.auto-voice');
                var imgs=autoVoice.children();
                var newRed=$(this).next('.red').find('p');
                var audioOne=$(this).find('.audioPlay')[0];
                var allAudio=$contents.find('.audioPlay');
                var allImage=$contents.find('.auto-voice>img');
                var allIco=$contents.find('.Ico');
                if(flag){
                    _this.audioPlay(audioOne);
                    allImage.removeClass('imgActive');
                    allIco.addClass('imgActive');
                    $(newRed).css("display","none");
                    stop=true;
                    function autoStop() {
                        if(stop){
                            stop=setTimeout(function () {
                                if(audioOne.ended){
                                    clearTimeout(timer);
                                    allImage.removeClass('imgActive');
                                    allIco.addClass('imgActive');
                                    stop=false;
                                }
                                console.log(1111);
                                autoStop();
                            },500);
                        }
                    }
                    autoStop();
                    clearTimeout(timer);
                    function set() {
                        timer = setTimeout(function () {
                            num++;
                            if (num >= imgs.length) {
                                num = 0;
                            }
                            $(imgs).removeClass('imgActive');
                            $(imgs[num]).addClass('imgActive');
                            set();
                        },400);
                    }
                    set();
                    flag=false;
                    console.log(flag)
                }else{
                    stop=false;
                    for(var j=0;j<allAudio.length;j++){
                        _this.pausePlay(allAudio[j]);
                    }
                    allImage.removeClass('imgActive');
                    allIco.addClass('imgActive');
                    clearTimeout(timer);
                    _this.pausePlay(audioOne);
                    flag=true;
                }
            })
        },
        audioLong:function () {
            setTimeout(function () {
                $contents.trigger("click");
                console.log(111)
            },100);
            $contents.on('click',function () {
                $audiolong=$contents.find('.js-long');
                $con=$contents.find('.con');
                for(var i=0;i<$audiolong.length;i++){
                            $con.eq(i).width($audiolong.eq(i).html()*0.06+"rem");
                        }
            })
        },
        imgScale:function () {
            
        },
        audioPlay:function (el) {
            el.play();
        },
        pausePlay:function (domNode) {
                domNode.pause();
                domNode.currentTime=0;

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

    weixin.init();
});
