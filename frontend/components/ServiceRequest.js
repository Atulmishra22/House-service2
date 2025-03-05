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
                          <p >{{service_request.customer_id}}</p>
                      </div>
                      <div class="col text-center">
                          <p >{{service_request.professional_id}}</p>
                      </div>
                      <div class="col text-center">
                          <p >{{service_request.service_id}}</p>
                      </div>
                      <div class="col text-center">
                          <p >{{service_request.service_status}}</p>
                      </div>
                      
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
                      {{selectedRequest.customer_id}}
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
                        <td>{{ selectedRequest.professional_id }}</td>
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
                        <td>{{ selectedRequest.service_type }}</td>
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
      };
    },
    
    methods: {
      showRequestDetails(service_request){
        this.selectedRequest = service_request;
  
      },
      
    },
  };
  