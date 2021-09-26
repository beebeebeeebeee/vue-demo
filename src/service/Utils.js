// me define some fn for normal use
// this is normal js

// import the store because I want to set the data to state and localstorage
import store from "@/store";

//const
const lang = {
  zhHK: "tc",
  enUS: "en",
};

//functions
export const formatLeft = (eta) => {
  eta = eta / 1000 / 60;
  let mm = Math.floor(eta);
  let ss = `${Math.floor((eta - mm) * 60)}`.padStart(2, "0");
  return `${mm}:${ss}`;
};

export const formatTime = (time) => {
  time = new Date(time);
  let hh = `${time.getHours()}`.padStart(2, "0");
  let mm = `${time.getMinutes()}`.padStart(2, "0");
  let ss = `${time.getSeconds()}`.padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

export const getBusList = () => {
  return store.state.busList.map((e) => {
    e.label = `${e.route} ${e["orig_" + lang[store.state.lang]]}>${
      e["dest_" + lang[store.state.lang]]
    }`;
    return {
      value: e,
      label: e.label,
    };
  });
};

export const getStopsList = (route) => {
  return store.state.stopsList[route.route][route.bound][
    route.service_type
  ].map((e) => {
    e.label = `${e.seq}. ${e["name_" + lang[store.state.lang]]}`;
    return {
      value: e,
      label: e.label,
    };
  });
};

import localforage from "localforage";
export const getLocalForage =  async () => {
  const state = await localforage.getItem("state");
  state
    ? store.replaceState(state)
    : localforage.setItem("state", JSON.parse(JSON.stringify(store.state)));
}