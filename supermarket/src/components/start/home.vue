<template>
    <div id="home">
       <div class="header container-fluid">
           <div class="header-left">
               <a href="#">
                   <img src="../../resource/images/logo_03.png" alt="">
               </a>
           </div>
           <div class="header-right">
               <ul class="my-nav">
                   <li><span class="glyphicon glyphicon-repeat" @click="refresh"></span></li>
                   <li><span></span>当前时间</li>
                   <li><span></span>当前时间</li>
                   <li><span></span>当前时间</li>
                   <li class="my-info">
                       <img src="../../resource/images/512×512-点png.png">
                       <span>深圳优户-点电报指挥收银</span>
                       <div class="my-info-list">
                           <ul>
                               <li><span class="glyphicon glyphicon-user"></span>个人信息</li>
                               <li><span class="glyphicon glyphicon-pencil"></span>修改密码</li>
                               <li><span class="glyphicon glyphicon-list-alt"></span>操作日志</li>
                               <li style="height: 60px;line-height: 60px;border-top: 1px solid black;"><span class="glyphicon glyphicon-off"></span>退出系统</li>
                           </ul>
                       </div>
                   </li>
               </ul>
           </div>
       </div>
        <div class="box row">
            <div class="aside">
                <el-menu default-active="1" class="el-menu-vertical-demo"
                         background-color="#37424F"
                         text-color="#fff" :unique-opened="true">
                    <el-submenu v-for="menu in menus" :index="menu.index" :key="menu.index">
                        <template slot="title">
                            <i :class="menu.icon"></i>
                            <span slot="title">{{menu.name}}</span>
                        </template>
                        <el-menu-item-group v-for="sub in menu.sub" :key="sub.index">
                            <el-menu-item :index="sub.index" @click="addTab(sub.name,sub.routerName)">{{sub.name}}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </div>
            <div class="main">
                <!-- 使用element 组件 -->
                <el-tabs type="border-card" v-model="activeName" @tab-click="handleOpen" @tab-remove="handleClose" style="height: 100%;">
                    <el-tab-pane style="height: 100%" v-for="item in tabs" :name="item.name" :label="item.label" :key="item.label" :closable="item.closable">
                    </el-tab-pane>
                </el-tabs>
                <div class="main-content">
                    <router-view v-if="isRouterAlive" :key="activeDate"></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // 导入menu
    import menus from '../../menu.js';
    export default {
        name: "home",
        provide(){
            return {
                reload:this.reload
            }
        },
        data() {
            return {
                isRouterAlive:true,
                activeDate:'',//时间戳，改变时标识view-router中的内容发生变化
                activeName:'1', //当前选中的tab
                tabs:[ //选项卡
                    {name:'1',label:'首页',routerName:'welcome'},
                    {name:'2',label:'测试组件',routerName:'test',closable:true}
                ],
                menus:menus //导航菜单
            };
        },
        created(){
          this.$router.push({name:'welcome'});
        },
        methods: {
            // 局部刷新组件
            reload(){
                this.isRouterAlive = false;
                this.$nextTick(() => {
                    this.isRouterAlive = true;
                })
            },
            // 刷新router-view内容
            refresh(){
                this.activeDate = Math.random().toString();
            },
            // 添加选项卡
            addTab(tabName,routerName){
                // 判断该选项卡是否已经打开
                let isHas = true;
                this.tabs.find( item => {
                    // tabList中已经存在该tab项
                    if (item.label == tabName) {
                        this.activeName = item.name;
                        this.$router.push({name:routerName});
                        isHas = false;
                    }
                })

                if (isHas == false) return;
                let tab = {
                    name:(this.tabs.length+1).toString(),
                    label:tabName,
                    routerName:routerName,
                    closable:true
                }

                this.tabs.push(tab);
                this.activeName = tab.name;
                this.$router.push({name:routerName})
            },
            // 选中选项卡时触发该事件
            handleOpen(key, keyPath) {
                let tab = this.tabs.filter(item => item.name == key.name)[0];
                console.log(tab);
                this.$router.push({name:tab.routerName});
            },
            handleClose(targetName) {
                // 当前tab选中项的name
                let activeName = this.activeName;

                // 移除当前tab后，让下一个选中（如果后边有tab项）或者上一个选中（后边没有tab）
                let tabList = this.tabs;
                tabList.forEach((item,index) => {
                    // 当前选中项和操作项是同一个，需要重新选中tab
                    if (item.name == targetName) {
                        let nexTab = tabList[index+1] || tabList[index-1];
                        if (nexTab) {
                            activeName = nexTab.name;
                            this.$router.push({ name: nexTab.routerName});
                        }
                    }
                });

                // 重新将获取tab列表
                this.activeName = activeName;
                this.tabs = tabList.filter(tab => tab.name!=targetName);
                
            }
        }
    }
</script>

<style lang="less">
    #home{
        height: 100%;

        /*element组件样式*/
        .el-menu{
            border: none;
        }
        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 100%;
            min-height: 400px;
        }

        .header{
            height: 60px;
            background-color: #09c;
            line-height: 60px;
            .header-left{
                float: left;
                img{
                    width: 115px;
                    height: 35px;
                }
                
            }
            .header-right{
                height: 60px;
                float: right;
                .my-nav{
                    list-style: none;
                    &>li{
                        height: 60px;
                        line-height: 60px;
                        padding: 0 2px;
                        float: left;
                        margin-left: 20px;
                        color: white;
                        &:hover{
                            background: #008FBF;
                            .my-info-list{
                                display: block;
                            }
                        }
                    }
                    .my-info{
                        position: relative;
                        vertical-align: middle;

                        img{
                            width: 35px;
                            height: 35px;
                            border-radius: 50%;
                        }
                        .my-info-list{
                            display: none;
                            width: 100%;
                            /*height: 300px;*/
                            position: absolute;
                            top: 60px;
                            left: 0;
                            background: white;
                            z-index: 10001;
                            ul{
                                width: 100%;
                                padding: 0;
                                list-style: none;
                                li{
                                    width: 100%;
                                    height: 30px;
                                    line-height: 30px;
                                    color: #000;
                                    span{
                                        margin-right: 5px;
                                    }
                                    &:hover{
                                        background: gray;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .box{
            display: flex;
            width: 100%;
            position: absolute;
            top: 60px;
            bottom: 0;
            left: 0;
            padding: 0;
            margin: 0;
            transition: all 1s linear;
        }

        .aside{
            position: relative;
            height: 100%;
            width: 200px;
            background-color: #37424F;
            margin: 0;
            padding: 0;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .main{
            position: absolute;
            left: 200px;
            right: 0px;
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: green;

            .el-tabs{
                height: 100%;
                /*overflow: auto;*/

                /*.el-tabs__content{*/
                /*    position: absolute;*/
                /*    top: 39px;*/
                /*    bottom: 0;*/
                /*    left: 0;*/
                /*    right: 0;*/
                /*}*/
            }
            .main-content{
                position: absolute;
                top: 39px;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 15px;
            }
        }

    }
</style>