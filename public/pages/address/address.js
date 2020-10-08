var edit = 'add';			// 表示当前编辑的状态add表示新增，modify表示修改
var id = 0;					// 要修改的地址的id
var nameCheck = 0;
var phoneCheck = 0;
var addressCheck = 0;

// 动态渲染数据
(function() {
	$.myAjax({
		type: 'get',
		url: '/address/list',
		success: data => {
			showAddressList(data);
		}
	});
})();

function showAddressList(data) {
	if(data.length === 0) {
		$('.page-content.yes').removeClass('active').prev().addClass('active');
		return;
	}
	data.forEach(function(item) {
		$(`
			<li data-id='${ item.id }'>
				<div class="main">
					<div class="top">
						<span class="name">${ item.receiveName }</span>
						<span class="phone">${ item.receivePhone }</span>
					</div>
					<div class="bottom">
						<span class="default ${ item.isDefault ? 'active' : '' }">默认</span>
						<span class="detail-address">${ item.receiveRegion } ${ item.receiveDetail }</span>
					</div>
				</div>
				<div class="edit">
					<img src="/images/address/icon_edit_gray.png" alt="" />
				</div>
			</li>
		`).appendTo($('ul.address'));
	});
}

// 返回个人中心
(function() {
	$('.page-top>img').on('click', function() {
		var backUrl = Cookies.get('backUrl');
		if(backUrl) {
			Cookies.remove('backUrl');
			window.location.href = backUrl;
		}
		else
			window.location.href = '/pages/personal/personal.html';
	});
})();

// 表单验证
(function() {
	var valid = $('form.content').Validform({
		tiptype: 3,
		datatype:  {
			name: function(gets) {
				var reg = /^\w{5,20}$/;
				if(!reg.test(gets)) return false;
				nameCheck = 1;
				return true;
			},
			phone: function(gets) {
				var reg = /1[34578][0123456789]\d{8}/;
				if(gets.length !== 11 ) return false;
				if(!reg.test(gets)) return false;
				phoneCheck = 1;
				return true;
			},
			address: function(gets) {
				var reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+/;
				if(!reg.test(gets)) return false;
				addressCheck = 1;
				return true;
			}
		}
	});
})();

// 控制新增地址页
(function() {
	// 关闭
	$('.pop-top>img').on('click', function() {
		$('.pop-content-wrapper').removeClass('active').prev().addClass('active');
	});
	// 新增打开
	$('.page-container>.page-footer').on('click', function() {
		edit = 'add';
		$('.set-default').addClass('active');
		$('.pop-content>.content>.btn-delete').toggle(edit === 'modify');
		$('form.content')[0].reset();
		$(this).parent().removeClass('active').next().addClass('active');
	});
	// 修改打开
	setTimeout(function() {
		$('.page-container>.page-content.yes>ul.address>li>.edit').on('click', function() {
			edit = 'modify';
			$('.pop-content-wrapper').addClass('active').prev().removeClass('active');
			$('.set-default').removeClass('active');
			$('.pop-content>.content>.btn-delete').toggle(edit === 'modify');
			id = $(this).parent().attr('data-id');
			$.myAjax({  
				type: 'get',
				url: '/address/model/' + id,
				success: data => {
					showOneAddress(data);
				}
			});
		});
		
		$('.page-container>.page-content.yes>ul.address>li>.main').on('click', function() {
			if($(this).find('.bottom>span.default').hasClass('active')) return;
			$(this).parent().parent().find('.bottom>span.default').removeClass('active');
			$(this).find('.bottom>span.default').addClass('active');
			$.myAjax({
						global: false,
						type: 'get',
						url: '/address/set_default/' + $(this).parent().attr('data-id'),
						success: data => {
							
						}
					});
		});
		
	}, 1000);
	// 设置默认地址
	$('.set-default>img').on('click', function() {
		$(this).removeClass('active').siblings('img').addClass('active');
	});
	
	$('.pop-content>.content>.btn-delete').on('click', function() {
		$.confirm('确定要删除吗',function() {
			$.myAjax({
				type: 'get',
				url: '/address/remove/' + id,
				success: data => {
					window.location.href = window.location.href;
				}
			});
		});
	});
})();

function showOneAddress(data) {
	$('.name-wrapper>input').val(data.receiveName);
	$('.phone-wrapper>input').val(data.receivePhone);
	$('.address-wrapper>input').val(data.receiveRegion);
	$('.detail-address-wrapper>input').val(data.receiveDetail);
	if(data.isDefault) {
		$('.set-default>img.checked').addClass('active').prev().removeClass('active');
	}
}

// 保存按钮的控制
(function() {
	$('.btn-wrapper>span.btn-save').on('click', function() {
		if(!nameCheck) {
			$.alert('收货人姓名错误或不存在');
			return;
		}
		if(!phoneCheck) {
			$.alert('收货人手机错误或不存在');
			return;
		}
		// if(!$(this).parent().siblings('.address-wrapper').find('input').text()) {
		// 	$.alert('所在地区为空');
		// 	return;
		// }
		if(!addressCheck) {
			$.alert('详情地址不符合规则');
			return;
		}
		// 点击保存新增数据
		if(edit === 'add') {
			$.myAjax({
				type: 'post',
				url: '/address/add',
				data: {
					receiveName: $('.name-wrapper>input').val(),
					receivePhone: $('.phone-wrapper>input').val(),
					receiveRegion: $('.address-wrapper>input').val(),
					receiveDetail: $('.detail-address-wrapper>input').val()
				},
				success: data => {
					modifyDefaultAddress(data);
					$('.pop-content-wrapper').removeClass('active').prev().addClass('active');
					window.location.href = window.location.href;
				}
			});
		}
		// 点击保存修改数据
		else {
			$.myAjax({
				type: 'post',
				url: '/address/update',
				data: {
					id,
					receiveName: $('.name-wrapper>input').val(),
					receivePhone: $('.phone-wrapper>input').val(),
					receiveRegion: $('.address-wrapper>input').val(),
					receiveDetail: $('.detail-address-wrapper>input').val()
				},
				success: data => {
					window.location.href = window.location.href;
					$('.pop-content-wrapper').removeClass('active');
				}
			});
		}
	});
})();

function modifyDefaultAddress(data) {
	if($('.set-default>img.checked').hasClass('active')) {
		$.myAjax({
			global: false,
			type: 'get',
			url: '/address/set_default/' + data,
			success: data => {
				
			}
		});
	}
}








