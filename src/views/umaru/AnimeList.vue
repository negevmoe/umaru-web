<script setup lang="ts">
import umaruApi from "@/api/umaru";
import {ref} from "vue";
import {animeCreateRequest, animeGetListRequest} from "@/model/request/umaru";
import {UmaruAnime} from "@/model/umaru_anime";
import {message} from "ant-design-vue";
import AnimeListCard from "@/components/umaru/anime_list/AnimeListCard.vue";
import {useRoute, useRouter} from "vue-router";
import {UmaruCategory} from "@/model/umaru_category";
import Empty from "@/components/common/Empty.vue";

// 路由
const route = useRoute();
const router = useRouter();

function routerReplace() {
    router.replace({
        name: "anime", query: {
            page: filter.value.page,
            size: filter.value.size,
            category: filter.value.category_id,
            title: filter.value.title,
            sort: filter.value.sort,
            play_start: filter.value.play_start_time,
            play_end: filter.value.play_end_time,
            add_start: filter.value.add_start_time,
            add_end: filter.value.add_end_time,
        }
    })
}

// 表单
const filter = ref<animeGetListRequest>({
    page: Number(route.query.page) || 1,
    size: Number(route.query.size) || 10,
    title: String(route.query.title ?? ""),
    category_id: Number(route.query.category) || 0,
    sort: String(route.query.sort ?? "create_time_desc"),
    add_end_time: Number(route.query.add_end) || 0,
    add_start_time: Number(route.query.add_start) || 0,
    play_end_time: Number(route.query.play_end) || 0,
    play_start_time: Number(route.query.play_start) || 0,
})

const sortOptions = [
    {label: "创建时间由新到旧", value: "create_time_desc"},
    {label: "创建时间由旧到新", value: "create_time_asc"},
    {label: "放送时间由新到旧", value: "play_time_desc"},
    {label: "放送时间由旧到新", value: "play_time_asc"},
]

import type {Dayjs} from 'dayjs';
import dayjs from "dayjs";
import Loading from "@/components/common/Loading.vue";
import AnimeListCreateForm from "@/components/umaru/anime_list/AnimeListCreateForm.vue";

type RangeValue = [Dayjs, Dayjs];

// 初始化放送日期
const playRangeTime = filter.value.play_start_time ? ref<RangeValue>([
    dayjs.unix(filter.value.play_start_time),
    filter.value.play_end_time ? dayjs.unix(filter.value.play_end_time) : dayjs()
]) : ref<RangeValue>();

// 初始化创建日期
const addRangeTime = filter.value.add_start_time ? ref<RangeValue>([
    dayjs.unix(filter.value.add_start_time),
    filter.value.add_end_time ? dayjs.unix(filter.value.add_end_time) : dayjs()
]) : ref<RangeValue>();

// 放送时间更改handler
function playTimeChangeHandler(obj: any, list: string[]) {
    filter.value.play_start_time = list[0] === "" ? 0 : dayjs(list[0], "YYYY-MM-DD").unix()
    filter.value.play_end_time = list[1] === "" ? 0 : dayjs(list[1], "YYYY-MM-DD").unix()
    getAnimeList()
}

// 创建时间更改handler
function createTimeChangeHandler(obj: any, list: string[]) {
    filter.value.add_start_time = list[0] === "" ? 0 : dayjs(list[0], "YYYY-MM-DD").unix()
    filter.value.add_end_time = list[1] === "" ? 0 : dayjs(list[1], "YYYY-MM-DD").unix()
    getAnimeList()
}

// 分页
const total = ref(0)

function sizeChangeHandler() {
    getAnimeList();
}

// 番剧列表
const loading = ref(false)
const animeList = ref<UmaruAnime[]>([])

function getAnimeList() {
    loading.value = true
    umaruApi.animeGetList(filter.value).then(res => {
        loading.value = false
        animeList.value = res.data.items
        total.value = res.data.total
    }).catch(err => {
        loading.value = false
        console.log(err)
        message.error(err)
    })
    routerReplace();
}

// 分类列表
const categoryLoading = ref(true)
const categoryList = ref<UmaruCategory[]>([])
umaruApi.categoryGetList().then(res => {
    categoryLoading.value = false
    categoryList.value = res.data.items
}).catch(err => {
    categoryLoading.value = false
    console.log(err)
    message.error(err)
})

