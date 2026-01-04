import axios from 'axios'
import config from './config'

import {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, RequestConfig} from './types'
import {ElMessage} from 'element-plus'
import {useTagsViewStore} from '@/store/modules/tagsView'
import router from '@/router'
import {useUserStoreWithOut} from '@/store/modules/user'

const userStore = useUserStoreWithOut()
const tagsViewStore = useTagsViewStore()

export const PATH_URL = import.meta.env.VITE_API_HOST || ''
const codeSuccess = 0
const codeOverdue = 10010002
const abortControllerMap: Map<string, AbortController> = new Map()
const axiosInstance: AxiosInstance = axios.create({
    ...config,
    baseURL: PATH_URL
})

axiosInstance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
    const controller = new AbortController()
    const url = res.url || ''
    const userInfo = userStore.getUserInfo
    // 传入token
    if (userInfo && userInfo.token && res && res.headers) {
        res.headers['token'] = userInfo.token
    }
    res.signal = controller.signal
    abortControllerMap.set(url, controller)
    return res
})

axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => {
        console.log('响应结果', res)

        const resCode = res.data.code

        // 正确响应
        if (resCode === codeSuccess) {
            const url = res.config.url || ''
            abortControllerMap.delete(url)
            return res.data
        }

        // 会话超时
        if (resCode === codeOverdue) {
            userStore.logout().then(() => {
                // 清理标签�?                tagsViewStore.delAllViews()
                // 去登录页
                router.replace({name: 'Login'})
            })
        }

        // 响应错误
        const resMsg = res.data.msg || '请求出现错误�?
        ElMessage.error(resMsg)
        return Promise.reject(new Error(resMsg))
    },
    (err: any) => {
        ElMessage.error('糟糕，服务器开小差了！' + err)
    }
)

const service = {
    request: (config: RequestConfig) => {
        return new Promise((resolve, reject) => {
            if (config.interceptors?.requestInterceptors) {
                config = config.interceptors.requestInterceptors(config as any)
            }

            axiosInstance
                .request(config)
                .then((res) => {
                    resolve(res)
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    },
    cancelRequest: (url: string | string[]) => {
        const urlList = Array.isArray(url) ? url : [url]
        for (const _url of urlList) {
            abortControllerMap.get(_url)?.abort()
            abortControllerMap.delete(_url)
        }
    },
    cancelAllRequest() {
        for (const [_, controller] of abortControllerMap) {
            controller.abort()
        }
        abortControllerMap.clear()
    }
}

export default service
