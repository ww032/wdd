<template>
  <ContentWrap v-loading="loading" element-loading-text="加载�?..">
    <DataTree
        ref="dataTree"
        :columns="columns"
        :filter-key="'deptName'"
        :allow-drop="allowDrop"
        :add="true"
        :edit="true"
        :delete="true"
        :sort="true"
        :tree-url="'/api/sys/depart/tree'"
        :delete-url="'/api/sys/depart/delete'"
        :sort-url="'/api/sys/depart/sort'"
        @on-add="handleAdd"
        @on-edit="handleEdit"
    />

    <el-dialog v-model="dialogVisible" title="管理部门" width="35%" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" autocomplete="off"/>
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
import {ref, reactive} from 'vue'
import {TreeColumnType} from '@/components/DataTree/src/types'
import {saveApi} from '@/api/sys/depart'
import DataTree from '@/components/DataTree/src/DataTree.vue'
import type {FormInstance, FormRules} from 'element-plus'
import type {AllowDropType} from 'element-plus/es/components/tree/src/tree.type'

const dataTree = ref()
const loading = ref(false)

let columns = ref<TreeColumnType[]>([
  {
    title: '部门名称',
    prop: 'deptName',
    center: false,
    width: 50
  },
  {
    title: '部门编号',
    prop: 'deptCode',
    center: false,
    width: 40
  }
])

const dialogVisible = ref(false)
const form = ref({
  parentId: '0',
  deptName: ''
})
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  deptName: [
    {
      required: true,
      message: '部门名称不能为空�?,
      trigger: 'blur'
    }
  ]
})

// 添加部门
const handleAdd = (row: any) => {
  if (row && row.id) {
    form.value.parentId = row.id
  } else {
    form.value.parentId = '0'
  }
  dialogVisible.value = true
}

// 修改部门
const handleEdit = (row: any) => {
  form.value = row
  dialogVisible.value = true
}

// 保存或修�?const handleSave = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate((valid) => {
    if (!valid) {
      return
    }

    saveApi(form.value).then(() => {
      dialogVisible.value = false
      dataTree.value.reload()
    })
  })
}

// 关闭
const handleClose = () => {
  dialogVisible.value = false
}

// 拖拽规则
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  // 不允许跨部门拖动
  if (draggingNode.data.parentId !== dropNode.data.parentId) {
    return false
  }

  // 不允许跨�?  return type !== 'inner'
}
</script>
