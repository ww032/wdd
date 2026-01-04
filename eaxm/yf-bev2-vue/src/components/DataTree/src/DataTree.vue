<template>
  <div v-loading="loading" element-loading-text="加载�?..">
    <div class="search-box">
      <div class="search-items">
        <el-input v-model="filterText" class="filter-item" placeholder="搜索关键�?/>
      </div>

      <el-button icon="Search" type="primary" @click="search()">搜索</el-button>
      <el-button icon="RefreshLeft" @click="reset()">重置</el-button>
    </div>

    <div class="opt-box">
      <div class="opt-box-left">
        <el-button v-if="props.add" icon="Plus" type="primary" @click="handleAddRoot()"
        >添加
        </el-button>
        <el-button v-if="props.edit" icon="Edit" type="success" @click="batchEdit()"
        >修改
        </el-button>
        <el-button v-if="props.delete" icon="Delete" type="danger" @click="batchDelete()"
        >删除
        </el-button>
      </div>

      <div class="opt-box-right">
        <el-button circle icon="Refresh" size="small" @click="loadData"/>
      </div>
    </div>

    <div ref="treeHeader" class="header-box">
      <!-- 表头-->
      <div
          v-for="(item, index) in props.columns"
          :key="index"
          :style="calcWidth(index, item.center || false)"
          class="tree-header"
      >
        {{ item.title }}
      </div>

      <!-- 操作项列-->
      <div
          v-if="props.add || props.edit || props.delete"
          :style="calcWidth(props.columns.length, true)"
          class="tree-header"
      >操作�?      </div>
    </div>

    <el-tree
        ref="treeRef"
        :allow-drop="props.allowDrop"
        :data="records"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        default-expand-all
        draggable
        highlight-current
        node-key="id"
        show-checkbox
        @node-drop="handleDrag"
    >
      <template #default="{ data }">
        <div class="tree-box">
          <div
              v-for="(item, index) in props.columns"
              :key="index"
              :style="calcWidth(index, item.center || false)"
              class="tree-item"
          >
            <Icon v-if="item.icon" :icon="data[item.icon]"/>
            {{ data[item.prop] }}
          </div>

          <div
              v-if="props.add || props.edit || props.delete"
              :style="calcWidth(props.columns.length, true)"
              class="tree-item"
          >
            <el-button
                v-if="props.add"
                :disabled="!data.id"
                circle
                icon="Plus"
                size="small"
                @click="handleAdd(data)"
            />
            <el-button
                v-if="props.edit"
                :disabled="!data.id"
                circle
                icon="Edit"
                size="small"
                @click="handleEdit(data)"
            />
            <el-button
                v-if="props.delete"
                :disabled="!data.id"
                circle
                icon="Delete"
                size="small"
                type="danger"
                @click="handleDelete([data.id])"
            />
          </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, PropType, ref} from 'vue'
import {ElMessage, ElMessageBox, ElTree} from 'element-plus'
import {Icon} from '@/components/Icon'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type {AllowDropType} from 'element-plus/es/components/tree/src/tree.type'
import type {TreeColumnType} from './types'
import request from '@/config/axios'

// 事件定义
const emit = defineEmits(['onAdd', 'onEdit', 'onDelete', 'onBatch'])

// 表格参数
const props = defineProps({
  columns: {
    type: Array as PropType<TreeColumnType[]>,
    default: () => []
  },
  filterKey: {
    type: String,
    default: 'title'
  },
  allowDrop: Function,
  add: Boolean,
  edit: Boolean,
  delete: Boolean,
  sort: Boolean,
  treeUrl: String,
  sortUrl: String,
  deleteUrl: String
})

// 页面参数
const records = ref([])
const loading = ref(false)

// 菜单搜索
const filterText = ref('')

