<template>
  <div class="form_list_fill_mobile">
    <div v-if="!is_more">
      <div class="top_form margin_top_15">
        <span class="name_span margin_l_10">{{ name }}表单</span>
      </div>
      <div class="content_top" v-if="tableData.length == 0">
        <img src="@/assets/img/none.png" alt="" />
      </div>
      <ul>
        <li
          v-for="(item, index) in tableData"
          :key="index"
          style="margin-top: 20px"
          class="weui-cells weui-cells_checkbox"
        >
          <!-- <label class="weui-cell weui-check__label left" :for="item.id">
            <div class="weui-cell__hd">
              <input
                type="checkbox"
                class="weui-check"
                v-model="checkModel"
                :value="item.Code + '_' + item.State"
                :id="item.Id"
                @change="changeCheckbox()"
              />
              <i class="weui-icon-checked"></i>
            </div>
          </label> -->
          <div class="weui-cell cursor" @click.stop="gourl(item)">
            <div class="weui-cell__bd">
              <p v-for="(items, index) in item.FormFieldInfos" :key="items">
                <span v-if="index == 0">
                  <!-- {{ item }} -->
                  <span v-if="items.opt_label != ''">
                    {{ items.field_label }}:{{ items.opt_label.split("__")[1] }}
                  </span>
                  <span v-else>
                    {{ items.field_label }}：{{ items.value }}
                  </span>
                </span>
                <span v-else>
                  <span v-if="items.is_counted" class="count_style">
                    {{ items.field_label }}：{{ items.value }}</span
                  >
                </span>
              </p>
            </div>
            <!-- <div class="weui-cell__hd">
              <p
                class="state_p state_danger_1"
                v-if="item.State != 0 && item.State != 2"
                @click.stop="recall(item)"
              >
                撤回
              </p>
            </div> -->
          </div>
          <div class="clearfix"></div>
          <div
            class="weui-cell padding_left_0"
            @click.stop="gourl(item)"
            style="text-align: right"
          >
            <div
              class="weui-cell__bd"
              style="text-align: left; font-size: 14px; padding-left: 15px"
            >
              {{
                new Date(
                  +new Date(new Date(item.CreateTime).toJSON()) +
                    8 * 3600 * 1000
                )
                  .toISOString()
                  .replace(/T/g, " ")
                  .replace(/\.[\d]{3}Z/, "")
                  .slice(0, -3)
              }}
            </div>
            <div class="weui-cell__hd">
              <p class="state_p state_warning" v-if="item.AssignState == 1">
                已分配
              </p>
              <p class="state_p state_success" v-if="item.AssignState == 2">
                分配完成
              </p>
            </div>
            <div class="weui-cell__hd">
              <p class="state_p state_info" v-if="item.State == 0">未提交</p>
              <p
                class="state_p state_info"
                v-if="item.State == 1 || item.State == 5"
              >
                已提交
              </p>
              <p class="state_p state_danger" v-if="item.State == 2">已驳回</p>
              <p class="state_p state_success" v-if="item.State == 3">已通过</p>
              <p class="state_p state_warning" v-if="item.State == 4">
                {{ auditFirst(item.AuditStates)[0] }}
                <GetTreeNameM :openid="item"></GetTreeNameM>
                <span v-if="auditFirst(item.AuditStates).length > 1"
                  >等{{ auditFirst(item.AuditStates).length }}人</span
                >
                审核中
              </p>
            </div>
            <!-- <div class="weui-cell__hd">
                  <p class="state_p state_info" v-if="item.State == 0">
                    删除
                  </p>
                </div> -->
          </div>
        </li>
      </ul>
    </div>

    <el-dialog
      :append-to-body="true"
      title="选择审批"
      :visible.sync="dialogTableVisible"
      width="600px"
      class="audit_dialog"
      :close-on-click-modal="false"
    >
      <el-form class="auditform" label-width="80px" @submit.native.prevent>
        <el-form-item label="部门">
          <el-select
            v-model="select_depart"
            placeholder="请选择"
            @change="auditSelectClick()"
          >
            <el-option
              v-for="item in auditkey"
              :key="item"
              :label="auditlist[item].depart_name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批">
          <el-select v-model="select_auditcode" placeholder="请选择">
            <el-option
              v-for="item in audit_key_list"
              :key="item.NodeCode"
              :label="item.ConditionName"
              :value="item.NodeCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="dialogTableVisible = false"
          size="small"
          round
          class="width_90"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="auditSubmitClick()"
          size="small"
          round
          class="width_90"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <FillAlert
      :is_add="is_add"
      :form_data="formdetail"
      :task_code="task_code"
      @back="fillBack"
      @subback="subFillBack"
    ></FillAlert>
    <FillEditorAlert
      :is_add="is_editor"
      :form_data="formdetail"
      :main_code="main_code"
      :task_code="task_code"
      :detail="detail"
      @back="fillEBack"
      @subback="subFillEBack"
    ></FillEditorAlert>
    <DetailAlert
      :is_add="is_detail"
      :detail="detail"
      :form_data="formdetail"
      @back="detailBack"
      @otherback="otherDetailBack"
    ></DetailAlert>
    <LogAlert :is_add="is_log" :code="logcode" @back="logBack"> </LogAlert>
  </div>
