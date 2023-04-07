import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from "@/router";
import antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css"

const app = createApp(App);
app.use(router);
app.use(antd);

router.isReady().then(() => app.mount('#app'))
