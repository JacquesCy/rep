import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Assure-toi que le routeur est bien importé

createApp(App).use(router).mount("#app");
