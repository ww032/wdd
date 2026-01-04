<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-position="left" label-width="120px">
    <el-form-item label="新用户注�?>
      <el-switch
          v-model="form.userReg"
          active-color="#13ce66"
          active-text="开�?
          inactive-text="关闭"
      />
    </el-form-item>

    <el-form-item label="允许多处登录">
      <el-radio v-model="form.loginTick" :label="0">允许多处登录</el-radio>
      <el-radio v-model="form.loginTick" :label="1">将前面的账号踢下�?/el-radio>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit(formRef)">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, unref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {apiDetail, apiSave} from '@/api/sys/config/switch'
import {detailApi as fetchSteInfo} from '@/api/sys/config'

import {useAppStoreWithOut} from '@/store/modules/app'

const appStore = useAppStoreWithOut()

const form = ref({userReg: false, loginTick: 0})
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  siteName: [
    {
      required: true,
      message: '系统名称不能为空�?,
      trigger: 'blur'
    }
  ]
})

const fetchDetail = () => {
  apiDetail().then((res) => {
    form.value = res.data
  })
}

const refreshSite = async () => {
  // 获取网站基本信息
  await fetchSteInfo({}).then((res) => {
    appStore.setSiteInfo(res.data)
  })
}

const onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      const formData = unref(form)
      apiSave(formData).then(() => {
        ElMessage({
          showClose: true,
          message: '保存成功�?,
          type: 'success'
        })

        // 刷新网站数据
        refreshSite()
      })
    }
  })
}

// 加载数据
onMounted(() => {
  fetchDetail()
})
</script>
