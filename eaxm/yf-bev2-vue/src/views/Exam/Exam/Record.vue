<template>
  <ContentWrap>
    <DataTable ref="table" :options="options" :query="query">
      <template #search>
        <el-input
            v-model="query.params.userName"
            class="filter-item"
            clearable
            placeholder="学员姓名/账号"
        />
        <DictListSelect
            v-model="query.params.passed"
            class="filter-item"
            dicCode="yes_no"
            title="是否通过"
        />

        <div class="filter-item" style="width: 220px; align-items: center; display: flex">
          分数段：
          <el-input-number
              v-model="query.params.scoreMin"
              :controls="false"
              clearable
              style="width: 60px"
          />
          <span>&nbsp;�?nbsp;</span>
          <el-input-number
              v-model="query.params.scoreMax"
              :controls="false"
              clearable
              style="width: 60px"
          />
        </div>
      </template>

      <template #columns>
        <el-table-column type="selection" width="50px"/>
        <el-table-column label="考生姓名" prop="userId_dictText"/>
        <el-table-column align="center" label="考试次数" prop="tryCount"/>
        <el-table-column align="center" label="最高分�? prop="maxScore"/>
        <el-table-column align="center" label="最近分�? prop="lastScore"/>
        <el-table-column align="center" label="是否通过">
          <template #default="{ row }">
            <span v-if="row.passed" style="color: #67c23a">通过</span>
            <span v-else style="color: #f56c6c">未通过</span>
          </template>
        </el-table-column>
        <el-table-column :align="'center'" label="操作" width="180px">
          <template #default="{ row }">
            <el-button icon="DocumentCopy" type="primary" @click="toRecord(row.userId)"
            >考试明细
            </el-button>
          </template>
        </el-table-column>
      </template>
    </DataTable>

    <PaperListDialog v-model:visible="dialogVisible" :exam-id="examId" :user-id="userId"/>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {ContentWrap} from '@/components/ContentWrap'
import {DataTable} from '@/components/DataTable'
import {onActivated, ref} from 'vue'
import type {OptionsType, TableQueryType} from '@/components/DataTable/src/types'
import {useRoute} from 'vue-router'
import {DictListSelect} from '@/components/DictListSelect'
import PaperListDialog from '@/views/Exam/Exam/components/PaperListDialog.vue'

// 获取参数
const route = useRoute()

const examId = route.query.id || ''

// 表格查询参数
let query = ref<TableQueryType>({
  current: 1,
  size: 10,
  params: {
    examId: examId,
    title: '',
    scoreMin: null,
    scoreMax: null
  }
})

// 表格默认参数
let options = ref<OptionsType>({
  listUrl: '/api/exam/exam/record/paging'
})

const table = ref()

const userId = ref<string>()
const dialogVisible = ref(false)

const toRecord = (id: string) => {
  userId.value = id
  dialogVisible.value = true
}

onActivated(() => {
  // 刷新表格
  table.value.reload()
})
</script>
