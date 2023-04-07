<script setup lang="ts">
import {Character, CharacterActors} from "@/model/bangumi_character";
import {PropType} from "vue";

const props = defineProps({
    characterList: {
        type: Array as PropType<Character[]>,
        default: []
    }
})

function getCharacterName(relation: string, name: string) {
    return `${relation}：${name}`
}

function getActorsName(actors: CharacterActors[]) {
    return actors.map(item => {
        return item.name
    })
}

function getActorsContent(actors: CharacterActors[]) {
    const str = getActorsName(actors).join("/")
    return "CV: " + str
}
</script>

<template>
    <!-- 卡片 flex-->
    <div class="wrapper">
        <a-row :gutter="16">
            <a-col :span="8" v-for="item in props.characterList" :key="item.id">
                <a-row>
                    <a-col flex="60px">
                        <img class="image" :src="item.images.grid" :alt="item.name"/>
                    </a-col>
                    <a-col :span="16">
                        <a-row>
                            <a-typography-paragraph
                                :ellipsis="true"
                                :content="getCharacterName(item.relation,item.name)"
                                style="color:inherit;"/>
                        </a-row>
                        <a-row>
                            <a-typography-paragraph
                                :ellipsis="{rows:2}"
                                :content="getActorsContent(item.actors)"
                                style="color:inherit;font-size: 0.6rem"/>
                        </a-row>
                    </a-col>
                </a-row>

            </a-col>

        </a-row>

    </div>
</template>

<style scoped lang="less">
.wrapper {
    display: flex;

    flex-wrap: wrap;
}

.item {
    display: flex;
    width: 200px;
    margin: 0.2rem 1rem;
    white-space: nowrap;
}

.image {
    width: 50px;
    height: 80px;
    object-fit: cover;
    object-position: top;
}

.content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    color: inherit;

    span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 150px;
    }
}

</style>
