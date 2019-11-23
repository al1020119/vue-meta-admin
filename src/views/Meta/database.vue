<template>
  <div>
    <!-- 搜索与添加区域 -->
    <el-row :gutter="18">
      <el-col :span="10">
        <el-input
          placeholder="描述|库|表|字段|类型|值|操作人|备注"
          v-model="requestInfo.search_field"
          clearable
          @clear="getDatabaseList"
        >
          <el-button slot="append" icon="el-icon-search" @click="getDatabaseList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="insertDialogVisibleStatus = true">添加元数据</el-button>
      </el-col>
    </el-row>

    <!-- id db_name table_name table_desc field_name field_desc field_type field_value field_value_desc source_type status created_by created_at updated_by updated_at is_dimension dimension_table comment -->

    <!-- 元数据列表区 -->
    <el-table :data="databaselist" border stripe>
      <el-table-column type="index" align="center" width="40px"></el-table-column>
      <el-table-column label="库名" prop="db_name" align="center" width="100px"></el-table-column>
      <el-table-column label="表名" prop="table_name" align="center" width="120px"></el-table-column>
      <el-table-column label="表描述" prop="table_desc" align="center" width="180px"></el-table-column>
      <el-table-column label="字段名" prop="field_name" align="center" width="120px"></el-table-column>
      <el-table-column label="字段描述" prop="field_desc" align="center" width="180px"></el-table-column>
      <el-table-column label="字段类型" align="center" width="135px">
        <!-- 作用域插槽直接获取数据 -->
        <template slot-scope="scope">
          {{fieldType[scope.row.field_type]}}
        </template>
      </el-table-column>
      <el-table-column label="字段值" prop="field_value" align="center" width="80px"></el-table-column>
      <el-table-column label="字段值描述" prop="field_value_desc" align="center" width="180px"></el-table-column>
      <el-table-column label="维度" align="center" width="70px">
        <template slot-scope="scope">
          <el-tag type="danger">{{dimensionStatus[scope.row.is_dimension]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="维度表" prop="dimension_table" align="center" width="120px"></el-table-column>
      <el-table-column label="数据源" align="center" width="120px">
        <template slot-scope="scope">
          <el-tag type="success">{{sourceType[scope.row.source_type]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="字段状态" align="center" width="80px">
        <template slot-scope="scope">
          <el-tag type="warning">{{fieldSatus[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="created_by" align="center" width="100px"></el-table-column>
      <el-table-column label="创建时间" prop="created_at" align="center" width="138px"></el-table-column>
      <el-table-column label="更新人" prop="updated_by" align="center"></el-table-column>
      <el-table-column label="更新时间" prop="updated_at" align="center" width="138px"></el-table-column>
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
              @click="getDatabaseLog(scope.row.id)"
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

    <!-- 添加元数据的对话框 -->
    <el-dialog
      title="添加元数据"
      :visible.sync="insertDialogVisibleStatus"
      width="50%"
      @close="closeDialog"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="insertDatabaseForm"
        :rules="databaseFormRules"
        ref="insertDatabaseFormRef"
        label-width="70px"
      >
        <el-form-item label="库名" prop="db_name" label-width="100px">
          <el-input v-model="insertDatabaseForm.db_name" placeholder="请输入数据库名"></el-input>
        </el-form-item>
        <el-form-item label="表名" prop="table_name" label-width="100px">
          <el-input v-model="insertDatabaseForm.table_name" placeholder="请输入表名"></el-input>
        </el-form-item>
        <el-form-item label="表描述" prop="table_desc" label-width="100px">
          <el-input v-model="insertDatabaseForm.table_desc" placeholder="请输入表描述"></el-input>
        </el-form-item>
        <el-form-item label="字段名" prop="field_name" label-width="100px">
          <el-input v-model="insertDatabaseForm.field_name" placeholder="请输入字段名"></el-input>
        </el-form-item>
        <el-form-item label="字段描述" prop="field_desc" label-width="100px">
          <el-input v-model="insertDatabaseForm.field_desc" placeholder="请输入字段描述"></el-input>
        </el-form-item>
        <!-- 选择框 -->
        <el-form-item label="字段类型" prop="field_type" label-width="100px">
          <el-select v-model="insertDatabaseForm.field_type" filterable placeholder="请选择字段类型">
            <el-option v-for="(item, index) in fieldType" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段值" prop="field_value" label-width="100px">
          <el-input v-model="insertDatabaseForm.field_value" placeholder="请输入字段值"></el-input>
        </el-form-item>
        <el-form-item label="字段值描述" prop="field_value_desc" label-width="100px">
          <el-input v-model="insertDatabaseForm.field_value_desc" placeholder="请输入字字段值描述"></el-input>
        </el-form-item>
        <!-- 选择框 -->
        <el-form-item label="是否是维度" prop="is_dimension" label-width="100px">
          <el-select
            v-model="insertDatabaseForm.is_dimension"
            filterable
            placeholder="是否作为维度指标"
            @change="changeDimensionStatus"
          >
            <el-option
              v-for="(item, index) in dimensionStatus"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 维度为true的时候才显示 -->
        <el-form-item
          v-show="isdimensionField"
          label="维度表"
          prop="dimension_table"
          label-width="100px"
        >
          <el-input v-model="insertDatabaseForm.dimension_table" placeholder="请输入维度表"></el-input>
        </el-form-item>
        <!-- 选择框 -->
        <el-form-item label="数据源" prop="source_type" label-width="100px">
          <el-select v-model="insertDatabaseForm.source_type" filterable placeholder="请选择数据源">
            <el-option
              v-for="(item, index) in sourceType"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="comment" label-width="100px">
          <el-input v-model="insertDatabaseForm.comment" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="insertDialogVisibleStatus = false">取 消</el-button>
        <el-button type="primary" @click="inserDatabaseData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改元数据的对话框 -->
    <el-dialog
      title="修改元数据"
      :visible.sync="editDialogVisibleStatus"
      width="50%"
      @close="closeDialog"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editDatabaseForm"
        :rules="databaseFormRules"
        ref="insertDatabaseFormRef"
        label-width="70px"
      >
        <el-form-item label="库名" prop="db_name" label-width="100px">
          <el-input v-model="editDatabaseForm.db_name" placeholder="请输入数据库名"></el-input>
        </el-form-item>
        <el-form-item label="表名" prop="table_name" label-width="100px">
          <el-input v-model="editDatabaseForm.table_name" placeholder="请输入表名"></el-input>
        </el-form-item>
        <el-form-item label="表描述" prop="table_desc" label-width="100px">
          <el-input v-model="editDatabaseForm.table_desc" placeholder="请输入表描述"></el-input>
        </el-form-item>
        <el-form-item label="字段名" prop="field_name" label-width="100px">
          <el-input v-model="editDatabaseForm.field_name" placeholder="请输入字段名"></el-input>
        </el-form-item>
        <el-form-item label="字段描述" prop="field_desc" label-width="100px">
          <el-input v-model="editDatabaseForm.field_desc" placeholder="请输入字段描述"></el-input>
        </el-form-item>
        <!-- 选择框 -->
        <el-form-item label="字段类型" prop="field_type" label-width="100px">
          <el-select v-model="editDatabaseForm.field_type" filterable placeholder="请选择字段类型">
            <el-option v-for="(item, index) in fieldType" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段值" prop="field_value" label-width="100px">
          <el-input v-model="editDatabaseForm.field_value" placeholder="请输入字段值"></el-input>
        </el-form-item>
        <el-form-item label="字段值描述" prop="field_value_desc" label-width="100px">
          <el-input v-model="editDatabaseForm.field_value_desc" placeholder="请输入字字段值描述"></el-input>
        </el-form-item>
        <el-form-item label="是否是维度" prop="is_dimension" label-width="100px">
          <el-select
            v-model="editDatabaseForm.is_dimension"
            filterable
            placeholder="是否作为维度指标"
            @change="changeDimensionStatus"
          >
            <el-option
              v-for="(item, index) in dimensionStatus"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 维度为true的时候才显示 -->
        <el-form-item
          v-show="isdimensionField"
          label="维度表"
          prop="dimension_table"
          label-width="100px"
        >
          <el-input v-model="editDatabaseForm.dimension_table" placeholder="请输入维度表"></el-input>
        </el-form-item>
        <el-form-item label="数据源" prop="source_type" label-width="100px">
          <el-select v-model="editDatabaseForm.source_type" filterable placeholder="请选择数据源">
            <el-option
              v-for="(item, index) in sourceType"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 修改的时候才显示 -->
        <el-form-item label="字段状态" prop="status" label-width="100px">
          <el-select v-model="editDatabaseForm.status" filterable placeholder="请选择字段状态">
            <el-option
              v-for="(item, index) in fieldSatus"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="comment" label-width="100px">
          <el-input v-model="editDatabaseForm.comment" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisibleStatus = false">取 消</el-button>
        <el-button type="primary" @click="editDatabaseData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

// 登录请求操作
import { List, Insert, Query, Update, Delete } from "@/api/database.js";
import { getToken } from '@/api/services/cookie.js'

export default {
  name: 'metaMsgqueue',
  data() {
    return {
      // ===========================================================常量枚举数组=====================================================================
      // 字段类型
      fieldType: {
        "0": "None",
        "1": "BIT",
        "2": "BOOL",
        "3": "TINYINT",
        "4": "SMALLINT",
        "5": "MEDIUMINT",
        "6": "INT",
        "7": "BIGINT",
        "8": "FLOAT",
        "9": "DOUBLE",
        "10": "DECIMAL",
        "11": "CHAR",
        "12": "VARCHAR",
        "13": "TINYTEXT",
        "14": "TEXT",
        "15": "MEDIUMTEXT",
        "16": "LONGTEXT",
        "17": "TINYBLOB",
        "18": "BLOB",
        "19": "MEDIUM",
        "20": "BLOB",
        "21": "LONG",
        "22": "BLOB",
        "23": "Date",
        "24": "DateTime",
        "25": "TimeStamp",
        "26": "Time",
        "27": "Year",
        "28": "BINARY",
        "29": "VARBINARY",
        "30": "ENUM",
        "31": "SET",
        "32": "Geometry",
        "33": "Point",
        "34": "MultiPoint",
        "35": "LineString",
        "36": "MultiLineString",
        "37": "Polygon",
        "37": "GeometryCollection"
      },
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
      // 字段状态
      fieldSatus: {
        "1": "使用中",
        "0": "弃用"
      },
      // 维度类型状态
      dimensionStatus: {
        "1": "是",
        "0": "否"
      },

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
      insertDatabaseForm: {
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
      queryDatabase: { id: "" },
      editDatabaseForm: {},

      // ===========================================================元数据列表和独立信息=====================================================================
      databaselist: [],

      // ===========================================================弹窗显示状态=====================================================================
      // 维度类型字段
      isdimensionField: false,
      // 插入弹窗显示状态
      insertDialogVisibleStatus: false,
      // 编辑弹窗显示状态
      editDialogVisibleStatus: false,

      // ===========================================================表单验证规则=====================================================================
      // 添加表单的验证规则对象
      databaseFormRules: {
        db_name: [
          { required: true, message: "请输入库名", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "库名的长度在1~20个字符之间",
            trigger: "blur"
          }
        ],
        table_name: [
          { required: true, message: "请输入表名", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "表名的长度在1~20个字符之间",
            trigger: "blur"
          }
        ],
        table_desc: [
          { required: true, message: "请输入表描述", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "表描述的长度在1~30个字符之间",
            trigger: "blur"
          }
        ],
        field_name: [
          { required: true, message: "请输入字段名", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "字段名的长度在1~20个字符之间",
            trigger: "blur"
          }
        ],
        field_desc: [
          { required: true, message: "请输入字段描述", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "字段描述的长度在1~30个字符之间",
            trigger: "blur"
          }
        ],
        field_type: [
          { required: true, message: "请输选择字段类型", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "字段类型的长度在1~10个字符之间",
            trigger: "blur"
          }
        ],
        field_value_desc: [
          { required: true, message: "请输入字段值描述", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "字段值描述的长度在1~30个字符之间",
            trigger: "blur"
          }
        ],
        is_dimension: [
          { required: true, message: "请选择是否是维度", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "否是维度的长度在1~20个字符之间",
            trigger: "blur"
          }
        ],
        source_type: [
          { required: true, message: "请输入数据来源", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "数据来源的长度在1~20个字符之间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  // 发起数据处理请求
  created() {
    this.getDatabaseList(); // 获取元数据列表，请求信息已经封装
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
      this.getDatabaseList();
    },
    // 切换当前页数
    handleCurrentChange(newPage) {
      this.requestInfo.page = newPage;
      this.getDatabaseList();
    },
    changeDimensionStatus(value) {
      this.isdimensionField = value == 1;
    },

    // ===========================================================显示和关闭对话框=====================================================================
    showEditDialog(databaseId) {
      this.editDialogVisibleStatus = true;
      this.queryDatabase.id = databaseId;
      this.queryDatabaseData();
    },
    // 对话框关闭事件
    closeDialog() {
      this.$refs.insertDatabaseFormRef.resetFields();
      this.$refs.editDatabaseFormRefc.resetFields();
    },

    // ===========================================================网络请求方法=====================================================================
    // 获取元数据列表，插入元数据，查询元数据，更新元数据，删除元数据

    // 获取元数据信息
    getDatabaseList() {
      List(this.requestInfo)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error("获取元数据列表失败");
          }
          this.databaselist = res.data.database;
          this.total = res.data.total;
        })
        .catch(error => {
          return this.$message.error("获取元数据列表失败");
        });
    },
    // 插入操作
    inserDatabaseData() {
      this.$refs.insertDatabaseFormRef.validate(valid => {
        if (!valid) return;
        // 执行插入请求
        Insert(this.insertDatabaseForm)
          .then(res => {
            if (res.code != 200) {
              return this.$message.error("插入元数据失败");
            }
            this.insertDialogVisibleStatus = false;
            this.requestInfo.page = 1;
            this.getDatabaseList();
          })
          .catch(error => {
            return this.$message.error("插入元数据失败");
          });
      });
    },
    // 查询元数据
    queryDatabaseData() {
      // 发送查询请求
      Query(this.queryDatabase)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error("信息不存在或后台错误");
          }
          this.editDatabaseForm = res.data;
        })
        .catch(error => {
          return this.$message.error("信息不存在或后台错误");
        });
    },
    // 更新操作
    editDatabaseData() {
      this.$refs.insertDatabaseFormRef.validate(valid => {
        if (!valid) return;
        // 执行更新请求
        Update(this.editDatabaseForm)
          .then(res => {
            if (res.code != 200) {
              return this.$message.error("更新元数据失败");
            }
            this.editDialogVisibleStatus = false;
            this.requestInfo.page = 1;
            this.getDatabaseList();
          })
          .catch(error => {
            return this.$message.error("更新元数据失败");
          });
      });
    },
    // 删除操作
    deleteDataAction(databaseId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.queryDatabase.id = databaseId;
          // 执行删除请求
          Delete(this.queryDatabase)
            .then(res => {
              if (res.code != 200) {
                return this.$message.error("删除元数据失败");
              }
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getDatabaseList();
            })
            .catch(error => {
              return this.$message.error("删除元数据失败");
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
    getDatabaseLog(databaseId) {
      return this.$message.error("操作日志功能，待处理");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>