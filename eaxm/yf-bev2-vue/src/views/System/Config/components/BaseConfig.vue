<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="系统名称" prop="siteName">
      <el-input v-model="form.siteName" autocomplete="off"/>
    </el-form-item>

    <el-form-item label="登录页图�? prop="loginLogo">
      <file-uploader v-model="form.loginLogo"/>
    </el-form-item>

    <el-form-item label="登录页背�? prop="loginBg">
      <file-uploader v-model="form.loginBg"/>
    </el-form-item>

    <el-form-item label="后台图标" prop="backLogo">
      <file-uploader v-model="form.backLogo"/>
    </el-form-item>

    <el-form-item label="底部信息" prop="copyRight">
      <Editor ref="editorRef" v-model="form.copyRight" height="200px"/>
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
import {detailApi, saveApi} from '@/api/sys/config'
import FileUploader from '@/plugins/uploader/src/FileUploader.vue'
import Editor from '@/components/Editor/src/Editor.vue'
import {useAppStoreWithOut} from '@/store/modules/app'

const appStore = useAppStoreWithOut()

const form = ref({loginLogo: '', siteName: '', loginBg: '', backLogo: '', copyRight: ''})
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

const fetchConfig = () => {
  detailApi({}).then((res) => {
    // 数据
    console.log('data', res.data)
    form.value = res.data
  })
}

const refreshSite = async () => {
  // 获取网站基本信息
  await detailApi({}).then((res) => {
    appStore.setSiteInfo(res.data)
  })
}

const onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      const formData = unref(form)
      saveApi(formData).then(() => {
        ElMessage({
          showClose: true,
          message: '操作成功�?,
          type: 'success'
        })
        refreshSite()
      })
    }
  })
}

// 加载第一页数�?onMounted(() => {
  // 首次加载数据
  fetchConfig()
})
</script>
