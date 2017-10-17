// import controls from './controls.vue' // t0 d0
// import pagination from './pagination.vue'
//
// export controls
// export pagination

import DataTable from './DataTable'

export default {
    install: function(Vue) {
      Vue.component(DataTable.name, DataTable)
    }
}
