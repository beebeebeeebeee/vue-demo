// the state for everywhere 
// you can call it by this.$store on .vue file without import it
// ex. this.$store.busList
// you can call it in .js file too! by import store from "@/store"
// ex. store.busList

// import the createStore
import { createStore } from "vuex";
// import the plugin for saving the store to localStorage! VERY GOOD
import createPersistedState from "vuex-persistedstate";

export default createStore({
  // the state
  state: {
    busList: [],
    stopsList: [],

    lastUpd: {
      busList: null,
      stopsList: null
    },

    selected: []
  },
  // you can implement some function to help you set the state
  // call it using 
  // ex. this.$store.commit("setBusList") or store.commit("setBusList")
  // or you can also just set it normally 
  // ex. this.$store.busList = "abc" or store.busList = "abc"
  mutations: {
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

    addSelected(state, val){
      if(state.selected.find(e=>e.routeStop.route == val.routeStop.route && e.routeStop.bound == val.routeStop.bound && e.routeStop.service_type == val.routeStop.service_type && e.routeStop.seq == val.routeStop.seq) == null){
        state.selected.push(JSON.parse(JSON.stringify((val))))
      }
    },
    removeSelected(state, val){
      state.selected = state.selected.filter(e=>!(e.routeStop.route == val.route && e.routeStop.bound == val.bound && e.routeStop.service_type == val.service_type && e.routeStop.seq == val.seq))
    }
  },
  // use the localStorage good good plugin
  plugins: [
    createPersistedState({
      key: "localStorage",
      storage: window.localStorage,
    }),
  ],
});
