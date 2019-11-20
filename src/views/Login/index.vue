<template>
    <div id="login">
        <!-- 内容区 -->
        <div class="login-wrap">
            <!-- 登录名字标题 -->
            <ul class="login-title">
                <!-- :key/:class => v-bind:key/v-bind:class -->
                <!-- v-for="(item, index) in loginTitle" index: 可给前后使用 -->
                <!-- @click="toggleTitle()" 函数绑定 -->
                <!-- 'current': isActive ||  -->
                <li v-for="item in loginTitle" :key="item.id" :class="{'current': isActive && item.current}" @click="toggleTitle(item)">{{ item.title }}</li>
                <!-- <li v-for="item in loginTitle" :key="item.id" :class="{'current': isActive && item.current}" @click="queryLogin()">{{ item.title }}</li> -->
            </ul>

            <!-- 登录表单 -->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form" size="medium">
                <!-- 用户名 -->
                <el-form-item prop="username" class="login-item">
                    <label>用户名</label>
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off" minlength="5" maxlength="10"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password" class="login-item">
                    <label>密码</label>
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>
                <!-- 登录俺妞妞 -->
                <el-form-item>
                    <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { stripscript } from '@/utils/validate.js'
export default {
    name: "login",
    data() {
        // ========================== 登录表单操作 ==========================
        // 验证用户名
        var validateUsername = (rule, value, callback) => {
            let reg = /^[a-z]{5,10}$/;
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else if (!reg.test(value)) {
                callback(new Error('用户名为5到10位的字母'));
            } else {
                callback();
            }
        };
        // 验证密码
        var validatePassword = (rule, value, callback) => {
            // 过滤特殊字符
            this.ruleForm.password = stripscript(value);
            value = this.ruleForm.password;
            // let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
            // if (!reg.test(value)) {
            //     callback(new Error('密码为6到20位的数字+字母'));
            // }
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };

        return {
            loginTitle: [
                {title: "元数据管理系统",current: true},
            ],
            isActive: false,
            ruleForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { validator: validateUsername, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePassword, trigger: 'blur' }
                ]
            }
        }
        // 登录表单操作
    },
    created(){},
    mounted(){},
    // 写函数的地方
    methods: {
        // vue 数据驱动视图
        // js 操作DOM元素
        // 点击标题操作
        toggleTitle(item) {
            this.loginTitle.forEach((elem,index) => {
                elem.current = false;
            })
            //for(let i=0;i<this.loginTitle.length;i++) {}
            item.current = true;
            console.log(item);
        },
        // 登录接口测试
        queryLogin() {
            this.$axios.post(
                'http://api.meta.com/user/login.html',
                {
                    username: 'admin',
                    password_hash: '111111',
                    rememberMe: '1'
                }
            )
            .then(function(response) {
                console.log(response);
            })
            .catch(error => (console.log(error)));
        },
        // 提交按钮点击
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                alert('submit!');
                let _this = this;
                // 发起网络请求，使用POST登录操作并拿到用户信息
                this.$axios.post('http://api.meta.com/user/login.html',
                    {
                        username: this.ruleForm.username,
                        password_hash: this.ruleForm.password,
                        rememberMe: '1'
                    }
                ).then(function(response) {
                    console.log(response);
                    _this.$router.push({name:"Console"})
                }).catch(error => (console.log(error)));
            } else {
                console.log('error submit!!');
                return false;
            }
            });
       }
    },
    props: {},
    watch: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- scoped ： 局部控制 -->
<style scoped lang="scss">
// 登录DIV
#login {
    height: 100vh;
    background-color: #344a5f;
}
// 登录标题
.login-wrap {
    width: 330px;
    margin: auto;
    padding-top: 100px;
    // background-color: red;
}
// 登录标题
.login-title {
    text-align: center;
    li {
        display: inline-block;
        width: 200px;
        line-height: 80px;
        font-size: 24px;
        color: #fff;
        border-radius: 2px;
    }
    .current {
        background-color: rgb(0, 0, .1)
    }
}
// 登录表单
.login-form {
    margin-top: 30px;
    label {
        display: block;
        font-size: 14px;
        margin-bottom: 3px;
        color: #fff;
    }
    .login-item {
        margin-bottom: 13px;
    }
    .block { 
        display: block;
        width: 100%;
    }
    .login-btn {
        margin-top: 20px;
    }
}
</style>
