<template>
    <div id="login">
        <div class="header container-fluid">
            <div class="container">
                <a href="#">
                    <img src="../../resource/images/512×512-点png.png">
                    <span>supermarket-门店管理小能手</span>
                </a>
            </div>
        </div>
        <div class="main container-fluid">
            <div class="main-left"></div>
            <div class="main-right">
                <div class="title container">
                    <h3>云后台登陆</h3>
                </div>
                <div class="form container">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label for="input3" class="col-sm-2 control-label">账号</label>
                            <div class="col-sm-10">
                                <input v-model="empAccount" class="form-control" id="input3" placeholder="请输入账号">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputPassword3" class="col-sm-2 control-label">密码</label>
                            <div class="col-sm-10">
                                <input type="password" v-model="empPwd" class="form-control" id="inputPassword3" placeholder="请输入密码">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-2 col-sm-10">
                                <button @click="login" class="btn btn-default">登陆</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="footer container-fluid">
            底部
        </div>
    </div>
</template>

<script>
    import QS from 'qs';
    export default {
        name: "login",
        data(){
            return {
                empAccount:'',
                empPwd:''
            }
        },
        methods:{
            login(){
                // 非空验证
                if (this.empAccount == '' || this.empPwd == ''){
                    this.$message({
                        showClose: true,
                        type:'error',
                        message: '账号或密码不能为空'
                    });
                    return;
                }
                let postData = QS.stringify({empAccount:this.empAccount,empPwd:this.empPwd});
                console.log(postData);
                this.$http.post('employee/login',postData).then(result => {
                    console.log(result);
                    // 登陆成功
                    if (result.data.state == true){
                        sessionStorage.setItem("userCode","success")
                        this.$router.push({name:"home"})
                    }else{
                        this.$message({
                            showClose: true,
                            type:'error',
                            message: result.data.message
                        });
                    }
                })
                //
            }
        }
    }
</script>

<style scoped lang="less">
    #login{
        height: 100%;
        .header{
            height: 60px;
            line-height: 60px;
            background-color: #ffffff;
            a{
                text-decoration: none;
                img{
                    width: 40px;
                    height: 40px;
                }
                span{
                    font-size: 25px;
                    color: #333333;
                }
            }
        }
        .main{
            min-height: 505px;
            background: #5EB0FA;
            display: flex;
            justify-content: center;
            align-items: center;
            .main-left{
                width: 421px;
                height: 320px;
                margin-right: 10px;
                background: url("../../resource/images/icon-login.png");
            }
            .main-right{
                width: 520px;
                height: 400px;
                margin-left: 10px;
                background: #ffffff;

                .title{
                    width: 100%;
                    height: 70px;
                    line-height: 70px;
                    margin-bottom: 30px;
                    border-bottom: 1px solid gray;
                }
                .form{
                    width: 100%;
                }
            }
        }
        .footer{
            height: 60px;
            background-color: gray;
        }
    }
</style>