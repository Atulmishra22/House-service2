export default {
  props: ["customers"],
  template: `
      <div>
      <div class="cust-accordion">
      
      <div class="accordion">
          <div class="accordion-item">
              <h2 class="accordion-header">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#customers">
                  <div class="container row">
                      <h4 class="col text-center">ID</h4>
                      <h4 class="col text-center">Customer name</h4>
                      <h4 class="col text-center">Phone</h4>
                      <h4 class="col text-center">Address</h4>
                      <h4 class="col text-center">Pincode</h4>
                      <h4 class="col text-center">Action</h4>
                  </div>
              </button>
              </h2>
              <div id="customers" class="accordion-collapse collapse show">
              <div v-if="customers.length === 0" class="accordion-body">
                  <h4>No Data Available</h4>
              </div>
              <div v-else class="accordion-body">
                    <div v-for="customer in customers" :key="customer.id" class="conatiner row border border-primary p-1 lead rounded mb-1">
                      <div class="col text-center">
                          <button data-bs-toggle="modal" data-bs-target="#customerDetail" class="fw-bold btn btn-outline-info" :value="customer.id" @click="showCustomerDetails(customer)" >{{customer.id}}</button>
                      </div>
                      <div class="col text-center">
                          <p >{{customer.name}}</p>
                      </div>
                      <div class="col text-center">
                          <p >{{customer.phone}}</p>
                      </div>
                      <div class="col text-center">
                          <p >{{customer.address}}</p>
                      </div>
                      <div class="col text-center">
                      <div class="col">
                          <p >{{customer.pincode}}</p>
                      </div>
                      </div>
                      <div class="col">
                        <button v-if="customer.active" @click="customerStatus(customer.id,false)" class="btn btn-secondary m-1">Block</button>
                        <button v-else @click="customerStatus(customer.id,true)" class="btn btn-primary m-1">UnBlock</button>
                        <button @click="deleteCustomer(customer.id)" class="btn btn-danger"><i class="fa-solid fa-trash me-1"></i>Delete</button>
                      </div>
                      
                    </div>
              </div>
              </div>
          </div>
          <div class="modal fade" id="customerDetail" tabindex="-1" >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Customer Detail</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="card shadow">
                    <div class="card-header text-center">
                      {{selectedCustomer.name}}
                    </div>
                    <div class="card-body">
                    <table class="table border border-primary">
                    <tbody>
                      <tr>
                        <th> customer ID:</th>
                        <td>{{ selectedCustomer.id }}</td>
                      </tr>
                      <tr>
                        <th> Email:</th>
                        <td>{{ selectedCustomer.email }}</td>
                      </tr>
                      <tr>
                        <th> Phone:</th>
                        <td>{{ selectedCustomer.phone}}</td>
                      </tr>
                      <tr>
                        <th> Address:</th>
                        <td>{{ selectedCustomer.address }}</td>
                      </tr>
                      <tr>
                        <th> Pincode:</th>
                        <td>{{ selectedCustomer.pincode }}</td>
                      </tr>
                      <tr>
                        <th> Active:</th>
                        <td>{{ selectedCustomer.active }}</td>
                      </tr>
                    </tbody>
                    </table>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>
  
      
      `,
  data() {
    return {
      selectedCustomer: {},
    };
  },

  methods: {
    showCustomerDetails(customer) {
      this.selectedCustomer = customer;
    },
    async deleteCustomer(id) {
      try {
        const res = await fetch(location.origin + "/api/customers/" + id, {
          method: "DELETE",
          headers: {
            Auth: this.$store.state.auth_token,
          },
        });
        if (res.ok) {
          const ser_data = await res.json();
          this.$emit("showAlert", ser_data.message);
          this.$emit("customerDeleted", id);
        } else {
          const ser_data = await res.json();
          console.log(ser_data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async customerStatus(id, status) {
      const data = {
        active: status,
      };
      try {
        const res = await fetch(
          location.origin + `/api/customers/status/${id}`,
          {
            method: "PUT",
            headers: {
              Auth: this.$store.state.auth_token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        if (res.ok) {
          const responseData = await res.json();

          this.$emit("showAlert", responseData.message);
          this.$emit("refreshCustomer");
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
