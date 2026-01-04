import {AxiosConfig} from './types'

const config: AxiosConfig = {
    /**
     * 接口成功返回状态码
     */
    code: 0,

    /**
     * 接口请求超时时间
     */
    timeout: 60000,

    /**
     * 默认接口请求类型
     * 可选值：application/x-www-form-urlencoded multipart/form-data
     */
    defaultHeaders: 'application/json',

    interceptors: {
        // //请求拦截
        // requestInterceptors: (config) => {
        //   return config
        // },
        // // 响应拦截�?        // responseInterceptors: (result: AxiosResponse) => {
        //   return result
        // }
    }
}
export default config
