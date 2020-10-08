var getIds = Cookies.get('ids').trim().split(' '); 
var ids = [];
var account = 0;
var addressId = 0;

getIds.forEach(function(item) {
	ids.push(parseInt(item));
});

// 绑定点击事件
(function() {
	// 返回购物车列表
	$('.content-top>.top>i.back').on('click',function() {
		Cookies.remove('ids');
		window.location.href = '/pages/cart/cart.html';
	});
	
	setTimeout(function() {
		// 去地址页面
		$('.content-top>.bottom>i.go-address').add('.content-top>.no-bottom>i.go-address').on('click',function() {
			var backUrl = window.location.href;
			Cookies.set('backUrl', backUrl);
			window.location.href = '/pages/address/address.html';
		});
	}, 1000);
	
	// 提交订单
	$('.page-footer>span.btn-generate-order').on('click', function() {
		if(addressId === 0) {
			$.alert('送货地址为空，请添加');
			return;
		}
		$.myAjax({
			type: 'post',
			url: '/order/confirm',
			data: {
				ids,
				account,
				addressId
			},
			success: data => {
				Cookies.remove('ids');
				Cookies.remove('otherUrl');
				Cookies.set('id', data);
				window.location.href = '/pages/pay/pay.html';
			}
		});
	});
})();

// 获取默认地址并展示
(function() {
	$.myAjax({
		type: 'get',
		url: '/address/get_default',
		success: data => {
			showDefaultAddress(data);
		}
	});
})();

function showDefaultAddress(data) {
	if(data === null) {
		$('.content-top>.bottom').removeClass('active').next().addClass('active');
		return;
	}
	$('.content-top>.bottom').append(`
		<div class="wrapper">
			<span class="name">${ data.receiveName }</span>
			<span class="phone">${ data.receivePhone }</span>
		</div>
		<span class="address">${ data.receiveRegion } ${ data.receiveDetail }</span>
		<i class="iconfont icon-arrow-right go-address"></i>
	`);
	addressId = data.id;
}

// 获取勾选的商品并展示
(function() {
	$.myAjax({
		type: 'post',
		url: '/cart/list_ids',
		data: {
			ids,
		},
		success: data => {
			showProductList(data);
		}
	});
})();

function showProductList(data) {
	data.forEach(function(item) {
		$(`
			<li>
				<div class="product-wrapper">
					<img src="${ item.avatar }" alt="" />
					<div class="detail-wrapper">
						<span class="name">${ item.name }</span>
						<div class="count-wrapper">
							<span class="price">￥${ item.price }</span>
							<span class="count">x${ item.count }</span>
						</div>
						<span class="text">七天无理由退换</span>
					</div>
				</div>
				<div class="give">
					<span class="title">赠品</span>
					<span class="text">保修服务2年</span>
					<span class="count">x1</span>
				</div>
			</li>
		`).appendTo('ul.selected-product');
		account += item.count * item.price;
	});
	$('.account-wrapper>.account>span.text').add('.page-footer span.account').text('￥' + account.toFixed(2));
}















