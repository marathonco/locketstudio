import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate, {
  errorBagName: 'errors',
  inject: true,
  fieldsBagName: 'formFields',
  classes: true
})
