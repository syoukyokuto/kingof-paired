Number.prototype.putComma = function () {
  return this.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,')
}

// ブラウザバック抑止
// History API が使えるブラウザかどうかをチェック
//if( window.history && window.history.pushState ){
//  // ブラウザ履歴に１つ追加
//  history.pushState(null, null, null);
//  $(window).on( "popstate", function(event){
//    // このページで「戻る」を実行
//    if( !event.originalEvent.state ){
//      // もう一度履歴を操作して終了
//      history.pushState(null, null, null);
//      return;
//    }
//  });
//} 


/* ピンチインピンチアウトによる拡大縮小を禁止 */
//window.document.addEventListener('touchstart', function (e) {
//  if(e.touches.length > 1 || e.targetTouches.length > 1) {
//    e.preventDefault();
//  }
//}, {passive: false});
/* 長押しでの3D Touch機能表示禁止 */
document.addEventListener('touchforcechange', function (e) {
  if(e.changedTouches[0] && e.changedTouches[0].force > 0.2){
    e.preventDefault();
  }
}, {passive: false});

/* ダブルクリックによる拡大を防止 */
var touchMoveX = 0;
var touchMoveY = 0;

/* 移動判定変数の初期化 */
var isDragging = false;

window.document.addEventListener('touchstart', function (e) {
  // 移動判定変数の初期化
  isDragging = false;
  // ピンチインアウトの場合(２本指で操作したとき)
  if(e.touches.length > 1 || e.targetTouches.length > 1) {
    // 移動判定を有効化
    isDragging = true;
  }
});

// 移動時
window.addEventListener('touchmove', function(event) {
// 移動判定を有効化
isDragging = true;

// 座標の取得
touchMoveX = event.changedTouches[0].pageX;
touchMoveY = event.changedTouches[0].pageY;
}, {passive: false});

document.addEventListener('touchend', function (event) {

  if (touchMoveX != 0 || touchMoveY != 0) {

    touchMoveX = 0;
    touchMoveY = 0;
    return false;

  }
  
  if($(event.target).is('input:text')){
    return false;
  }

  event.preventDefault();

  var $obj = $(event.target);

  if(!$obj.prop('disabled')){

    $obj.css('cursor', 'pointer');
    $obj.focus();

    if (isDragging){
        // 移動中の場合clickを無効に
        return;
    } else if (event.target.nodeName == 'A'){
      $obj[0].click();
    } else if($obj.parent().prop("tagName") == 'A'){
      $obj.parent()[0].click();
    } else if($obj.parent().parent().prop("tagName") == 'A'){
      $obj.parent().parent()[0].click();
    } else if($obj.children().prop("tagName") == 'A') {
      $obj.children()[0].click();
    } else {
      $obj.click();
    }

  }

}, false);

$(function() {
    /**
     * ただ画面遷移する画面パーツを押下時<br />
     * 属性に「data-url」を追加し、そこに遷移先を定義しておく
     */
    $('.link_button').on('click', function () {
        location.href = $(this).data('url');
    });

    /**
     * formをsubmitするだけのボタン押下
     */
    $('.submit_button').on('click', function () {
        $(this).parents('form').submit();
    });
});

$(function(){
    /**
     * CookieがOFFだったらメッセージを表示
     */
    var isCookieDisabled = false;
    if (navigator.cookieEnabled) {
        // IE対応（IEは上記判定は効かない）
        var cookie = $.cookie('XSRF-TOKEN');
        if(!cookie){
            // cookie無効
            isCookieDisabled = true;
        }
    } else {
        // cookie無効
        isCookieDisabled = true;
    }

    if (isCookieDisabled) {
        $('.txt_message').removeClass('txt_message');
    }
});

$(window).on('load', function() {
	if (location.pathname.indexOf('/cart') == -1 && 
		location.pathname.indexOf('/order_history') == -1) {
	    $.removeCookie("dispTab");
	}
});
