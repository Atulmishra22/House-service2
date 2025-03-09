export default {
  template: `
    <div v-if="userDetails" class="container">
        <form @submit.prevent="updateUser(userDetails.id)" >
            <div class="mb-3">
            <label for="customer-name" class="form-label">Customer Name:</label>
            <input type="text" class="form-control" v-model="userDetails.name" id="customer-name"  required>
            </div>
            <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" class="form-control" v-model="userDetails.email" id="email"  required>
            </div>
            <div class="mb-3">
            <label for="phone" class="form-label">Phone:</label>
            <input type="number" class="form-control" v-model="userDetails.phone" id="phone"  required>
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
        try {
          const res = await fetch(location.origin + "/api/customers/"+ id ,{
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
            if (this.userDetails.user_type === "user"){
              this.$emit('refreshCustomer');

            }
            
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
