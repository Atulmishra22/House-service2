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
  `,
});
app.use(store);
app.use(router);
app.mount("#app");
