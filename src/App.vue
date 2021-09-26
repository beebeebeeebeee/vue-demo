<template>
  <!-- this is the warpper from naive-ui (components that have n- prefix is from naive-ui also) -->
  <!-- for more info abt naive-ui please read: https://www.naiveui.com/ -->
  <n-config-provider :theme="theme">
    <n-space vertical size="large">
      <n-layout>
        <n-layout-header>
          <Nav />
        </n-layout-header>
        <n-layout-content content-style="padding: .5rem;">
          <!-- this is my custom component -->
          <Bus />
        </n-layout-content>
      </n-layout>
    </n-space>

    <!-- this can help the body also have dark mode -->
    <n-global-style />
  </n-config-provider>
</template>

<script>
// import my custom component
import Bus from "@/components/Bus.vue";
import Nav from "@/components/Nav.vue";

// this is the stuff for naive-ui darkTheme!
import { darkTheme } from "naive-ui";

export default {
  // import my custom component to use inside current components (the top template area)
  components: {
    Bus,
    Nav,
  },
  // this place is define the data (state) on this component
  data() {
    return {
      // this is the stuff for naive-ui darkTheme!
      darkTheme,
      theme: this.$store.state.darkMode ? darkTheme : null,
    };
  },
  watch: {
    "$store.state.darkMode": function (val) {
      this.theme = val ? darkTheme : null;
    },
  },
};
</script>

<style scoped>
/* some style for everywhere */
/* if you just want style only for this component, use <style scoped> */
* {
  touch-action: manipulation;
}

.n-layout-header {
  padding: 0 1rem;
  font-size: 1.5rem;
}
</style>
