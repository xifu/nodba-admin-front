<template>
    <!-- 商品基础信息 -->
    <div>
        <el-popover :placement="placement" :trigger="trigger">
            <el-row type="flex">
                <div>
                    <el-image :src="info[0]" fit="contain" style="height: 41px; width: 28px;padding-top: 6px;" >
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline" style="font-size: 30px; color: rgb(159, 163, 168);"></i>
                        </div>
                    </el-image>
                </div>

                <div style="margin-left:5px">
                    <div v-if="!type" class="textStyle" style="font-size: 12px; font-weight: 700;">
                        {{info[1]}}
                    </div>

                    <div v-if="type" style="display:flex">
                        <div class="textStyle" style="font-size: 12px; font-weight: 700;">
                            {{info[1]}}
                        </div>
                        <div style="margin-left:5px">
                            <el-tag v-if="type == 1">常规产品</el-tag>
                            <el-tag v-if="type == 2" type="success">组合产品</el-tag>
                        </div>
                    </div>

                    <div style="margin-top:5px" class="textStyle">
                        <span v-if="info[3]" style="color: #909399; font-weight: 500;">
                            {{info[2]}}-{{info[3]}}
                        </span>
                        <span v-if="!info[3]" style="color: #909399; font-weight: 500;">
                            {{info[2]}}
                        </span>
                        <el-divider v-if="info[3]" direction="vertical" class="code-divider-sty"></el-divider>
                        <span v-if="info[4] == 1" style="color: red">重点</span>
                        <span v-else-if="info[4] == 2" style="color: #2cc642">常规</span>
                        <span v-else-if="info[4] == 3" style="color: #e6a23c">清货</span>
                        <span v-else-if="info[4] == 4" style="color: #2cc642">测款</span>
                        <span v-else-if="info[4] == 5" style="color: #909399">下架</span>
                        <span style="color: #909399; font-weight: 500;" v-else>{{info[4]}}</span>
                    </div>
                </div>
            </el-row>
            <div slot="reference">
                <el-row type="flex">
                    <div>
                        <el-image :src="info[0]" fit="contain" style="height: 41px; width: 28px;padding-top: 6px;" >
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline" style="font-size: 30px; color: rgb(159, 163, 168);"></i>
                            </div>
                        </el-image>
                    </div>

                    <div style="margin-left:5px">
                        <div v-if="!type" class="textStyle" style="font-size: 12px; font-weight: 700;">
                            {{info[1]}}
                        </div>

                        <div v-if="type" style="display:flex">
                            <div class="textStyle" style="font-size: 12px; font-weight: 700;">
                                {{info[1]}}
                            </div>
                            <div style="margin-left:5px">
                                <el-tag v-if="type == 1">常规产品</el-tag>
                                <el-tag v-if="type == 2" type="success">组合产品</el-tag>
                            </div>
                        </div>

                        <div style="margin-top:5px" class="textStyle">
                            <span v-if="info[3]" style="color: #909399; font-weight: 500;">
                                {{info[2]}}-{{info[3]}}
                            </span>
                            <span v-if="!info[3]" style="color: #909399; font-weight: 500;">
                                {{info[2]}}
                            </span>
                            <el-divider v-if="info[3]" direction="vertical" class="code-divider-sty"></el-divider>
                            <span v-if="info[4] == 1" style="color: red">重点</span>
                            <span v-else-if="info[4] == 2" style="color: #2cc642">常规</span>
                            <span v-else-if="info[4] == 3" style="color: #e6a23c">清货</span>
                            <span v-else-if="info[4] == 4" style="color: #2cc642">测款</span>
                            <span v-else-if="info[4] == 5" style="color: #909399">下架</span>
                            <span style="color: #909399; font-weight: 500;" v-else>{{info[4]}}</span>
                        </div>
                    </div>
                </el-row>
            </div>
        </el-popover>
    </div>
</template>

<script>
export default {
    props:{
        //0:图片 1.标题 2.市场 3.店铺 4.标记
        info:Array,
        type:Number,
        placement:{
            type:String,
            default:'bottom-start'
        },
        trigger:{
            type:String,
            default:'hover'
        }
    },
    mounted(){
        // console.log(this.placement)
    }
}
</script>

<style scoped>
    .textStyle {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }
</style>