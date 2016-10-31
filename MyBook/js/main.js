/**
 * Created by 张薷月 on 2016/10/30.
 */
//网站换肤
function switchSkin(skinName){
    $("#"+skinName).addClass("selected")                //当前<li>元素选中
        .siblings().removeClass("selected");  //去掉其他同辈<li>元素的选中
    $("#cssfile").attr("href","css/skin/"+ skinName +".css"); //设置不同皮肤
    $.cookie( "MyCssSkin" ,  skinName , { path: '/', expires: 10 });
}
//显示不同的幻灯片
function showImg(index){
    var $rollobj = $("#jnImageroll");
    var $rolllist = $rollobj.find("div a");
    var newhref = $rolllist.eq(index).attr("href");
    $("#JS_imgWrap").attr("href",newhref)
        .find("img").eq(index).stop(true,true).fadeIn().siblings().fadeOut();
    $rolllist.removeClass("chos").css("opacity","0.7")
        .eq(index).addClass("chos").css("opacity","1");
}
//品牌活动模块横向滚动
function showBrandList(index){
    var $rollobj = $("#jnBrandList");
    var rollWidth = $rollobj.find("li").outerWidth();
    rollWidth = rollWidth * 4; //一个版面的宽度
    $rollobj.stop(true,false).animate({ left : -rollWidth*index},1000);
}
//数量和价格联动
$(function(){
    var $span = $(".pro_price strong");
    var price = $span.text();
    $("#num_sort").change(function(){
        var num = $(this).val();
        var amount = num * price;
        $span.text( amount );
    }).change();
})



