<template>
  <div>
    <!-- 搜索与添加区域 -->
    <el-row :gutter="10">
      <!-- 搜索选项：二级联动 -->
      <el-col :span="3">
        <el-select v-model="insertDimensionForm.field_type" filterable placeholder="请选择表名">
            <el-option v-for="(item, index) in fieldType" :key="index" :label="item" :value="index"></el-option>
          </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="insertDimensionForm.field_type" filterable placeholder="请选择字段名">
            <el-option v-for="(item, index) in fieldType" :key="index" :label="item" :value="index"></el-option>
          </el-select>
      </el-col>
      <!-- 输入搜索字段 -->
      <el-col :span="6">
        <el-input
          placeholder="描述|库|表|字段|类型|值|操作人|备注"
          v-model="requestInfo.search_field"
          clearable
          @clear="getDimensionList"
        >
          <el-button slot="append" icon="el-icon-search" @click="getDimensionList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="insertDialogVisibleStatus = true">添加维度</el-button>
      </el-col>
    </el-row>

    <!-- id db_name table_name table_desc field_name field_desc field_type field_value field_value_desc source_type status created_by created_at updated_by updated_at is_dimension dimension_table comment -->

    <!-- 维度列表区 -->
    <el-table :data="dimensionlist" border stripe>
      <el-table-column type="index" align="center" width="40px"></el-table-column>
      <el-table-column label="维度表" prop="table_name" align="center" width="100px"></el-table-column>
      <el-table-column label="表描述" prop="table_desc" align="center" width="120px"></el-table-column>
      <el-table-column label="维度名" prop="dimension_name" align="center" width="180px"></el-table-column>
      <el-table-column label="维度名描述" prop="dimension_desc" align="center" width="120px"></el-table-column>
      <el-table-column label="维度值" prop="dimension_value" align="center" width="180px"></el-table-column>
      <el-table-column label="维度值描述" prop="dimension_value_desc" align="center" width="135px"></el-table-column>
      
      <el-table-column label="源库名" prop="source_db" align="center" width="80px"></el-table-column>
      <el-table-column label="源表名" prop="source_table" align="center" width="180px"></el-table-column>
      <el-table-column label="源字段名" prop="source_field" align="center" width="120px"></el-table-column>

      <!-- <el-table-column label="创建人" prop="created_by" align="center" width="100px"></el-table-column>
      <el-table-column label="创建时间" prop="created_at" align="center" width="138px"></el-table-column>
      <el-table-column label="更新人" prop="updated_by" align="center"></el-table-column>
      <el-table-column label="更新时间" prop="updated_at" align="center" width="138px"></el-table-column> -->
      
      <el-table-column label="备注" prop="comment" align="center"></el-table-column>

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
          <el-tooltip effect="dark" content="操作日志" placement="top" :enterable="false">
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="getDimensionLog(scope.row.id)"
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

    <!-- 添加维度的对话框 -->
    <el-dialog
      title="添加维度"
      :visible.sync="insertDialogVisibleStatus"
      width="50%"
      @close="closeDialog"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="insertDimensionForm"
        :rules="dimensionFormRules"
        ref="insertDimensionFormRef"
        label-width="70px"
      >
        <el-form-item label="维度表" prop="table_name" label-width="100px">
          <el-input v-model="insertDimensionForm.table_name" placeholder="请输入维度表"></el-input>
        </el-form-item>
        <el-form-item label="表描述" prop="table_desc" label-width="100px">
          <el-input v-model="insertDimensionForm.table_desc" placeholder="请输入表描述"></el-input>
        </el-form-item>
        <el-form-item label="维度名" prop="dimension_name" label-width="100px">
          <el-input v-model="insertDimensionForm.dimension_name" placeholder="请输入维度名"></el-input>
        </el-form-item>
        <el-form-item label="维度名描述" prop="dimension_desc" label-width="100px">
          <el-input v-model="insertDimensionForm.dimension_desc" placeholder="请输入维度名描述"></el-input>
        </el-form-item>
        <el-form-item label="维度值" prop="dimension_value" label-width="100px">
          <el-input v-model="insertDimensionForm.dimension_value" placeholder="请输入维度值"></el-input>
        </el-form-item>
        <el-form-item label="维度值描述" prop="dimension_value_desc" label-width="100px">
          <el-input v-model="insertDimensionForm.dimension_value_desc" placeholder="请输入维度值描述"></el-input>
        </el-form-item>
        <el-form-item label="源库名" prop="source_db" label-width="100px">
          <el-input v-model="insertDimensionForm.source_db" placeholder="请输入源库名"></el-input>
        </el-form-item>
        <el-form-item label="源表名" prop="source_table" label-width="100px">
          <el-input v-model="insertDimensionForm.source_table" placeholder="请输入源表名"></el-input>
        </el-form-item>
        <el-form-item label="源字段名" prop="source_field" label-width="100px">
          <el-input v-model="insertDimensionForm.source_field" placeholder="请输入源字段名"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="comment" label-width="100px">
          <el-input v-model="insertDimensionForm.comment" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="insertDialogVisibleStatus = false">取 消</el-button>
        <el-button type="primary" @click="inserDimensionData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改维度的对话框 -->
    <el-dialog
      title="修改维度"
      :visible.sync="editDialogVisibleStatus"
      width="50%"
      @close="closeDialog"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editDimensionForm"
        :rules="dimensionFormRules"
        ref="insertDimensionFormRef"
        label-width="70px"
      >
        
        <el-form-item label="维度表" prop="table_name" label-width="100px">
          <el-input v-model="editDimensionForm.table_name" placeholder="请输入维度表"></el-input>
        </el-form-item>
        <el-form-item label="表描述" prop="table_desc" label-width="100px">
          <el-input v-model="editDimensionForm.table_desc" placeholder="请输入表描述"></el-input>
        </el-form-item>
        <el-form-item label="维度名" prop="dimension_name" label-width="100px">
          <el-input v-model="editDimensionForm.dimension_name" placeholder="请输入维度名"></el-input>
        </el-form-item>
        <el-form-item label="维度名描述" prop="dimension_desc" label-width="100px">
          <el-input v-model="editDimensionForm.dimension_desc" placeholder="请输入维度名描述"></el-input>
        </el-form-item>
        <el-form-item label="维度值" prop="dimension_value" label-width="100px">
          <el-input v-model="editDimensionForm.dimension_value" placeholder="请输入维度值"></el-input>
        </el-form-item>
        <el-form-item label="维度值描述" prop="dimension_value_desc" label-width="100px">
          <el-input v-model="editDimensionForm.dimension_value_desc" placeholder="请输入维度值描述"></el-input>
        </el-form-item>
        <el-form-item label="源库名" prop="source_db" label-width="100px">
          <el-input v-model="editDimensionForm.source_db" placeholder="请输入源库名"></el-input>
        </el-form-item>
        <el-form-item label="源表名" prop="source_table" label-width="100px">
          <el-input v-model="editDimensionForm.source_table" placeholder="请输入源表名"></el-input>
        </el-form-item>
        <el-form-item label="源字段名" prop="source_field" label-width="100px">
          <el-input v-model="editDimensionForm.source_field" placeholder="请输入源字段名"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="comment" label-width="100px">
          <el-input v-model="editDimensionForm.comment" placeholder="请输入备注"></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisibleStatus = false">取 消</el-button>
        <el-button type="primary" @click="editDimensionData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

