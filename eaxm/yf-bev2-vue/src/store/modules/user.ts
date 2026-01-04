import {defineStore} from 'pinia'
import {store} from '@/store'
import {apiLogin, apiRegister, logoutApi, routesApi} from '@/api/login'
import {UserLoginType} from '@/api/login/types'
import {useStorage} from '@/hooks/web/useStorage'
import {resetRouter} from '@/router'
import {usePermissionStoreWithOut} from '@/store/modules/permission'

const permissionStore = usePermissionStoreWithOut()

const {getStorage, setStorage, removeStorage, clear} = useStorage()

export interface UserState {
    userInfo: UserInfoTypes
}

export const useUserStore = defineStore('userInfo', {
    state: (): UserState => ({
        userInfo: getStorage('userInfo')
    }),
    getters: {
        getUserInfo(): UserInfoTypes {
            return this.userInfo
        }
    },
    actions: {
        // 用户登录
        login(data?: UserLoginType): Promise<unknown> {
            return new Promise<void>((resolve, reject) => {
                // 注册用户
                apiLogin(data)
                    .then(async (res) => {
                        this.setUserInfo(res.data)
                        await this.generateRoutes()
                        resolve(res.data)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },

        // 用户注册
        register(data?: UserLoginType): Promise<unknown> {
            return new Promise<void>((resolve, reject) => {
                // 注册用户
                apiRegister(data)
                    .then(async (res) => {
                        this.setUserInfo(res.data)
                        await this.generateRoutes()
                        resolve(res.data)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },
        // 用户登录
        logout(): Promise<unknown> {
            return new Promise<void>((resolve, reject) => {
                // 注册用户
                logoutApi()
                    .then(async () => {
                        // 清理站点存储
                        clear()
                        // 重置静态路由表
                        resetRouter()
                        permissionStore.setIsAddRouters(false)
                        // 清理数据
                        this.setUserInfo({})
                        resolve()
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },

        // 保存用户状�?        setUserInfo(data?: UserInfoTypes) {
            if (data && data.token) {
                this.userInfo = data
                setStorage('userInfo', this.userInfo)
            } else {
                this.userInfo = {}
                removeStorage('userInfo')
            }
        },

        // 构建路由并跳转首�?        async generateRoutes() {
            const res = await routesApi({})
            if (res) {
                // 将路由存入缓存，交由权限构建
                const routers = res.data || []
                setStorage('roleRouters', routers)
            }
        }
    }
})

export const useUserStoreWithOut = () => {
    return useUserStore(store)
}
