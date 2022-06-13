<template>
  <div class="form_task">
    <div class="flex">
      <div
        class="left_menu"
        v-if="
          this.$route.name != 'ImportListAddress' ||
          this.$route.name != 'FormTask'
        "
      >
        <div ref="left_menu">
          <el-menu
            :default-active="active"
            router
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">任务表单</span>
              </template>
              <el-menu-item
                :index="item.form_code"
                v-for="(item, index) in otherformlist"
                :key="index"
                >{{ item.title }}</el-menu-item
              >
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>

        <div class="other cursor" @click="collapseClick()">
          <i class="el-icon-arrow-right" v-if="isCollapse"></i>
          <i class="el-icon-arrow-left" v-else></i>
        </div>
      </div>
      <div class="right_content">
        <div class="text_right top_form">
          <router-link :to="{ name: 'NewTask', query: { k: Date.now() } }">
            <el-button icon="el-icon-plus" type="primary" size="small"
              >新建任务</el-button
            >
          </router-link>
          <el-button
            size="small"
            icon="el-icon-plus"
            class="margin_l_15"
            @click="typeClick()"
            >新建分类</el-button
          >
        </div>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="日期" width="180">
          </el-table-column>
          <el-table-column prop="name" label="用户名" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';
export default {
  name: 'form_task',
  data () {
    return {
      isCollapse: false,
      active: '1-1',
      otherformlist: [],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    collapseClick () {

      this.isCollapse = !this.isCollapse
      let left_menu = this.$refs['left_menu']
      console.log(this.$refs)
      setTimeout(function () {
        console.log(left_menu.offsetHeight)
      }, 100)

    },
    gettaskfullinfo () {
      let code = this.$route.query.id
      this.taskid = code
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['gettaskfullinfo'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)

        this.otherformlist = data.data.form_info
        this.active = data.data.form_info[0].form_code

      }).catch(err => {
        console.log(err)
      })

    },
  },
  created () {
    this.gettaskfullinfo()
  }
}
</script>
<style lang="less">
.form_task {
  .top_form,
  .left_menu {
    margin-top: 0;
  }
  .left_menu {
    margin-left: 0;
  }
}
</style>