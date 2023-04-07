<script setup lang="ts">
import {LoadingOutlined} from "@ant-design/icons-vue";
import {h, PropType} from "vue";

const tip = "努力加载中...(๑•́ ₃•̀๑٥)"
const props = defineProps({
    loading: Boolean
})

const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '24px',
    },
    spin: props.loading,
});
</script>


<template>
    <div v-if="props.loading" class="loading-wrapper">
        <div class="spin-wrapper">
            <a-spin class="loading-spin" :indicator="indicator" :tip="tip"/>
        </div>
    </div>
    <slot v-else/>
</template>


<style lang="less" scoped>

.loading-wrapper {
    background: rgba(0, 0, 0, 0.1);
    height: 100%;
    text-align: center;
}

.spin-wrapper {
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.loading-spin {
    font-size: 1.2rem;
    color: black;
}

</style>
