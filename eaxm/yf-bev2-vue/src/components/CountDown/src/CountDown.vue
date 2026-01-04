<template>
  <span :class="{ warning: showWarning }" class="countdown">
    <span v-if="showHours">{{ hours }}小时</span>
    <span v-if="showMinutes">{{ minutes }}分钟</span>
    <span>{{ seconds }}�?/span>
  </span>
</template>

<script lang="ts" setup>
import {computed, defineExpose, onUnmounted, ref, watch} from 'vue'

// 表格参数
const props = defineProps({
  leftSeconds: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0
  }
})

// 事件定义
const emit = defineEmits(['overdue', 'warn'])

const remaining = ref(props.leftSeconds)
const hasWarned = ref(false)
let timer: NodeJS.Timeout | null = null

// 计算显示�?const hours = computed(() => Math.floor(remaining.value / 3600))
const minutes = computed(() => Math.floor((remaining.value % 3600) / 60))
const seconds = computed(() => remaining.value % 60)

// 显示控制
const showHours = computed(() => hours.value > 0)
const showMinutes = computed(() => minutes.value > 0 || showHours.value)
const showWarning = computed(() => remaining.value < 300 && remaining.value > 0)

// 警告检�?const checkWarning = () => {
  if (remaining.value < 300 && remaining.value > 0 && !hasWarned.value) {
    emit('warn')
    hasWarned.value = true
  }
}

// 启动倒计�?const startTimer = () => {
  if (timer) clearInterval(timer)

  // 初始检�?  checkWarning()

  timer = setInterval(() => {
    if (remaining.value > 0) {
      remaining.value--
      checkWarning()
    } else {
      clearTimer()
      emit('overdue')
    }
  }, 1000)
}

// 清除定时�?const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 设置剩余时间
const setLeftSeconds = (seconds: number) => {
  remaining.value = seconds
  hasWarned.value = seconds < 300 // 自动设置警告状�?
  if (seconds < 300 && seconds > 0) {
    if (!hasWarned.value) {
      emit('warn')
      hasWarned.value = true
    }
  } else if (seconds >= 300) {
    hasWarned.value = false
  }

  startTimer()
}

// 监听props变化
watch(
    () => props.leftSeconds,
    (newVal) => {
      setLeftSeconds(newVal)
    }
)

// 初始�?startTimer()
onUnmounted(clearTimer)

// 暴露方法
defineExpose({setLeftSeconds})
</script>

<style scoped>
.countdown {
  transition: color 0.3s;
}

.countdown.warning {
  color: #ff4d4f;
  font-size: 24px;
  font-weight: bold;
  animation: blink 1s infinite;
}

.countdown span {
  margin: 0 2px;
}

@keyframes blink {
  50% {
    opacity: 0.6;
  }
}
</style>
