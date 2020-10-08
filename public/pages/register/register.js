var phoneResult = 0;
var nameResult = 0;
var pwdResult = 0;
var repwdResult = 0;


// 表单验证
var valid = $('form.content').Validform({
	tiptype: 3,
	datatype: {
		phone: function(gets) {
			var reg = /1[34578][0123456789]\d{8}/;
			if(gets.length !== 11 ) return false;
			if(!reg.test(gets)) return false;
			$.ajax({
				global: false,
				async: false,
				type: 'get',
				url: '/user/check_phone/' + gets,
				success: response => {
					if(response.code === 200) {
						result = response.data === 0 ? true : '手机号已存在';
					} else {
						result = response.msg;
					}
				}
			});
			phoneResult = 1;
			return result;
		},
		name: function(gets) {
			var reg = /^\w{5,16}$/;
			if(!reg.test(gets)) return false;
			$.ajax({
				global: false,
				async: false,
				type: 'get',
				url: '/user/check_name/' + gets,
				success: response => {
					if(response.code === 200) {
						result = response.data === 0 ? true : '用户名已存在';
					} else {
						result = response.msg;
					}
				}
			});
			nameResult = 1;
			return result;
		},
		pwd: function(gets) {
			var reg = /^\d{3,16}$/;
			if(!reg.test(gets)) return false;
			pwdResult = 1;
			return true;
		},
		repwd: function(gets,obj,curform) {
			var pwd = $(curform).find('.pwd-wrapper>input').val();
			if(gets === '') return false;
			if(pwd !== gets) return false;
			repwdResult = 1;
			return true;
		}
		
	}
});

// 获取验证码
(function() {
	$('span.icon-code').on('click', function() {
		var codes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q',
					 'R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
		var codeStr = '';
		for(var i = 0; i < 4; i++) {
			codeStr += codes[Math.floor(Math.random()*codes.length)];
		}
		$(this).text(codeStr);
	});
})();

// 点击立即注册
(function() {
	$('.content>span.btn-register').on('click', function() {
		if(!phoneResult) {
			$.alert('手机号码错误或已存在');
			return;
		}
		if(!nameResult) {
			$.alert('用户名错误或已存在');
			return;
		}
		if(!pwdResult) {
			$.alert('密码格式错误');
			return;
		}
		if(!repwdResult) {
			$.alert('两次密码不一致');
			return;
		}
		var  textVal= $(this).siblings('.code-wrapper').find('span.icon-code').text();
		var  inputVal=  $(this).siblings('.code-wrapper').find('input').val();
		if(inputVal.toUpperCase() !== textVal) {
			$.alert('验证码输入错误');
		}
			
		$.myAjax({
			type: 'post',
			url: '/user/register',
			data: {
				name: $('.name-wrapper>input').val(),
				pwd: $('.pwd-wrapper>input').val(),
				phone: $('.phone-wrapper>input').val()
			},
			success: data => {
				window.location.href = '/pages/login/login.html';
			},
			error: error => {}
		});
		
	});
})();

// 绑定点击事件
(function() {
	$('.page-container>img.back').on('click', function() {
		window.location.href = '/pages/login/login.html';
	});
})();
































