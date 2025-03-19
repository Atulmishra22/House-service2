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
  props:['initialRating'],
  data(){
    return{
        rating: this.initialRating,      
        totalStars: 5,  
    }
  },
  watch:{
    initialRating(newVal){
      this.rating = newVal
    },
  },
  methods:{
    setRating(star) {
        this.rating = star;
        this.$emit("rating",this.rating);
    },
  }
}