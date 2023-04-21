<script setup lang="ts">
import {PropType, ref} from "vue";
import {Subject} from "@/model/bangumi_subject";
import {FieldTimeOutlined, StarFilled, FireFilled, BorderlessTableOutlined} from "@ant-design/icons-vue";
import bangumiApi from "@/api/bangumi";
import {message} from "ant-design-vue";
import {Character} from "@/model/bangumi_character";
import DetailCharacters from "@/components/umaru/detail/DetailCharacters.vue";
import {getRandomColor} from "@/tool/common.js";

const props = defineProps({
    color: {
        type: String,
        default: "white",
    },

    subject: {
        type: Object as PropType<Subject>,
        default: () => {
            return {
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
            }
        }
    }
})
const subject = <Subject>props.subject

const characterList = ref<Character[]>([])
const characterLoader = ref(true)
if (subject.id > 0) {
    bangumiApi.getCharacters({id: subject.id}).then(res => {
        characterList.value = res.data
        characterLoader.value = false
    }).catch(err => {
        characterLoader.value = false
        console.log(err)
        message.error("获取角色信息失败")
    })
}


</script>

<template>
    <div>
        <!-- 标题 -->
        <a-typography-title :level="2" class="title">
            {{ subject.name_cn ? subject.name_cn : subject.name }}
        </a-typography-title>

        <!-- 简介 -->
        <a-typography-paragraph class="paragraph">
            {{ subject.summary ? subject.summary : "" }}
        </a-typography-paragraph>

        <!-- 基本信息 -->
        <div class="base-info">
            <span style="margin-right: 1rem"><FieldTimeOutlined/>&nbsp;放送开始日期：{{ subject.date }}</span>
            <span style="margin-right: 1rem"><BorderlessTableOutlined/>&nbsp;总集数：{{ subject.eps }}</span>
            <span style="margin-right: 1rem"><FireFilled/>&nbsp;排名：{{
                subject.rating ? subject.rating.rank : null
                }}</span>
            <span><StarFilled/>&nbsp;评分：{{ subject.rating ? subject.rating.score : null }}</span>
        </div>

        <!-- 角色列表 -->
        <DetailCharacters class="character-info" style="margin-bottom: 1.1rem"
                          :characterList="characterList.slice(0,9)"/>

        <!-- 标签列表 -->
        <div style="padding: 0.5rem;" v-if="subject.tags.length>0">
            <a-tag :color="getRandomColor()" style="margin-bottom: 0.5rem" v-for="item in subject.tags"
                   :key="item.name">
                {{ item.name }}
            </a-tag>
        </div>
    </div>
</template>

<style scoped lang="less">

.title {
  position: relative;
  text-align: center;
  color: inherit;
}

.paragraph {
  position: relative;
  width: 100%;
  color: inherit;
}

.base-info {
  position: relative;
  display: flex;
  margin: 1.1rem 0;
  color: inherit;
}

.character-info {
  color: inherit;
}
</style>
