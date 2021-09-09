<template>
  <!-- <el-select v-model="formData.route" filterable placeholder="Bus Route">
    <el-option-v2
      v-for="item in busList"
      :key="item.route"
      :label="item.orig_tc+' > '+item.dest_tc"
      :value="item.value"
    >
    </el-option-v2>
  </el-select> -->
   <el-select-v2
    v-model="formData.route"
    filterable
    :options="busList"
    placeholder="Bus Route"
  />
  <el-select v-model="formData.routeStop" filterable placeholder="Route Stop">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
  <el-button type="success">
    Add
  </el-button>
</template>

<script>
import DataServices from "@/service/DataServices.js";

  export default {
    data() {
      return {
        options: [],
        value: '',

        formData: {
          route: "",
          routeStop: "",
        }
      }
    },
    async mounted(){
      DataServices.getBusList()
    },
    computed:{
      busList: {
        get(){
          return this.$store.state.busList.map(e=>{return {
            value: {
              route: e.route,
              service_type: e.service_type,
              bound: e.bound
            },
            label: `${e.route} ${e.orig_tc}>${e.dest_tc}`,
          }});
        }
      }
    }
  }
</script>

<style scoped>
.el-select,
.el-select-v2,
.el-button{
  width: 100%;
}

.el-select,
.el-select-v2{
  margin-bottom: 1rem;
}
</style>