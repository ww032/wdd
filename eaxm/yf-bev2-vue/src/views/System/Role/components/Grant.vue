<template>
  <el-dialog v-model="dialogVisible" title="角色授权" width="50%" :before-close="handleClose">
    <ContentWrap v-loading="loading">
      <el-tree
          ref="treeRef"
          :data="treeData"
          :default-checked-keys="grantMenus"
          show-checkbox
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :props="{ class: nodeClass, label: 'metaTitle' }"
      />
    </ContentWrap>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {ContentWrap} from '@/components/ContentWrap'
import {ref, watch, onMounted} from 'vue'
import {ElMessage} from 'element-plus'
import {treeApi} from '@/api/sys/menu'
import {listMenuApi, saveMenuApi} from '@/api/sys/role'
import {ElTree} from 'element-plus'

const treeRef = ref<InstanceType<typeof ElTree>>()

const dialogVisible = ref(false)

// 组件参数
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  roleId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// 监听数据变化
watch(
    () => props.roleId,
    (val) => {
      if (!val) return
      loadData()
    }
)

// 监听数据变化
watch(
    () => props.modelValue,
    (val) => {
      dialogVisible.value = val
    }
)

const loading = ref(false)
const saving = ref(false)
const treeData = ref([])
const grantMenus = ref([])

// 加载数据
const loadData = async () => {
  loading.value = true

  // 清空选定数据
  grantMenus.value = []

  // 等待查询完整的树结构
  await treeApi().then((res) => {
    treeData.value = res.data
  })

  // 填充已经授权的菜�?  await listMenuApi({id: props.roleId}).then((res) => {
    grantMenus.value = res.data
  })

  loading.value = false
}

const handleClose = () => {
  dialogVisible.value = false
  emit('update:modelValue', false)
}

// 保存授权
const handleSave = () => {
  saving.value = true

  const meunIds = treeRef.value!.getCheckedKeys(false)

  saveMenuApi({id: props.roleId, menuIds: meunIds}).then(() => {
    ElMessage({
      showClose: true,
      message: '授权保存成功�?,
      type: 'success'
    })

    saving.value = false

    // 关闭窗口
    handleClose()
  })
}

const nodeClass = (data: any) => {
  if (data.menuType === 2 && data.children && data.children.length > 0) {
    return 'is-menu'
  }
  return null
}

// 加载第一页数�?onMounted(() => {
  // 首次加载数据
  loadData()
})
</script>

<style scoped>
/* 菜单加粗 */
:deep(.is-menu > .el-tree-node__content) {
  font-weight: 700;
}

/* 功能外边框布局 */
:deep(.el-tree-node.is-expanded.is-menu > .el-tree-node__children) {
  display: flex;
  border: #eee 1px solid;
  border-radius: 5px;
  padding: 5px;
}

/* 功能文字 */
:deep(.is-menu > .el-tree-node__children > div) {
  color: #888;
}
</style>
