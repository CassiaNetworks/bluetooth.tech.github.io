
import libEnum from './lib/enum';
import Vue from 'vue';
import i18nCN from './i18n/cn.js';
import i18nEN from './i18n/en.js';
import App from './App.vue';

let globalVue = null;

function registerComponent() {
  Vue.component('v-chart', VueECharts);
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
