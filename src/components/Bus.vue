<template>
<!-- this is the custom componet -->

<n-space vertical>
    <n-card size="small">
        <n-space vertical>
            <n-select filterable v-model:value="formData.route" :options="busList" :clearable="true" :placeholder="$t('r1.route')" />
            <n-select filterable v-model:value="formData.routeStop" :options="stopsList" :clearable="true" :placeholder="$t('r1.stop')" />

            <n-select filterable v-model:value="formData.sameRoute" :options="sameRoute" :clearable="true" v-if="sameRoute.length > 0" :placeholder="$t('r2.route')" />
            <n-select filterable v-model:value="formData.sameRouteStop" :options="sameRouteStopList" :clearable="true" v-if="sameRoute.length > 0" :placeholder="$t('r2.stop')" />

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
    <n-button color="#ff69b4" style="width: 100%" @click="setSelected" :loading="loading">
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
    <n-card size="small" v-for="(item, i) in selected" :key="i" closable @close="remove(i)">
        <template #header>
            <span @click="collapse(i)">
                <n-icon size="16">
                    <caret-down-sharp v-if="item.collapse" />
                    <caret-up-sharp v-else />
                </n-icon>
                {{ item.route }}
            </span>
        </template>
        <n-steps vertical size="small" :current="item.location.seq" :status="'process'" v-if="!item.collapse">
            <n-step :title="prev.label" :description="
            prev.eta[0]
              ? formatLeft(prev.eta[0].left - refreshCountup) +
                ` ${this.$t(prev.eta[0].co)} ${getLangRmk(prev.eta[0])}`
              : this.$t('status.no_bus')
          " v-for="(prev, j) in item.prev2" :key="j" />
            <n-step :title="item.stop">
                <template #default>
                    <template v-if="item.eta.length == 0">
                        {{ this.$t("status.no_bus") }}
                    </template>
                    <n-timeline>
                        <n-timeline-item type="success" :title="formatLeft(eta.left - refreshCountup)" :time="formatTime(eta.time) + ` ${this.$t(eta.co)} ${getLangRmk(eta)}`" v-for="(eta, k) in item.eta" :key="k" />
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
    Refresh,
    CaretDownSharp,
    CaretUpSharp
} from "@vicons/ionicons5";
import DataServices from "@/service/DataServices.js";
import {
    lang,
    formatLeft,
    formatTime,
    getBusList,
    getStopsList,
    getSameRoute,
    getLangRmk
} from "@/service/Utils.js";

