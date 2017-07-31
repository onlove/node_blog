/**
 * Created by DT274 on 2017/7/25.
 */
$(function() {
    var $loginBox = $("#loginBox");
    var $registerBox = $("#registerBox");
    var $userInfo = $("#userInfo");

    $loginBox.find('a').on('click', function() {
        $registerBox.show();
        $loginBox.hide();
    });

    $registerBox.find('a').on('click', function() {
        $registerBox.hide();
        $loginBox.show();
    });

    $registerBox.find('button').on('click', function() {
        $.ajax({
            url: '/api/user/register',
            type: 'post',
            data: {
                username: $registerBox.find('[name="username"]').val(),
                password: $registerBox.find('[name="password"]').val(),
                repassword: $registerBox.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function(result) {
                $registerBox.find('.colWarning').html(result.message);
                if (!result.code) {
                    setTimeout(function() {
                        $registerBox.hide();
                        $loginBox.show();
                    }, 1000)
                }
            }
        })
    });

    $loginBox.find('button').on('click', function() {
        $.ajax({
            url: '/api/user/login',
            type: 'post',
            data: {
                username: $loginBox.find('[name="username"]').val(),
                password: $loginBox.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function(result) {
                $loginBox.find('.colWarning').html(result.message);
                if (!result.code) {
                   location.reload()
                }
            }
        })
    });

    $("#logout").on('click', function() {
        $.ajax({
            url: 'api/user/logout',
            success: function (result) {
                if (!result.code) {
                    location.reload();
                }
            }
        })
    })
});