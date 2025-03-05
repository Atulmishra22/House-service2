import ServiceAccordion from "../components/ServiceAccordion.js";
import AddService from "../components/AddService.js";
import ServiceRequest from "../components/ServiceRequest.js";

export default {
  template: `
    <div class="container-fluid">
        <div class="row">
            <div class="d-flex justify-content-between shadow-lg text-bg-light">
                <router-link to="/" class="d-block text-decoration-none text-dark p-3 "><i class="fas fa-tachometer-alt me-2"></i> Dashboard </router-link>
                <a class="d-block btn text-dark p-3" data-bs-toggle="modal" data-bs-target="#profile"><i class="fas fa-file-alt me-2"></i> Profile </a>
                <a class="d-block btn  text-dark p-3" data-bs-toggle="modal" data-bs-target="#add-service"><i class="fa-solid fa-file-circle-plus"></i> Add Service </a>
                <router-link to="/" class="d-block text-decoration-none text-dark p-3"><i class="fas fa-rocket me-2"></i> Summary </router-link>
            
            </div>

            <div>
                <div class="modal fade" id="add-service" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5">Add Service</h1>
                            
                        </div>
                        <div class="modal-body">
                            <AddService @showAlert=showServiceAlert @showService=refreshService />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
        <div class="service container-fluid">
        <h3 class="mt-4 ps-4 bg-warning rounded-1 "> Service </h3>
        <div class="container mt-2">
            <ServiceAccordion :services=services @showAlert=showServiceAlert @serviceDeleted=serviceDeleted  />
        </div>
        </div>
        <div class="servcie-request container-fluid">
        <h3 class="mt-4 ps-4 bg-warning rounded-1 "> Service Request </h3>
        <div class="container mt-2">
            <ServiceRequest :service_requests=service_requests  />
        </div>
        </div>
        <div class="professional container-fluid">
        <h3 class="mt-4 ps-4 bg-warning rounded-1 "> Professional </h3>
        <div class="container mt-2">
            < />
        </div>
        </div>
        <div class="customer container-fluid">
        <h3 class="mt-4 ps-4 bg-warning rounded-1 "> Customer </h3>
        <div class="container my-2">
            < />
        </div>
        </div>
        <footer>
        
        </footer>
        
        
    </div>

    `,
  components: { ServiceAccordion, AddService, ServiceRequest },
  data() {
    return {
      alertBox: false,
      successMessage: "",
      service_requests: [],
      services:[],
    };
  },
  created() {
    this.fetchServiceRequests();
    this.fetchServices();
  },
  methods: {
    showServiceAlert(message) {
      this.alertBox = true;
      this.successMessage = message;
      setTimeout(() => {
        this.alertBox = false;
      }, 1000);
    },
    serviceDeleted(id){
      this.services = this.services.filter(service => service.id !== id);
    },
    refreshService(){
      this.fetchServices()
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
          console.log(this.service_requests);
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
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
