import type {App, Directive, DirectiveBinding} from 'vue'
import {useStorage} from '@/hooks/web/useStorage'

const {getStorage} = useStorage()

const hasPermission = (arr: string[]): boolean => {
    // 获取后端权限
    const userInfo = getStorage('userInfo') || {permissions: []}
    const permissions = userInfo.permissions || []
    // 未提供权限或权限为空则通行
    if (!arr || arr.length === 0) {
        return true
    }

    // 一项符合就通过
    for (let i = 0; i < arr.length; i++) {
        const p = arr[i]

        // 给空默认有权�?        if (p === '') {
            return true
        }
        if (permissions.includes(p)) {
            return true
        }
    }

    // 默认不通过
    return false
}

function hasPermi(el: Element, binding: DirectiveBinding) {
    const value = binding.value

    const flag = hasPermission(value)
    if (!flag) {
        el.parentNode?.removeChild(el)
    }
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
    hasPermi(el, binding)
}

const permiDirective: Directive = {
    mounted
}

export const setupPermissionDirective = (app: App<Element>) => {
    app.directive('hasPermi', permiDirective)
}

export default permiDirective
