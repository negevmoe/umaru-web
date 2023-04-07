<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import bangumiApi from "@/api/bangumi";
import umaruApi from "@/api/umaru";
import {message} from "ant-design-vue";
import DetailAnimeInfo from "@/components/umaru/detail/DetailAnimeInfo.vue";
import DetailBangumiInfo from "@/components/umaru/detail/DetailBangumiInfo.vue";
import DetailRssInfo from "@/components/umaru/detail/DetailRssInfo.vue";
import DetailForm from "@/components/umaru/detail/DetaiForm.vue";
import Empty from "@/components/common/Empty.vue";
import Loading from "@/components/common/Loading.vue";
import {Subject} from "@/model/bangumi_subject";
import {UmaruAnime} from "@/model/umaru_anime";
import {UmaruAnimeForm} from "@/model/umaru_anime_form";
import moment from "moment";


const router = useRouter();

// 根据bid获取bangumi的番剧信息
const bid = Number(router.currentRoute.value.query.bid)
const subject = ref<Subject>({
    date: "",
    platform: "",
    images: {
        small: "",
        grid: "",
        large: "",
        medium: "",
        common: "",
    },
    summary: "",
    name: "",
    name_cn: "",
    tags: [],
    infobox: [],
    rating: {
        rank: 0,
        total: 0,
        count: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
        },
        score: 0,
    },

    total_episodes: 0,
    collection: {
        on_hold: 0,
        dropped: 0,
        wish: 0,
        collect: 0,
        doing: 0,
    },
    id: 0,
    eps: 0,
    volumes: 0,
    locked: false,
    nsfw: false,
    type: 0,
})
const subjectLoading = ref(true)
const wrapperStyle = ref({
    backgroundImage: "url()"
})
if (!isNaN(bid)) {
    bangumiApi.getSubject({id: bid}).then(res => {
        subject.value = res.data
        subjectLoading.value = false;
        const bg = subject.value.images.large;
        // 如果背景图片未设置 则取bangumi的背景图片
        if (wrapperStyle.value.backgroundImage === 'url()') {
            wrapperStyle.value = {backgroundImage: `url(${bg})`}
        }
    }).catch(err => {
        subjectLoading.value = false;
        message.error("获取bangumi番剧信息失败")
    })
}

// 获取服务端的番剧信息
const id = Number(router.currentRoute.value.query.id)
const anime = ref<UmaruAnime>({
    bangumi_id: 0,
    category_id: 0,
    category_name: "",
    cover: "",
    create_time: 0,
    id: 0,
    play_time: 0,
    rss_url: "",
    season: 0,
    title: "",
    total: 0,
    update_time: 0
})
const animeLoading = ref(true)
//  如果bangumi id 与 anime id 都没有 则跳转404
if (isNaN(bid) && isNaN(id)) {
    router.push({name: "not_found"})
} else {
    umaruApi.animeGet({
        id: isNaN(bid) ? (isNaN(id) ? 0 : id) : 0, // 如果有bangumi id 则取0, 如果没有bangumi id 则判断参数是否有id
        bangumi_id: isNaN(bid) ? 0 : bid,
    }).then(res => {
        const data = res.data.anime
        anime.value = data
        animeLoading.value = false
        // // 如果背景图片未设置 则取anime的背景图片
        if (wrapperStyle.value.backgroundImage === 'url()') {
            wrapperStyle.value = {backgroundImage: `url(${data.cover})`}
        }
    }).catch(err => {
        animeLoading.value = false
        message.error(err)
    })
}


function getFormMode() {
// 全新: 添加并订阅 重置
    if (subject.value.id > 0 && anime.value.id === 0) {
        return 1

// 订阅后又取消订阅的: 更新 订阅 重置
    } else if (subject.value.id > 0 && anime.value.id > 0 && anime.value.rss_url === "") {
        return 2

// 订阅后的: 更新 取消订阅(无规则输入框) 重置
    } else if (subject.value.id > 0 && anime.value.id > 0 && anime.value.rss_url !== "") {
        return 3

// 手动添加: 更新 重置 无订阅相关信息
    } else {
        return 4
    }
}


// 构造表单数据
const rssUrl = ref("")

function getRssUrl(url: string) {
    rssUrl.value = url
}

function getCategoryId(category: string): number {
    switch (category) {
        case "TV":
            return 2 // 默认为anime
        case "剧场版":
            return 3 // 默认为movie
        case "OVA":
            return 4 // 默认为ova
        default:
            return 1 // 默认为未分类
    }
}

function getTitle(): string {
    if (anime.value.id > 0) {
        return anime.value.title
    }
    return subject.value.name_cn ? subject.value.name_cn : subject.value.name ?? ""
}

function getFormData(): UmaruAnimeForm {
    return {
        bangumi_id: subject.value.id,
        category_id: getCategoryId(subject.value.platform),
        cover: subject.value.images.common,
        episode_filter: "",
        id: anime.value.id,
        must_contain: "",
        must_not_contain: "",
        play_time: moment(subject.value.date).unix(),
        rss_url: rssUrl.value,
        season: 0,
        smart_filter: false,
        title: getTitle(),
        torrent_list: [],
        total: subject.value.total_episodes,
        use_regex: false
    }
}


</script>

<!--
1. 如果有bid ==>  订阅的番剧 查bangumi,
2. 没有bid==> 一定是手动添加的番剧
3. 都没有==> 直接访问的 报404
-->

<template>
    <Loading :loading="!isNaN(bid)&&subjectLoading||!isNaN(id)&&animeLoading">
        <div class="wrapper" :style="wrapperStyle">
            <div class="mask">
                <div class="main">

                    <div v-if="subject.id>0||anime.id>0">
                        <!-- bangumi番剧信息-->
                        <DetailBangumiInfo v-if="subject.id>0" :subject="subject" style="margin: 1.1rem 0"/>
                        <!-- 下载番剧信息 -->
                        <DetailAnimeInfo v-else :anime="anime" style="margin: 1.1rem 0"/>
                        <!-- rss信息 -->
                        <DetailRssInfo v-if="subject.id>0" :name="subject.name_cn?subject.name_cn:subject.name" @getRssUrl="getRssUrl" style="margin: 1.1rem 0"/>
                        <!-- 表单 -->
                        <DetailForm :data="getFormData()" :mode="getFormMode()" style="margin: 1.1rem auto;width: 50%;"/>
                    </div>
                    <Empty v-else/>
                </div>
            </div>
        </div>
    </Loading>
</template>


<style lang="less" scoped>
@import "src/assets/css/var";

.wrapper:extend(.content-wrapper) {
    height: 100%;
    width: 100%;

    background-repeat: no-repeat !important;
    background-size: cover !important;
    background-position: center center !important;
}

.main:extend(.content-main) {
    color: @detail-color;
    mix-blend-mode: difference;
}

.mask {
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, .6);
    overflow: hidden;
}

</style>
