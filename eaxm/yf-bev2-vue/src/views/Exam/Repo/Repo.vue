<template>
  <ContentWrap>
    <DataTable
        ref="table"
        :options="options"
        :query="query"
        @on-add="handleAdd(formRef)"
        @on-edit="handleEdit"
    >
      <template #search>
        <el-input v-model="query.params['title']" class="filter-item" placeholder="搜索题库"/>
      </template>

      <template #columns>
        <el-table-column type="selection" width="50px"/>
        <el-table-column label="题库名称" prop="title"/>
        <el-table-column label="题库分类" prop="catId_dictText"/>
        <el-table-column align="center" label="题目数量" prop="quCount"/>
        <el-table-column align="center" label="创建�? prop="createBy_dictText"/>
        <el-table-column align="center" label="创建时间" prop="createTime"/>
        <el-table-column :align="'center'" label="操作" width="180px">
          <template #default="{ row }">
            <el-button icon="Setting" type="primary" @click="toQuList(row.id)">试题管理</el-button>
          </template>
        </el-table-column>
      </template>
    </DataTable>

    <el-dialog v-model="dialogVisible" :before-close="handleClose" title="题库管理" width="30%">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" label-width="120px">
        <el-form-item label="题库名称" prop="title">
          <el-input v-model="form.title" autocomplete="off"/>
        </el-form-item>

        <el-form-item label="题库分类" prop="catId">
          <DictListSelect v-model="form.catId" dic-code="repo_catalog"/>
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
import {DataTable} from '@/components/DataTable'
import {reactive, ref, unref} from 'vue'
import type {OptionsType, TableQueryType} from '@/components/DataTable/src/types'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {detailApi, saveApi} from '@/api/modules/exam/repo'
import {RepoDataType} from './types'
import {DictListSelect} from '@/components/DictListSelect'
import {useRouter} from 'vue-router'

const {push} = useRouter()

// 表格查询参数
let query = ref<TableQueryType>({
  current: 1,
  size: 10,
  params: {
    title: ''
  }
})

// 表格默认参数
let options = ref<OptionsType>({
  listUrl: '/api/exam/repo/repo/paging',
  delUrl: '/api/exam/repo/repo/delete',
  add: {
    enable: true,
    permission: ['repo:repo:add']
  },
  edit: {
    enable: true,
    permission: ['repo:repo:edit']
  },
  del: {
    enable: true,
    permission: ['repo:repo:delete']
  }
})

const table = ref()
const dialogVisible = ref(false)
const form = ref<RepoDataType>({title: '', catId: ''})
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: '题库名称不能为空',
      trigger: 'blur'
    }
  ],
  catId: [
    {
      required: true,
      message: '题库分类不能为空',
      trigger: 'blur'
    }
  ]
})

const handleAdd = (formEl: FormInstance | undefined) => {
  dialogVisible.value = true
  form.value = {}
  formEl?.resetFields()
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleEdit = (row: any) => {
  detailApi({id: row.id}).then((res) => {
    // 数据
    form.value = res.data
  })

  dialogVisible.value = true
}

const handleSave = (formEl: FormInstance | undefined) => {
  console.log('++++++', formEl)

  if (!formEl) return

  formEl?.validate((isValid) => {
    if (isValid) {
      const formData = unref(form)
      saveApi(formData).then(() => {
        ElMessage({
          showClose: true,
          message: '操作成功�?,
          type: 'success'
        })
        // 刷新表格
        table.value.reload()
        dialogVisible.value = false
      })
    }
  })
}

const toQuList = (id: string) => {
  push({name: 'Qu', query: {repoId: id}})
}
</script>
