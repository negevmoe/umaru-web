<script setup lang="ts">


import SettingRule from "@/components/umaru/setting/SettingRule.vue";
import SettingIndex from "@/components/umaru/setting/SettingIndex.vue";
import SettingCategory from "@/components/umaru/setting/SettingCategory.vue";
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter()
const route = useRoute()

if (!route.query.key) {
    router.replace({name: "setting", query: {key: "index"}})
}

const key = ref(route.query.key)

function changeHandler() {
    router.replace({name: "setting", query: {key: key.value}})
}

</script>

<template>
    <div class="wrapper">
        <a-tabs v-model:activeKey="key" @change="changeHandler">
            <!-- 基础设置 -->
            <a-tab-pane key="index" tab="基础设置">
                <SettingIndex/>
            </a-tab-pane>
            <!-- 分类设置 -->
            <a-tab-pane key="category" tab="分类设置">
                <SettingCategory/>
            </a-tab-pane>
            <!-- 规则设置 -->
            <a-tab-pane key="rule" tab="规则设置">
                <SettingRule/>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>


<style scoped lang="less">
@import "@/assets/css/var.less";

.wrapper:extend(.content-main) {

}


</style>
