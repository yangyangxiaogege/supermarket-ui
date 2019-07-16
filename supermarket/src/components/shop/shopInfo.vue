<template>
    <div id="shopInfo">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="门店编码">
                <!--<el-input v-model="form.name"></el-input>-->
                <el-tag>010258</el-tag>
            </el-form-item>
            <el-form-item label="创建时间">
                <!--<el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>-->
                <el-tag>2019-07-14 09:36:02</el-tag>
            </el-form-item>
            <el-form-item label="LOGO">
                <img class="my-logo" src="../../resource/images/512×512-点png.png">
                <span style="color: red;">图片分辨率:建议500*500</span>
            </el-form-item>
            <el-form-item label="门店名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="联系人">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="营业时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">至</el-col>
                <el-col :span="11">
                    <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="门店公告">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item label="门店地址">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
        <div style="height: 100px"></div>
    </div>
</template>

<script>
    export default {
        name: "shopInfo",
       inject:['reload'],
        data() {
            return {
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                index:1
            }
        },
        created(){

        },
        methods: {
            // 刷新当前页面
            refresh(){
                this.reload();
            },
            onSubmit() {
                console.log('submit!');
            }

        }
    }
</script>

<style scoped lang="less">
    #shopInfo{
        height: 100%;
        overflow: auto;

        .my-logo{
            width: 60px;
            height: 60px;
            border: 1px solid gray;
            border-radius: 5px;
            box-shadow: 0 0 rgba(0,0,0,0.2);
        }
    }
</style>