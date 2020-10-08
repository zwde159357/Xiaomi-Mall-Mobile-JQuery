var sliderTimer = null;				// 控制轮播图
var index = 0;						// 开始轮播的图片下标
var bannerNum = 5;					// 轮播图的数量
var outScroll = null;

var maxNum = 5;						// 一次可够买商品的最大数量 
var num = 1;						// 购买商品的数量

var userName = Cookies.get('user'); // 用户是否登录
var token = sessionStorage.getItem('token');
var count = 0;						// 购物车中商品数量

// 请求商品数据
var pid  = parseInt(window.location.search.slice(window.location.search.lastIndexOf('=') + 1));

$.myAjax({
	type: 'get',
	url: `/product/model/${ pid }`,
	success: data => {
		if(data.length !== 0)
			showProduct(data);
		else
			$.alert('商品暂未上架，敬请期待...');
	}
});

function showProduct(data) {
	var images = data.bannerImgs.split(',');
	var other = data.otherImgs.split(',');
	images.push(images[0]);
	// images.forEach(function(img) {
	// 	$(`
	// 		<li>
	// 			<div class="wrapper">
	// 				<img src="${ img }" alt="" />
	// 			</div>
	// 		</li>
	// 	`).appendTo('.banner>ul');
	// });
	
	images.forEach(function(img) {
		$(`
			<div class="swiper-slide">
				<img src="${ img }" alt="">
			</div>
		`).appendTo('.swiper-container>.swiper-wrapper');
	});
	
	
	$('.detail-price>span.price').text(`￥${ data.price }`);
	$('.detail-name>span.name').text(`${ data.name }`);
	$('.detail-brief>span.brief').text(`${ data.brief }`);
	other.forEach(function(img) {
		$(`
			<li>
					<img src="${ img }" alt="" />
			</li>
		`).appendTo('.detail-images>ul.images');
	});
	
	// 弹出购物数量
	$('.image-wrapper>img').attr('src', data.avatar);
	$('.detail-wrapper>span.price').text('￥' + data.price);
}

// function slide(nextIndex) {
// 	$('.banner>ul').css({
// 		transition: 'all 1s ease-out',
// 		marginLeft: `-${ nextIndex }00%`
// 	});
	
// 	if(nextIndex === bannerNum) {
// 		index = 0;
// 	}
// 	else {
// 		index = nextIndex;
// 	}
// 	setTimeout(function() {
// 		if(nextIndex === bannerNum) {
// 			$('.banner>ul').css({
// 				transitionDuration: '0s',
// 				marginLeft: '0%'
// 			});
// 		}
// 	}, 1020);
// 	$('.banner>span.now-page').text(`${index + 1}/${ bannerNum }`);
// }

// (function() {
// 	$('.banner>span.now-page').text(`${index + 1}/${ bannerNum }`);
// 	var sliderTimer = setInterval(function() {
// 		slide(index + 1);
// 	}, 2000);
// })();

setTimeout(function() {
	var mySwiper = new Swiper('.swiper-container', {
		autoplay: {
			delay: 4000,
			disableOnInteraction: false
		},
		loop: true,
		pagination: {
			el: ".swiper-pagination",
			clickable: false,
		},
		speed: 800
	});
	
}, 200);

// 评论区拖动
(function() {
	imagesLoaded($('.user-detail')[0], function() {
		var scroll = new IScroll($('.user-detail')[0], {
			deceleration: 0.003		,// 滚动的摩擦系数
			bounce: false		 	,// 关闭回弹效果
			momentum: true			,// 关闭惯性滚动
			click: true				,// 取消滚动区域的点击事件
			probeType: 2			,// 指定scroll事件触发的频率等级
			scrollX: true,
			preventDefault: false
		});
		scroll.on('scroll', function() {});
	});
	
	imagesLoaded($('.page-content')[0], function() {
		setTimeout(function() {
			outScroll = new IScroll($('.page-content')[0], {
				deceleration: 0.003		,// 滚动的摩擦系数
				bounce: true		 	,// 关闭回弹效果
				momentum: true			,// 关闭惯性滚动
				click: true				,// 取消滚动区域的点击事件
				probeType: 2			,// 指定scroll事件触发的频率等级
				preventDefault: false
			});
			outScroll.on('scroll', function() {
				$('i.rocket').toggle(Math.abs(this.y) >= 100);
				// 控制页顶
				if($('.detail-price').offset().top < 2 * $('.page-top').height()) {
					$('img.back').add($('img.ellipsis')).addClass('active').siblings('.active').removeClass('active');
					$('.page-top').addClass('active');
				}else {
					$('img.top-back').add($('img.top-ellipsis')).addClass('active').siblings('.active').removeClass('active');
					$('.page-top').removeClass('active');
				}
				// 控制概述一栏
				$('.page-container>.title').toggle($('.detail-title').offset().top < $('.detail-title').height());
				
				var part = []; // 选项卡对应的位置
				
				// 选项卡切换
				$('.part').each((i,item) => {
					part.push($(item).offset().top - this.y);
				});
				if(Math.abs(this.y) > part[3]) {
					$('ul.title>li').eq(3).addClass('active').siblings('.active').removeClass('active');
				}
				else if(Math.abs(this.y) > part[2]) {
					$('ul.title>li').eq(2).addClass('active').siblings('.active').removeClass('active');
				}
				else if(Math.abs(this.y) > part[1]) {
					$('ul.title>li').eq(1).addClass('active').siblings('.active').removeClass('active');
				}
				else {
					$('ul.title>li').eq(0).addClass('active').siblings('.active').removeClass('active');
				}
			});
		}, 1000);
	});
})();


