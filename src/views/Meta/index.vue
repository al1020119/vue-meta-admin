<template>
  <div>
    <!-- 搜索与添加区域 -->
    <el-row :gutter="18">
      <el-col :span="5">
        <el-input placeholder="描述|库|表|字段|类型|值|操作人|备注" v-model="queryInfo.query" clearable @clear="getMetaList">
            <el-button slot="append" icon="el-icon-search" @click="getMetaList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary">添加元数据</el-button>
      </el-col>
    </el-row>
    
    <!-- 元数据列表区 -->
    <!-- 
        id					
        db_name				
        table_name			
        table_desc			
        field_name			
        field_desc			
        field_type			
        field_value			
        field_value_desc	
        source_type			
        status				
        created_by			
        created_at			
        updated_by			
        updated_at			
        is_dimension		
        dimension_table		
        comment				
     -->
    <el-table :data="metalist" border stripe>
      <el-table-column type="index" align="center"></el-table-column>

      <el-table-column label="库名" prop="db_name" align="center"></el-table-column>
      
      <el-table-column label="表名" prop="table_name" align="center"></el-table-column>
      <el-table-column label="表描述" prop="table_desc" align="center"></el-table-column>
      
      <el-table-column label="字段名" prop="field_name" align="center"></el-table-column>
      <el-table-column label="字段描述" prop="field_desc" align="center"></el-table-column>
      <el-table-column label="字段类型" prop="field_type" align="center"></el-table-column>

      <el-table-column label="字段值" prop="field_value" align="center"></el-table-column>
      <el-table-column label="字段值描述" prop="field_value_desc" align="center"></el-table-column>

      <el-table-column label="维度" prop="is_dimension" align="center"></el-table-column>
      <el-table-column label="维度表" prop="dimension_table" align="center"></el-table-column>

      <el-table-column label="数据源" prop="source_type" align="center"></el-table-column>
      
      <el-table-column label="字段状态" prop="status" align="center"></el-table-column>
      <!-- 作用域插槽直接获取数据 -->
      <!-- <el-table-column label="字段状态" prop="status"><template slot-scope="scope">{{scope.row}}</template></el-table-column> -->
      
      <el-table-column label="创建人" prop="created_by" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="created_at" align="center"></el-table-column>
      <el-table-column label="更新人" prop="updated_by" align="center"></el-table-column>
      <el-table-column label="更新时间" prop="updated_at" align="center"></el-table-column>
      
      <el-table-column label="备注" prop="comment"></el-table-column>
      
      <!-- <el-table-column label="记录"></el-table-column> -->
      <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 分配角色按钮 tooltip: 提示名 -->
            <el-tooltip effect="dark" content="操作日志" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
      </el-table-column>

    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="queryInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
// 登录请求操作
import { List } from "@/api/database.js";
export default {
  name: "metaIndex",
  data() {
    return {
        // 获取用户列表的参数对象
        queryInfo: {
            query: '',
            // 当前页数
            page: 1,
            // 每页大小
            size: 10,
        },
        metalist: [],
        total: 0
    };
  },
  // 发起数据处理请求
  created() {
      this.getMetaList(); // 获取元数据列表，请求信息已经封装
  },
  methods: {
    // 获取元数据信息
    getMetaList() {
      List(this.queryInfo)
        .then(res => {
            if (res.code != 200) {
                return this.$message.error("获取元数据列表失败");
            }
            this.metalist = res.data.meta;
            this.total = res.data.total;
        })
        .catch(error => {
            return this.$message.error("获取元数据列表失败");
            console.log(error);
        });
    },
    handleSizeChange(newSize) {
        this.queryInfo.size = newSize
        this.queryInfo.page = 1
        this.getMetaList();
    },
    handleCurrentChange(newPage) {
        // alert(newPage);
        this.queryInfo.page = newPage
        this.getMetaList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>