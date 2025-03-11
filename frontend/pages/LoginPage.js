export default {
  template: `
  <div class="container-fluid">
    <div class="container shadow col-5 my-5 py-3">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            class="form-control" 
            placeholder="Enter your email" 
            required
          />
        </div>
        
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            class="form-control" 
            placeholder="Enter your password" 
            required
          />
        </div>

        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <div v-if="messageBox" >{{message}}</div>
    </div>
  </div>
    
  `,
  data() {
    return {
      email: '',
      password: '',
      message:"",
      messageBox:false,
    };
  },
  methods: {

    async login() {
      const data = { email: this.email, password: this.password };

      try {
        const res = await fetch(location.origin + '/login', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          const userData = await res.json();
          console.log('Logged in successfully', userData);

          localStorage.setItem('user',JSON.stringify(userData))
          this.$store.commit('setUser')
          if(userData.role === 'admin'){
            this.$router.push('/admin-dashboard')

          }else if(userData.role === 'customer'){
            this.$router.push('/customer-dashboard')

          }else{
            this.$router.push('/professional-dashboard')
          }
        } else {
          const userData = await res.json();
          console.log('Login failed', userData);
          this.showAlert(userData.error);
        }
      } catch (error) {
        console.error('Request failed', error);
      }
    },

    showAlert(message){
      this.message = message;
      this.messageBox = true;
      setTimeout(() => {
        this.messageBox = false;
      }, 2000);
    }
  }
};


