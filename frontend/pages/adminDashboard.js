import Accordion from "../components/Accordion.js"
import AddService from "../components/AddService.js"
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
                            <AddService />
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
        <div class="container mt-4">
            <Accordion />
        </div>
        
        
    </div>

    `,
    components: { Accordion, AddService },
}