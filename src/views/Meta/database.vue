<template>
  <div>
    <!-- 搜索与添加区域 -->
    <el-row :gutter="10">
      <!-- 搜索选项：三级联动 -->
      <el-col :span="3">
        <el-select
          v-model="requestInfo.source_type"
          filterable
          placeholder="请选择数据源"
          @change="filterSearchTypeChange"
        >
          <el-option v-for="item in filterSearchType" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="requestInfo.db_name"
          filterable
          placeholder="请选择数据库"
          @change="filterDbNameChange"
        >
          <el-option v-for="item in filterDbName" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="requestInfo.table_name"
          filterable
          placeholder="请选择表名"
          @change="filterTableNameChange"
        >
          <el-option v-for="item in filterTableName" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="requestInfo.field_name"
          filterable
          placeholder="请选择字段名"
          @change="filterFieldNameChange"
        >
          <el-option v-for="item in filterFieldName" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <!-- 输入搜索字段 -->
      <el-col :span="4">
        <el-input
          placeholder="描述|类型|值|维度"
          v-model="requestInfo.search_field"
          clearable
          @clear="getDatabaseList"
        >
          <el-button slot="append" icon="el-icon-search" @click="getDatabaseList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="getDatabaseList">搜索</el-button>
      </el-col>
    </el-row>

    <!-- 元数据列表区 -->
    <el-table :data="databaselist" border stripe class="content-table">
      <el-table-column type="index" align="center" width="40px"></el-table-column>
      <el-table-column label="数据源" prop="source_type" align="center" width="100px"></el-table-column>
      <el-table-column label="库名" prop="db_name" align="center" width="100px"></el-table-column>
      <el-table-column label="表名" prop="table_name" align="center" width="150px"></el-table-column>
      <el-table-column label="表描述" prop="table_desc" align="center" width="120px"></el-table-column>
      <el-table-column label="字段名" prop="field_name" align="center" width="150px"></el-table-column>
      <el-table-column label="字段类型" prop="field_type" align="center" width="100px"></el-table-column>
      <el-table-column label="字段描述" prop="field_desc" align="center" width="180px"></el-table-column>
      <el-table-column label="维度" align="center" width="80px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_dimension" @change="databaseDimensionSwitch(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="维度表" prop="dimension_table" align="center" width="180px"></el-table-column>
      <el-table-column label="是否为空" prop="is_null" align="center" width="80px"></el-table-column>
      <el-table-column label="索引" prop="key" align="center" width="80px"></el-table-column>
      <el-table-column label="默认值" prop="default" align="center" width="100px"></el-table-column>
      <el-table-column label="操作" width="80px" align="center">
        <template slot-scope="scope">
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

    <!-- 底部分割线和数据汇总区域 -->
    <el-divider content-position="right">
      <span style>库:</span>
      {{dataSummary[0]}}
      <el-divider direction="vertical"></el-divider>
      <span>表:</span>
      {{dataSummary[1]}}
      <el-divider direction="vertical"></el-divider>
      <span>字段:</span>
      {{dataSummary[2]}}
    </el-divider>

    <!-- 分页区 -->
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
      title="设置维度"
      :visible.sync="dimensionDialogVisibleStatus"
      width="30%"
      @close="closeDialog"
    >
      <!-- 内容主体区域 -->
      <el-form :model="handlerInfo" label-width="70px">
        <el-form-item label="维度表">
          <el-select v-model="handlerInfo.dimension_table" filterable placeholder="请选择维度表">
            <el-option v-for="item in dimensionTable" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dimensionDialogVisibleStatus = false">取 消</el-button>
        <el-button type="primary" @click="setDimensionAction">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 请求操作
import {
  List,
  SourceType,
  DbName,
  TableName,
  FieldName,
  DataSummary,
  DimensionStatus
} from "@/api/database.js";
import { DimensionTable } from "@/api/dimension.js";
import { getToken } from "@/api/services/cookie.js";

