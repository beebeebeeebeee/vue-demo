// me define a class for calling the API
// just normal js

import axios from "axios";
// import the store because I want to set the data to state and localstorage
import store from "@/store";

export default new (class {
  async getBusList() {
    // check if the data outdated
    if (((new Date() - store.state.lastUpd.busList) / 1000 / 60 / 60 / 24) > 7) {
      let busList = (await axios.get(process.env.VUE_APP_ROUTES_KMB)).data.data;
      
      // set the data to state
      store.commit("setBusList", busList);
      store.commit("setLastUpdBusList", new Date());
    }
  }

  async getStopsList() {
    // check if the data outdated
    if (((new Date() - store.state.lastUpd.stopsList) / 1000 / 60 / 60 / 24) > 7) {
      let stopNameList = (await axios.get(process.env.VUE_APP_STOPS_KMB)).data.data;

      let busList = {};
      (await axios.get(process.env.VUE_APP_NAME_KMB)).data.data.forEach(e => {
        if (busList[e.route] == null) busList[e.route] = {}
        if (busList[e.route][e.bound] == null) busList[e.route][e.bound] = {}
        if (busList[e.route][e.bound][e.service_type] == null) busList[e.route][e.bound][e.service_type] = []
        e.name_tc = stopNameList.find(k => k.stop == e.stop).name_tc
        e.name_en = stopNameList.find(k => k.stop == e.stop).name_en
        busList[e.route][e.bound][e.service_type].push(e)
      });

      // set the data to state
      store.commit("setStopsList", busList);
      store.commit("setLastUpdStopsList", new Date());
    }
  }

  async getETA(e) {
    let data = (await axios.get(process.env.VUE_APP_ETA_KMB + `${e.stop}/${e.route}/${e.service_type}`)).data.data
    return data.map(e => {
      let time = new Date(e.eta).getTime()
      let left = time - new Date()
      let message = left < 0 ? -1 : left < 60000 ? 1 : 0;
      return {
        time,
        left,
        message
      }
    })
  }

})();
