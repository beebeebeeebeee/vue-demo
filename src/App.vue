<template>
<el-card shadow="always">
    <el-select v-model="formData.route" filterable placeholder="巴士線" value-key="label" ref="agentSelect" :loading="!busList">
        <el-option v-for="item in busList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
    </el-select>

    <el-select v-model="formData.routeStop" filterable placeholder="巴士站" value-key="label" ref="agent2Select" :loading="!stopsList">
        <el-option v-for="item in stopsList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
    </el-select>

    <el-button type="primary" @click="add">新增</el-button>
</el-card>

<el-card shadow="always" v-for="item in selected" :key="item" class="card">
    <el-row>
        <el-col :span="20"> {{ item.route }} | {{ item.stop }} </el-col>
        <el-col :span="4" style="text-align: right">
            <i class="el-icon-close" @click="remove(item)"></i>
        </el-col>
    </el-row>

    <el-steps :active="2">
        <el-step v-for="prev, index in item.prev2Name.reverse()" :title="prev.label" :key="index" icon="el-icon-truck"></el-step>
        <el-step :title="item.stop" icon="el-icon-truck"></el-step>
    </el-steps>

    <el-timeline>
        <el-timeline-item v-for="(activity, index) in item.eta" :key="index" :timestamp="activity.eta">
            {{formatDate(activity.eta)}}
        </el-timeline-item>
        <!-- <el-timeline-item :timestamp="'activity.timestamp'"> </el-timeline-item> -->
    </el-timeline>

    {{ item }}
</el-card>
</template>

<script>
import DataServices from "@/service/DataServices.js";
import {
    formatDate
} from "@/service/Utils.js";

export default {
    data() {
        return {
            formatDate,

            formData: {
                route: "",
                routeStop: "",
            },

            selected: [],
        };
    },
    async mounted() {
        DataServices.getBusList();
        DataServices.getStopsList();

        this.$refs.agentSelect.$el
            .querySelector(".el-input__inner")
            .removeAttribute("readonly");
        this.$refs.agent2Select.$el
            .querySelector(".el-input__inner")
            .removeAttribute("readonly");

        this.setSelected();
    },
    methods: {
        add: function () {
            if (this.formData.routeStop != "" && this.formData.routeStop != null) {
                let added = JSON.parse(JSON.stringify(this.formData));
                added.prev2 = [];
                for (
                    let i = this.formData.routeStop.seq - 1; this.formData.routeStop.seq - 3 < i && i > 0; i--
                ) {
                    added.prev2.push(this.stopsList.find((e) => e.value.seq == i));
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
            let a = []

            for (let j in this.$store.state.selected) {
                let e = this.$store.state.selected[j]
                let prev2 = []
                for (let m in e.prev2) {
                    prev2.push(await DataServices.getETA(e.prev2[m].value))
                }
                a.push({
                    route: e.route.label,
                    stop: e.routeStop.label,
                    eta: await DataServices.getETA(e.routeStop),
                    prev2Name: e.prev2,
                    prev2
                })
            }

            this.selected = a;
        },
    },
    watch: {
        "formData.route": function () {
            this.formData.routeStop = "";
        },
    },
    computed: {
        busList: {
            get() {
                return this.$store.state.busList.map((e) => {
                    e.label = `${e.route} ${e.orig_tc}>${e.dest_tc}`;
                    return {
                        value: e,
                        label: e.label,
                    };
                });
            },
        },
        stopsList: {
            get() {
                if (this.formData.route == "" || this.formData.route == null) return [];
                let k = this.formData.route;
                return this.$store.state.stopsList[k.route][k.bound][
                    k.service_type
                ].map((e) => {
                    e.label = `${e.seq}. ${e.name_tc}`;
                    return {
                        value: e,
                        label: e.label,
                    };
                });
            },
        },
    },
};
</script>

<style>
* {
    touch-action: manipulation;
}

.el-select,
.el-select-v2,
.el-button {
    width: 100%;
}

.el-select,
.el-select-v2 {
    margin-bottom: 1rem;
}

.card {
    margin-top: 1rem;
}
</style>
