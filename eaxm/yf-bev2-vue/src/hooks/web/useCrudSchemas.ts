import {reactive} from 'vue'
import {eachTree, treeMap, filter} from '@/utils/tree'
import {FormSchema} from '@/components/Form'
import {TableColumn} from '@/components/Table'
import {DescriptionsSchema} from '@/components/Descriptions'

export type CrudSchema = Omit<TableColumn, 'children'> & {
    search?: CrudSearchParams
    table?: CrudTableParams
    form?: CrudFormParams
    detail?: CrudDescriptionsParams
    children?: CrudSchema[]
}

interface CrudSearchParams extends Omit<FormSchema, 'field'> {
    // 是否隐藏在查询项
    hidden?: boolean
}

interface CrudTableParams extends Omit<TableColumn, 'field'> {
    // 是否隐藏表头
    hidden?: boolean
}

interface CrudFormParams extends Omit<FormSchema, 'field'> {
    // 是否隐藏表单�?    hidden?: boolean
}

interface CrudDescriptionsParams extends Omit<DescriptionsSchema, 'field'> {
    // 是否隐藏表单�?    hidden?: boolean
}

interface AllSchemas {
    searchSchema: FormSchema[]
    tableColumns: TableColumn[]
    formSchema: FormSchema[]
    detailSchema: DescriptionsSchema[]
}

// 过滤所有结�?export const useCrudSchemas = (
    crudSchema: CrudSchema[]
): {
    allSchemas: AllSchemas
} => {
    // 所有结构数�?    const allSchemas = reactive<AllSchemas>({
        searchSchema: [],
        tableColumns: [],
        formSchema: [],
        detailSchema: []
    })

    const searchSchema = filterSearchSchema(crudSchema)
    // @ts-ignore
    allSchemas.searchSchema = searchSchema || []

    const tableColumns = filterTableSchema(crudSchema)
    allSchemas.tableColumns = tableColumns || []

    const formSchema = filterFormSchema(crudSchema)
    allSchemas.formSchema = formSchema

    const detailSchema = filterDescriptionsSchema(crudSchema)
    allSchemas.detailSchema = detailSchema

    return {
        allSchemas
    }
}

// 过滤 Search 结构
const filterSearchSchema = (crudSchema: CrudSchema[]): FormSchema[] => {
    const searchSchema: FormSchema[] = []
    const length = crudSchema.length

    for (let i = 0; i < length; i++) {
        const schemaItem = crudSchema[i]
        // 判断是否隐藏
        if (!schemaItem?.search?.hidden) {
            const searchSchemaItem = {
                component: schemaItem?.search?.component || 'Input',
                ...schemaItem.search,
                field: schemaItem.field,
                label: schemaItem.label
            }

            // 删除不必要的字段
            delete searchSchemaItem.hidden

            searchSchema.push(searchSchemaItem)
        }
    }

    return searchSchema
}

// 过滤 table 结构
const filterTableSchema = (crudSchema: CrudSchema[]): TableColumn[] => {
    const tableColumns = treeMap<CrudSchema>(crudSchema, {
        conversion: (schema: CrudSchema) => {
            if (!schema?.table?.hidden) {
                return {
                    ...schema.table,
                    ...schema
                }
            }
        }
    })

    // 第一次过滤会�?undefined 所以需要二次过�?    return filter<TableColumn>(tableColumns as TableColumn[], (data) => {
        if (data.children === void 0) {
            delete data.children
        }
        return !!data.field
    })
}

// 过滤 form 结构
const filterFormSchema = (crudSchema: CrudSchema[]): FormSchema[] => {
    const formSchema: FormSchema[] = []
    const length = crudSchema.length

    for (let i = 0; i < length; i++) {
        const formItem = crudSchema[i]
        // 判断是否隐藏
        if (!formItem?.form?.hidden) {
            const formSchemaItem = {
                component: formItem?.form?.component || 'Input',
                ...formItem.form,
                field: formItem.field,
                label: formItem.label
            }

            // 删除不必要的字段
            delete formSchemaItem.hidden

            formSchema.push(formSchemaItem)
        }
    }

    return formSchema
}

// 过滤 descriptions 结构
const filterDescriptionsSchema = (crudSchema: CrudSchema[]): DescriptionsSchema[] => {
    const descriptionsSchema: FormSchema[] = []

    eachTree(crudSchema, (schemaItem: CrudSchema) => {
        // 判断是否隐藏
        if (!schemaItem?.detail?.hidden) {
            const descriptionsSchemaItem = {
                ...schemaItem.detail,
                field: schemaItem.field,
                label: schemaItem.detail?.label || schemaItem.label
            }

            // 删除不必要的字段
            delete descriptionsSchemaItem.hidden

            descriptionsSchema.push(descriptionsSchemaItem)
        }
    })

    return descriptionsSchema
}
