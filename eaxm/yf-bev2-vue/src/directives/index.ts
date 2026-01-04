import type {App} from 'vue'
import {setupPermissionDirective} from './permission/hasPermi'

/**
 * 导出指令：v-xxx
 * @methods hasPermi 按钮权限，用�? v-hasPermi
 */
export const setupPermission = (app: App<Element>) => {
    setupPermissionDirective(app)
}
