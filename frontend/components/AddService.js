export default {
  template: `
    <div class="container">
        <form @submit.prevent="addService">
            <div class="mb-3">
            <label for="service-name" class="form-label">Service Name:</label>
            <input type="text" class="form-control" v-model="name" id="service-name" placeholder="Enter Service Name" required>
            </div>
            <div class="mb-3">
            <label for="price" class="form-label">Price:</label>
            <input type="number" class="form-control" v-model="price" id="price" placeholder="150" required>
            </div>
            <div class="mb-3">
            <label for="time" class="form-label">Time Required:</label>
            <input type="number" class="form-control" v-model="time_required" id="time" placeholder="2" required>
            </div>
            <div class="mb-3">
            <label for="description" class="form-label">Description:</label>
            <input type="text" class="form-control" v-model="description" id="description" placeholder="Good and nice floor cleaning" required>
            </div>
            
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
        </form>
    
    </div>
    
    `,
  data() {
    return {
      name: null,
      price: null,
      time_required: null,
      description: null,
      
    };
  },
  methods: {
    async addService() {
      const data = {
        name: this.name,
        price: this.price,
        time_required: this.time_required,
        description: this.description,
      };
      try {
        const res = await fetch(location.origin + "/api/services", {
          method: "POST",
          headers: {
            Auth: this.$store.state.auth_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const responseData = await res.json();
          console.log("servcie added sucessfully", responseData);
          this.$emit('showAlert',responseData.message)
        } else {
          const errorData = await res.json();
          console.error("failed to add", errorData);
          
        }
      } catch (error) {
        console.error("Request failed", error);
      }
    },
  },
};
