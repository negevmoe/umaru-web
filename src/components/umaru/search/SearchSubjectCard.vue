<script setup lang="ts">
import {PropType} from "vue";
import {SearchItem} from "@/model/bangumi_subject";
import fallbackImage from "@/assets/js/fallbackImage.js";
import {FieldTimeOutlined, StarFilled, FireFilled, BorderlessTableOutlined} from "@ant-design/icons-vue";
import {useRouter} from "vue-router";
import {getRandomColor} from "@/tool/common.js";

const router = useRouter();
defineProps({
    value: {
        type: Object as PropType<SearchItem>,
        default: {
            date: "",
            image: "",
            name: "",
            name_cn: "",
            tags: [],
            score: 0,
            id: 0,
            rank: 0,
        }
    }
})

</script>

<template>
    <div class="wrapper">
        <a-row>
            <!-- 封面图 -->
            <a-col flex="140px" :span="4">
                <a-image :src="value.image"
                         :fallback="fallbackImage"
                         :preview="false"
                         height="180px"
                         style="cursor: pointer;"
                         @click="()=>{router.push({name:'detail',query:{id:0,bid:value.id}})}"/>
            </a-col>

            <!-- 信息 -->
            <a-col flex="auto" :span="20">
                <div class="info-wrapper">
                    <!-- 标题 -->
                    <p style="font-weight: bold;cursor: pointer;" @click="()=>{ router.push({name:'detail',query:{bid:value.id}})}">
                        {{ value.name_cn || value.name }}
                    </p>

                    <!-- 基本信息 -->
                    <div style="display: flex;margin:0.2rem;">
                        <span style="margin-right: 1rem"><FieldTimeOutlined/>&nbsp;放送开始日期：{{ value.date }}</span>
                        <span style="margin-right: 1rem"><FireFilled/>&nbsp;排名：{{ value.rank }}</span>
                        <span><StarFilled/>&nbsp;评分：{{ value.score }}</span>
                    </div>

                    <!-- 标签列表 -->
                    <div v-if="value.tags.length>0" style="display: flex;flex-wrap: wrap;">
                        <a-tag v-for="tag in value.tags.slice(0,40)" :key="tag.name" :color="getRandomColor()" style="margin-right: 0.2rem;">{{ tag.name }}</a-tag>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<style scoped lang="less">

.wrapper {
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
