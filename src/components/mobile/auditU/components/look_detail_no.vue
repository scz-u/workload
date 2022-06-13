<template>
  <div class="look_detail_mobile">
    <div v-if="!is_add && !is_editor && !is_depart_m">
      <div class="weui-cells__title">
        <div class="left" style="font-size: 14px">详情</div>

        <div class="right">
          <p class="log_p cursor" @click="golog()">日志>></p>
        </div>
        <div class="clearfix"></div>
      </div>

      <div class="form_other">
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
                v-if="
                  props.row.str_list != null && props.row.str_list.length > 0
                "
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
                    <span
                      @click="goimg(item_file.key)"
                      class="upload_list_span"
                    >
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
        </div>
      </div>
    </div>
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>
<script>
import { getUser, setUser } from '@/utils/auth_user';
import { afterEncrypt, beforeEncrypt } from '@/utils/encryption';
import GetTreeNameM from './getTreeNameM'
export default {
  name: 'look_detail',
  components: { GetTreeNameM },
  data () {
    return {
      is_depart_m: false,
      staging: {},
      rule_code: '',
      code: '',
      is_assign: false,
      detail: {},
      is_add: false,
      is_editor: false,
      assignlist: [],
      editordetail: {},
      mission_state: '',
      detail_arr: [],
    }
  },
  methods: {
    golog () {
      setUser('code', beforeEncrypt(this.code))
      this.$router.push({ name: 'log' })
    },
    delone (item) {
      let $this = this
      console.log(item)
      this.$createDialog({
        type: 'confirm',
        icon: 'cubeic-alert',
        title: '提示',
        content: '是否删除该分配值？',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false,
          href: 'javascript:;'
        },
        cancelBtn: {
          text: '取消',
          active: false,
          disabled: false,
          href: 'javascript:;'
        },
        onConfirm: () => {
          let payload = {
            data_code: this.code,
            as_id: item.Id,
            corpid: this.$store.state.corpid,
            userid: $this.$store.state.userid
          }
          let createvalue = $this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = $this.$apilist['deloneassigndata'] + '?signature=' + keyvalue;
          // return false;
          $this.$server.post(posturl, createvalue['fd']).then((data) => {
            console.log(data)
            const toast = this.$createToast({
              txt: '删除成功！',
              time: 1000,
              type: 'correct'
            })
            this.allassigndata()

            // $this.$router.go(-1)
            // $this.$emit('editorSub')
            // $this.close()

          }).catch(err => {
            console.log(err)
          })
        },

      }).show()
    },
    addone (items) {
      console.log(items)
      let item = JSON.parse(JSON.stringify(items))

      if (item.ToUserId == '') {

        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '未选择人员！',
          icon: 'cubeic-alert'
        }).show()

        return false;
      }
      for (let i in item.ToValues) {
        if (item.ToValues[i].value == '') {
          this.$createDialog({
            type: 'alert',
            title: '提示',
            content: item.ToValues[i].filed_name + '不能为空',
            icon: 'cubeic-alert'
          }).show()
          return false;
        }
        if (/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(item.ToValues[i].value)) {
          item.ToValues[i].value = parseFloat(item.ToValues[i].value)
        } else {
          this.$createDialog({
            type: 'alert',
            title: '提示',
            content: item.ToValues[i].filed_name + '请填写数字',
            icon: 'cubeic-alert'
          }).show()
          return false;
        }
      }
      item.is_flag = false
      this.editoneassigndata(item)


      // this.assignlist.push(this.staging)
      // this.is_stag = false
      // this.is_stag_editor = false
      // this.staging = {}

    },
    editoneassigndata (item) {
      let $this = this
      let payload = {
        data_code: this.code,
        to_userid: item.ToUserId,
        userid: this.$store.state.userid,
        to_value: JSON.stringify(item.ToValues),
        as_id: item.Id,
        corpid: this.$store.state.corpid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['editoneassigndata'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        const toast = this.$createToast({
          txt: '修改成功！',
          time: 1000,
          type: 'correct'
        })
        toast.show()
        this.is_stag = false
        this.is_stag_editor = false
        this.staging = {}
        this.allassigndata()

        // $this.$router.go(-1)
        // $this.$emit('editorSub')
        // $this.close()

      }).catch(err => {
        console.log(err)
      })
    },
    departSelect () {
      this.is_depart_m = !this.is_depart_m
    },
    departBackM (val) {
      this.is_depart_m = val
    },
    departSubM (val) {
      this.departlist_m = val.list

      this.editordetail.ToValues[0]['useridlist'] = val.list
      this.editordetail['useridlist'] = val.list
      console.log(this.staging)
      console.log(this.departlist_m)
      for (let i in val.list) {
        this.editordetail.ToUserId = (val.list[i].id)

      }
    },
    editorclose (item) {
      console.log(item)
      item.is_flag = false
      console.log(item)
      this.allassigndata()
    },
    editorone (item) {
      this.editordetail = item
      this.editordetail['useridlist'] = item.ToValues[0].useridlist
      item.is_flag = true

    },


    editorClick () {
      this.is_editor = !this.is_editor
    },
    editorSub () {
      this.maindatadetailbydatacode()
    },
    editorBack (val) {
      this.is_editor = val
    },
    assignClick () {
      this.is_add = !this.is_add
    },
    assignBack (val) {
      this.allassigndata()
      this.is_add = val
    },

    enableassign () {
      this.rule_code = afterEncrypt(getUser('rule_code'))
      let $this = this
      let payload = {
        rule_code: this.rule_code,
        userid: $this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['enableassign'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.is_assign = data.data

      }).catch(err => {
        console.log(err)
      })
    },
    maindatadetailbydatacode () {
      let code = afterEncrypt(getUser('list_code'))
      this.code = code
      // console.log(code)
      // let posturl = this.$apilist['maindatadetailbydatacode'] + '?code=' + code + '&userid=' + this.$store.state.userid + '&corpid=' + this.$store.state.corpid;
      // this.$server.get(posturl).then(data => {
      //   console.log(data)
      //   this.detail = data.data

      // }).catch(err => {
      //   console.log(err)
      // })

      let $this = this
      let payload = {
        main_code: this.code,
        corpid: this.$store.state.corpid,
        userid: $this.$store.state.userid
      }
      console.log(payload)
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['detailbycode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.detail = data.data
        this.is_assign = data.data.EnableAssign

      }).catch(err => {
        console.log(err)
      })

    },
    // allassigndata () {
    //   let code = afterEncrypt(getUser('list_code'))
    //   this.mission_state = afterEncrypt(getUser('mission_state_one'))
    //   let posturl = this.$apilist['allassigndata'] + '?data_code=' + code + '&userid=' + this.$store.state.userid + '&corpid=' + this.$store.state.corpid;
    //   this.$server.get(posturl).then(data => {
    //     console.log(data)
    //     for (let i in data.data) {
    //       data.data[i].ToValues = JSON.parse(data.data[i].ToValue)
    //     }
    //     console.log(data)
    //     this.assignlist = data.data
    //     this.leftvalue()

    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    allassigndata () {
      let $this = this
      let code = afterEncrypt(getUser('list_code'))
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        data_code: code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allassigndata'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {

        console.log(data)
        this.assignlist = data.data

        for (let i in data.data) {
          data.data[i]['is_flag'] = false
        }


      }).catch(err => {
        console.log(err)
      })
    },
    leftvalue () {
      let $this = this
      let payload = {
        data_code: this.code,
        corpid: this.$store.state.corpid,
        userid: $this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['leftvalue'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)


      }).catch(err => {
        console.log(err)
      })
    },
    detailbycode () {
      let code = afterEncrypt(this.$route.query['list_code'])
      this.code = code
      // console.log(code)
      // let posturl = this.$apilist['maindatadetailbydatacode'] + '?code=' + code + '&userid=' + this.$store.state.userid + '&corpid=' + this.$store.state.corpid;
      // this.$server.get(posturl).then(data => {
      //   console.log(data)
      //   this.detail = data.data

      // }).catch(err => {
      //   console.log(err)
      // })

      let $this = this
      let payload = {
        main_code: this.code,
        corpid: this.$store.state.corpid,
        userid: $this.$store.state.userid
      }
      console.log(payload)
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['detailbycode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.detail = data.data
        this.is_assign = data.data.EnableAssign
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

      }).catch(err => {
        console.log(err)
      })

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

  },
  mounted () {
    this.detailbycode()
    // this.getAgentId()
    // // this.enableassign()
    // this.maindatadetailbydatacode()
    // this.allassigndata()
  }
}
</script>
<style lang="less">
.look_detail_mobile {
  .form_other {
    padding: 5px;
  }
  .form_other_detail {
    background: #fff;
  }
  .audit_div {
    // background: red;
    // width: 320px;
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
  .log_p {
    // margin-top: 20px;
    // margin-bottom: 20px !important;
    color: @color_t;
    // margin-right: 10px;
    font-size: 16px;
    text-decoration: underline;
  }
  .border_div {
    display: inline-block;
    border: @border;
    padding: 2px 15px;
    border-radius: 5px;
  }
  .text_right {
    border-top: @border;
    padding-top: 10px;
    padding-right: 10px;
    text-align: right;
  }
  .footer_look {
    -webkit-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    // text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: @white;
    line-height: 50px;
    margin-right: 15px;
    .cube-btn-inline {
      padding: 12px 20px;
      font-size: 16px;
      margin-right: 15px;
    }
    // button:last-of-type {
    //   margin-right: 0px;
    // }
  }
}
</style>