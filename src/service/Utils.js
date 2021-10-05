// me define some fn for normal use
// this is normal js

// import the store because I want to set the data to state and localstorage
import store from "@/store";

import DataServices from "./DataServices";

import i18n from "@/i18n"

//const
export const lang = {
  zhHK: "tc",
  enUS: "en",
};

//functions
export const formatLeft = (eta) => {
  let message = eta < 0 ? `${i18n.global.t('status.2') }` : eta <60000? `${i18n.global.t('status.1') }`: "";
  let sign = eta >= 0 ? "" : "-"
  eta = Math.abs(eta) / 1000 / 60;
  let mm = Math.floor(eta);
  let ss = `${Math.floor((eta - mm) * 60)}`.padStart(2, "0");
  return `${message} ${sign}${mm}:${ss}`;
};

export const formatTime = (time) => {
  time = new Date(time);
  let hh = `${time.getHours()}`.padStart(2, "0");
  let mm = `${time.getMinutes()}`.padStart(2, "0");
  let ss = `${time.getSeconds()}`.padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

export const getBusList = () => {
  return Object.entries(store.state.busList).map(([co, val]) => {
    return {
      type: "group",
      label: co,
      key: co,
      children: val.map((e) => {
        e.label = `[${e.co}] ${e.route} ${
          e["orig_" + lang[store.state.lang]]
        }>${e["dest_" + lang[store.state.lang]]}`;
        return {
          value: e,
          label: e.label,
        };
      }),
    };
  });
};

export const getStopsList = (route) => {
  if(route == null) return []
  let result = [];
  try {
    result =
      store.state.stopsList[route.co.toLocaleLowerCase()][route.route][
        route.bound
      ][route.service_type];
  } catch (e) {
    DataServices.getSingleStopsList(route);
  }
  return result.map((e) => {
    e.label = `${e.seq}. ${e["name_" + lang[store.state.lang]]}`;
    return {
      value: e,
      label: e.label,
    };
  });
};

export const getSameRoute = (route) => {
  let found = [];
  if(route == null) return []
  Object.entries(store.state.busList).forEach(([co, val]) => {
    if (co != route.co.toLocaleLowerCase()) {
      val.forEach((e) => {
        if (e.route == route.route) {
          found.push({ label: e.label, value: e });
        }
      });
    }
  });

  return found;
};

export const path = (main, last, ...object) => {
  let prev = main;
  for (let index in object) {
    let each = object[index];
    if (prev[each] == null) {
      if (index == object.length - 1) {
        prev[each] = last;
      } else {
        prev[each] = {};
      }
    }
    prev = prev[each];
  }
  return main;
};

export const merge = (left, right) => {
  let arr = [];
  while (left.length && right.length) {
    if (left.length >= right.length) {
      arr.push(left.shift());
    } else {
      arr.push(right.shift());
    }
  }
  return [...arr, ...left, ...right];
};

import localforage from "localforage";
export const getLocalForage = async () => {
  const state = await localforage.getItem("state");
  if (state && state.version == store.state.version) {
    store.replaceState(state);
  } else {
    localforage.setItem("state", JSON.parse(JSON.stringify(store.state)));
  }
};
