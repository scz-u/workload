<template>
  <div>
    <el-dialog
      :append-to-body="true"
      title="详情"
      :visible.sync="my_is_add"
      width="600px"
      class="detail_alert_dialog enddetail_fill"
      :close-on-click-modal="false"
    >
      <el-form class="auditform" label-width="150px" label-position="left">
        <el-form-item
          :label="item.field_label + ':'"
          v-for="item in detail.FormFieldInfos"
          :key="item"
          class="detail_form_item"
        >
          <p
            v-if="
              item.opt_label !== '' &&
              item.opt_label !== 'image' &&
              item.opt_label !== 'file'
            "
          >
            {{ item.opt_label.split("__")[1] }}
          </p>
          <div v-else-if="item.opt_label == 'image'">
            <span
              v-for="item_img in item.value"
              :key="item_img"
              class="margin_r_10 display_block"
            >
              <el-image
                style="width: 100px; height: 100px"
                :src="item_img.url"
                :preview-src-list="item.enable_greater"
              >
              </el-image>
            </span>
          </div>
          <div v-else-if="item.opt_label == 'file'">
            <div v-for="item_file in item.value" :key="item_file">
              <p>
                <span @click="goimg(item_file.key)" class="upload_list_span">
                  {{ item_file.name }}
                </span>
              </p>
            </div>
          </div>
          <p v-else>{{ item.value }}</p>

          <div
            v-if="item.assign_data != null && item.assign_data.length > 0"
            class="assign_show_div"
          >
            <p v-for="items in item.assign_data" :key="items">
              {{ items.ToUserName }}:{{ items.ToValue }}
            </p>
          </div>
        </el-form-item>
        <!-- <el-form-item
          label="审批流程："
          label-width="200px"
          v-if="detail.AuditStates != null"
          class="audit_item"
        >
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
                    <span
                      v-for="(item, index) in activity.user_info"
                      :key="item"
                    >
                      {{ item.name }}
                      <span v-if="index < activity.userids.length - 1">/</span>
                    </span>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-form-item> -->
      </el-form>

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
        <!-- <el-button
          @click="callbackone(detail.Code)"
          icon="el-icon-refresh-left"
          size="small"
          v-if="detail.State != 0 && detail.State != 2"
        >
          撤 回</el-button
        >
        <el-button
          icon="el-icon-delete"
          @click="delClick(detail.Code)"
          size="small"
        >
          删 除</el-button
        > -->
        <el-button
          icon="el-icon-tickets"
          @click="logClick(detail.Code)"
          size="mini"
          round
        >
          日 志</el-button
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
  </div>
</template>
<script>
import LogAlert from './logAlert'
// import GetTreeNameM from '../../publicLibrary/getTreeNameM.vue'
export default {
  name: 'detail_alert_dialog',
  props: {
    is_add: Boolean,
    detail: Object,
    form_data: Object
  },
  components: { LogAlert },
  data () {
    return {
      my_is_add: false,
      is_editor: false,
      is_log: false,
      logcode: '',
      is_editor: false,
      main_code: '',
    }
  },
  methods: {
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
      console.log(item)
      this.main_code = item
      this.is_editor = !this.is_editor
    },
    fillEBack (val) {
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
        }
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
.detail_alert_dialog.enddetail_fill {
  .auditform {
    border: @border;
    // padding: 10px;
    .el-form-item {
      text-align: right;
      padding: 5px 20px;
      margin-bottom: 0;
    }
    .el-form-item:nth-child(2n) {
      background: #f6f7f8;
    }
  }
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
  .audit_div {
    // background: red;
    width: 320px;
    margin-top: 5px;
    .el-timeline-item {
      height: 50px;
    }
    .el-timeline-item__tail {
      top: 10px;
    }
    .el-timeline-item__content {
      line-height: 20px;
    }
    .audit_title {
      // font-size: 18px;
    }
    .audit_num {
      color: #858585;
      font-size: 12px;
    }
  }
}
</style>