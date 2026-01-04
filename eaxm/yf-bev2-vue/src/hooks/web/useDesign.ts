import variables from '@/styles/variables.module.less'

export const useDesign = () => {
    const lessVariables = variables

    /**
     * @param scope 类名
     * @returns 返回空间�?类名
     */
    const getPrefixCls = (scope: string) => {
        return `${lessVariables.namespace}-${scope}`
    }

    return {
        variables: lessVariables,
        getPrefixCls
    }
}
