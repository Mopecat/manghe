<template>
  <div class="app-container">
    <div class="total">应付款总金额： {{ getTotal }}</div>
    <el-button class="button" type="primary" size="small" @click="exportExcel">导出表格</el-button>
    <el-table
      id="out-table-fukuan"
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
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买入价" align="center">
        <template slot-scope="scope">
          <span class="red">{{ Math.floor(scope.row.price - 1000) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款人" align="center">
        <template slot-scope="scope">
          <Name :id="scope.row.id" :type="1" />
        </template>
      </el-table-column>
      <el-table-column type="selection" label="已确认付款" />
    </el-table>
  </div>
</template>

<script>
import { list } from '@/api/mangheV1'
import Name from './components/name.vue'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  components: {
    Name
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  computed: {
    getTotal() {
      let total = 0
      if (this.list) {
        this.list.forEach((item) => {
          total += Math.floor(item.price - 1000)
        })
      }
      return total
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
      list({ page, status: 1, type: 'buylist' })
        .then((data) => {
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
          // this.setStore()
        })
        .catch((error) => {
          console.log(error)
          this.listLoading = false
        })
    },
    exportExcel() {
      var xlsxParam = { raw: true }
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table-fukuan'), xlsxParam)
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        const date = new Date().toLocaleDateString()
        FileSaver.saveAs(
          // Blob 对象表示一个不可变、原始数据的类文件对象。
          // Blob 表示的不一定是JavaScript原生格式的数据。
          // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: 'application/octet-stream' }),
          // 设置导出文件名称
          `${date}付款列表.xlsx`
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
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
.total {
  margin: 20px 0;
  font-size: 30px;
  font-weight: 700;
}
.button {
  margin: 20px 0;
}
</style>
