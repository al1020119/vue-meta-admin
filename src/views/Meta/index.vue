<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="同步" name="first">
      <el-row :gutter="20">
        <el-col :span="8">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="数据来源" prop="age">
                <!-- <el-input v-model.number="ruleForm.age"></el-input> -->
                <el-select v-model="ruleForm.age" filterable placeholder="请选择数据源">
                  <el-option
                    v-for="(item, index) in sourceType"
                    :key="index"
                    :label="item"
                    :value="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="数据库地址" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off" class="inputItem"></el-input>
              </el-form-item>
              <el-form-item label="端口" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="库名" prop="age">
                <el-input v-model.number="ruleForm.age"></el-input>
              </el-form-item>
              <el-form-item label="表名" prop="age">
                <el-input v-model.number="ruleForm.age"></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="age">
                <el-input v-model.number="ruleForm.age"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="age">
                <el-input v-model.number="ruleForm.age"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="数据库" name="second">数据库</el-tab-pane>
    <el-tab-pane label="数据仓库" name="third">数据仓库</el-tab-pane>
    <el-tab-pane label="数据缓存" name="fourth">数据缓存</el-tab-pane>
    <el-tab-pane label="消息队列" name="five">消息队列</el-tab-pane>
    <el-tab-pane label="NoSQL" name="six">NoSQL</el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
    name: 'metaIndex',
    data() {
      return {
        activeName: 'first',
        // 数据源类型
        sourceType: {
          "0": "None",
          "1": "MySQL",
          "2": "TDSQL",
          "3": "MongoDB",
          "4": "Redis",
          "5": "Hive",
          "6": "HBase",
          "7": "RabbitMQ",
          "8": "Text"
        },
        ruleForm: {
          pass: '',
          checkPass: '',
          age: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
      };
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    },
    mounted() {
        if(!getToken()) {
            // 页面路由跳转
            this.$router.push({name:"Login"});
        }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
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
<style scoped>
.demo-ruleForm {
  margin-top: 30px;
}
</style>