<template>
    <div id="shopType">
        <div class="my-introduce">
            <p>门店类别：管理门店的一个方式，方便商家集中管理门店，也方便商家选择门店！</p>
        </div>
        <div class="my-tools">
            <el-button icon="glyphicon glyphicon-plus" size="small">新增门店类别</el-button>
            <el-button icon="glyphicon glyphicon-trash" size="small" style="color: red;">批量删除</el-button>
            <el-button icon="glyphicon glyphicon-refresh" size="small">刷新数据</el-button>
        </div>
        <table class="my-tab table table-bordered">
            <thead>
            <tr>
                <th><input type="checkbox"/></th>
                <th>类别名称</th>
                <th>创建时间</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th scope="row"><input type="checkbox"/></th>
                <td>001</td>
                <td>厦门沃尔玛</td>
                <td>
                    <el-tag type="warning" size="small">详情</el-tag>
                    <el-tag type="danger" size="small">删除</el-tag>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "shopType"
    }
</script>

<style scoped lang="less">
    #shopType{
        .my-introduce{
            width: 100%;
            height: 60px;
            background: #fcf8e3;
            border-radius: 5px;
            border-bottom: 1px solid gray;
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
