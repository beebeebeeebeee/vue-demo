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
    version: "1A07",

    lang: "zhHK",
    timerSwitch: true,
    darkMode: true,

    busList: {},
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
            e.routeStop[0].route == val.routeStop[0].route &&
            e.routeStop[0].bound == val.routeStop[0].bound &&
            e.routeStop[0].service_type == val.routeStop[0].service_type &&
            e.routeStop[0].seq == val.routeStop[0].seq
        ) == null
      ) {
        state.selected.push(JSON.parse(JSON.stringify(val)));
        val.success = true;
      }
    },
    removeSelected(state, index) {
      state.selected.splice(index, 1);
    },
    invertCollapseSelected(state, index){
      state.selected[index].collapse = !state.selected[index].collapse;
    }
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
