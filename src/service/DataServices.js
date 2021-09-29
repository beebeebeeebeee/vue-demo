// me define a class for calling the API
// just normal js

import axios from "axios";
// import the store because I want to set the data to state and localstorage
import store from "@/store";

import { path, merge } from "./Utils";

export default new (class {
  direction = {
    I: "inbound",
    O: "outbound",
  };

  timeout = 7 * 1000 * 60 * 60 * 24;

  async getBusList() {
    // check if the data outdated
    if (new Date() - store.state.lastUpd.busList > this.timeout) {
      let kmb = (await axios.get(process.env.VUE_APP_ROUTES_KMB)).data.data.map(
        (e) => {
          e.co = "KMB";
          return e;
        }
      );
      let nwfbOut = (
        await axios.get(process.env.VUE_APP_ROUTES_NWFB)
      ).data.data.map((e) => {
        e.bound = "O";
        return e;
      });
      let nwfbIn = JSON.parse(JSON.stringify(nwfbOut)).map((e) => {
        e.bound = "I";
        ["en", "sc", "tc"].forEach((ln) => {
          let tem = e["dest_" + ln];
          e["dest_" + ln] = e["orig_" + ln];
          e["orig_" + ln] = tem;
        });
        return e;
      });
      let ctbOut = (
        await axios.get(process.env.VUE_APP_ROUTES_CTB)
      ).data.data.map((e) => {
        e.bound = "O";
        return e;
      });
      let ctbIn = JSON.parse(JSON.stringify(ctbOut)).map((e) => {
        e.bound = "I";
        ["en", "sc", "tc"].forEach((ln) => {
          let tem = e["dest_" + ln];
          e["dest_" + ln] = e["orig_" + ln];
          e["orig_" + ln] = tem;
        });
        return e;
      });

      // set the data to state
      store.commit("setBusList", {
        kmb,
        nwfb: merge(nwfbIn, nwfbOut),
        ctb: merge(ctbIn, ctbOut),
      });
      store.commit("setLastUpdBusList", new Date());
    }
  }

  async getStopsList() {
    // check if the data outdated
    if (new Date() - store.state.lastUpd.stopsList > this.timeout) {
      let stopNameList = (await axios.get(process.env.VUE_APP_STOPS_KMB)).data
        .data;

      let busList = {};
      (await axios.get(process.env.VUE_APP_NAME_KMB)).data.data.forEach((e) => {
        path(busList, [], e.route, e.bound, e.service_type);
        ["name_tc", "name_sc", "name_en"].forEach((ln) => {
          e[ln] = stopNameList.find((k) => k.stop == e.stop)[ln];
        });
        busList[e.route][e.bound][e.service_type].push(e);
      });

      // set the data to state
      store.commit("setStopsList", { kmb: busList, nwfb: [], ctb: [] });
      store.commit("setLastUpdStopsList", new Date());
    }
    return null
  }

  async getSingleStopsList(route) {
    let routeStop = (
      await axios.get(
        process.env["VUE_APP_STOP_" + route.co] +
          route.route +
          "/" +
          this.direction[route.bound]
      )
    ).data.data;

    routeStop = await Promise.all(
      routeStop.map(async (e) => {
        let name = (
          await axios.get(process.env["VUE_APP_NAME_" + route.co] + e.stop)
        ).data.data;
        console.log(name);
        ["name_tc", "name_sc", "name_en"].forEach((ln) => {
          e[ln] = name[ln];
        });
        return e;
      })
    );

    // set the data to state
    let stateList = store.state.stopList[route.co.toLocaleLowerCase()];
    if (stateList[route.route] == null) stateList[route.route] = {};
    if (stateList[route.route][route.bound] == null)
      stateList[route.route][route.bound] = {};
    if (stateList[route.route][route.bound][route.service_type] == null)
      stateList[route.route][route.bound][route.service_type] = routeStop;
    store.state.stopList[route.co.toLocaleLowerCase()] = stateList;
    store.commit("setLastUpdStopsList", new Date());

    return routeStop;
  }

  async getETA(e) {
    let data = (
      await axios.get(
        process.env.VUE_APP_ETA_KMB + `${e.stop}/${e.route}/${e.service_type}`
      )
    ).data.data;
    return data.map((e) => {
      let time = new Date(e.eta).getTime();
      let left = time - new Date();
      let message = left < 0 ? -1 : left < 60000 ? 1 : 0;
      return {
        time,
        left,
        message,
      };
    });
  }
})();
