/*
 * @Author: Paco
 * @Date:   2017-02-24
 * +----------------------------------------------------------------------
 * | jqadmin [ jq酷打造的一款懒人后台模板 ]
 * | Copyright (c) 2017 http://jqadmin.jqcool.net All rights reserved.
 * | Licensed ( http://jqadmin.jqcool.net/licenses/ )
 * | Author: Paco <admin@jqcool.net>
 * +----------------------------------------------------------------------
 */

layui.define(['jquery', 'jqform'], function(exports) {
    var $ = layui.jquery,
        form = layui.jqform;

    form.init({
        "form": "#form1"
    });

    form.on('checkbox(role)', function(data) {
        //单击顶级菜单
        if ($(data.elem).parent('li').length > 0) {
            $(data.elem).parent('li').find("dl").each(function(i, n) {
                $(n).find('input').prop("checked", function() {
                    return data.elem.checked;
                });
            })
        }

        //单击二级菜单
        if ($(data.elem).parent('dl').length > 0) {
            $(data.elem).parent('dl').find("dd").each(function(i, n) {
                $(n).find('input').prop("checked", function() {
                    return data.elem.checked;
                });
            })
            var had_check = true;
            $(data.elem).parent('dl').parent('li').children('dl').each(function(i, n) {
                if ($(n).find('input').prop("checked") && !data.elem.checked) {

                    had_check = false;
                }
            })
            if (had_check) {
                $(data.elem).parent('dl').parent('li').children('input').prop("checked", function() {
                    return data.elem.checked;
                });
            }
        }

        //单击三级菜单
        if ($(data.elem).parent('dd').length > 0) {

            var had_sub_check = true;
            $(data.elem).parent('dd').parent('dl').children('dd').each(function(i, n) {
                if ($(n).find('input').prop("checked") && !data.elem.checked) {
                    had_sub_check = false;
                }
            })
            if (had_sub_check) {
                $(data.elem).parent('dd').parent('dl').children('input').prop("checked", function() {
                    return data.elem.checked;
                });
            }

            var had_check = true;
            $(data.elem).parent('dd').parent('dl').parent('li').find('dl').each(function(i, n) {

                if ($(n).find('input').prop("checked") && !data.elem.checked) {
                    had_check = false;
                }
            })
            if (had_check) {
                $(data.elem).parent('dd').parent('dl').parent('li').children('input').prop("checked", function() {
                    return data.elem.checked;
                });
            }
        }

        //最顶级菜单
        if ($(data.elem).parent("legend").length > 0) {

            $(data.elem).parents("fieldset").find('input').prop("checked", function() {
                return data.elem.checked;
            });
        } else {
            var top_check = false;
            $(data.elem).parents("fieldset").children(".layui-field-box").find('input').each(function(i, n) {
                if ($(n).prop("checked")) {
                    top_check = true;
                    return false;
                }
                top_check = false;
            });
            $(data.elem).parents("fieldset").children("legend").find('input').prop("checked", top_check);
        }

        form.render();

    });


    exports('role', {});
});