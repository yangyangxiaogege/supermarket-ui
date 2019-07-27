<template>
    <div id="goodList">
        <div class="my-content">
            <!--搜索区-->
            <div class="my-search">
                <el-input v-model="shop.shopAccount" placeholder="模板名称/模板编码" style="width: 150px" size="small"></el-input>
                <el-button type="primary" size="small" @click="searchShop">查询</el-button>
            </div>
            <!--工具-->
            <div class="my-tools">
                <el-button icon="glyphicon glyphicon-plus" size="small" @click="openAdd">新增商品规格</el-button>
                <el-button icon="glyphicon glyphicon-edit" size="small" @click="openEdits">删除规格模板</el-button>
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
                    <th>模板编码</th>
                    <th>模板名称</th>
                    <th>规格数</th>
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
                    <td>
                        <el-tag type="warning" size="small" @click="shopDetail(shop.id)">详情</el-tag>
                        <el-tag type="danger" size="small">删除</el-tag>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!--添加商品规格-->
        <transition>
            <div class="my-tanchukuang" v-if="showAdd">
                <div>
                    <div class="my-modal modal-content">
                        <div class="modal-header">
                            <button type="button" class="close"><span aria-hidden="true" @click="closeAdd">×</span></button>
                            <h4 class="modal-title">新增商品规格</h4>
                        </div>
                        <div class="modal-body">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="模板名称" prop="shopAccount">
                                    <el-input v-model="ruleForm.shopAccount"></el-input>
                                </el-form-item>
                                <el-form-item label="规格数">
                                    <el-select v-model="selectedSpecCount" filterable size="small">
                                        <el-option
                                                v-for="item in specCount"
                                                :key="item.toString()"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-for="item in specInputs" :label="'规格数'+item.count" prop="shopAccount" :key="item.count.toString()">
                                    <el-input v-model="item.val"></el-input>
                                </el-form-item>
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

        <!--规格详情编辑弹出框-->
        <transition>
            <div class="my-tanchukuang" v-if="showDetail">
                <div>
                    <div class="my-modal modal-content"  style="width: 800px;margin-left: -400px;">
                        <div class="modal-header">
                            <button type="button" class="close"><span aria-hidden="true" @click="closeDetail">×</span></button>
                            <h4 class="modal-title">编辑规格模板</h4>
                        </div>
                        <div class="modal-body">
                            <el-tabs type="border-card">
                                <el-tab-pane label="用户管理">
                                    <el-button type="primary" size="small" @click="addSpecDetail">新增规格内容</el-button>
                                    <el-button type="primary" size="small">修改规格名称</el-button>
                                    <table class="table table-bordered">
                                        <thead>
                                        <tr>
                                            <th>模板编码</th>
                                            <th>模板名称</th>
                                            <th>操作</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>item.shopName</td>
                                            <td>
                                                <el-tag type="warning" size="small" @click="shopDetail(shop.id)">详情</el-tag>
                                                <el-tag type="danger" size="small">删除</el-tag>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </el-tab-pane>
                                <el-tab-pane label="配置管理">配置管理</el-tab-pane>
                                <el-tab-pane label="角色管理">角色管理</el-tab-pane>
                                <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
                            </el-tabs>
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
        name: "goodsSpec",
        data() {
            return {
                goodsSpec:{
                    specTmpName:'',
                    specStr:this.specStr
                },
                // 规格数可选值
                specCount:[1,2,3,4,5,6,7,8,9,10],
                // 当前选中的规格数
                selectedSpecCount:1,
                // 规格
                specInputs:[{count:1,val:''}],
                // 规格详情列表
                specDetailList:[
                    {id:1,specDetailName:'红色'}
                ],
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
            // 新增规格内容
            addSpecDetail(){
                this.$prompt('请输入规格名称', '新增规格内容', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputErrorMessage: '规格名称有误'
                }).then(({ value }) => {
                    this.$http.post('shopType/addShopType','shopTypeName='+value).then(result => {
                        if (result.data.state){
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            });
                            // 重新初始化数据
                            this.init();
                        } else{
                            this.$message({
                                type: 'success',
                                message: '添加失败'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
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
                // this.shop = this.shopPageList.filter(item => item.id == id)[0];
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
        },
        watch:{
            'selectedSpecCount':function (newVal) {
                // 判断增加规格还是减少规格数
                if (newVal>this.specInputs.length){
                    // 增加
                    console.log('增加'+(newVal-this.specInputs.length)+'个');
                    let addCount = newVal-this.specInputs.length;
                    for (let i = 0;i<addCount;i++){
                        console.log('count:'+(this.specInputs.length+1));
                        this.specInputs.push({count:this.specInputs.length+1,val:''});
                    }
                } else{
                    // 减少
                    // 从哪开始移除和移除几个
                    let startIndex = newVal;
                    let reduceCount = this.specInputs.length-newVal;
                    console.log('从下标'+startIndex+'开始移除,移除'+reduceCount+'个');
                    this.specInputs.splice(startIndex,reduceCount);
                }

            }
        },
        computed:{
            specStr(){
                let str = '';
                this.specInputs.forEach((item,index) => {
                    if (index!=this.specInputs.length-1){
                        str=str+item.val+',';
                    } else {
                        str += item.val;
                    }
                })
                console.log(str);
                return str;
            }
        }
    }
</script>

<style scoped lang="less">
    #goodList{
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