var scrollOff = function(e){
  e.preventDefault();
}

function noImage(image, path=null) {
    image.onerror = "";
    if(path) {
        image.src = path+"/img/noimage1.png";
    } else {
        image.src = "img/noimage1.png";
    }
    image.alt = "";
    return true;
}

function noImageResized(image, path=null, file=null, style=null, loaded_fn=null) {
    image.onerror = "";
    if (!file) {
        file = "img/noimage1.png";
    }
    if (loaded_fn != null) {
        image.onload = loaded_fn;
    }
    if(path) {
        image.src = path + file;
    } else {
        image.src = file;
    }
    image.onerror = function () {
        if (style != null) {
            image.alt = "";
            image.style.display = style;
        } else {
            noImage(image, null);
        }
    };
    return true;
}

function customerEdit() {
    var customer_edit = $(".customer_edit")
    customer_edit.find("a").css({'display':'none'});
    customer_edit.find("input").attr('readonly',false);
    customer_edit.find("textarea").attr('readonly',false);
}

$(function(){
    $('.history select').change(function(){
        // カートクリア確認
        if( $(".history [name=history] option:selected").attr('class')==='popup-modal' ){
            $.magnificPopup.open({
                items: {src: '#inline-wrap_clear'},
                type: 'inline', 
                modal: false,
            }, 0);
            $(document).on('click', '.popup-modal-dismiss', function (e) {
                e.preventDefault();
                $.magnificPopup.close();
            });
        }
    });

    // 画面ロード中に操作出来ないようにする
    //document.addEventListener('touchmove', scrollOff, {passive: false})
    startTimeLimit()

    $('#remainingTime').change(function() {
      var timeLimit = $(this).val()
      var hm = timeLimit.slice(0,timeLimit.lastIndexOf(':'));
      if (hm != '') {
        var times = hm.split(':');
        if (times.length >= 2 && $.isNumeric(times[0]) && $.isNumeric(times[1])) {
          var displayTime = (parseInt(times[0] * 60) + parseInt(times[1]));
          $('#displayTime').text(displayTime)
          $('#limitUnitLabel').removeClass('d-none');
        }
      }
    })

    $('#remainingTime').change()

    // 読み込みが完了している場合、操作不可を解除
    if (document.readyState === 'complete') {
      document.removeEventListener('touchmove', scrollOff, {passive: false})
    }
    //document.removeEventListener('touchmove', scrollOff, {passive: false})
});

/**
 * カウントダウン処理
 *
 */
var startTimeLimit = function() {
  var ts = $('#endTime').val();
  // 終了時刻から
  if(ts === undefined) {
    return false;
  }
  var timeStamp = Date.parse( ts.replace( /-/g, '/') ) / 1000 + 60 - parseInt( new Date() /1000 );

  var timer = setInterval(function(){
      timeStamp--;
      var hour = timeStamp / 3600 | 0;
      var min = padZero((timeStamp) % 3600 / 60 | 0);
      var sec = padZero(timeStamp % 60);
      var remainingTime = ( hour + ':' + min + ':' + sec );

      if (timeStamp < 0) {
        remainingTime = "00:00:00";
        $('#remainingTime').val(remainingTime).change();
        clearInterval(timer);
        return false;
      }

      $('#remainingTime').val(remainingTime).change();

  },1000);

  function padZero(v) {
    if (v < 10) {
      return "0" + v;
    } else {
      return v;
    }
  }
}
