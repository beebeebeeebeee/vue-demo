import {createI18n} from "vue-i18n";
import store from "@/store";

import enUS from './en-US'
import zhHK from "./zh-HK"

const messages = {
  enUS,
  zhHK
};

const i18n = createI18n({
  locale: store.state.lang,
  messages,
});

store.watch((state) => state.lang, () => {
    i18n.global.locale = store.state.lang
  })

export default i18n