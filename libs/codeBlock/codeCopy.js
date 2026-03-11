// 代码块一键复制

$(function () {
    function copy(text, ctx) {
        if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
            try {
                document.execCommand('copy')
                $(ctx).next('.codecopy_notice')
                    .text("复制成功")
                    .animate({
                        opacity: 1,
                        top: 30
                    }, 450, function () {
                        setTimeout(function () {
                            $(ctx).next('.codecopy_notice').animate({
                                opacity: 0,
                                top: 0
                            }, 650)
                        }, 400)
                    })
            } catch (ex) {
                $(ctx).next('.codecopy_notice')
                    .text("复制失败")
                    .animate({
                        opacity: 1,
                        top: 30
                    }, 650, function () {
                        setTimeout(function () {
                            $(ctx).next('.codecopy_notice').animate({
                                opacity: 0,
                                top: 0
                            }, 650)
                        }, 400)
                    })
                return false
            }
        } else {
            $(ctx).next('.codecopy_notice').text("浏览器不支持复制")
        }
    }

    // 支持 Hexo highlight 格式
    $(document).on('click', '.code-area .fa-copy', function () {
        var selection = window.getSelection()
        var range = document.createRange()
        var $codeArea = $(this).closest('.code-area')
        var $code = $codeArea.find('code')
        if ($code.length === 0) {
            $code = $codeArea.find('pre')
        }
        range.selectNodeContents($code[0])
        selection.removeAllRanges()
        selection.addRange(range)
        var text = selection.toString()
        copy(text, this)
        selection.removeAllRanges()
    })
    
    // 支持 Prism.js 格式
    $(document).on('click', 'pre[class*="language-"] .code_copy', function () {
        var selection = window.getSelection()
        var range = document.createRange()
        var $pre = $(this).closest('pre')
        var $code = $pre.find('code')
        if ($code.length > 0) {
            range.selectNodeContents($code[0])
            selection.removeAllRanges()
            selection.addRange(range)
            var text = selection.toString()
            copy(text, this)
            selection.removeAllRanges()
        }
    })
});
