<template>
<!-- this is the warpper from naive-ui (components that have n- prefix is from naive-ui also) -->
<!-- for more info abt naive-ui please read: https://www.naiveui.com/ -->
<n-config-provider :theme="theme">
    <n-space vertical size="large">
        <n-layout>
            <n-layout-header>
                <n-button text tag="a" @click="theme = theme? null: darkTheme">{{theme? 'Dark': 'Light'}}</n-button>
            </n-layout-header>
            <n-layout-content content-style="padding: .5rem;">
                <!-- this is my custom component -->
                <Bus />
            </n-layout-content>
        </n-layout>

    </n-space>
</n-config-provider>
</template>

<script>
// import my custom component
import Bus from '@/components/Bus.vue'
import {
    ref
} from 'vue'
// this is the stuff for naive-ui darkTheme!
import {
    darkTheme
} from 'naive-ui'

export default {
    // import my custom component to use inside current components (the top template area)
    components: {
        Bus
    },
    // this place is define the data (state) on this component
    data() {
        return {
            // this is the stuff for naive-ui darkTheme!
            darkTheme,
            theme: ref(darkTheme)
        }
    }
}
</script>

<style>
/* some style for everywhere */
/* if you just want style only for this component, use <style scoped> */
* {
    touch-action: manipulation;
    margin: 0;
    padding: 0;
}

.n-layout {
    min-height: calc(100vh - 1.5rem);
}
</style>
