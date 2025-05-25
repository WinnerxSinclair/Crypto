<script setup>
import { ref, onMounted } from 'vue'
import { fetchList } from '../api'

import router from '../router'
const cryptos = ref([]);
const getInitialData = async () => {
  try {
    const data = await fetchList();
    console.log(data)
    cryptos.value = data;
  } catch (err) {
    console.log(err);
  }
}

onMounted(() => {
  getInitialData();
});

const cur = ref(null);
function showChart(id){
  router.push({ path: `/${id}`})
}

function formatter(num){
  if(num > 1000) return 0;
  if(num >= .4) return 2;
  if(num >= .1) return 3;
  if(num >= .01) return 4;
  if(num >= .001) return 5;
  if(num >= .0001){
    return 6;
  }else{
    return 10;
  }

}
</script>

<template>
  <div class="main-wrap m-center">
    <h2>Top 100 Coins</h2>
    <div class="container " v-for="crypto in cryptos" :key="crypto.id" @click="showChart(crypto.id)">
      <div>{{ crypto.market_cap_rank }}</div>
      <div class="flex-c-c name-data">
        <img :src="crypto.image" alt="image">
        <div class="name">{{ crypto.name }}
          <span class="symbol">{{ crypto.symbol.toUpperCase() }}</span>
        </div>
      </div>
      <div>${{ crypto.current_price.toLocaleString('en-US', {
        minimumFractionDigits: 0, maximumFractionDigits: formatter(crypto.current_price)
      }) }}</div>
    </div>
  </div>
</template>

<style scoped>
.name-data{
  justify-content: flex-start;
}
.name{
  margin-left:.5rem;
}
.main-wrap{
  width: fit-content;
}
.container{
  padding:1rem;
  border-radius: 1rem;
  display:grid;
  grid-template-columns: 50px 250px auto;
  text-align: start;
  cursor:pointer;
  
}
.container:hover{
  background:rgb(212, 212, 212);
}
img{
  width: 30px;
  aspect-ratio: 1;
}
</style>
