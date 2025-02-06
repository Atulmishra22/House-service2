const Home = {
  template: `<h1> Home</h1>`,
};
import CustomerDashboard from "../pages/CustomerDashboard.js";
import LoginPage from "../pages/LoginPage.js";
import ProfessionalDashboard from "../pages/ProfessionalDashboard.js";
import Register from "../pages/Register.js";
import adminDashboard from "../pages/adminDashboard.js";
import store from "./store.js";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: LoginPage },
  { path: "/register", component: Register },
  { path: "/admin-dashboard", component: adminDashboard, meta : {requiredLogin :true, role: 'admin'}},
  { path: "/customer-dashboard", component: CustomerDashboard, meta : {requiredLogin :true, role: 'customer'}},
  { path: "/professional-dashboard", component: ProfessionalDashboard, meta : {requiredLogin :true, role: 'professional'}},
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

router.beforeEach(
  (to,from,next) =>{
    if (to.matched.some((record) => record.meta.requiredLogin)){
      if(!store.state.loggedIn){
        next({path:'/login'})
      }else if(to.meta.role && to.meta.role != store.state.role){
        next({path : '/login'})

      }else{
        next()
      }
    }else{
      next()
    }
  }
)

export default router;
