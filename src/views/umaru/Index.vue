<!-- 布局 -->

<template>
    <ALayout class="layout">
        <ALayoutSider>
            <Nav/>
        </ALayoutSider>
        <a-layout>
            <a-layout-content style="height: 100%">
                <router-view/>
            </a-layout-content>
        </a-layout>
    </ALayout>
</template>

<script setup lang="ts">
import Nav from "@/components/umaru/index/Nav.vue";
</script>

<style lang="less" scoped>
.layout {
    min-height: 100vh;
}
</style>
