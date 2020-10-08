var maxCount = 5;			// 最大可够买的商品数量
var scroll = null;

// 展示购物车的商品数据
(function() {
	$.myAjax({
		type: 'post',
		url: '/cart/list',
		success: data => {
			showCartList(data);
		}
	});
})();

// 动态展示购物车列表
function showCartList(data) {
	if(data.length === 0) {
		$('.scroll-content>.detail-empty').addClass('active');
		$('.page-bottom').add('.cart-top').hide();
		$('.detail-top>span.edit').text(' ');
		return;
	}
	
	data.forEach(function(cart) {
		$(`
			<li data-id= '${ cart.id }' data-pid='${ cart.pid }' data-price='${ cart.price }' data-count='${ cart.count }' data-checked='1'>
				<div class="detail">
					<div class="image active normal">
						<img src="/images/icon_check_red.png" alt="" class="checkbox  checked active" />
						<img src="/images/icon_uncheck.png" alt="" class="checkbox unchecked" />
					</div>
					<div class="image edit" data-checked='0'>
						<img src="/images/icon_check_red.png" alt="" class="checkbox  checked" />
						<img src="/images/icon_uncheck.png" alt="" class="checkbox unchecked active" />
					</div>
					<a href="#">
						<div class="product">
							<img src="${ cart.avatar }" alt="" class="left" />
							<div class="text">
								<span class="name">${ cart.name }</span>
								<div class="price-count">
									<span class="price">￥${ cart.price.toFixed(2) }</span>
									<div class="count">
										<span class="btn-decrease ${ cart.count === 1 ? 'disabled' : '' }">-</span>
										<span class="content">${ cart.count }</span>
										<span class="btn-increase ${ cart.count === maxCount ? 'disabled' : '' }">+</span>
									</div>
								</div>
							</div>
						</div>
					</a>
				</div>
				<div class="service">
					<span class="left">服务</span>
					<span class="middle">安装服务|延长保障</span>
					<span class="right">选服务</span>
				</div>
			</li>
		`).appendTo('ul.cart-list');
	});
	// 更新页底的数据
	updateNumAndAccount();
}

// 更新总量和总价值
function updateNumAndAccount() {
	// 获取购物车中商品的总价值
	// 获取购物车中商品的总量
	var checkedCount = 0;		// 已选中商品的数量
	var account = 0;			// 已选中商品的总价值
	var deleteCount = 0; 		// 要删除的数量
	$('ul.cart-list>li').each(function(i,li) {
		if(parseInt($(li).attr('data-checked'))){
			account += parseInt($(li).attr('data-price')) * parseInt($(li).attr('data-count'));
			checkedCount += parseInt($(li).attr('data-count'));
			$('.page-bottom.normal>.left>.account-wrapper>span.account').text('￥'+account.toFixed(2));
			$('.page-bottom.normal>.right>span.button-settle>span.count').text(checkedCount);
		}
		if(parseInt($(li).find('.image.edit').attr('data-checked'))) {
			deleteCount += parseInt($(li).find('.image.edit').closest('li').attr('data-count'));
			$('.page-bottom.edit>.right>span.button-settle>span.count').text(`(${ deleteCount })`);
		}
	});
	if($('ul.cart-list>li[data-checked = 0]').length === $('ul.cart-list>li').length) {
		$('.page-bottom.normal>.left>.account-wrapper>span.account').text('￥'+ '0.00');
		$('.page-bottom.normal>.right>span.button-settle>span.count').text(0)
	}
	if($('ul.cart-list>li .image.edit[data-checked = 0]').length === $('ul.cart-list>li .image.edit').length) {
		$('.page-bottom.edit>.right>span.button-settle>span.count').text('')
	}
}


// 控制购物车中商品的数量
(function() {
	setTimeout(function() {
		// 减功能
		$('ul.cart-list>li span.btn-decrease').on('click', function() {
			if($(this).hasClass('disabled')) return;
			$(this).next().next().removeClass('disabled');
			var $li = $(this).closest('li');
			var num = $(this).next().text();
			$.myAjax({
				global: false,
				type: 'post',
				url: '/cart/decrease/' + $li.attr('data-id'),
				data: {
					pid: $li.attr('data-pid'),
					count: 1
				},
				success: data => {
					$(this).next().text(--num);
					$li.attr('data-count', num);
					updateNumAndAccount();
					$(this).toggleClass('disabled', parseInt($(this).next().text()) === 1);
				}
			});
		});
		// 加功能
		$('ul.cart-list>li span.btn-increase').on('click', function() {
			if($(this).hasClass('disabled')) return;
			$(this).prev().prev().removeClass('disabled');
			var $li = $(this).closest('li');
			var num = $(this).prev().text();
			$.myAjax({
				global: false,
				type: 'post',
				url: '/cart/increase/' + $li.attr('data-id'),
				data: {
					pid: $li.attr('data-pid'),
					count: 1
				},
				success: data => {
					$(this).prev().text(++num);
					$li.attr('data-count', num);
					updateNumAndAccount();
					$(this).toggleClass('disabled', parseInt($(this).prev().text()) === maxCount);
				}
			});
		});
	},400);
})();

