import nestable from 'vue-nestable/dist/index.esm'
import field from './field.vue'

panel.plugin('beluga/tiller', {
    fields: {
        tiller: field
    },
    use: {
        nestable ,
        plugin(Vue) {
            if (window && window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
                window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue
            }     
        }
    }
})
