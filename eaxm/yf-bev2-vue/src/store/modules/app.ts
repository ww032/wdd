import {defineStore} from 'pinia'
import {store} from '../index'
import {setCssVar, humpToUnderline} from '@/utils'
import {ElMessage, ComponentSize} from 'element-plus'
import {useStorage} from '@/hooks/web/useStorage'

const {getStorage, setStorage} = useStorage()

interface AppState {
    breadcrumb: boolean
    breadcrumbIcon: boolean
    collapse: boolean
    uniqueOpened: boolean
    hamburger: boolean
    screenfull: boolean
    size: boolean
    locale: boolean
    tagsView: boolean
    tagsViewIcon: boolean
    logo: boolean
    fixedHeader: boolean
    greyMode: boolean
    dynamicRouter: boolean
    serverDynamicRouter: boolean
    pageLoading: boolean
    layout: LayoutType
    isDark: boolean
    currentSize: ComponentSize
    sizeMap: ComponentSize[]
    mobile: boolean
    footer: boolean
    theme: ThemeTypes
    fixedMenu: boolean
    siteInfo: SiteInfoTypes
}

export const useAppStore = defineStore('app', {
    state: (): AppState => {
        return {
            sizeMap: ['default', 'large', 'small'],
            mobile: false, // 是否是移动端
            pageLoading: false, // 路由跳转loading
            breadcrumb: true, // 面包�?            breadcrumbIcon: true, // 面包屑图�?            collapse: false, // 折叠菜单
            uniqueOpened: false, // 是否只保持一个子菜单的展开
            hamburger: true, // 折叠图标
            screenfull: true, // 全屏图标
            size: true, // 尺寸图标
            locale: true, // 多语言图标
            tagsView: true, // 标签�?            tagsViewIcon: true, // 是否显示标签图标
            logo: true, // logo
            fixedHeader: true, // 固定toolheader
            footer: true, // 显示页脚
            greyMode: false, // 是否开始灰色模式，用于特殊悼念�?            dynamicRouter: getStorage('dynamicRouter'), // 是否动态路�?            serverDynamicRouter: getStorage('serverDynamicRouter'), // 是否服务端渲染动态路�?            fixedMenu: getStorage('fixedMenu'), // 是否固定菜单

            layout: getStorage('layout') || 'classic', // layout布局
            isDark: getStorage('isDark'), // 是否是暗黑模�?            currentSize: getStorage('default') || 'default', // 组件尺寸
            theme: getStorage('theme') || {
                // 主题�?                elColorPrimary: '#409eff',
                // 左侧菜单边框颜色
                leftMenuBorderColor: 'inherit',
                // 左侧菜单背景颜色
                leftMenuBgColor: '#001529',
                // 左侧菜单浅色背景颜色
                leftMenuBgLightColor: '#0f2438',
                // 左侧菜单选中背景颜色
                leftMenuBgActiveColor: 'var(--el-color-primary)',
                // 左侧菜单收起选中背景颜色
                leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
                // 左侧菜单字体颜色
                leftMenuTextColor: '#bfcbd9',
                // 左侧菜单选中字体颜色
                leftMenuTextActiveColor: '#fff',
                // logo字体颜色
                logoTitleTextColor: '#fff',
                // logo边框颜色
                logoBorderColor: 'inherit',
                // 头部背景颜色
                topHeaderBgColor: '#fff',
                // 头部字体颜色
                topHeaderTextColor: 'inherit',
                // 头部悬停颜色
                topHeaderHoverColor: '#f6f6f6',
                // 头部边框颜色
                topToolBorderColor: '#eee'
            },
            siteInfo: getStorage('siteInfo')
        }
    },
    getters: {
        getBreadcrumb(): boolean {
            return this.breadcrumb
        },
        getBreadcrumbIcon(): boolean {
            return this.breadcrumbIcon
        },
        getCollapse(): boolean {
            return this.collapse
        },
        getUniqueOpened(): boolean {
            return this.uniqueOpened
        },
        getHamburger(): boolean {
            return this.hamburger
        },
        getScreenfull(): boolean {
            return this.screenfull
        },
        getSize(): boolean {
            return this.size
        },
        getLocale(): boolean {
            return this.locale
        },
        getTagsView(): boolean {
            return this.tagsView
        },
        getTagsViewIcon(): boolean {
            return this.tagsViewIcon
        },
        getLogo(): boolean {
            return this.logo
        },
        getSiteInfo(): SiteInfoTypes {
            return this.siteInfo
        },
        getFixedHeader(): boolean {
            return this.fixedHeader
        },
        getGreyMode(): boolean {
            return this.greyMode
        },
        getDynamicRouter(): boolean {
            return this.dynamicRouter
        },
        getServerDynamicRouter(): boolean {
            return this.serverDynamicRouter
        },
        getFixedMenu(): boolean {
            return this.fixedMenu
        },
        getPageLoading(): boolean {
            return this.pageLoading
        },
        getLayout(): LayoutType {
            return this.layout
        },
        getIsDark(): boolean {
            return this.isDark
        },
        getCurrentSize(): ComponentSize {
            return this.currentSize
        },
        getSizeMap(): ComponentSize[] {
            return this.sizeMap
        },
        getMobile(): boolean {
            return this.mobile
        },
        getTheme(): ThemeTypes {
            return this.theme
        },
        getFooter(): boolean {
            return this.footer
        }
    },
    actions: {
        setBreadcrumb(breadcrumb: boolean) {
            this.breadcrumb = breadcrumb
        },
        setBreadcrumbIcon(breadcrumbIcon: boolean) {
            this.breadcrumbIcon = breadcrumbIcon
        },
        setCollapse(collapse: boolean) {
            this.collapse = collapse
        },
        setUniqueOpened(uniqueOpened: boolean) {
            this.uniqueOpened = uniqueOpened
        },
        setHamburger(hamburger: boolean) {
            this.hamburger = hamburger
        },
        setScreenfull(screenfull: boolean) {
            this.screenfull = screenfull
        },
        setSize(size: boolean) {
            this.size = size
        },
        setLocale(locale: boolean) {
            this.locale = locale
        },
        setTagsView(tagsView: boolean) {
            this.tagsView = tagsView
        },
        setTagsViewIcon(tagsViewIcon: boolean) {
            this.tagsViewIcon = tagsViewIcon
        },
        setLogo(logo: boolean) {
            this.logo = logo
        },
        setFixedHeader(fixedHeader: boolean) {
            this.fixedHeader = fixedHeader
        },
        setGreyMode(greyMode: boolean) {
            this.greyMode = greyMode
        },
        setDynamicRouter(dynamicRouter: boolean) {
            setStorage('dynamicRouter', dynamicRouter)
            this.dynamicRouter = dynamicRouter
        },
        setServerDynamicRouter(serverDynamicRouter: boolean) {
            setStorage('serverDynamicRouter', serverDynamicRouter)
            this.serverDynamicRouter = serverDynamicRouter
        },
        setFixedMenu(fixedMenu: boolean) {
            setStorage('fixedMenu', fixedMenu)
            this.fixedMenu = fixedMenu
        },
        setPageLoading(pageLoading: boolean) {
            this.pageLoading = pageLoading
        },
        setLayout(layout: LayoutType) {
            if (this.mobile && layout !== 'classic') {
                ElMessage.warning('移动端模式下不支持切换其它布局')
                return
            }
            this.layout = layout
            setStorage('layout', this.layout)
        },
        // 设置网站信息
        setSiteInfo(data?: SiteInfoTypes) {
            if (data) {
                this.siteInfo = data
                setStorage('siteInfo', this.siteInfo)
            }
        },
        setIsDark(isDark: boolean) {
            this.isDark = isDark
            if (this.isDark) {
                document.documentElement.classList.add('dark')
                document.documentElement.classList.remove('light')
            } else {
                document.documentElement.classList.add('light')
                document.documentElement.classList.remove('dark')
            }
            setStorage('isDark', this.isDark)
        },
        setCurrentSize(currentSize: ComponentSize) {
            this.currentSize = currentSize
            setStorage('currentSize', this.currentSize)
        },
        setMobile(mobile: boolean) {
            this.mobile = mobile
        },
        setTheme(theme: ThemeTypes) {
            this.theme = Object.assign(this.theme, theme)
            setStorage('theme', this.theme)
        },
        setCssVarTheme() {
            for (const key in this.theme) {
                setCssVar(`--${humpToUnderline(key)}`, this.theme[key])
            }
        },
        setFooter(footer: boolean) {
            this.footer = footer
        }
    }
})

export const useAppStoreWithOut = () => {
    return useAppStore(store)
}