</template>
<script>
import { getUser } from '../../../utils/auth'
import { afterEncrypt, beforeEncrypt } from '../../../utils/encryption'
// import FillAlert from './components/fillAlert'
// import FillEditorAlert from './components/fillEditorAlert'
// import DetailAlert from './components/detailAlert'
// import LogAlert from './components/logAlert'
export default {
  name: 'form_list',
  // components: { FillAlert, FillEditorAlert, DetailAlert, LogAlert },
  data () {
    return {
      name: '',
      is_log: false,
      logcode: '',
      corpid: this.$store.state.corpid,
      dialogTableVisible: false,
      formdetail: {},
      task_code: '',
      is_add: false,
      is_editor: false,
      tableData: [],
      main_code: '',
      dellist: [],
      TypeId: 0,
      auditkey: [],
      audit_key_list: [],
      select_auditcode: '',
      select_depart: '',
      is_detail: false,
      detail: {},
      filed_infos: [],
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } }

    }
  },
  methods: {
    gourl (item) {
      // setUser('list_code', beforeEncrypt(item.Code))
      // setUser('rule_code', beforeEncrypt(item.RuleCode))
      // setUser('mission_state_one', beforeEncrypt(this.mission_state.toString()))
      // if (item.State == 0 || item.State == 2) {
      //   this.$router.push({ name: 'look_audit', query: { k: Date.now() } })
      // } else {
      this.$router.push({ name: 'look_audit_no', query: { k: Date.now(), list_code: beforeEncrypt(item.Code) } })
      // }

    },
    logClick (code) {
      this.logcode = code
      this.is_log = !this.is_log
    },
    logBack (val) {
      this.is_log = val
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

    detailClick (item) {
      this.is_detail = !this.is_detail
      this.detail = item
    },
    detailBack (val) {
      this.is_detail = val
    },
    otherDetailBack () {
      this.allmaindatabyformcodeanduserid()
    },
    checkaudittype () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: this.task_code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['checkaudittype'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // console.log(codeval)
        this.TypeId = data.data.TypeId
        if (this.TypeId == 3) {
          this.getauditlist()
        }

      }).catch(err => {
        console.log(err)
      })
    },
    auditSelectClick () {
      console.log(this.select_depart)
      this.select_auditcode = ''
      this.audit_key_list = this.auditlist[this.select_depart].conditions
    },
    auditSubmitClick () {
      if (this.select_auditcode == '') {
        this.$alert('请选择审批流程！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      if (this.num == 1) {
        //单条审批
        this.commitmaindatawithnodecode(this.codeval)
      } else {
        //批量审批
        this.batchcommitmaindatawithnodecode(this.codeval)
      }
    },
    submitClick (codeval, num) {
      console.log('ssss')
      if (this.TypeId == 0) {
        //不需要审批
        if (num == 1) {
          //单条审批
          this.commitmaindatawithoutaudit(codeval)
        } else {
          //批量审批
          this.batchcommitmaindatawithoutaudit(codeval)
        }
      } else if (this.TypeId == 3) {
        this.dialogTableVisible = !this.dialogTableVisible
        this.num = num
        this.codeval = codeval
        //选择部门审批
        if (num == 1) {
          //单条审批
        } else {
          //批量审批
        }
      } else {
        console.log('sdfsdf')
        //简单审批
        if (num == 1) {
          //单条审批
          this.commitmaindatawithtask(codeval)
        } else {
          //批量审批

          this.batchcommitmaindatawithtask(codeval)
        }
      }

    },
    /*--------------start----------------*/
    getauditlist () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: this.task_code,
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getauditlist'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.auditlist = data.data
        this.auditkey = Object.keys(data.data)

      }).catch(err => {
        console.log(err)
      })
    },
    //部门审批
    commitmaindatawithnodecode (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_code: code,
        depart_code: this.select_depart,
        node_code: this.select_auditcode
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['commitmaindatawithnodecode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then(() => {
        this.dialogTableVisible = false
        this.$message({
          type: 'success',
          message: '提交成功!'
        });
        this.allmaindatabyformcodeanduserid()

      }).catch(err => {
        console.log(err)
      })
    },
    batchcommitmaindatawithnodecode (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_codes: JSON.stringify(code),
        depart_code: this.select_depart,
        node_code: this.select_auditcode
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['batchcommitmaindatawithnodecode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.dialogTableVisible = false
        if (data.data == 70002) {
          this.$alert(data.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.allmaindatabyformcodeanduserid()
            }
          });
        } else {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.allmaindatabyformcodeanduserid()
        }

      }).catch(err => {
        console.log(err)
      })
    },
    //不需要审批
    commitmaindatawithoutaudit (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_code: code,
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['commitmaindatawithoutaudit'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {


        this.$message({
          type: 'success',
          message: '提交成功!'
        });
        this.allmaindatabyformcodeanduserid()


      }).catch(err => {
        console.log(err)
      })
    },
    batchcommitmaindatawithoutaudit (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_codes: JSON.stringify(code),
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['batchcommitmaindatawithoutaudit'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        if (data.data == 70002) {
          this.$alert(data.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.allmaindatabyformcodeanduserid()
            }
          });
        } else {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.allmaindatabyformcodeanduserid()
        }

      }).catch(err => {
        console.log(err)
      })
    },
    //简单审批
    commitmaindatawithtask (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_code: code,
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['commitmaindatawithtask'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功!'
        });
        this.allmaindatabyformcodeanduserid()

      }).catch(err => {
        console.log(err)
      })
    },
    batchcommitmaindatawithtask (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_codes: JSON.stringify(code),
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['batchcommitmaindatawithtask'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        if (data.data == 70002) {
          this.$alert(data.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.allmaindatabyformcodeanduserid()
            }
          });
        } else {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.allmaindatabyformcodeanduserid()
        }

      }).catch(err => {
        console.log(err)
      })
    },
    /*--------------end----------------*/
    handleSelectionChange (val) {
      console.log(val)
      this.dellist = val
    },
    addListClick () {
      if (this.dellist.length == 0) {
        this.$alert('请选择提交内容！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      let codelist = []
      for (let i in this.dellist) {
        codelist.push(this.dellist[i].Code)
      }
      this.submitClick(codelist, 2)
    },

    batchdel () {
      if (this.dellist.length == 0) {
        this.$alert('请选择要删除的数据', '提示', {
          confirmButtonText: '确定',
        });
        return false;
      }
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let checkModel = []
        for (let i in this.dellist) {
          checkModel.push(this.dellist[i].Code)
        }

        let $this = this
        let payload = {
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          main_codes: JSON.stringify(checkModel)
        }
        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['batchdel'] + '?signature=' + keyvalue;
        console.log(payload)
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then((data) => {
          console.log(data)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.dellist = []
          this.allmaindatabyformcodeanduserid()

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      })
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
          this.allmaindatabyformcodeanduserid()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });

        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {

      });

    },

    ediotrFillClick (item) {
      console.log(item)
      this.main_code = item.Code
      this.detail = item
      this.is_editor = !this.is_editor
    },
    fillEBack (val) {
      this.is_editor = val
    },
    subFillEBack () {
      this.allmaindatabyformcodeanduserid()
    },
    subFillBack () {
      this.allmaindatabyformcodeanduserid()
    },
    fillClick () {
      this.is_add = !this.is_add
    },
    fillBack (val) {
      this.is_add = val
    },
    getformdetail () {
      let $this = this
      let code = this.$route.query.id
      this.task_code = afterEncrypt(this.$route.query.taskcode)
      this.name = this.$route.query.name
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getformdetail'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.formdetail = data.data
        this.formdetail.form_code = afterEncrypt(code)

      }).catch(err => {
        console.log(err)
      })
    },
    allmaindatabyformcodeanduserid () {
      let $this = this
      let code = this.$route.query.id
      this.task_code = afterEncrypt(this.$route.query.task_code)
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: afterEncrypt(code),
        task_code: this.task_code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allmaindatabyformcodeanduserid'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.tableData = data.data
        this.select_depart = ''
        this.select_auditcode = ''
        if (data.data.length == 0) {
          // this.filed_infos = data.filed_infos
          this.filed_infos = []
          for (let i in data.filed_infos) {
            this.filed_infos.push({ label: data.filed_infos[i].label })
          }
          this.filed_infos.push({ label: '状态' })
          this.filed_infos.push({ label: '操作' })
        }
        // this.formdetail.form_code = afterEncrypt(code)

      }).catch(err => {
        console.log(err)
      })
    },


  },
  mounted () {
    console.log('000000')
    this.getformdetail()
    this.allmaindatabyformcodeanduserid()
    this.checkaudittype()
  }
}
</script>
<style lang="less">
.form_list_fill_mobile {
  .type_div {
    margin-top: 20px;
    // cursor: pointer;
    .type_num_span {
      // display: inline-block;
      font-size: 14px;
      color: #999;
    }
    .type_editor_text {
      margin-left: 10px;
    }
    .del_span {
      color: #f56c6c;
    }
  }

  .title_form {
    border-bottom: 1px solid transparent;
    font-size: @font_16;
    margin-left: 10px;
    padding-bottom: 10px;
  }
  .content_list {
    padding-bottom: 60px;
    .content_top {
      text-align: center;
    }
  }
  .footer_list {
    border-top: @border;
    z-index: 50;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: @white;
  }
  .weui-cells_checkbox .weui-icon-checked:before {
    font-size: 20px;
  }
  .padding_left_0 {
    padding-left: 0px;
  }
  .del {
    background: #f56c6c;
  }
  .cube-btn-inline {
    padding: 12px 20px;
    font-size: 16px;
  }
  .state_p {
    font-size: 14px;
    // border: @border;
    padding: 2px 5px;
    border-radius: 5px;
  }
  .state_p.state_success {
    // border: 1px solid #67c23a;
    color: #67c23a;
  }
  .state_p.state_warning {
    // border: 1px solid #e6a23c;
    color: #e6a23c;
  }
  .state_p.state_danger {
    // border: 1px solid #f56c6c;
    color: #f56c6c;
  }
  .state_p.state_info {
    // border: 1px solid #909399;
    color: @color_g;
  }
  .state_p.state_danger_1 {
    border: 1px solid #f56c6c;
    color: #f56c6c;
    font-size: 16px;
    padding-left: 5px;
    padding-right: 5px;
  }
  .count_style {
    font-size: 13px;
    color: @color_g;
  }
  .footer_btn {
    line-height: 50px;
    margin-right: 15px;
    button:first-of-type {
      margin-right: 15px;
    }
  }
}
</style>