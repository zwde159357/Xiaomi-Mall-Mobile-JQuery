var userName = Cookies.get('user');

function showMainCategory(data) {
	data.forEach(function(item, i) {
		$(`
			<li data-id="${ item.id }" data-avatar= '${ item.avatar }'>
				<span>${ item.name }</span>
			</li>
		`).appendTo('ul.category-main');
	});
	$('ul.category-main>li').on('click', function() {
		// 一级分类选中样式的切换
		if($(this).hasClass('active')) return;
		$(this).addClass('active').siblings('.active').removeClass('active');
		// 右上角对应激活的一级分类avatar
		$('.right').children().remove();
		$(`
			<div class='image-wrapper'>
				<img src="${ $(this).attr('data-avatar') }" alt="" />
			</div>
		`).appendTo('.right');
		// 更新显示激活的一级分类的所有二级分类
		$.myAjax({
			type: 'get',
			url: `/category/list/${ $(this).attr('data-id') }`,	//请求的url地址
			// 请求成功后返回结果后的回调函数
			success: data => {
				showSubCategory(data);
			}
		});
	});
}

function showSubCategory(data) {
	if(data.length === 0) {
		$(`
			<p>暂无相关商品</p> 
		`).appendTo('.right');
	}
	else {
		for(var i = 0 ;i < data.length / 6; i++) {
			$(`
				<div class='ul-wrapper'>
					<span>${ i < 1 ? '为你推荐' : '精选' }</span>
					<ul class="category-sub"></ul>
				</div>
			`).appendTo('.right');
		}
		data.forEach(function(item, i) {
			$(`
				<li>
					<a href='/pages/list/list.html?cid=${ item.id }'>
						<div class='image-wrapper'>
							<img src="${ item.avatar }" alt="" />
						</div>
						<span>${ item.name }</span>
					</a>
				</li>
			`).appendTo($('ul.category-sub').eq(`${ i < 6 ? '0' : '1' }`));
		});
	}
}

$.myAjax({
	type: 'get',
	url: '/category/list/0',	//请求的url地址
	// 命令ajax把回来数据当json字符串parse处理以后再作为参数调用
	// 请求成功后返回结果后的回调函数
	success: data => {
		showMainCategory(data);
		$('ul.category-main>li').eq(0).trigger('click');
	}
});

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