<template>
<!-- this is the custom componet -->

<n-space vertical>
    <n-card size="small">
        <n-space vertical>
            <n-select filterable v-model:value="formData.route" :options="busList" />
            <n-select filterable v-model:value="formData.routeStop" :options="stopsList" />
            <n-button color="#8a2be2" style="width: 100%" @click="add">
                <template #icon>
                    <n-icon>
                        <add />
                    </n-icon>
                </template>
                {{ $t("add.bus") }}
            </n-button>
        </n-space>
    </n-card>
    <n-button color="#ff69b4" style="width: 100%" @click="setSelected">
        <template #icon>
            <n-icon>
                <refresh />
            </n-icon>
        </template>
        {{ $t("refresh") }}
        <span style="padding-left: 1rem; font-size: 12px">
            {{ $t("refresh.auto", { refreshCountdown }) }}
        </span>
    </n-button>
    <n-card size="small" v-for="(item, i) in selected" :key="i" :title="item.route" closable @close="remove(item.raw)">
        <n-steps vertical size="small" :current="item.location.seq" :status="'process'">
            <n-step :title="prev.label" :description="prev.eta[0] ? formatLeft(prev.eta[0].left) : 'No Bus'" v-for="(prev, j) in item.prev2" :key="j" />
            <n-step :title="item.stop">
                <template #default>
                    <n-timeline>
                        <n-timeline-item type="success" :title="formatLeft(eta.left)" :time="formatTime(eta.time)" v-for="(eta, k) in item.eta" :key="k" />
                    </n-timeline>
                </template>
            </n-step>
        </n-steps>

        <!-- For Debug use -->
        <!-- <pre>
        {{ JSON.stringify(item, 0, 2) }}
        </pre> -->
    </n-card>
</n-space>
</template>

<script>
import {
    Add,
    Refresh
} from "@vicons/ionicons5";
import DataServices from "@/service/DataServices.js";
import {
    formatLeft,
    formatTime,
    getBusList,
    getStopsList
} from "@/service/Utils.js";

export default {
    components: {
        Add,
        Refresh,
    },
    data() {
        return {
            formatLeft,
            formatTime,

            refreshCountdown: 1,
            formData: {
                route: "",
                routeStop: "",
            },

            selected: [],
        };
    },
    // do when this component has loaded
    async mounted() {
        DataServices.getBusList();
        DataServices.getStopsList();

        this.timer = setInterval(() => {
            if (this.timerSwitch) {
                if (this.refreshCountdown > 0) {
                    this.refreshCountdown--;
                } else {
                    this.setSelected();
                }
            }
        }, 1000);
    },
    // the functions for this component
    methods: {
        add: function () {
            if (this.formData.routeStop != "" && this.formData.routeStop != null) {
                let added = JSON.parse(JSON.stringify(this.formData));
                added.prev2 = [];
                for (
                    let i = this.formData.routeStop.seq - 1; this.formData.routeStop.seq - 3 < i && i > 0; i--
                ) {
                    added.prev2 = [
                        this.stopsList.find((e) => e.value.seq == i),
                        ...added.prev2,
                    ];
                }
                this.$store.commit("addSelected", added);
            }
            this.setSelected();
        },
        remove: function (item) {
            this.$store.commit("removeSelected", item);
            this.setSelected();
        },
        setSelected: async function () {
            this.refreshCountdown = process.env.VUE_APP_REFRESH_COUNTDOWN;
            let a = [];

            for (let j in this.$store.state.selected) {
                let e = this.$store.state.selected[j];
                let prev2 = [];
                let allLeft = [];
                for (let m in e.prev2) {
                    let eta = await DataServices.getETA(e.prev2[m].value);
                    allLeft.push(
                        eta[0] ? (eta[0].left > 0 ? eta[0].left : 99999999) : 99999999
                    );
                    prev2.push({
                        seq: e.prev2[m].value.seq,
                        label: e.prev2[m].value.label,
                        eta,
                    });
                }
                let eta = await DataServices.getETA(e.routeStop);
                allLeft.push(
                    eta[0] ? (eta[0].left > 0 ? eta[0].left : 99999999) : 99999999
                );
                a.push({
                    raw: e.routeStop,
                    seq: e.routeStop.seq,
                    route: e.route.label,
                    stop: e.routeStop.label,
                    eta,
                    prev2,
                    location: {
                        allLeft,
                        seq: allLeft.indexOf(Math.min(...allLeft)) + 1,
                    },
                });
            }

            this.selected = a;
        },
    },
    // is the key (formData.route in this case) has changes do the function
    watch: {
        "formData.route": function () {
            this.formData.routeStop = "";
        },
    },
    // the data is computed
    // usually use for getting store state
    // it has get() and set(val) fn
    computed: {
        timerSwitch() {
            return this.$store.state.timerSwitch;
        },
        busList() {
            return getBusList()
        },
        stopsList() {
            if (this.formData.route == "" || this.formData.route == null) return [];
            return getStopsList( this.formData.route)
        },
    },
};
</script>
