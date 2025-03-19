import ServiceAccordion from "../components/ServiceAccordion.js";
import AddService from "../components/AddService.js";
import ServiceRequest from "../components/ServiceRequest.js";
import CustomerAccordion from "../components/CustomerAccordion.js";
import ProfessionalAccordion from "../components/ProfessionalAccordion.js";

export default {
  template: `
    <div class="container-fluid">
        <div class="row">
            <div class="d-flex justify-content-between shadow-lg text-bg-light">
                <div class="link d-flex">
                <router-link to="/admin-dashboard" class="d-block text-decoration-none text-dark p-3 "><i class="fas fa-tachometer-alt me-2"></i> Dashboard </router-link>
                <a class="d-block btn  text-dark p-3" data-bs-toggle="modal" data-bs-target="#add-service"><i class="fa-solid fa-file-circle-plus"></i> Add Service </a>
                <router-link to="/admin-dashboard/summary" class="d-block text-decoration-none text-dark p-3"><i class="fas fa-rocket me-2"></i> Summary </router-link>
                </div>
                <div class="searchbar">
                <form class="d-flex" role="search">
                <input class="form-control m-2" v-model="searchQuery" type="search" @input="search" id="searchbar" placeholder="Search">
                <button class="btn btn-primary my-2" @click="search" type="submit">Search</button>
                </form>
                </div>
            </div>
            <div>
                <div class="modal fade" id="add-service" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5">Add Service</h1>
                            
                        </div>
                        <div class="modal-body">
                            <AddService @showAlert=showAlert @showService=refreshService />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div v-if="alertBox" class="container-fluid row justify-content-end">
            <div class="alert alert-primary alert-dismissible fade show col-sm-3 my-1 shadow" role="alert">
                <i class="fa-solid fa-circle-check mx-2"></i>{{successMessage}}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>

        <router-view v-if="$route.path.includes('/summary')"></router-view>

        <div v-if="!$route.path.includes('/summary')">

          <div class="service container-fluid">
          <h3 class="mt-4 ps-4 bg-warning rounded-1 "> Service </h3>
          <div class="container mt-2">
              <ServiceAccordion :services=filteredServices @showAlert=showAlert @serviceDeleted=serviceDeleted @refreshService=refreshService  />
          </div>
          </div>
          <div class="servcie-request container-fluid">
          <h3 class="mt-4 ps-4 bg-warning rounded-1 "> Service Request </h3>
          <div class="container mt-2">
              <ServiceRequest :service_requests=filteredServiceRequests :purpose="'all'" />
              <button @click="downloadCsv" class="btn btn-primary mt-2"> Download CSV </button>
          </div>
          </div>
          <div class="professional container-fluid">
          <h3 class="mt-4 ps-4 bg-warning rounded-1 "> Professional </h3>
          <div class="container mt-2">
              <ProfessionalAccordion :professionals=filteredProfessionals @showAlert=showAlert @professionalDeleted=professionalDeleted @refreshProfessional=refreshProfessional />
          </div>
          </div>
          <div class="customer container-fluid">
          <h3 class="mt-4 ps-4 bg-warning rounded-1 "> Customer </h3>
          <div class="container my-2">
              <CustomerAccordion :customers=filteredCutsomers @showAlert=showAlert @customerDeleted=customerDeleted @refreshCustomer=refreshCustomer />
          </div>
          </div>
        </div>
        <footer class="mt-4">
        
        </footer>
        
        
    </div>

    `,
  components: {
    ServiceAccordion,
    AddService,
    ServiceRequest,
    CustomerAccordion,
    ProfessionalAccordion,
  },
  data() {
    return {
      alertBox: false,
      successMessage: "",
      service_requests: [],
      services: [],
      customers: [],
      professionals: [],
      searchQuery: "",
      filteredServices: [],
      filteredCutsomers: [],
      filteredProfessionals: [],
      filteredServiceRequests: [],
    };
  },
  created() {
    
    this.fetchServiceRequests();
    this.fetchServices();
    this.fetchCustomers();
    this.fetchProfessionals();
  },
  methods: {
    showAlert(message) {
      this.alertBox = true;
      this.successMessage = message;
      setTimeout(() => {
        this.alertBox = false;
      }, 2000);
    },
    serviceDeleted() {
      this.fetchServices();
      this.fetchProfessionals();
      this.fetchServiceRequests();
    },
    customerDeleted() {
      this.fetchCustomers();
      this.fetchServiceRequests();
    },
    professionalDeleted() {
      this.fetchProfessionals();
      this.fetchServiceRequests();
    },
    refreshService() {
      this.fetchServices();
    },
    refreshProfessional() {
      this.fetchProfessionals();
    },
    refreshCustomer() {
      this.fetchCustomers();
    },
    async fetchServiceRequests() {
      try {
        const res = await fetch(location.origin + "/api/service_requests", {
          headers: {
            Auth: this.$store.state.auth_token,
          },
        });
        if (res.ok) {
          const req_data = await res.json();
          this.service_requests = req_data;
          this.filteredServiceRequests = this.service_requests;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchServices() {
      try {
        const res = await fetch(location.origin + "/api/services");
        if (res.ok) {
          const ser_data = await res.json();
          this.services = ser_data;
          this.filteredServices = this.services;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchCustomers() {
      try {
        const res = await fetch(location.origin + "/api/customers", {
          headers: {
            Auth: this.$store.state.auth_token,
          },
        });
        if (res.ok) {
          const customer_data = await res.json();
          this.customers = customer_data;
          this.filteredCutsomers = this.customers;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchProfessionals() {
      try {
        const res = await fetch(location.origin + "/api/professionals", {
          headers: {
            Auth: this.$store.state.auth_token,
          },
        });
        if (res.ok) {
          const professional_data = await res.json();
          this.professionals = professional_data;
          this.filteredProfessionals = this.professionals;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async downloadCsv() {
      try {
        const createCsv = await fetch(
          location.origin + "/create-closed-service-request-csv",
          {
            headers: {
              Auth: this.$store.state.auth_token,
            },
          }
        );
        if (createCsv.ok) {
          const task_id = (await createCsv.json()).task_id;

          const max_tries = 100;
          let attempt = 0;
          const interval = setInterval(async () => {
            try {
              const getCsv = await fetch(
                location.origin + `/get-csv/${task_id}`,
                {
                  headers: {
                    Auth: this.$store.state.auth_token,
                  },
                }
              );
              if (getCsv.status === 200) {
                window.open(`${location.origin}/get-csv/${task_id}`);
                this.showAlert("downloaded Sucessfully");
                clearInterval(interval);
              } else {
                const data = await getCsv.json();
                console.log(data.result);
              }

              attempt++;

              if (attempt >= max_tries){
                console.log("Max attempts reached, stopping the interval.");
                clearInterval(interval);
              }
            } catch (error) {
              console.log("something went wrong", error);
              attempt++;

              if (attempt >= max_tries){
                console.log("Max attempts reached, stopping the interval.");
                clearInterval(interval);}
            }
          }, 400);
        } else {
          const data = createCsv.json();
          console.log(data);
        }
      } catch {
        console.log("something went wrog");
      }
    },
    search() {
      const query = this.searchQuery.toLowerCase();

      if (query === "") {
        this.filteredServices = this.services;
        this.filteredServiceRequests = this.service_requests;
        this.filteredCutsomers = this.customers;
        this.filteredProfessionals = this.professionals;
      }
      this.filteredServices = this.services.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.price.toString().includes(query)
      );
      this.filteredServiceRequests = this.service_requests.filter(
        (service_request) =>
          service_request.service_name.toLowerCase().includes(query) ||
          service_request.customer_name.toLowerCase().includes(query) ||
          service_request.professional_name.toLowerCase().includes(query)
      );
      this.filteredCutsomers = this.customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.address.toLowerCase().includes(query) ||
          customer.pincode.toString().includes(query)
      );
      this.filteredProfessionals = this.professionals.filter(
        (professional) =>
          professional.name.toLowerCase().includes(query) ||
          professional.service_name.toLowerCase().includes(query) ||
          professional.address.toLowerCase().includes(query) ||
          professional.pincode.toString().includes(query)
      );
    },
  },
};
