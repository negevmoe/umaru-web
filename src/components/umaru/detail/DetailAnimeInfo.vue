<script setup lang="ts">
import {PropType} from "vue";

interface Anime {
    id: number;
    bangumi_id: number,
    category_id: number,
    rule_name: string,
    category_name: string,
    title: string,
    season: number,
    cover: string,
    total: number,
    rss_url: string,
    play_time: number,
    create_time: number,
    update_time: number,
}

const props = defineProps({
    anime: {
        type: Object as PropType<Anime>,
        default: () => {
            return {
                id: 0,
                bangumi_id: 0,
                category_id: 0,
                rule_name: "",
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
    }
})
</script>


<template>
    <div>
        <!--{{ props.anime }}-->
    </div>
</template>


<style scoped>

</style>
