<template>
    <div class="wrapper">
        <h3>{{ props.message }}</h3>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    message: {
        type: String,
        default: "暂无数据"
    }
})
</script>

<style lang="less" scoped>

.wrapper {
    text-align: center;
    height: 100%;
    width: 100%;
}

</style>
