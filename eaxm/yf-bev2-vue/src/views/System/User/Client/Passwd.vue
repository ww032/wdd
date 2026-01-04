<template>
  <ContentWrap>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="旧的密码" prop="oldPass">
            <el-input v-model="form.oldPass" autocomplete="off" type="password"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="新的密码" prop="newPass">
            <el-input v-model="form.newPass" autocomplete="off" type="password"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="确认密码" prop="confirmPass">
            <el-input v-model="form.confirmPass" autocomplete="off" type="password"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div>
      <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {ContentWrap} from '@/components/ContentWrap'
import {reactive, ref, unref} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus'
import {PassDataType} from '../types'
import {useUserStore} from '@/store/modules/user'
import {useTagsViewStore} from '@/store/modules/tagsView'
import {useRouter} from 'vue-router'
import {passApi} from '@/api/sys/user'

const userStore = useUserStore()
const tagsViewStore = useTagsViewStore()
const {replace} = useRouter()

// 密码校验
const checkPass = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入确认密码！'))
  } else if (value !== form.value.newPass) {
    callback(new Error('两次密码输入不一致！'))
  } else {
    callback()
  }
}

const form = ref<PassDataType>({})
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  oldPass: [
    {
      required: true,
      message: '旧密码必须输�?,
      trigger: 'blur'
    }
  ],
  newPass: [
    {
      required: true,
      message: '新的密码必须输入',
      trigger: 'blur'
    }
  ],
  confirmPass: [{validator: checkPass, required: true, trigger: 'blur'}]
})

const handleSave = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      const formData = unref(form)
      passApi(formData).then((res) => {
        if (res.success) {
          ElMessage({
            showClose: true,
            message: '修改成功，即将重新登录！',
            type: 'success'
          })
          // 重新登录
          setTimeout(reLogin, 2000)
        }
      })
    }
  })
}

const reLogin = async () => {
  userStore
      .logout()
      .then(() => {
        // 清理标签�?        tagsViewStore.delAllViews()
        replace({name: 'Login'})
      })
      .catch(() => {
      })
}
</script>
