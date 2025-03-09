export default {
    props :['service_requests'],
    template: `
      <div>
      <div class="sr-accordion">
      
      <div class="accordion">
          <div class="accordion-item">
              <h2 class="accordion-header">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#service-requests">
                  <div class="container row">
                      <h4 class="col text-center">ID</h4>
                      <h4 class="col text-center">Customer name</h4>
                      <h4 class="col text-center">Professional name</h4>
                      <h4 class="col text-center">Service name</h4>
                      <h4 class="col text-center">Service status</h4>
                      <h4 class="col text-center">Action</h4>
                  </div>
              </button>
              </h2>
              <div id="service-requests" class="accordion-collapse collapse show">
              <div v-if="service_requests.length === 0" class="accordion-body">
                  <h4>No Data Available</h4>
              </div>
              <div v-else class="accordion-body">
                    <div v-for="service_request in service_requests" :key="service_request.id" class="conatiner row border border-primary p-1 lead rounded mb-1">
                      <div class="col text-center">
                          <button data-bs-toggle="modal" data-bs-target="#service-requestDetail" class="fw-bold btn btn-outline-info" :value="service_request.id" @click="showRequestDetails(service_request)" >{{service_request.id}}</button>
                      </div>
                      <div class="col text-center">
                          <p >{{service_request.customer_name}}</p>
                      </div>
                      <div class="col text-center">
                          <p >{{service_request.professional_name}}</p>
                      </div>
                      <div class="col text-center">
                          <p >{{service_request.service_name }}</p>
                      </div>
                      <div class="col text-center">
                          <p v-if="service_request.service_status" >{{service_request.service_status.toUpperCase() }}</p>
                      </div>
                      <div class="col text-center">
                        <button v-if="service_request.service_status.toLowerCase() === 'accepted'" @click="cancelService(service_request.id,true)" class="btn btn-secondary m-1">Close</button>
                        <button v-if="service_request.service_status.toLowerCase() === 'requested' || service_request.service_status.toLowerCase() === 'accepted' " @click="cancelService(service_request.id,false)" class="btn btn-primary m-1">Cancel</button>
                        <button v-if="service_request.service_status.toLowerCase() === 'requested'" data-bs-toggle="modal" @click="showRequestDetails(service_request)" data-bs-target="#request-update-form" class="btn btn-warning m-1">Update</button>
                        <button v-if="service_request.service_status.toLowerCase() === 'close' || service_request.service_status.toLowerCase() === 'cancel' " @click="deleteRequest(service_request.id)" class="btn btn-danger"><i class="fa-solid fa-trash me-1"></i>Delete</button>
                      </div>
                      
                    </div>
              </div>
              </div>
          </div>
          <div class="modal fade" id="request-update-form" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">update Request</h1>
                    
                </div>
                <div class="modal-body">
                    <form @submit.prevent="updateRequest" >
                        <div class="mb-3">
                        <label for="service-id" class="form-label">Service ID:</label>
                        <input type="number" class="form-control" v-model="selectedRequest.id" id="service-id" readonly  required>
                        </div>
                        <div class="mb-3">
                        <label for="customer-name" class="form-label">Customer Name:</label>
                        <input type="text" class="form-control" v-model="selectedRequest.customer_name" id="customer-name" readonly  required>
                        </div>
                        <div v-if="selectedRequest.professional_id" class="mb-3">
                        <label for="profesional-name" class="form-label">Professional Name:</label>
                        <input type="text" class="form-control" v-model="selectedRequest.professional_name" id="profesional-name" readonly  required>
                        </div>
                        <div class="mb-3">
                        <label for="service" class="form-label">Service:</label>
                        <input type="text" class="form-control" v-model="selectedRequest.service_name" id="service" readonly  required>
                        </div>
                        <div class="mb-3">
                        <label for="request-date" class="form-label">Request Date:</label>
                        <input type="datetime-local" class="form-control" v-model="selectedRequest.date_of_request" id="request-date" required>
                        </div>
                        <div class="mb-3">
                        <label for="completion-date" class="form-label">Completion Time:</label>
                        <input type="datetime-local" class="form-control" v-model="selectedRequest.date_of_completion" id="completion-date" required>
                        </div>
                        <button type="submit" class="btn btn-primary me-1" data-bs-dismiss="modal">Modify</button>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
          <div class="modal fade" id="service-requestDetail" tabindex="-1" >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Request Detail</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="card shadow">
                    <div class="card-header text-center">
                      {{selectedRequest.customer_name}}
                    </div>
                    <div class="card-body">
                    <table class="table border border-primary">
                    <tbody>
                      <tr>
                        <th> Request ID:</th>
                        <td>{{ selectedRequest.id }}</td>
                      </tr>
                      <tr>
                        <th> Professional Name:</th>
                        <td>{{ selectedRequest.professional_name }}</td>
                      </tr>
                      <tr>
                        <th> Request Date:</th>
                        <td>{{ selectedRequest.date_of_request }}</td>
                      </tr>
                      <tr>
                        <th> completion Date:</th>
                        <td>{{ selectedRequest.date_of_completion }}</td>
                      </tr>
                      <tr>
                        <th> Service status:</th>
                        <td>{{ selectedRequest.service_name }}</td>
                      </tr>
                      <tr>
                        <th> Service status:</th>
                        <td>{{ selectedRequest.service_status }}</td>
                      </tr>
                      <tr>
                        <th> Remarks:</th>
                        <td>{{ selectedRequest.remarks }}</td>
                      </tr>
                      <tr>
                        <th> Ratings:</th>
                        <td>{{ selectedRequest.rating }}</td>
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
        selectedRequest:{},
        close:"close",
        cancel:"cancel",
      };
    },
    
    
    methods: {
      showRequestDetails(service_request){
        this.selectedRequest = service_request;

      },
      async deleteRequest(id) {
        try {
          const res = await fetch(location.origin + "/api/service_requests/" + id, {
            method: "DELETE",
            headers: {
              Auth: this.$store.state.auth_token,
            },
          });
          if (res.ok) {
            const data = await res.json();
            console.log(data)
            this.$emit("showAlert", data.message);
            this.$emit("refreshRequest");
          } else {
            const data = await res.json();
            console.log(data);
          }
        } catch (error) {
          console.log(error);
        }
      },
      async updateRequest() {
        this.selectedRequest.service_status = '';
        try {
          const res = await fetch(
            location.origin + `/api/service_requests/${this.selectedRequest.id}`,
            {
              method: "PUT",
              headers: {
                Auth: this.$store.state.auth_token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(this.selectedRequest),
            }
          );
          if (res.ok) {
            const responseData = await res.json();
            console.log(responseData)
            this.$emit("showAlert", responseData.message);
            this.$emit("refreshRequest");
          } else {
            const errorData = await res.json();
            console.error("failed to add", errorData);
          }
        } catch (error) {
          console.error("Request failed", error);
        }
      },
      async cancelService(id,status) {
        let service_status="";
        if (status){
            service_status= "close"
        }else{
            service_status = "cancel"
        }
        const data ={
            service_status:service_status
        }
        try {
          const res = await fetch(
            location.origin + `/api/service_requests/${id}`,
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
            console.log(responseData)
            this.$emit("showAlert", responseData.message);
            this.$emit("refreshRequest");
          } else {
            const errorData = await res.json();
            console.error("failed to add", errorData);
          }
        } catch (error) {
          console.error("Request failed", error);
        }
      },
      async closeService(id) {
        const data = {
            service_status:"close"
        }
        try {
          const res = await fetch(
            location.origin + `/api/service_requests/${id}`,
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
            console.log(responseData)
            this.$emit("showAlert", responseData.message);
            this.$emit("refreshRequest");
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
  