// 单选复选联动
(function() {
	setTimeout(function() {
		// 单选联动复选
		$('ul.cart-list>li>.detail>.image.normal>img').on('click', function() {
			$(this).closest('li').attr('data-checked', $(this).hasClass('checked') ? '0' : '1');
			$(this).removeClass('active').siblings().addClass('active');
			if($('ul.cart-list>li[data-checked = 1]').length === $('ul.cart-list>li').length) {
				$('.page-bottom.normal>.left img.checked').add($('.cart-top>.left-wrapper.normal img.checked')).addClass('active').siblings().removeClass('active');
			}
			else {
				$('.page-bottom.normal>.left img.unchecked').add($('.cart-top>.left-wrapper.normal img.unchecked')).addClass('active').siblings().removeClass('active');
			}
			updateNumAndAccount();
		});
		// 编辑状态
		$('ul.cart-list>li>.detail>.image.edit>img').on('click', function() {
			$(this).parent().attr('data-checked', $(this).hasClass('checked') ? '0' : '1');
			$(this).removeClass('active').siblings().addClass('active');
			if($('ul.cart-list>li .image.edit[data-checked = 1]').length === $('ul.cart-list>li .image.edit').length) {
				$('.page-bottom.edit>.left img.checked').add($('.cart-top>.left-wrapper.edit img.checked')).addClass('active').siblings().removeClass('active');
			}
			else {
				$('.page-bottom.edit>.left img.unchecked').add($('.cart-top>.left-wrapper.edit img.unchecked')).addClass('active').siblings().removeClass('active');
			}
			updateNumAndAccount();
		});
		
		// 复选联动单选
		$('.page-bottom.normal>.left img').on('click', function() {
			if($(this).hasClass('checked')) {
				$(this).add($('.cart-top>.left-wrapper.normal img.checked')).removeClass('active').siblings().addClass('active');
				$('ul.cart-list>li .image.normal>img.checked').removeClass('active').siblings().addClass('active').closest('li').attr('data-checked', '0');
			}else {
				$(this).add($('.cart-top>.left-wrapper.normal img.unchecked')).removeClass('active').siblings().addClass('active');
				$('ul.cart-list>li .image.normal>img.unchecked').removeClass('active').siblings().addClass('active').closest('li').attr('data-checked', '1');
			}
			updateNumAndAccount();
		});
		
		$('.cart-top>.left-wrapper.normal img').on('click', function() {
			if($(this).hasClass('checked')) {
				$(this).add($('.page-bottom.normal>.left img.checked')).removeClass('active').siblings().addClass('active');
				$('ul.cart-list>li .image.normal>img.checked').removeClass('active').siblings().addClass('active').closest('li').attr('data-checked', '0');
			}else {
				$(this).add($('.page-bottom.normal>.left img.unchecked')).removeClass('active').siblings().addClass('active');
				$('ul.cart-list>li .image.normal>img.unchecked').removeClass('active').siblings().addClass('active').closest('li').attr('data-checked', '1');
			}
			updateNumAndAccount();
		});
		
		// 编辑状态
		$('.page-bottom.edit>.left img').on('click', function() {
			if($(this).hasClass('checked')) {
				$(this).add($('.cart-top>.left-wrapper.edit img.checked')).removeClass('active').siblings().addClass('active');
				$('ul.cart-list>li .image.edit>img.checked').removeClass('active').siblings().addClass('active').parent().attr('data-checked', '0');
			}else {
				$(this).add($('.cart-top>.left-wrapper.edit img.unchecked')).removeClass('active').siblings().addClass('active');
				$('ul.cart-list>li .image.edit>img.unchecked').removeClass('active').siblings().addClass('active').parent().attr('data-checked', '1');
			}
			updateNumAndAccount();
		});
		
		$('.cart-top>.left-wrapper.edit img').on('click', function() {
			if($(this).hasClass('checked')) {
				$(this).add($('.page-bottom.edit>.left img.checked')).removeClass('active').siblings().addClass('active');
				$('ul.cart-list>li .image.edit>img.checked').removeClass('active').siblings().addClass('active').parent().attr('data-checked', '0');
			}else {
				$(this).add($('.page-bottom.edit>.left img.unchecked')).removeClass('active').siblings().addClass('active');
				$('ul.cart-list>li .image.edit>img.unchecked').removeClass('active').siblings().addClass('active').parent().attr('data-checked', '1');
			}
			updateNumAndAccount();
		});
	}, 200);
})();

