export default {
  template: `
    
    <div class="container shadow col-sm-5 my-2 p-4">
      <h2>Register</h2>
      <form @submit.prevent="register" enctype="multipart/form-data">
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
                <label for="name" class="form-label">Name :</label>
                <input type="text" v-model="name" class="form-control" name="name" id="name" placeholder="Name" required>
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
              <select 
                id="serviceType" 
                v-model="serviceType" 
                class="form-control" 
                @focus="fetchServices"
                required
              >
                <option value="" disabled>Select a service</option>
                <option 
                  v-for="service in services" 
                  :key="service.id" 
                  :value="service.id"
                >
                  {{ service.name }}
                </option>
              </select>
          </div>
          
          <!-- File input -->
          <div class="mb-3">
            <label for="fileInput" class="form-label">Upload File</label>
            <input type="file" class="form-control file-upload" id="fileInput" @change="handleFile" accept="application/pdf" required>
          </div>
          <div class="mb-3">
                <label for="experience" class="form-label">Experience(in yrs) :</label>
                <input type="number" v-model="experience" class="form-control" name="exp" id="experience" required>
          </div>
        </div>
        <div class="mb-3">
                <label for="phone" class="form-label">Phone :</label>
                <input type="text" v-model="phone" class="form-control" name="phone" id="phone" required>
        </div>
        <div class="mb-3">
                <label for="address" class="form-label">Address :</label>
                <textarea class="form-control" v-model="address" name="address" id="address" rows="3" required></textarea>
        </div>
        <div class="mb-3">
                <label for="pincode" class="form-label">Pin Code :</label>
                <input type="number" class="form-control" v-model="pincode" name="pincode" id="pincode" required>
        </div>
        


        <button type="submit" class="btn btn-primary">Register</button>
      </form>
      <div v-if="alertBox" class="row justify-content-center">
      <div class="alert alert-primary alert-dismissible fade col-sm-5 show my-1 shadow" role="alert">
            <i v-if="circleCheck" class="fa-solid fa-circle-check mx-2"></i> 
            <i v-if="crossCheck" class="fa-sharp fa-solid fa-circle-xmark mx-2"></i>
            {{successMessage}}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      </div>
    </div>
    `,

  data() {
    return {
      email: "",
      password: "",
      role: "",
      name: "",
      serviceType: "",
      phone: "",
      address: "",
      pincode: "",
      experience: "",
      file: "",
      alertBox:false,
      circleCheck:false,
      crossCheck:false,
      successMessage:"",
      services: [],
      roles: [
        { text: "Customer", value: "customer" },
        { text: "Professional", value: "professional" },
      ],
    };
  },
  computed: {
    isProfessional() {
      return this.role === "professional"; // Returns true if the role is 'professional'
    },
    
  },
  methods: {
    handleFile(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
      }
    },
    async fetchServices() {
      try {
        const res = await fetch(location.origin + "/api/services");
        if (res.ok) {
          const ser_data = await res.json();
          this.services = ser_data;
          
        }
      } catch (error) {
        console.log(error);
      }
    },

    async register() {
      const formData = new FormData();
      formData.append("email", this.email);
      formData.append("password", this.password);
      formData.append("role", this.role);
      formData.append("name", this.name);
      formData.append("phone", this.phone);
      formData.append("address", this.address);
      formData.append("pincode", this.pincode);

      if (this.role === "professional") {
        formData.append("service_id", this.serviceType);
        formData.append("experience", this.experience);
        formData.append("file", this.file);
      }

      try {
        const res = await fetch(location.origin + "/register", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const responseData = await res.json();
          console.log("Regsiter successfully", responseData);
          this.alertBox = true;
          this.circleCheck = true;
          this.successMessage = responseData.message
          setTimeout(()=>{
            this.$router.push('/login')
            
          },3000)
        }else{
          const errorData = await res.json();
          console.log(errorData)
          this.alertBox = true;
          this.crossCheck = true;
          this.successMessage = errorData.error;

        }
      } catch (error) {
        console.error("Request failed", error);
      }
    },
  },
};
