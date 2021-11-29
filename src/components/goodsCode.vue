<template>
    <!-- 商品编码 -->
    <div>
        <!-- <div v-if="Object.keys(info).length<=2">
            <template v-for="(value,key,index) in info">
                <div :key="index" v-if="index<2">
                    <div class="textStyle">
                        <span>{{key}}：</span>
                        <span>{{value}}</span>
                    </div>
                </div>
            </template>
        </div> -->

        <div>
            <el-popover placement="top-start" trigger="hover">
                <div>
                    <template v-for="(value,key,index) in info">
                        <div :key="index">
                            <div class="code-item">
                                <span class="label">{{key}}：</span>
                                <span class="content">{{value | formatNullData()}}</span>
                            </div>
                        </div>
                    </template>
                </div>
                <div slot="reference">
                    <template v-for="(value,key,index) in info">
                        <div :key="index" v-if="index<2">
                            <div class="textStyle">
                                <span>{{key}}：</span>
                                <span>{{value | formatNullData()}}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </el-popover>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        info:Object
    },
    mounted(){
        // console.log(Object.keys(this.info).length)
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
    .code-item{
        display: flex;
        line-height: 1.6;
        align-items: center;
    }
    .code-item .label{
         width: 70px;
    }
</style>