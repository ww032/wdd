import router from './router'
import {useAppStoreWithOut} from '@/store/modules/app'
import {useStorage} from '@/hooks/web/useStorage'
import type {RouteRecordRaw} from 'vue-router'
import {useTitle} from '@/hooks/web/useTitle'
import {useNProgress} from '@/hooks/web/useNProgress'
import {usePermissionStoreWithOut} from '@/store/modules/permission'
import {usePageLoading} from '@/hooks/web/usePageLoading'
import {detailApi as fetchSteInfo} from '@/api/sys/config'
import {useUserStore} from '@/store/modules/user'

const permissionStore = usePermissionStoreWithOut()

const appStore = useAppStoreWithOut()
const userStore = useUserStore()

const {getStorage} = useStorage()

const {start, done} = useNProgress()

const {loadStart, loadDone} = usePageLoading()

const whiteList = ['/login'] // 不重定向白名�?
router.beforeEach(async (to, from, next) => {
    start()
    loadStart()

    console.log('++++to', to)

    // 获取网站基本信息
    if (!appStore.getSiteInfo || !appStore.getSiteInfo.id) {
        await fetchSteInfo({}).then((res) => {
            appStore.setSiteInfo(res.data)
        })
    }

    if (userStore.getUserInfo && userStore.getUserInfo.token) {
        if (permissionStore.getIsAddRouters) {
            // 跳转到用户的首页，首个有权限的菜�?            if (to.path === '/' || to.path === '' || to.path === '/login') {
                const firstPath = await getFirstMenu()
                if (firstPath) {
                    next({path: firstPath, replace: true})
                    return
                }
            }

            next()
            return
        }

        // 构建路由
        const roleRouters = getStorage('roleRouters') || []
        await permissionStore.generateRoutes(roleRouters as AppCustomRouteRecordRaw[])
        permissionStore.getAddRouters.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由�?        })

        const redirectPath = from.query.redirect || to.path
        const redirect = decodeURIComponent(redirectPath as string)
        const nextData = to.path === redirect ? {...to, replace: true} : {path: redirect}

        permissionStore.setIsAddRouters(true)
        next(nextData)
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`) // 否则全部重定向到登录�?        }
    }
})

// 获取用户权限内的第一个菜�?const getFirstMenu = async () => {
    // 获取本地缓存
    const roleRouters = getStorage('roleRouters') || []
    if (roleRouters.length === 0) {
        return null
    }

    for (const roleRouter of roleRouters) {
        console.log('roleRouter', roleRouter)
        if (roleRouter.menuType === 1) {
            const children = roleRouter.children
            for (const item of children) {
                if (item.menuType === 2 && item.path) {
                    return item.path
                }
            }
        }
    }
}

router.afterEach((to) => {
    useTitle(to?.meta?.title as string)
    done() // 结束Progress
    loadDone()
})
