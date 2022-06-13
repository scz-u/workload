<template>
  <div class="gatherlist">
    <div class="top_form">
      <span class="name_span">{{ title }}</span>
      <span class="right">
        <router-link
          :to="{ name: 'ListFill', query: { k: Date.now() } }"
          class="margin_l_15"
        >
          <el-button
            size="small"
            icon="iconfont icon-cancel"
            class="margin_l_15 width_90"
            @click="close()"
            round
            >返回</el-button
          >
        </router-link>
      </span>
    </div>
    <div class="content sun_content">
      <div class="content_title">
        <p class="before display_inline_block"></p>
        <p class="before_font display_inline_block">汇总</p>
      </div>
      <div class="sum_table">
        <el-table
          v-loading="loading"
          :filters="filters"
          :data="gather_list"
          :pagination-props="{ pageSizes: [10, 15, 30] }"
          ref="refTable"
          @selection-change="handleSelectionChange"
          @row-click="clickTable"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
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
        </el-table>
      </div>
    </div>
    <div class="margin_top_30 content sun_content">
      <div class="content_title">
        <p class="before display_inline_block"></p>
        <p class="before_font display_inline_block">分配（他人分配给自己的）</p>
      </div>
      <div class="sum_table">
        <data-tables
          v-loading="loading"
          :filters="filters"
          :data="assignlist"
          :pagination-props="{ pageSizes: [10, 15, 30] }"
          ref="refTable"
          @selection-change="handleSelectionChange"
          @row-click="clickTable"
          :table-props="tableProps"
        >
          <el-table-column label="表单名">
            <template slot-scope="prop">
              <div>
                {{ prop.row.FormName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="分配字段">
            <template slot-scope="prop">
              {{ prop.row.FieldName }}
              <!-- <GetTreeNameM
              :openid="prop.row.userid"
              :is_depart="false"
            ></GetTreeNameM> -->
            </template>
          </el-table-column>
          <el-table-column label="分配人">
            <template slot-scope="prop">
              <div>
                {{ prop.row.FormUserName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="分配值">
            <template slot-scope="prop">
              <span v-if="prop.row.ToValue != undefined">
                {{ prop.row.ToValue }}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="props">
              <div class="flow-permisson-row">
                <span>
                  <span class="flow_per" v-if="props.row.State == 0"
                    >未提交</span
                  >
                  <span class="flow_per" v-else-if="props.row.State == 6"
                    >导入数据</span
                  >
                  <span
                    class="flow_per warning"
                    v-else-if="props.row.State == 1"
                    >已提交</span
                  >
                  <span class="flow_per danger" v-else-if="props.row.State == 2"
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
                    >审核中</span
                  >
                  <span
                    class="flow_per success"
                    v-else-if="props.row.State == 5"
                    >已通过</span
                  >
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="props">
              <el-link
                :underline="false"
                type="primary"
                @click="detailClick(props.row)"
                >详情</el-link
              >
            </template>
          </el-table-column>
        </data-tables>
      </div>
    </div>
    <DetailAlertAssign
      :is_add="is_detail"
      :detail="detail"
      :form_data="formdetail"
      @back="detailBack"
    ></DetailAlertAssign>
  </div>
</template>
<script>
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';
import DetailAlertAssign from './components/detailAlertAssign'
export default {
  name: 'gatherlist',
  components: { DetailAlertAssign },
  data () {
    return {
      gather_list: [],
      rule_list: [],
      rule_list_key: [],
      title: '',
      code: '',
      assignlist: [],
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      is_detail: false,
      detail: {},
      formdetail: {},
    }
  },
  methods: {
    detailClick (item) {
      this.is_detail = !this.is_detail
      this.detail = item
    },
    detailBack (val) {
      this.is_detail = val
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
      let posturl = $this.$apilist['gatherlistbyuserid'] + '?signature=' + keyvalue;
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
    othertoselfassigndata () {
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
      let posturl = $this.$apilist['othertoselfassigndata'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)

      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)

        // this.gather_list = data.data.gather
        // this.rule_list = data.data.form
        // this.rule_list_key = Object.keys(data.data.form)
        // console.log(this.gather_list)
        // console.log(this.rule_list)
        this.assignlist = data.data

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
        window.location.href = (data.data.path);


      }).catch(err => {
        console.log(err)
      })

    },
  },
  mounted () {
    this.getgather()
    this.othertoselfassigndata()
  }
}
</script>
<style lang="less">
.name_span {
  font-size: @font_16;
  font-weight: bold;
}
</style>