// 登录请求操作
import { List, Insert, Query, Update, Delete } from "@/api/dimension.js";
import { getToken } from '@/api/services/cookie.js'

export default {
  name: 'metaDimension',
  data() {
    return {
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
      insertDimensionForm: {
        db_name: "",
        table_name: "",
        table_desc: "",
        field_name: "",
        field_desc: "",
        field_type: "",
        field_value: "",
        field_value_desc: "",
        is_dimension: "",
        // 有is_dimension才传递
        dimension_table: "",
        source_type: "",
        // 修改才显示
        status: "1",
        comment: ""
      },
      queryDimension: { id: "" },
      editDimensionForm: {},

      // ===========================================================维度列表和独立信息=====================================================================
      dimensionlist: [],

      // ===========================================================弹窗显示状态=====================================================================
      // 插入弹窗显示状态
      insertDialogVisibleStatus: false,
      // 编辑弹窗显示状态
      editDialogVisibleStatus: false,

      // ===========================================================表单验证规则=====================================================================
      // 添加表单的验证规则对象
      dimensionFormRules: {
        table_name: [
          { required: true, message: "请输入维度表", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "维度表的长度在1~20个字符之间",
            trigger: "blur"
          }
        ],
        table_desc: [
          { required: true, message: "请输入表描述", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "表描述的长度在1~20个字符之间",
            trigger: "blur"
          }
        ],
        dimension_name: [
          { required: true, message: "请输入维度名", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "维度名的长度在1~30个字符之间",
            trigger: "blur"
          }
        ],
        dimension_desc: [
          { required: true, message: "请输入维度名描述", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "维度名描述的长度在1~20个字符之间",
            trigger: "blur"
          }
        ],
        dimension_value: [
          { required: true, message: "请输入维度值", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "维度值的长度在1~30个字符之间",
            trigger: "blur"
          }
        ],
        dimension_value_desc: [
          { required: true, message: "请输入维度值描述", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "维度值描述的长度在1~10个字符之间",
            trigger: "blur"
          }
        ],
        source_db: [
          { required: true, message: "请输入源库名", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "源库名的长度在1~30个字符之间",
            trigger: "blur"
          }
        ],
        source_table: [
          { required: true, message: "请输入源表名", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "源表名的长度在1~20个字符之间",
            trigger: "blur"
          }
        ],
        source_field: [
          { required: true, message: "请输入源字段名", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "源字段名的长度在1~20个字符之间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  // 发起数据处理请求
  created() {
    this.getDimensionList(); // 获取维度列表，请求信息已经封装
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
      this.getDimensionList();
    },
    // 切换当前页数
    handleCurrentChange(newPage) {
      this.requestInfo.page = newPage;
      this.getDimensionList();
    },
    changeDimensionStatus(value) {
      this.isdimensionField = value == 1;
    },

    // ===========================================================显示和关闭对话框=====================================================================
    showEditDialog(dimensionId) {
      this.editDialogVisibleStatus = true;
      this.queryDimension.id = dimensionId;
      this.queryDimensionData();
    },
    // 对话框关闭事件
    closeDialog() {
      this.$refs.insertDimensionFormRef.resetFields();
      this.$refs.editDimensionFormRefc.resetFields();
    },

    // ===========================================================网络请求方法=====================================================================
    // 获取维度列表，插入维度，查询维度，更新维度，删除维度

    // 获取维度信息
    getDimensionList() {
      List(this.requestInfo)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error("获取维度列表失败");
          }
          this.dimensionlist = res.data.dimension;
          this.total = res.data.total;
        })
        .catch(error => {
          return this.$message.error("获取维度列表失败");
        });
    },
    // 插入操作
    inserDimensionData() {
      this.$refs.insertDimensionFormRef.validate(valid => {
        if (!valid) return;
        // 执行插入请求
        Insert(this.insertDimensionForm)
          .then(res => {
            if (res.code != 200) {
              return this.$message.error("插入维度失败");
            }
            this.insertDialogVisibleStatus = false;
            this.requestInfo.page = 1;
            this.getDimensionList();
          })
          .catch(error => {
            return this.$message.error("插入维度失败");
          });
      });
    },
    // 查询维度
    queryDimensionData() {
      // 发送查询请求
      Query(this.queryDimension)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error("信息不存在或后台错误");
          }
          this.editDimensionForm = res.data;
        })
        .catch(error => {
          return this.$message.error("信息不存在或后台错误");
        });
    },
    // 更新操作
    editDimensionData() {
      this.$refs.insertDimensionFormRef.validate(valid => {
        if (!valid) return;
        // 执行更新请求
        Update(this.editDimensionForm)
          .then(res => {
            if (res.code != 200) {
              return this.$message.error("更新维度失败");
            }
            this.editDialogVisibleStatus = false;
            this.requestInfo.page = 1;
            this.getDimensionList();
          })
          .catch(error => {
            return this.$message.error("更新维度失败");
          });
      });
    },
    // 删除操作
    deleteDataAction(dimensionId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.queryDimension.id = dimensionId;
          // 执行删除请求
          Delete(this.queryDimension)
            .then(res => {
              if (res.code != 200) {
                return this.$message.error("删除维度失败");
              }
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getDimensionList();
            })
            .catch(error => {
              return this.$message.error("删除维度失败");
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
    getDimensionLog(dimensionId) {
      return this.$message.error("操作日志功能，待处理");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>