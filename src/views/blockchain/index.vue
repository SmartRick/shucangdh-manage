<template>
  <el-card>
    <avue-crud :data="data" :option="option" :table-loading="showLoading" :page.sync="page" />
  </el-card>
</template>

<script>

import { PAGE } from '../../api/blockchain'

export default {
  name: 'Index',
  data() {
    return {
      queryParams: {
        blockchain: '',
        pageNum: 1,
        pageSize: 10,
        remark: '',
        searchCount: true
      },
      page: {
        total: 100,
        currentPage: 1
      },
      data: [],
      menuType: 'text',
      showLoading: false,
      showPage: true,
      sizeValue: 'small'
    }
  },
  computed: {
    option() {
      return {
        size: this.sizeValue,
        selection: true,
        page: this.showPage,
        align: 'center',
        menuAlign: 'center',
        menuType: this.menuType,
        column: [
          {
            label: '区块链名称',
            prop: 'blockchain',
            search: true
          },
          {
            label: '简介',
            prop: 'remark',
            search: true
          },
          {
            label: '官方地址',
            prop: 'link'
          },
          {
            label: '主题色',
            prop: 'backgroundColor'
          }
        ]
      }
    }
  },
  mounted() {
    const _this = this
    PAGE(this.queryParams).then(res => {
      console.log(res)
      _this.page.total = res.pages
      _this.page.currentPage = res.pageNum
      _this.data = res.list
    })
  }
}
</script>

<style scoped>

</style>
