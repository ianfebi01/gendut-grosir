import Vue from 'vue'

// Libaries
import Vuelidate from 'vuelidate'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

// Initiate Plugins
Vue.component('VcDatepicker', DatePicker)
Vue.use(Vuelidate)
