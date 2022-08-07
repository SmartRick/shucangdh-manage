<template>
  <el-card>
    <avue-crud
      :data="data"
      :search.sync="queryParams"
      :option="option"
      :table-loading="showLoading"
      :page.sync="page"
      :before-open="beforeSaveOpen"
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


      <template slot-scope="{type,disabled}" slot="tagListForm">
        <el-row v-for="(fromTag,index) in formTagList">
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-plus" circle @click="formTagListAdd"></el-button>
            <el-button type="danger" icon="el-icon-minus"  circle @click="formTagListDelete(index)"></el-button>
          </el-col>
          <el-col :span="4">
            <el-select :inline="true" :disabled="disabled" value=""  v-model="fromTag.tagType"  placeholder="请选择标签类型">
              <el-option v-for="item in tagTypeList" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-col>

          <el-col  :span="7" v-if="fromTag.tagType === 1">
            <el-select :inline="true" :disabled="disabled" value=""  v-model="fromTag.tagName"  placeholder="请输入客户端名称">
              <el-option v-for="item in clientTypeList" :label="item" :value="item" :key="item"></el-option>
            </el-select>
<!--            <el-input :inline="true" :disabled="disabled" v-model="fromTag.tagName" placeholder="请输入客户端名称"></el-input>-->
          </el-col>
          <el-col  :span="7">
            <el-input :inline="true" :disabled="disabled" v-model="fromTag.link" placeholder="请输入链接"></el-input>
          </el-col>
        </el-row>

      </template>

      <template slot="blockchainList" slot-scope="scope" >
        <el-tag v-if="scope.row.blockchainList.length < 1">暂无</el-tag>
        <el-tag v-for="item in scope.row.blockchainList">{{item.blockchain}}</el-tag>
      </template>
      <template slot="tagList" slot-scope="scope" >
        <el-tag v-for="item in scope.row.tagList">{{item.tagName}}</el-tag>
      </template>
    </avue-crud>
  </el-card>
</template>

<script>

import sucangPlatformApi from '../../api/sucang_platform'
import blockchainAPi from '../../api/blockchain'
import tagApi from '../../api/tag'

const arr = [{
  label: '选项1',
  value: 1
}, {
  label: '选项2',
  value: 2
}, {
  label: '选项3',
  value: 3
}]

export default {
  name: 'Index',
  data() {
    return {
      queryParams: {
        marketModel: '',
        name: '',
        remark: '',
        pageNum: 1,
        pageSize: 10,
        searchCount: true
      },
      page: {
        total: 10,
        currentPage: 1,
        pageSize: 10
      },
      data: [],
      selectedList: [],
      blockchainDic: [],
      clientDic: [],


      formTagList: [
        {
          'tagName': '',
          'tagType': '',
          'link': ''
        }
      ],
      menuType: 'text',
      showLoading: false,
      tagTypeList: tagApi.TAG_TYPE,
      clientTypeList: tagApi.CLIENT_TYPE
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
            label: '封面',
            prop: 'coverImg',
            type: 'img'
          },
          {
            label: '平台',
            prop: 'name',
            search: true,
            searchOrder: 1,
            searchLabelWidth: 100,
            rules: [
              {
                required: true,
                message: '请输入平台名称',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '简介',
            prop: 'remark',
            search: true,
            // 内容超出隐藏
            overHidden: true,
            rules: [
              {
                required: true,
                message: '请输入简介',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '交易机制',
            prop: 'marketModel',
            search: true,
            rules: [
              {
                required: true,
                message: '交易机制',
                trigger: 'blur',

              }
            ]
          },
          {
            label: '上链信息',
            prop: 'blockchainList',
            search: true,
            type: 'select',
            dicData: this.blockchainDic,
            multiple: true,
            slot:true
          },
          {
            label: '标签',
            prop: 'tagList',
            type: 'select',
            multiple: true,
            dicData: arr,
            formslot: true,
            span:24,
            search: true,
            slot:true
          },
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
          sucangPlatformApi.REMOVES(removeIds).then(res => {
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
      sucangPlatformApi.PAGE(this.queryParams).then(res => {
        console.log(res)
        _this.page.total = res.total
        _this.page.currentPage = res.pageNum
        _this.data = res.list
      })
    },
    rowSave(form, done, loading) {
      // 添加数据方法
      form.tagList = this.formTagList
      sucangPlatformApi.ADD(form).then(res => {
        done(form)
      }).catch(() => {
        loading()
      })
    },
    rowUpdate(form, index, done, loading) {
      // 更新数据
      sucangPlatformApi.UPDATE(form).then(res => {
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
        sucangPlatformApi.REMOVE(form.id).then(res => {
          this.fetchData()
          this.$message.success('删除成功')
        })
      })
    },
    refreshChange() {
      console.log('刷新数据')
      this.fetchData()
    },
    beforeSaveOpen(done, type) {
      const _this = this;
      blockchainAPi.PAGE({
        pageNum: 1,
        pageSize: 100,
        searchCount: true
      }).then(res => {
        console.log(res)
        _this.blockchainDic = res.list.map(item => {
          return {
            'label': item.blockchain,
            'value': item.id
          }
        })
      });
      done();
    },
    formTagListAdd(){
      this.formTagList.push({
        'tagName': '',
        'tagType': '',
        'link': ''
      })
    },
    formTagListDelete(index){
      if (this.formTagList.length>1){
        this.formTagList.splice(index,1)
      }
    }
  }
}
</script>

<style scoped>

</style>