export default {
    components: {
        Add,
        Refresh,
        CaretDownSharp,
        CaretUpSharp,
    },
    data() {
        return {
            loading: false,

            formatLeft,
            formatTime,
            getLangRmk,

            refreshCountdown: process.env.VUE_APP_REFRESH_COUNTDOWN,
            refreshCountup: 0,
            refreshTime: new Date(),

            sameRoute: [],

            formData: {
                route: null,
                routeStop: null,
                sameRoute: null,
                sameRouteStop: null,
            },

            selected: [],

            loadingBar: null,
        };
    },
    // do when this component has loaded
    async mounted() {
        await DataServices.getBusList();
        await DataServices.getStopsList();

        this.$root.loading.close();

        this.setSelected();

        this.timer = setInterval(() => {
            this.refreshCountup += 1000;
            // if the device pause and re-open
            if (new Date() - this.refreshTime > 5000) this.setSelected();

            this.refreshTime = new Date();
            if (this.timerSwitch && !this.loading) {
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
            if (this.formData.routeStop != "" && this.formData.routeStop != null && (this.formData.sameRoute == "" || this.formData.sameRoute == null || (this.formData.sameRoute != "" & this.formData.sameRoute != null && this.formData.sameRouteStop != "" & this.formData.sameRouteStop != null))) {
                let added = JSON.parse(JSON.stringify(this.formData));

                added.collapse = false;
                added.co = [added.route.co];
                added.routeStop = [added.routeStop];
                if (added.sameRoute) {
                    added.co.push(added.sameRoute.co);
                    added.routeStop.push(added.sameRouteStop);
                }
                added.label_en = `${added.route.route_en || added.route.route}. ${
          added.route.orig_en
        } > ${added.route.dest_en}`;
                added.label_tc = `${added.route.route_tc || added.route.route}. ${
          added.route.orig_tc
        } > ${added.route.dest_tc}`;

                added.prev2 = [];
                for (
                    let i = this.formData.routeStop.seq - 1; this.formData.routeStop.seq - 3 < i && i > 0; i--
                ) {
                    let toBeAdded = [this.stopsList.find((e) => e.value.seq == i)];
                    if (added.sameRoute)
                        toBeAdded.push(
                            this.sameRouteStopList.find((e) => e.value.seq == i)
                        );
                    added.prev2 = [toBeAdded, ...added.prev2];
                }

                delete added.route;
                delete added.sameRoute;
                delete added.sameRouteStop;
                this.$store.commit("addSelected", added);
                if (added.success) this.formData.route = null;
                this.setSelected();
            }
        },
        remove: function (index) {
            this.$store.commit("removeSelected", index);
            this.setSelected();
        },
        collapse: function (index) {
            this.$store.commit("invertCollapseSelected", index);
            this.setSelected();
        },
        setSelected: async function () {
            this.loading = true;

            let a = [];

            for (let j in this.$store.state.selected) {
                let e = this.$store.state.selected[j];
                let prev2 = [];
                let allLeft = [];
                let eta = [];
                for (let m in e.prev2) {
                    let k = e.prev2[m];
                    let eta = [];
                    if (!e.collapse) {
                        for (let o in k) {
                            let oo = k[o];
                            eta = [...eta, ...(await DataServices.getETA(oo.value))];
                        }
                    }
                    eta.sort((a, b) => {
                        return a.left - b.left;
                    });
                    allLeft.push(
                        eta[0] ? (eta[0].left > 0 ? eta[0].left : 99999999) : 99999999
                    );
                    prev2.push({
                        seq: k[0].value.seq,
                        label: k[0].value.label,
                        eta,
                    });
                }
                if (!e.collapse) {
                    for (let o in e.routeStop) {
                        let oo = e.routeStop[o];
                        eta = [...eta, ...(await DataServices.getETA(oo))];
                    }
                }

                eta.sort((a, b) => {
                    return a.left - b.left;
                });
                allLeft.push(
                    eta[0] ? (eta[0].left > 0 ? eta[0].left : 99999999) : 99999999
                );

                let label =
                    e.co.map((k) => "[" + this.$t(k) + "]").join(" ") +
                    ` ${e["label_" + lang[this.$store.state.lang]]}`;

                a.push({
                    collapse: e.collapse,
                    raw: e.routeStop,
                    seq: e.routeStop[0].seq,
                    route: label,
                    stop: e.routeStop[0].label,
                    eta,
                    prev2,
                    location: {
                        allLeft,
                        seq: allLeft.indexOf(Math.min(...allLeft)) + 1,
                    },
                });
            }

            this.selected = a;
            this.refreshCountup = 0;
            this.refreshCountdown = process.env.VUE_APP_REFRESH_COUNTDOWN;
            this.loading = false;
        },
    },
    // is the key (formData.route in this case) has changes do the function
    watch: {
        "formData.route": function (route) {
            this.formData.routeStop = null;
            this.sameRoute = getSameRoute(route);
            this.formData.sameRoute = null;
            this.formData.sameRouteStop = null;
        },
        "$store.state.lang": function () {
            this.setSelected();
        },
        refreshCountup: function (refreshCountup) {
            this.selected.forEach((e) => {
                let allLeft = [];
                for (let m in e.prev2) {
                    let left = e.prev2[m].eta[0] ?
                        e.prev2[m].eta[0].left - refreshCountup :
                        99999999;
                    allLeft.push(left > 0 ? left : 99999999);
                }
                let cuurentLeft = e[0] ? e[0].left - refreshCountup : 99999999;
                allLeft.push(cuurentLeft > 0 ? cuurentLeft : 99999999);
                this.selected.location = {
                    allLeft,
                    seq: allLeft.indexOf(Math.min(...allLeft)) + 1,
                };
            });
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
            return getBusList();
        },
        stopsList() {
            if (this.formData.route == "" || this.formData.route == null) return [];
            return getStopsList(this.formData.route);
        },
        sameRouteStopList() {
            if (this.formData.sameRoute == "" || this.formData.sameRoute == null)
                return [];
            return getStopsList(this.formData.sameRoute);
        },
    },
};
</script>

<style scoped>
.n-card>>>.n-card__content {
    padding-bottom: 0 !important;
}
</style>
