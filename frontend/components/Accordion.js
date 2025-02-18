export default {
  template: `
    
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

            </div>
            </div>
        </div>
    </div>
    
    `,
  methods: {
    async getService() {},
  },
};
