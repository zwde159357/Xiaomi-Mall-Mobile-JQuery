var userName = Cookies.get('user');

// 绑定点击事件
(function() {
	$('.first>.my-order').on('click', function() {
		if(userName) {
			window.location.href = '/pages/order/order.html';
		}
		else {
			var backUrl = window.location.href;
			Cookies.set('backUrl', backUrl);
			window.location.href = '/pages/login/login.html';
		}
	});
	
	$('.second>.my-address').on('click', function() {
		if(userName) {
			window.location.href = '/pages/address/address.html';
		}
		else {
			var backUrl = window.location.href;
			Cookies.set('backUrl', backUrl);
			window.location.href = '/pages/login/login.html';
		}
	});
	
	$('ul.nav>li:nth-child(4)').on('click', function() {
		if(userName) {
			var otherUrl = window.location.href;
			Cookies.set('otherUrl', otherUrl);
			window.location.href = '/pages/cart/cart.html';
		}
		else {
			var backUrl = window.location.href;
			Cookies.set('backUrl', backUrl);
			window.location.href = '/pages/login/login.html';
		}
	});
	
	$('.page-top>span.go-to-login').add($('.page-top>i.close')).on('click', function() {
		var backUrl = window.location.href;
		Cookies.set('backUrl', backUrl);
		window.location.href = '/pages/login/login.html';
	});
	
	if(userName) {
		$('.page-top>span.go-to-login').removeClass('active').next().addClass('active').text(userName);
		$('.page-content>.forth').addClass('active');
	}
	
	$('.page-content>.forth').on('click', function() {
		$('.page-top>span.go-to-login').addClass('active').next().removeClass('active');
		$('.page-content>.forth').add($('ul.nav>li:nth-child(4) span.count')).removeClass('active');
		$('.page-top>i.close').addClass('active')
		Cookies.remove('user');
		sessionStorage.removeItem('token');
	});
})();

// 购物车中商品数量
(function() {
	if(userName) {
		$('.page-top>i.close').removeClass('active');
		$.myAjax({
			type: 'get',
			url: '/cart/total',
			success: data => {
				$('.page-footer>ul.nav>li>a>span.count').addClass('active').text(data);
			}
		});
	}else {
		$('.page-footer>ul.nav>li>a>span.count').removeClass('active');
	}
})();