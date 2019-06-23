// ==UserScript==
// @name         Github助手
// @namespace    https://github.com/yeomanye
// @version      0.7.1
// @description  添加Github文件下载、复制按钮、图片点击放大(右击恢复)、issues中只查看用户相关态度的内容、issues列表项从新标签页打开
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=246342
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @require      https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/jquery.pjax/1.1.0/jquery.pjax.min.js
// @require https://greasyfork.org/scripts/53536-ui/code/UI.js?version=281393
// @author       Ming Ye
// @match        https://github.com
// @include      https://github.com/*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    myDebugger.debugD = false;
    var log = myDebugger.consoleFactory("github-btn","log",null);
    var debugTrue = myDebugger.debugTrue;  
    var href = location.href;
    /**
     * 初始化函数
     * @return {[type]} [description]
     */
    function init(){
        createDownLink();
        createCopyLink();
        bindImgClick();
        createFilterPanel();
        openIssueFromNew();
    }
    /**
     * 创建下载链接
     * @return {[type]} [description]
     */
    function createDownLink(){
        //如果不是repository页面则直接返回
        var $files = $('.octicon.octicon-file');
        var $directory = $('.octicon.octicon-file-directory');
        //var $directory = $('.js-navigation-open');
        if($files.length === 0 && $directory.length === 0) return;
        var mouseOverHandler = function(evt){
        // debugTrue();
        var elem = evt.currentTarget,
            aElm = elem.querySelector('.fileDownLink');
        aElm.style.visibility = 'visible';
        };

        var mouseOutHandler = function(evt){
            // debugTrue();
            var elem = evt.currentTarget,
                aElm = elem.querySelector('.fileDownLink');
            aElm.style.visibility = 'hidden';
        };

        var linkClick = function(evt){
            var elem = evt.currentTarget;
            var $link = $('<a></a>');
            $link.attr('href',elem.getAttribute('download-url'));
            $link.attr('download',elem.getAttribute('filename'));
            $link.get(0).click();
        };
        
        // debugTrue();
        var origin = location.origin,
            href = location.href,
            path = href.replace(origin,'');
        if(path.indexOf('tree')<0)
            path += '/tree/master/';
        path = path.replace('tree','raw');
        $files.each(function(i,fileElm){
            var trElm = fileElm.parentNode.parentNode,
                cntElm = trElm.querySelector('.content'),
                cntA = cntElm.querySelector('a'),
                fileName = cntA.innerText,
                $a = $('<a></a>');
            $a.text('下载');
            $a.attr({class:'fileDownLink','download-url':path+'/'+fileName,'filename':fileName});
            $a.css({cursor:'pointer',visibility:'hidden'});
            cntElm.appendChild($a.get(0));
            log.logObj('tr',trElm);
            trElm.onmouseover=mouseOverHandler;
            trElm.onmouseout=mouseOutHandler;
            $a.on('click',linkClick);
        });
        $directory.each(function(i,dirElm){
            /*var $directoryUrl = $('.js-navigation-open');
            $directoryUrl.click(
                function() {
                    console.log("当前URL为:", $(this).attr('href'));
                }
            );*/
            //console.log("当前URL为:", $(this).attr('href'));
            var trElm = dirElm.parentNode.parentNode,
                cntElm = trElm.querySelector('.content'),
                cntCssTruncate = cntElm.querySelector('.css-truncate.css-truncate-target'),
                cntCssTruncateA = cntCssTruncate.querySelector('.js-navigation-open'),
                cntA = cntElm.querySelector('a'),
                fileName = cntA.innerText,
                dirUrl = cntCssTruncateA.href,
                $a = $('<a></a>');

            $a.text('下载');
            $a.attr({class:'fileDownLink','download-url':path+'/'+fileName,'filename':fileName});
            $a.css({cursor:'pointer',visibility:'hidden'});
            cntElm.appendChild($a.get(0));
            log.logObj('tr',trElm);
            trElm.onmouseover=mouseOverHandler;
            trElm.onmouseout=mouseOutHandler;
            $a.on('click',function(){
                var downloadUrl = "https://minhaskamal.github.io/DownGit/#/home?url="+dirUrl;
                window.open(downloadUrl, "_blank");
            });
        });
    }
    /**
     * issues页面从新标签打开
     * @return {[type]} [description]
     */
    function openIssueFromNew(){
        var tmpArr = href.split('/');
        if(tmpArr[tmpArr.length - 1].indexOf('issues') < 0) return;
        $('.issues-listing .js-navigation-container a').on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            log('this',this);
            window.open(this.href);
        });
    }
    /**
     * 创建复制链接
     * @return {[type]} [description]
     */
    function createCopyLink(){
        //如果不是具体的文件页面则直接返回
        var $btnGroup = $('.file-actions .BtnGroup');
        if($btnGroup.length == 0)return;

        var tmpArr = location.href.split('/');
        tmpArr = tmpArr[tmpArr.length-1].split('.');//获取扩展名
        var excludeExts = ['jpg','md','markdown','MD','png'];
        if(tmpArr.length > 1 && excludeExts.indexOf(tmpArr[1]) >= 0) return;
        var $a = $('<a></a>');
        $a.attr({href:'#',class:'btn btn-sm BtnGroup-item copyButton'});
        $a.html('Copy');
        $btnGroup.append($a);
        var addClickHandler = function(){
            timeout = null;
            var $codes = $('.js-file-line-container .js-file-line'),
                text = '';
            $codes.each(function(index,code){
                log.logObj('code',code);
                text += code.innerText;
                if(code.innerText.indexOf('\n')<0) text += '\n';
            });
            $a.attr('data-clipboard-text',text);
            $a.on('click',function(){
                showTips('Copy Success');
            });
            new Clipboard('.copyButton');
            log.logObj('text',text);     
        };
        $a.one('click',function(evt){
            if(timeout){
                clearTimeout(timeout);                
                addClickHandler();
            }
            $a.click();
        });
        var timeout = setTimeout(addClickHandler,1000);
    }
    /**
     * 点击图片处理函数
     * @return {[type]} [description]
     */
    function bindImgClick(){
        var $imgs = $('article img');
        var srcArr = [];
        var newImg = null;
        var $modal = null;
        var width = $(window).width(),height = $(window).height();
        //如果是issues页面，则改变img集合
        var tmpArr = href.split('/');
        if(tmpArr[tmpArr.length - 2].indexOf('issues')>=0){
            $imgs = $('#show_issue .comment img');
        }
        var newImgOnload = function(){
            var imgWidth = newImg.width,imgHeight = newImg.height;
            if(imgWidth > width || imgHeight > height)
            if(height > width){
                newImg.width = width;
            }else{
                newImg.height = height;
            }
            newImg.style.marginLeft = (width - newImg.width)/2 + 'px';
            newImg.style.marginTop = (height - newImg.height)/2 + 'px';
        };
        var initModal = function(){
            $modal = $('<div></div>');
            newImg = new Image();
            $modal.css({position:'fixed',width:width+'px',height:height+'px','background-color':'rgba(0,0,0,0.5)',top:0,left:0,'z-index':-1,'padding-top':0,'padding-left':'auto',visibility:'hidden'});
            $modal.append(newImg);
            $('body').append($modal);
            $modal.on('contextmenu',function(e){
                $modal.css({'z-index':-1,'visibility':'hidden'});
                return false;
            });
            $modal.on('click',function(e){
                var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
                log.logObj('mouseX',mouseX);
                var oldSrc = newImg.src;
                var index = srcArr.indexOf(oldSrc);
                if(mouseX > width/2) {
                    //当前src在数组中的位置
                    index = ++index >= srcArr.length ? 0 : index;
                    newImg.src = srcArr[index];
                }else{
                    index = --index < 0 ? srcArr.length - 1 : index;
                    newImg.src = srcArr[index];
                }
                newImg.onload = newImgOnload;
            });
        };
        var imgClickHandler = function(e){
            log('imgClickHandler');
            if(!$modal) initModal();
            $modal.css({visibility:'visible','z-index':999,userSelect:'none'});
            var oldImg = e.currentTarget;
            newImg.src = oldImg.src;
            //计算宽高
            newImg.onload = newImgOnload;
        };
        $imgs.each(function(i,img){
            var aElm = img.parentNode;
            if(aElm.getAttribute('rel') !== 'noopener noreferrer') return;
            aElm.removeAttribute('href');
            var $img = $(img);
            $img.css('cursor','pointer').on('click',imgClickHandler);
            //去重
            let index = srcArr.indexOf(img.src);
            if(index < 0) srcArr.push(img.src);
        });
    }
    /**
     * 在Issue页面生成过滤面板
     * @return {[type]} [description]
     */
    function createFilterPanel(){
        //如果不是具体issus页面，则直接退出函数
        var tmpArr = href.split('/');
        if(tmpArr[tmpArr.length - 2].indexOf('issues')<0)return;

        var $panel = $('.add-reactions-options.mx-1.mb-1').eq(0).clone(true);
        $('.discussion-sidebar-item.sidebar-assignee.js-discussion-sidebar-item').prepend($panel);
        var $cancelBtn = $('<button></button>').text('X');
        $cancelBtn.get(0).className = 'btn-link add-reactions-options-item js-reaction-option-item cancel-filter-btn';
        $panel.append($cancelBtn);
        var $btns = $panel.find('button');
        var filterHandler = function(evt){
            var btn = evt.currentTarget;
            var val = btn.value;
            var className = btn.className;
            log('value',val);
            var $comments = $('.timeline-comment-wrapper.js-comment-container');
            var authors = [];
            //显示全部
            if(className.indexOf('cancel-filter-btn')>=0){
                $comments.each(function(index,comment){
                    $comments.eq(index).css('display','block');
                });
                return;
            }
            //替换特殊情况
            val.replace('LAUGH unreact','LAUGH react');
            $comments.each(function(index,comment){
                var $comment = $comments.eq(index);
                var $sumBtns = $comment.find('.btn-link.reaction-summary-item');
                $sumBtns.each(function(i,btn){
                    if(btn.value === val){
                        authors.push($comment.find('a.author').text());
                    }
                });
            });
            $comments.each(function(index,comment){
                var $comment = $comments.eq(index);
                var authorName = $comment.find('a.author').text();
                if(authors.indexOf(authorName)<0){
                    $comment.css('display','none');
                }else{
                    $comment.css('display','block');
                }
            });
            $comments.eq(0).css('display','block');
        };
        $btns.each(function(index,elem){
            elem.addEventListener('click',filterHandler);
        });
    }
    init();
    $(document).on('pjax:success',function(evt){
        log('pjax:success');
        init();
    });
})();