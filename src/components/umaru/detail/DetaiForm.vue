<!--
创建番剧用表单
-->
<script setup lang="ts">
import {createVNode, PropType, reactive, ref, watch} from "vue";
import umaruApi from "@/api/umaru";
import {UmaruCategory} from "@/model/umaru_category";
import {message, Modal} from "ant-design-vue";
import {UmaruRule} from "@/model/umaru_rule";
import {UmaruAnimeForm} from "@/model/umaru_anime_form";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const props = defineProps({
    data: {
        type: Object as PropType<UmaruAnimeForm>,
        default: {
            id: 0,
            bangumi_id: 0,
            title: "",
            category_id: 0,
            season: 0,
            cover: "",
            total: 0,
            rss_url: "",
            play_time: 0,
            torrent_list: [],
            must_contain: "",
            must_not_contain: "",
            episode_filter: "",
            use_regex: false,
            smart_filter: false
        }
    },
    mode: {
        type: Number,
        default: 0
    }
})

// 状态
const mode = ref<number>(props.mode)

// 分类列表
const categoryLoading = ref(true)
const categoryList = ref<UmaruCategory[]>([])
umaruApi.categoryGetList().then(res => {
    categoryList.value = res.data.items
    categoryLoading.value = false
}).catch(err => {
    categoryLoading.value = false
    console.log(err)
    message.error(err)
})

// 规则列表
const ruleLoading = ref(true)
const ruleSelectValue = ref<number>()
const ruleList = ref<UmaruRule[]>([])
umaruApi.ruleGetList().then(res => {
    ruleList.value = res.data.items
    ruleLoading.value = false
}).catch(err => {
    ruleLoading.value = false
    console.log(err)
    message.error(err)
})

// 选择规则事件
function ruleChangeHandler(rule: UmaruRule) {
    formState.must_contain = rule.must_contain
    formState.must_not_contain = rule.must_not_contain
    formState.episode_filter = rule.episode_filter
    formState.smart_filter = rule.smart_filter === 1
    formState.use_regex = rule.use_regex === 1
}

// 表单
const formRef = ref();
const formState = reactive<UmaruAnimeForm>({
    id: props.data.id,
    bangumi_id: props.data.bangumi_id,
    category_id: props.data.category_id,
    cover: props.data.cover,
    episode_filter: props.data.episode_filter,
    must_contain: props.data.must_contain,
    must_not_contain: props.data.must_not_contain,
    play_time: props.data.play_time,
    rss_url: props.data.rss_url,
    season: props.data.season,
    smart_filter: props.data.smart_filter,
    title: props.data.title,
    torrent_list: props.data.torrent_list,
    total: props.data.total,
    use_regex: props.data.use_regex,
})

// 监听props的rss url
watch(
    () => props.data?.rss_url,
    url => {
        formState.rss_url = url
    }
)


// 创建并订阅
function createAndSubscribeHandler() {
    umaruApi.animeCreate({
        bangumi_id: formState.bangumi_id,
        category_id: formState.category_id,
        cover: formState.cover,
        episode_filter: formState.episode_filter,
        must_contain: formState.must_contain,
        must_not_contain: formState.must_not_contain,
        play_time: formState.play_time,
        rss_url: formState.rss_url ? formState.rss_url : props.data?.rss_url,
        season: formState.season,
        smart_filter: formState.smart_filter,
        title: formState.title,
        torrent_list: formState.torrent_list,
        total: formState.total,
        use_regex: formState.use_regex
    }).then(res => {
        formState.id = res.data.id
        mode.value = 3
        message.success("添加成功")
    }).catch(err => {
        message.error(err)
    })
}

// 更新handler
function updateHandler() {
    const req = {
        id: formState.id,
        title: formState.title,
        category_id: formState.category_id,
        season: formState.season,
        cover: formState.cover,
        play_time: formState.play_time,
        total: formState.total
    }

    umaruApi.animeUpdate(req).then(res => {
        message.success("更新成功")
    }).catch(err => {
        message.error(err)
    })
}

