<template>
    <div id="shopList">
        <div class="my-content">
            <!--搜索区-->
            <div class="my-search">
                <el-date-picker
                        v-model="shop.beginDate"
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
                            v-for="item in shopTypeList"
                            :key="item.shopTypeName"
                            :label="item.shopTypeName"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="shop.shopName" filterable placeholder="门店名称" size="small">
                    <el-option
                            v-for="item in shopNameList"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-input v-model="shop.shopAccount" placeholder="门店账号" style="width: 150px" size="small"></el-input>
                <el-button type="primary" size="small" @click="searchShop">查询</el-button>
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
                    <th>
                        <el-checkbox v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
                    </th>
                    <th>序号</th>
                    <th>门店名称</th>
                    <th>门店编码</th>
                    <th>门店类型</th>
                    <th>登陆账号</th>
                    <th>联系人</th>
                    <th>联系人电话</th>
                    <th>门店地址</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in pageList" :key="item.shopName">
                    <th scope="row"><el-checkbox v-model="item.checked" @change="handleCheckedShopsChange(item.checked,item.id)"></el-checkbox></th>
                    <td>{{index+1}}</td>
                    <td>{{item.shopName}}</td>
                    <td>{{item.id}}</td>
                    <td>{{item.shopType.shopTypeName}}</td>
                    <td>{{item.shopAccount}}</td>
                    <td>{{item.shopLinkman}}</td>
                    <td>{{item.shopPhone}}</td>
                    <td>{{item.shopAddress}}</td>
                    <td>{{item.createDate}}</td>
                    <td>
                        <el-tag type="warning" size="small" @click="shopDetail(shop.id)">详情</el-tag>
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
                        :page-sizes="[1,10, 20, 30]"
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
                            <h4 class="modal-title">新增门店信息</h4>
                        </div>
                        <div class="modal-body">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="登陆账号" prop="shopAccount">
                                    <el-input v-model="ruleForm.shopAccount"></el-input>
                                </el-form-item>
                                <el-form-item label="登陆密码" prop="shopPwd">
                                    <el-input v-model="ruleForm.shopPwd"></el-input>
                                </el-form-item>
                                <el-form-item label="确认密码" prop="pwd">
                                    <el-input v-model="ruleForm.pwd"></el-input>
                                </el-form-item>
                                <el-form-item label="门店名称" prop="shopName">
                                    <el-input v-model="ruleForm.shopName"></el-input>
                                </el-form-item>

                                <el-form-item label="门店类别" prop="shopTypeId">
                                    <el-select v-model="ruleForm.shopTypeId" filterable placeholder="全部门店类别" size="small">
                                        <el-option
                                                v-for="item in shopTypeList"
                                                :key="item.shopTypeName"
                                                :label="item.shopTypeName"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="联系人" prop="shopLinkman">
                                    <el-input v-model="ruleForm.shopLinkman"></el-input>
                                </el-form-item>
                                <el-form-item label="联系电话">
                                    <el-input v-model="ruleForm.shopPhone"></el-input>
                                </el-form-item>
                                <!--<el-form-item>
                                    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                                </el-form-item>-->
                            </el-form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" @click="resetForm('ruleForm')">重置</button>
                            <button type="button" class="btn btn-primary" @click="submitForm('ruleForm')">添加</button>
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

        <!--门店详情弹出框-->
        <transition>
            <div class="my-tanchukuang" v-if="showDetail">
                <div>
                    <div class="my-modal modal-content">
                        <div class="modal-header">
                            <button type="button" class="close"><span aria-hidden="true" @click="closeDetail">×</span></button>
                            <h4 class="modal-title">门店详情</h4>
                        </div>
                        <div class="modal-body">
                            <el-form ref="form" :model="form" label-width="80px">
                                <el-form-item label="门店编码">
                                    <el-tag>010258</el-tag>
                                </el-form-item>
                                <el-form-item label="创建时间">
                                    <el-tag>2019-07-14 09:36:02</el-tag>
                                </el-form-item>
                                <el-form-item label="LOGO">
                                    <img class="my-logo" src="../../resource/images/512×512-点png.png">
                                    <span style="color: red;">图片分辨率:建议500*500</span>
                                </el-form-item>
                                <el-form-item label="门店名称">
                                    <el-input v-model="shop.shopName"></el-input>
                                </el-form-item>
                                <el-form-item label="联系人">
                                    <el-input v-model="shop.shopLinkman"></el-input>
                                </el-form-item>
                                <el-form-item label="联系电话">
                                    <el-input v-model="shop.shopPhone"></el-input>
                                </el-form-item>
                                <el-form-item label="营业时间">
                                    <el-col :span="11">
                                        <el-date-picker type="date" placeholder="选择日期" v-model="shop.createDate" style="width: 100%;"></el-date-picker>
                                    </el-col>
                                    <el-col class="line" :span="2">至</el-col>
                                    <el-col :span="11">
                                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="shop.startDate" style="width: 100%;"></el-time-picker>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="门店公告">
                                    <el-input type="textarea" v-model="shop.shopAdvice"></el-input>
                                </el-form-item>
                                <el-form-item label="门店地址">
                                    <el-input v-model="shop.shopAddress"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit">保存</el-button>
                                    <el-button>取消</el-button>
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
    </div>
