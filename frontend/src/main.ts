import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Import Bootstrap styles and JS
import "./assets/styles/bootstrap.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import Font Awesome
import "@fortawesome/fontawesome-free/css/all.css"; // ✅ includes solid, regular, brands, etc.

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
