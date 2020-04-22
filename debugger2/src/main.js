
import libEnum from './lib/enum';
import Vue from 'vue';
import './plugins/element.js';
import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/index.css';
import VueI18n from 'vue-i18n'
import VueHighlightJS from 'vue-highlight.js'
import bash from 'highlight.js/lib/languages/bash';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/default.css';
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/legend';
import i18nCN from './i18n/cn.js';
import i18nEN from './i18n/en.js';
import App from './App.vue';

let globalVue = null;

function registerComponent() {
  Vue.use(VXETable);
  Vue.use(VueI18n);
  Vue.use(VueHighlightJS, {
    languages: {javascript, bash}
  });
  Vue.component('v-chart', ECharts);
}

function getGlobalVue() {
  return globalVue;
}

function setObjProperty(obj, key, value) {
  getGlobalVue().$set(obj, key, value);
}

function getLanguage() {
  let language = (navigator.language || navigator.browserLanguage).toLowerCase();
  if (language.startsWith('zh')) return libEnum.language.CN;
  return libEnum.language.EN;
}

function createVueI18n() {
  const messages = {
    cn: i18nCN,
    en: i18nEN,
    fallbackLocale: 'en'
  };
  return new VueI18n({
    locale: getLanguage(),
    messages,
  });
}

(function main() {
  registerComponent();
  globalVue = new Vue({
    el: '#app',
    i18n: createVueI18n(),
    render: h => h(App)
  });
})();

export default {
  getGlobalVue,
  setObjProperty,
};