// 加载数据
const loadData = () => {
  loading.value = true

  request
      .post({url: props.treeUrl})
      .then((res) => {
        records.value = res.data
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
}

// 添加�?const handleAddRoot = () => {
  emit('onAdd')
}

// 添加子项
const handleAdd = (row: any) => {
  emit('onAdd', row)
}

// 修改
const handleEdit = (row: any) => {
  emit('onEdit', row)
}

// 树表头的百分�?const withArr = ref<Number[]>([])
const treeHeader = ref<Element>()

// 根据传入的百分比计算宽度
const calcWidth = (index: number, center: boolean) => {
  // 第一项为树标题，自适应
  if (index === 0) {
    return 'flex-grow: 1'
  }
  // 获取预设宽度
  const width = withArr.value[index]
  return `width: ${width}px; justify-content: ${center ? 'center' : 'left'}`
}

// 删除数据
const handleDelete = (ids: any[]) => {
  if (!ids || ids.length == 0) {
    ElMessage.error('请至少勾选一个数据！')
    return
  }

  ElMessageBox.confirm('确实要删除吗?', '提示信息', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    request.post({url: props.deleteUrl, data: {ids: ids}}).then(() => {
      ElMessage({
        showClose: true,
        message: '删除成功�?,
        type: 'success'
      })

      // 刷新页面
      loadData()
    })
  })
}

// 批量删除
const batchDelete = () => {
  const ids = treeRef.value!.getCheckedKeys(false)
  handleDelete(ids)
}

// 批量删除
const batchEdit = () => {
  const row = treeRef.value!.getCurrentNode()

  if (!row) {
    ElMessage.error('请选择一条数据再编辑�?)
    return
  }
  handleEdit(row)
}

// 执行排序
const handleDrag = (draggingNode: Node, dropNode: Node, dropType: AllowDropType) => {
  const params = {form: draggingNode.data.id, to: dropNode.data.id, dropType: dropType}

  request.post({url: props.sortUrl, data: params}).then(() => {
    ElMessage({
      showClose: true,
      message: '排序成功�?,
      type: 'success'
    })

    // 刷新页面
    loadData()
  })
}

const treeRef = ref<InstanceType<typeof ElTree>>()

// 树过滤规�?const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data[props.filterKey].includes(value)
}

// 执行搜索
const search = () => {
  treeRef.value!.filter(filterText.value)
}

const reset = () => {
  filterText.value = ''
  treeRef.value!.filter(filterText.value)
}

// 刷新
const reload = () => {
  loadData()
}

// 计算列宽
const initWidth = () => {
  withArr.value = []

  // 默认屏幕宽度
  let clientWidth = 768
  if (treeHeader.value && treeHeader.value && treeHeader.value.clientWidth) {
    // 总宽�?    clientWidth = treeHeader.value.clientWidth
  }

  // 计算总分�?  let total = 0
  for (let i = 0; i < props.columns.length; i++) {
    total += props.columns[i].width
    withArr.value[i] = props.columns[i].width
  }

  const perSize: number = clientWidth / total
  for (let i = 0; i < withArr.value.length; i++) {
    withArr.value[i] = withArr.value[i].valueOf() * perSize
  }

  // 操作项宽度默认平均�?  withArr.value.push(perSize * (100 - total))
}

// 加载第一页数�?onMounted(() => {
  // 计算列宽
  initWidth()
  // 首次加载数据
  loadData()
  // 窗口变化重新计算
  window.addEventListener('resize', initWidth)
})

// 对外开放数�?defineExpose({
  reload
})
</script>

<style scoped>
:deep(.el-tree-node__content) {
  padding: 20px 0px 20px 0px;
  border-bottom: #efefef 1px solid;
}

.tree-box {
  display: flex;
  align-items: center;
  width: 100%;
}

.header-box {
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: #e5e7eb 1px solid;
  height: 42px;
  font-size: 14px;
}

.tree-header {
  font-weight: 700;
  color: #909399;
  align-items: center;
  display: flex;
}

.tree-item {
  color: #666;
  font-size: 14px;
  align-items: center;
  display: flex;
}

.tree-grow {
  flex-grow: 1;
}
</style>
