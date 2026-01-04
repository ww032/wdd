import {defineStore} from 'pinia'
import {constantRouterMap} from '@/router'
import {flatMultiLevelRoutes, generateRoutesByServer} from '@/utils/routerHelper'
import {store} from '@/store'
import {cloneDeep} from 'lodash-es'

export interface PermissionState {
    routers: AppRouteRecordRaw[]
    addRouters: AppRouteRecordRaw[]
    isAddRouters: boolean
    menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
    state: (): PermissionState => ({
        routers: [],
        addRouters: [],
        isAddRouters: false,
        menuTabRouters: []
    }),
    getters: {
        getRouters(): AppRouteRecordRaw[] {
            return this.routers
        },
        getAddRouters(): AppRouteRecordRaw[] {
            return flatMultiLevelRoutes(cloneDeep(this.addRouters))
        },
        getIsAddRouters(): boolean {
            return this.isAddRouters
        },
        getMenuTabRouters(): AppRouteRecordRaw[] {
            return this.menuTabRouters
        }
    },
    actions: {
        generateRoutes(routers?: AppCustomRouteRecordRaw[] | string[]): Promise<unknown> {
            return new Promise<void>((resolve) => {
                const routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[])

                // 动态路由，404一定要放到最后面
                this.addRouters = routerMap.concat([
                    {
                        path: '/:path(.*)*',
                        redirect: '/404',
                        name: '404Page',
                        meta: {
                            hidden: true,
                            breadcrumb: false
                        }
                    }
                ])
                // 渲染菜单的所有路�?                this.routers = cloneDeep(constantRouterMap).concat(routerMap)
                resolve()
            })
        },
        setIsAddRouters(state: boolean): void {
            this.isAddRouters = state
        },
        setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
            this.menuTabRouters = routers
        }
    }
})

export const usePermissionStoreWithOut = () => {
    return usePermissionStore(store)
}
