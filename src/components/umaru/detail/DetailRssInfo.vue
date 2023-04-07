<script setup lang="ts">
import umaruApi from "@/api/umaru";
import {message} from "ant-design-vue";
import {ref, unref} from "vue";
import {UmaruFeed, UmaruRssInfo} from "@/model/umaru_rss_info";
import Loading from "@/components/common/Loading.vue";
import {copyHandler, downloadHandler, getTorrentSize} from "@/tool/common.js";
import Empty from "@/components/common/Empty.vue";

const props = defineProps({
    name: {
        type: String,
        default: "",
    }
})

const emits = defineEmits(["getRssUrl"]);

const loading = ref(true)
const selectIndex = ref(0)
const rssList = ref<UmaruRssInfo[]>([])

umaruApi.animeGetRss({name: props.name}).then(res => {
    rssList.value = res.data.items
    loading.value = false
    getRss()
}).catch(err => {
    loading.value = false
    console.log(err)
    message.error(err)
})


const rssLoading = ref(true)
const feedList = ref<UmaruFeed[]>([])

function getRss() {
    if (rssList.value.length === 0) {
        rssLoading.value = false
        return
    }
    // 获取rss种子列表
    umaruApi.animeRssParse({
        url: rssList.value[selectIndex.value].rss
    }).then(res => {
        feedList.value = res.data.feed.items
        emits("getRssUrl", rssList.value[selectIndex.value].rss)
        rssLoading.value = false
    }).catch(err => {
        rssLoading.value = false
        console.log(err)
        message.error(err)
    })
}

function changeSelectIndex(index: number) {
    rssLoading.value = true
    // 改变选择的索引
    selectIndex.value = index
    getRss()
}

</script>

<template>
    <div>
        <Loading :loading="loading">
            <Empty v-if="rssList.length===0" message="暂无rss信息" class="empty"/>
            <div v-else>
                <!-- header -->
                <a-row class="header">
                    <a-col :span="4" style="text-align: center">
                        字幕组
                    </a-col>
                    <a-col>
                        RSS: <a v-if="rssList.length>0" :href="rssList[selectIndex].rss" target="_blank">{{ rssList[selectIndex].rss }} </a>
                    </a-col>
                </a-row>
                <!-- content -->
                <a-row>
                    <a-col :span="4" class="group-wrapper">
                        <div style="text-align: center">
                            <div v-for="(item,index) in rssList" :key="item.id"
                                 :class="index===selectIndex?'group-active':'group'"
                                 @click="changeSelectIndex(index)"
                            >
                                {{ item.name }}
                            </div>
                        </div>
                    </a-col>
                    <a-col :span="20" class="rss-wrapper">
                        <Loading :loading="rssLoading">
                            <div v-if="rssList.length===0" style="text-align: center;font-size: 1.2rem">
                                该字幕组暂无相关信息
                            </div>
                            <div v-else>
                                <a-row
                                    :gutter="25"
                                    justify="space-between"
                                    class="torrent-wrapper"
                                    v-for="item in feedList.slice(0,30)"
                                    :key="item.url"
                                >
                                    <a-col :span="18">
                                        <a-typography-paragraph
                                            style="color: inherit;margin: 0"
                                            :ellipsis="{rows:1}"
                                            :content="item.title"
                                        />
                                    </a-col>
                                    <a-col :span="6">
                                        <a-row justify="end">
                                            <a-col>
                                                [{{ getTorrentSize(item.length) }}]
                                            </a-col>
                                            <a-col>
                                    <span @click="()=>copyHandler(item.url)"
                                          style="cursor: pointer;">&nbsp;[<a>复制</a>]&nbsp;</span>
                                            </a-col>
                                            <a-col>
                                    <span @click="()=>downloadHandler(item.url)"
                                          style="cursor: pointer;">&nbsp;[<a>下载</a>]&nbsp;</span>
                                            </a-col>
                                        </a-row>
                                    </a-col>
                                </a-row>
                                <a-row v-if="feedList.length>30" justify="space-between"
                                       class="torrent-wrapper">
                                    {{ "装不下更多啦 >_<" }}
                                </a-row>
                            </div>

                        </Loading>
                    </a-col>
                </a-row>
            </div>
        </Loading>
    </div>
</template>

<style scoped lang="less">
@import "src/assets/css/var";

.header {
    border-bottom: 1px solid @detail-color;
}

.group-wrapper {
    border-right: 1px solid @detail-color;
}

.rss-wrapper {
    padding: 0.5rem 1.5rem;
}

.group {
    cursor: pointer;
}

.group-active:extend(.group) {
    background: linear-gradient(to right, rgba(0, 0, 0, .1) 0%, rgba(122, 122, 122, 0.8) 50%, rgba(0, 0, 0, .1) 100%);
}

.torrent-wrapper {
    color: inherit;
}

.empty {
    color: inherit;
    font-size: 1.2rem;
}
</style>
