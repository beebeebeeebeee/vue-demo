<template>
  <n-grid x-gap="12" :cols="7">
    <n-gi :span="3">
      <n-space>
        <n-tag type="success">
          ver. {{ $root.version }}
        </n-tag>
        <n-tag type="warning">
          {{ $store.state.version }}
        </n-tag>
      </n-space>
    </n-gi>
    <n-gi :span="4">
      <n-space justify="end" align="start">
        <n-switch v-model:value="timerSwitch" />
        <n-dropdown trigger="hover" @select="changeLang" :options="options">
          <n-button>{{ $t("lang") }}</n-button>
        </n-dropdown>
        <n-button text tag="a" @click="$store.commit('invertDarkMode')">{{
          parent.theme ? $t("mode.dark") : $t("mode.light")
        }}</n-button>
      </n-space>
    </n-gi>
  </n-grid>
</template>

<script>
export default {
  data() {
    return {
      parent: this.$parent.$parent.$parent.$parent.$parent,

      options: [
        {
          label: "English",
          key: "enUS",
        },
        {
          label: "中文",
          key: "zhHK",
        },
      ],
    };
  },
  methods: {
    changeLang: function (lang) {
      this.$store.commit("setLang", lang);
    },
  },
  computed: {
    timerSwitch: {
      get() {
        return this.$store.state.timerSwitch;
      },
      set(val) {
        return this.$store.commit("setTimerSwitch", val);
      },
    },
  },
};
</script>

<style scoped>
.n-grid {
  align-items: center;
}

.small {
  color: rgb(138, 138, 138);
}
</style>