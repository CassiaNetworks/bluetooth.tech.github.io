
import libEnum from './lib/enum';
import Vue from 'vue';
import i18nCN from './i18n/cn.js';
import i18nEN from './i18n/en.js';
import i18nJA from './i18n/ja.js';
import i18nRU from './i18n/ru.js';
import i18nRO from './i18n/ro.js';
import i18nMO from './i18n/mo.js';
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
  else if (language.match('ja')) return libEnum.language.JA;
  else if (language.match('ro')) return libEnum.language.RO;
  else if (language.match('ru')) return libEnum.language.RU;
  else if (language.match('mo')) return libEnum.language.MO;
  else return libEnum.language.EN;
}

function createVueI18n() {
  const messages = {
    cn: i18nCN,
    en: i18nEN,
    ja: i18nJA,
    ru: i18nRU,
    ro: i18nRO,
    mo: i18nMO,
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
