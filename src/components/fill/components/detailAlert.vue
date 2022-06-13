<template>
  <div>
    <el-dialog
      :append-to-body="true"
      title="详情"
      :visible.sync="my_is_add"
      width="600px"
      class="detail_alert_dialog form_other_detail_el_dialog"
      :close-on-click-modal="false"
    >
      <div class="form_other_detail">
        <el-row>
          <el-col :span="24">表单名：{{ detail.FormName }}</el-col>
          <el-col :span="12">创建人：{{ detail.CreateUserName }}</el-col>
          <el-col :span="12"
            >创建时间：{{
              new Date(detail.CreateTime)
                .toISOString()
                .replace(/T/g, " ")
                .replace(/\.[\d]{3}Z/, "")
                .split(" ")[0]
            }}</el-col
          >
        </el-row>
      </div>
      <el-table
        :data="detail_arr"
        v-if="detail_arr.length > 0"
        border
        stripe
        :header-cell-style="{ background: '#EAEDEF', color: '#606266' }"
      >
        <el-table-column prop="name" width="150" label="字段">
          <template slot-scope="props">
            <span
              v-if="props.row.str_list != null && props.row.str_list.length > 0"
            >
              {{ props.row.name }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="props.row.str_list.join('')"
                placement="right"
              >
                <i class="el-icon-warning-outline"></i> </el-tooltip
            ></span>

            <span v-else> {{ props.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="数值">
          <template slot-scope="props">
            <p
              v-if="
                props.row.opt_label !== '' &&
                props.row.opt_label !== 'image' &&
                props.row.opt_label !== 'file'
              "
            >
              {{ props.row.opt_label.split("__")[1] }}
            </p>
            <div v-else-if="props.row.opt_label == 'image'">
              <span
                v-for="item_img in props.row.value"
                :key="item_img"
                class="margin_r_10 display_block"
              >
                <el-image
                  style="width: 100px; height: 100px"
                  :src="item_img.url"
                  :preview-src-list="props.row.enable_greater"
                >
                </el-image>
              </span>
            </div>
            <div v-else-if="props.row.opt_label == 'file'">
              <div v-for="item_file in props.row.value" :key="item_file">
                <p>
                  <span @click="goimg(item_file.key)" class="upload_list_span">
                    {{ item_file.name }}
                  </span>
                </p>
              </div>
            </div>
            <p v-else>
              {{ props.row.value }}
              <!-- <span v-if=""></span> -->
              <!-- <span v-html="otherString(props.row.value)"></span> -->
            </p>
            <div
              v-if="
                props.row.assign_data != null &&
                props.row.assign_data.length > 0
              "
            >
              <el-table :data="props.row.assign_data" border>
                <el-table-column
                  label="被分配人"
                  prop="ToUserName"
                ></el-table-column>
                <el-table-column
                  label="被分配值"
                  prop="ToValue"
                ></el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="detail.AuditStates != null" class="margin_top_10 audit_user">
        <p class="font_weight_bold">审批流程：</p>
        <div class="audit_div">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in detail.AuditStates"
              :key="index"
              :color="activity.node_state == 0 ? '#0bbd87' : '#D6D6D6'"
            >
              <div>
                <div class="left">
                  <p class="audit_title">审批人</p>
                  <p class="audit_num">
                    {{ activity.userids.length }}人
                    <span>{{
                      activity.node_state == 0 ? "(已审批)" : "(待审批)"
                    }}</span>
                  </p>
                </div>
                <div class="right">
                  <span v-for="(item, index) in activity.user_info" :key="item">
                    {{ item.name }}
                    <span v-if="index < activity.userids.length - 1">/</span>
                  </span>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          @click="callbackone(detail.Code)"
          icon="el-icon-refresh-left"
          size="mini"
          v-if="detail.State != 0 && detail.State != 2"
          round
        >
          撤 回</el-button
        >
        <el-button
          icon="el-icon-delete"
          @click="delClick(detail.Code)"
          size="mini"
          round
        >
          删 除</el-button
        >
        <el-button
          icon="el-icon-tickets"
          @click="logClick(detail.Code)"
          size="mini"
          round
        >
          日 志</el-button
        >
        <el-button
          icon="el-icon-edit"
          @click="ediotrFillClick(detail.Code)"
          size="mini"
          type="primary"
          :disabled="
            detail.State == 0 || detail.State == 2 || detail.State == 6
              ? false
              : true
          "
          round
        >
          编 辑</el-button
        >
      </span>
    </el-dialog>
    <!-- <EditorDetailAlert
      :is_add="is_editor"
      :detail="detail"
      :task_code="detail.TaskCode"
      @back="editorBack"
      @subback="editorSubBack"
    ></EditorDetailAlert> -->
    <LogAlert :is_add="is_log" :code="logcode" @back="logBack"> </LogAlert>
    <FillEditorAlert
      :is_add="is_editor"
      :form_data="form_data"
      :detail="detail"
      :main_code="main_code"
      :task_code="task_code"
      @back="fillEBack"
      @subback="editorSubBack"
    ></FillEditorAlert>
  </div>
</template>
<script>
import FillEditorAlert from './fillEditorAlert'
import LogAlert from './logAlert'
// import GetTreeNameM from '../../publicLibrary/getTreeNameM.vue'
export default {
  name: 'detail_alert_dialog',
  props: {
    is_add: Boolean,
    detail: Object,
    form_data: Object
  },
  components: { LogAlert, FillEditorAlert },
  data () {
    return {
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      coprid: this.$store.state.corpid,
      my_is_add: false,
      is_editor: false,
      is_log: false,
      logcode: '',
      is_editor: false,
      main_code: '',
      detail_arr: [],
    }
  },
  methods: {
    otherString (str) {
      if (str.length > 10) {
        console.log(str)
        // var re = /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i
        let re = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
        str = str.replace(re, function (website) {
          return "<a href='" + website + "' class='color_a' target='_blank'>" + website + "</a>";
        });
        console.log(str)
        return str
      } else {
        return str
      }
    },
    goimg (key) {
      let $this = this
      let payload = {
        key: key
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['qiniudown'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        window.open(data.data);
      }).catch(err => {
        console.log(err)
      })
    },
    ediotrFillClick (item) {
      console.log(this.detail)
      console.log(item)
      this.main_code = item
      this.is_editor = !this.is_editor
    },
    fillEBack (val) {
      console.log(this.detail)
      this.is_editor = val
    },
    editorSubBack () {
      this.$emit('otherback')
      this.my_is_add = !this.my_is_add
    },
    logClick (code) {
      this.logcode = code
      this.is_log = !this.is_log
    },
    logBack (val) {
      this.is_log = val
    },
    editorClick () {
      this.is_editor = !this.is_editor
    },

    editorBack (val) {
      this.is_editor = val
    },
    delClick (code) {
      this.$confirm('删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let $this = this
        let payload = {
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          code: code,
        }

        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['delone_main'] + '?signature=' + keyvalue;
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then(() => {

          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$emit('otherback')
          this.my_is_add = !this.my_is_add

        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {

      });

    },
    callbackone (code) {
      this.$confirm('撤回该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let $this = this
        let payload = {
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          main_code: code,
        }

        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['callbackone'] + '?signature=' + keyvalue;
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then(() => {

          this.$message({
            type: 'success',
            message: '撤回成功!'
          });
          this.$emit('otherback')
          this.my_is_add = !this.my_is_add

        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {

      });

    },
    getimgurl (key, item) {

      let $this = this
      let payload = {
        key: key.key
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['qiniudown'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        key.url = data.data
        item.enable_greater.push(data.data)
        return data.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    is_add (val) {
      this.my_is_add = val
      console.log(this.detail)
      this.detail_arr = []
      if (val) {
        for (let i in this.detail.FormFieldInfos) {
          if (this.detail.FormFieldInfos[i].opt_label == 'image' || this.detail.FormFieldInfos[i].opt_label == 'file') {
            this.enable_assign = []
            this.detail.FormFieldInfos[i].enable_greater = []
            for (let j in this.detail.FormFieldInfos[i].value) {
              let img = this.getimgurl(this.detail.FormFieldInfos[i].value[j], this.detail.FormFieldInfos[i])
              console.log(img)
              console.log(this.detail.FormFieldInfos[i].value[j])
              // this.detail.FormFieldInfos[i].enable_greater.push(this.detail.FormFieldInfos[i].value[j].url)
            }
            console.log(this.detail)
          }
          console.log(this.detail.FormFieldInfos[i].opt_label)
          this.detail_arr.push({ name: this.detail.FormFieldInfos[i].field_label, value: this.detail.FormFieldInfos[i].value, assign_data: this.detail.FormFieldInfos[i].assign_data, opt_label: this.detail.FormFieldInfos[i].opt_label, enable_greater: this.detail.FormFieldInfos[i].enable_greater, str_list: this.detail.FormFieldInfos[i].str_list })

        }
        // console.log(detail_arr)
        // this.detail_arr = detail_arr
        console.log(this.detail_arr)
      }
      // if(val){
      //   for(let i in this.detail.Au)
      // }
    },
    my_is_add (val) {
      this.$emit('back', val)
    }
  }
}
</script>
<style lang="less">
.detail_alert_dialog {
  .el-dialog__body {
    height: 500px;
    overflow: auto;
    padding-top: 20px;
  }
  .el-form-item__label,
  .el-form-item__content {
    line-height: 25px;
  }
  // .detail_form_item {
  .el-form-item__label {
    color: #858e99;
  }
  // }
}
.detail_alert_dialog {
  .assign_show_div {
    padding: 5px;
    border-radius: 5px;
    color: #858e99;
    font-size: @font_12;
    // border: @border;
  }
  .audit_item {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #e3e3e4;
  }
}
</style>