<template>
    <div id="goodList">
        <div class="my-content">
            <!--搜索区-->
            <div class="my-search">
                <el-date-picker
                        v-model="queryGoods.beginDate"
                        type="date"
                        size="small"
                        placeholder="开始日期">
                </el-date-picker>
                <el-date-picker
                        v-model="queryGoods.endDate"
                        type="date"
                        size="small"
                        placeholder="结束日期">
                </el-date-picker>
                <el-select v-model="queryGoods.goodsTypeId" filterable placeholder="全部商品类别" size="small">
                    <el-option
                            v-for="item in goodsTypeList"
                            :key="item.goodsTypeName"
                            :label="item.goodsTypeName"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-input v-model="queryGoods.condition" placeholder="商品条码/商品名称" style="width: 150px" size="small"></el-input>
                <el-button type="primary" size="small" @click="searchGoods">查询</el-button>
            </div>
            <!--工具-->
            <div class="my-tools">
                <el-button icon="glyphicon glyphicon-plus" size="small" @click="openAdd">新增商品信息</el-button>
                <el-button icon="glyphicon glyphicon-edit" size="small" @click="openSort">编辑排序</el-button>
                <el-button icon="glyphicon glyphicon-edit" size="small" @click="openEdits">批量修改</el-button>
                <el-button icon="glyphicon glyphicon-edit" size="small" @click="dels">批量删除</el-button>
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
                    <th>商品条码</th>
                    <th>商品名称</th>
                    <th>价格</th>
                    <th>库存</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in pageList" :key="item.goodsName">
                    <th scope="row"><el-checkbox v-model="item.checked" @change="handleCheckedShopsChange(item.checked,item.id)"></el-checkbox></th>
                    <td>{{index+1}}</td>
                    <td>{{item.goodsCode}}</td>
                    <td>{{item.goodsName}}</td>
                    <td>零售价:{{item.price}}批发价:{{item.wholePrice}}<br>进价:{{item.costPrice}}</td>
                    <td>{{item.goodsCount}}</td>
                    <td>
                        <el-tag type="warning" size="small" @click="goodsDetail(shop.id)">详情</el-tag>
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
        <!--添加商品弹出框-->
        <transition>
            <div class="my-tanchukuang" v-if="showAdd">
                <div>
                    <div class="my-modal modal-content">
                        <div class="modal-header">
                            <button type="button" class="close"><span aria-hidden="true" @click="closeAdd">×</span></button>
                            <h4 class="modal-title">新增商品信息</h4>
                        </div>
                        <div class="modal-body">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="商品类别" prop="goodsTypeId">
                                    <el-select v-model="ruleForm.goodsTypeId" filterable placeholder="请选择商品类别" size="small">
                                        <el-option
                                                v-for="item in goodsTypeList"
                                                :key="item.goodsTypeName"
                                                :label="item.goodsTypeName"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="商品条码" prop="goodsCode">
                                    <el-input v-model="ruleForm.goodsCode"></el-input>
                                </el-form-item>
                                <el-form-item label="商品名称" prop="goodsName">
                                    <el-input v-model="ruleForm.goodsName"></el-input>
                                </el-form-item>
                                <el-form-item label="供应商" prop="providerId">
                                    <el-select v-model="ruleForm.providerId" filterable placeholder="请选择供应商" size="small">
