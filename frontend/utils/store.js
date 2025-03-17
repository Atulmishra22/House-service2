const store = Vuex.createStore({
  state: {
    auth_token: null,
    role: null,
    loggedIn: null,
    user_id: null,
    professionalDetail:null,
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
      
    },
    
  },
  action: {

  },
});

store.commit("setUser");

export default store;
