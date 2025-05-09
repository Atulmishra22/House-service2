const store = Vuex.createStore({
  state: {
    auth_token: null,
    role: null,
    loggedIn: null,
    user_id: null,
  },
  mutations: {
    setUser(state) {
      try {
        if (JSON.parse(localStorage.getItem("user"))) {
          const user = JSON.parse(localStorage.getItem("user"));
          state.auth_token = user.token;
          state.role = user.role;
          state.loggedIn = true;
          state.user_id = user.id;
          
        }
      } catch (error) {
        console.warn(error);
      }
    },
    logout(state) {
      state.auth_token = null;
      state.role = null;
      state.loggedIn = false;
      state.user_id = null;
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiryTime');
      
    },
    
  },
  actions: {
    tokenExpiry({ commit }){
      const expiryTime = localStorage.getItem('tokenExpiryTime');
      if (expiryTime && Date.now() > expiryTime){
        store.commit('logout');

      }
    }
  },
});

store.commit("setUser");
store.dispatch('tokenExpiry');

export default store;