<!--                                        <el-option-->
<!--                                                v-for="item in providerList"-->
<!--                                                :key="item.providerName"-->
<!--                                                :label="item.providerName"-->
<!--                                                :value="item.id">-->
<!--                                        </el-option>-->
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="单位">
                                    <el-input v-model="ruleForm.unitId"></el-input>
                                </el-form-item>
                                <el-form-item label="零售价" prop="price">
                                    <el-input v-model="ruleForm.price" placeholder="请输入商品零售价，单位（元）"></el-input>
                                </el-form-item>
                                <el-form-item label="批发价" prop="wholePrice">
                                    <el-input v-model="ruleForm.wholePrice" placeholder="请输入商品批发价，单位（元）"></el-input>
                                </el-form-item>
                                <el-form-item label="进价" prop="costPrice">
                                    <el-input v-model="ruleForm.costPrice" placeholder="请输入商品进货价，单位（元）"></el-input>
                                </el-form-item>
                                <el-form-item label="产地" prop="goodsAddress">
                                    <el-input v-model="ruleForm.goodsAddress"></el-input>
                                </el-form-item>
                                <el-form-item label="生产日期" prop="yieldDate">
                                    <el-date-picker
                                            v-model="ruleForm.yieldDate"
                                            align="right"
                                            type="date"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="保质期(天)" prop="exporatopmDay">
                                    <el-input-number v-model="ruleForm.exporatopmDay" :min="1" :max="100000"></el-input-number>
                                </el-form-item>
                                <el-form-item label="过期日期" prop="expirationDate">
                                    <el-date-picker
                                            v-model="ruleForm.expirationDate"
                                            align="right"
                                            type="date"
                                            placeholder="选择日期">
                                    </el-date-picker>
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

        <!--排序选择-->
        <transition>
            <div class="my-tanchukuang" v-if="showSort">
                <div>
                    <div class="my-modal modal-content">
                        <div class="modal-header">
                            <button type="button" class="close"><span aria-hidden="true" @click="closeSort">×</span></button>
                            <h4 class="modal-title">商品排序</h4>
                        </div>
                        <div class="modal-body">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="排序方式" prop="shopTypeId">
                                    <el-select v-model="ruleForm.shopTypeId" filterable placeholder="请选择排序方式" size="small">
                                        <el-option label="商品编号"></el-option>
                                        <el-option label="商品名称"></el-option>
                                        <el-option label="商品加入日期"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="排序类别" prop="shopLinkman">
                                    <el-radio  label="1">升序</el-radio>
                                    <el-radio  label="2">降序</el-radio>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" @click="resetForm('ruleForm')">重置</button>
                            <button type="button" class="btn btn-primary" @click="submitForm('ruleForm')">确定</button>
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
        name: "goodsList",
        data() {
            return {
                // 查询商品条件
                queryGoods:{},
                // 商品列表
                goodsList:[],
                // 商品分页数据
                pageList:[
                    {id:'1',goodsCode:'1001',goodsName:'养乐多',shopName:'洋洋便利店',price:'5',wholePrice:'5',costPrice:'5',goodsCount:'5',yieldDate:'2019-8-9'},
                    {id:'2',goodsCode:'1002',goodsName:'养乐多多',shopName:'洋洋便利店',price:'5',wholePrice:'5',costPrice:'5',goodsCount:'5',yieldDate:'2019-8-9'}
                ],
                // 商品类型
                goodsTypeList:[{id:1,goodsTypeName:'内衣'},{id:2,goodsTypeName:'鞋包'}],
                // 选中的商品
                checkedGoods:[],
                // 分页数据
                currentPage: 1,
                totalCount:0,
                pageSize:10,
                // 是否显示添加框
                showAdd:false,
                // 是否显示排序选择
                showSort:false,
                // 是否显示批量修改
                showEdits:false,
                // 是否显示详情
                showDetail:false,
                // 是否选中所有
                checkAll:false,
                // 添加商品的表单对象
                ruleForm: {
                    price:'',
                    shopAccount:'',
                    shopPwd:'',
                    shopLinkman:'',
                    shopPhone:'',
                    shopTypeId:''
                },
                rules: {
                    price: [
                        { required: true, message: '请输入门店名称', trigger: 'blur' },
                        { pattern:/(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/,message:'请输入合法金额',trigger:'blur'}
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
            // 打开排序选择
            openSort(){
                this.showSort = true;
            },
            closeSort(){
                this.showSort = false;
            },
            // 获取商品列表
            init(){
                this.$http.post('goods/findByCondition/').then(result => {
                    this.goodsList = result.data;
                    // 初始化分页器
                    this.initPage();
                    // 获取分页数据
                    this.getPageList(this.currentPage);
                });
                // 获取商品类型
                this.$http.post('goodsType/findByCondition/').then(result => {
                    this.goodsTypeList = result.data;
                });
            },
            // 初始化分页器
            initPage(){
                this.totalCount = this.goodsList.length;
                this.currentPage = 1;
            },
            // 根据当前页码获取门店分页数据 pageNo 当前页码
            getPageList(pageNo){
                // 取消全选状态
                this.checkAll = false;
                this.checkedGoods = [];
                // 页面大小
                let pageSize = this.pageSize;
                // 进行数据截取
                // 起始下标
                let startIndex = (pageNo-1)*pageSize;
                // 原始数据
                let goodsList = this.goodsList;
                // 分页数据
                let pageList = [];
                let pageCapacity = 0;
                for (let i = startIndex;i<goodsList.length;i++){
                    let goods = goodsList[i];
                    goods.checked = false;
                    pageList.push(goods);
                    pageCapacity++;
                    // 判断是否装满当前页
                    if (pageCapacity >= pageSize) {
                        break;
                    }
                }
                this.pageList = pageList;
            },
            // 多条件查询
            searchGoods(){
                let params = Qs.stringify(this.queryGoods);
                this.$http.post('goods/goodsList',params).then(result => {
                    this.goodsList = result.data.shopList;
                    // 获取分页数据
                    this.initPage();
                    this.getPageList(this.currentPage);
                })
            },
            // 当前页面大小发生改变
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.getPageList(this.currentPage);
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
                if (this.checkedGoods.length == 0){
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
            // 选中所有门店
            handleCheckAllChange(val) {
                //console.log(val);
                if (val){
                    // 选中所有
                    this.checkedGoods = [];
                    this.pageList.forEach((item,index) => {
                        item.checked = true;
                        this.checkedGoods.push(item.id);
                    })
                } else{
                    this.pageList.forEach((item,index) => {
                        item.checked = false;
                        this.checkedGoods = [];
                    })
                }
                // 强制更新
                this.$forceUpdate();
            },
            // 商品选中状态发生改变
            handleCheckedShopsChange(val,id) {
                let goods = {};
                this.pageList.forEach((item,index) => {
                    if (item.id == id){
                        item.checked = val;
                        goods = item;
                    }
                })
                // 判断是否选中
                if (goods.checked){
                    // 添加到选中的列表中
                    this.checkedGoods.push(goods.id);
                }else{
                    this.checkedGoods.forEach((item,index) => {
                        if (item == id){
                            this.checkedGoods.splice(index,1);
                        }
                    })
                }
                // 判断是否全部选中
                if (this.checkedGoods.length == this.pageList.length){
                    this.checkAll = true;
                } else{
                    this.checkAll = false;
                }

                this.$forceUpdate();
            },
            shopDetail(id){
                this.shop = this.pageList.filter(item => item.id == id)[0];
                this.showDetail = true;
            },
            closeDetail(){
                this.showDetail = false;
            },
            dels(){

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
            z-index: 1000;
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