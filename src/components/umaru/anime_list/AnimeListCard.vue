<script lang="ts" setup>
import {UmaruAnime, UmaruVideo} from "@/model/umaru_anime";
import {createVNode, PropType, ref} from "vue";
import fallbackImage from "@/assets/js/fallbackImage.js";
import {FolderFilled, DeleteFilled, ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {useRouter} from "vue-router";
import dayjs from "dayjs";
import umaruApi from "@/api/umaru";
import {message, Modal} from "ant-design-vue";

const router = useRouter();

const deleteEmit = defineEmits(['deleteAnime']);

defineProps({
    value: {
        type: Object as PropType<UmaruAnime>,
        default: {
            id: 0,
            bangumi_id: 0,
            category_id: 0,
            category_name: "",
            title: "",
            season: 0,
            cover: "",
            total: 0,
            rss_url: "",
            play_time: 0,
            create_time: 0,
            update_time: 0
        }
    }
})

function getDateTime(t: number): string {
    return dayjs.unix(t).format("YYYY-MM-DD HH:mm:ss")
}

function getDate(t: number): string {
    return dayjs.unix(t).format("YYYY-MM-DD")
}

// 获取番剧的硬连接文件路径列表
const videoList = ref<UmaruVideo[]>([]);
const videoListShow = ref<boolean>(false);
const videoListLoading = ref<boolean>(false);

function getLinkPathList(id: number) {
    videoListLoading.value = true
    umaruApi.animeGetVideoList({id: id}).then(res => {
        console.log(res)
        videoList.value = res.data.items
        videoListLoading.value = false
    }).catch(err => {
        videoListLoading.value = false
        console.log(err)
        message.error(err)
    })
}

// 删除番剧
function deleteConfirm(id: number) {
    Modal.confirm({
        title: '是否删除番剧?',
        content: '删除番剧将会删除硬连接的视频文件并取消订阅,不会删除qbittorrent下载的视频',
        icon: createVNode(ExclamationCircleOutlined),

        okText: '确认',
        onOk() {
            deleteEmit("deleteAnime", id);
        },

        cancelText: '取消',
        onCancel() {
        }
    });
}

</script>

<template>
    <div class="wrapper">
        <a-row>
            <!-- 封面图 -->
            <a-col flex="140px" :span="4">
                <a-image :src="value.cover"
                         :fallback="fallbackImage"
                         :preview="false"
                         height="180px"

                         style="cursor: pointer;"
                         @click="()=>{router.push({name:'detail',query:{id:value.id,bid:value.bangumi_id}})}"
                />
            </a-col>
            <!-- 信息 -->
            <a-col :span="20">
                <div class="info-wrapper">
                    <div style="display: flex;justify-content: space-between;">
                        <!-- 标题 -->
                        <p style="font-weight: bold;margin-bottom: 0.2rem;cursor: pointer;" @click="()=>{ router.push({name:'detail',query:{id:value.id,bid:value.bangumi_id}})}">
                            {{ value.title }}
                        </p>
                        <div>
                            <!--<FolderFilled style="font-size: 1.2rem;margin-right: 0.5rem;" @click="()=>{-->
                            <!--    getLinkPathList(value.id);-->
                            <!--    videoListShow = true;-->
                            <!--}"/>-->
                            <DeleteFilled style="font-size: 1.2rem;" @click="deleteConfirm(value.id)"/>
                        </div>
                    </div>

                    <p>分类：{{ value.category_name }}</p>
                    <p>RSS：<a :href="value.rss_url" target="_blank">{{ value.rss_url }}</a></p>

                    <p>
                        <span style="margin-right: 1.2rem;">放送时间：{{ getDate(value.play_time) }}</span>
                        <span>总集数：{{ value.total }}</span>
                    </p>

                    <p>
                        <span style="margin-right: 1.2rem;">创建时间：{{ getDateTime(value.create_time) }}</span>
                        <span>更新时间：{{ getDateTime(value.update_time) }}</span>
                    </p>
                </div>
            </a-col>
        </a-row>
    </div>

    <!-- 视频列表信息 -->
    <a-modal v-model:visible="videoListShow" title="硬连接文件列表" @ok="()=>{}">
        {{ videoList }}
    </a-modal>

</template>


<style lang="less" scoped>

.wrapper {
    margin-bottom: 20px;
    width: 100%;
    max-height: 180px;
    border-radius: 10px;
    box-shadow: 6px 8px 10px #afafaf
}

.info-wrapper {
    p {
        margin: 0;
    }
}
</style>
