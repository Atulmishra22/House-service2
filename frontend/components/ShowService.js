export default{
    props: ['services'],
    template:`
    <div v-for="service in services" :key="service.id" class="conatiner row border border-primary p-1 lead rounded mb-1">
        <div class="col text-center">
            <a href="/" class="fw-bold btn btn-outline-info" :value="service.id" >{{service.id}}</a>
        </div>
        <div class="col text-center">
            <p >{{service.name}}</p>
        </div>
        <div class="col text-center">
            <p >{{service.price}}</p>
        </div>
        <div class="col text-center">
            <a href="" class="btn btn-secondary me-2">Modify</a>
            <a href="" class="btn btn-danger"><i class="fa-solid fa-trash me-1"></i>Delete</a>
        </div>
    </div>
    
    `,
    methods:{
        
    }
}