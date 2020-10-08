var timer = null;		// 定义计时器
var startTime = 0;		// 订单开始时间
var endTime = 0;		// 订单结束时间
var id = Cookies.get('id');
var state = 0;

// 获取总金额
(function() {
	$.myAjax({
		type: 'get',
		url: '/order/account/' + id,
		success: data => {
			$('.content-top>span.account').add('.pay-wrapper>span.account')
			.add('.page-footer>span.btn-pay>span.account').text('￥' + data.toFixed(2));
		}
	});
})();

// 给返回绑定点击事件
(function() {
	$('.page-top>img.back').on('click', function() {
		if(state) 
			window.location.replace('/pages/order/order.html');
		else
			$.confirm('您还没有支付，确定退出吗', function() {
				window.location.replace('/pages/order/order.html');
			});
	});
})();

// 给付款方式绑定点击事件
(function() {
	$('.pay-top').on('click', function() {
		if($(this).find('img.checked').hasClass('active')) return;
		$(this).next().find('img.checked').removeClass('active').prev().addClass('active');
		$(this).find('img.unchecked').removeClass('active').next().addClass('active');
	});
	
	$('.pay-bottom').on('click', function() {
		if($(this).find('img.checked').hasClass('active')) return;
		$(this).prev().find('img.checked').removeClass('active').prev().addClass('active');
		$(this).find('img.unchecked').removeClass('acitve').next().addClass('active');
	});
})();

// 绑定支付页面点击事件
(function() {
	$('.page-footer>span.btn-pay').on('click', function() {
		$('.pay-wrapper').add('.curtain').addClass('active');
	});
	
	$('.pay-wrapper>.btn-wrapper>span.cancel').add('i.close').on('click', function() {
		$('.pay-wrapper').add('.curtain').removeClass('active');
	});
	
	$('.pay-wrapper>.btn-wrapper>span.pay').on('click', function() {
		$.confirm('确定支付吗', function() {
			$.myAjax({
				url: '/order/pay/' + id,
				success: data => {
					state = 1;
					$('.pay-wrapper>.btn-wrapper>span.pay').text('已支付');
					Cookies.remove('id');
					clearInterval(timer);
				}
			});
		});
	});
})();

// 计时器
(function() {
	$.myAjax({
		url: '/order/list_all',
		success: data => {
			startTime = new Date(data.find(item => item.orderId === id).orderTime).getTime();
			endTime = startTime + 0.01*3600*1000;
		}
	});
	
	setTimeout(function() {
		timer = setInterval(function() {
			var diff = endTime - new Date().getTime();
			if(diff <= 0) {
				clearInterval(timer);
				$.notice('订单已取消');
				return;
			}
			var hourTen = 0;
			var hourBit = parseInt(diff / 3600000) ;
			var minuteTen = parseInt(diff % 3600000 / 60000 / 10);
			var minuteBit = parseInt(diff % 3600000 / 60000 % 10);
			var secondTen = parseInt(diff % 3600000 % 60000 / 1000 / 10);
			var secondBit = parseInt(diff % 3600000 % 60000 / 1000 % 10);
			
			$('.page-content>.content-top>span.timer').text(`支付剩余时间${ hourTen }${ hourBit }:${ minuteTen }${ minuteBit }:${ secondTen }${ secondBit }`);
			
		}, 1000);
	}, 200);
})();






