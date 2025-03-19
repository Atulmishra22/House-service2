import Rating from "./Rating.js";

export default {
  props: ["service_requests"],
  template: `
      <div>
      <div class="sr-accordion">
      
      <div class="accordion">
          <div class="accordion-item">
              <h2 class="accordion-header">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#action-service-requests">
                  <div class="container row">
                      <h4 class="col-1 text-center">ID</h4>
                      <h4 class="col-2 text-center">Customer name</h4>
                      <h4 class="col-2 text-center">Professional name</h4>
                      <h4 class="col-2 text-center">Service name</h4>
                      <h4 class="col-2 text-center">Service status</h4>
                      <h4 class="col-3 text-center">Action</h4>
                  </div>
              </button>
              </h2>
              <div id="action-service-requests" class="accordion-collapse collapse show">
              <div v-if="service_requests.length === 0" class="accordion-body">
                  <h4>No Data Available</h4>
              </div>
              <div v-else class="accordion-body">
                    <div v-for="service_request in service_requests" :key="service_request.id" class="conatiner row border border-primary p-1 lead rounded mb-1">
                      <div class="col-1 text-center">
                          <button data-bs-toggle="modal" data-bs-target="#action-request-modal" class="fw-bold btn btn-outline-info" :value="service_request.id" @click="setParticularRequest(service_request)" >{{service_request.id}}</button>
                      </div>
                      <div class="col-2 text-center">
                          <p >{{service_request.customer_name}}</p>
                      </div>
                      <div class="col-2 text-center">
                          <p >{{service_request.professional_name}}</p>
                      </div>
                      <div class="col-2 text-center">
                          <p >{{service_request.service_name }}</p>
                      </div>
                      <div class="col-2 text-center">
                          <p v-if="service_request.service_status" >{{service_request.service_status.toUpperCase() }}</p>
                      </div>
                      <div v-if="$store.state.role === 'customer'" class="col-3 text-center">
                        <button v-if="service_request.service_status.toLowerCase() === 'accepted'" data-bs-toggle="modal" data-bs-target="#close-form" @click="setParticularRequest(service_request)" class="btn btn-secondary m-1">Close</button>
                        <button v-if="service_request.service_status.toLowerCase() === 'requested' || service_request.service_status.toLowerCase() === 'accepted' " @click="updateServiceStatus(service_request.id,'canceled')" class="btn btn-danger m-1">Cancel</button>
                        <button v-if="service_request.service_status.toLowerCase() === 'requested'" data-bs-toggle="modal" @click="setParticularRequest(service_request)" data-bs-target="#request-update-form" class="btn btn-warning m-1">Update</button>
                        <button v-if="service_request.service_status.toLowerCase() === 'closed' || service_request.service_status.toLowerCase() === 'canceled' || service_request.service_status.toLowerCase() === 'rejected' " @click="deleteRequest(service_request.id)" class="btn btn-danger"><i class="fa-solid fa-trash me-1"></i>Delete</button>
                      </div>
                      <div v-if="$store.state.role === 'professional'" class="col-3 text-center">
                        <button v-if="service_request.service_status.toLowerCase() === 'requested' " @click="updateServiceStatus(service_request.id,'accepted')" class="btn btn-warning m-1">Accept</button>
                        <h5 v-if="service_request.service_status.toLowerCase() === 'accepted' " class="text-primary"> {{service_request.service_status}}</h5>
                        <button v-if="service_request.service_status.toLowerCase() === 'requested' && service_request.professional_id " @click="updateServiceStatus(service_request.id,'rejected')" class="btn btn-danger m-1">Reject</button>
                        <button v-if="service_request.service_status.toLowerCase() === 'closed' || service_request.service_status.toLowerCase() === 'canceled' || service_request.service_status.toLowerCase() === 'rejected' " @click="deleteRequest(service_request.id)" class="btn btn-danger"><i class="fa-solid fa-trash me-1"></i>Delete</button>
                      </div>
                      
                    </div>
              </div>
              </div>
          </div>
          <div v-if="$store.state.role === 'customer'" class="modal fade" id="request-update-form" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">update Request</h1>
                    
                </div>
                <div class="modal-body">
                    <form @submit.prevent="updateRequest" >
                        <div class="mb-3">
                        <label for="service-id" class="form-label">Service ID:</label>
                        <input type="number" class="form-control" v-model="particularRequest.id" id="service-id" readonly  required>
                        </div>
                        <div class="mb-3">
                        <label for="customer-name" class="form-label">Customer Name:</label>
                        <input type="text" class="form-control" v-model="particularRequest.customer_name" id="customer-name" readonly  required>
                        </div>
                        <div v-if="particularRequest.professional_id" class="mb-3">
                        <label for="profesional-name" class="form-label">Professional Name:</label>
                        <input type="text" class="form-control" v-model="particularRequest.professional_name" id="profesional-name" readonly  required>
                        </div>
                        <div class="mb-3">
                        <label for="service" class="form-label">Service:</label>
                        <input type="text" class="form-control" v-model="particularRequest.service_name" id="service" readonly  required>
                        </div>
                        <div class="mb-3">
                        <label for="request-date" class="form-label">Request Date:</label>
                        <input type="datetime-local" class="form-control" v-model="particularRequest.date_of_request" id="request-date" required>
                        </div>
                        <div class="mb-3">
                        <label for="completion-date" class="form-label">Completion Time:</label>
                        <input type="datetime-local" class="form-control" v-model="particularRequest.date_of_completion" id="completion-date" required>
                        </div>
                        <div class="mb-3">
                        <label for="remarks" class="form-label">Remarks:</label>
                        <input type="text" class="form-control" v-model="particularRequest.remarks" id="remarks" required>
                        </div>
                        <button type="submit" class="btn btn-primary me-1">Modify</button>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="action-request-modal" tabindex="-1" >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Request Detail</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="card shadow">
                    <div v-if="$store.state.role === 'customer'" class="card-header text-center">
                      {{ particularRequest.customer_name }}
                    </div>
                    <div class="card-body">
                    <table class="table border border-primary">
                    <tbody>
                      <tr>
                        <th> Request ID:</th>
                        <td>{{ particularRequest.id }}</td>
                      </tr>
                      <tr>
                        <th> Professional Name:</th>
                        <td>{{ particularRequest.professional_name }}</td>
                      </tr>
                      <tr>
                        <th> Request Date:</th>
                        <td>{{ dateFormatter(particularRequest.date_of_request) }}</td>
                      </tr>
                      <tr>
                        <th> completion Date:</th>
                        <td>{{ dateFormatter(particularRequest.date_of_completion) }}</td>
                      </tr>
                      <tr>
                        <th> Service status:</th>
                        <td>{{ particularRequest.service_name }}</td>
                      </tr>
                      <tr>
                        <th> Service status:</th>
                        <td>{{ particularRequest.service_status }}</td>
                      </tr>
                      <tr>
                        <th> Remarks:</th>
                        <td>{{ particularRequest.remarks }}</td>
                      </tr>
                      <tr>
                        <th> Ratings:</th>
                        <td>{{ particularRequest.rating }}</td>
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
      <div v-if="$store.state.role === 'customer'" class="modal fade" id="close-form" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Close Request</h1>
                    
                </div>
                <div class="modal-body">
                  <form @submit.prevent="closeForm" >
                    <div class="mb-3">
                    <label for="service-id" class="form-label">Service ID:</label>
                    <input type="number" class="form-control" v-model="particularRequest.id"  id="service-id" readonly  required>
                    </div>
                    <div class="mb-3">
                    <label>Rating:</label>
                    <Rating @rating=updatedRating :initialRating=rating />
                    </div>
                    <button type="submit" class="btn btn-primary me-1" data-bs-dismiss="modal">Submit</button>
                  </form>
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

  components: {
    Rating,
  },

  data() {
    return {
      particularRequest: {},
      rating: 0,
      remarks: "",
    };
  },

  methods: {
    setParticularRequest(service_request) {
      this.particularRequest = service_request;
    },
    updatedRating(rating) {
      this.rating = rating;
    },
    dateFormatter(datetime) {
      return new Date(datetime).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },
    async closeForm() {
      const data = {
        rating: this.rating,
        service_status: "closed",
      };
      this.rating = 0;
      console.log(data);
      try {
        const res = await fetch(
          location.origin +
            `/api/service_requests/${this.particularRequest.id}`,
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
          this.$emit("refreshRequest");
        } else {
          const errorData = await res.json();
          console.error("failed to add", errorData);
        }
      } catch (error) {
        console.error("Request failed", error);
      }
    },
    async deleteRequest(id) {
      try {
        const res = await fetch(
          location.origin + "/api/service_requests/" + id,
          {
            method: "DELETE",
            headers: {
              Auth: this.$store.state.auth_token,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          console.log(data);
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
      this.particularRequest.service_status = "";
      try {
        const res = await fetch(
          location.origin +
            `/api/service_requests/${this.particularRequest.id}`,
          {
            method: "PUT",
            headers: {
              Auth: this.$store.state.auth_token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.particularRequest),
          }
        );
        if (res.ok) {
          const responseData = await res.json();
          console.log(responseData);
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
    async updateServiceStatus(id, status) {
      const data = {
        service_status: status,
      };
      if (this.$store.state.role === "professional") {
        data["professional_id"] = this.$store.state.user_id;
        console.log(data);
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
          console.log(responseData);
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
        service_status: "close",
      };
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
          console.log(responseData);
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
