$(document).ready(function() {
    var hSize = $(window).innerHeight();
    $('.modal-dialog').height(hSize - 56);

    $('#hamburgerBtn').on('click', function(e) {
        $('#hamburger').addClass('open')
        $('#screen').show()
        e.stopPropagation()
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
    })

    $(document).on('click', function(e) {
        if($('#dauth_modal').length){
            if ((!document.getElementById('hamburger').contains(e.target) && !document.getElementById('select-lang').contains(e.target) &&
                 !document.getElementById('call-staff').contains(e.target) && !document.getElementById('dauth_modal').contains(e.target) && 
                 !document.getElementById('edit-nickname').contains(e.target))) {
                $('#hamburger').removeClass('open')
                $('#screen').hide()
                document.removeEventListener('touchmove', handleTouchMove, { passive: false });
            }
        }
    })

    $('#hamburger-nickname').focus(function() {
        this.selectionStart = $('#hamburger-nickname').val().length;
        this.selectionEnd = $('#hamburger-nickname').val().length + 1;
    })

    // 店員を呼ぶボタン押下時
    $('.call-btn').on('click', function() {
        $('.modal').modal('hide');
        $.ajax({
                headers: { 'X-CSRF-TOKEN': $('input[name="_token"]').val() },
                url: $('input[name="call_staff_action_url"]').val(),
                type: 'post',
            })
            .done(function(response) {
                $('.btn-call-staff').css('display', 'none')
                $('.call-staff').css('display', 'block')

                let staff_call_button_change = parseInt($('.staff_call_button_change').val()) * 1000

                setTimeout(function() {

                    $('.btn-call-staff').css('display', 'block')
                    $('.call-staff').css('display', 'none')
                }, staff_call_button_change);

            })
        return false
    })

    // ニックネーム登録・編集
    $('.nickname-btn').on('click', function() {
        var errors;
        var guestId =  $('input[name="guest_id"]').val();
        // ニックネームの初期値（Ｇ＋ゲストID）
        var initialNickname = 'Ｇ' + toFullWidth(('00' + guestId).slice(-2));

        var form = document.forms["nickname_settings"];
        var url = $('input[name="edit_nickname_action_url"]').val();
        var nickname = $('input[name="hamburger-nickname"]').val();
        var applocale = $('input[name="applocale"]').val();

        $('.alert').hide();
        $('.alert_message').html('');
        $('.alert_non_space').hide();
        
        // ニックネーム編集にて空白文字が設定されている場合
        if (nickname !== undefined && nickname.length > 0 && nickname.match(/\s/g)) {
            $('.alert').show();
            $('.alert_non_space').show();
            return false;
        }

        // ニックネームが未入力なら初期値を入れる
        if(nickname.length == 0) {
            nickname = initialNickname;
            form['hamburger-nickname'].value = nickname;
        }

        $.ajax(url, {
            headers: { 'X-CSRF-TOKEN': $('input[name="_token"]').val() },
            type: 'post',
            data: $(form).serialize(),
        }).done(function(response) {
            // phpでExceptionが発生した場合、responseに何かはいってくる
            if(response.length != 0) {
                location.href = $('input[name="errorUrl"]').val();
            }

            // 正常終了時はドロワーのアイコンとニックネームを更新
            if(nickname == initialNickname) {
                // G + ゲストID
                $('#upper-nickname').html(nickname.substr(0, 1));
                $('#lower-nickname').html(nickname.substr(1, 3));
                $('#middle-nickname').html('');
                var defaultName = $('#guest-name').data('default');
                if (defaultName) {
                    $('#guest-name').html(defaultName);
                }
                $("#upper-nickname").addClass("guest-label guest-label-fix");
                $("#lower-nickname").addClass("id-num id-num-fix");
                $('#middle-nickname').removeClass("id-num_nickname");

                // ヘッダーも連動させる
                $('#upper-nickname-header').html(nickname.substr(0, 1));
                $('#lower-nickname-header').html(nickname.substr(1, 3));
                $('#middle-nickname-header').html('');
                $("#upper-nickname-header").addClass("guest-label guest-label-fix");
                $("#lower-nickname-header").addClass("id-num id-num-fix");
                $('#middle-nickname-header').removeClass("id-num_nickname");
            }else if(nickname.substr(2, 2) == ''){
                $('#middle-nickname').html(nickname.substr(0 ,2));
                $('#upper-nickname').html('');
                $('#lower-nickname').html('');
                $('#guest-name').html(nickname);
                $("#middle-nickname").addClass("id-num_nickname");
                $("#upper-nickname").removeClass("guest-label guest-label-fix");
                $("#lower-nickname").removeClass("id-num id-num-fix");

                // ヘッダーも連動させる
                $('#middle-nickname-header').html(nickname.substr(0 ,2));
                $('#upper-nickname-header').html('');
                $('#lower-nickname-header').html('');
                $("#middle-nickname-header").addClass("id-num_nickname");
                $("#upper-nickname-header").removeClass("guest-label guest-label-fix");
                $("#lower-nickname-header").removeClass("id-num id-num-fix");
            } else {
                $('#upper-nickname').html(nickname.substr(0 ,2));
                $('#lower-nickname').html(nickname.substr(2, 2));
                $('#middle-nickname').html('');
                $('#guest-name').html(nickname);
                $("#upper-nickname").addClass("guest-label guest-label-fix");
                $("#lower-nickname").addClass("id-num id-num-fix");
                $('#middle-nickname').removeClass("id-num_nickname");

                // ヘッダーも連動させる
                $('#upper-nickname-header').html(nickname.substr(0 ,2));
                $('#lower-nickname-header').html(nickname.substr(2, 2));
                $('#middle-nickname-header').html('');
                $("#upper-nickname-header").addClass("guest-label guest-label-fix");
                $("#lower-nickname-header").addClass("id-num id-num-fix");
                $('#middle-nickname-header').removeClass("id-num_nickname");
            }
            $('.modal').modal('hide');
        }).fail(function (response) {
            // バリデーションNGのとき
            if (arguments[0].status === 422) {
                errors = arguments[0].responseJSON['errors'];

                // メッセージエリア初期化
                $('.alert_message').html('');

                // errorsは2次元配列になっているので、このかたち
                $.each(errors, function(key, values){
                    $.each(values, function(index, value){
                        $('.alert_message').append(value + '<br>');
                    });
                });
                $('.alert').show();
                $('.alert_message').show();
            } else {
                location.href = $('input[name="errorUrl"]').val();
            }
        });
        return false;
    })
});

// ページをリサイズした時の処理
$(window).resize(function() {
    var hSize = $(window).innerHeight();
    $('.modal-dialog').height(hSize - 56); // アドレスバーを除いたサイズを付与
});

function handleTouchMove(event) {
  event.preventDefault();
}

//半角を全角に置換（英数字のみ）
var toFullWidth = function(value) {
    if (!value) return value;
    return String(value).replace(/[!-~]/g, function(all) {
        return String.fromCharCode(all.charCodeAt(0) + 0xFEE0);
    });
};
