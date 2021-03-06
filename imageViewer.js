/**
 * @file pictureView.js 点击查看图片插件
 * @author clarkt(clarktanglei@163.com)
 */

(function () {
    function ImageViewer(opts) {
        opts = opts || {};
        this.$root = opts.$root || $('body');
        this.target = opts.target || 'img';
        this.onShow = opts.onShow || function () {};
        this.onHide = opts.onHide || function () {};
        init(this);
        bindEvent(this);
    }

    var clientW = document.documentElement.clientWidth;
    var clientH = document.documentElement.clientHeight;

    function init(ctx) {
        ctx.$mask = $('<div class="hide"'
            + 'style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index; 30;'
            + ' background: rgba(0, 0, 0, 0.6)"'
            + '></div>');
        ctx.$image = $('<div class="hide"'
            + 'style="position: fixed; z-index: 40; top: 0; left: 0; right: 0; bottom: 0; margin: auto"'
            + '><div></div></div>');
        $('body').append(ctx.$mask);
        $('body').append(ctx.$image);
        ctx.$imageInner = ctx.$image.children();
    }

    function bindEvent(ctx) {
        ctx.$mask.on('touchmove', function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        ctx.$mask.on('click', function () {
            ctx.$mask.addClass('hide');
            ctx.$image.addClass('hide');
            ctx.onHide();
        });

        ctx.$root.on('click', ctx.target, function () {
            var $this = $(this);
            var url;

            if ($this.is('img') && $this.attr('src')) {
                url = $this.attr('src');
            }
            else if ($this.css('background-image').indexOf('url(') === 0) {
                url = $this.css('background-image').slice(4, -1);
            }

            if (url == null) {
                return;
            }

            loadImage($(this).attr('src'), function (img, width, height) {
                ctx.$mask.removeClass('hide');
                var size = getProperSize(width, height);
                ctx.$imageInner.css({
                    width: size.width,
                    height: size.height
                });
                ctx.$image.css({
                    width: size.width,
                    height: size.height
                });
                var $img = $(img);
                $img.css({
                    width: size.width,
                    height: size.height
                });
                ctx.$imageInner.html($img);
                ctx.$image.removeClass('hide');

                ctx.onShow();
            },
            function () {

            });
        });
    }

    function loadImage(src, onSucess, onError) {
        var img = new Image();
        img.onload = function () {
            var width = this.width;
            var height = this.height;
            onSucess(this, width, height);
        };

        img.onerror = onError;

        img.src = src;
    }

    function getProperSize(width, height) {
        if (width === 0 || height === 0) {
            return null;
        }

        var result = {};

        if (width >= clientW && clientW * height / width <= clientH) {
            result.width = clientW;
            result.height = clientW * height / width;
        }
        else if (height >= clientH && clientH * width / height <= clientW) {
            result.height = clientH;
            result.width = clientH * width / height;
        }
        else {
            result.width = width;
            result.height = height;
        }

        return result;
    }

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = ImageViewer;
    }
    else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () {
            return ImageViewer;
        });
    }
    else {
        this.ImageViewer = ImageViewer;
    }
})
.call(this || typeof window !== 'undefined' ? window : global);