</template>

<script>
    import Qs from 'qs';
    export default {
        name: "shopList",
        data() {
            return {
                shop:{
                    id:'',
                    shopName:'',
                    beginDate:'',
                    endDate:'',
                    shopTypeId:'',
                    shopTypeName:'',
                    shopAccount:'',
                    shopLinkman:'',
                    shopPhone:'',
                    shopAddress:'',
                    shopAdvice:''
                },
                // 门店列表
                shopList:[],
                // 门店分页数据
                pageList:[
                    {id:'1001',shopName:'厦门沃尔玛',checked:false,shopType:{shopTypeName:'a'},shopAccount:'',shopLinkman:'',shopPhone:'',shopAddress:'',createdDate:''},
                    {id:'1002',shopName:'阿里巴巴',checked:false,shopType:{shopTypeName:'a'},shopAccount:'',shopLinkman:'',shopPhone:'',shopAddress:'',createdDate:''}
                    ],
                // 门店类型
                shopTypeList:[],
                // 门店名称列表
                shopNameList:[],
                // 选中的门店
                checkedShops:[],
                // 分页数据
                currentPage: 1,
                totalCount:0,
                pageSize:10,
                // 是否显示添加框
                showAdd:false,
                // 是否显示批量修改
                showEdits:false,
                showDetail:false,
                // 是否选中所有
                checkAll:false,
                checked:false,
                radio:'1',
                // 添加表单
                ruleForm: {
                    shopName:'',
                    shopAccount:'',
                    shopPwd:'',
                    shopLinkman:'',
                    shopPhone:'',
                    shopTypeId:''
                },
                rules: {
                    shopName: [
                        { required: true, message: '请输入门店名称', trigger: 'blur' },
                    ],
                    shopAccount: [
                        { required: true, message: '请输入门店账号', trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    shopPwd: [
                        { required: true, message: '请输入门店密码', trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    pwd: [
                        { required: true, message: '请再次输入门店密码', trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    shopLinkman: [
                        { required: true, message: '请输入联系人姓名', trigger: 'blur' }
                    ],
                    shopPhone: [
                        // { required: true, message: '请输入门店名称', trigger: 'blur' },
                        { min: 11, max: 11, message: '手机格式不正确', trigger: 'blur' }
                    ],
                    shopTypeId: [
                        { required: true, message: '请选择门店类型', trigger: 'blur' }
                    ],
                }
            }
        },
        created(){
            // 初始化
           this.init();
        },
        methods:{
            // 获取门店列表
            init(){
                // let params = QS.stringify(this.shop);
                this.$http.post('shop/shopList/').then(result => {
                    this.shopList = result.data.shopList;
                    // 初始化分页器
                    this.initPage();

                    // 获取分页数据
                    this.currentPage = 1;
                    this.getPageList(this.currentPage);
                });
                this.$http.post('shop/shopTypeList/').then(result => {
                    this.shopTypeList = result.data;
                });

                this.$http.post('shop/shopNameList/').then(result => {
                    this.shopNameList = result.data;
                });
            },
            // 初始化分页器
            initPage(){
                this.totalCount = this.shopList.length;
                this.currentPage = 1;
            },
            // 多条件查询
            searchShop(){
                let params = Qs.stringify(this.shop);
                this.$http.post('shop/shopList',params).then(result => {
                    this.shopList = result.data.shopList;

                    // 获取分页数据
                    this.currentPage = 1;
                    this.getPageList(this.currentPage);
                })
            },
            // 根据当前页码获取门店分页数据 pageNo 当前页码
            getPageList(pageNo){
                // 取消全选状态
                this.checkAll = false;
                this.checkedShops = [];
                // 页面大小
                let pageSize = this.pageSize;
                // 进行数据截取
                // 起始下标
                let startIndex = (pageNo-1)*pageSize;
                // 原始数据
                let shopList = this.shopList;
                // 分页数据
                let pageList = [];
                let pageCapacity = 0;
                console.log('起始下标：'+startIndex);
                for (let i = startIndex;i<shopList.length;i++){
                    let shop = shopList[i];
                    shop.checked = false;
                    pageList.push(shop);
                    pageCapacity++;
                    // 判断是否装满当前页
                    if (pageCapacity >= pageSize) {
                        break;
                    }
                }
               // console.log(shopPageList);
                this.pageList = pageList;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            // 当前页码改变
            handleCurrentChange(val) {
                this.getPageList(val);
            },
            openAdd() {
                this.showAdd = true;
            },
            closeAdd(){
                this.showAdd = false;
            },
            // 打开批量修改窗口
            openEdits(){
                // 判断是否有选中的门店
                if (this.checkedShops.length == 0){
                    this.$message({
                        showClose: true,
                        type:'warning',
                        message: '请选择要批量操作的数据'
                    });
                    return;
                }
              this.showEdits = true;
            },
            closeEdits(){
                this.showEdits = false;
            },
            shopDetail(id){
                this.shop = this.shopPageList.filter(item => item.id == id)[0];
                this.showDetail = true;
            },
            closeDetail(){
                this.showDetail = false;
            },
            // 选中所有门店
            handleCheckAllChange(val) {
                //console.log(val);
                if (val){
                    // 选中所有
                    this.checkedShops = [];
                    this.shopPageList.forEach((item,index) => {
                        item.checked = true;
                        this.checkedShops.push(item.id);
                    })
                } else{
                    this.shopPageList.forEach((item,index) => {
                        item.checked = false;
                        this.checkedShops = [];
                    })
                }
                // this.shopPageList = this.shopPageList;
                // 强制更新
                this.$forceUpdate();
                console.log(this.checkedShops);
            },
            // 门店选中状态发生改变
            handleCheckedShopsChange(val,id) {
                let shop = {};
                this.shopPageList.forEach((item,index) => {
                    if (item.id == id){
                        item.checked = val;
                        shop = item;
                    }
                })
                //console.log(shop);
                //shop.checked = val;
                if (shop.checked){
                    // 添加到选中的列表中
                    this.checkedShops.push(shop.id);
                }else{
                    this.checkedShops.forEach((item,index) => {
                        if (item == id){
                            this.checkedShops.splice(index,1);
                        }
                    })
                }

                // 判断是否全部选中
                if (this.checkedShops.length == this.shopPageList.length){
                    this.checkAll = true;
                } else{
                    this.checkAll = false;
                }

                this.$forceUpdate();
                // console.log(this.checkedShops);

            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 判断两次密码是否一致
                        if (this.ruleForm.shopPwd!=this.ruleForm.pwd) return false;
                        // 进行添加操作
                        let params = Qs.stringify(this.ruleForm);
                        this.$http.post('shop/addShop',params).then(result => {
                            if (result.data.state){
                                this.init();
                                this.$message({
                                    showClose:true,
                                    type:'success',
                                    message:'门店信息添加成功'
                                })
                            } else{
                                this.$message({
                                    showClose:true,
                                    type:'danger',
                                    message:'门店信息添加失败'
                                })
                            }
                        })

                    } else {
                        this.$message({
                            showClose:true,
                            type:'warning',
                            message:'请填写完整信息'
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
        .el-tag{
            &:hover{
                cursor: pointer;
            }
        }
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

            .my-logo{
                width: 60px;
                height: 60px;
                border: 1px solid gray;
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