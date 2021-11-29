<!--
 * @FileDescription: 该文件的描述信息
 * @Author: WangQiang
 * @Date: 2021-09-13 17:01:12
-->
<template>
    <el-form :inline="true" :model="searchForm" size="small">
        <el-form-item v-for="item in formItem" :key="item.field" :label="item.label">
            <!-- treeselect 类型 -->
            <treeselect
                v-if="item.type === 'treeselect'"
                :placeholder="item.placeholder"
                class="erp-treeselect"
                style="width: 200px"
                :limit='1'
                :limit-text="limitText"
                :value-consists-of="item.props['valueConsistsOf'] || 'LEAF_PRIORITY'"
                v-model="searchForm[item.field]"
                :options="item.props.options"
                :normalizer="normalizer"
                :multiple="true"
            />
            <!-- select 类型 -->
            <el-select
                v-if="item.type === 'select'"
                v-model="searchForm[item.field]"
                clearable
                :placeholder="item.placeholder"
                :style="item.style"
                :multiple="item.props.multiple || false"
                collapse-tags
            >
                <el-option
                    v-for="outStorage in item.props.options"
                    :key="item.props.value ? outStorage[item.props.value] : outStorage.id"
                    :label="item.props.label ? outStorage[item.props.label] : outStorage.name"
                    :value="item.props.value ? outStorage[item.props.value] : outStorage.id"
                />
            </el-select>
            <!-- input 类型 -->
            <el-input
                v-if="item.type === 'input'"
                v-model="searchForm[item.field]"
                clearable
                :placeholder="item.placeholder"
            />
            <!-- time 日期选择器，默认type = daterange -->
            <el-date-picker
                v-if="item.type === 'time'"
                v-model="searchForm[item.field]"
                :type="item.props.type || 'daterange'"
                range-separator="至"
                :value-format="item.props.valueFormat || 'yyyy-MM-dd'"
                :start-placeholder="item.props.startPlaceholder"
                :end-placeholder="item.props.endPlaceholder">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
            <slot></slot>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    props: {
        formItem: {
            type: Array,
            default () {
                return [];
            }
        }
    },
    data() {
        return {
            searchForm: {
                storageIds: []
            },
            // formItem: [
            //     { label: '', field: 'storeId', placeholder: '店铺-市场', type: 'treeselect', props: { options: [], }, style: {width: '200px'}, },
            //     { label: '', field: 'outStorageId', placeholder: '出库仓', type: 'select', props: { options: [], }, style: {width: '150px'}, },
            //     { label: '', field: 'putStorageId', placeholder: '入库仓', type: 'select', props: { options: [], }, style: {width: '150px'}, },
            //     { label: '', field: 'spuOrSku', placeholder: '产品PSKU/产品SKU', type: 'input', style: {width: '200px'}, },
            //     { label: '', field: 'msku', placeholder: 'MSKU', type: 'input', },
            //     { label: '', field: 'code', placeholder: '调拨计划编号', type: 'input',},
            //     { label: '', field: 'planStatus', placeholder: '计划状态', type: 'input',},
            //     { label: '', field: 'transportWay', placeholder: '物流类型', type: 'select', props: { options: [], }, style: {width: '150px'}, },
            //     { label: '创建日期', field: 'time', type: 'time', props: { startPlaceholder: '开始日期', endPlaceholder: '结束日期' }, style: {width: '150px'}, },
            // ],
            normalizer(node) {
                return {
                    id: node.id,
                    label: node.name,
                    children: node.children,
                };
            },
        };
    },
    computed: {
    },
    created() {

    },
    mounted() {

    },
    methods: {
        getFormData () {
            return this.searchForm;
        },
        reset () {
            this.searchForm = {};
        },
        limitText(count) {
            return "+ " + count;
        },
        
    }
};
</script>

<style scoped lang="scss">

</style>
