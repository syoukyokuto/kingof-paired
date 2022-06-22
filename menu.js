var scrollOff = function(e){
  e.preventDefault();
}

$(window).on('load',function() {
  /*  カート放置アラート */
  if ($.cookie("cartdata_alert") != "OK") {
    $('#modal-cartdata_alert')
      .on('show.bs.modal', function(e) {
        $('body').addClass('cartdata-alert-backdrop');
      })
      .on('hidden.bs.modal', function(e) {
        $('body').removeClass('cartdata-alert-backdrop');
      })
      .modal('show');
  }
})

// 画面ロード時に実行される処理
$(document).ready(function () {
  if ($('#dasuccess').val() != undefined && $('#dasuccess').val() != '') {
      $('#hamburger').addClass('open');
      $('#screen').show();
      if ($('#dasuccess').val() == '0') {
          $('#dauth_modal').modal('show');
          $('#dauth_modal .modal-dialog-centered').css('height','200px');
      }
  }

  // TOPへ戻るボタンクリック時の処理
  $('#btnTop').on('click', function (e) {
    $('html, body').animate({scrollTop: 0})
  })

  // カート放置アラートの閉じるボタンを押下
  $('.btn-cartdata-alert').on('click', function (e) {
    $.cookie("cartdata_alert", "OK", { expires: 1, path: '/' })
  })

  // 読み込みが完了している場合、操作不可を解除
  if (document.readyState === 'complete') {
    document.removeEventListener('touchmove', scrollOff, {passive: false})
  }

  // スクロールスパイ発火時にカテゴリバーを移動する
  var scrollCategoryBar = function (activeCategryId) {
    var activeTab = $('.scroll-nav-view [href="'+activeCategryId+'"]').parent()
    var scroolNavView = $('.scroll-nav-view')
    // 左端の位置変更
    var centerPosition = scroolNavView.width() / 2
    // 親要素の左端の座標を取得
    var leftPosition = $('.scroll-nav-list').position().left
    // 要素の右端・左端・中央の座標を取得
    var elmLeftPosition = activeTab.position().left
    var elmRightPosition = elmLeftPosition + activeTab.width()
    var elmCenterPosition = elmRightPosition - (activeTab.width() / 2)
    // スクロール後の座標位置を算出
    var newScrollLeft = elmCenterPosition - centerPosition - leftPosition
    if (newScrollLeft > 0) {
      scroolNavView.animate({scrollLeft: newScrollLeft})
    } else {
      scroolNavView.animate({scrollLeft: 0})
    }
  }
  var withScrollspy = function (e, obj) {
    var activeCategryId = obj.relatedTarget
    scrollCategoryBar(activeCategryId);
  }
  $(window).on('activate.bs.scrollspy', withScrollspy)

  // スムーススクロール
  $('.scroll-nav-link').on('click', function () {
    // スクロールの速度
    var speed = 400 // ミリ秒
    // アンカーの値取得
    var href= $(this).attr("href")
    // 移動先を取得
    var target = $(href == "#" || href == "" ? 'html' : href)
    // 移動先を数値で取得
    if (target.offset() === undefined) {
      return false
    }
    var position = target.offset().top - $('#navbar').outerHeight() + 1
    // 上スクロール時のメインヘッダー出現に伴う位置調整
    if ($(window).scrollTop() > position){
      position = position - 54
    }

    // scrollspyの監視を一時的に停止
    var navbar = $('#navbar');
    var newActive = $(this);
    navbar.removeClass('menu-list-nav-bar');
    // カテゴリバーを移動する処理を一時的に停止
    $(window).off('activate.bs.scrollspy');
    // 現在activeになってるクラスをactiveから外す
    navbar.find('.active').removeClass('active');
    // 押下された要素にactiveを追加し、カテゴリバーを移動
    newActive.addClass('active');
    scrollCategoryBar(href);

    // スムーススクロール
    $('html, body').animate({scrollTop:position}, speed, 'swing', function(){
      // スクロール完了後、scrollspyの監視を再開
      navbar.addClass('menu-list-nav-bar');
      // カテゴリバーを移動する処理を再開
      // 重複登録を防ぐため、onの直前に再度offを実行(htmlとbodyで2回動いてしまうため)
      $(window).off('activate.bs.scrollspy')
      $(window).on('activate.bs.scrollspy', withScrollspy)
      // 初期表示時のみ、menu-list-nav-barクラスが消えているときにmenuList.jsでscrollspyが動いてしまう可能性があるため、その対応
      // menuList.js側でscrollspyが実施されていない場合はここでセットする
      if(!scrollspyStatus) {
        // スクロールとナビゲーションタブ(カテゴリーバー)の同期
        $('body').css('position', 'relative').scrollspy({
          target: '.menu-list-nav-bar',
          offset: $('.main-header').height() + $('.sub-header').height() + 10
        })
        scrollspyStatus = true
      }
    })

    return false
  })

  // リスト←→インスタ遷移の際にカテゴリーを引き継ぐ
  $('.js-change-view').on('click', function (e) {
    // 現在アクティブなカテゴリーを取得
    let toCategoryCode = $('.scroll-nav-view .scroll-nav-link.active').attr('href').match(/#category(top|[0-9]+)/)
    if (toCategoryCode) {
      e.currentTarget.search += (e.currentTarget.search ? '&' : '?') + 'ctg=' + toCategoryCode[1]
    }
  })

  // カテゴリーが指定されているときはそのカテゴリーへスクロール
  let searchParams = new URLSearchParams(document.location.search.substring(1))
  let categoryCode = searchParams.get('ctg')
  if (categoryCode && categoryCode !== 'top') {
    $('.scroll-nav-view [href="#category'+categoryCode+'"]').click()
  }

  // スクロール位置を復元
  let menuListSession = getScrollTop()
  let scrollTop = null
  let ua = navigator.userAgent;
  let scrollTag;
  let iOSVersion;
  // iPhoneの場合、OSバージョンを取得
  if( ua.indexOf('iPhone') !== -1 ) {
    var version = window.navigator.userAgent.toLowerCase().match(/iphone os (.+?) like/)[1];
    iOSVersion = parseFloat(version.replace("_",","));
  }
  // ブラウザによってscrollTopが有効になるタグが異なるため、使用するタグを判定
  if( ua.indexOf('OPR') !== -1 || ua.indexOf('Edge') !== -1 ) {
    scrollTag = 'body';
  } else if (ua.indexOf('iPhone') !== -1 && iOSVersion >= 13) {
    scrollTag = 'html'
  } else if (ua.indexOf('Android') !== -1 && ua.indexOf('jp.kp.sp.sdk.and') !== -1) { // Android用「DBarai APP」のみ
    scrollTag = 'html'
  } 
  else {
    scrollTag = ( !window.chrome && 'WebkitAppearance' in document.documentElement.style )? 'body' : 'html';
  }
  if (window.performance) {
    if (performance.navigation.type === 1) {
      // リロード時はTOPに戻る
      scrollTop = 0
    } else {
      if (!categoryCode && menuListSession) {
        if ($('#menuArea').data('is-photo-list') && menuListSession.listType === 'photoList') {
          scrollTop = menuListSession.scrollTop
        } else if (menuListSession.listType === 'list') {
          scrollTop = menuListSession.scrollTop
        }
      }
    }
  }
  if (scrollTop !== null) {
    $(scrollTag).scrollTop(scrollTop)
  }

  // スクロール位置を保存
  $('.menu-area').on('click', '.js-link-menu-item', function (e) {
    setScrollTop(
      $(window).scrollTop(),
      $('#menuArea').data('is-photo-list') ? 'photoList' : 'list'
    )
  })
})

// 画面読み込み完了時に実行される処理
$(window).on('load', function () {
  // ローディング画面を非表示
  $('.loading').delay(500).fadeOut(500);
  // 操作不可を解除
  document.removeEventListener('touchmove', scrollOff, {passive: false});
})

//10秒たってもロードが終わっていないときは強制的にロード画面を非表示
$(function(){
  setTimeout(function() {
    $('.loading').delay(500).fadeOut(500);
    // 操作不可を解除
    document.removeEventListener('touchmove', scrollOff, {passive: false});
  },10000);
});

/**
 * メニュー領域のスクロール位置を保存する
 *
 * @param {integer} scrollTop メニュー領域のスクロール位置
 * @param {string} listType 'list' または 'photoList'
 */
var setScrollTop = function (scrollTop, listType) {
  var menuList = {
    scrollTop: scrollTop,
    listType: listType
  }
  sessionStorage.setItem('menuList', JSON.stringify(menuList))
}

/**
 * 前回表示時のスクロール位置を取得
 *
 */
var getScrollTop = function () {
  return JSON.parse(sessionStorage.getItem('menuList'))
}

