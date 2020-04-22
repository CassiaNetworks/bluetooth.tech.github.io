import developmentConf from './development.js';
import productionConf from './production.js';

let _conf = developmentConf;
if (window.ENV === 'production') _conf = productionConf;

export default _conf;