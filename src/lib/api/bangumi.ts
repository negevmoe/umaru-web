import axios from 'axios'
import {message} from "ant-design-vue";
import router from "@/router";

const bangumi = axios.create({
    baseURL: "https://api.bgm.tv",
    timeout: 5000,
})

// response 拦截器(数据返回后的处理)
bangumi.interceptors.response.use(res => {
    if (!res || res.status !== 200) {
        return Promise.reject('请求失败')
    }
    return res
}, error => {
    return Promise.reject("网络连接错误,请稍后重试")
})

export default bangumi
