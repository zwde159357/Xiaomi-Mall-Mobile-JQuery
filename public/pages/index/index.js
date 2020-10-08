var userName = Cookies.get('user');

var mySwiper = new Swiper('.swiper-container', {
	autoplay: {
		delay: 2000,
		disableOnInteraction: false
	},
	loop: true,
	pagination: {
		el: ".swiper-pagination",
		clickable: false,
	}
});

// 登录后购物车显示购物车商品数量
(function() {
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
})();

// 购物车中商品数量
(function() {
	if(userName) {
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