// page-content的头部绑定点击事件
(function() {
	imagesLoaded($('.page-content')[0], function() {
		setTimeout(function() {
			$('.page-content').on('scroll', function() {
				$('.page-top').toggleClass('active', $('.detail-top').offset().top < 0);
			});
		}, 20);
	});
	
	// 返回上一页
	$('.page-top>i').add('.detail-top>i').on('click', function() {
		var otherUrl = Cookies.get('otherUrl');
		Cookies.remove('otherUrl');
		window.location.href = otherUrl;
	});
	
	// 去逛逛
	$('.detail-empty>span.btn-go').on('click', function() {
		window.location.href = '/pages/index/index.html';
	});
	
	// 编辑
	setTimeout(function() {
		$('.page-top>span.edit').on('click', function() {
			if($(this).parent().hasClass('edit')) {
				$(this).text('编辑').parent().removeClass('edit');
				$('.detail-top>span.edit').text('编辑').parent().removeClass('edit');
				$('.cart-top>.left-wrapper.edit').add('.page-bottom.edit').removeClass('active').prev().addClass('active');
				$('ul.cart-list>li>.detail>.image.edit').removeClass('active').prev().addClass('active');
			}
			else {
				$(this).text('完成').parent().addClass('edit');
				$('.detail-top>span.edit').text('完成').parent().addClass('edit');
				$('.cart-top>.left-wrapper.edit').add('.page-bottom.edit').addClass('active').prev().removeClass('active');
				$('ul.cart-list>li>.detail>.image.edit').addClass('active').prev().removeClass('active');
			}
		});
		
		$('.detail-top>span.edit').on('click', function() {
			if($(this).parent().hasClass('edit')) {
				$(this).text('编辑').parent().removeClass('edit');
				$('.page-top>span.edit').text('编辑').parent().removeClass('edit');
				$('.cart-top>.left-wrapper.edit').add('.page-bottom.edit').removeClass('active').prev().addClass('active');
				$('ul.cart-list>li>.detail>.image.edit').removeClass('active').prev().addClass('active');
			}
			else {
				$(this).text('完成').parent().addClass('edit');
				$('.page-top>span.edit').text('完成').parent().addClass('edit');
				$('.cart-top>.left-wrapper.edit').add('.page-bottom.edit').addClass('active').prev().removeClass('active');
				$('ul.cart-list>li>.detail>.image.edit').addClass('active').prev().removeClass('active');
			}
		});
	}, 20);
	
	// 删除
	setTimeout(function() {
		var ids = [];
		$('.page-bottom.edit span.button-settle').on('click', function() {
			console.log(111);
			$('.image.edit').each(function(i,item) {
				if($(item).attr('data-checked') === '1') {
					ids.push($(item).closest('li').attr('data-id'));
				}
			});
			$.myAjax({
				global: false,
				type: 'post',
				url: '/cart/remove',
				data: {
					ids
				},
				success: data => {
					ids.forEach(function(item) {
						$(`ul.cart-list>li[data-id=${ item }]`).remove();
					});
					window.location.href = window.location.href;
				}
			});
		});
	}, 30);
})();

// 结算
(function() {
	$('.page-bottom.normal>.right>span.button-settle').on('click', function() {
		if($('ul.cart-list>li[data-checked = 1]').length === 0) {
			$.alert('您没有勾选任何商品,无法生成订单');
			return;
		}
		$.confirm('确定吗', function() {
			var ids = '';
			$('ul.cart-list>li').each(function(i,item) {
				if($(item).attr('data-checked') === '1')
					ids += $(item).attr('data-id') + ' ';
			});
			Cookies.set('ids', ids);
			window.location.href = '/pages/order_confirm/order_confirm.html' ;
		});
	});
})();





