// 获取分类选项
function categoryOptions() {
    let arr = [{
        value: 0,
        label: "全部",
    }]
    for (let i = 0; i < categoryList.value.length; i++) {
        arr.push({
            value: categoryList.value[i].id,
            label: categoryList.value[i].name
        })
    }
    return arr
}

// 删除番剧
function deleteAnime(id: number) {
    umaruApi.animeDelete({id: id}).then(res => {
        message.success("删除成功")
        getAnimeList();
    }).catch(err => {
        console.log(err);
        message.error(err);
    })
}

// 添加番剧
const createAnimeShow = ref<boolean>(false);
const createAnimeRequest = ref<animeCreateRequest>({
    bangumi_id: 0,
    category_id: 1,
    cover: "",
    episode_filter: "",
    must_contain: "",
    must_not_contain: "",
    play_time: 0,
    rss_url: "",
    season: 0,
    smart_filter: false,
    title: "",
    torrent_list: [],
    total: 0,
    use_regex: false
});

function createAnimeFormOk() {
    createAnime()
}

function createAnime() {
    console.log(createAnimeRequest.value)
    // umaruApi.animeCreate()
}


getAnimeList()

</script>


<template>
    <div class="wrapper">
        <div class="main">
            <!-- 筛选表单 -->
            <div>
                <a-form :model="filter">
                    <a-row :gutter="20">
                        <a-col :span="16">
                            <a-row :gutter="16">
                                <a-col flex="auto">
                                    <!-- 标题 -->
                                    <a-form-item label="标题" style="margin: 0">
                                        <a-input size="small" v-model:value="filter.title"/>
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row :gutter="16">
                                <a-col :span="12">
                                    <a-form-item label="分类" style="margin: 0">
                                        <a-select size="small" v-model:value="filter.category_id" placeholder="选择分类" @change="getAnimeList" :options="categoryOptions()"/>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item label="排序" style="margin: 0">
                                        <a-select size="small" v-model:value="filter.sort" placeholder="排序方式" @change="getAnimeList" :options="sortOptions"/>
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-row :gutter="16">

                                <a-col :span="12">
                                    <a-form-item label="放送时间">
                                        <a-range-picker v-model:value="playRangeTime" size="small" format="YYYY-MM-DD" @change="playTimeChangeHandler"
                                                        :placeholder="['开始时间', '结束时间']"/>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item label="创建时间">
                                        <a-range-picker v-model:value="addRangeTime" size="small" format="YYYY-MM-DD" @change="createTimeChangeHandler"
                                                        :placeholder="['开始时间', '结束时间']"/>
                                    </a-form-item>
                                </a-col>

                            </a-row>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item style="margin: 0">
                                <a-button size="small" type="primary" @click="getAnimeList">搜索</a-button>
                            </a-form-item>
                            <a-form-item style="margin: 0">
                                <a-button size="small" type="primary" @click="()=>{createAnimeShow = true}">添加</a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <a-divider/>
            <!-- 列表 -->
            <loading :loading="loading" style="background-color: inherit;">
                <Empty v-if="animeList.length===0" style="height: 50px;"/>
                <AnimeListCard v-else v-for="item in animeList" :key="item.id" :value="item" @deleteAnime="deleteAnime" style="margin-bottom: 1.2rem;"/>
            </loading>

            <!-- 分页 -->
            <a-pagination
                v-model:current="filter.page"
                v-model:pageSize="filter.size"
                show-size-changer
                :total="total"
                :show-total="total => `共${total}条`"
                @showSizeChange="sizeChangeHandler"
            />
        </div>
    </div>

    <!--添加表单-->
    <!--
        bangumi_id: 0,
        category_id: 1,
        cover: "",
        episode_filter: "",
        must_contain: "",
        must_not_contain: "",
        play_time: 0,
        rss_url: "",
        season: 0,
        smart_filter: false,
        title: "",
        torrent_list: [],
        total: 0,
        use_regex: false
    -->
    <a-modal :visible="createAnimeShow" @cancel="()=>{createAnimeShow=false}" @ok="createAnimeFormOk">
        <a-form ref="createAnimeRef"
                label-align="left"
                :label-col="{span:6}"
                :colon="false">

            <a-form-item label="标题">
                <a-input v-model:value="createAnimeRequest.title"/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>


<style scoped lang="less">
@import "@/assets/css/var.less";


.wrapper:extend(.content-wrapper) {
}

.main:extend(.content-main) {

}
</style>
