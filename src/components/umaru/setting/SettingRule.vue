<script lang="ts" setup>
import umaruApi from "@/api/umaru";
import {createVNode, ref} from "vue";
import {UmaruRule} from "@/model/umaru_rule";
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {FormInstance, message, Modal} from "ant-design-vue";
import {ruleCreateRequest, ruleDeleteListRequest, ruleUpdateRequest} from "@/model/request/umaru";
import {Rule} from "ant-design-vue/es/form";

// 规则列表
const loading = ref(true)
const ruleList = ref<UmaruRule[]>([])

function getRuleList() {
    umaruApi.ruleGetList().then(res => {
        ruleList.value = res.data.items
        loading.value = false
    }).catch(err => {
        loading.value = false
        console.log(err)
        message.error(err)
    })
}

getRuleList();

// 创建规则
const createFormData = ref<ruleCreateRequest>({
    episode_filter: "",
    must_contain: "",
    must_not_contain: "",
    name: "",
    smart_filter: false,
    use_regex: false
})

function createRule() {
    createLoading.value = true
    umaruApi.ruleCreate(createFormData.value).then(res => {
        message.success("创建成功")
        getRuleList();
        createLoading.value = false
        showCreate.value = false
    }).catch(err => {
        console.log(err)
        message.error(err)
        createLoading.value = false
        showCreate.value = false
    })
}

const showCreate = ref<boolean>(false)
const createLoading = ref<boolean>(false)

function showCreateHandler() {
    createFormData.value = {
        episode_filter: "",
        must_contain: "",
        must_not_contain: "",
        name: "",
        smart_filter: false,
        use_regex: false
    }
    showCreate.value = true
}

// 更新规则
const updateFormData = ref<ruleUpdateRequest>({
    id: 0,
    episode_filter: "",
    must_contain: "",
    must_not_contain: "",
    name: "",
    smart_filter: false,
    use_regex: false
})

function updateRule() {
    umaruApi.ruleUpdate(updateFormData.value).then(res => {
        message.success("更新成功")
        getRuleList();
    }).catch(err => {
        console.log(err)
        message.error(err)
    })
}

function ruleClickHandler(item: UmaruRule) {
    updateFormData.value.id = item.id
    updateFormData.value.name = item.name
    updateFormData.value.must_contain = item.must_contain
    updateFormData.value.must_not_contain = item.must_not_contain
    updateFormData.value.use_regex = item.use_regex
    updateFormData.value.episode_filter = item.episode_filter
    updateFormData.value.smart_filter = item.smart_filter
}

// 删除规则
const deleteRuleRequest = ref<ruleDeleteListRequest>({
    id_list: []
})

function deleteRule() {
    umaruApi.ruleDeleteList(deleteRuleRequest.value).then(res => {
        message.success("删除成功");
        getRuleList();
    }).catch(err => {
        console.log(err)
        message.error(err)
    })
}

</script>
<template>
    <div>
        <a-row :gutter="10" style="margin-bottom: 20px">
            <a-col>
                <a-button type="primary" size="small" @click="showCreateHandler">添加规则</a-button>
            </a-col>
            <a-col>
                <a-button type="primary" size="small" danger @click="deleteRule">删除选中的规则</a-button>
            </a-col>
        </a-row>
        <a-row :gutter="10">
            <!-- 规则列表 -->
            <a-col :span="8">
                <div class="list-wrapper">
                    <a-checkbox-group v-model:value="deleteRuleRequest.id_list" style="width: 100%">
                        <div v-for="(item,index) in ruleList" :key="item.id" style="display: flex;">
                            <a-checkbox :value="item.id" style="margin-right: 10px;"/>
                            <p style="width: 100%;cursor: pointer" @click="ruleClickHandler(item)">{{ item.name }}</p>
                        </div>
                    </a-checkbox-group>
                </div>
            </a-col>
            <!-- 更新表单 -->
            <a-col :span="16">
                <a-form
                    ref="updateFormRef"
                    :model="updateFormData"
                    label-align="left"
                    :label-col="{span:4}"
                    :colon="false"
                >
                    <a-form-item label="规则名称" name="name">
                        <a-input v-model:value="updateFormData.name"/>
                    </a-form-item>
                    <a-form-item label="必须包含" name="must_contain">
                        <a-input v-model:value="updateFormData.must_contain"/>
                    </a-form-item>
                    <a-form-item label="必须不包含" name="must_not_contain">
                        <a-input v-model:value="updateFormData.must_not_contain"/>
                    </a-form-item>
                    <a-form-item label="剧集过滤" name="episode_filter">
                        <a-input v-model:value="updateFormData.episode_filter"/>
                    </a-form-item>
                    <a-form-item label="使用正则" name="use_regex">
                        <a-switch v-model:checked="updateFormData.use_regex"/>
                    </a-form-item>
                    <a-form-item label="智能剧集过滤" name="smart_filter">
                        <a-switch v-model:checked="updateFormData.smart_filter"/>
                    </a-form-item>
                </a-form>
                <a-button type="primary" size="small" @click="updateRule">保存</a-button>
            </a-col>
        </a-row>

        <a-modal
            title="添加规则"
            ok-text="添加"
            cancel-text="取消"
            v-model:visible="showCreate"
            :confirm-loading="createLoading"
            @ok="createRule"
        >
            <a-form
                ref="createFormRef"
                :model="createFormData"
                label-align="left"
                :label-col="{span:6}"
                :colon="false"
            >
                <a-form-item label="规则名称" name="name">
                    <a-input v-model:value="createFormData.name"/>
                </a-form-item>
                <a-form-item label="必须包含" name="must_contain">
                    <a-input v-model:value="createFormData.must_contain"/>
                </a-form-item>
                <a-form-item label="必须不包含" name="must_not_contain">
                    <a-input v-model:value="createFormData.must_not_contain"/>
                </a-form-item>
                <a-form-item label="剧集过滤" name="episode_filter">
                    <a-input v-model:value="createFormData.episode_filter"/>
                </a-form-item>
                <a-form-item label="使用正则" name="use_regex">
                    <a-switch v-model:checked="createFormData.use_regex"/>
                </a-form-item>
                <a-form-item label="智能剧集过滤" name="smart_filter">
                    <a-switch v-model:checked="createFormData.smart_filter"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>


<style scoped lang="less">
.list-wrapper {
    height: 450px;
}
</style>
