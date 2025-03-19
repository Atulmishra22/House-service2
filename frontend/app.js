import Navbar from "./components/Navbar.js";
import router from "./utils/router.js";
import store from "./utils/store.js";

const app = Vue.createApp({
  components: { Navbar },
  template: `
  <Navbar /> 
  <div>
    <router-view ></router-view> 
  </div>
  <footer class="bg-primary text-white text-center p-2">
    <p class="h5 text-white">
      &copy; 2025 A M House Services. All rights reserved.
    </p>
  </footer>
  `,
});
app.use(store);
app.use(router);
app.mount("#app");
