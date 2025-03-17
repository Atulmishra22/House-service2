export default{
    template:`
    <div class="summary-container p-4">
      <h2 class="mb-4">Performance Summary</h2>
      
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div v-else class="row">
        <!-- Professional Rating Chart -->
        <div v-if="this.$store.state.role === 'professional'" class="col-md-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-light">
              <h5 class="card-title mb-0">Your Rating</h5>
            </div>
            <div class="card-body">
              <div style="position: relative; height: 250px;">
                <canvas ref="ratingChart" id="ratingChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
            <div class="card-header bg-light">
            <h5 class="card-title mb-0">Service Request Summary</h5>
            </div>
            <div class="card-body">
            <div style="position: relative; height: 250px;">
                <canvas ref="serviceRequestChart" id="serviceRequestChart"></canvas>
            </div>
            </div>
        </div>
        </div>

        <div v-if="this.$store.state.role === 'admin'" class="col-md-6 mb-4">
        <div class="card shadow-sm">
            <div class="card-header bg-light">
            <h5 class="card-title mb-0">User Summary</h5>
            </div>
            <div class="card-body">
            <div style="position: relative; height: 250px;">
                <canvas ref="userChart" id="userChart"></canvas>
            </div>
            </div>
        </div>
        </div>
        
        
    </div>
    </div>
    `,
    data(){

        return{
            isLoading: true,
            charts: {
                ratingChart:null,
                serviceRequestChart: null,
                customerServiceRequestChart:null,
              },
            userDetail:'',
            userCount:'',
            
            
        }
    },
    computed:{
        userRole(){
            return this.$store.state.role
        }
    },
    mounted(){
        this.fetchData();
    },
    updated() {
        if (!this.isLoading && this.userRole === 'professional' ) {
            this.$nextTick(() => {
                this.renderRatingChart();
                this.renderBarChart(
                  "serviceRequestChart",
                  ['Requested','Accepted','Rejected','Canceled','Closed'],
                  [
                    this.userDetail.requested ||0,
                    this.userDetail.accepted||0,
                    this.userDetail.rejected||0,
                    this.userDetail.canceled||0,
                    this.userDetail.closed||0
                  ],
                  "Service Requests"
              );
                
            });
        }
        else if (!this.isLoading && this.userRole === 'customer') {
            this.$nextTick(() => {
              this.renderBarChart(
                "serviceRequestChart",
                ['Requested','Accepted','Rejected','Canceled','Closed'],
                [
                  this.userDetail.requested ||0,
                  this.userDetail.accepted||0,
                  this.userDetail.rejected||0,
                  this.userDetail.canceled||0,
                  this.userDetail.closed||0
                ],
                "Service Requests"
            );

            });
        }
        else if (!this.isLoading && this.userRole === 'admin') {
          this.$nextTick(() => {
            this.renderBarChart(
              "serviceRequestChart",
              ['Requested','Accepted','Rejected','Canceled','Closed'],
              [
                this.userDetail.requested ||0,
                this.userDetail.accepted||0,
                this.userDetail.rejected||0,
                this.userDetail.canceled||0,
                this.userDetail.closed||0
              ],
              "Service Requests"
            );
            this.renderBarChart(
              "userChart", 
              ["Professionals","Customers"],
              [this.userCount.professionals,this.userCount.customers],
              "User Statistics"
          );


          });
      }
       
    },
    methods:{
        async fetchData() {
            try {
              switch (this.$store.state.role) {
                case 'professional':
                  await this.fetchServiceRequestDetail();
                  break;
                case 'customer':
                  await this.fetchServiceRequestDetail();
                  break;
                case 'admin':
                  await this.fetchAdminStats();
                  break;
              }
            } catch (error) {
              console.log("Error fetching data:", error);
            } finally {
              this.isLoading = false;
            }
          },
          async fetchServiceRequestDetail() {
            
            const res = await fetch(
            location.origin + `/api/user/${this.$store.state.user_id}/service-request/stats`,
            {
                headers: {
                Auth: this.$store.state.auth_token,
                },
            }
            );
            if (res.ok) {
            const data = await res.json();
            this.userDetail = data;
            
            }
            
          },
          async fetchAdminStats(){
            const res = await fetch(
              location.origin + "/api/admin-summary",
              {
                  headers: {
                  Auth: this.$store.state.auth_token,
                  },
              }
              );
            if (res.ok){
              const data = await res.json()
              this.userDetail = data.service_request_stats
              this.userCount = data.user_counts
            }
          },
          
          renderRatingChart() {
            if (!this.$refs.ratingChart) return;

            const ctx = this.$refs.ratingChart.getContext('2d');
            const rating = this.userDetail.rating || 0;
            const remainingRating = 5 - rating;
            
            // Destroy existing chart if it exists
            if (this.charts.ratingChart) {
              this.charts.ratingChart.destroy();
            }
            
            this.charts.ratingChart = new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: ['Rating', 'Remaining'],
                datasets: [{
                  data: [rating, remainingRating],
                  backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(211, 211, 211, 0.3)'
                  ],
                  borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(211, 211, 211, 0.5)'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return context.label === 'Rating' ? 
                          `Rating: ${rating.toFixed(1)} out of 5` : '';
                      }
                    }
                  }
                }
              }
            });
            
            // Add center text with rating
            Chart.register({
              id: 'centerText',
              beforeDraw: function(chart) {
                if (chart.config.type !== 'doughnut') return;
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                
                ctx.restore();
                const fontSize = (height / 114).toFixed(2);
                ctx.font = fontSize + "em sans-serif";
                ctx.textBaseline = "middle";
                
                const text = `${rating.toFixed(1)}/5`;
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2;
                
                ctx.fillText(text, textX, textY);
                ctx.save();
              }
            });
          },
          renderBarChart(chartRef, labels, data, chartTitle) {
            if (!this.$refs[chartRef]) {
              console.warn(`Canvas ref '${chartRef}' not found.`);
              return;
            }
          
            const ctx = this.$refs[chartRef].getContext('2d');
          
            if (this.charts[chartRef]) {
              this.charts[chartRef].destroy();
            }
          
            this.charts[chartRef] = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [{
                  label: chartTitle,
                  data: data,
                  backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                  ],
                  borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255,1)'
                  ],
                  borderWidth:1
                }]
              },
              options:{
                responsive:true,
                maintainAspectRatio:false,
                plugins:{
                  legend:{display:false},
                  title:{display:true,text: chartTitle},
                },
                scales:{
                  y:{
                    beginAtZero:true,
                    ticks:{
                      precision:0,
                      callback:(value)=>Number.isInteger(value)?value:null
                    }
                  }
                }
              }
            });
          },
          
          
          

    }
}