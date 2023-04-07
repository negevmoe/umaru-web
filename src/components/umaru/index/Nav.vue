<template>
    <div>
        <a-menu theme="dark"
                @click="onClick"
        >
            <a-menu-item v-for="item in root" :key="item.path">
                <component :is="item.icon"/>&nbsp;&nbsp;{{ item.title }}
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script setup lang="ts">
import routerList from "@/router/list";
import {useRouter} from "vue-router";

const router = useRouter();

const root = function () {
    const base = routerList.find(item => item.name == "index")
    if (!base || !base.children) {
        return [];
    }
    const items = base.children

    let list = [];
    for (let i = 0; i < items.length; i++) {
        const info = items[i].meta.nav
        if (info) {
            list.push({
                path: items[i].path,
                icon: info.icon,
                title: info.title,
            })
        }
    }
    return list;
}()

function onClick(e: any) {
    router.push({path: e.key});
}

</script>

<style lang="less" scoped>


</style>
