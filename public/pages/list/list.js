// 全局变量
// 分类的id
var cid = parseInt(window.location.search.slice(window.location.search.lastIndexOf('=') + 1));
var searchName = '';		// 要搜索的关键字
var orderDir = 'asc';		// 表示当前排序方向
var orderCol = 'price';		// 表示当前的列
var pageSize = 6;			// 每次可以看多少条商品
// 要从第几个数据开始


var isLoading = false;		// 标识当前是否处于ajax交互状态
var hasMore = true;			// 标识按当前条件查找商品还有没有更多
var scroll = null;			// 保存滚动对象
// 页面加载完成后首次渲染
updateProductList();

// 显示模式改变
(function() {
	$('i.show-mode').on('click', function() {
		$(this).toggleClass('icon-card icon-list');
		$('ul.product-list').toggleClass('list card');
		initOrRefreshScroll();
	});
})();

// 切换排序方向
(function() {
	$('i.order-dir').on('click', function() {
		if(isLoading) { $.notice('您的操作太频繁了..'); return; }
		$(this).toggleClass('icon-sort-asc icon-sort-desc');
		orderDir = orderDir === 'asc' ? 'desc' : 'asc';
		updateProductList();
	});
})();

// 切换排序的列
(function() {
	$('span.order-col').on('click', function() {
		if($(this).hasClass('active')) return;
		if(isLoading) { $.notice('您的操作太频繁了..'); return; }
		$(this).addClass('active').siblings('.active').removeClass('active');
		orderCol = $(this).attr('data-order-col');
		updateProductList();
	});
})();

// 更新列表
function updateProductList(isLoadMore = false) {
	isLoading = true;			// 进入loading状态
	if(!isLoadMore) {
		$('i.rocket').hide();
		if(scroll) scroll.scrollTo(0,0,0);
		$('ul.product-list').empty(); // 根据是否加载更多来处理ul.product-list
	}	
	$('p.info').text('加载中..');		// 更新提示文本
	setTimeout(function() {
		$.myAjax({
			global: false,
			type: 'post',
			url: '/product/list',
			data: {
				name: searchName,
				cid,				// ES6技术，键值对简写
				orderCol,
				orderDir,
				begin: $('ul.product-list>li').length,
				pageSize
			},
			success: data => {
				isLoading = false;		// 结束loading状态
				hasMore = data.length === pageSize;				//更新全局变量hasMore
				data.forEach(product => showProduct(product));// 显示商品数据
				initOrRefreshScroll();  // 初始化或更新滚动对象
				if(data.length === pageSize)		// 更新显示文本
					$('p.info').text('上拉加载更多..');
				else if($('ul.product-list>li').length > 0)
					$('p.info').text('已到达底部..');
				else
					$('p.info').text('暂无相关商品，敬请期待..');
			}
		});
	}, 800);
}

function showProduct(product) {
	// 拼接展示
	$(`
		<li>
			<a href='/pages/detail/detail.html?pid=${ product.id }'>
				<div class='image-wrapper'>
					<img src='${ product.avatar }' />
				</div>
				<div class='content-wrapper'>
					<span class='name ellipsis'>${ product.name }</span>
					<span class='brief ellipsis'>${ product.brief }</span>
					<span class='price'>￥${ product.price }</span>
					<div class='bottom'>
						<span class='rate'>${ product.rate }条评论</span>
						<span class='sale'>销量：${ product.sale }件</span>
					</div>
				</div>
			</a>
		</li>
	`).appendTo('ul.product-list');
}

// 初始化或更新滚动对象
function initOrRefreshScroll() {
	imagesLoaded($('.scroll')[0], function() {
		setTimeout(function() {
			if(scroll === null) {
				scroll = new IScroll($('.scroll')[0], {
					deceleration: 0.003,
					bounce: false,
					probeType: 2,
					click: true
				});
				var isTriggerLoadMore = false;
				scroll.on('scroll', function() {
					$('i.rocket').toggle(Math.abs(this.y) >= 100);
					
					if(hasMore && !isLoading) {		// 如果可以加载更多且当前没有处于loading状态
						if(this.y - this.maxScrollY === 0) {	// 如果达到上拉加载更多的临界点
							$('p.info').text('放手立即加载..');
							isTriggerLoadMore = true;
						}
						else {	// 如果没有
							$('p.info').text('上拉加载更多..');
							isTriggerLoadMore = false;
						}
					}
				});
				scroll.on('scrollEnd', function() {
					if(isTriggerLoadMore) {
						isTriggerLoadMore = false;
						updateProductList(true);
					}
				});
			}
			else scroll.refresh();
		}, 20);
	});
}

// 返回顶部功能实现
(function() {
	$('i.rocket').on('click', function() {
		if(scroll) scroll.scrollTo(0, 0, 0);
		$(this).hide('slow');
	});
})();














// 需要调用updateProductList的情况	
// 1.页面刚刚加载完成
// 2.切换排序方向时
// 3.切换排序列时
// 4.搜索时
// 5.向下滑动加载更多时

// 提示文本的状态
// 1.加载中..
// 2.上拉加载更多..
// 3.放手加载更多..
// 4.已到达底部
// 5.暂无相关商品,敬请期待..

