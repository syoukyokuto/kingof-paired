var startPos = 0,
    winScrollTop = 0,
    scrollArea = 0;
$(window).on('scroll', function() {
	if ($('.container').length == 0) {
		return;
	}
    // スクロール位置を取得
    winScrollTop = $(this).scrollTop();
    // スクロール範囲を取得
//    scrollArea = $('.menu-area').height() - $('.main-header').outerHeight() - $('.sub-header').outerHeight() - $('.item').height() - $('.menu-bottom-fix').height() - $('.footer').outerHeight() - 20;
    scrollArea = $('.container').height() - 1000;

    // スクロール範囲を超えた場合はスクロール位置を調整
    if (winScrollTop >= scrollArea) {
        winScrollTop = scrollArea;
    }
    if (winScrollTop >= startPos) {
        if (winScrollTop >= $('.main-header').outerHeight()) {
            $('.main-header').addClass('hide');
            $('.sub-header').addClass('position');
        }
    } else {
        $('.main-header').removeClass('hide');
        $('.sub-header').removeClass('position');
    }
    startPos = winScrollTop;
});