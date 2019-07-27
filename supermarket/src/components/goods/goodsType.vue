<template>
    <div id="shopType">
        <div class="my-introduce">
            <p>商品类别：通过商品类别，可以快速帮您定位到你想要的商品区！</p>
        </div>
        <div class="my-tools">
            <el-button icon="glyphicon glyphicon-plus" size="small" @click="add">新增商品类别</el-button>
            <el-button icon="glyphicon glyphicon-trash" size="small" style="color: red;" @click="dels">批量删除</el-button>
            <el-button icon="glyphicon glyphicon-refresh" size="small">刷新数据</el-button>
        </div>
        <table class="my-tab table table-bordered">
            <thead>
            <tr>
                <th>
                    <el-checkbox v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
                </th>
                <th>序号</th>
                <th>类别编号</th>
                <th>类别名称</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in goodsTypeList" :key="item.goodsTypeName">
                <th scope="row"><el-checkbox v-model="item.checked" @change="handleCheckedShopsChange(item.checked,item.id)"></el-checkbox></th>
                <td>{{index+1}}</td>
                <td>{{item.id}}</td>
                <td>{{item.goodsTypeName}}</td>
                <td>
                    <el-tag type="warning" size="small">编辑</el-tag>
                    <el-tag type="danger" size="small">删除</el-tag>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "shopType",
        data(){
            return {
                goodsTypeList:[{}],
            }
        },
        methods:{
            add() {
                this.$prompt('请输入类别名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputErrorMessage: '类别名称有误'
                }).then(({ value }) => {
                    this.$message({
                        type: 'success',
                        message: '你的类别名称是: ' + value
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            // 批量删除
            dels(){

            },
        }
    }
</script>

<style scoped lang="less">
    #shopType{
        .my-introduce{
            width: 100%;
            height: 60px;
            background: #fcf8e3;
            border-radius: 5px;
            /*border-bottom: 1px solid gray;*/
            p{
                height: 60px;
                line-height: 60px;
                text-indent: 2em;
            }
        }
        .my-tools{
            padding: 10px 0;
        }
    }
</style>
