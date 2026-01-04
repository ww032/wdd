<template>
  <ContentWrap>
    <el-alert v-if="!checkData.validated" :title="checkData.message" type="error" effect="dark"/>

    <div>
      <h3> 考试信息 </h3>
      <el-descriptions :column="1" size="large" border>
        <el-descriptions-item label="考试名称">
          {{ detail.title }}
        </el-descriptions-item>
        <el-descriptions-item label="考试时间"
        >{{ detail.startTime }} �?{{ detail.endTime }}
        </el-descriptions-item
        >
        <el-descriptions-item label="考试机会">
          <span v-if="detail.chance === 0">无限</span>
          <span v-else>{{ detail.chance }}</span
          >�?        </el-descriptions-item>
        <el-descriptions-item label="考试时长">{{ detail.totalTime }} 分钟</el-descriptions-item>
        <el-descriptions-item label="试卷总分">{{ detail.totalScore }} �?/el-descriptions-item>
        <el-descriptions-item label="及格分数">
          <span v-if="detail.qualifyScore === 0">无要�?/span>
          <span v-else>{{ detail.qualifyScore }} �?/span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-if="detail.content">
      <h3>注意事项</h3>
      <div class="alert-box" v-html="detail.content"></div>
    </div>
    <div style="margin-top: 20px">
      <el-button
          size="large"
          type="primary"
          @click="startExam"
          :loading="loading"
          :disabled="startDisabled"
      >开始考试
      </el-button
      >
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {ContentWrap} from '@/components/ContentWrap'
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {detailForExamApi} from '@/api/modules/exam/exam'
import {createApi, preCheckApi} from '@/api/modules/exam/paper'
import {ElMessageBox} from 'element-plus'

const {push} = useRouter()

const route = useRoute()
const examId = route.query.id
const loading = ref(false)
const startDisabled = ref(true)

const detail = ref({})
const checkData = ref({validated: true})

// 创建考试并进�?const startExam = () => {
  loading.value = true
  createApi({id: examId}).then((res) => {
    const paperId = res.data.id
    // 进入考试
    push({name: 'ExamClientEnter', query: {id: paperId}})
    loading.value = false
  })
}

// 创建考试并进�?const checkExam = () => {
  loading.value = true
  preCheckApi({id: examId}).then((res) => {
    const data = res.data

    checkData.value = data
    loading.value = false

    // 是否继续
    if (data && data.paperId) {
      continueDialog(data.paperId)
    }

    startDisabled.value = !data.validated
  })
}

const continueDialog = (paperId: string) => {
  ElMessageBox.confirm('您有正在进行中的考试，是否立即进入？', '提示信息', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(() => {
        push({name: 'ExamClientEnter', query: {id: paperId}})
      })
      .catch(() => {
        push({name: 'ClientExamList'})
      })
}

// 查找详情
onMounted(() => {
  detailForExamApi({id: examId}).then((res) => {
    detail.value = res.data

    // 进行校验
    checkExam()
  })
})
</script>

<style lang="less" scoped>
.alert-box {
  background-color: #fdf6ec;
  color: #e6a23c;
  border-radius: 5px;
  padding: 10px;
}
</style>
