
//index.html 検索の方法選択
$(function() {
     //初期表示
     $(".tab_content").hide();//全ての.tab_contentを非表示
//     $("ul.tabs li#area_serch").addClass("active").show();
//     $(".tab_content#area_serch").show();
     //タブクリック時
     $("ul.tabs li").click(function() {
          $("ul.tabs li").removeClass("active");//.activeを外す
          $(this).addClass("active");//クリックタブに.activeを追加
          $(".tab_content").hide();//全ての.tab_contentを非表示
          var activeTab = $(this).find("a").attr("href");//アクティブタブコンテンツ
          $(activeTab).fadeIn();//アクティブタブコンテンツをフェードイン
          if($(this).is('#zip,#area')){
              //郵便番号検索or地域検索の場合スクロール
              $("body,html").animate({scrollTop: $("#search h2").offset().top});
          }
          return false;
     });
});

//地域から検索
$(function(){
    $("dl.subList").hide().children("dd").hide();
    $("ul#accordion h3").click(function () {
        funcClickEvent($(this), $("dl.subList"), $("ul#accordion h3"));
    });
    $("dl.subList dt").click(function () {
        if( $(this).attr('no_shops')=='true' ){
            return;
        }
        funcClickEvent($(this), $("dl.subList dd"), $("dl.subList dt"));
    });
    function funcClickEvent(dt, dd, h3){
        $(dt).toggleClass("subOpened");
        $(h3).toggleClass("mainOpened");
        $(h3).not($(dt)).removeClass("subOpened").removeClass("mainOpened");
        $(dt).next(dd).slideToggle('normal', function() {
            if (dt.is(".subOpened")) {
                // dtが開く場合だったらdtにスクロールする
                $("body,html").animate({scrollTop: dt.offset().top});
            }
        });
        $(dd).not(dt.next(dd)).slideUp('normal');
    }
});


//タグの背景色変更
function chebg(chkID){
    Myid=document.getElementById(chkID);
    if(Myid.checked == true){
        Myid.parentNode.style.backgroundColor = '#eee';
    }else{
        Myid.parentNode.style.backgroundColor = '#fff';//背景色
    }
}

//新規会員登録ボタン 表示
function entryChange(){
    radio = document.getElementsByName('agree')
        if(radio[0].checked){
            document.getElementById('registBtn').style.display = "block";
            document.getElementById('registBtn_na').style.display = "none";
        }else if(radio[1].checked){
            document.getElementById('registBtn').style.display = "none"
            document.getElementById('registBtn_na').style.display = "block"
        }
}

/*スクロール固定
$(window).load(function() {
    var tab = $('.scrollfix'), //固定したい要素名
    offset = tab.offset();
    $(window).scroll(function () {
        if($(window).scrollTop() > offset.top) {
            tab.addClass('fixed');
        } else {
            tab.removeClass('fixed');
        }
    });
});*/

$(window).on('load', function(){
  if($('.textOverFlow').length > 0){
    var count = 10; // デフォルトで表示する文字数
    $('.textOverFlow').each(function(){
      var target = $(this),
          fullTxt = target.text();
      if(fullTxt.length > count){
        target.text(fullTxt.substr(0,count) + '…');
//        var moreLead = $('<span class="moreLead">[全文表示]</span>');
        target.append(moreLead);
        moreLead.on('click', function(){
          target.text(fullTxt);
          $(this).remove();
        });
      }
    });
  }
});
$(function(){
    $('input[type="button"]').click(function(){
        $(this).prop("disabled", true);
    })
});
