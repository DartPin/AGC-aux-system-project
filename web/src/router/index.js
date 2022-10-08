import Vue from 'vue'
import VueRouter from 'vue-router'
import Maitanence from '@/views/Maitanence.vue'
import AVOPlaning from '@/views/AVOPlaning.vue'
import QRCIBlank from '@/views/QRCIBlank.vue'
import QRCIList from '@/views/QRCIList.vue'
import QRCIEdit from '@/views/QRCIEdit.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Maitanence/workList',
    name: 'Maitanence',
    component: Maitanence
  },
  {
    path: '/Logistic/AVOPlaning',
    name: 'AVOPlaning',
    component: AVOPlaning
  },
  {
    path: '/Quality/BlankQRCI',
    name: 'BlankQRCI',
    component: QRCIBlank
  },
  {
    path: '/Quality/ListQRCI',
    name: 'ListQRCI',
    component: QRCIList
  },
  {
    path: '/Quality/Department/:depart/QRCI/:id',
    name: 'QRCI',
    component: QRCIEdit
  },
  {
    path: '/*',
    name: 'NotUsedPath',
    component: Maitanence
  }  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
