<template>
    <div id="shopList">
        <div class="my-content">
            <!--搜索区-->
            <div class="my-search">
                <el-date-picker
                        v-model="shop.startDate"
                        type="date"
                        size="small"
                        placeholder="开始日期">
                </el-date-picker>
                <el-date-picker
                        v-model="shop.endDate"
                        type="date"
                        size="small"
                        placeholder="结束日期">
                </el-date-picker>
                <el-select v-model="shop.shopTypeId" filterable placeholder="全部门店类别" size="small">
                    <el-option
                            v-for="item in shopTypes"
                            :key="item.shopTypeName"
                            :label="item.shopTypeName"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="shop.shopName" filterable placeholder="门店名称" size="small">
                    <el-option
                            v-for="item in shops"
                            :key="item.shopName"
                            :label="item.shopName"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-input v-model="shop.shopAccount" placeholder="门店账号" style="width: 150px" size="small"></el-input>
                <el-button type="primary" size="small">查询</el-button>
            </div>
            <!--工具-->
            <div class="my-tools">
                <el-button icon="glyphicon glyphicon-plus" size="small" @click="openAdd">新增门店</el-button>
                <el-button icon="glyphicon glyphicon-edit" size="small" @click="openEdits">批量修改</el-button>
                <el-button icon="glyphicon glyphicon-download-alt" size="small">导出excel</el-button>
                <el-button icon="glyphicon glyphicon-refresh" size="small">刷新数据</el-button>
            </div>
            <!--数据-->
            <table class="my-tab table table-bordered">
                <thead>
                <tr>
                    <th><input type="checkbox"/></th>
                    <th>门店编号</th>
                    <th>门店名称</th>
                    <th>门店类型</th>
                    <th>联系人</th>
                    <th>联系人电话</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row"><input type="checkbox"/></th>
                    <td>001</td>
                    <td>厦门沃尔玛</td>
                    <td>营销</td>
                    <td>张三</td>
                    <td>135875462</td>
                    <td>
                        <el-tag type="warning" size="small">详情</el-tag>
                        <el-tag type="danger" size="small">删除</el-tag>
                    </td>
                </tr>
                </tbody>
            </table>
            <!--分页-->
            <div class="my-page">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage4"
                        :page-sizes="[100, 200, 300, 400]"
                        :page-size="100"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="400">
                </el-pagination>
            </div>
            <div style="height: 200px"></div>

        </div>

        <!--添加门店弹出框-->
        <transition>
            <div class="my-tanchukuang" v-if="showAdd">
                <div>
                    <div class="my-modal modal-content">
                        <div class="modal-header">
                            <button type="button" class="close"><span aria-hidden="true" @click="closeAdd">×</span></button>
                            <h4 class="modal-title">新增门店信息</h4>
                        </div>
                        <div class="modal-body">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="登陆账号" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="登陆密码" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="确认密码" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="门店名称" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="联系人" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="联系电话">
                                    <el-input v-model="ruleForm.phone"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!--批量修改-->
        <transition>
            <div class="my-tanchukuang" v-if="showEdits">
                <div>
                    <div class="my-modal modal-content">
                        <div class="modal-header">
                            <button type="button" class="close"><span aria-hidden="true" @click="closeEdits">×</span></button>
                            <h4 class="modal-title">批量修改</h4>
                        </div>
                        <div class="modal-body">
                            <div class="my-edit-item">
                                <el-checkbox v-model="checked"></el-checkbox>
                                <el-select v-model="shop.shopTypeId" placeholder="请选择" size="small">
                                    <el-option
                                            v-for="item in shopTypes"
                                            :key="item.shopTypeName"
                                            :label="item.shopTypeName"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="my-edit-item">
                                <el-checkbox v-model="checked"></el-checkbox>
                                <el-radio v-model="radio" label="1">备选项</el-radio>
                                <el-radio v-model="radio" label="2">备选项</el-radio>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "shopList",
        data() {
            return {
                shop:{
                    shopName:'',
                    startDate:'',
                    endDate:'',
                    shopTypeId:'',
                    shopAccount:''
                },
                shopTypes:[
                    {id:'1',shopTypeName:'物源/批发'},
                    {id:'2',shopTypeName:'连锁/加盟'}
                ],
                shops:[
                    {id:'1',shopName:'厦门沃尔玛'},
                    {id:'1',shopName:'澳门皇冠赌场'}
                ],
                // 分页数据
                currentPage1: 5,
                currentPage2: 5,
                currentPage3: 5,
                currentPage4: 4,
                // 是否显示添加框
                showAdd:false,
                showEdits:false,
                checked:false,
                radio:'1',
                // 添加表单
                ruleForm: {
                    name: '',
                    phone: '',
                },
                rules: {
                    name: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        created(){

        },
        methods:{
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            openAdd() {
                this.showAdd = true;
            },
            closeAdd(){
                this.showAdd = false;
            },
            openEdits(){
                this.showEdits = true;
            },
            closeEdits(){
                this.showEdits = false;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped lang="less">
    #shopList{
        height: 100%;
        overflow: auto;
        .my-content{
            width: 1500px;
            height: 100%;
            position: relative;
            .my-search{
                padding: 0 0 10px 0;
                border-bottom: 1px solid gray;
            }
            .my-tools{
                padding: 10px 0;
            }
            .my-page{

            }

        }
        .my-tanchukuang{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,0.5);
            border: 15px solid white;
            .my-modal{
                overflow: auto;
                height: 404px;
                width: 600px;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -202px;
                margin-left: -300px;

                .my-edit-item{
                    padding: 15px;
                }
            }
        }

        .v-enter,
        .v-leave-to {
            /*v-enter 动画未开始时，v-leave-to 动画已经结束*/
            opacity: 0;
        }

        .v-enter-active,
        .v-leave-active {
            /*v-enter-active 入场时触发的动画，v-leave-active 离场时触发的动画*/
            transition: all 0.8s ease;
        }

    }
</style>