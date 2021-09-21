import axios from "axios";
import store from "@/store";

export default new (class {
  async getBusList() {
    if (((new Date() - store.state.lastUpd.busList) / 1000 / 60 / 60 / 24) > 7) {
      let busList = (await axios.get(process.env.VUE_APP_routesUrl)).data.data;
      store.commit("setBusList", busList);
      store.commit("setLastUpdBusList", new Date());
    }
  }

  async getStopsList() {
    if (((new Date() - store.state.lastUpd.stopsList) / 1000 / 60 / 60 / 24) > 7) {
      let stopNameList = (await axios.get(process.env.VUE_APP_stopsUrl)).data.data;

      let busList = {};
      (await axios.get(process.env.VUE_APP_mappingsUrl)).data.data.forEach(e => {
          if(busList[e.route] == null) busList[e.route] = {}
          if(busList[e.route][e.bound] == null) busList[e.route][e.bound] = {}
          if(busList[e.route][e.bound][e.service_type] == null) busList[e.route][e.bound][e.service_type] = []
          e.name_tc = stopNameList.find(k=>k.stop==e.stop).name_tc
          busList[e.route][e.bound][e.service_type].push(e)
      });

      store.commit("setStopsList", busList);
      store.commit("setLastUpdStopsList", new Date());
    }
  }

  async getETA(e){
    let data = (await axios.get(process.env.VUE_APP_ETA+`${e.stop}/${e.route}/${e.service_type}`)).data.data
    console.log(data)
    return data
  }

})();
