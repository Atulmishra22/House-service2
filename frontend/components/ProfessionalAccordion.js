export default {
  props: ["professionals"],
  template: `
        <div>
        <div class="prof-accordion">
        
        <div class="accordion">
            <div class="accordion-item">
                <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#professional">
                    <div class="container row">
                        <h4 class="col text-center">ID</h4>
                        <h4 class="col text-center">Professional name</h4>
                        <h4 class="col text-center">Service</h4>
                        <h4 class="col text-center">Phone</h4>
                        <h4 class="col text-center">Pincode</h4>
                        <h4 class="col text-center">Action</h4>
                    </div>
                </button>
                </h2>
                <div id="professional" class="accordion-collapse collapse show">
                <div v-if="professionals.length === 0" class="accordion-body">
                    <h4>No Data Available</h4>
                </div>
                <div v-else class="accordion-body">
                      <div v-for="professional in professionals" :key="professional.id" class="conatiner row border border-primary p-1 lead rounded mb-1">
                        <div class="col text-center">
                            <button data-bs-toggle="modal" data-bs-target="#professionalDetail" class="fw-bold btn btn-outline-info" :value="professional.id" @click="showProfessionalDetails(professional)" >{{professional.id}}</button>
                        </div>
                        <div class="col text-center">
                            <p >{{professional.name}}</p>
                        </div>
                        <div class="col text-center" :key="professional.service_id">
                            <p >{{professional.service_name}}</p>
                        </div>
                        <div class="col text-center">
                            <p >{{professional.phone}}</p>
                        </div>
                        <div class="col text-center">
                        <div class="col">
                            <p >{{professional.pincode}}</p>
                        </div>
                        </div>
                        <div class="col-2">
                          <button v-if="professional.status ==='approved'" @click="professionalStatus(professional.id,'blocked')" class="btn btn-danger me-1"> Block</button>
                          <button v-if="professional.status ==='pending'" @click="professionalStatus(professional.id,'approved')" class="btn btn-primary m-1"> Approve </button>
                          <button v-if="professional.status ==='pending'" @click="professionalStatus(professional.id,'rejected')" class="btn btn-danger m-1"> Reject </button>
                          <button v-if="professional.status ==='blocked' || professional.status ==='rejected'" @click="deleteProfessional(professional.id)" class="btn btn-danger m-1"><i class="fa-solid fa-trash"></i> Delete</button>
                          <button v-if="professional.status ==='blocked' || professional.status ==='rejected'" @click="professionalStatus(professional.id,'approved')" class="btn btn-warning">Unblock</button>
                        </div>
                        
                      </div>
                </div>
                </div>
            </div>
            <div class="modal fade" id="professionalDetail" tabindex="-1" >
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Professional Detail</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="card shadow">
                      <div class="card-header text-center">
                        {{selectedProfessional.name}}
                      </div>
                      <div class="card-body">
                      <table class="table border border-primary">
                      <tbody>
                        <tr>
                          <th> professional ID:</th>
                          <td>{{ selectedProfessional.id }}</td>
                        </tr>
                        <tr>
                          <th> Email:</th>
                          <td>{{ selectedProfessional.email }}</td>
                        </tr>
                        <tr>
                          <th> Phone:</th>
                          <td>{{ selectedProfessional.phone}}</td>
                        </tr>
                        <tr>
                          <th> File name:</th>
                          <td>{{ selectedProfessional.file_name}}</td>
                        </tr>
                        <tr>
                          <th> Service:</th>
                          <td>{{ selectedProfessional.service_name}}</td>
                        </tr>
                        <tr>
                          <th> Address:</th>
                          <td>{{ selectedProfessional.address }}</td>
                        </tr>
                        <tr>
                          <th> Pincode:</th>
                          <td>{{ selectedProfessional.pincode }}</td>
                        </tr>
                        <tr>
                          <th> Date Created:</th>
                          <td>{{ selectedProfessional.date_created }}</td>
                        </tr>
                        <tr>
                          <th> status:</th>
                          <td>{{ selectedProfessional.status }}</td>
                        </tr>
                        <tr>
                          <th> Active:</th>
                          <td>{{ selectedProfessional.active }}</td>
                        </tr>
                      </tbody>
                      </table>
                      <div class="row">
                        <embed :src="file_url" height="250" type="application/pdf">
                        
                      </div>
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
      selectedProfessional: {},

      file_url: "",
    };
  },

  methods: {
    showProfessionalDetails(professional) {
      this.selectedProfessional = professional;
      this.professionalPdf(professional.file_name);
      
    },

    async professionalPdf(filename) {
      try {
        const res = await fetch(location.origin + `/api/verification/${filename}`, {
          headers: {
            Auth: this.$store.state.auth_token,
          },
        });
        if (res.ok) {
          const blob = await res.blob();
          this.file_url = URL.createObjectURL(blob);
          
        } else {
          const data = await res.json();
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async deleteProfessional(id) {
      try {
        const res = await fetch(location.origin + "/api/professionals/" + id, {
          method: "DELETE",
          headers: {
            Auth: this.$store.state.auth_token,
          },
        });
        if (res.ok) {
          const ser_data = await res.json();
          this.$emit("showAlert", ser_data.message);
          this.$emit("professionalDeleted");
        } else {
          const ser_data = await res.json();
          console.log(ser_data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async professionalStatus(id, status) {
      const data = {
        status: status,
      };
      if(status === 'approved'){
        data['active'] = 1;
      }else if (['rejected','blocked'].includes(status)){
        data['active'] = 0;
      }
      try {
        const res = await fetch(
          location.origin + `/api/professionals/status/${id}`,
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
          this.$emit("refreshProfessional");
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
