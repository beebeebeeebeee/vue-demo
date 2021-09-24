<template>
<n-grid x-gap="12" :cols="3">
    <n-gi>
        EZBus
    </n-gi>
    <n-gi :span="2">
        <n-space justify="end">
            <n-switch v-model:value="timerSwitch" />
            <n-dropdown trigger="hover" @select="changeLang" :options="options">
                <n-button>{{$t("lang")}}</n-button>
            </n-dropdown>
            <n-button text tag="a" @click="parent.theme = parent.theme? null: parent.darkTheme">{{parent.theme? $t('mode.dark'): $t('mode.light')}}</n-button>
        </n-space>
    </n-gi>
</n-grid>
</template>

<script>
export default {
    data() {
        return {
            parent: this.$parent.$parent.$parent.$parent.$parent,

            options: [{
                    label: 'English',
                    key: "enUS"
                },
                {
                    label: '中文',
                    key: 'zhHK'
                }
            ],
        }
    },
    methods: {
        changeLang: function (lang) {
            this.$store.commit("setLang", lang)
        }
    },
    computed: {
        timerSwitch: {
            get() {
                return this.$store.state.timerSwitch;
            },
            set(val) {
                return this.$store.commit("setTimerSwitch", val)
            }
        }
    }
}
</script>
