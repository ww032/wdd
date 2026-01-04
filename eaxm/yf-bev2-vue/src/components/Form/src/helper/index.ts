import {useI18n} from '@/hooks/web/useI18n'
import {PlaceholderModel, FormSchema, ComponentNameEnum, ColProps} from '../types'
import {isFunction} from '@/utils/is'
import {firstUpperCase, humpToDash} from '@/utils'
import {set, get} from 'lodash-es'

const {t} = useI18n()

/**
 *
 * @param schema 对应组件数据
 * @returns 返回提示信息对象
 * @description 用于自动设置placeholder
 */
export const setTextPlaceholder = (schema: FormSchema): PlaceholderModel => {
    const textMap = [
        ComponentNameEnum.INPUT,
        ComponentNameEnum.AUTOCOMPLETE,
        ComponentNameEnum.INPUT_NUMBER,
        ComponentNameEnum.INPUT_PASSWORD
    ]
    const selectMap = [
        ComponentNameEnum.SELECT,
        ComponentNameEnum.TIME_PICKER,
        ComponentNameEnum.DATE_PICKER,
        ComponentNameEnum.TIME_SELECT,
        ComponentNameEnum.SELECT_V2
    ]
    if (textMap.includes(schema?.component as ComponentNameEnum)) {
        return {
            placeholder: t('common.inputText')
        }
    }
    if (selectMap.includes(schema?.component as ComponentNameEnum)) {
        // 一些范围选择�?        const twoTextMap = ['datetimerange', 'daterange', 'monthrange', 'datetimerange', 'daterange']
        if (
            twoTextMap.includes(
                ((schema?.componentProps as any)?.type ||
                    (schema?.componentProps as any)?.isRange) as string
            )
        ) {
            return {
                startPlaceholder: t('common.startTimeText'),
                endPlaceholder: t('common.endTimeText'),
                rangeSeparator: '-'
            }
        } else {
            return {
                placeholder: t('common.selectText')
            }
        }
    }
    return {}
}

/**
 *
 * @param col 内置栅格
 * @returns 返回栅格属�? * @description 合并传入进来的栅格属�? */
export const setGridProp = (col: ColProps = {}): ColProps => {
    const colProps: ColProps = {
        // 如果有span，代表用户优先级更高，所以不需要默认栅�?        ...(col.span
            ? {}
            : {
                xs: 24,
                sm: 12,
                md: 12,
                lg: 12,
                xl: 12
            }),
        ...col
    }
    return colProps
}

/**
 *
 * @param item 传入的组件属�? * @returns 默认添加 clearable 属�? */
export const setComponentProps = (item: FormSchema): Recordable => {
    // const notNeedClearable = ['ColorPicker']
    // 拆分事件并组�?    const onEvents = (item?.componentProps as any)?.on || {}
    const newOnEvents: Recordable = {}

    for (const key in onEvents) {
        if (onEvents[key]) {
            newOnEvents[`on${firstUpperCase(key)}`] = (...args: any[]) => {
                onEvents[key](...args)
            }
        }
    }

    const componentProps: Recordable = {
        clearable: true,
        ...item.componentProps,
        ...newOnEvents
    }
    // 需要删除额外的属�?    if (componentProps.slots) {
        delete componentProps.slots
    }
    if (componentProps.on) {
        delete componentProps.on
    }
    return componentProps
}

/**
 *
 * @param formModel 表单数据
 * @param slotsProps 插槽属�? */
export const setItemComponentSlots = (slotsProps: Recordable = {}): Recordable => {
    const slotObj: Recordable = {}
    for (const key in slotsProps) {
        if (slotsProps[key]) {
            if (isFunction(slotsProps[key])) {
                slotObj[humpToDash(key)] = (...args: any[]) => {
                    return slotsProps[key]?.(...args)
                }
            } else {
                slotObj[humpToDash(key)] = () => {
                    return slotsProps[key]
                }
            }
        }
    }
    return slotObj
}

/**
 *
 * @param schema Form表单结构化数�? * @param formModel FormMoel
 * @returns FormMoel
 * @description 生成对应的formModel
 */
export const initModel = (schema: FormSchema[], formModel: Recordable) => {
    const model: Recordable = {...formModel}
    schema.map((v) => {
        if (v.remove) {
            delete model[v.field]
        } else if (v.component !== 'Divider') {
            // const hasField = Reflect.has(model, v.field)
            const hasField = get(model, v.field)
            // 如果先前已经有值存在，则不进行重新赋值，而是采用现有的�?            set(
                model,
                v.field,
                hasField !== void 0 ? get(model, v.field) : v.value !== void 0 ? v.value : undefined
            )
            // model[v.field] = hasField ? model[v.field] : v.value !== void 0 ? v.value : undefined
        }
    })
    // 如果 schema 对应�?field 不存在，则删�?model 中的对应�?field
    for (let i = 0; i < schema.length; i++) {
        const key = schema[i].field
        if (!Object.prototype.hasOwnProperty.call(model, key)) {
            delete model[key]
        }
    }
    return model
}
