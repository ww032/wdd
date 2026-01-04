<template>
  <ContentWrap>
    <el-tabs v-model="activeName">
      <el-tab-pane label="个性配�? name="a1">
        <BaseConfig/>
      </el-tab-pane>
      <el-tab-pane label="功能配置" name="a2">
        <SwitchConfig/>
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {ContentWrap} from '@/components/ContentWrap'
import {ref} from 'vue'
import BaseConfig from '@/views/System/Config/components/BaseConfig.vue'
import SwitchConfig from '@/views/System/Config/components/SwitchConfig.vue'

const activeName = ref('a1')
</script>
