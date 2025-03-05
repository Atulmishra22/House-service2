export default {
    props :['customers'],
    template: `
      <div>
      <div class="cust-accordion">
      
      <div class="accordion">
          <div class="accordion-item">
              <h2 class="accordion-header">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#service-requests">
                  <div class="container row">
                      <h4 class="col text-center">ID</h4>
                      <h4 class="col text-center">Customer name</h4>
                      <h4 class="col text-center">Phone NO.</h4>
                      <h4 class="col text-center">Address</h4>
                      <h4 class="col text-center">Pincode</h4>
                      <h4 class="col text-center">Action</h4>
                  </div>
              </button>
              </h2>
              <div id="service-requests" class="accordion-collapse collapse show">
              <div v-if="customers.length === 0" class="accordion-body">
                  <h4>No Data Available</h4>
              </div>
              <div v-else class="accordion-body">
                    <div v-for="customer in customers" :key="customer.id" class="conatiner row border border-primary p-1 lead rounded mb-1">
                      <div class="col text-center">
                          <button data-bs-toggle="modal" data-bs-target="#serviceDetail" class="fw-bold btn btn-outline-info" :value="customers.id" @click="showCustomerDetails(customer)" >{{customer.id}}</button>
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
                          <p >{{customer.pincode}}</p>
                      </div>
                      
                    </div>
              </div>
              </div>
          </div>
          <div class="modal fade" id="serviceDetail" tabindex="-1" >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Request Detail</h1>
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
        selectedCustomer:{},
      };
    },
    
    methods: {
      showCustomerDetails(customer){
        this.selectedCustomer = customer;
  
      },
      
    },
  };
  