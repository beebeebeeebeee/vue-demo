import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    busList: [],
    stopsList: [],

    lastUpd: {
      busList: null,
      stopsList: null
    },

    selected: []
  },
  
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
      state.selected = state.selected.filter(e=>!(e.routeStop.route == val.routeStop.route && e.routeStop.bound == val.routeStop.bound && e.routeStop.service_type == val.routeStop.service_type && e.routeStop.seq == val.routeStop.seq))
    }
  },

  plugins: [
    createPersistedState({
      key: "localStorage",
      storage: window.localStorage,
    }),
  ],
});
