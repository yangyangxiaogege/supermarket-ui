<template>
    <!--热销商品-->
    <div id="shopSummary">
        <div id="container1" ref="container"></div>
    </div>
</template>

<script>
    import Highcharts from 'highcharts/highcharts.js';
    import  'highcharts/modules/data.js';
    export default {
        name: "HotGoods",
        data(){
            return {
                chart:null,
            }
        },
        mounted(){
            this.init();

        },
        methods:{
            // 初始化
            init() {
                Highcharts.chart('container1', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: '热销商品占比'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        name: '占比',
                        colorByPoint: true,
                        data: [{
                            name: '小海一条龙服务',
                            y: 61.41,
                            sliced: true,
                            selected: true
                        }, {
                            name: '养乐多',
                            y: 11.84
                        }, {
                            name: '百事可乐',
                            y: 10.85
                        }, {
                            name: '宝格丽项链',
                            y: 4.67
                        }, {
                            name: '钻石王老五',
                            y: 4.18
                        }, {
                            name: '六位地黄丸',
                            y: 1.64
                        }]
                    }]
                });
            }
        }
    }
</script>

<style scoped>

</style>