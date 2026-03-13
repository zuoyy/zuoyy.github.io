// 代码块语言识别

$(function () {
  // 支持 Hexo highlight 格式
  $('figure.highlight').each(function () {
    var code_language = $(this).attr('class');
    if (!code_language) {
      return true;
    };
    var lang_name = code_language.replace("line-numbers", "").trim().replace("highlight", "").trim();
    $(this).find(".code_lang").text(lang_name);
  });
  
  // 支持 Prism.js 格式
  $('pre[class*="language-"]').each(function () {
    var lang_class = $(this).attr('class');
    var lang_name = lang_class.replace("line-numbers", "").trim().replace("language-", "").trim();
    // 首字母大写
    lang_name = lang_name.charAt(0).toUpperCase() + lang_name.slice(1);
    $(this).find(".code_lang").text(lang_name);
  });
});
