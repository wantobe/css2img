# css2img
模拟css语法将文字生成图片


## 将文字生成图片，返回该图片的`base64 DataUrl`
* 参数说明  文字内容/样式等属性，参考css的写法，单词要用驼峰格式，目前支持如下：  
~~~
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
}
~~~


* 用法举例
~~~
css2img({
    p: 'hello\nword', 
    fontSize: 30, 
    textAlign: 'left', 
    lineHeight:0.8, 
    width: 150, 
    height: 50, 
    color: 'red', 
    border: '2 dashed red', 
    borderRadius:4, 
    background:'orange'
})
~~~