export default {
  name: "metaDatabase",
  data() {
    return {
      // ===========================================================数据请求信息=====================================================================
      // 获取用户列表的参数对象
      requestInfo: {
        // 过滤字段
        source_type: "",
        db_name: "",
        table_name: "",
        field_name: "",

        // 搜索字段
        search_field: "",

        // 当前页数
        page: 1,
        // 每页大小
        size: 10
      },
      // 元数据列表与总数
      total: 0,
      databaselist: [],

      // 过滤搜索字段
      filterSearchType: [],
      filterDbName: [],
      filterTableName: [],
      filterFieldName: [],

      // 数据汇总
      dataSummary: [],

      // 维度设置与操作
      currentDatabase: [],
      dimensionDialogVisibleStatus: false,
      handlerInfo: {
        id: "",
        is_dimension: "",
        dimension_table: ""
      },
      dimensionTable: []
    };
  },
  // 发起数据处理请求
  created() {
    this.getDatabaseList(); // 获取元数据列表，请求信息已经封装
    this.getFilterSearchType();
    this.getDataSummary();
  },
  mounted() {
    if (!getToken()) {
      // 页面路由跳转
      this.$router.push({ name: "Login" });
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
    // 过滤数据源
    filterSearchTypeChange(item) {
      this.getDatabaseList();
      this.requestInfo.page = 1;
      this.requestInfo.db_name = "";
      this.requestInfo.table_name = "";
      this.requestInfo.field_name = "";
      this.filterDbName = [];
      this.filterTableName = [];
      this.filterFieldName = [];
      this.getFilterDbName();
    },
    // 过滤数据库
    filterDbNameChange(item) {
      this.getDatabaseList();
      this.requestInfo.page = 1;
      this.requestInfo.table_name = "";
      this.requestInfo.field_name = "";
      this.filterTableName = [];
      this.filterFieldName = [];
      this.getFilterTableName();
    },
    // 过滤表
    filterTableNameChange(item) {
      this.getDatabaseList();
      this.requestInfo.page = 1;
      this.requestInfo.field_name = "";
      this.filterFieldName = [];
      this.getFilterFieldName();
    },
    // 过滤字段
    filterFieldNameChange(item) {
      this.requestInfo.page = 1;
      this.getDatabaseList();
    },
    // 元数据维度切换
    databaseDimensionSwitch(database) {
      this.currentDatabase = database;
      this.handlerInfo.id = database.id;
      if (database.is_dimension) {
        // 设置维度
        DimensionTable(null)
          .then(res => {
            if (res.code != 200) {
              return this.$message.error("获取维度列表失败");
            }
            this.dimensionTable = res.data;
            // 弹窗显示维度
            this.dimensionDialogVisibleStatus = true;
            this.handlerInfo.is_dimension = "1";
          })
          .catch(error => {
            return this.$message.error("获取维度列表失败");
          });
      } else {
        // 弹窗显示提示
        this.$confirm(
          "此操作将变更维度状态，并取消维度表关联, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            // 置空维度
            this.handlerInfo.is_dimension = "0";
            this.handlerInfo.dimension_table = "";
            this.setDimensionAction();
          })
          .catch(() => {
            this.currentDatabase.is_dimension = !this.currentDatabase.is_dimension;
            this.$message({
              type: "info",
              message: "已取消变更"
            });
          });
      }
    },
    // 变更维度请求操作
    setDimensionAction() {
      if (this.currentDatabase.is_dimension && !(this.handlerInfo.dimension_table.length > 0)) {
          return this.$message.error('请选择维度表');
      }
      DimensionStatus(this.handlerInfo)
        .then(res => {
          if (res.code != 200) {
            this.currentDatabase.is_dimension = !this.currentDatabase.is_dimension;
            return this.$message.error("更新维度失败！");
          }
          this.dimensionDialogVisibleStatus = false;
          this.getDatabaseList();
          this.$message.success("更新用户状态成功！");
        })
        .catch(error => {
          this.currentDatabase.is_dimension = !this.currentDatabase.is_dimension;
          return this.$message.error("更新维度失败！");
        });
    },
    // 关闭弹窗操作
    closeDialog() {
      this.currentDatabase.is_dimension = !this.currentDatabase.is_dimension;
      this.handlerInfo.dimension_table = '';
      this.dimensionDialogVisibleStatus = false;
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
    // 获取数据源列表
    getFilterSearchType() {
      SourceType(null)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error("获取数据源列表");
          }
          this.filterSearchType = res.data;
        })
        .catch(error => {
          alert(111);
          return this.$message.error("获取数据源列表");
        });
    },
    // 获取数据库列表
    getFilterDbName() {
      DbName(this.requestInfo)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error("获取数据库列表");
          }
          this.filterDbName = res.data;
        })
        .catch(error => {
          return this.$message.error("获取数据库列表");
        });
    },
    // 获取表列表
    getFilterTableName() {
      TableName(this.requestInfo)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error("获取表列表");
          }
          this.filterTableName = res.data;
        })
        .catch(error => {
          return this.$message.error("获取表列表");
        });
    },
    // 获取字段列表
    getFilterFieldName() {
      FieldName(this.requestInfo)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error("获取字段列表");
          }
          this.filterFieldName = res.data;
        })
        .catch(error => {
          return this.$message.error("获取字段列表");
        });
    },
    // 获取汇总数据指标
    getDataSummary() {
      DataSummary(null)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error("获取字段列表");
          }
          this.dataSummary = res.data; //JSON.parse(JSON.stringify(res.data));
          console.log(this.dataSummary);
        })
        .catch(error => {
          return this.$message.error("获取字段列表");
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