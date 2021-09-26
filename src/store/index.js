// the state for everywhere
// you can call it by this.$store on .vue file without import it
// ex. this.$store.busList
// you can call it in .js file too! by import store from "@/store"
// ex. store.busList

// import the createStore
import { createStore } from "vuex";
// import the plugin for saving the store to localStorage! VERY GOOD
// import createPersistedState from "vuex-persistedstate";
import localforage from "localforage";

const store = createStore({
  // the state
  state: {
    lang: "zhHK",
    timerSwitch: true,
    darkMode: true,

    busList: [],
    stopsList: [],

    lastUpd: {
      busList: null,
      stopsList: null,
    },

    selected: [],
  },
  // you can implement some function to help you set the state
  // call it using
  // ex. this.$store.commit("setBusList") or store.commit("setBusList")
  // or you can also just set it normally
  // ex. this.$store.busList = "abc" or store.busList = "abc"
  mutations: {
    setLang(state, val) {
      state.lang = val;
    },
    setTimerSwitch(state, val) {
      state.timerSwitch = val;
    },
    invertDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    setBusList(state, val) {
      state.busList = val;
    },
    setStopsList(state, val) {
      state.stopsList = val;
    },
    setLastUpdBusList(state, val) {
      state.lastUpd.busList = val;
    },
    setLastUpdStopsList(state, val) {
      state.lastUpd.stopsList = val;
    },

    addSelected(state, val) {
      if (
        state.selected.find(
          (e) =>
            e.routeStop.route == val.routeStop.route &&
            e.routeStop.bound == val.routeStop.bound &&
            e.routeStop.service_type == val.routeStop.service_type &&
            e.routeStop.seq == val.routeStop.seq
        ) == null
      ) {
        state.selected.push(JSON.parse(JSON.stringify(val)));
      }
    },
    removeSelected(state, val) {
      state.selected = state.selected.filter(
        (e) =>
          !(
            e.routeStop.route == val.route &&
            e.routeStop.bound == val.bound &&
            e.routeStop.service_type == val.service_type &&
            e.routeStop.seq == val.seq
          )
      );
    },
  },
});

store.watch(
  (state) => state,
  () => {
    localforage.setItem("state", JSON.parse(JSON.stringify(store.state)));
  },
  {
    deep: true, //add this if u need to watch object properties change etc.
  }
);

export default store;
