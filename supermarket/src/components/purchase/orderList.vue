<template>
    <div id="orderList">
        <div class="my-content">
            <!--搜索区-->
            <div class="my-search">
                <el-input v-model="queryOrder.condition" placeholder="供应商名称/收货人/收获电话/地址" style="width: 250px" size="small"></el-input>
                <el-select v-model="queryOrder.takeState" filterable placeholder="请选择收货状态" size="small">
                    <el-option label="请选择收货状态" value=""></el-option>
                    <el-option value="0" label="待收货"></el-option>
                    <el-option value="1" label="已收货"></el-option>
                    <el-option value="2" label="已退货"></el-option>
                </el-select>
                <el-select v-model="queryOrder.singleState" filterable placeholder="请选择审核状态" size="small">
                    <el-option label="请选择审核状态" value=""></el-option>
                    <el-option value="0" label="待审核"></el-option>
                    <el-option value="1" label="已审核"></el-option>
                    <el-option value="2" label="未通过审核"></el-option>
                </el-select>
                <el-button type="primary" size="small" @click="searchOrder">查询</el-button>
            </div>
            <!--工具-->
            <div class="my-tools">
                <el-button icon="glyphicon glyphicon-plus" size="small" @click="openAdd">新建采购单</el-button>
                <el-button icon="glyphicon glyphicon-refresh" size="small" @click="refresh">刷新数据</el-button>
            </div>
            <!--数据-->
            <table class="my-tab table table-bordered">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>单号</th>
                    <th>店铺名称</th>
                    <th>供应商</th>
                    <th>单据状态</th>
                    <th>收获状态</th>
                    <th>单据日期</th>
                    <th>收货人</th>
                    <th>收获电话</th>
                    <th>地址</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in pageList" :key="item.id.toString()">
                    <td>{{index+1}}</td>
                    <td>{{item.id}}</td>
                    <td>{{item.shopName}}</td>
                    <td>{{item.proName}}</td>
                    <td v-if="item.singleState == 0">待审核</td>
                    <td v-if="item.singleState == 1">已审核</td>
                    <td v-if="item.singleState == 2">未通过审核</td>
                    <td v-if="item.takeState == 0">待收货</td>
                    <td v-if="item.takeState == 1">已收货</td>
                    <td v-if="item.takeState == 2">已退货</td>
                    <td>{{item.placeOrderDate}}</td>
                    <td>{{item.empName}}</td>
                    <td>{{item.empPhone}}</td>
                    <td>{{item.shopAddress}}</td>
                    <td>
                        <el-tag type="warning" size="small" @click="orderDetail(item.id)">详情</el-tag>
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

        <!--添加采购订单弹出框-->
        <transition>
            <div class="my-tanchukuang" v-if="showAdd">
                <div>
                    <div class="my-modal modal-content" style="width: 800px;margin-left: -400px;">
                        <div class="modal-header">
                            <button type="button" class="close"><span aria-hidden="true" @click="closeAdd">×</span></button>
                            <h4 class="modal-title">新增采购订单</h4>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-success" role="alert">采购订单信息</div>
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="供应商" prop="proId">
                                    <el-select v-model="ruleForm.proId" filterable placeholder="请选择供应商" size="small" @change="proChange">
                                        <el-option
                                                v-for="item in providerList"
                                                :key="item.proName"
                                                :label="item.proName"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="收获店铺" prop="shopId">
                                    <el-input v-model="ruleForm.shopName" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="期望到货" prop="readyDate">
                                    <el-date-picker
                                            v-model="ruleForm.readyDate"
                                            type="date"
                                            size="small"
                                            value-format="yyyy/MM/dd"
                                            placeholder="开始日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="收货人" prop="empId">
                                    <el-select v-model="ruleForm.empId" filterable placeholder="请选择收货人" size="small">
                                        <el-option
                                                v-for="item in empList"
                                                :key="item.id.toString()"
                                                :label="item.empName"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                            </el-form>
                            <div class="alert alert-success" role="alert">采购订单详情</div>
                            <!--操作-->
                            <el-button icon="glyphicon glyphicon-plus" size="small" @click="openChooseGoods">添加商品</el-button>
                            <el-button icon="glyphicon glyphicon-plus" size="small" @click="removeChooseGoods" style="color:red;">删除商品</el-button>
                            <!--明细-->
                            <table class="my-tab table table-bordered">
                                <thead>
                                <tr>
                                    <th>
                                        <el-checkbox v-model="checkedAllDetail" @change="handleCheckedAllDetailGoodsChange"></el-checkbox>
                                    </th>
                                    <th>序号</th>
                                    <th>商品条码</th>
                                    <th>商品名称</th>
                                    <th>价格</th>
                                    <th>采购数量</th>
                                    <th>总金额</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in goodsList" :key="item.goodsName">
                                    <th scope="row"><el-checkbox v-model="item.checked" @change="handleCheckedDetailGoodsChange(item.checked,item.id)"></el-checkbox></th>
                                    <td>{{index+1}}</td>
                                    <td>{{item.goodsCode}}</td>
                                    <td>{{item.goodsName}}</td>
                                    <td>{{item.costPrice}}</td>
                                    <td>
                                        <el-tag @click="changeGoodsCount(item)">{{item.goodsCount}}</el-tag>
                                    </td>
                                    <td>
                                        {{item.totalMoney}}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" @click="submitForm('ruleForm')">添加</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!--选择商品-->
        <transition>
            <div class="my-tanchukuang" v-if="showChooseGoods" style="z-index: 2000">
                <div>
                    <div class="my-modal modal-content">
                        <div class="modal-header">
                            <button type="button" class="close"><span aria-hidden="true" @click="closeChooseGoods">×</span></button>
                            <h4 class="modal-title">选择商品</h4>
                        </div>
                        <div class="modal-body">
                            <table class="my-tab table table-bordered">
                                <thead>
                                <tr>
                                    <th>
                                        <el-checkbox v-model="checkedAllProGoods" @change="handleCheckAllProGoodsChange"></el-checkbox>
                                    </th>
                                    <th>序号</th>
                                    <th>商品条码</th>
                                    <th>商品名称</th>
                                    <th>进货单价</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in proGoods" :key="item.goodsName">
                                    <th scope="row"><el-checkbox v-model="item.checked" @change="handleCheckedProGoodsChange(item.checked,item.id)"></el-checkbox></th>
                                    <td>{{index+1}}</td>
                                    <td>{{item.goodsCode}}</td>
                                    <td>{{item.goodsName}}</td>
                                    <td>{{item.costPrice}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" @click="addGoodsToGoodsList">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!--采购订单详情弹出框-->
        <transition>
            <div class="my-tanchukuang" v-if="showDetail">
                <div>
                    <div class="my-modal modal-content" style="width: 800px;margin-left: -400px;">
                        <div class="modal-header">
                            <button type="button" class="close"><span aria-hidden="true" @click="closeDetail">×</span></button>
                            <h4 class="modal-title">采购订单详情</h4>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-success" role="alert">采购订单信息</div>
                            <el-form label-width="100px" class="demo-ruleForm">
                                <el-form-item label="供应商">
                                   <el-input v-model="order.provider.proName" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="收获店铺">
                                    <el-input v-model="order.shop.shopName" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="期望到货日期">
                                    <el-input v-model="order.readyDate" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="收货人">
                                    <el-input v-model="order.employee.empName" :disabled="true"></el-input>
                                </el-form-item>
                            </el-form>
                            <div class="alert alert-success" role="alert">采购订单详情</div>
                            <!--明细-->
                            <table class="my-tab table table-bordered">
                                <thead>
                                <tr>
                                    <th>序号</th>
                                    <th>商品条码</th>
                                    <th>商品名称</th>
                                    <th>价格</th>
                                    <th>采购数量</th>
                                    <th>总金额</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in order.orderDetailVoList" :key="item.id.toString()">
                                    <td>{{index+1}}</td>
                                    <td>{{item.goodsVo.goodsCode}}</td>
                                    <td>{{item.goodsVo.goodsName}}</td>
                                    <td>{{item.goodsVo.costPrice}}</td>
                                    <td>{{item.goodsCount}}</td>
                                    <td>{{item.totalMoney}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" @click="pass(order.id,1)" >通过审核</button>
                            <button type="button" class="btn btn-primary" @click="noPass(order.id,2)" >审核不通过</button>
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
        name: "orderList",
        inject:['reload'],
        data() {
            return {
                order:{},
                goodsCount:0,
                orderList:[],
                // 订单明细中的商品列表
                goodsList:[],
                // 供应商提供的商品
                proGoods:[],
                //-----------------
                // 查询采购订单条件对象
                queryOrder:{},
                // 本店供应商列表
                providerList:[],
                // 采购订单分页数据
                pageList:[],
                // 门店名称列表
                shopNameList:[],
                // 员工列表
                empList:[],
                // 选中的订单明细（要进行持久化的商品数据）
                checkedDetailGoods:[],
                // 选中的供应商提供的商品（要添加到持久化的商品中的数据）
                checkedProGoods:[],
                // 分页数据
                currentPage: 1,
                totalCount:0,
                pageSize:10,
                // 是否显示添加框
                showAdd:false,
                showChooseGoods:false,
                showDetail:false,
                // 是否选中所有要进行持久话的商品
                checkedAllDetail:false,
                // 是否选中供应商下的所有商品
                checkedAllProGoods:false,
                ruleForm: {},
                rules: {
                    proId: [
                        { required: true, message: '请选择供应商', trigger: 'blur' },
                    ],
                    readyDate: [
                        { required: true, message: '请录入期望到货日期', trigger: 'blur' }
                    ],
                    empId: [
                        { required: true, message: '请选择收货人', trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
            // 初始化
            this.init();
        },
        methods:{
            // 刷新当前页面
            refresh(){
                this.reload();
            },
            // 获取采购订单列表
            init(){
                this.$http.post('order/orderList/').then(result => {
                    this.orderList = result.data.orderVoList;
                    // 初始化分页器
                    this.initPage();
                    this.getPageList(this.currentPage);
                });
            },
            // 初始化分页器
            initPage(){
                this.totalCount = this.orderList.length;
                this.currentPage = 1;
            },
            // 多条件查询
            searchOrder(){
                let params = Qs.stringify(this.queryOrder);
                this.$http.post('order/orderList',params).then(result => {
                    this.orderList = result.data.orderVoList;
                    // 获取分页数据
                    this.initPage();
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
                let orderList = this.orderList;
                // 分页数据
                let pageList = [];
                let pageCapacity = 0;
                for (let i = startIndex;i<orderList.length;i++){
                    let order = orderList[i];
                    if (order.shop !=null){
                        order.shopName = order.shop.shopName;
                        order.shopAddress = order.shop.shopAddress;
                    }
                    if (order.employee != null){
                        order.empName = order.employee.empName;
                        order.empPhone = order.employee.empPhone;
                    }
                    if (order.provider !=null){
                        order.proName = order.provider.proName;
                    }
                    pageList.push(order);
                    pageCapacity++;
                    // 判断是否装满当前页
                    if (pageCapacity >= pageSize) {
                        break;
                    }
                }
                this.pageList = pageList;
            },
            // 页面大小改变
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.getPageList(this.currentPage);
            },
            // 当前页码改变
            handleCurrentChange(val) {
                this.getPageList(val);
            },
            // 打开新建采购单
            openAdd() {
                this.ruleForm = {};
                this.checkedDetailGoods = [];
                this.checkedProGoods = [];
                // 获取本店供应商列表（状态为正常）
                this.$http.post('provider/proList','shopId='+sessionStorage.getItem("shopId")+'&proStatus=1').then(result => {
                    this.providerList = result.data.providerList;
                });
                // 获取本店店铺名
                this.$http.post('shop/shopList','id='+sessionStorage.getItem("shopId")).then(result => {
                    let shop = result.data.shopList[0];
                    if (shop != null) {
                        this.ruleForm.shopName = shop.shopName;
                    }
                });
                // 获取本店员工 （正常）
                this.$http.post('shop/selEmpByShopId','id='+sessionStorage.getItem("shopId")+'&empStatus=0').then(result => {
                    this.empList = result.data;
                });
                this.showAdd = true;
            },
            // 更改供应商
            proChange(){
                this.checkedAllDetail = false;
                this.checkedDetailGoods = [];
                this.goodsList = [];
            },
            // 打开选择采购商品的弹出框
            openChooseGoods(){
                if (this.ruleForm.proId == null || this.ruleForm.proId == ''){
                    this.$message({
                        showClose:true,
                        type:'warning',
                        message:'请选择供应商'
                    })
                    return;
                }
                this.checkedProGoods = [];
                this.checkedAllProGoods = false;
                // 获取供应商下的所有商品
                this.$http.post('goods/selGoodsByProId','providerId='+this.ruleForm.proId).then(result => {
                    this.proGoods = result.data;
                    this.showChooseGoods = true;
                })
            },
            // 移除选中的商品
            removeChooseGoods(){
                if (this.checkedDetailGoods.length == 0){
                    this.$message({
                        showClose:true,
                        type:'warning',
                        message:'请选择要移除的商品信息'
                    })
                    return;
                }
                this.checkedDetailGoods.forEach((item,idx) => {
                    this.goodsList.forEach((goods,index) => {
                        if (goods.id == item){
                            this.goodsList.splice(index,1);
                            // this.checkedDetailGoods.splice(idx,1);
                        }
                    })
                })
                this.checkedDetailGoods = [];
                this.checkedAllDetail = false;
            },
            // 手动改变商品数量时重新计算订单信息
            changeGoodsCount(goods){
                this.$prompt('请输入商品数量', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[1-9]{1,}[\d]*$/,
                    inputValue:goods.goodsCount,
                    inputErrorMessage: '商品数量必须是一个正整数'
                }).then(({ value }) => {
                   goods.goodsCount = value;
                   goods.totalMoney = parseInt(goods.goodsCount)*parseFloat(goods.costPrice);
                   this.$forceUpdate();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            // 将选择的商品添加到goodsList中
            addGoodsToGoodsList(){
                if (this.checkedProGoods.length == 0){
                    this.$message({
                        showClose:true,
                        type:'warning',
                        message:'请选择要添加的商品'
                    })
                    return;
                }
                // 将选中的商品添加goodsList
                this.proGoods.forEach((goods,index)=> {
                    this.checkedProGoods.forEach((item,index) => {
                        if (goods.id == item) {
                            goods.checked = false;
                            // 判断商品是否已经存在
                            let detail = this.goodsList.filter(detail => detail.id == item)[0];
                            if (detail != null){
                                console.log("come in");
                                detail.goodsCount=parseInt(detail.goodsCount)+1;
                                detail.totalMoney=parseInt(detail.goodsCount)*parseFloat(detail.costPrice);
                            } else{
                                goods.goodsCount = 1;
                                goods.totalMoney = parseInt(goods.goodsCount)*parseFloat(goods.costPrice);
                                this.goodsList.push(goods);
                            }
                        }
                    })
                })
                this.showChooseGoods = false;
                this.$forceUpdate();
            },
            closeChooseGoods(){
                this.showChooseGoods = false;
            },
            closeAdd(){
                this.showAdd = false;
            },
            // 选中采购订单中所有要进行持久化的商品
            handleCheckedAllDetailGoodsChange(val) {
               this.handleCheckedAllStateChange(val,this.goodsList,0);
            },
            // 商品选中状态发生改变（订单明细）
            handleCheckedDetailGoodsChange(val,id) {
                this.handleCheckedStateChange(val,id,this.checkedDetailGoods,this.goodsList,this.checkedAllDetail,0);
            },
            // 选中供应商下的所有商品
            handleCheckAllProGoodsChange(val) {
                this.handleCheckedAllStateChange(val,this.proGoods,1);
            },
            // 商品选中状态发生改变(供应商)
            handleCheckedProGoodsChange(val,id) {
                this.handleCheckedStateChange(val,id,this.checkedProGoods,this.proGoods,this.checkedAllProGoods,1);
            },
            // 选中所有状态发生改变
            // val 选中状态 checkedList 选中项的列表 dataSourceList 原始数据（及供选择的数据）
            // who 0:订单明细（checkedDetailGoods），1：供应商（checkedProGoods）
            handleCheckedAllStateChange(val,dataSourceList,who){
                // 选中所有
                let checkedList = [];
                if (val){
                    dataSourceList.forEach((item,index) => {
                        item.checked = true;
                        checkedList.push(item.id);
                    })
                } else{
                    dataSourceList.forEach((item,index) => {
                        item.checked = false;
                        checkedList = [];
                    })
                }
                if (who == 0){
                    this.checkedDetailGoods = checkedList;
                } else{
                    this.checkedProGoods  = checkedList;
                }
                // 强制更新
                this.$forceUpdate();
            },
            // 选中状态发生改变
            handleCheckedStateChange(val,id,checkedList,dataSourceList,checkedAll,who){
                let object = {};
                dataSourceList.forEach((item,index) => {
                    if (item.id == id){
                        item.checked = val;
                        object = item;
                    }
                })
                // 判断是否选中
                if (object.checked){
                    // 添加到选中的列表中
                    checkedList.push(object.id);
                }else{
                    checkedList.forEach((item,index) => {
                        if (item == id){
                            checkedList.splice(index,1);
                        }
                    })
                }
                // 判断是否全部选中
                if (checkedList.length == dataSourceList.length){
                    checkedAll = true;
                } else{
                    checkedAll = false;
                }

                if (who == 0){
                    this.checkedAllDetail = checkedAll;
                    this.checkedDetailGoods = checkedList;
                } else{
                    this.checkedAllProGoods = checkedAll;
                    this.checkedProGoods  = checkedList;
                }
                this.$forceUpdate();
            },
            // 供应商详情
            orderDetail(id){
                this.$http.post('order/selOrderAndDetailByOrderId/','id='+id).then(result => {
                    this.order = result.data[0];
                    this.showDetail = true;
                });
            },
            // 通过审核
            pass(orderId,singleState){
                // 获取当前订单状态，并进行判断是否需要修改
                this.$http.post('order/orderList/','id='+orderId).then(result => {
                    let order = result.data.orderVoList[0];
                    // 目标状态和当前状态一致
                    if (order.singleState == singleState){
                        this.$message({
                            showClose:true,
                            type:'info',
                            message:'该订单已审核通过'
                        });
                    } else{
                        // 通过审核
                        this.updateOrderSingleState(orderId,singleState);
                    }

                });
            },
            // 拒绝通过审核
            noPass(orderId,singleState){
                // 获取当前订单状态，并进行判断是否需要修改
                this.$http.post('order/orderList/','id='+orderId).then(result => {
                    let order = result.data.orderVoList[0];
                    // 目标状态和当前状态一致
                    if (order.singleState == singleState){
                        this.$message({
                            showClose:true,
                            type:'info',
                            message:'该订单已被拒绝通过审核'
                        });
                    } else{
                        // 判断是否已收货或者退货
                        if (order.takeState == 1 || order.takeState == 2){
                            this.$message({
                                showClose:true,
                                type:'info',
                                message:'该订单审核状态已被修改'
                            });
                        } else{
                            // 拒绝通过审核
                            this.updateOrderSingleState(orderId,singleState);
                        }
                    }

                });
            },
            // 修改单据状态
            updateOrderSingleState(orderId,singleState){
                // 获取当前订单状态，并进行判断是否需要修改
                this.$http.post('order/upSingleState/','id='+orderId+'&singleState='+singleState).then(result => {
                    if (result.data.state){
                        this.$message({
                            showClose:true,
                            type:'success',
                            message:'操作成功'
                        });
                        this.init();
                    } else{
                        this.$message({
                            showClose:true,
                            type:'error',
                            message:'操作失败'
                        });
                    }
                });
            },
            closeDetail(){
                this.showDetail = false;
            },
            // 添加
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 判断订单详情列表是否为空
                        if (this.goodsList.length == 0){
                            this.$message({
                                showClose:true,
                                type:'warning',
                                message:'请选择要采购的商品'
                            });
                            return false;
                        }

                        // 生成采购订单
                        let params = Qs.stringify(this.ruleForm);
                        let goodsList = JSON.stringify(this.goodsList);

                        // console.log(params+'---'+goodsList);
                        // return;
                        this.$http.post('order/insertOrder','params='+params+'&shopId='+sessionStorage.getItem("shopId")+'&str='+goodsList).then(result => {
                            if (result.data.state){
                                this.$message({
                                    showClose:true,
                                    type:'success',
                                    message:'添加成功'
                                });
                                this.init();
                                let shopName = this.ruleForm.shopName;
                                this.ruleForm = {};
                                this.ruleForm.shopName = shopName;
                                this.checkedDetailGoods = [];
                                this.checkedAllDetail = false;
                                this.goodsList = [];
                            } else{
                                this.$message({
                                    showClose:true,
                                    type:'error',
                                    message:'添加失败'
                                });
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
    #orderList{
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