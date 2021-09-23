<template>
<n-grid x-gap="12" :cols="2">
    <n-gi>
        EZBus
    </n-gi>
    <n-gi>
        <n-space justify="end">
            <n-dropdown trigger="hover" @select="changeLang" :options="options">
                <n-button disabled>Lang</n-button>
            </n-dropdown>
            <n-button text tag="a" @click="parent.theme = parent.theme? null: parent.darkTheme">{{parent.theme? 'Light Mode': 'Dark Mode'}}</n-button>
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
                    label: 'ENG',
                    key: "brown's hotel, london"
                },
                {
                    label: '亚特兰蒂斯巴哈马，拿骚',
                    key: 'atlantis nahamas, nassau'
                },
                {
                    label: '比佛利山庄酒店，洛杉矶',
                    key: 'the beverly hills hotel, los angeles'
                }
            ],
        }
    },
    methods: {
        changeLang: function () {

        }
    }
}
</script>
