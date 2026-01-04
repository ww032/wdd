export interface DescriptionsSchema {
    span?: number // 占多少分
    field: string // 字段�?    label?: string // label�?    width?: string | number
    minWidth?: string | number
    align?: 'left' | 'center' | 'right'
    labelAlign?: 'left' | 'center' | 'right'
    className?: string
    labelClassName?: string
    slots?: {
        default?: (...args: any[]) => JSX.Element | null
        label?: (...args: any[]) => JSX.Element | null
    }
}
