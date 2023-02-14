import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'

// scss
import './styles/app.scss';

// lazyload
import VueLazyLoad from 'vue-lazyload';
import loadingImage from './assets/images/common/loading.svg';
import errorImage from './assets/images/common/error.svg';

createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueLazyLoad, {
    loading: loadingImage,
    error: errorImage,
  })
  .mount('#app');
