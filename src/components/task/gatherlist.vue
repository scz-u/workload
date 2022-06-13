<template>
  <div class="gatherlist">
    <div class="top_form">
      <span
        class="name_span"
        :class="{ active_gatherlist: is_tab }"
        @click="tabClick(1)"
        >{{ title }}</span
      >
      <span class="line_span">|</span>
      <span
        span
        class="name_span"
        :class="{ active_gatherlist: !is_tab }"
        @click="tabClick(2)"
        >数据详情</span
      >
      <span class="right">
        <!-- <router-link
          :to="{ name: 'ListTask', query: { k: Date.now() } }"
          class="margin_l_5"
        > -->
        <el-button
          size="small"
          icon="iconfont icon-cancel"
          class="margin_l_5 width_90"
          @click="goback()"
          round
          >返回</el-button
        >
        <!-- </router-link> -->
      </span>
    </div>
    <div v-show="is_tab">
      <el-card>
        <div class="margin_b_20">
          <el-input
            placeholder="搜索用户名"
            size="small"
            class="width_150"
            v-model="filters[0].value"
          ></el-input>
          <el-button
            size="small"
            icon="el-icon-download"
            class="margin_l_15"
            @click="exportExcel()"
            type="primary"
            round
            >导出</el-button
          >
        </div>
        <data-tables
          v-loading="loading"
          :filters="filters"
          :data="gather_list"
          :pagination-props="{ pageSizes: [10, 15, 30] }"
          ref="refTable"
          @selection-change="handleSelectionChange"
          @row-click="clickTable"
          :table-props="tableProps"
        >
          <el-table-column label="用户名">
            <template slot-scope="prop">
              {{ prop.row.user_name }}
              <!-- <GetTreeNameM
              :openid="prop.row.userid"
              :is_depart="false"
            ></GetTreeNameM> -->
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in rule_list_key"
            :key="item"
            :label="rule_list[item].name"
          >
            <el-table-column
              prop="ValidVote"
              :label="items.filed_name"
              v-for="items in rule_list[item].data"
              :key="items"
            >
              <template slot-scope="prop">
                <span v-if="prop.row[items.filed_code] != undefined">
                  {{ prop.row[items.filed_code] }}
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- <el-table-column label="操作">
          <template slot-scope="prop">
            <div>
              <el-link
                :underline="false"
                type="primary"
                @click="gourlClick(prop.row)"
                >详情</el-link
              >
            
            </div>
          </template>
        </el-table-column> -->
        </data-tables>
      </el-card>
    </div>

    <div class="type_div" v-show="!is_tab">
      <ul class="eform-list clearfix">
        <li v-for="items in formlist" :key="items">
          <div class="list_box">
            <div class="content_list_item">
              <!-- <p class="p_over">
                  {{ items.Title }}
                </p> -->
              <!-- <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :content="items.Title"
              >
                
              </el-popover> -->
              <p class="p_over" slot="reference">
                {{ items.Title }}
              </p>
              <!-- <p class="right">构建任务</p> -->
              <div class="clearfix"></div>
            </div>

            <div>
              <div class="left other_left">
                <!-- <p>已填报数：{{ items.AllCount }}</p>
                <p>审批中数：{{ items.AuditCount }}</p>
                <p>已通过数：{{ items.PassCount }}</p> -->

                <span
                  ><i class="iconfont icon-fill font_14"></i> 已填报数：{{
                    items.AllCount
                  }}</span
                >
                <!-- <p>审批中数：{{ items.AuditCount }}</p> -->
                <span class="margin_l_15">
                  <i class="iconfont icon-wait font_14"></i> 待审批数：{{
                    items.CommitCount
                  }}</span
                >
              </div>
              <ul class="operation flex right" style="display: block">
                <li @click="goClick(items)">
                  <span> 进入 </span>
                </li>
                <!-- <li>
                  编辑
                </li> -->
              </ul>
            </div>
          </div>
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>
  </div>
</template>
<script>
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';
export default {
  name: 'gatherlist',
  data () {
    return {
      formlist: [],
      is_tab: true,
      gather_list: [],
      rule_list: [],
      rule_list_key: [],
      title: '',
      code: '',
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      filters: [
        {
          prop: 'user_name',
          value: ''
        }
      ]
    }
  },
  methods: {
    goback () {
      console.log(this.$route.params.other)
      if (this.$route.params.other == '2' || this.$route.params.other == 2) {
        this.$router.push({ name: 'authorizeListTask', query: { k: Date.now() } })
      } else if (this.$route.params.other == '3' || this.$route.params.other == 3) {
        this.$router.push({ name: 'closeTask', query: { k: Date.now() } })
      } else {
        this.$router.push({ name: 'ListTask', query: { k: Date.now() } })
      }
    },
    goClick (item) {
      console.log(item)
      this.$router.push({ name: 'filllistTask', params: { other: this.$route.params.other }, query: { id: beforeEncrypt(item.Code), taskcode: this.$route.query.id, formname: item.Title, name: this.title } })
    },
    tabClick (num) {
      if (num == 1)
        this.is_tab = true
      else
        this.is_tab = false
    },
    getalltemplateform () {
      if (this.$route.query.other == '123') {
        this.is_tab = false
      }
      let $this = this
      let code = this.$route.query.id
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getformlist'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.formlist = data.data

      }).catch(err => {
        console.log(err)
      })
    },
    getgather () {
      let code = this.$route.query.id
      this.code = afterEncrypt(code)
      this.title = this.$route.query.name
      this.taskid = code
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['gatherlist'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      this.gather_list = []
      this.rule_list = []
      this.rule_list_key = []
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)

        this.gather_list = data.data.gather
        this.rule_list = data.data.form
        this.rule_list_key = Object.keys(data.data.form)
        console.log(this.gather_list)
        console.log(this.rule_list)

      }).catch(err => {
        console.log(err)
      })

    },
    exportExcel () {


      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: this.code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['export'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      this.gather_list = []
      this.rule_list = []
      this.rule_list_key = []
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // return false
        window.open(this.$store.state.imgurl + '/' + (data.data.path))
        this.getgather()


      }).catch(err => {
        console.log(err)
      })

    },
  },
  mounted () {
    this.getgather()
    this.getalltemplateform()
  }
}
</script>
<style lang="less">
.name_span {
  font-size: @font_16;

  cursor: pointer;
}
.line_span {
  display: inline-block;
  margin-left: 15px;
  margin-right: 15px;
}
.active_gatherlist {
  color: @color;
  font-weight: bold;
}

.gatherlist {
  .operation {
    width: 70px;
    border: @border;
    margin-bottom: 0;
    margin-top: 20px;
    border-radius: 30px;
    font-size: @font_12;
    // padding: 3px 5px;
    > li {
      text-align: center;
      cursor: pointer;
      border-right: @border;
      padding: 5px 15px;
    }
    > li:hover {
      span {
        color: @color;
      }
    }
  }
  .operation:hover {
    border: 1px solid @color;
  }
  .other_left {
    margin-top: 25px;
    line-height: 20px;
    font-size: @font_12;
    color: @other;
  }
}
</style>