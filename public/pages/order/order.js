var myTimer = null;
var timeDiff = 0.01 * 3600 * 1000;  
// 绑定点击事件
(function() {
	// 回到个人中心
	$('.page-top>.top>img.back').on('click', function() {
		window.location.href = '/pages/personal/personal.html';
	});
})();

// 选项卡切换
(function() {
	$('.page-content>.content-wrapper').eq(0).show().siblings('.content-wrapper').hide();
	$('.page-top ul.title-wrapper>li').on('click', function() {
		if($(this).find('span').hasClass('active')) return;
		$(this).find('span').addClass('active').parent().siblings().find('span').removeClass('active');
		$('.page-content>.content-wrapper').eq($(this).index()).show().siblings('.content-wrapper').hide();
	});
})();

// 动态渲染数据
function show() {
	// 全部
	$.myAjax({
		url: '/order/list_all',
		success: data => {
			showOrder(data, 0);
		}
	});
	// 待付款
	$.myAjax({
		url: '/order/list_unpay',
		success: data => {
			var myData = data.filter(item => item.pay === 0 && new Date(item.orderTime).getTime() + timeDiff - new Date().getTime() > 0);
			showOrder(myData, 1);
		}
	});
	// 已付款
	$.myAjax({
		url: '/order/list_pay',
		success: data => {
			showOrder(data, 2);
		}
	});
};

(function() {
	show();
})();

function showOrder(myData,k) {
	if(myData.length === 0) {
		$(`.content-wrapper:eq(${ k })>.wrapper`).addClass('active');
		$(`.content-wrapper:eq(${ k })>.order-list`).hide();
		$(`ul.title-wrapper>li:eq(${ k })>span.num`).hide();
		return;
	}
	$(`ul.title-wrapper>li:eq(${ k })>span.num`).text(myData.length);
	var state = '';
	myData.forEach(function(item,i) {
		if(item.pay) 
			state = '待收货';
		else
			state = new Date(item.orderTime).getTime() + timeDiff - new Date().getTime() > 0 ? '待付款' : '已取消';
		var countAll = 0;
		$(`
			<li data-id='${ item.orderId }'>
				<div class="order-title">
					<div class="left">
						<img src="/images/milogo.png" alt="" />
						<span class="title">小米自营</span>
					</div>
					<span class="right">${ state } </span>
				</div>
				<div class="product-wrapper">
				</div>
				<div class="account-wrapper">
					<span class='text'>共有<span class="num">0</span>商品，
					总金额<span class="account">￥${ item.account.toFixed(2) }</span></span>
				</div>
				<div class="btn-wrapper zero ${ state === '已取消' ? 'active' : '' }">
					<span class="btn-delete">删除订单</span>
					<span class="btn-rebuy">再次购买</span>
				</div>
				<div class="btn-wrapper one ${ state === '待付款' ? 'active' : '' }">
					<span class="time">剩余时间00:00:00</span>
					<span class="btn-pay">付款</span>
				</div>
				<div class="btn-wrapper two ${ state === '待收货' ? 'active' : '' } ">
					<span class="btn-delete">删除订单</span>
					<span class="btn-refund">退款</span>
				</div>
			</li>
		`).appendTo(`.content-wrapper:eq(${ k }) ul.order-list`);
		
		if(state.indexOf('待付款') !== -1) {
			var endTime = new Date(item.orderTime).getTime()  + timeDiff;
			timer(endTime,k);
		}
		
		item.details.forEach(function(item2) {
			countAll += item2.count;
			$(`
				<div class="detail-product" data-id='${ item2.id }'>
					<img src="${ item2.avatar }" alt="" />
					<div class="right">
						<div class="name-price">
							<span class="name">${ item2.name }</span>
							<span class="price">￥${ item2.price.toFixed(2) }</span>
						</div>
						<span class="count">x${ item2.count }</span>
					</div>
				</div>
			`).appendTo(`.content-wrapper:eq(${ k }) ul.order-list>li:eq(${ i })>.product-wrapper`);
		});
		$(`.content-wrapper:eq(${ k }) ul.order-list>li:eq(${ i })>.account-wrapper>span.text>span.num`).text(countAll);
	});
};

