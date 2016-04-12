/*
 * Matrix v2.1.0 (c) 2016 ChinaPnR.com
 * MIT License: http://ued.chinapnr.com/matrix/license.txt
 */
$(function() {
  var isIE6 = $.browser.msie && parseInt($.browser.version) <= 6;
  //打开选中菜单
  $('.left-nav-item dd a.hover').closest('dl').addClass('current');
  $('.left-nav-item dl.current dd').show();

  //开关子菜单动作
  $(document).on('click', '.left-nav-item dt', function() {
    var $listItem = $(this).parent().find('dd');
    //去掉所有dl的current状态
    $('.left-nav-item dl').removeClass('current');
    if ($listItem.is(':visible')) {
      $listItem.hide();
    } else {
      $(this).parent().addClass('current');
      $listItem.show().end().parent().siblings().find('dd').hide();
    }
  });
  //子菜单按钮
  $('.left-nav-item dd').click(function() {
    $(this).closest('ul').find('li dd a.hover').removeClass('hover');
    $(this).find('a').addClass('hover');
  });
  //左侧菜单开关按钮
  $('#lBtn').toggle(function() {
    $('.left-menu').hide();
    $('.arrow-btn').css('left', 0);
    $('.arrow-btn u').addClass('arrow-btn-right');
    if (!isIE6) {
      $('.main .content').css('margin-left', 15);
    } else {
      $('.main .content').css('float', "none");
    }
    $('.has-sidebar').css('background-position', '-240px 0');
  }, function() {
    $('.left-menu').show();
    $('.arrow-btn').css('left', 240);
    $('.arrow-btn u').removeClass('arrow-btn-right');
    if (!isIE6) {
      $('.main .content').css('margin-left', 255);
    } else {
      $('.main .content').css('float', "left");
    }
    $('.has-sidebar').css('background-position', '0 0');
  });

})
