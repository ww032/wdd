<template>
  <ContentWrap>
    <h3>考试信息</h3>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="考试名称" prop="title">
            <el-input v-model="form.title" autocomplete="off"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="考试时间" prop="endTime">
            <el-date-picker
                v-model="dateRange"
                range-separator="�?
                type="datetimerange"
                value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总分�? prop="totalScore">
            <el-input-number v-model="form.totalScore" disabled/>
            �?          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="及格�? prop="qualifyScore">
            <el-input-number v-model="form.qualifyScore"/>
            �?          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="考试时长" prop="totalTime">
            <el-input-number v-model="form.totalTime" :min="1"/>
            分钟
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="考试机会">
            <el-input-number v-model="form.chance" :min="0"/>
            �?          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="允许迟到时长">
            <el-input-number v-model="form.lateMax" :min="0"/>
            分钟
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="最低交卷时�?>
            <el-input-number v-model="form.handMin" :min="0"/>
            分钟
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="考试说明" prop="content">
            <Editor ref="editorRef" v-model="form.content" height="100px" style="width: 100%"/>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <h3>组卷信息</h3>

          <el-form-item label="抽题题库" prop="repoId">
            <repo-select v-model="form.repoId"/>
          </el-form-item>

          <div style="font-size: 12px; color: #2d8cf0; padding-bottom: 10px"
          >* 不需要抽取的题型抽题数量设置�?即可
          </div>

          <el-table :data="form.ruleList" border style="width: 100%">
            <el-table-column label="题型" prop="quType_dictText"/>
            <el-table-column label="总题�? prop="totalCount"/>
            <el-table-column label="抽取题数">
              <template #default="{ row }">
                <el-input-number
                    v-model="row.quCount"
                    :disabled="row.totalCount === 0"
                    :max="row.totalCount"
                />
              </template>
            </el-table-column>
            <el-table-column label="每题分数">
              <template #default="{ row }">
                <el-input-number
                    v-model="row.quScore"
                    :disabled="row.totalCount === 0 || row.quCount === 0"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>

    <div style="padding-top: 20px">
      <el-button :loading="loading" type="primary" @click="handleSave(formRef)">保存</el-button>
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus'
import Editor from '@/components/Editor/src/Editor.vue'
import {ContentWrap} from '@/components/ContentWrap'
import {ExamType} from '@/views/Exam/Exam/types'
import RepoSelect from '@/views/Exam/Repo/components/RepoSelect.vue'
import {statApi} from '@/api/modules/exam/repo'
import {detailApi, saveApi} from '@/api/modules/exam/exam'
import {useRoute, useRouter} from 'vue-router'

const {replace} = useRouter()

const loading = ref(false)

// 获取参数
const route = useRoute()

const examId = route.query.id || ''

const form = ref<ExamType>({
  repoId: '',
  chance: 0,
  handMin: 0,
  lateMax: 0,
  totalTime: 5,
  startTime: '',
  endTime: ''
})
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: '考试名称必须填写�?,
      trigger: 'blur'
    }
  ],
  endTime: [
    {
      required: true,
      message: '考试时间不能为空�?,
      trigger: 'blur'
    }
  ],
  repoId: [
    {
      required: true,
      message: '题库必须选择�?,
      trigger: 'blur'
    }
  ],
  totalTime: [
    {
      type: 'number',
      required: true,
      asyncValidator: (_rule, value) => {
        return new Promise((resolve, reject) => {
          if (value < 1) {
            reject('考试时长必须大于1分钟�?)
          } else {
            resolve()
          }
        })
      }
    }
  ],
  qualifyScore: [
    {
      required: true,
      message: '及格分不能为空！',
      trigger: 'blur'
    }
  ],
  totalScore: [
    {
      type: 'number',
      required: true,
      asyncValidator: (_rule, value) => {
        return new Promise((resolve, reject) => {
          if (value < 1) {
            reject('总分数不能等�?，请调整组卷策略�?)
          } else {
            resolve()
          }
        })
      }
    }
  ]
})

// 监听数据变化
watch(
    () => form.value.repoId,
    (val, oldValue) => {
      statApi({id: val}).then((res) => {
        // 合并规则
        mergeRule(res.data, !oldValue)
      })
    }
)

watch(
    () => form.value.ruleList,
    (val) => {
      let total = 0
      if (val && val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          const rule = val[i]
          total += (rule.quCount ?? 0) * (rule.quScore ?? 0)
        }
      }

      form.value.totalScore = total
    },
    {deep: true}
)

// 保存题目
const handleSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      saveApi(form.value)
          .then(() => {
            ElMessage({
              message: '考试保存成功�?,
              type: 'success'
            })
            loading.value = false

            replace({name: 'Exam'})
          })
          .catch(() => {
            loading.value = false
          })
    }
  })
}

// 加载详情
const loadData = (examId: string) => {
  detailApi({id: examId}).then(({data}) => {
    form.value = data
  })
}

// 加载详情
const mergeRule = (statList, null2: boolean) => {
  const mixList = []

  for (let i = 0; i < statList.length; i++) {
    const item = statList[i]

    let mix = {
      totalCount: item.quCount,
      quScore: 0,
      quCount: 0,
      quType: item.quType,
      quType_dictText: item.quType_dictText
    }

    if (form.value.id && null2) {
      const ruleList = form.value.ruleList
      if (ruleList && ruleList.length > 0) {
        for (let j = 0; j < ruleList.length; j++) {
          const rule = ruleList[j]
          if (item.quType === rule.quType) {
            mix.quCount = rule.quCount
            mix.quScore = rule.quScore
          }
        }
      }
    }

    mixList.push(mix)
  }

  form.value.ruleList = mixList
}

const dateRange = computed({
  get: () => [form.value.startTime, form.value.endTime],
  set: (val) => {
    form.value.startTime = val?.[0] || ''
    form.value.endTime = val?.[1] || ''
  }
})

// 加载第一页数�?onMounted(() => {
  // 查询详情
  if (examId) {
    loadData(examId)
  }
})
</script>

<style scoped>
.el-input-number {
  margin-right: 5px;
}
</style>
