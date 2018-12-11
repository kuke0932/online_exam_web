<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
  export default{
    name: 'APP'
  }
</script>

<style>
  .hidden{
    display: none;
  }
  .container{
    margin: 50px;
  }
  .num_pages input{
    padding:0;
    text-align: center;
    height:30px;
    outline: 0;
  }
  .num_pages span{
    margin: 0 5px;
  }
  .num_pages button{
    margin: 0 20px;
  }
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
  }
  .el-slider__bar{
    background-color: #e4e7ed;
  }
</style>
