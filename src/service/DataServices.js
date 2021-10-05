// me define a class for calling the API
// just normal js

import axios from "axios";
// import the store because I want to set the data to state and localstorage
import store from "@/store";

import { path, merge } from "./Utils";
import { default as mtr_routes } from "./additional/mtr_routes.json";
import { default as mtr_route_stops } from "./additional/mtr_route_stops.json";

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
        e.service_type = "1";
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
        e.service_type = "1";
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
        mtr: mtr_routes,
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
        e.co = "KMB";
        busList[e.route][e.bound][e.service_type].push(e);
      });

      // set the data to state
      store.commit("setStopsList", {
        kmb: busList,
        nwfb: {},
        ctb: {},
        mtr: mtr_route_stops,
      });
      store.commit("setLastUpdStopsList", new Date());
    }
    return null;
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
        e.bound = e.dir;
        let name = (
          await axios.get(process.env["VUE_APP_NAME_" + route.co] + e.stop)
        ).data.data;
        ["name_tc", "name_sc", "name_en"].forEach((ln) => {
          e[ln] = name[ln];
        });
        return e;
      })
    );

    // set the data to state
    let stateList = store.state.stopsList[route.co.toLocaleLowerCase()];

    path(stateList, routeStop, route.route, route.bound, route.service_type);
    store.state.stopsList[route.co.toLocaleLowerCase()] = stateList;
    store.commit("setLastUpdStopsList", new Date());

    return routeStop;
  }

  async getETA(e) {
    let api = "";
    switch (e.co) {
      case "KMB":
        api =
          process.env.VUE_APP_ETA_KMB +
          `${e.stop}/${e.route}/${e.service_type}`;
        break;
      case "NWFB":
        api = process.env.VUE_APP_ETA_NWFB + `${e.stop}/${e.route}`;
        break;
      case "CTB":
        api = process.env.VUE_APP_ETA_CTB + `${e.stop}/${e.route}`;
        break;
      case "MTR":
        api = process.env.VUE_APP_ETA_MTR + `line=${e.route}&sta=${e.stop}`;
        break;
    }
    let data = (await axios.get(api)).data.data;
    if (e.co == "MTR") {
      data = Object.entries(data)[0][1][e.bound].map((j) => {
        return { co: e.co, dir: e.bound, eta: j.time.replace(/ /g,"T") };
      });
    }

    return data
      .filter((f) => {
        return f.dir == e.bound;
      })
      .filter((j) => {
        return j.eta != "";
      })
      .map((e) => {
        let time = new Date(e.eta).getTime();
        let left = time - new Date();
        return {
          co: e.co,
          time,
          left,
        };
      })
      .filter((n) => {
        return n.left > -60000 * 5;
      });
  }
})();
