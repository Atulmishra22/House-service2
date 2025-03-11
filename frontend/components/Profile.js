export default {
  template: `
    <div v-if="userDetails" class="container">
        <form @submit.prevent="updateUser()" >
            <div class="mb-3">
            <label v-if="$store.state.role === 'professional'" for="name" class="form-label">Professional Name:</label>
            <label v-else for="name" class="form-label">Customer Name:</label>
            <input type="text" class="form-control" v-model="userDetails.name" id="name"  required>
            </div>
            <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" class="form-control" v-model="userDetails.email" id="email" required>
            </div>
            <div class="mb-3">
            <label for="phone" class="form-label">Phone:</label>
            <input type="number" class="form-control" v-model="userDetails.phone" id="phone"  required>
            </div>
            <div class="mb-3">
            <label v-if="$store.state.role === 'professional'" for="service" class="form-label">Service:</label>
            <input type="text" class="form-control bg-light" v-model="userDetails.service_name" id="service" readonly required>
            </div>
            <div class="mb-3">
            <label v-if="$store.state.role === 'professional'" for="experience" class="form-label">Experience:</label>
            <input type="number" class="form-control" v-model="userDetails.experience" id="experience" required>
            </div>
            <div class="mb-3">
            <label v-if="$store.state.role === 'professional'" for="date-created" class="form-label">Date of Creation:</label>
            <input type="text" class="form-control bg-light" v-model="userDetails.date_created" id="date-created" readonly required>
            </div>
            <div class="mb-3">
            <label for="address" class="form-label">Address:</label>
            <input type="text" class="form-control" v-model="userDetails.address" id="address" required>
            </div>
            <div class="mb-3">
            <label for="pincode" class="form-label">Pincode:</label>
            <input type="number" class="form-control" v-model="userDetails.pincode" id="pincode" required>
            </div>
            <button type="submit" class="btn btn-primary me-1" data-bs-dismiss="modal">Modify</button>
        </form>
    </div>
    `,
  props: ["userDetails"],
  methods:{
    async updateUser(id) {
      let api_url ;
      if (this.$store.state.role === 'professional'){
        api_url = "/api/professionals/"
      }else{
        api_url = "/api/customers/"
      }
        try {
          const res = await fetch(location.origin + api_url + this.$store.state.user_id ,{
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Auth: this.$store.state.auth_token,
            },
            body: JSON.stringify(this.userDetails),
          });
          if (res.ok) {
            const data = await res.json();
            this.$emit('showAlert',data.message);
            if (this.$store.state.role === 'customer'){
              this.$emit('refreshCustomer');

            }else{
              this.$emit('refreshProfessional');
            };
            
          }else{
            const ser_data = await res.json();
            console.log(ser_data)
          }
        } catch (error) {
          console.log(error);
        }
      },
  }
};