function timer(endTime,k) {
	setTimeout(function() {
		myTimer = setInterval(function() {
			var diff = endTime - new Date().getTime();
			if(diff <= 0) {
				clearInterval(myTimer);
				$.notice('订单已取消');
				$(`.content-wrapper:eq(${ k }) ul.order-list>li>.order-title>span.right`).text('已取消');
				$(`.content-wrapper:eq(${ k }) ul.order-list>li>.btn-wrapper.zero`).addClass('active').siblings('.btn-wrapper').removeClass('active');
				$(`.content-wrapper ul.order-list`).empty();
				show();
				window.location.href = window.location.href;
				return;
			}
			var hourTen = 0;
			var hourBit = parseInt(diff / 3600000) ;
			var minuteTen = parseInt(diff % 3600000 / 60000 / 10);
			var minuteBit = parseInt(diff % 3600000 / 60000 % 10);
			var secondTen = parseInt(diff % 3600000 % 60000 / 1000 / 10);
			var secondBit = parseInt(diff % 3600000 % 60000 / 1000 % 10);
			
			$(`.content-wrapper:eq(${ k }) ul.order-list>li>.btn-wrapper.one span.time`).text(`剩余时间${ hourTen }${ hourBit }:${ minuteTen }${ minuteBit }:${ secondTen }${ secondBit }`);
			
		}, 1000);
	}, 200);
}

// 删除订单
(function() {
	setTimeout(function() {
		// 删除订单
		$('ul.order-list>li>.btn-wrapper>span.btn-delete').on('click', function() {
			var state = $(this).parent().siblings('.order-title').find('span.right').text();
			var orderId = $(this).closest('li').attr('data-id');
			
			// 当订单已取消
			if(state.indexOf("已取消") !== -1) {
				$.myAjax({ 
					global: false,
					url: '/order/remove/' + orderId,
					success: data => {
						window.location.href = window.location.href;
					}
				});
			}
			
			// 当订单待发货
			if(state.indexOf("待收货") !== -1) {
				$.confirm('您购买的商品正在路上，确定删除吗', function() {
					$.myAjax({
						global: false,
						url: '/order/remove/' + orderId,
						success: data => {
							window.location.href = window.location.href;
						}
					});
					
				});
			}
			
		});
		// 重新购买
		$('ul.order-list>li>.btn-wrapper>span.btn-rebuy').on('click', function() {
			var state = $(this).parent().siblings('.order-title').find('span.right').text();
			var orderId = $(this).closest('li').attr('data-id');
			// 当订单已取消
			if(state.indexOf("已取消") !== -1) {
				$(this).closest('li').find('.product-wrapper').children().each(function(i,item) {
					var count = $(item).find('.right>span.count').text().slice(1,);
					var id = $(item).attr('data-id');
					$.myAjax({
						type: 'post',
						url: '/cart/add',
						data: {
							pid: id,
							count
						},
						success: data => {
							
						}
					});
				});
				$.myAjax({
					url: '/order/remove/' + orderId,
					success: data => {
						Cookies.set('otherUrl', window.location.href);
						window.location.href = '/pages/cart/cart.html';
					}
				});
			}
		});
		
		// 付款
		$('ul.order-list>li>.btn-wrapper>span.btn-pay').on('click', function() {
			var orderId = $(this).closest('li').attr('data-id');
			$.confirm('确定要付款吗', function() {
				Cookies.set('id', orderId);
				window.location.href = '/pages/pay/pay.html';
			});
		});
		
		// 退款
		$('ul.order-list>li>.btn-wrapper>span.btn-refund').on('click', function() {
			$.confirm('确定要退款吗，不要后悔呦', function() {
				$.alert('进我口袋的钱也想要，没门');
			});
		});
	}, 200);
})();