(function() {
	// 返回列表页
	$('.icon-myback>img.top-back').add('.icon-myback>img.back').on('click',function() {
		window.location.href = '/pages/list/list.html';
	});
	
	$('i.rocket').hide();
	// 一开始就让概述那一栏隐藏
	$('.page-container>.title').hide();
	// 返回顶部功能
	$('i.rocket').on('click', function() {
		if(outScroll) outScroll.scrollTo(0, 0, 0);
		$(this).add($('.page-container>.title')).hide('slow');
		$('ul.title>li').eq(0).addClass('active').siblings('.active').removeClass('active');
		$('img.top-back').add($('img.top-ellipsis')).addClass('active').siblings('.active').removeClass('active');
		$('.page-top').removeClass('active');
	});
	// 加入购物车
	$('.buttons>.wrapper>span.add-to-cart').add($('.detail-num>i')).on('click', function() {
		$('.pop-cart').add('.curtain').addClass('active');
	});
	
	// 进入购物车页面
	$('.page-bottom>.cart').on('click', function() {
		if(userName) {
			// 传地址
			var otherUrl = window.location.href;
			Cookies.set('otherUrl', otherUrl);
			
			window.location.href = '/pages/cart/cart.html'
		}
		else {
			var backUrl = window.location.href;
			Cookies.set('backUrl', backUrl);
			window.location.href = '/pages/login/login.html';
		}
	});
	
	$('.button-wrapper>span.button-ok').on('click', function() {
		if(userName) {
			$.confirm('确定购买吗', function() {
				$.myAjax({
					global: false,
					type: 'post',
					url: '/cart/add',
					data: {
						pid,
						count: num
					},
					success: data => {
						$.myAjax({
							global: false,
							url: '/cart/total',
							success: data=> {
								$('.page-bottom>.cart>span.count').text(data);
							}
						});
					},
					error: error => {
						Cookies.remove('user');
						sessionStorage.removeItem('token');
					}
				});
			});
		}else {
			var backUrl = window.location.href;
			Cookies.set('backUrl', backUrl);
			window.location.href = '/pages/login/login.html';
		}
	});
	
	// 关闭弹出的购物页面
	$('.pop-cart>i.close').on('click', function() {
		$('.pop-cart').add('.curtain').removeClass('active');
	});
	
	// 减少商品数量
	$('.count-content>span.button-decrease').on('click', function() {
		if(parseInt($(this).next().text()) === 1) return;
		$(this).next().next().removeClass('disabled');
		num = parseInt($(this).next().text());
		$(this).next().text(--num);
		$('.detail-wrapper>span.num').text(`已选: ${ num }件`);
		$('.detail-num>span.content').text(`${ num }件`);
		if(num === 1) $(this).addClass('disabled');
	});
	// 增加商品数量
	$('.count-content>span.button-increase').on('click', function() {
		if(parseInt($(this).prev().text()) === maxNum) return;
		$(this).prev().prev().removeClass('disabled');
		num = parseInt($(this).prev().text());
		$(this).prev().text(++num);
		$('.detail-wrapper>span.num').text(`已选: ${ num }件`);
		$('.detail-num>span.content').text(`${ num }件`);
		if(num === maxNum) $(this).addClass('disabled');
	});
})();

// 购物车中商品数量
(function() {
	if(userName) {
		$.myAjax({
			type: 'get',
			url: '/cart/total',
			success: data => {
				$('.page-bottom>.cart>span.count').show().text(data);
			}
		});
	}else {
		$('.page-bottom>.cart>span.count').hide();
	}
})();

// 选项卡的切换
(function() {
	imagesLoaded($('.page-content')[0], function() {
		setTimeout(function() {
			var part = [];
			$('.part').each(function(i,item) {
				part.push($(item).offset().top);
			});
			$('ul.title>li').on('click', function() {
				$(this).addClass('active').siblings('.active').removeClass('active');
				outScroll.scrollTo(0,-part[$(this).index()],1000);
				if(-outScroll.y < 375) {
					$('img.top-back').add($('img.top-ellipsis')).addClass('active').siblings('.active').removeClass('active');
					$('.page-top').removeClass('active');
					$('i.rocket').add('div.title').hide();
				}
				if(-outScroll.y >= part[2] ) {
					$('div.title').show();
				}
			});
		}, 1000);
	});
})();


