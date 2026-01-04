import {createTypes, VueTypesInterface, VueTypeValidableDef} from 'vue-types'
import {CSSProperties} from 'vue'

// 自定义扩展vue-types
type PropTypes = VueTypesInterface & {
    readonly style: VueTypeValidableDef<CSSProperties>
}

const propTypes = createTypes({
    func: undefined,
    bool: undefined,
    string: undefined,
    number: undefined,
    object: undefined,
    integer: undefined
}) as PropTypes

// 需要自定义扩展的类�?// see: https://dwightjack.github.io/vue-types/advanced/extending-vue-types.html#the-extend-method
propTypes.extend([
    {
        name: 'style',
        getter: true,
        type: [String, Object],
        default: undefined
    }
])

export {propTypes}
