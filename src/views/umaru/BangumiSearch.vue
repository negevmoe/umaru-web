<script setup lang="ts">

import {ref} from "vue";
import bangumiApi from "@/api/bangumi";
import {SearchResponse} from "@/model/bangumi_subject";
import {message} from "ant-design-vue";
import {useRoute, useRouter} from "vue-router";
import {Dayjs} from "dayjs";
import dayjs from "dayjs";
import SearchSubjectCard from "@/components/umaru/search/SearchSubjectCard.vue";
import Loading from "@/components/common/Loading.vue";
import Empty from "@/components/common/Empty.vue";

type RangeTime = [Dayjs, Dayjs];

const route = useRoute();
const router = useRouter();

// 获取番剧列表
const request = ref({
    keyword: String(route.query.keyword || ""),
    sort: String(route.query.sort || "match"),
    page: Number(route.query.page) || 1,
    size: Number(route.query.size) || 10,
    date_l: String(route.query.date_l || ""),
    date_r: String(route.query.date_r || ""),
    rank_l: Number(route.query.rank_l) || 0,
    rank_r: Number(route.query.rank_r) || 0,
    rating_l: Number(route.query.rating_l) || 0,
    rating_r: Number(route.query.rating_r) || 0,

})

const searchResponse = ref<SearchResponse>({
    data: [],
    limit: 0,
    offset: 0,
    total: 0
})

const sortOptions = [
    {label: "匹配程度", value: "match"},
    {label: "评分", value: "score"},
    {label: "排名", value: "rank"},
    {label: "收藏数", value: "heat"},
]

const ratingOptions = [
    {label: "0", value: 0},
    {label: "1", value: 1},
    {label: "2", value: 2},
    {label: "3", value: 3},
    {label: "4", value: 4},
    {label: "5", value: 5},
    {label: "6", value: 6},
    {label: "7", value: 7},
    {label: "8", value: 8},
    {label: "9", value: 9},
    {label: "10", value: 10},
]

const rangeTime = request.value.date_l ? ref<RangeTime>([
    dayjs(request.value.date_l),
    request.value.date_r ? dayjs(request.value.date_r) : dayjs()
]) : ref<RangeTime>();

const loading = ref<boolean>(false)


function join(arr: string[]): string {
    if (!arr) {
        return ""
    }
    return arr.join("@")
}

function split(str: string): string[] {
    if (!str) {
        return []
    }
    return str.split("@")
}

function routerReplace() {
    router.replace({
        name: "search", query: {
            page: request.value.page,
            size: request.value.size,
            keyword: request.value.keyword,
            sort: request.value.sort,
            date_l: request.value.date_l,
            date_r: request.value.date_r,
            rating_l: request.value.rating_l,
            rating_r: request.value.rating_r,
            rank_l: request.value.rank_l,
            rank_r: request.value.rank_r,
        }
    })
}

function TimeChangeHandler(_: any, arr: string[]) {
    request.value.date_l = dayjs(arr[0]).format("YYYY-MM-DD")
    request.value.date_r = dayjs(arr[1]).format("YYYY-MM-DD")
    getSubjectList();
}

function getSubjectList() {
    loading.value = true
    bangumiApi.search({
        filter: {
            air_date: rangeTime.value ? [rangeTime.value[0].format(">=YYYY-MM-DD"), rangeTime.value[1].format("<=YYYY-MM-DD")] : [],
            rank: request.value.rank_r > 0 ? [`>=${request.value.rank_l}`, `<=${request.value.rank_r}`] : [`>=${request.value.rank_l}`],
            rating: request.value.rating_r > 0 ? [`>=${request.value.rating_l}`, `<=${request.value.rating_r}`] : [`>=${request.value.rating_l}`],
            tag: [],
            type: [2],
        },
        keyword: request.value.keyword,
        page: request.value.page,
        size: request.value.size,
        sort: request.value.sort
    }).then(res => {
        searchResponse.value = res.data
        loading.value = false
        console.log(searchResponse)
    }).catch(err => {
        loading.value = false
        console.log(err)
        message.error("查询失败")
    })
    routerReplace();
}

getSubjectList();

</script>

<template>
    <div class="wrapper">
        <div class="main">
            <!-- 筛选表单 -->
            <div>
                <a-form :model="request">
                    <a-row :gutter="16">
                        <a-col :span="20">
                            <!-- 标题 -->
                            <a-form-item label="关键词" style="margin: 0">
                                <a-input size="small" v-model:value="request.keyword"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item style="margin: 0">
                                <a-button size="small" type="primary" @click="getSubjectList">搜索</a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="16">
                        <a-col :span="8">
                            <a-form-item label="放送时间" style="margin: 0">
                                <a-range-picker v-model:value="rangeTime" size="small" format="YYYY-MM-DD"
                                                @change="TimeChangeHandler"
                                                :placeholder="['开始时间', '结束时间']"/>
                            </a-form-item>
                        </a-col>

                        <a-col :span="8">
                            <a-form-item label="排序方式" style="margin: 0">
                                <a-select size="small" v-model:value="request.sort" placeholder=""
                                          @change="routerReplace" :options="sortOptions"/>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="16">
                        <!-- 评分范围 -->
                        <a-col :span="8">
                            <a-form-item label="评分范围" style="margin: 0">
                                <a-row :gutter="4" style="justify-content: space-between">
                                    <a-col :span="10">
                                        <a-select size="small" v-model:value="request.rating_l" placeholder=""
                                                  @change="getSubjectList" :options="ratingOptions"/>
                                    </a-col>
                                    <a-col :span="2">
                                        <span>至</span>
                                    </a-col>
                                    <a-col :span="10">
                                        <a-select size="small" v-model:value="request.rating_r" placeholder=""
                                                  @change="getSubjectList" :options="ratingOptions"/>
                                    </a-col>
                                </a-row>

                            </a-form-item>
                        </a-col>

                        <!-- 排名范围 -->
                        <a-col :span="8">
                            <a-form-item label="排名范围" style="margin: 0">
                                <a-row :gutter="4" style="justify-content: space-between">
                                    <a-col :span="10">
                                        <a-input-number v-model:value="request.rank_l" :min="0"/>
                                    </a-col>
                                    <a-col :span="2">
                                        <span>至</span>
                                    </a-col>
                                    <a-col :span="10">
                                        <a-input-number v-model:value="request.rank_r" :min="0"/>
                                    </a-col>
                                </a-row>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <a-divider/>

            <!-- 列表 -->
            <Loading :loading="loading" style="background-color: inherit;">
                <Empty v-if="searchResponse.data.length===0" style="height: 50px;"/>
                <SearchSubjectCard v-else v-for="item in searchResponse.data" :key="item.id" :value="item"
                                   style="margin-bottom: 1.2rem;"/>
            </Loading>


            <!-- 分页 -->
            <a-pagination
                    v-model:current="request.page"
                    v-model:pageSize="request.size"
                    show-size-changer
                    :total="searchResponse.total"
                    :show-total="total => `共${total}条`"
                    @change="getSubjectList"
                    @showSizeChange="getSubjectList"
            />

        </div>
    </div>
</template>
<style scoped lang="less">
@import "@/assets/css/var.less";

.wrapper:extend(.content-wrapper) {
}

.main:extend(.content-main) {

}
</style>
