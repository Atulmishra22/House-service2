
export default {
  template: `
    <div>
    <div class="service">
    
    <div class="accordion">
        <div class="accordion-item">
            <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#services">
                <div class="container row">
                    <h4 class="col text-center">ID</h4>
                    <h4 class="col text-center">Service name</h4>
                    <h4 class="col text-center">Base price</h4>
                    <h4 class="col text-center">Action</h4>
                </div>
            </button>
            </h2>
            <div id="services" class="accordion-collapse collapse show">
            <div class="accordion-body">
                  <div v-for="service in services" :key="service.id" class="conatiner row border border-primary p-1 lead rounded mb-1">
                    <div class="col text-center">
                        <button data-bs-toggle="modal" data-bs-target="#serviceDetail" class="fw-bold btn btn-outline-info" :value="service.id" @click="showServiceDetails(service)" >{{service.id}}</button>
                    </div>
                    <div class="col text-center">
                        <p >{{service.name}}</p>
                    </div>
                    <div class="col text-center">
                        <p >{{service.price}}</p>
                    </div>
                    <div class="col text-center">
                        <button  class="btn btn-secondary m-1"><i class="fa-solid fa-pen-to-square me-1"></i>Modify</button>
                        <button @click="deleteService(service.id)" class="btn btn-danger"><i class="fa-solid fa-trash me-1"></i>Delete</button>
                    </div>
                  </div>
            </div>
            </div>
        </div>
        <div class="modal fade" id="serviceDetail" tabindex="-1" >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Service Detail</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="card shadow">
                  <div class="card-header text-center">
                    {{selectedService.name}}
                  </div>
                  <div class="card-body">
                  <table class="table border border-primary">
                  <tbody>
                    <tr>
                      <th> service ID:</th>
                      <td>{{ selectedService.id }}</td>
                    </tr>
                    <tr>
                      <th> Price:</th>
                      <td>{{ selectedService.price }}</td>
                    </tr>
                    <tr>
                      <th> description:</th>
                      <td>{{ selectedService.description }}</td>
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
  props :['services'],
  data() {
    return {
      selectedService:{},
    };
  },
  methods: {
    showServiceDetails(service){
      this.selectedService = service;

    },
    async deleteService(id) {
      try {
        const res = await fetch(location.origin + "/api/services/"+ id ,{
          method: "DELETE",
          headers: {
            Auth: this.$store.state.auth_token,
          },
          
        });
        if (res.ok) {
          const ser_data = await res.json();
          this.$emit('showAlert',ser_data.message);
          this.$emit('serviceDeleted', id );
          
        }else{
          const ser_data = await res.json();
          console.log(ser_data)
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
