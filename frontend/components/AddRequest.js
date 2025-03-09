export default {
  template: `
    <div  class="container">
        <form @submit.prevent="addRequest" >
            <div class="mb-3">
            <label for="customer-name" class="form-label">Customer Name:</label>
            <input type="text" class="form-control" v-model="customerData.name" id="customer-name" readonly  required>
            </div>
            <div class="mb-3">
              <label for="serviceType" class="form-label">Service:</label>
              <select 
                id="serviceType" 
                v-model="service_id" 
                class="form-control" 
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
            <div class="mb-3">
            <label for="request-date" class="form-label">Request Date:</label>
            <input type="datetime-local" class="form-control" v-model="date_of_request" id="request-date"  required>
            </div>
            <div class="mb-3">
            <label for="completion-date" class="form-label">Completion Time:</label>
            <input type="datetime-local" class="form-control" v-model="date_of_completion" id="completion-date" required>
            </div>
            <button type="submit" class="btn btn-primary me-1" data-bs-dismiss="modal">Submit</button>
        </form>
    </div>
    `,
  props: ["services", "customerData"],
  data() {
    return {
      customer_name: "",
      professional_name: "",
      service_name: "",
      customer_id: "",
      professional_id: "",
      service_id: "",
      date_of_request: "",
      date_of_completion: "",
    };
  },
  methods: {
    async addRequest() {
      const data = {
        customer_id: this.customerData.id,
        service_id: this.service_id,
        date_of_request: this.date_of_request,
        date_of_completion: this.date_of_completion,
      };
      try {
        const res = await fetch(location.origin + "/api/service_requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Auth: this.$store.state.auth_token,
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const data = await res.json();
          this.$emit("showAlert", data.message);
          this.$emit("refreshRequest");
          this.date_of_request = this.service_id = this.date_of_completion = ''
        } else {
          const req_data = await res.json();
          console.log(req_data);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
