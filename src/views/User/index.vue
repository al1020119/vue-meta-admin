<template>
  <div>
    <!-- 搜索与添加区域 -->
    <el-row :gutter="18">
      <el-col :span="8">
        <el-input
          placeholder="用户名|邮箱|备注"
          v-model="requestInfo.search_field"
          clearable
          @clear="getUserList"
        >
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="insertDialogVisibleStatus = true">创建用户</el-button>
      </el-col>
    </el-row>

    <!-- id username user_level password_hash auth_key email status created_at updated_at remarks -->

    <!-- 用户列表区 -->
    <el-table :data="userlist" border stripe fit>
      <el-table-column type="index" align="center" width="50px"></el-table-column>
      <el-table-column label="用户名" prop="username" align="center" width="200px"></el-table-column>
      <el-table-column label="邮箱" prop="email" align="center" width="250px"></el-table-column>
      <el-table-column label="用户级别" align="center" width="180px">
        <template slot-scope="scope">
          <el-tag type="danger">{{userLevel[scope.row.user_level]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120px">
        <template slot-scope="scope">
          <el-tag type="userStatus[scope.row.status] == 1 ? success : danger">{{userStatus[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" align="center" width="180px"></el-table-column>
      <el-table-column label="用户备注" prop="remarks" align="center" width="150px"></el-table-column>
      <el-table-column label="操作" width="180px" align="center">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.id)"
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteDataAction(scope.row.id)"
          ></el-button>
          <!-- 分配角色按钮 tooltip: 提示名 -->
          <el-tooltip effect="dark" content="修改密码" placement="top" :enterable="false">
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="changeUserPassword(scope.row.id)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="requestInfo.page"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="requestInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="创建用户"
      :visible.sync="insertDialogVisibleStatus"
      width="50%"
      @close="closeDialog"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="insertUserForm"
        :rules="userFormRules"
        ref="insertUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="insertUserForm.username" placeholder="请输入数据库名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password_hash" label-width="100px">
          <el-input v-model="insertUserForm.password_hash" placeholder="请输入表名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="insertUserForm.email" placeholder="请输入表描述"></el-input>
        </el-form-item>
        <!-- 选择框 -->
        <el-form-item label="用户级别" prop="user_level" label-width="100px">
          <el-select v-model="insertUserForm.user_level" filterable placeholder="请选择用户级别">
            <el-option v-for="(item, index) in userLevel" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks" label-width="100px">
          <el-input v-model="insertUserForm.remarks" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="insertDialogVisibleStatus = false">取 消</el-button>
        <el-button type="primary" @click="inserUserData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisibleStatus"
      width="50%"
      @close="closeDialog"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editUserForm"
        :rules="userFormRules"
        ref="insertUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="editUserForm.username" placeholder="请输入数据库名" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="editUserForm.email" placeholder="请输入表名"></el-input>
        </el-form-item>
        <el-form-item label="用户级别" prop="user_level" label-width="100px">
          <el-select v-model="insertUserForm.user_level" filterable placeholder="请选择用户级别">
            <el-option v-for="(item, index) in userLevel" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks" label-width="100px">
          <el-input v-model="editUserForm.remarks" placeholder="请输入字段名"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisibleStatus = false">取 消</el-button>
        <el-button type="primary" @click="editUserData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 登录请求操作
import { List, Insert, Query, Update, Switch, Delete } from "@/api/user.js";
import { validateEmail } from '@/utils/validate.js'
import { getToken } from '@/api/services/cookie.js'

export default {
  name: 'metaMsgqueue',
  data() {
    return {
      // ===========================================================常量枚举数组=====================================================================
      // 用户级别
      userLevel: {
        "0": "超级管理员",
        "1": "普通管理员",
        "2": "[普通用户]"
      },
      userStatus: {
        "0": "禁用",
        "1": "使用中",
      },
      status_value: true,

      // ===========================================================数据请求信息=====================================================================
      // 获取用户列表的参数对象
      requestInfo: {
        search_field: "",
        // 当前页数
        page: 1,
        // 每页大小
        size: 10
      },
      total: 0,
      // 添加用户的表单数据
      insertUserForm: {
        username: "",
        password_hash: "",
        user_level: "",
        email: "",
        status: "",
        remarks: ""
      },
      queryUser: { id: "" },
      editUserForm: {},

      // ===========================================================用户列表和独立信息=====================================================================
      userlist: [],

      // ===========================================================弹窗显示状态=====================================================================
      // 插入弹窗显示状态
      insertDialogVisibleStatus: false,
      // 编辑弹窗显示状态
      editDialogVisibleStatus: false,

      // ===========================================================表单验证规则=====================================================================
      // 添加表单的验证规则对象
      userFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名的长度在1~20个字符之间",
            trigger: "blur"
          }
        ],
        password_hash: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "密码的长度在5~20个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: "请输入备注", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "备注的长度在2~20个字符之间",
            trigger: "blur"
          }
        ]
      }
    };
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          // 合法的邮箱
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
    }
  },
  // 发起数据处理请求
  created() {
        this.getUserList(); // 获取用户列表，请求信息已经封装
  },
  mounted() {
    if(!getToken()) {
        // 页面路由跳转
        this.$router.push({name:"Login"});
    }
  },
  methods: {
    // ===========================================================分页操作=====================================================================
    // 切换分页发小
    handleSizeChange(newSize) {
      this.requestInfo.size = newSize;
      this.requestInfo.page = 1;
      this.getUserList();
    },
    // 切换当前页数
    handleCurrentChange(newPage) {
      this.requestInfo.page = newPage;
      this.getUserList();
    },
    // ===========================================================显示和关闭对话框=====================================================================
    showEditDialog(userId) {
      this.editDialogVisibleStatus = true;
      this.queryUser.id = userId;
      this.queryUserData();
    },
    // 对话框关闭事件
    closeDialog() {
      this.$refs.insertUserFormRef.resetFields();
      this.$refs.editUserFormRefc.resetFields();
    },

    // ===========================================================网络请求方法=====================================================================
    // 获取用户列表，插入用户，查询用户，更新用户，删除用户

    // 获取用户信息
    getUserList() {
      List(this.requestInfo)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error("获取用户列表失败");
          }
          this.userlist = res.data.user;
          this.total = res.data.total;
        })
        .catch(error => {
          return this.$message.error("获取用户列表失败");
        });
    },
    // 插入操作
    inserUserData() {
      this.$refs.insertUserFormRef.validate(valid => {
        if (!valid) return;
        // 执行插入请求
        Insert(this.insertUserForm)
          .then(res => {
            if (res.code != 200) {
              return this.$message.error("插入用户失败");
            }
            this.insertDialogVisibleStatus = false;
            this.requestInfo.page = 1;
            this.getUserList();
          })
          .catch(error => {
            return this.$message.error("插入用户失败");
          });
      });
    },
    // 查询用户
    queryUserData() {
      // 发送查询请求
      Query(this.queryUser)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error("信息不存在或后台错误");
          }
          this.editUserForm = res.data;
        })
        .catch(error => {
          return this.$message.error("信息不存在或后台错误");
        });
    },
    // 更新操作
    editUserData() {
      this.$refs.insertUserFormRef.validate(valid => {
        if (!valid) return;
        // 执行更新请求
        Update(this.editUserForm)
          .then(res => {
            if (res.code != 200) {
              return this.$message.error("更新用户失败");
            }
            this.editDialogVisibleStatus = false;
            this.requestInfo.page = 1;
            this.getUserList();
          })
          .catch(error => {
            return this.$message.error("更新用户失败");
          });
      });
    },
    // 删除操作
    deleteDataAction(userId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.queryUser.id = userId;
          // 执行删除请求
          Delete(this.queryUser)
            .then(res => {
              if (res.code != 200) {
                return this.$message.error("删除用户失败");
              }
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getUserList();
            })
            .catch(error => {
              return this.$message.error("删除用户失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // ===========================================================待处理项=====================================================================
    // 操作日志点击
    changeUserPassword(userId) {
      return this.$message.error("修改用户密码操作，待处理");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>