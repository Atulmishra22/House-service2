import ActionServiceRequest from "../components/ActionServiceRequest.js";
import Profile from "../components/Profile.js";
import ServiceRequest from "../components/ServiceRequest.js";

export default {
  template: `
    <div class="container-fluid" id="professional-dashboard">
      <div class="row">
        <div class="d-flex justify-content-between shadow-lg text-bg-light">
            <div class="link d-flex">
              <router-link to="/professional-dashboard" class="d-block text-decoration-none text-dark p-3 "><i class="fas fa-tachometer-alt me-2"></i>Professional Dashboard </router-link>
              <a class="d-block btn  text-dark p-3" data-bs-toggle="modal" data-bs-target="#profile"><i class="fa-solid fa-user me-1"></i> Profile </a>
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
          <h4>Welcome <span class="text-primary">{{professionalDetail.name}}</span> </h4>
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

      <div class="modal fade" id="profile" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                  <h1 class="modal-title fs-5">Profile</h1>
              </div>
              <div class="modal-body">
                  <Profile :userDetails=professionalDetail @refreshProfessional=fetchProfessionalDetail @showAlert=showAlert />
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
        </div>
      </div>

      <div class="mt-3 container-fluid">
        <div class="servcie-request container-fluid">
          <h3 class="ps-4 bg-warning rounded-1 "> ACCEPETED SERVICE: </h3>
          <div class="container mt-2">
              <ServiceRequest :service_requests=acceptedRequests  />
          </div>
        </div>

        <div class="servcie-request container-fluid">
          <h3 class="mt-3 ps-4 bg-warning rounded-1 "> CLOSED SERVICE: </h3>
          <div class="container mt-2">
              <ServiceRequest :service_requests=closedRequests  />
          </div>
        </div>

        <div class="servcie-request container-fluid">
          <h3 class="mt-3 ps-4 bg-warning rounded-1 "> All SERVICE: </h3>
          <div class="container mt-2">
              <ActionServiceRequest :service_requests=fileterdData @showAlert=showAlert @refreshRequest=fetchRequestDetail  />
          </div>
        </div>
        
      </div>

      
        
    </div>
    `,
    components: { Profile , ServiceRequest , ActionServiceRequest },
    data(){
      return{
        searchQuery:'',
        successMessage:'',
        professionalDetail:'',
        alertBox:'',
        acceptedRequests:[],
        closedRequests:[],
        allRequests:[],
        fileterdData:[],
      }
    },
    mounted() {
      this.fetchProfessionalDetail();
      this.fetchRequestDetail();
    },

    methods:{
      search(){},

      showAlert(message) {
        this.alertBox = true;
        this.successMessage = message;
        setTimeout(() => {
          this.alertBox = false;
        }, 2000);
      },

      async fetchProfessionalDetail() {
        try {
          const res = await fetch(
            location.origin + "/api/professionals/" + this.$store.state.user_id,
            {
              headers: {
                Auth: this.$store.state.auth_token,
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            this.professionalDetail = data;
          }
        } catch (error) {
          console.log(error);
        }
      },

      async fetchRequestDetail() {
        try {
          const res = await fetch(
            location.origin + "/api/service_requests/professional/" + this.$store.state.user_id,
            {
              headers: {
                Auth: this.$store.state.auth_token,
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            this.allRequests = data;
            this.fileterdData = this.allRequests;
            this.fileterdData.forEach((request) => {
              if (request.service_status === 'accepted') {
                this.acceptedRequests.push(request);
              } else if (request.service_status === 'closed' || request.service_status === 'rejected') {
                this.closedRequests.push(request);
              }
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      search() {
        const query = this.searchQuery.toLowerCase(); 
  
        if (query === "") {
          this.fileterdData = this.allRequests;
        }
        this.fileterdData = this.allRequests.filter(
          (service_request) =>
            service_request.professional_name
              ? service_request.professional_name.toLowerCase().includes(query)
              : false ||
                service_request.customer_name.toLowerCase().includes(query)
        );
      },
    }
};
