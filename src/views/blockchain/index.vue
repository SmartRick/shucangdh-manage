<template>
  <el-card>
    <avue-crud
      :data="data"
      :search.sync="queryParams"
      :option="option"
      :table-loading="showLoading"
      :page.sync="page"
      @search-change="searchChange"
      @search-reset="resetChange"
      @selection-change="selectionChange"
      @on-load="fetchData"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @refresh-change="refreshChange"
    >
      <!--      自定义菜单左侧按钮-->
      <template slot="menuLeft" slot-scope="{size}">
        <el-button type="danger" icon="el-icon-delete" :size="size" @click="removeBatch">批量删除</el-button>
      </template>

    </avue-crud>
  </el-card>
</template>

<script>

import blockchainAPi from '../../api/blockchain'

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
        total: 10,
        currentPage: 1,
        pageSize: 10
      },
      data: [],
      selectedList: [],
      menuType: 'text',
      showLoading: false
    }
  },
  computed: {
    option() {
      return {
        // 表格显示大小
        size: 'small',
        // 开起多选
        selection: true,
        // 允许翻页多选（切换分页后勾选仍然有效）
        reserveSelection: true,
        // 开起分页
        page: true,
        align: 'center',
        // 操作栏宽度
        // menuWidth:100,
        // 内置操作按钮配置
        // viewBtn: true,
        // editBtn: false,
        // delBtn: false,
        menuAlign: 'center',
        menuType: this.menuType,
        searchIndex: 3,
        searchIcon: true,
        column: [
          {
            label: '区块链名称',
            prop: 'blockchain',
            search: true,
            searchOrder: 1,
            searchLabelWidth: 100,
            // searchSpan: 18,
            // searchRange: true
            rules: [
              {
                required: true,
                message: '请输入区块链名称',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '简介',
            prop: 'remark',
            search: true,
            // 内容超出隐藏
            overHidden: true
          },
          {
            label: '官方地址',
            prop: 'link',
            type: 'url',
            // 内容超出隐藏
            overHidden: true,
            rules: [
              {
                required: true,
                message: '请输入区块链官方地址',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '主题色',
            prop: 'backgroundColor',
            type: 'color'
          }
        ]
      }
    }
  },
  watch: {},
  mounted() {
    // this.fetchData()
  },
  methods: {
    searchChange(params, done) {
      // 搜索回调
      this.fetchData()
      done()
    },
    resetChange() {
      // 搜索清空回调
      this.fetchData()
    },
    selectionChange(list) {
      // 多选回调
      this.selectedList = list
    },
    removeBatch() {
      if (this.selectedList.length > 0) {
        const _this = this
        this.$confirm('确定要删除勾选数据吗，删除后无法找回', {
          type: 'warning'
        }).then(() => {
          const removeIds = this.selectedList.map(item => item.id)
          REMOVES(removeIds).then(res => {
            // console.log(res)
            _this.fetchData()
          })
        })
      } else {
        this.$message.warning('请勾选需要删除的数据')
      }
    },
    fetchData() {
      console.log('加载数据')
      const _this = this
      this.queryParams.pageNum = this.page.currentPage
      this.queryParams.pageSize = this.page.pageSize
      blockchainAPi.PAGE(this.queryParams).then(res => {
        console.log(res)
        _this.page.total = res.total
        _this.page.currentPage = res.pageNum
        _this.data = res.list
      })
    },
    rowSave(form, done, loading) {
      // 添加数据方法
      blockchainAPi.ADD(form).then(res => {
        done(form)
      }).catch(() => {
        loading()
      })
    },
    rowUpdate(form, index, done, loading) {
      // 更新数据
      blockchainAPi.UPDATE(form).then(res => {
        done(form)
        this.$message.success('更新成功')
      }).catch(() => {
        loading()
      })
    },
    rowDel(form, index) {
      // 删除数据
      this.$confirm('确定要删除该行数据吗，删除后无法找回', {
        type: 'warning'
      }).then(() => {
        blockchainAPi.REMOVE(form.id).then(res => {
          this.fetchData()
          this.$message.success('删除成功')
        })
      })
    },
    refreshChange() {
      console.log('刷新数据')
      this.fetchData()
    }
  }
}
</script>

<style scoped>

</style>
