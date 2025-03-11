export default{
    template:`
    <div>
    <span
      v-for="star in totalStars"
      :key="star"
      class="fa fa-star"
      :class="{'text-warning': star <= rating, 'text-muted': star > rating}"
      @click="setRating(star)"
    >
    </span>
    </div>
    
  `,
  data(){
    return{
        rating: 0,      
        totalStars: 5,  
    }
  },
  methods:{
    setRating(star) {
        this.rating = star;
        this.$emit("rating",this.rating);
    },
  }
}