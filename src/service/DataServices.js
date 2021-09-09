import axios from "axios";
import store from "@/store";

export default new (class {
  async getBusList() {
    if (((new Date() - store.state.lastUpd.busList) / 1000 / 60 / 60 / 24 )> 7) {
      let busList = (await axios.get(process.env.VUE_APP_routesUrl)).data.data;
      store.commit("setBusList", busList);
      store.commit("setLastUpdBusList", new Date());
    }
  }
})();
