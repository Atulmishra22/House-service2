export default {
  template: `
    <div class="d-flex justify-content-between bg-warning">
        <router-link to="/" class="btn btn-outline-primary m-2"> Home </router-link>
        <h2>HOUSE SERVICE</h2>  
        <div>
          <router-link v-if="!$store.state.loggedIn && !isLoginPage" to='/login' class="btn btn-outline-primary m-2">Login</router-link> 
          <button v-if="$store.state.loggedIn" @click="logOut" class="btn btn-outline-primary m-2">Log Out</button>
          <router-link v-if="!$store.state.loggedIn && !isRegisterPage" to='/register' class="btn btn-outline-primary m-2">Register</router-link>
        </div>
    </div>
    
    `,
  computed: {
    isLoginPage() {
      return this.$route.path === "/login";
    },
    isRegisterPage() {
      return this.$route.path === "/register";
    },
  },
  methods: {
    logOut(){
      this.$store.commit('logout');
      this.$router.push('/login');
    }
  },
};
