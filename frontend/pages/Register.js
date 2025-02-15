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
        <label for="role" class="form-label">Select Role:</label>
        <select id="role" class="form-control" v-model="role" required>
          <option value="" disabled>Please select a role</option>
          <option v-for="role in roles" :key="role.value" :value="role.value">
            {{ role.text }}
          </option>
        </select>
        </div>
        
        <div v-if="isProfessional">
          <!-- Service Type input -->
          <div class="mb-3">
            <label for="serviceType" class="form-label">Service Type</label>
            <input type="text" v-model="serviceType" class="form-control" id="serviceType" placeholder="Enter service type" required>
          </div>
          
          <!-- File input -->
          <div class="mb-3">
            <label for="fileInput" class="form-label">Upload File</label>
            <input type="file" class="form-control file-upload" id="fileInput" @change="handleFileUpload" accept="application/pdf" required>
          </div>
          <div class="mb-3">
                <label for="experience" class="form-label">Experience(in yrs) :</label>
                <input type="number" class="form-control" name="exp" id="experience" required>
          </div>
        </div>
        <div class="mb-3">
                <label for="phone" class="form-label">Phone :</label>
                <input type="text" class="form-control" name="phone" id="phone" required>
        </div>
        <div class="mb-3">
                <label for="address" class="form-label">Address :</label>
                <textarea class="form-control" name="address" id="address" rows="3" required></textarea>
        </div>
        <div class="mb-3">
                <label for="pincode" class="form-label">Pin Code :</label>
                <input type="text" class="form-control" name="pincode" id="pincode" required>
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
      roles: [
        { text: 'Customer', value: "customer" },
        { text: 'Professional', value: "professional" },
      ]
    };
  },
  computed: {
    isProfessional() {
      return this.role === 'professional'; // Returns true if the role is 'professional'
    }
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
