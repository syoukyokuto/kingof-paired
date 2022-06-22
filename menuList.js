var scrollspyStatus = false;

// 画面ロード時に実行される処理
$(document).ready(function () {
  if($(".menu-list-nav-bar").length && scrollspyStatus === false) {
    // スクロールとナビゲーションタブ(カテゴリーバー)の同期
    $('body').css('position', 'relative').scrollspy({
      target: '.menu-list-nav-bar',
      offset: $('.main-header').height() + $('.sub-header').height() + 10
    })
    scrollspyStatus = true
  }

  var box = $('#hamburger_nav')[0];
  var touchStartPositionY;
  var touchMovePositionY;
  var moveFarY;
  var startScrollY;
  var moveScrollY;

  box.addEventListener("touchstart",touchHandler,false);
  box.addEventListener("touchmove",touchHandler,false);

  function touchHandler(e){
    var touch = e.touches[0];
    if(e.type == "touchstart"){
      touchStartPositionY = touch.pageY;
      startScrollY = $('#hamburger_nav').scrollTop();
    }
    if(e.type == "touchmove"){
      e.preventDefault();
      touchMovePositionY = touch.pageY;
      moveFarY = touchStartPositionY - touchMovePositionY;
      moveScrollY = startScrollY +moveFarY;
      $('#hamburger_nav').scrollTop(moveScrollY);
    }
  }
});

/* 画像遅延読み込み */
if (typeof lozad !== 'undefined') {
  lozad('.lozad', { // Class Name
    rootMargin: '100px 100px', // syntax similar to that of CSS Margin
    threshold: 0 // ratio of element convergence
  }).observe();
}
