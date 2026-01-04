<template>
  <ContentWrap v-loading="loading" element-loading-text="加载�?..">
    <div class="search-box">
      <div class="search-items">
        <el-input class="filter-item" v-model="filterText" placeholder="搜索菜单名称"/>
      </div>

      <el-button type="primary" icon="Search" @click="search()">搜索</el-button>
      <el-button icon="RefreshLeft" @click="reset()">重置</el-button>
    </div>

    <div class="opt-box">
      <div class="opt-box-left">
        <el-button type="primary" icon="Plus" @click="handleAddRoot(formRef)">添加</el-button>
        <el-button type="success" icon="Edit" @click="batchEdit()">修改</el-button>
        <el-button type="danger" icon="Delete" @click="batchDelete()">删除</el-button>
      </div>

      <div class="opt-box-right">
        <el-button icon="Refresh" size="small" circle @click="loadData"/>
      </div>
    </div>

    <div class="header-box" ref="treeHeader">
      <div class="tree-header" style="flex-grow: 1"> 菜单名称</div>
      <div class="tree-header" :style="calcWidth(0, true)"> 菜单类型</div>
      <div class="tree-header" :style="calcWidth(1, false)"> 权限标识</div>
      <div class="tree-header" :style="calcWidth(2, false)"> 菜单路由</div>
      <div class="tree-header" :style="calcWidth(3, false)"> 视图组件</div>
      <div class="tree-header" :style="calcWidth(4, true)"> 可见状�?/div>
      <div class="tree-header" :style="calcWidth(5, true)">操作�?/div>
    </div>

    <el-tree
        ref="treeRef"
        :data="records"
        :allow-drop="allowDrop"
        show-checkbox
        draggable
        node-key="id"
        check-strictly
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        highlight-current
        @node-drop="handleDrag"
    >
      <template #default="{ data }">
        <div class="tree-box">
          <div class="tree-item" style="flex-grow: 1">
            <Icon v-if="data.metaIcon" :icon="data.metaIcon"/>
            <span>&nbsp;{{ data.metaTitle }}</span>
          </div>
          <div class="tree-item" :style="calcWidth(0, true)">
            <span>{{ data.menuType_dictText }}</span>
          </div>
          <div class="tree-item" :style="calcWidth(1, false)">
            <span>{{ data.permissionTag }}</span>
          </div>

          <div class="tree-item" :style="calcWidth(2, false)">
            <span>{{ data.path }}</span>
          </div>

          <div class="tree-item" :style="calcWidth(3, false)">
            <span>{{ data.component }}</span>
          </div>

          <div class="tree-item" :style="calcWidth(4, true)">
            <el-tag type="success" v-if="!data.hidden">显示</el-tag>
            <el-tag type="info" v-else>隐藏</el-tag>
          </div>

          <div class="tree-item" :style="calcWidth(5, true)">
            <el-button
                :disabled="!data.id || data.menuType === 3"
                type="default"
                size="small"
                circle
                icon="Plus"
                @click="handleAdd(data, formRef)"
            />
            <el-button
                :disabled="!data.id"
                type="default"
                size="small"
                icon="Edit"
                circle
                @click="handleEdit(data)"
            />
            <el-button
                :disabled="!data.id"
                type="danger"
                size="small"
                icon="Delete"
                circle
                @click="handleDelete(data.id)"
            />
          </div>
        </div>
      </template>
    </el-tree>

    <el-dialog v-model="dialogVisible" title="管理菜单" width="35%" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="类型" prop="menuType">
          <div class="flex items-center">
            <el-radio-group v-model="form.menuType">
              <el-radio :label="1" :disabled="menuType === 2">目录</el-radio>
              <el-radio :label="2" :disabled="menuType === 2 || form.parentId === '0'"
              >菜单
              </el-radio
              >
              <el-radio :label="3" :disabled="menuType !== 2">功能</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item label="名称" prop="metaTitle">
          <el-input v-model="form.metaTitle" autocomplete="off"/>
        </el-form-item>

        <el-form-item label="英文�? prop="name">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>

        <el-form-item label="视图组件" prop="component">
          <el-input v-model="form.component" autocomplete="off"/>
        </el-form-item>

        <el-form-item label="路由路径" prop="path">
          <el-input v-model="form.path" autocomplete="off"/>
        </el-form-item>

        <el-form-item label="权限标识" prop="permissionTag">
          <el-input v-model="form.permissionTag" autocomplete="off"/>
        </el-form-item>

        <el-form-item
            v-if="form.menuType === 1 || form.menuType === 2"
            label="图标"
            prop="metaIcon"
        >
          <el-input
              v-model="form.metaIcon"
              autocomplete="off"
              placeholder="填写图标名称�? carbon:settings,请在以下链接查找"
          />
          <small>
            <a href="https://icon-sets.iconify.design/" target="_blank"
            >https://icon-sets.iconify.design/</a
            >
          </small>
        </el-form-item>

        <el-form-item label="是否隐藏" prop="hidden">
          <el-switch
              v-model="form.hidden"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              active-text="�?
              inactive-text="�?
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {ContentWrap} from '@/components/ContentWrap'
import {onMounted, reactive, ref} from 'vue'
import {treeApi, saveApi, deleteApi, detailApi, sortApi} from '@/api/sys/menu'
import {Icon} from '@/components/Icon'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessageBox, ElMessage, ElTree} from 'element-plus'
import type {MenuDataType} from './types'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type {AllowDropType} from 'element-plus/es/components/tree/src/tree.type'

