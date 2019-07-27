<template>
    <div id="welcome">
        <div class="left">
            <shop-summary></shop-summary>
        </div>
        <div class="right">
            <hot-goods></hot-goods>
        </div>
        <div class="left">3</div>
    </div>
</template>

<script>
    // 导入店铺汇总分析图表
    import shopSummary from '../../components/charts/ShopSummary.vue';
    // 热销商品占比
    import hotGoods from '../../components/charts/HotGoods.vue';
    export default {
        name: "welcome",
        data() {
            return {}
        },
       mounted(){
       },
        methods:{

        },
        components:{
            'shop-summary':shopSummary,
            'hot-goods':hotGoods
        }
    }
</script>

<style scoped lang="less">
    #welcome{
        height: 100%;
        overflow: auto;
        box-shadow: 0 0 7px rgba(0,0,0,0.4);

        >div{
            width: 45%;
            min-height: 200px;
            border: 1px solid pink;
            float: left;
            margin-top: 15px;
            margin-bottom: 5px;
        }
        >.left{
            margin-left: 3.33%;
            margin-right: 3.33%;
        }
    }
</style>