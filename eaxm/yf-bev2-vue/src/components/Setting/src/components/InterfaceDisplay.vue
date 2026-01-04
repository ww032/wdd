<script setup lang="ts">
import {ElSwitch, ElMessage} from 'element-plus'
import {useI18n} from '@/hooks/web/useI18n'
import {useAppStore} from '@/store/modules/app'
import {computed, ref, watch} from 'vue'
import {setCssVar} from '@/utils'
import {useDesign} from '@/hooks/web/useDesign'

const {getPrefixCls} = useDesign()

const prefixCls = getPrefixCls('interface-display')

const appStore = useAppStore()

const {t} = useI18n()

// 面包�?const breadcrumb = ref(appStore.getBreadcrumb)

const breadcrumbChange = (show: boolean) => {
  appStore.setBreadcrumb(show)
}

// 面包屑图�?const breadcrumbIcon = ref(appStore.getBreadcrumbIcon)

const breadcrumbIconChange = (show: boolean) => {
  appStore.setBreadcrumbIcon(show)
}

// 折叠图标
const hamburger = ref(appStore.getHamburger)

const hamburgerChange = (show: boolean) => {
  appStore.setHamburger(show)
}

// 全屏图标
const screenfull = ref(appStore.getScreenfull)

const screenfullChange = (show: boolean) => {
  appStore.setScreenfull(show)
}

// 尺寸图标
const size = ref(appStore.getSize)

const sizeChange = (show: boolean) => {
  appStore.setSize(show)
}

// 多语言图标
const locale = ref(appStore.getLocale)

const localeChange = (show: boolean) => {
  appStore.setLocale(show)
}

// 标签�?const tagsView = ref(appStore.getTagsView)

const tagsViewChange = (show: boolean) => {
  // 切换标签栏显示时，同步切换标签栏的高�?  setCssVar('--tags-view-height', show ? '35px' : '0px')
  appStore.setTagsView(show)
}

// 标签页图�?const tagsViewIcon = ref(appStore.getTagsViewIcon)

const tagsViewIconChange = (show: boolean) => {
  appStore.setTagsViewIcon(show)
}

// logo
const logo = ref(appStore.getLogo)

const logoChange = (show: boolean) => {
  appStore.setLogo(show)
}

// 菜单手风�?const uniqueOpened = ref(appStore.getUniqueOpened)

const uniqueOpenedChange = (uniqueOpened: boolean) => {
  appStore.setUniqueOpened(uniqueOpened)
}

// 固定头部
const fixedHeader = ref(appStore.getFixedHeader)

const fixedHeaderChange = (show: boolean) => {
  appStore.setFixedHeader(show)
}

// 页脚
const footer = ref(appStore.getFooter)

const footerChange = (show: boolean) => {
  appStore.setFooter(show)
}

// 灰色模式
const greyMode = ref(appStore.getGreyMode)

const greyModeChange = (show: boolean) => {
  appStore.setGreyMode(show)
}

// 动态路�?const dynamicRouter = ref(appStore.getDynamicRouter)

const dynamicRouterChange = (show: boolean) => {
  ElMessage.info(t('setting.reExperienced'))
  appStore.setDynamicRouter(show)
}

// 服务端动态路�?const serverDynamicRouter = ref(appStore.getServerDynamicRouter)

const serverDynamicRouterChange = (show: boolean) => {
  ElMessage.info(t('setting.reExperienced'))
  appStore.setServerDynamicRouter(show)
}

// 固定菜单
const fixedMenu = ref(appStore.getFixedMenu)

const fixedMenuChange = (show: boolean) => {
  appStore.setFixedMenu(show)
}

const layout = computed(() => appStore.getLayout)

watch(
    () => layout.value,
    (n) => {
      if (n === 'top') {
        appStore.setCollapse(false)
      }
    }
)
</script>

<template>
  <div :class="prefixCls">
    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.breadcrumb') }}</span>
      <ElSwitch v-model="breadcrumb" @change="breadcrumbChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.breadcrumbIcon') }}</span>
      <ElSwitch v-model="breadcrumbIcon" @change="breadcrumbIconChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.hamburgerIcon') }}</span>
      <ElSwitch v-model="hamburger" @change="hamburgerChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.screenfullIcon') }}</span>
      <ElSwitch v-model="screenfull" @change="screenfullChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.sizeIcon') }}</span>
      <ElSwitch v-model="size" @change="sizeChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.localeIcon') }}</span>
      <ElSwitch v-model="locale" @change="localeChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.tagsView') }}</span>
      <ElSwitch v-model="tagsView" @change="tagsViewChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.tagsViewIcon') }}</span>
      <ElSwitch v-model="tagsViewIcon" @change="tagsViewIconChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.logo') }}</span>
      <ElSwitch v-model="logo" @change="logoChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.uniqueOpened') }}</span>
      <ElSwitch v-model="uniqueOpened" @change="uniqueOpenedChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.fixedHeader') }}</span>
      <ElSwitch v-model="fixedHeader" @change="fixedHeaderChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.footer') }}</span>
      <ElSwitch v-model="footer" @change="footerChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.greyMode') }}</span>
      <ElSwitch v-model="greyMode" @change="greyModeChange"/>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.fixedMenu') }}</span>
      <ElSwitch v-model="fixedMenu" @change="fixedMenuChange"/>
    </div>
  </div>
</template>
