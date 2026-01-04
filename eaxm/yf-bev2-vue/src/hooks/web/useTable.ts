import {useI18n} from '@/hooks/web/useI18n'
import {Table, TableExpose, TableProps, TableSetProps, TableColumn} from '@/components/Table'
import {ElTable, ElMessageBox, ElMessage} from 'element-plus'
import {ref, watch, unref, nextTick, onMounted} from 'vue'

const {t} = useI18n()

interface UseTableConfig {
    /**
     * 是否初始化的时候请求一�?     */
    immediate?: boolean
    fetchDataApi: () => Promise<{
        list: any[]
        total?: number
    }>
    fetchDelApi?: () => Promise<boolean>
}

export const useTable = (config: UseTableConfig) => {
    const {immediate = true} = config

    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const dataList = ref<any[]>([])

    watch(
        () => currentPage.value,
        () => {
            methods.getList()
        }
    )

    watch(
        () => pageSize.value,
        () => {
            // 当前页不�?时，修改页数后会导致多次调用getList方法
            if (unref(currentPage) === 1) {
                methods.getList()
            } else {
                currentPage.value = 1
                methods.getList()
            }
        }
    )

    onMounted(() => {
        if (immediate) {
            methods.getList()
        }
    })

    // Table实例
    const tableRef = ref<typeof Table & TableExpose>()

    // ElTable实例
    const elTableRef = ref<ComponentRef<typeof ElTable>>()

    const register = (ref: typeof Table & TableExpose, elRef: ComponentRef<typeof ElTable>) => {
        tableRef.value = ref
        elTableRef.value = unref(elRef)
    }

    const getTable = async () => {
        await nextTick()
        const table = unref(tableRef)
        if (!table) {
            console.error('The table is not registered. Please use the register method to register')
        }
        return table
    }

    const methods = {
        /**
         * 获取表单数据
         */
        getList: async () => {
            loading.value = true
            try {
                const res = await config?.fetchDataApi()
                console.log('fetchDataApi res', res)
                if (res) {
                    dataList.value = res.list
                    total.value = res.total || 0
                }
            } catch (err) {
                console.log('fetchDataApi error')
            } finally {
                loading.value = false
            }
        },

        /**
         * @description 设置table组件的props
         * @param props table组件的props
         */
        setProps: async (props: TableProps = {}) => {
            const table = await getTable()
            table?.setProps(props)
        },

        /**
         * @description 设置column
         * @param columnProps 需要设置的�?         */
        setColumn: async (columnProps: TableSetProps[]) => {
            const table = await getTable()
            table?.setColumn(columnProps)
        },

        /**
         * @description 新增column
         * @param tableColumn 需要新增数�?         * @param index 在哪里新�?         */
        addColumn: async (tableColumn: TableColumn, index?: number) => {
            const table = await getTable()
            table?.addColumn(tableColumn, index)
        },

        /**
         * @description 删除column
         * @param field 删除哪个数据
         */
        delColumn: async (field: string) => {
            const table = await getTable()
            table?.delColumn(field)
        },

        /**
         * @description 获取ElTable组件的实�?         * @returns ElTable instance
         */
        getElTableExpose: async () => {
            await getTable()
            return unref(elTableRef)
        },

        refresh: () => {
            methods.getList()
        },

        // sortableChange: (e: any) => {
        //   console.log('sortableChange', e)
        //   const { oldIndex, newIndex } = e
        //   dataList.value.splice(newIndex, 0, dataList.value.splice(oldIndex, 1)[0])
        //   // to do something
        // }
        // 删除数据
        delList: async (idsLength: number) => {
            const {fetchDelApi} = config
            if (!fetchDelApi) {
                console.warn('fetchDelApi is undefined')
                return
            }
            ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
                confirmButtonText: t('common.delOk'),
                cancelButtonText: t('common.delCancel'),
                type: 'warning'
            }).then(async () => {
                const res = await fetchDelApi()
                if (res) {
                    ElMessage.success(t('common.delSuccess'))

                    // 计算出临界点
                    const current =
                        unref(total) % unref(pageSize) === idsLength || unref(pageSize) === 1
                            ? unref(currentPage) > 1
                                ? unref(currentPage) - 1
                                : unref(currentPage)
                            : unref(currentPage)

                    currentPage.value = current
                    methods.getList()
                }
            })
        }
    }

    return {
        tableRegister: register,
        tableMethods: methods,
        tableState: {
            currentPage,
            pageSize,
            total,
            dataList,
            loading
        }
    }
}
