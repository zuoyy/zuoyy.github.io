// 代码块收缩

$(function () {
  // 支持 Hexo highlight 格式
  $(document).on('click', '.code-expand', function (e) {
    var $codeArea = $(this).closest('.code-area');
    if ($codeArea.length > 0) {
      if ($codeArea.hasClass('code-closed')) {
        $codeArea.removeClass('code-closed');
      } else {
        $codeArea.addClass('code-closed');
      }
    }
    
    // 支持 Prism.js 格式
    var $pre = $(this).closest('pre');
    if ($pre.length > 0) {
      if ($pre.hasClass('code-closed')) {
        $pre.removeClass('code-closed');
      } else {
        $pre.addClass('code-closed');
      }
    }
  });
});
