import axios from 'axios'
import {message} from "ant-design-vue";
import router from "@/router";

const umaru = axios.create({
    timeout: 5000,
})

// request拦截器(请求前的处理)
umaru.interceptors.request.use(req => {
    req.headers!.token = localStorage.getItem("token")
    return req;
}, error => {
    return Promise.reject(error)
})

// response 拦截器(数据返回后的处理)
umaru.interceptors.response.use(response => {
    if (response.status !== 200) {
        return Promise.reject('请求失败')
    }
    const res = response.data
    if (!res) {
        return Promise.reject('请求失败')
    }

    if (res.code === 401) {
        message.destroy()
        message.error(res.message)
        localStorage.removeItem("token")
        router.push("/login")
        return new Promise(() => {
        })
    }

    if (res.code === 200) {
        return res
    } else {
        return Promise.reject(res.message ? res.message : "获取数据失败")
    }
}, error => {
    return Promise.reject("请求错误")
})

export default umaru
