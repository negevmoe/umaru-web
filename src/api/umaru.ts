import axios from "@/lib/api/umaru";
import {
    ruleCreateRequest,
    ruleUpdateRequest,
    ruleDeleteListRequest,
    categoryCreateRequest,
    animeGetListRequest,
    animeGetRequest,
    animeDeleteRequest,
    animeCreateRequest,
    animeUpdateRequest,
    animeGetVideoListRequest,
    userLoginRequest,
    categoryUpdateRequest,
    categoryDeleteRequest,
    cronGetListRequest,
    cronRunRequest,
    cronUpdateRequest,
    cronStopRequest,
    cronStartRequest,
    animeRssParseRequest,
    animeGetRssRequest, animeRssDeleteRequest, animeRssCreateRequest
} from "@/model/request/umaru"

const umaruApi = {
    // 创建下载规则
    ruleCreate: (req: ruleCreateRequest) => {
        return axios({method: "post", url: "/api/rule", data: req})
    },
    // 获取下载规则列表
    ruleGetList: () => {
        return axios({method: "get", url: "/api/rule_list"})
    },
    // 更新下载规则
    ruleUpdate: (req: ruleUpdateRequest) => {
        return axios({method: "put", url: "/api/rule", data: req})
    },
    // 批量删除下载规则
    ruleDeleteList: (req: ruleDeleteListRequest) => {
        return axios({method: "delete", url: "/api/rule_list", data: req})
    },
    // 获取分类列表
    categoryGetList: () => {
        return axios({method: "get", url: "/api/category_list"})
    },
    // 创建分类
    categoryCreate: (req: categoryCreateRequest) => {
        return axios({method: "post", url: "/api/category", data: req})
    },
    // 更新分类
    categoryUpdate: (req: categoryUpdateRequest) => {
        return axios({method: "put", url: "/api/category", data: req})
    },
    // 删除分类
    categoryDelete: (req: categoryDeleteRequest) => {
        return axios({method: "delete", url: "/api/category", data: req})
    },
    // 获取番剧列表
    animeGetList: (req: animeGetListRequest) => {
        return axios({method: "get", url: "/api/anime_list", params: req})
    },
    // 获取番剧详情
    animeGet: (req: animeGetRequest) => {
        return axios({method: "get", url: "/api/anime", params: req})
    },
    // 删除番剧
    animeDelete: (req: animeDeleteRequest) => {
        return axios({method: "delete", url: "/api/anime", data: req})
    },
    // 创建番剧
    animeCreate: (req: animeCreateRequest) => {
        return axios({method: "post", url: "/api/anime", data: req})
    },
    // 更新番剧信息
    animeUpdate: (req: animeUpdateRequest) => {
        return axios({method: "put", url: "/api/anime", data: req})
    },
    // 获取番剧的下载视频列表
    animeGetVideoList: (req: animeGetVideoListRequest) => {
        return axios({method: "get", url: "/api/anime/video_list", params: req})
    },
    animeRssDelete: (req: animeRssDeleteRequest) => {
        return axios({method: "get", url: "/api/anime/rss/cancel", params: req})
    },
    animeRssCreate: (req: animeRssCreateRequest) => {
        return axios({method: "post", url: "/api/anime/rss", data: req})
    },

    // 解析rss
    animeRssParse: (req: animeRssParseRequest) => {
        return axios({method: "post", url: "/api/rss/parse", data: req})
    },
    // 获取mikan的rss信息
    animeGetRss: (req: animeGetRssRequest) => {
        return axios({method: "get", url: "/api/anime/rss", params: req})
    },
    // 获取定时任务列表
    cronGetList: (req: cronGetListRequest) => {
        return axios({method: "get", url: "/api/cron_list", params: req})
    },
    // 立即执行一次定时任务
    cronRun: (req: cronRunRequest) => {
        return axios({method: "get", url: "/api/cron/run", params: req})
    },
    // 更新定时任务
    cronUpdate: (req: cronUpdateRequest) => {
        return axios({method: "put", url: "/api/cron/update", data: req})
    },
    // 停止定时任务
    cronStop: (req: cronStopRequest) => {
        return axios({method: "get", url: "/api/cron/stop", params: req})
    },
    // 开始定时任务
    cronStart: (req: cronStartRequest) => {
        return axios({method: "get", url: "/api/cron/start", params: req})
    },

    // 登录
    userLogin: (req: userLoginRequest) => {
        return axios({method: "post", url: "/api/user/login", data: req})
    },
    // 手动硬连接
    userLink: () => {
        return axios({method: "get", url: "/api/link"})
    },
    // 获取qb的日志列表
    userGetQbittorrentLogList: () => {
        return axios({method: "get", url: "/api/qb/logs"})
    },
}

export default umaruApi;
