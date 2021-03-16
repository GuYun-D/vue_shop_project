<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            {{ scope.row.is_send }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <el-button
              type="primary"
              class="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>

            <el-button type="success" class="el-icon-location" size="mini"
              ><!-- @click="showProgressBox" -->
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框
     -->
    <el-dialog
      title="提示"
      :visible.sync="addRessVisible"
      width="50%"
      @close="addRessClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item
          v-model="addForm.address1"
          label="省市区县"
          prop="address1"
        >
          <el-cascader :options="cityDate" clearable> </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRessVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRessVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 查询物流 -->
    <el-dialog title="物理进度" :visible.sync="progressVisable" width="50%">
      <span>这是一段信息</span>
    </el-dialog>
  </div>
</template>

<script>
// 导入省市区数据
import cityDate from './citydata'

export default {
  data() {
    return {
      // 查询对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },

      // 总数
      total: 0,

      // 订单列表数据
      orderList: [],

      //
      addRessVisible: false,

      addForm: {
        address1: [],
        address2: '',
      },

      addFormRules: {
        address1: [
          {
            required: true,
            message: '请选择省市区县',
            trigger: 'blur',
          },
        ],

        address2: [
          {
            required: true,
            message: '请填写详细地址',
            trigger: 'blur',
          },
        ],
      },

      cityDate: cityDate,

      // 物流查询对话框
      progressVisable: false,
    }
  },

  created() {
    this.getOrderList()
  },

  methods: {
    //  获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }

      //   this.$message.success('获取订单列表成功')

      console.log(res)

      this.total = res.data.total

      this.orderList = res.data.goods
    },

    //
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    //
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },

    // 展示修改地址的对话框
    showBox() {
      this.addRessVisible = true
    },

    // 关闭对话框清空表单
    addRessClosed() {
      this.$refs.addFormRef.resetFields()
    },

    // 物流查询
    // 后台接口报错，停止编写此功能
    // async showProgressBox() {
    //   const { data: res } = await this.$http.get('/kuaidi/804909574412544580')

    //   if (res.meta.status !== 200) {
    //     return this.$message.error('获取物流进度失败！')
    //   }

    //   this.progressInfo = res.data

    //   this.progressVisible = true
    //   console.log(this.progressInfo)
    // },
  },
}
</script>

<style scoped>
.el-pagination {
  margin-top: 40px;
}

.el-cascader {
  width: 100%;
}
</style>