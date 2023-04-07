import copy from "copy-to-clipboard";
import {message} from "ant-design-vue";

export function getTorrentSize(limit) {
    var size = "";
    if (limit < 1024) {                            //小于0.1KB，则转化成B
        size = limit.toFixed(2) + " B"
    } else if (limit < 1024 * 1024) {            //小于0.1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + " KB"
    } else if (limit < 1024 * 1024 * 1024) {        //小于0.1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + " MB"
    } else {                                            //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + " GB"
    }
    return size
}

export function copyHandler(url) {
    if (copy(url)) {
        message.success("复制成功")
    }
}

export function downloadHandler(url) {
    message.success("执行下载成功,等待下载")

    // 创建链接节点a
    const eleLink = document.createElement('a')
    // 不展示 并设置url
    eleLink.style.display = 'none';
    eleLink.href = url;
    // 加入到body
    document.body.appendChild(eleLink);
    // 点击链接下载
    eleLink.click();
    // 删除节点a
    document.body.removeChild(eleLink);
}

const colorArr = ["magenta", "red", "volcano", "orange", "gold", "lime", "cyan", "blue", "geekblue"];

export function getRandomColor() {
    return colorArr[Math.floor((Math.random() * colorArr.length))]
}

