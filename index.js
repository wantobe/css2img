/**
 * 将文字生成图片，返回该图片的base64 DataUrl
 *
 * @param {object} args[1]  文字内容/样式等属性，参考css的写法，单词要用驼峰格式，目前支持如下：
 {
    text:{string},          单行文字
    p:{string},             段落文字(用换行\n)
    fontSize:{number},      字号(px，不带单位)
    lineHeight:{number},    行高,默认1
    width:{number},         宽(px，不带单位)
    height:{number},        高(px，不带单位)
    color:{string},         文字颜色css格式，默认白色
    background:{string},    背景色，默认透明
    textAlign:{string}，    水平对齐方式，默认居中
    fontWeight:{string}     文字粗细，默认normal
    padding:{string}        内边距, 默认"0"
    border:{string}         边框属性, 格式为"1 solid/dashed/dotted red",顺序可以颠倒，默认"none"
    borderLeft:{string}     同border
    borderRight:{string}    同border
    borderUp:{string}       同border
    borderBottom:{string}   同border
    borderRadius:{number}   矩形框圆角半径 , 默认0
};
 */
function css2img(params) {

    var canvas = document.createElement("canvas"),
        context = canvas.getContext('2d'),
        width = params.width,
        height = params.height,
        text = params.text,
        p = params.p,
        start_x = 0,
        lineHeight = params.lineHeight || 1,
        fontSize = params.fontSize || height,
        color = params.color || "white",
        background = params.background || "none",
        textAlign = params.textAlign || "center",
        fontWeight = params.fontWeight || "normal",
        padding = params.padding || "0",
        border = params.border || "none",
        borderRadius = params.borderRadius || 0,
        borderLeft = params.borderLeft || false,
        borderRight = params.borderRight || false,
        topBorder = params.borderTop || false,
        borderBottom = params.borderBottom || false;

    // 内边距处理
    padding = padding.split(" ");
    for (var i in padding) {
        padding[i] = parseInt(padding[i]);
    }

    switch (padding.length) {
        case 1:
            padding = [padding[0], padding[0], padding[0], padding[0]];
            break;
        case 2:
            padding = [padding[0], padding[1], padding[0], padding[1]];
            break;
        case 3:
            padding = [padding[0], padding[1], padding[2], padding[0]];
            break;
        case 4:
            padding = [padding[0], padding[1], padding[2], padding[3]];
            break;
        default:
            console.error("css: padding error");
    }

    // 设置字体
    var fontStyle = fontWeight + ' ' + fontSize + 'px "PingFang SC", "Heiti SC", "Microsoft YaHei", arial, sans-serif, tahoma ';
    context.font = fontStyle;

    if (width == 'auto') {
        width = context.measureText(text).width + padding[1] + padding[3];
    }

    // 设置画布大小
    canvas.width = width;
    canvas.height = height;
    context.font = fontStyle;
    // 画矩形，即填充背景色/描边
    drawRect(border, background, width, height, borderRadius);

    // 设置字体颜色
    context.fillStyle = color;

    // 设置行高
    lineHeight = isNaN(lineHeight) ? lineHeight.replace(/[^\d]+/, '') : fontSize * lineHeight;

    // 设置文本的水平对对齐方式
    var string_width = width - padding[1] - padding[3];
    if (textAlign == 'left') {
        context.textAlign = 'left';
        start_x = padding[3];
    } else if (textAlign == 'center') {
        context.textAlign = 'center';
        // start_x = string_width / 2;
        start_x = width / 2;
    } else if (textAlign == 'right') {
        context.textAlign = 'right';
        start_x = width - padding[1];
    }

    // 设置文本的垂直对齐方式
    context.textBaseline = 'middle';

    // 绘文字
    if (text) {
        if (width < context.measureText(text).width) {
            context.textAlign = 'left';
            start_x = 0;
        }
        context.fillText(text, start_x, lineHeight / 2 + padding[0]);
    }
    if (p) {
        // 常见的标点符号，行首避开这些
        var reg = /\u0020|\u007e|\u0060|\u0021|\u0040|\u0023|\u0024|\u0025|\u005e|\u0026|\u002a|\u0028|\u0029|\u002d|\u005f|\u002b|\u003d|\u007c|\u005c|\u005b|\u005d|\u007b|\u007d|\u003b|\u003a|\u0022|\u0027|\u002c|\u003c|\u002e|\u003e|\u002f|\u003f|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3010|\u3011|\u2026|\u2014|\uff5e|\uffe5/;
        for (var i = 1, j = 0, line = 0; i <= p.length; i++) {
            var ifNewLine = p.charAt(i - 1).includes('\n'),
                textTemp = p.slice(j, i),
                textWidth = context.measureText(textTemp).width;
            if (textWidth > string_width || ifNewLine) {
                j = i - 1;
                var textTempLen = textTemp.length;
                if (ifNewLine || reg.test(p.slice(j, i))) {
                    j = i;
                } else {
                    textTempLen -= 1;
                }
                var lineText = textTemp.slice(0, textTempLen);
                context.fillText(lineText, start_x, (0.5 + line) * lineHeight + padding[0]);
                line++;
            }
            if (i == p.length) {
                context.fillText(p.slice(j, p.length), start_x, (0.5 + line) * lineHeight + padding[0]);
            }
        }
    }

    function setBorder(strokeStyle) {
        var borderStyle = "",
            borderColor = "",
            borderWidth = 0;
        strokeStyle = strokeStyle.split(" ");
        for (var i in strokeStyle) {
            if (!isNaN(strokeStyle[i])) {
                borderWidth = parseInt(strokeStyle[i]);
            } else if (strokeStyle[i].length > 0) {
                if (/dashed|dotted/.test(strokeStyle[i])) {
                    borderStyle = strokeStyle[i];
                } else {
                    borderColor = strokeStyle[i];
                }
            } else {
                continue;
            }
        }
        switch (borderStyle) {
            case "dotted":
                context.lineCap = "round";
                context.setLineDash([borderWidth, borderWidth]);
                break;
            case "dashed":
                context.setLineDash([2 * borderWidth, borderWidth]);
                break;
        }
        context.strokeStyle = borderColor;
        context.lineWidth = borderWidth;
        return borderWidth;
    }

    function drawOneBorder(width, height, borderWidth) {
        var bor = borderWidth / 2;
        if (borderLeft) {
            drawIt(borderLeft, bor, 0, bor, height);
        }
        if (borderRight) {
            drawIt(borderRight, width - bor, 0, width - bor, height);
        }
        if (topBorder) {
            drawIt(topBorder, 0, bor, width, bor);

        }
        if (borderBottom) {
            drawIt(borderBottom, 0, height - bor, width, height - bor);
        }

        function drawIt(borderStyle, x1, y1, x2, y2) {
            setBorder(borderStyle);
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
        }
    }


    /**
     * 矩形圆角处理(参数不要带单位, 默认为px)
     * @param cornerX       矩形左上角x坐标
     * @param cornerY       矩形左上角y坐标
     * @param width         矩形宽高
     * @param height        矩形宽高
     * @param cornerRadius  圆角半径
     */
    function roundedRect(cornerX, cornerY, width, height, cornerRadius) {
        context.moveTo(cornerX + cornerRadius, cornerY);
        context.arcTo(cornerX + width, cornerY, cornerX + width, cornerY + height, cornerRadius);
        context.arcTo(cornerX + width, cornerY + height, cornerX, cornerY + height, cornerRadius);
        context.arcTo(cornerX, cornerY + height, cornerX, cornerY, cornerRadius);
        context.arcTo(cornerX, cornerY, cornerX + width, cornerY, cornerRadius);
    }


    /**
     * 画矩形(参数不要带单位, 默认为px)
     * @param strokeStyle   描边样式
     * @param fillStyle     填充颜色
     * @param width         矩形宽
     * @param height        矩形高
     * @param cornerRadius  圆角半径
     */
    function drawRect(strokeStyle, fillStyle, width, height, cornerRadius) {
        var borderWidth = 0,
            hasBorder = strokeStyle != "none",
            hasBg = fillStyle != "none",
            isRadius = !!cornerRadius;

        context.beginPath();

        if (hasBorder) {
            borderWidth = setBorder(strokeStyle);
        }
        if (isRadius) {
            if (2 * cornerRadius + 2 * borderWidth >= width) {
                cornerRadius = width / 2 - borderWidth;
            }
            if (2 * cornerRadius + 2 * borderWidth >= height) {
                cornerRadius = height / 2 - borderWidth;
            }
            roundedRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth, cornerRadius);
            if (hasBg) {
                context.fillStyle = fillStyle;
                context.fill();
            }
            if (hasBorder) {
                context.stroke();
            }
        } else {
            if (hasBg) {
                context.fillStyle = fillStyle;
                context.fillRect(0, 0, width, height);
            }
            if (hasBorder) {
                context.strokeRect(0, 0, width, height);
            }
        }

        drawOneBorder(width, height, borderWidth);

        context.closePath();
    }

    return canvas.toDataURL("image/png");
}

export default css2img;
