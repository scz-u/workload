<template>
  <div class="search_audit">
    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input v-model="content" size="small"></el-input>
        </el-col>
        <el-col :span="14">
          <el-button
            size="small"
            type="primary"
            @click="searchClick()"
            class="margin_l_10"
            >搜索</el-button
          >
        </el-col>
        <el-col class="search_middle">
          <!-- <p class="search_p" @click="transClick()">
            <i class="el-icon-search"></i>
            搜索工具
          </p> -->
          <transition name="fade" mode="out-in">
            <p class="search_p" v-if="show" key="one" @click="transClick()">
              <i class="el-icon-search"></i>
              搜索工具
            </p>
            <div class="search_p" v-else key="two">
              <span @click="transClick()">
                <i class="el-icon-arrow-up"></i>
                收起工具
              </span>
              <span>
                <el-form :inline="true">
                  <el-form-item>
                    <el-select
                      size="mini"
                      placeholder="任务"
                      v-model="task_codes"
                      multiple
                      collapse-tags
                      filterable
                      :filter-method="searchTypeC"
                    >
                      <el-option
                        v-for="item in tasklist"
                        :key="item"
                        :value="item.Code"
                        :label="item.Title"
                      >
                        <span style="float: left">{{ item.Title }}</span>
                        <span
                          style="
                            float: right;
                            color: #8492a6;
                            font-size: 13px;
                            margin-right: 15px;
                            margin-left: 5px;
                          "
                          >{{ item.CreateTime.split("T")[0] }}</span
                        ></el-option
                      >
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select
                      size="mini"
                      placeholder="用户"
                      v-model="userid"
                      filterable
                      :filter-method="searchType"
                    >
                      <el-option
                        v-for="item in userlist"
                        :label="item.name"
                        :value="item.uid"
                        :key="item"
                      >
                        <span style="float: left">{{ item.name }}</span>
                        <span
                          style="float: right; color: #8492a6; font-size: 13px"
                          >{{ item.uid }}</span
                        >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-date-picker
                      size="mini"
                      v-model="value1"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="mini" @click="clearClick()"
                      >清空</el-button
                    >
                  </el-form-item>
                </el-form>
              </span>
            </div>
          </transition>
        </el-col>
        <el-col>
          <data-tables
            v-loading="loading"
            :data="dataList"
            :pagination-props="{ pageSizes: [5, 10, 15] }"
            ref="table"
            :row-key="row_key"
            :expand-row-keys="expandRowKeys"
            @selection-change="handleSelectionChange"
            :table-props="tableProps"
          >
            <el-table-column type="selection" width="65"></el-table-column>
            <el-table-column label="内容">
              <template slot-scope="props">
                <div
                  v-for="(item, index) in props.row.FormFieldInfos"
                  :key="item"
                >
                  <p class="flow-subtitle" v-if="index < 3">
                    <span
                      v-if="
                        item.opt_label != '' &&
                        item.opt_label != 'image' &&
                        item.opt_label != 'file'
                      "
                    >
                      {{ item.field_label }}:{{ item.opt_label.split("__")[1] }}
                    </span>
                    <span
                      v-else-if="
                        item.opt_label == 'image' || item.opt_label == 'file'
                      "
                    >
                      <!-- {{ item.vaule }} -->
                      {{ item.field_label }}:
                      <span v-if="item.value != null">
                        <span v-if="item.value.length > 1"
                          >{{ item.value[0].name }}...</span
                        >
                        <span v-else-if="item.value.length == 1">{{
                          item.value[0].name
                        }}</span>
                        <span v-else>-</span>
                      </span>

                      <span v-else>-</span>
                    </span>
                    <span v-else>
                      {{ item.field_label }}:{{ item.value }}
                    </span>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="任务名">
              <template slot-scope="props">
                {{ props.row.TaskName }}
              </template>
            </el-table-column>
            <el-table-column label="表单名" prop="FormName"> </el-table-column>
            <el-table-column label="提交人" prop="CreateUserName">
            </el-table-column>
            <el-table-column label="发起时间">
              <template slot-scope="props">
                <div class="flow-permisson-row">
                  <span class="flow-subtitle">
                    {{
                      new Date(props.row.CreateTime)
                        .toISOString()
                        .replace(/T/g, " ")
                        .replace(/\.[\d]{3}Z/, "")
                        .split(" ")[0]
                    }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="props">
                <div class="flow-permisson-row">
                  <span>
                    <span class="flow_per" v-if="props.row.State == 0"
                      >未提交</span
                    >
                    <span
                      class="flow_per warning"
                      v-else-if="props.row.State == 1"
                      >已提交

                      <!-- {{ auditFirst(props.row.AuditStates) }} -->
                    </span>
                    <span
                      class="flow_per danger"
                      v-else-if="props.row.State == 2"
                      >驳回</span
                    >
                    <span
                      class="flow_per success"
                      v-else-if="props.row.State == 3"
                      >已通过</span
                    >
                    <span
                      class="flow_per warning"
                      v-else-if="props.row.State == 4"
                    >
                      <!-- {{ props.row.AuditStates }} -->
                      <span
                        v-for="(item, index) in props.row.AuditStates"
                        :key="item"
                      >
                        <span>{{ item.user_info[0].name }}</span>
                        <span v-if="index < props.row.AuditStates.length - 1"
                          >/</span
                        >
                      </span>
                      审核中</span
                    >
                    <span
                      class="flow_per success"
                      v-else-if="props.row.State == 5"
                      >已通过</span
                    ><span class="flow_per" v-else-if="props.row.State == 6"
                      >导入数据</span
                    >
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="props">
                <div class="form_operate">
                  <el-link
                    :underline="false"
                    type="primary"
                    @click="detailClick(props.row, 3)"
                  >
                    <span>详情</span>
                  </el-link>
                  <!-- <el-link
                :underline="false"
                type="primary"
                class="margin_l_5"
                @click="addClick(props.row.Code)"
              >
                <span>通过</span>
              </el-link>

              <el-link
                :underline="false"
                type="primary"
                class="margin_l_5"
                @click="delClick(props.row.Code)"
              >
                <span>退回</span>
              </el-link> -->

                  <!-- <el-link
                :underline="false"
                type="primary"
                class="margin_l_5"
                @click="delClick(props.row.Code)"
                v-if="props.row.State == 0 || props.row.State == 2"
                >删除</el-link
              > -->
                </div>
              </template>
            </el-table-column>
          </data-tables>
        </el-col>
      </el-row>
    </el-card>
    <DetailAlert
      :is_add="is_detail"
      :detail="detail"
      :is_flag="is_flag"
      @back="detailBack"
    ></DetailAlert>
  </div>
</template>
<script>
import DetailAlert from './components/detailAlert'
export default {
  name: 'search_audit',
  components: { DetailAlert },
  data () {
    return {
      content: '',
      show: true,
      value1: [],
      dataList: [],
      loading: false,
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      tasklist: [],
      tasklist_two: [],
      userlist: [],
      userlist_two: [],
      task_codes: [],
      userid: '',
      is_flag: 2,
      is_detail: false,
      detail: {},
    }
  },
  methods: {
    detailBack (val) {
      this.is_detail = val
    },

    detailClick (item, num) {
      this.is_flag = num
      this.is_detail = !this.is_detail
      this.detail = item
    },
    clearClick () {
      this.task_codes = []
      this.userid = ''
      this.value1 = []
    },
    getdate (date) {
      const d = new Date(date)
      const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
      // const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())

      return resDate
    },
    p (s) {
      return s < 10 ? '0' + s : s
    },
    searchClick () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,

      }
      console.log(this.task_codes)
      console.log(this.userid)
      console.log(this.value1)
      if (this.content.trim() != '') {
        payload['content'] = JSON.stringify(this.content.split(' '))
      }
      if (this.task_codes.length > 0) {
        payload['task_codes'] = JSON.stringify(this.task_codes)
      }
      if (this.userid != '') {
        payload['userid'] = this.userid
      }
      if (this.value1.length > 0) {
        payload['start_time'] = this.getdate(this.value1[0])
        payload['end_time'] = this.getdate(this.value1[1])
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['fsearch'] + '?signature=' + keyvalue;
      // return false;
      this.dataList = []
      this.loading = true
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.loading = false
        this.dataList = data.data

      }).catch(err => {
        console.log(err)
      })
    },
    transClick () {
      console.log('-------')
      this.show = !this.show
    },
    getalltaskinfo () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,

      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['alltaskinfo'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.tasklist = data.data
        this.tasklist_two = JSON.parse(JSON.stringify(data.data))

      }).catch(err => {
        console.log(err)
      })
    },
    getallusernameandid () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,

      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allusernameandid'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.userlist = data.data
        this.userlist_two = JSON.parse(JSON.stringify(data.data))

      }).catch(err => {
        console.log(err)
      })
    },
    searchType (val) {
      console.log(val)

      this.userlist = this.userlist_two.filter(item => {
        if (item.name.indexOf(val) != -1 || item.uid.indexOf(val) != -1) {
          return true
        } else {
          this.userlist = this.userlist_two
        }

      })

    },
    searchTypeC (val) {
      this.tasklist = this.tasklist_two.filter(item => {
        if (item.Title.indexOf(val) != -1) {
          return true
        } else {
          this.tasklist = this.tasklist_two
        }

      })
    }
  },
  mounted () {
    this.getalltaskinfo()
    this.getallusernameandid()
  }
}
</script>
<style lang="less">
.search_audit {
  .el-tag.el-tag--light {
    width: inherit !important;
    min-height: 21px !important;
  }
  .el-select__tags-text {
    display: inline-block;
    max-width: 84px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 16px;
  }
  .el-select .el-tag__close.el-icon-close {
    top: -3px;
  }
  .search_middle {
    margin-bottom: 10px;
  }
  .search_p {
    margin-top: 5px;
    cursor: pointer;
    .el-input {
      width: 200px;
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(10px);
  }
}
</style>