// 切换登录方式
(function() {
	$('span.switch').on('click', function() {
		if($('input.phone').hasClass('active')) {
			$(this).text('手机验证码登录');
			$('input.phone').add($('input.code')).removeClass('active').next().addClass('active');
			$('span.phone-icon').add($('span.code-icon')).removeClass('active');
			$('i.eye').add($('i.keyboard')).addClass('active');
			$('.no-code').removeClass('active').next().addClass('active');
		}
		else {
			$(this).text('用户名密码登录');
			$('input.username').add($('input.pwd')).removeClass('active').prev().addClass('active');
			$('span.phone-icon').add($('span.code-icon')).addClass('active');
			$('i.eye').add($('i.keyboard')).removeClass('active');
			$('.go-to-register').removeClass('active').prev().addClass('active');
		}
	});
	
})();

// 获取验证码
(function() {
	$('span.code-icon').on('click', function() {
		var codes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q',
					 'R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
		var codeStr = '';
		for(var i = 0; i < 4; i++) {
			codeStr += codes[Math.floor(Math.random()*codes.length)];
		}
		$(this).text(codeStr);
	});
})();

// 登录
(function() {
	$('.button-wrapper>span.login').on('click', function() {
		if($('input.phone').hasClass('active')) {
			var phone = $('input.phone').val();
			var code = $('input.code').val();
		}else {
			var userName = $('input.username').val();
			var pwd = $('input.pwd').val();
			$.myAjax({
				type: 'post',
				url: '/user/login_pwd',
				data: {
					name: userName,
					pwd
				},
				success: data => {
					sessionStorage.setItem('token',data);
					Cookies.set('user', userName);
					var backUrl = Cookies.get('backUrl');
					Cookies.remove('backUrl');
					window.location.href = backUrl;
				}
			});
		}
	});
})();

// 绑定点击事件
(function() {
	$('.page-container>img.back').on('click', function() {
		var backUrl = Cookies.get('backUrl');
		Cookies.remove('backUrl');
		window.location.href = backUrl;
	});
})();









