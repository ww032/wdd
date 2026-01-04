<template>
  <ContentWrap>
    <DataTable
        ref="table"
        :options="options"
        :query="query"
        @on-add="handleAdd"
        @on-edit="handleEdit"
    >
      <template #search>
        <el-input v-model="query.params.title" class="filter-item" placeholder="搜索考试"/>
        <el-date-picker
            v-model="dateRange"
            class="filter-item"
            end-placeholder="截止"
            range-separator="�?
            start-placeholder="考试时间"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
        />
      </template>

      <template #columns>
        <el-table-column type="selection" width="50px"/>
        <el-table-column label="考试名称" prop="title"/>
        <el-table-column align="center" label="开始时�? prop="startTime"/>
        <el-table-column align="center" label="结束时间" prop="endTime"/>
        <el-table-column align="center" label="创建�? prop="createBy_dictText"/>
        <el-table-column align="center" label="创建时间" prop="createTime"/>
        <el-table-column :align="'center'" label="操作" width="180px">
          <template #default="{ row }">
            <el-button icon="Document" type="primary" @click="toRecord(row.id)">考试记录</el-button>
          </template>
        </el-table-column>
      </template>
    </DataTable>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {ContentWrap} from '@/components/ContentWrap'
import {DataTable} from '@/components/DataTable'
import {computed, onActivated, ref} from 'vue'
import type {OptionsType, TableQueryType} from '@/components/DataTable/src/types'
import {useRouter} from 'vue-router'

const {push} = useRouter()

// 表格查询参数
let query = ref<TableQueryType>({
  current: 1,
  size: 10,
  params: {
    title: '',
    startTime: null,
    endTime: null
  }
})

// 表格默认参数
let options = ref<OptionsType>({
  listUrl: '/api/exam/exam/exam/paging',
  delUrl: '/api/exam/exam/exam/delete',
  add: {
    enable: true,
    permission: ['exam:exam:add']
  },
  edit: {
    enable: true,
    permission: ['exam:exam:edit']
  },
  del: {
    enable: true,
    permission: ['exam:exam:delete']
  }
})

const table = ref()

const handleAdd = () => {
  push({name: 'ExamAdd'})
}
const handleEdit = (row: any) => {
  push({name: 'ExamEdit', query: {id: row.id}})
}

const toRecord = (id: string) => {
  push({name: 'ExamRecord', query: {id: id}})
}

const dateRange = computed({
  get: () => [query.value.params.startTimeL, query.value.params.startTimeR],
  set: (val) => {
    query.value.params.startTimeL = val?.[0] || ''
    query.value.params.startTimeR = val?.[1] || ''
  }
})

onActivated(() => {
  // 刷新表格
  table.value.reload()
})
</script>
