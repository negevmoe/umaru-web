import {Page} from "@/model/request/common";

export interface ruleCreateRequest {
    name: string;
    must_contain?: string;
    must_not_contain?: string;
    episode_filter?: string;
    use_regex?: boolean; // 使用正则
    smart_filter?: boolean; // 智能过滤模式
}

export interface ruleUpdateRequest {
    id: number;
    name: string;
    must_contain?: string;
    must_not_contain?: string;
    episode_filter?: string;
    use_regex?: boolean; // 使用正则
    smart_filter?: boolean; // 智能过滤模式
}

export interface ruleDeleteListRequest {
    id_list: number[];
}

export interface categoryCreateRequest {
    name: string
}

export interface categoryUpdateRequest {
    id: number
    name: string
}

export interface categoryDeleteRequest {
    id: number
}


export interface animeGetListRequest extends Page {
    title?: string // 标题模糊搜索
    category_id?: number // 分类ID
    sort?: string, // 排序
    play_start_time?: number // 放送时间开始时间
    play_end_time?: number // 放送时间结束时间
    add_start_time?: number // 添加时间开始时间
    add_end_time?: number // 添加时间结束时间
}

export interface animeGetRequest {
    id?: number
    bangumi_id?: number
}

export interface animeDeleteRequest {
    id: number
}

export interface animeCreateRequest {
    bangumi_id: number;
    title: string;
    category_id: number;
    season: number;
    cover: string;
    total: number;
    rss_url: string;
    play_time: number;
    torrent_list: string[];
    must_contain: string;
    must_not_contain: string;
    episode_filter: string;
    use_regex: boolean;
    smart_filter: boolean;
}

export interface animeUpdateRequest {
    id: number;
    title: string;
    season: number;
    cover: string;
    category_id: number;
    total: number;
    play_time: number;
}

export interface animeGetVideoListRequest {
    id: number;
}


export interface animeRssDeleteRequest {
    id: number;
}

export interface animeRssCreateRequest {
    id: number,
    rss_url: string,
    must_contain: string,
    must_not_contain: string,
    episode_filter: string,
    use_regex: boolean,
    smart_filter: boolean
}

export interface userLoginRequest {
    username: string
    password: string
}


export interface cronGetListRequest {

}

export interface cronRunRequest {
    id: number;
}

export interface cronUpdateRequest {
    id: number;
    sep: string; // cron时间表达式
}

export interface cronStopRequest {

}

export interface cronStartRequest {

}


export interface animeRssParseRequest {
    url: string
}

export interface animeGetRssRequest {
    name: string
}
