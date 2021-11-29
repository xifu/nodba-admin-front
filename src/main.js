import Vue from "vue";

import Cookies from "js-cookie";

import formatsUtils from "@/utils/formats";

import VXETable from "vxe-table";
import "vxe-table/lib/index.css";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import "normalize.css/normalize.css"; // a modern alternative to CSS resets
import Element from "element-ui";
import "@/styles/element-variables.scss";
import "@/styles/index.scss"; // global css
import App from "@/App";
import store from "@/store";
import router from "@/router";

import "@/icons"; // icon
import "@/permission"; // permission control
import "@/utils/error-log"; // error log
import * as filters from "@/filters"; // global filters


import Print from "@/utils/print";
Vue.use(Print);
VXETable.setup({
  size: "small", // 全局尺寸
  table: {
    tooltipConfig: {
      theme: "light",
      enterable: true,
    },
    autoResize: true,
  },
});
// 自定义全局的格式化处理函数
VXETable.formats.mixin(formatsUtils());

Vue.use(VXETable);



import htmlToPdf from "./utils/htmlToPdf";
htmlToPdf.install(Vue);

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const {mockXHR} = require('../mock')
//   mockXHR()
// }
Element.Dialog.props.closeOnClickModal = false;

Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
});

Vue.component("Treeselect", Treeselect);

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
