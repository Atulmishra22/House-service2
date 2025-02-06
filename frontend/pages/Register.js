export default {
  template: `
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
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
        <div class="mb-3">
          <label for="role" class="form-label">Role</label>
          <input 
            id="role" 
            v-model="role" 
            type="text" 
            class="form-control" 
            placeholder="Enter your role" 
            required
          />
        </div>

        <button type="submit" class="btn btn-primary">Register</button>
      </form>
    </div>
    `,

  data() {
    return {
      email: "",
      password: "",
      role: "",
    };
  },
  methods: {
    async register() {
      // Prevent form default behavior
      const data = {
        email: this.email,
        password: this.password,
        role: this.role,
      };

      try {
        const res = await fetch(location.origin + "/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          console.log("Regsiter successfully", responseData);
          // You can handle success (like redirecting, setting user state, etc.)
        }
      } catch (error) {
        console.error("Request failed", error);
        // Handle network or server errors
      }
    },
  },
};