$(function () {
    //搜索文本框效果
    $("#inputSearch").focus(function(){
        $(this).addClass("focus");
        if($(this).val() ==this.defaultValue){
            $(this).val("");
        }
    }).blur(function(){
        $(this).removeClass("focus");
        if ($(this).val() == '') {
            $(this).val(this.defaultValue);
        }
    }).keyup(function(e){
        if(e.which == 13){
            alert('回车提交表单!');
        }
    })
    //修改皮肤样式
    var $li =$("#skin li");
    $li.click(function(){
        switchSkin( this.id );
    });
    var cookie_skin = $.cookie("MyCssSkin");
    if (cookie_skin) {
        switchSkin( cookie_skin );
    }
    //导航效果
    $("#nav li").hover(function(){
        $(this).find(".jnNav").show();
    },function(){
        $(this).find(".jnNav").hide();
    });
    //添加hot显示
    $(".jnCatainfo .promoted").append('<s class="hot"></s>');
    //首页大屏广告效果
    var $imgrolls = $("#jnImageroll div a");
    $imgrolls.css("opacity","0.7");
    var len  = $imgrolls.length;
    var index = 0;
    var adTimer = null;
    $imgrolls.mouseover(function(){
        index = $imgrolls.index(this);
        showImg(index);
    }).eq(0).mouseover();

    //index.js
    //滑入 停止动画，滑出开始动画.
    $('#jnImageroll').hover(function(){
        if(adTimer){
            clearInterval(adTimer);
        }
    },function(){
        adTimer = setInterval(function(){
            showImg(index);
            index++;
            if(index==len){index=0;}
        } , 5000);
    }).trigger("mouseleave");
    //超链接文字提示
    var x = 10;
    var y = 20;
    $("a.tooltip").mouseover(function(e){
        this.myTitle = this.title;
        this.title = "";
        var tooltip = "<div id='tooltip'>"+ this.myTitle +"</div>"; //创建 div 元素
        $("body").append(tooltip);	//把它追加到文档中
        $("#tooltip")
            .css({
                "top": (e.pageY+y) + "px",
                "left": (e.pageX+x)  + "px"
            }).show("fast");	  //设置x坐标和y坐标，并且显示
    }).mouseout(function(){
        this.title = this.myTitle;
        $("#tooltip").remove();   //移除
    }).mousemove(function(e){
        $("#tooltip")
            .css({
                "top": (e.pageY+y) + "px",
                "left": (e.pageX+x)  + "px"
            });
    });
    //品牌活动模块横向滚动
    $("#jnBrandTab li a").click(function(){
        $(this).parent().addClass("chos").siblings().removeClass("chos");
        var idx = $("#jnBrandTab li a").index(this);
        showBrandList(idx);
        return false;
    }).eq(0).click();
    //滑过图片出现放大镜效果
    $("#jnBrandList li").each(function(index){
        var $img = $(this).find("img");
        var img_w = $img.width();
        var img_h = $img.height();
        var spanHtml = '<span style="position:absolute;top:0;left:5px;width:'+img_w+'px;height:'+img_h+'px;" class="imageMask"></span>';
        $(spanHtml).appendTo(this);
    })
    $("#jnBrandList").delegate(".imageMask", "hover", function(){
        $(this).toggleClass("imageOver");
    });

    //detail.js
    //产品缩略图 使用jqzoom
    $('.jqzoom').jqzoom({
        zoomType: 'standard',
        lens:true,
        preloadImages: false,
        alwaysOn:false,
        zoomWidth: 340,
        zoomHeight: 340,
        xOffset:10,
        yOffset:0,
        position:'right'
    });
    //产品换颜色
    $(".color_change ul li img").click(function(){
        $(this).addClass("hover").parent().siblings().find("img").removeClass("hover");
        var imgSrc = $(this).attr("src");
        var i = imgSrc.lastIndexOf(".");
        var unit = imgSrc.substring(i);
        imgSrc = imgSrc.substring(0,i);
        var imgSrc_small = imgSrc + "_one_small"+ unit;
        var imgSrc_big = imgSrc + "_one_big"+ unit;
        $("#bigImg").attr({"src": imgSrc_small });
        $("#thickImg").attr("href", imgSrc_big);
        var alt = $(this).attr("alt");
        $(".color_change strong").text(alt);
        var newImgSrc = imgSrc.replace("images/pro_img/","");
        $("#jnProitem .imgList li").hide();
        $("#jnProitem .imgList").find(".imgList_"+newImgSrc).show();
        //解决问题：切换颜色后，放大图片还是显示原来的图片。
        $("#jnProitem .imgList").find(".imgList_"+newImgSrc).eq(0).find("a").click();
    });
    //产品小图切换大图
    $("#jnProitem ul.imgList li a").bind("click",function(){
        var imgSrc = $(this).find("img").attr("src");
        var i = imgSrc.lastIndexOf(".");
        var unit = imgSrc.substring(i);
        imgSrc = imgSrc.substring(0,i);
        var imgSrc_big = imgSrc + "_big"+ unit;
        $("#thickImg").attr("href" , imgSrc_big);
    });
    //Tab标签
    var $div_li =$("div.tab_menu ul li");
    $div_li.click(function(){
        $(this).addClass("selected")            //当前<li>元素高亮
            .siblings().removeClass("selected");  //去掉其他同辈<li>元素的高亮
        var index =  $div_li.index(this);  // 获取当前点击的<li>元素 在 全部li元素中的索引。
        $("div.tab_box > div")   	//选取子节点。不选取子节点的话，会引起错误。如果里面还有div
            .eq(index).show()   //显示 <li>元素对应的<div>元素
            .siblings().hide(); //隐藏其他几个同辈的<div>元素
    }).hover(function(){
        $(this).addClass("hover");
    },function(){
        $(this).removeClass("hover");
    })
    //产品尺寸和价格计算
    $(".pro_size li").click(function(){
        $(this).addClass("cur").siblings().removeClass("cur");
        $(this).parents("ul").siblings("strong").text(  $(this).text() );
    })
    //星级评分
    //通过修改样式来显示不同的星级
    $("ul.rating li a").click(function(){
        var title = $(this).attr("title");
        alert("您给此图书的评分是："+title);
        var cl = $(this).parent().attr("class");
        $(this).parent().parent().removeClass().addClass("rating "+cl+"star");
        $(this).blur();//去掉超链接的虚线框
        return false;
    })
    //最终购买输出
    var $product = $(".jnProDetail");
    $("#cart a").click(function (e) {
        var pro_name = $(".color_change strong").text();
        var pro_num = $product.find("#num_sort").val();
        var pro_price = $product.find(".pro_price strong").text();
        var dialog = "感谢您的购买。<div style='font-size:12px;font-weight:400;'>您购买的图书："+pro_name+"；"+
            "数量："+pro_num+"；"+
            "总价："+pro_price +"元。</div>";
        $("#jnDialogContent").html(dialog);
        $('#basic-dialog-ok').modal();
        return false;//避免页面跳转
    });



})