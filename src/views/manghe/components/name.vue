<!--
@desc: 获取收付款人姓名
@author:刘洋
@date: 2022/09/02 14:39:45
-->
<template>
  <div>
    <span class="red">{{ name.trim() }}</span>
  </div>
</template>

<script>
import { detail, saleDetail } from '@/api/mangheV1'
export default {
  name: 'Name',
  filters: {},
  components: {},
  props: ['id', 'type'],
  data() {
    return {
      name: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    if (this.type === 3) {
      this.getSaleDetail()
    } else {
      this.getDetail()
    }
  },
  mounted() {},
  methods: {
    getDetail() {
      detail({ id: this.id, type: this.type }).then((data) => {
        const index =
          this.type === 2 ? data.data.indexOf('买家真实姓名') : data.data.indexOf('收款人真实姓名')
        if (this.type === 2) {
          this.name = data.data.substring(index + 45, index + 52)
        } else if (this.type === 1) {
          this.name = data.data.substring(index + 46, index + 53)
        }
      })
    },
    getSaleDetail() {
      setTimeout(() => {
        saleDetail({ id: this.id, type: this.type }).then((data) => {
          const template = `margin-left:1rem`
          const index = data.data.indexOf(template)

          this.name = data.data.substring(index + template.length + 3, index + template.length + 9)
        })
      }, 1000)
    }
  }
}
</script>

<style scoped>
.red {
  color: rgb(220, 91, 111);
}
</style>
