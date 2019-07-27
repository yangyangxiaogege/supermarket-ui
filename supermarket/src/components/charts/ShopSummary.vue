<template>
    <!--店铺汇总-->
    <div id="shopSummary">
        <div id="container" ref="container"></div>
    </div>
</template>

<script>
    import Highcharts from 'highcharts/highcharts.js';
    import  'highcharts/modules/data.js';
    export default {
        name: "ShopSummary",
        mounted(){
            this.init();
        },
        methods:{
            // 初始化
            init() {
                let option = {
                    series: [{
                        name: '销售金额',
                        data: [1,4,6,9],
                        color: '#71c671'
                    },
                        {
                            name: '销售毛利',
                            data: [2,4,5,9],
                            color: '#ee7621'
                        }
                    ],
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '店铺汇总'
                        // 该功能依赖 data.js 模块，详见https://www.hcharts.cn/docs/data-modules
                    },
                    xAxis:{
                        categories:['洋洋便利店','精致便利店','网易云音乐','澳门皇冠赌场']
                    },
                    yAxis: {
                        allowDecimals: false,
                        title: {
                            text: '元',
                            rotation: 0
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.series.name + '</b><br/>' +
                                this.point.y + ' 元' ;
                            //this.point.name.toLowerCase()
                        }
                    }
                }
                Highcharts.chart('container',option);
            }
        }
    }
</script>

<style scoped>

</style>