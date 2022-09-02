<template>
  <div class="app-container">
    <el-table
      ref="ondesklist"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="单号">
        <template slot-scope="scope">
          {{ scope.row.ordersn }}
        </template>
      </el-table-column>
      <el-table-column label="日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标价" align="center" class="red">
        <template slot-scope="scope">
          <span>{{ scope.row.currprice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收款" align="center">
        <template slot-scope="scope">
          <span class="red">{{ Math.floor(scope.row.currprice - 1000) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买入价" align="center">
        <template slot-scope="scope">
          <span class="red">{{ Math.floor(scope.row.price - 1000) }}</span>
        </template>
      </el-table-column>
      <el-table-column type="selection" label="已确认收款" />
    </el-table>
  </div>
</template>

<script>
import { list } from '@/api/mangheV1'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      if (!this.res) {
        this.getList(1)
      }
    },
    getList(page) {
      list({ page, status: 1, type: 'salelist' }).then((data) => {
        this.listLoading = false
        if (data.data.status === 1) {
          const res = data.data.result
          console.log(res)
          if (!this.list) {
            this.list = res.list
          } else {
            this.list.push(...res.list)
          }

          if (res.total / res.pagesize > page) {
            this.getList(page + 1)
          }
        } else {
          alert('请求错误')
        }
      })
    }
  }
}
</script>
<style scoped>
.pagination-manghe {
  margin-top: 20px;
}
.red {
  color: rgb(220, 91, 111);
}
</style>