// 页面参数
const records = ref([])
const loading = ref(false)

// 菜单搜索
const filterText = ref('')

// 加载数据
const loadData = () => {
  loading.value = true
  treeApi()
      .then((res) => {
        records.value = res.data
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
}

const dialogVisible = ref(false)
const menuType = ref(1)
const form = ref<MenuDataType>({})
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  menuType: [
    {
      required: true,
      message: '请选择菜单类型',
      trigger: 'blur'
    }
  ],
  metaTitle: [
    {
      required: true,
      message: '请输入标�?,
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入菜单英文名称！',
      trigger: 'blur'
    }
  ],

  component: [
    {
      required: true,
      message: '请输入视图路�?,
      trigger: 'blur'
    }
  ],
  path: [
    {
      required: true,
      message: '请输入访问路�?,
      trigger: 'blur'
    }
  ],
  permissionTag: [
    {
      required: true,
      message: '请输入权限标�?,
      trigger: 'blur'
    }
  ]
})

// 打开添加窗口
const handleAddRoot = (formEl: FormInstance | undefined) => {
  menuType.value = 1
  //清空表单
  formEl?.resetFields()

  // 清空�?  form.value = {
    menuType: 1,
    parentId: '0'
  }
  dialogVisible.value = true
}

// 打开添加窗口
const handleAdd = (row: any, formEl: FormInstance | undefined) => {
  menuType.value = row.menuType

  //清空表单
  formEl?.resetFields()
  form.value = {}

  if (menuType.value === 1) {
    form.value.menuType = 1
  }
  if (menuType.value === 2) {
    form.value.menuType = 3
  }

  form.value.parentId = row.id
  dialogVisible.value = true
}

// 打开修改窗口
const handleEdit = (row: any) => {
  detailApi({id: row.id}).then((res) => {
    form.value = res.data
    dialogVisible.value = true
  })
}

const handleClose = () => {
  dialogVisible.value = false
}

// 树表头的百分�?const withArr = ref([15, 15, 15, 15, 10, 10])
const treeHeader = ref<Element>()

// 根据传入的百分比计算宽度
const calcWidth = (index: number, center: boolean) => {
  if (!treeHeader.value || !treeHeader.value || !treeHeader.value.clientWidth) {
    return '100px'
  }

  const px = withArr.value[index]
  const width = treeHeader.value.clientWidth
  const fixed = (width * px) / 100
  return `width: ${fixed}px; justify-content: ${center ? 'center' : 'left'}`
}

// 删除数据
const handleDelete = (ids: any[]) => {
  ElMessageBox.confirm('确实要删除吗?', '提示信息', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteApi({ids: ids}).then(() => {
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

// 保存菜单或功�?const handleSave = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate((valid) => {
    if (!valid) {
      return
    }

    // 功能自动隐藏
    if (form.value.menuType === 3) {
      form.value.hidden = true
    }

    saveApi(form.value).then(() => {
      dialogVisible.value = false

      ElMessage({
        showClose: true,
        message: '保存成功�?,
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
  handleEdit(row)
}

const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  // 跨菜单移动功能，意义不大
  if (draggingNode.data.menuType === 3 && draggingNode.data.parentId !== dropNode.data.parentId) {
    return false
  }

  // 放入内部
  if (type === 'inner') {
    // 功能只能被放到菜单下
    if (draggingNode.data.menuType === 3 && dropNode.data.menuType !== 2) {
      return false
    }

    // 菜单只能放到目录�?    if (draggingNode.data.menuType === 2 && dropNode.data.menuType !== 1) {
      return false
    }

    // 目录只能放到目录下面
    if (draggingNode.data.menuType === 1 && dropNode.data.menuType !== 1) {
      return false
    }
  } else {
    // 相邻的情况，只能同类�?    if (draggingNode.data.menuType !== dropNode.data.menuType) {
      return false
    }
  }

  return true
}

// 执行排序
const handleDrag = (draggingNode: Node, dropNode: Node, dropType: DropType) => {
  sortApi({form: draggingNode.data.id, to: dropNode.data.id, dropType: dropType}).then(() => {
    ElMessage({
      showClose: true,
      message: '排序成功�?,
      type: 'success'
    })

    loadData()
  })
}

const treeRef = ref<InstanceType<typeof ElTree>>()

interface Tree {
  id: number
  metaTitle: string
  children?: Tree[]
}

// 树过滤规�?const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.metaTitle.includes(value)
}

// 执行搜索
const search = () => {
  treeRef.value!.filter(filterText.value)
}

const reset = () => {
  filterText.value = ''
  treeRef.value!.filter(filterText.value)
}

// 加载第一页数�?onMounted(() => {
  // 首次加载数据
  loadData()
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
</style>
