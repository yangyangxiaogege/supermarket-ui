<template>
    <div id="shopList">
        <div class="my-content">
            <!--搜索区-->
            <div class="my-search">
                <el-select v-model="emp.empPhone" filterable placeholder="全部员工类型" size="small">
                    <el-option label="全部员工类型" value=""></el-option>
                    <el-option
                            v-for="item in roleList"
                            :key="item.roleName"
                            :label="item.roleName"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="emp.empStatus" filterable placeholder="全部员工状态" size="small">
                    <el-option label="全部员工状态" value=""></el-option>
                    <el-option label="正常" value="0"></el-option>
                    <el-option label="休息" value="1"></el-option>
                    <el-option label="离职" value="2"></el-option>
                </el-select>
                <el-input v-model="emp.condition" placeholder="归属门店/账号/联系人/联系电话" style="width: 250px" size="small"></el-input>
                <el-button type="primary" size="small" @click="searchEmp">查询</el-button>
            </div>
            <!--工具-->
            <div class="my-tools">
                <el-button icon="glyphicon glyphicon-plus" size="small" @click="openAdd">新增员工</el-button>
                <el-button icon="glyphicon glyphicon-download-alt" size="small" @click="exportExcel">导出excel</el-button>
                <el-button icon="glyphicon glyphicon-refresh" size="small">刷新数据</el-button>
            </div>
            <!--数据-->
            <table class="my-tab table table-bordered">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>归属门店</th>
                    <th>登录账号</th>
                    <th>员工名称</th>
                    <th>员工类型</th>
                    <th>员工状态</th>
                    <th>联系电话</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(emp,index) in pageList" :key="emp.empName">
                    <td>{{index+1}}</td>
                    <td>{{emp.shop.shopName}}</td>
                    <td>{{emp.empAccount}}</td>
                    <td>{{emp.empName}}</td>
                    <td>{{emp.roles.roleName}}</td>
                    <td>
                        <span v-if="emp.empStatus == 0">正常</span>
                        <span v-if="emp.empStatus == 1">休息</span>
                        <span v-if="emp.empStatus == 2">离职</span>
                    </td>
                    <td>{{emp.empPhone}}</td>
                    <td>{{emp.createDate}}</td>
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
                        :current-page="currentPage"
                        :page-sizes="[2,10, 20, 30, 40]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
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
                            <h4 class="modal-title">新增员工</h4>
                        </div>
                        <div class="modal-body">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="归属门店" prop="shopNameId">
                                    <el-select v-model="ruleForm.shopNameId" filterable placeholder="请选择归属门店" size="small">
                                        <el-option v-for="item in shopNameList" :label="item.shopName" :value="item.id" :key="item.shopName"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="登陆账号" prop="empAccount">
                                    <el-input v-model="ruleForm.empAccount"></el-input>
                                </el-form-item>
                                <el-form-item label="登陆密码" prop="empPwd">
                                    <el-input v-model="ruleForm.empPwd"></el-input>
                                </el-form-item>
                                <el-form-item label="确认密码" prop="pwd">
                                    <el-input v-model="ruleForm.pwd"></el-input>
                                </el-form-item>
                                <el-form-item label="员工名称" prop="empName">
                                    <el-input v-model="ruleForm.empName"></el-input>
                                </el-form-item>
                                <el-form-item label="联系电话">
                                    <el-input v-model="ruleForm.empPhone"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" @click="resetForm('ruleForm')">清空</button>
                            <button type="button" class="btn btn-primary" @click="submitForm('ruleForm')">添加</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import Qs from 'qs';
    import jquery from 'jquery/dist/jquery.min.js';
    export default {
        name: "shopList",
        data() {
            return {
                emp:{
                    empAccount:'',
                    empName:'',
                    empStatus:'',
                    empPhone:'',
                    condition:'',
                },
                // 员工列表
                empList:[],
                // 当前页员工列表
                pageList:[],
                // 员工角色列表
                roleList:[],
                // 门店列表
                shopNameList:[],
                // 分页数据
                currentPage: 1,
                totalCount:0,
                pageSize:2,
                // 是否显示添加框
                showAdd:false,
                showEdits:false,
                checked:false,
                radio:'1',
                // 添加表单
                ruleForm: {
                    empAccount:'',
                    empPwd:'',
                    pwd:'',
                    empName:'',
                    empPhone:'',
                    shopNameId:''
                },
                rules: {
                    empAccount: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    empPwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    pwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    shopNameId: [
                        { required: true, message: '请选择归属门店', trigger: 'blur' }
                    ],
                    empName: [
                        { required: true, message: '请输入员工姓名', trigger: 'blur' }
                    ],
                    empPhone: [
                        { required: true, message: '请输入联系电话', trigger: 'blur' },
                        { min: 11, max: 11, message: '请输入正确的手机格式', trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
            this.init();
        },
        methods:{
            // 初始化
            init(){
                // 获取员工列表
                this.$http.post('employee/empCondition').then(result => {
                    this.empList = result.data;
                    // 初始化分页器
                    this.initPage();

                    this.getPageList(this.currentPage);
                });

                // 获取员工角色
                this.$http.post('roles/findAllRoles').then(result => {
                    this.roleList = result.data;
                });
            },
            // 初始化分页器
            initPage(){
                this.totalCount = this.empList.length;
                this.currentPage = 1;
            },
            // 多条件查询
            searchEmp(){
                let params = Qs.stringify(this.emp);
                this.$http.post('employee/empCondition',params).then(result => {
                    this.empList = result.data;
                    // 获取分页数据
                    this.currentPage = 1;
                    this.getPageList(this.currentPage);
                })
            },
            // 根据当前页码获取门店分页数据 pageNo 当前页码
            getPageList(pageNo){
                // 页面大小
                let pageSize = this.pageSize;
                // 进行数据截取
                // 起始下标
                let startIndex = (pageNo-1)*pageSize;
                // 原始数据
                let empList = this.empList;
                // 分页数据
                let pageList = [];
                let pageCapacity = 0;
                console.log('起始下标：'+startIndex);
                for (let i = startIndex;i<empList.length;i++){
                    pageList.push(empList[i]);
                    pageCapacity++;
                    // 判断是否装满当前页
                    if (pageCapacity >= pageSize) {
                        break;
                    }
                }
                // console.log(shopPageList);
                this.pageList = pageList;

                // 强制更新
               // this.$forceUpdate();
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            // 当前页码改变
            handleCurrentChange(val) {
                this.getPageList(val);
            },
            openAdd() {
                // 获取门店列表
                this.$http.post('shop/shopNameList').then(result => {
                    this.shopNameList = result.data;
                })
                this.showAdd = true;
            },
            closeAdd(){
                this.showAdd = false;
            },
            // 导出excel数据
            exportExcel(){
               // jquery.post('http://192.168.16.122:8080/employee/exportEmp',null,null);
               //  this.$http({
               //      method:'post',
               //      url:'employee/exportEmp',
               //      responseType:'blob'
               //  }).then(result => {
               //
               //  });

                window.location.href = 'http://192.168.16.122:8080/employee/exportEmp';
            },
            openEdits(){
                this.showEdits = true;
            },
            closeEdits(){
                this.showEdits = false;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    // 判断两次密码是否一致
                    if (this.ruleForm.empPwd != this.ruleForm.pwd) {
                        this.$message({
                            showClose:true,
                            type:'warning',
                            message:'两次密码不一致'
                        })
                        return false;
                    }
                    if (valid) {
                        let params = Qs.stringify(this.ruleForm);
                        this.$http.post('employee/addEmp',params).then(result => {
                            if (result.data.result){
                                this.$message({
                                    showClose:true,
                                    type:'success',
                                    message:'添加员工成功'
                                })
                            } else{
                                this.$message({
                                    showClose:true,
                                    type:'danger',
                                    message:'添加员工失败'
                                })
                            }
                        })
                    } else {
                        this.$message({
                            showClose:true,
                            type:'warning',
                            message:'请将信息填写完整后在进行操作'
                        })
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