<template>
    <Loading :loading="loading">
        <div class="wrapper">
            <div class="main">
                <a-row :gutter="20" justify="center">
                    <a-col v-for="(week,index) in list" :key="index">
                        <!-- 星期x 列表 -->
                        <div class="subject-wrapper">
                            <!-- 星期标题 -->
                            <h2 class="weekday-title">{{ week.weekday.cn }}</h2>
                            <!-- 番剧卡片 -->
                            <div class="subject-card" v-for="subject in week.items" :key="subject.id">
                                <!-- 封面 -->
                                <a-image :preview="false"
                                         width="150"
                                         height="210"
                                         style="cursor: pointer"
                                         :src="subject.images?subject.images.common:''"
                                         @click="toDetail(subject.id)"
                                />
                                <!-- 番剧名称 -->
                                <a-typography-text
                                    style="cursor: pointer"
                                    strong
                                    @click="toDetail(subject.id)"
                                >
                                    {{ subject.name_cn ? subject.name_cn : subject.name }}
                                </a-typography-text>

                            </div>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
    </Loading>
</template>

<script setup lang="ts">
import {ref} from "vue";
import bangumiApi from "@/api/bangumi";
import {useRouter} from "vue-router";
import {message} from "ant-design-vue";
import Loading from "@/components/common/Loading.vue";

const router = useRouter();

// 新番列表
const loading = ref(true);
const list = ref([])
bangumiApi.getCalendar().then(res => {
    list.value = res.data
    loading.value = false
}).catch(err => {
    loading.value = false
    console.log(err)
    message.error(err)
})

function toDetail(bid: number) {
    router.push({name: "detail", query: {bid: bid}})
}

</script>

<style lang="less" scoped>
@import "src/assets/css/var";

.wrapper:extend(.content-wrapper) {
}

.main:extend(.content-main) {
}

.weekday-title {
    text-align: center;
}

.subject-card {
    text-align: center;
    width: 120px;
    margin-bottom: 1rem;
}

</style>
