<template>
  <el-tree-select
      v-model="value"
      :check-strictly="true"
      :data="treeData"
      :props="{ label: 'deptName' }"
      :render-after-expand="false"
      clearable
      placeholder="请选择部门"
      style="width: 250px"
      @change="handlerChange"
  />
</template>

<script lang="ts" setup>
import {onMounted, ref, unref, watch} from 'vue'
import {treeApi} from '@/api/sys/depart'

const value = ref()
const treeData = ref([])

// 组件参数
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// 监听数据变化
watch(
    () => props.modelValue,
    (val) => {
      value.value = val
    }
)

// 加载数据
const loadData = async () => {
  // 加载下拉列表
  await treeApi().then((res) => {
    treeData.value = res.data
  })
}

// 加载数据
const handlerChange = async () => {
  emit('update:modelValue', unref(value))
}

// 加载第一页数�?onMounted(() => {
  // 首次加载数据
  loadData()
})
</script>
