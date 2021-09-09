import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    busList: [],
    selected: [],

    lastUpd: {
        busList: null
    }
  },
  mutations: {
    setBusList(state, val) {
      state.busList = val;
    },
    setSelected(state, val) {
        state.selected = val;
      },
      setLastUpdBusList(state, val) {
        state.lastUpd.busList = val;
      },
  },
  plugins: [
    createPersistedState({
        key: "localStorage",
      storage: window.localStorage,
    }),
  ],
});
