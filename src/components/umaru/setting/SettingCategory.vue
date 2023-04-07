<script lang="ts" setup>
// 规则列表
import {createVNode, ref} from "vue";
import umaruApi from "@/api/umaru";
import {message, Modal} from "ant-design-vue";
import {categoryCreateRequest, categoryDeleteRequest, categoryUpdateRequest} from "@/model/request/umaru";
import {UmaruCategory} from "@/model/umaru_category";
import dayjs from "dayjs";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";


// 表格
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        width: 180,
    },
    {
        title: '来源',
        dataIndex: 'origin',
        width: 180,
        customRender: (item: any) => {
            return item.text === 1 ? '内置分类' : '自定义分类'
        }
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        width: 180,
        customRender: (item: any) => {
            return dayjs.unix(item.text).format("YYYY-MM-DD HH:ss:mm")
        }
    },
    {
        title: '最后更新时间',
        dataIndex: 'update_time',
        width: 180,
        customRender: (item: any) => {
            return dayjs.unix(item.text).format("YYYY-MM-DD HH:ss:mm")
        }
    },
    {
        title: '',
        key: 'action',
        width: 100,
    }
]

// 获取分类
const loading = ref(true)
const categoryList = ref<UmaruCategory[]>([])

function getCategoryList() {
    loading.value = true
    umaruApi.categoryGetList().then(res => {
        categoryList.value = res.data.items
        loading.value = false
    }).catch(err => {
        loading.value = false
        console.log(err)
        message.error(err)
    })
}

getCategoryList();

// 创建分类
const createFormData = ref<categoryCreateRequest>({
    name: ""
})

function createCategory() {
    createLoading.value = true
    umaruApi.categoryCreate(createFormData.value).then(res => {
        message.success("添加成功")
        getCategoryList();
        showCreate.value = false
        createLoading.value = false
    }).catch(err => {
        console.log(err)
        message.error(err)
        showCreate.value = false
        createLoading.value = false
    })
}

function showCreateHandler() {
    createFormData.value.name = ""
    showCreate.value = true
}

const showCreate = ref<boolean>(false)
const createLoading = ref<boolean>(false)

// 更新分类
const updateFormData = ref<categoryUpdateRequest>({
    id: 0,
    name: "",
})

function updateCategory() {
    updateLoading.value = true
    umaruApi.categoryUpdate(updateFormData.value).then(res => {
        message.success("更新成功")
        showUpdate.value = false
        updateLoading.value = false
        getCategoryList();
    }).catch(err => {
        console.log(err)
        message.error(err)
        showUpdate.value = false
        updateLoading.value = false
    })
}

const showUpdate = ref<boolean>(false)
const updateLoading = ref<boolean>(false)

function showUpdateHandler(id: number, name: string) {
    updateFormData.value.id = id
    updateFormData.value.name = name
    showUpdate.value = true
}

// 删除分类
function deleteCategory(id: number) {
    umaruApi.categoryDelete({
        id: id,
    }).then(res => {
        getCategoryList();
    }).catch(err => {
        console.log(err)
        message.error(err)
    })
}

const deleteConfirm = (id: number) => {
    Modal.confirm({
        title: '是否删除该分类?',
        content: '分类删除后,该分类下的番剧将归为未分类',
        icon: createVNode(ExclamationCircleOutlined),

        okText: '确认',
        onOk() {
            deleteCategory(id)
        },

        cancelText: '取消',
        onCancel() {
        }
    });
};

</script>

<template>
    <div>
        <a-button type="primary" @click="showCreateHandler">添加</a-button>
        <a-table :dataSource="categoryList" :columns="columns" class="table">
            <template #bodyCell="{ column,record  }">
                <template v-if="column.key === 'action'">
                    <a-row :gutter="3">
                        <a-col>
                            <a-button type="primary" size="small" @click="showUpdateHandler(record.id,record.name)">编辑</a-button>
                        </a-col>
                        <a-col>
                            <a-button v-if="record.origin===1" type="primary" size="small" danger disabled @click="deleteConfirm(record.id)">删除</a-button>
                            <a-button v-else type="primary" size="small" danger @click="deleteConfirm(record.id)">删除</a-button>
                        </a-col>
                    </a-row>
                </template>
            </template>
        </a-table>
    </div>
    <!-- 创建弹窗 -->
    <a-modal
        title="添加分类"
        ok-text="添加"
        cancel-text="取消"
        v-model:visible="showCreate"
        :confirm-loading="createLoading"
        @ok="createCategory"
    >
        <a-form
            ref="createFormRef"
            :model="createFormData"
            label-align="left"
            :label-col="{span:6}"
            :colon="false"
        >
            <a-form-item label="分类名称" name="name">
                <a-input v-model:value="createFormData.name"/>
            </a-form-item>
        </a-form>
    </a-modal>
    <!-- 编辑弹窗 -->
    <a-modal
        v-model:visible="showUpdate"
        title="编辑分类"
        ok-text="保存"
        cancel-text="取消"
        :confirm-loading="updateLoading"
        @ok="updateCategory"
    >
        <a-form
            ref="updateFormRef"
            :model="updateFormData"
            label-align="left"
            :label-col="{span:6}"
            :colon="false"
        >
            <a-form-item label="分类名称" name="name">
                <a-input v-model:value="updateFormData.name"/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>


<style scoped lang="less">

.table {
    margin: 20px 0;
}

</style>
