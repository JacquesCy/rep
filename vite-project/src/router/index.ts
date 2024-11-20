import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import CountryDetail from "../components/CountryDetail.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/country/:name", component: CountryDetail },
];

const router = createRouter({
  history: createWebHistory(), // Utilise le mode "history" pour des URL propres
  routes,
});

export default router;