<template>
    <div id="goodList">
        <div class="my-content">
            <!--搜索区-->
            <div class="my-search">
                <el-input placeholder="模板名称/模板编码" style="width: 150px" size="small"></el-input>
                <el-button type="primary" size="small" @click="searchShop">查询</el-button>
            </div>
            <!--工具-->
            <div class="my-tools">
                <el-button icon="glyphicon glyphicon-plus" size="small" @click="openAdd">新增商品规格</el-button>
                <el-button icon="glyphicon glyphicon-edit" size="small" @click="batchDeleteSpecTmp">删除规格模板</el-button>
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
                <tr v-for="(item,index) in specTmpList" :key="item.specTmpName">
                    <th scope="row"><el-checkbox v-model="item.checked" @change="handleCheckedShopsChange(item.checked,item.id)"></el-checkbox></th>
                    <td>{{index+1}}</td>
                    <td>{{item.id}}</td>
                    <td>{{item.specTmpName}}</td>
                    <td>{{item.sCount}}</td>
                    <td>
                        <el-tag type="warning" size="small" @click="specDetail(item.id)">详情</el-tag>
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
                                <el-form-item label="模板名称" prop="specTmpName">
                                    <el-input v-model="ruleForm.specTmpName"></el-input>
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
                                <el-form-item v-for="item in specInputs" :label="'规格'+item.count" prop="specName" :key="item.count.toString()">
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
                // 规格模板列表
                specTmpList:[],
                querySpecTmp:{
                    id:'',
                    specTypeName:'',
                },
                // 规格数可选值
                specCount:[1,2,3,4,5,6,7,8,9,10],
                // 当前选中的规格数
                selectedSpecCount:1,
                specInputs:[{count:1,val:''}],
                // 规格详情列表
                specDetailList:[
                    {id:1,specDetailName:'红色'}
                ],
                // 是否显示添加框
                showAdd:false,
                showDetail:false,
                // 是否选中所有
                checkAll:false,
                // 添加表单
                ruleForm: {

                },
                rules: {
                    specTmpName: [
                        { required: true, message: '请输入规格模板名称', trigger: 'blur' },
                    ],
                    specName: [
                        { required: true, message: '请输入规格', trigger: 'blur' },
                    ]
                }
            }
        },
        created(){
            // 初始化
           this.init();
        },
        methods:{
            // 获取规格模板
            init(){
                // let params = Qs.stringify(this.querySpecTmp);
                this.$http.post('specTmp/showSpecTmp/').then(result => {
                    let specTmpList = result.data.specTmpList;
                    specTmpList.forEach((item,index) => {
                        item.checked = false;
                    })
                    this.specTmpList = specTmpList;
                });
            },
            // 批量删除
            batchDeleteSpecTmp(){

            },
            // 根据id删除规格模板
            deleteSpecTmp(id){

            },
            dels(ids){
                // 判断该规格模板下是否存在规格，是否被某个商品占用？

                this.$http.post('specTmp/delSpecTmp','ids='+ids).then(result => {
                    if (result.data.state){
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                    } else{
                        this.$message({
                            type: 'danger',
                            message: '删除失败'
                        });
                    }
                })
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
            openAdd() {
                this.showAdd = true;
            },
            closeAdd(){
                this.showAdd = false;
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
                console.log(this.specStr);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.ruleForm);
                        console.log(this.specName);

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