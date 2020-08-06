import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import JsonViewer from 'vue-json-viewer'
ElementUI.Dialog.props.closeOnClickModal.default = false; //点击遮罩层不会关闭弹窗
Vue.use(JsonViewer)
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
