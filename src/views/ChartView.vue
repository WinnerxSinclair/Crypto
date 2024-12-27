<script setup>
import { ref, onMounted } from 'vue';
import { fetchCryptoData, fetchCoin } from '../api';

let props = defineProps({
  crypto: String
})
const chartOptions = ref(null);
const chartSeries = ref(null);
const metaData = ref(null);
const highlighted = ref('1d');
function formatter(num){
  if(num > 1000) return 0;
  if(num >= 1) return 2;
  if(num >= .1) return 3;
  if(num >= .01) return 4;
  if(num >= .001) return 5;
  if(num >= .0001){
    return 6;
  }else{
    return 10;
  }

}
const loadCryptoData = async (timeFrame = '1d') => {
  try {
    const data = await fetchCryptoData(props.crypto, timeFrame);
    highlighted.value = timeFrame;
    // Map raw data points (timestamp and price)
    const chartData = data.prices.map(([time, price]) => ({
      x: new Date(time), // Full date object
      y: price, // Price value
    }));

    // Prepare options
    chartOptions.value = {
      chart: {
        id: 'crypto-chart',
        toolbar: { show: false },
          
      },
      grid: {
    padding: {
      left: 18,
      right: 0,
      top: 0,
      bottom: 0,
    },
  },
      yaxis: {
        opposite: true,
        labels: {
          formatter: (val) => `$${val}`,
        },
        
        tickAmount: 6, 
      },
      xaxis: {
        type: 'datetime', // Handle x-axis as time
        labels: {
          formatter: (val) => {
            const date = new Date(val);
            return date.toLocaleDateString(undefined, {
              
              day: 'numeric',
              month: 'short',
            });
          },
        },
        
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0
      },
      stroke: {
            width: 2
          },
      tooltip: {
        x: {
          formatter: (val) => {
            const date = new Date(val);
            return date.toLocaleString(undefined, {
              
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });
          },
        },
        y: {
          formatter: (val) => {
            return `$${val.toFixed(formatter(val))}`
          }
        }
      },
    };

    // Assign series
    chartSeries.value = [
      {
        name: 'Price',
        data: chartData,
      },
    ];
  } catch (err) {
    console.error(err);
  }
};

const getCoinData = async () => {
  try{
    const otherData = await fetchCoin(props.crypto);
    metaData.value = otherData;
  }catch(err){
    console.log(err);
  }  
}
onMounted(() => {
  loadCryptoData();
  getCoinData();
});
</script>

<template>
  <br>
  <div class="flex wrap gap m-center main-mw mt">
    <div v-if="metaData" class="info-container">
      <div class="flex">
        <img :src="metaData[0].image" alt="">
        <div class="name">{{ metaData[0].name }}<span class="symbol">{{ metaData[0].symbol.toUpperCase() }}</span></div>
        
        <p>#{{ metaData[0].market_cap_rank }}</p>
      </div>
      <div class="flex-c-c gap">
        <div class="price">${{ metaData[0].current_price.toLocaleString('en-US', {
      minimumFractionDigits: 0, maximumFractionDigits: 20
    }) }}</div>
        <div :class="[metaData[0].price_change_percentage_24h > 0 ? 'daily-green' : 'daily-red']"
        >{{ metaData[0].price_change_percentage_24h.toFixed(1) }}%
        </div>
      </div>
      <ul class="flex col gap-half mt">
        <li class="flex sb">
          <div>Market Cap</div>
          <div>${{ metaData[0].market_cap.toLocaleString() }}</div>
        </li>
        <hr>
        <li class="flex sb">
          <div>FDV</div>
          <div>${{ metaData[0].fully_diluted_valuation.toLocaleString() }}</div>
        </li>
        <hr>
        <li class="flex sb">
          <div>24hr Trading Vol.</div>
          <div>${{ metaData[0].total_volume.toLocaleString() }}</div>
        </li>
        <hr>
        <li class="flex sb">
          <div>Circulating Supply</div>
          <div>{{ metaData[0].circulating_supply.toLocaleString() }}</div>
        </li>
        <hr>
        <li class="flex sb">
          <div>Max Supply</div>
          <div>{{ metaData[0].max_supply?.toLocaleString() || '∞' }}</div>
        </li>
      </ul>
    </div>
    <div class="xd">
      <div>
        <button :class="{bg: highlighted == '1d'}" @click="loadCryptoData('1d')">24h</button>
        <button :class="{bg: highlighted == '1w'}" @click="loadCryptoData('1w')">7d</button>
        <button :class="{bg: highlighted == '1m'}" @click="loadCryptoData('1m')">1m</button>
        <button :class="{bg: highlighted == '1y'}" @click="loadCryptoData('1y')">1y</button>
      </div>
      <apexchart class="chart"
        v-if="chartOptions && chartSeries"
        type="area"
        :options="chartOptions"
        :series="chartSeries"
        height="500"
        
      ></apexchart>
    </div>
  </div>
</template>

<style scoped>
.bg{
  background:rgb(233, 255, 180);
}
.info-container{
  width: 350px;
}
.xd{
  flex-grow:1;
  min-width: 675px;
  max-width: 1000px;
}
.chart{
  width:100%;
}
img{
  width: 30px;
  height: 30px;
}
.name{
  margin-left: .5rem;
  font-size:1.1rem;
}
p{
  margin-left:.3rem;
  font-size:15px;
}
.price{
  font-size:2.2rem;
  font-weight: 600;
}
.daily-green{
  color:green;
}
.daily-green::before{
  content: "";
  display: inline-block;
  width:10px;
  height:10px;
  background: green;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  margin-bottom: 2px;
  margin-right:2px;
}
.daily-red{
  color:red;
}
.daily-red::before{
  content: "";
  display: inline-block;
  width:10px;
  height:10px;
  background: red;
  clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
  margin-right:2px;
}
@media(max-width: 675px){
  .xd{
    min-width: 350px;
  }
}
</style>