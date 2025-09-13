import { BButton, BModal, BFormGroup, BFormRadioGroup, BLink } from 'bootstrap-vue-next'

export default function registerGlobalComponents(app) {
  app.component('BButton', BButton)
  app.component('BModal', BModal)
  app.component('BFormGroup', BFormGroup)
  app.component('BFormRadioGroup', BFormRadioGroup)
  app.component('BLink', BLink)
}