// 订阅handler
function subscribeHandler() {
    umaruApi.animeRssCreate({
        id: formState.id,
        episode_filter: formState.episode_filter,
        must_contain: formState.must_contain,
        must_not_contain: formState.must_not_contain,
        rss_url: formState.rss_url,
        smart_filter: formState.smart_filter,
        use_regex: formState.use_regex
    }).then(res => {
        mode.value = 3
        message.success("订阅成功")
    }).catch(err => {
        message.error(err)
    })
}

// 取消订阅handler
const deleteConfirm = (id: number) => {
    Modal.confirm({
        title: '是否取消订阅?',
        content: '取消订阅将删除qbittorrent中的rss订阅,不会删除qbittorrent下载的视频与硬连接视频文件',
        icon: createVNode(ExclamationCircleOutlined),

        okText: '确认',
        onOk() {
            deleteSubscribeHandler();
        },

        cancelText: '取消',
        onCancel() {
        }
    });
};

function deleteSubscribeHandler() {
    umaruApi.animeRssDelete({
        id: formState.id
    }).then(res => {
        mode.value = 2
        message.success("取消订阅成功")
    }).catch(err => {
        message.error(err)
    })
}

// 重置表单
function resetForm() {
    formRef.value.resetFields();
    formState.category_id = props.data.category_id;
    ruleSelectValue.value = undefined;
}

</script>

<template>
    <div class="wrapper">
        <a-row :gutter="50">
            <a-col :span="16">
                <a-form
                    ref="formRef"
                    :model="formState"
                    label-align="left"
                    :label-col="{span:6}"
                    :colon="false"
                >
                    <a-form-item label="番剧标题" name="title">
                        <a-input v-model:value="formState.title"/>
                    </a-form-item>
                    <a-form-item label="季" name="season">
                        <div>
                            <a-input-number v-model:value="formState.season" :min="0" :max="999" size="small" style="width:20%"/>
                            <span style="color: #afafaf;margin-left: 1.2rem;">不填或填0,将从标题中获取</span>
                        </div>
                    </a-form-item>
                    <a-form-item label="分类" name="category">
                        <a-select v-model:value="formState.category_id">
                            <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                        </a-select>
                    </a-form-item>

                    <div v-if="mode<=2 ">
                        <a-form-item label="必须包含" name="must_contain">
                            <a-input v-model:value="formState.must_contain"/>
                        </a-form-item>
                        <a-form-item label="必须不包含" name="must_not_contain">
                            <a-input v-model:value="formState.must_not_contain"/>
                        </a-form-item>
                        <a-form-item label="剧集过滤" name="episode_filter">
                            <a-input v-model:value="formState.episode_filter"/>
                        </a-form-item>
                        <a-form-item label="使用正则" name="use_regex">
                            <a-switch v-model:checked="formState.use_regex"/>
                        </a-form-item>
                        <a-form-item label="智能剧集过滤" name="smart_filter">
                            <a-switch v-model:checked="formState.smart_filter"/>
                        </a-form-item>
                    </div>
                </a-form>
            </a-col>
            <a-col :span="8">
                <a-button v-if="mode===1" :disabled="!props.data.rss_url" type="primary" size="small" class="form-button" @click="createAndSubscribeHandler">
                    添加并订阅
                </a-button>
                <a-button v-if="mode>1" type="primary" size="small" class="form-button" @click="updateHandler">更新</a-button>
                <a-button v-if="mode===2" type="primary" size="small" class="form-button" @click="subscribeHandler">订阅</a-button>
                <a-button v-if="mode===3" type="primary" size="small" class="form-button" @click="deleteConfirm" danger>取消订阅</a-button>
                <a-button type="primary" size="small" class="form-button" @click="resetForm">重置</a-button>

                <a-select v-if="mode<=2 " style="width: 100%" placeholder="选择规则" v-model:value="ruleSelectValue" size="small">
                    <a-select-option v-for="item in ruleList" :key="item.id" :value="item.id" @click="ruleChangeHandler(item)">
                        {{ item.name }}
                    </a-select-option>
                </a-select>

            </a-col>
        </a-row>
    </div>
</template>


<style scoped lang="less">
.wrapper {
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, .1);
    background: rgba(255, 255, 255, .1);
    backdrop-filter: blur(10px);
    padding: 1.5rem;
    width: 40%;
    margin: auto;
}

.form-button {
    width: 100%;
    margin-bottom: 1.1rem
}

</style>
