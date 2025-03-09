import ActionServiceRequest from "../components/ActionServiceRequest.js";
import AddRequest from "../components/AddRequest.js";
import Profile from "../components/Profile.js";

export default {
  template: `
    <div class="container-fluid" id="cutsomer-dashboard">
        <div class="row">
            <div class="d-flex justify-content-between shadow-lg text-bg-light">
                <div class="link d-flex">
                <router-link to="/customer-dashboard" class="d-block text-decoration-none text-dark p-3 "><i class="fas fa-tachometer-alt me-2"></i>Customer Dashboard </router-link>
                <a class="d-block btn  text-dark p-3" data-bs-toggle="modal" data-bs-target="#profile"><i class="fa-solid fa-user me-1"></i> Profile </a>
                <a class="d-block btn  text-dark p-3" data-bs-toggle="modal" data-bs-target="#add-request"><i class="fa-solid fa-file-circle-plus"></i> Add Request </a>
                <router-link to="/" class="d-block text-decoration-none text-dark p-3"><i class="fas fa-rocket me-2"></i> Summary </router-link>
                </div>
                <div class="searchbar">
                <form class="d-flex" role="search">
                <input class="form-control m-2" v-model="searchQuery" type="search" @input="search" id="searchbar" placeholder="Search">
                <button class="btn btn-primary my-2" @click="search" type="submit">Search</button>
                </form>
                </div>
            </div>
        </div>

        <div class="container row mt-4">
            <div class="col-4">
            <h4>Welcome <span class="text-primary">{{customer_details.name}}</span> </h4>
            </div>
            <div class="col">
            <div v-if="alertBox" class="container row justify-content-end">
            <div class="alert alert-primary alert-dismissible fade show col-sm-5 shadow" role="alert">
                <i class="fa-solid fa-circle-check mx-2"></i>{{successMessage}}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            </div>
            </div>
        </div>

        <div class="customer-services-container">
            <div v-if="service_professionals.length === 0 " class="services"> 
                <h4 class="text-center"> Services </h4>
                <div class="my-5 row container-fluid align-items-center justify-content-center">
                    <div v-for="service in services" class="col-8 col-lg-4 col-xl-2 my-4">
                    <div @click="fetchServiceProfessionals(service.id)" class="card border-primary">
                        <div class="card-body text-center">
                        <div class="card-title">
                            <h5 class="card-title">{{service.name}}</h5>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            <div v-else class="service-professional"> 
                <h4 class="text-center"> Professionals </h4>
                <div class="my-5 row container-fluid align-items-center justify-content-center">
                    <div v-for="service_professional in service_professionals" class="col-8 col-lg-4 col-xl-2 my-4">
                    <div class="card shadow">
                      <div class="card-header text-center">
                        {{service_professional.name}}
                      </div>
                      <div class="card-body">
                      <table class="table">
                      <tbody>
                        <tr>
                          <th> Phone:</th>
                          <td>{{ service_professional.phone}}</td>
                        </tr>
                        <tr>
                          <th> Service:</th>
                          <td>{{ service_professional.service_name}}</td>
                        </tr>
                        <tr>
                          <th> Rating:</th>
                          <td>{{ service_professional.rating}} &#10024</td>
                        </tr>
                        <tr>
                          <th> Address:</th>
                          <td>{{ service_professional.address }}</td>
                        </tr>
                        <tr>
                          <th> Pincode:</th>
                          <td>{{ service_professional.pincode }}</td>
                        </tr>
                      </tbody>
                      </table>
                      <button @click="selectedProfessional(service_professional)" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#book-service" >Book</button>
                      </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="profile" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Profile</h1>
                </div>
                <div class="modal-body">
                    <Profile :userDetails=customer_details @refreshCustomer=refreshCustomer @showAlert=showAlert />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="add-request" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Add Request</h1>
                </div>
                <div class="modal-body">
                    <AddRequest :services=services :customerData=customer_details @showAlert=showAlert @refreshRequest=refreshRequest />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="book-service" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Application: Book </h1>
                    
                </div>
                <div class="modal-body">
                  <form @submit.prevent="bookService" >
                    <div class="mb-3">
                    <label for="customer-name" class="form-label">Customer Name:</label>
                    <input type="text" class="form-control" v-model="request.customer_name" id="customer-name" readonly  required>
                    </div>
                    <div class="mb-3">
                    <label for="profesional-name" class="form-label">Professional Name:</label>
                    <input type="text" class="form-control" v-model="request.professional_name" id="profesional-name" readonly  required>
                    </div>
                    <div class="mb-3">
                    <label for="service" class="form-label">Service:</label>
                    <input type="text" class="form-control" v-model="request.service_name" id="service" readonly  required>
                    </div>
                    <div class="mb-3">
                    <label for="request-date" class="form-label">Request Date:</label>
                    <input type="datetime-local" class="form-control" v-model="request.date_of_request" id="request-date" required>
                    </div>
                    <div class="mb-3">
                    <label for="completion-date" class="form-label">Completion Time:</label>
                    <input type="datetime-local" class="form-control"  v-model="request.date_of_completion" id="completion-date" required>
                    </div>
                    <button type="submit" class="btn btn-primary me-1" data-bs-dismiss="modal">BooK</button>
                  </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
        <div class="servcie-request container-fluid">
        <h3 class="mt-4 ps-4 bg-warning rounded-1 "> Service Request </h3>
        <div class="container mt-2">
            <ActionServiceRequest :service_requests=service_requests @showAlert=showAlert @refreshRequest=refreshRequest />
        </div>
        </div>
        <footer class="mt-2">
            
        </footer>
        
        

        
    </div>
    
    `,
  components: { Profile, ActionServiceRequest, AddRequest },
  data() {
    return {
      customer_details: {},
      service_requests: [],
      searchQuery: "",
      services: [],
      alertBox: false,
      successMessage: "",
      service_professionals:[],
      request:{}
    };
  },
  mounted() {
    this.fetchServiceRequests();
    this.fetchCustomerDetail();
    this.fetchServices();
  },
  methods: {
    showAlert(message) {
      this.alertBox = true;
      this.successMessage = message;
      setTimeout(() => {
        this.alertBox = false;
      }, 2000);
    },

    selectedProfessional(professional){
      this.request['customer_id'] = this.customer_details.id;
      this.request['professional_id'] = professional.id;
      this.request['service_id'] = professional.service_id;
      this.request['customer_name'] = this.customer_details.name;
      this.request['service_name'] = professional.service_name;
      this.request['professional_name'] = professional.name;
      this.request["date_of_request"] = "";
      this.request["date_of_completion"] = "";

      
    },

    async bookService() {
      
      try {
        const res = await fetch(location.origin + "/api/service_requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Auth: this.$store.state.auth_token,
          },
          body: JSON.stringify(this.request),
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data.message)
        } else {
          const req_data = await res.json();
          console.log(req_data);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async fetchServices() {
      try {
        const res = await fetch(
          location.origin + "/api/services/professional",
          {
            headers: {
              Auth: this.$store.state.auth_token,
            },
          }
        );
        if (res.ok) {
          const ser_data = await res.json();
          this.services = ser_data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async fetchServiceProfessionals(id) {
      try {
        const res = await fetch(
          location.origin + "/api/professionals/service/"+ id ,
          {
            headers: {
              Auth: this.$store.state.auth_token,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          this.service_professionals = data
          console.log(this.service_professionals)
          
        }
      } catch (error) {
        console.log(error);
      }
    },

    async fetchCustomerDetail() {
      try {
        const res = await fetch(
          location.origin + "/api/customers/" + this.$store.state.user_id,
          {
            headers: {
              Auth: this.$store.state.auth_token,
            },
          }
        );
        if (res.ok) {
          const cust_data = await res.json();
          this.customer_details = cust_data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchServiceRequests() {
      try {
        const res = await fetch(
          location.origin +
            "/api/service_requests/customer/" +
            this.$store.state.user_id,
          {
            headers: {
              Auth: this.$store.state.auth_token,
            },
          }
        );
        if (res.ok) {
          const req_data = await res.json();
          this.service_requests = req_data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    search() {
      const query = this.searchQuery.toLowerCase(); // Make the query case-insensitive

      if (query === "") {
        this.filteredServicesRequest = this.services_requests;
      }
      // Filter services based on name or description
      this.filteredServicesRequest = this.services_requests.filter(
        (service_request) =>
          service_request.customer_name.toLowerCase().includes(query) ||
          service_request.professional_name.toLowerCase().includes(query) ||
          service_request.service_name.toLowerCase().includes(query)
      );
    },
    refreshCustomer() {
      this.fetchCustomerDetail();
    },
    refreshRequest() {
      this.fetchServiceRequests();
    },
  },
};
