<template>
  <el-card>
    <avue-crud
      v-model="formData"
      :data="data"
      :search.sync="queryParams"
      :option="option"
      :table-loading="showLoading"
      :page.sync="page"
      :before-open="beforeSaveOpen"
      :upload-after="uploadAfter"
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

      <template slot="tagListForm" slot-scope="{type,disabled,value}">
        {{ initTagValue(value) }}
        <el-row v-for="(fromTag,index) in value" :key="index" style="margin: 5px 0">
          <el-col :span="3">
            <el-button type="primary" icon="el-icon-plus" circle @click="formTagListAdd(value)" />
            <el-button type="danger" icon="el-icon-minus" circle @click="formTagListDelete(value,index)" />
          </el-col>
          <el-col :span="5" style="padding: 0 5px">
            <el-select v-model="fromTag.tagType" :inline="true" :disabled="disabled" value="" placeholder="请选择标签类型">
              <el-option v-for="(typeName, typeCode) in tagTypeMap" :key="typeCode" :label="typeName" :value="parseInt(typeCode)" />
            </el-select>
          </el-col>
          <el-col v-if="fromTag.tagType === 1" :span="6" style="padding: 0 5px">
            <el-select v-model="fromTag.tagName" :inline="true" :disabled="disabled" value="" placeholder="请输入客户端名称">
              <el-option v-for="item in clientTypeList" :key="item" :label="item" :value="item" />
            </el-select>
            <!--            <el-input :inline="true" :disabled="disabled" v-model="fromTag.tagName" placeholder="请输入客户端名称"></el-input>-->
          </el-col>
          <el-col :span="6" style="padding: 0 5px">
            <el-input v-model="fromTag.link" :inline="true" :disabled="disabled" placeholder="请输入链接" />
          </el-col>
        </el-row>
      </template>

      <template slot="blockchainList" slot-scope="scope">
        <el-tag v-if="!scope.row.blockchainList || (scope.row.blockchainList && scope.row.blockchainList.length < 1)">暂无</el-tag>
        <el-tag v-for="item in scope.row.blockchainList" v-else v-show="blockchainDic.find(each => each.value === item)" :key="item.id" style="margin: 0 1px">{{ blockchainDic.find(each => each.value === item)?blockchainDic.find(each => each.value === item).label:'' }}</el-tag>
      </template>
      <template slot="tagList" slot-scope="scope">
        <el-tag v-if="!scope.row.tagList || (scope.row.tagList && scope.row.tagList.length < 1)">暂无</el-tag>
        <el-tag v-for="item in scope.row.tagList" v-else :key="item.id" style="margin: 0 1px">{{ item.tagName }}</el-tag>
      </template>
    </avue-crud>
  </el-card>
</template>

<script>

import shucangPlatformApi from '../../api/api_shucang_platform'
import blockchainAPi from '../../api/api_blockchain'
import tagApi from '../../api/api_tag'
const fail_img2 = require('@/assets/img/fail_img2.png')

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
      formData: {},
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
      formRemark: '',
      menuType: 'text',
      showLoading: false,
      tagTypeMap: tagApi.TAG_MAP,
      clientTypeList: tagApi.CLIENT_TYPE,
      marketModuleList: shucangPlatformApi.MARKET_MODULE
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
            listType: 'picture-img',
            type: 'upload',
            span: 24,
            accept: 'image/png, image/jpeg, image/gif',
            propsHttp: {
              // res: 'data',
              // name: 'data.url'
              // home: 'http://rgl6i3hwh.hn-bkt.clouddn.com'
            },
            tip: '只能上传jpg/png/gif，且不超过2MB',
            loadText: '图片上传中，请稍等',
            action: '/auImgs',
            formatter: (val, value, label) => {
              return value || fail_img2
            }
          },
          {
            label: '平台名称',
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
            label: '交易机制',
            prop: 'marketModel',
            type: 'select',
            search: true,
            dicData: this.marketModuleList,
            // rules: [
            //   {
            //     required: true,
            //     message: '交易机制',
            //     trigger: 'blur'
            //   }
            // ],
            formatter: (val, value, label) => {
              const find = this.marketModuleList.find(item => item.value === value)
              return find ? find.label : '未知'
            }
          },
          {
            label: '上链信息',
            prop: 'blockchainList',
            search: true,
            type: 'select',
            dicData: this.blockchainDic,
            multiple: true,
            slot: true
          },
          {
            label: '简介',
            prop: 'remark',
            type: 'textarea',
            search: true,
            // 内容超出隐藏
            overHidden: true,
            span: 24,
            formatter: (val, value, label) => {
              return value || '暂无'
            }
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入简介',
            //     trigger: 'blur'
            //   }
            // ]
          },
          {
            label: '标签',
            prop: 'tagList',
            type: 'select',
            multiple: true,
            span: 24,
            slot: true
          }
        ]
      }
    }
  },
  watch: {},
  mounted() {
    console.log(Object.keys(tagApi.TAG_MAP))

    const _this = this
    blockchainAPi.PAGE({
      pageNum: 1,
      pageSize: 100,
      searchCount: true
    }).then(res => {
      console.log(res)
      _this.blockchainDic = res.list.map(item => {
        return {
          label: item.blockchain,
          value: item.id
        }
      })
    })
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
          shucangPlatformApi.REMOVES(removeIds).then(res => {
            this.$message.success('批量删除' + removeIds.length + '个数据成功')
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
      this.queryParams.tagTypes = Object.keys(tagApi.TAG_MAP).map(key => parseInt(key))
      shucangPlatformApi.PAGE(this.queryParams).then(res => {
        console.log(res)
        _this.page.total = res.total
        _this.page.currentPage = res.pageNum
        _this.data = res.list
      })
    },
    rowSave(form, done, loading) {
      // 添加数据方法
      const _this = this
      form.tagList.map(item => {
        if (item.tagName === '') {
          if (item.tagType === 2) {
            item.tagName = '天眼查'
          } else {
            item.tagName = _this.tagTypeMap[item.tagType]
          }
        }
      })
      shucangPlatformApi.ADD(form).then(res => {
        done(form)
        this.$message.success('添加成功')
      }).catch(() => {
        loading()
      })
    },
    rowUpdate(form, index, done, loading) {
      // 更新数据
      const _this = this
      form.tagList.map(item => {
        if (item.tagName === '') {
          if (item.tagType === 2) {
            item.tagName = '天眼查'
          } else {
            item.tagName = _this.tagTypeMap[item.tagType]
          }
        }
      })
      shucangPlatformApi.UPDATE(form).then(res => {
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
        shucangPlatformApi.REMOVE(form.id).then(res => {
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
      done()
    },
    formTagListAdd(value) {
      value.push({
        'tagName': '',
        'tagType': '',
        'link': ''
      })
    },
    formTagListDelete(value, index) {
      if (value.length > 1) {
        value.splice(index, 1)
      }
    },
    // 上传图片后回调函数
    uploadAfter(res, done, loading, column) {
      if (res.code !== 200) {
        loading()
      }
      done()
    },
    initTagValue(value) {
      if (value === undefined) return
      if (value == null || value.length === 0) {
        value.push({
          'tagName': '',
          'tagType': '',
          'link': ''
        })
      }
      // return value == null || value.length === 0 ? [{
      //   'tagName': '',
      //   'tagType': '',
      //   'link': ''
      // }] : value
    }
  }
}
</script>

<style scoped>

</style>
