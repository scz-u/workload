<template>
  <div class="auditlist" v-if="my_is_add">
    <div>
      <div class="top_audit">
        <h1 class="title">选择审批流程</h1>
      </div>
      <div class="content_fill">
        <div class="weui-cells__title">
          部门
        </div>
        <div class="weui-cells weui-cells_checkbox">
          <label class="weui-cell weui-check__label " @click="showPicker()">
            <span v-if="depart_text != ''">{{ depart_text }}</span>
            <span v-else>请选择</span>
          </label>
        </div>
        <div class="weui-cells__title">
          审批
        </div>
        <div class="weui-cells weui-cells_checkbox">
          <label
            class="weui-cell weui-check__label "
            @click="showAuditPicker()"
          >
            <span v-if="audit_text != ''">{{ audit_text }}</span>
            <span v-else>请选择</span>
          </label>
        </div>
      </div>
      <div class="content_fill">
        <div class="weui-cells__title">
          <GetTreeName
            :openid="audit_key"
            :is_get="is_get"
            :isdepart="true"
          ></GetTreeName>
        </div>
        <div class="weui-cells weui-cells_checkbox">
          <!-- <label
            class="weui-cell weui-check__label"
            :for="option.Code"
            v-for="(option, index) in audit_list[audit_key]"
            :key="index"
            @click="selected(option)"
          >
            <div class="weui-cell__bd">
              <p>{{ option.Code }}</p>
            </div>
            <div class="weui-cell__ft">
              <input
                type="checkbox"
                class="weui-check"
                v-model="checkModel"
                name="radio1"
                :id="option.Code"
              />
              <span class="weui-icon-checked"></span>
            </div>
          </label> -->
          <label
            class="weui-cell weui-check__label "
            :for="option.Code"
            @click="selected(option)"
            v-for="(option, index) in audit_list[audit_key]"
            :key="index"
          >
            <div class="weui-cell__bd">
              <p>{{ option.Title }}</p>
              <p class="remark_p" v-if="option.Remark != ''">
                备注：{{ option.Remark }}
              </p>
            </div>
            <div class="weui-cell__hd">
              <input
                type="checkbox"
                class="weui-check"
                v-model="checkModel"
                :value="option.Code"
                :id="option.Id"
              />
              <i class="weui-icon-checked"></i>
            </div>
          </label>
        </div>
      </div>
      <div class="footer_list">
        <div class="right footer_btn">
          <cube-button :outline="true" :inline="true" @click="close()"
            >返回</cube-button
          >
          <cube-button :primary="true" :inline="true" @click="submitClik()"
            >确定</cube-button
          >
        </div>
      </div>
    </div>
    <picker
      :list="departlist"
      :is_show="is_show"
      :num="audit_key_list.indexOf(audit_key)"
      @pickersubmit="pickersubmit"
      @back="pickerBack"
    ></picker>
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
  <script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>
<script>
import GetTreeName from './getTreeName'
import picker from './picker'

export default {
  name: 'auditlist',
  components: { GetTreeName, picker },
  props: {
    task_code: String,
    is_add: Boolean,
    selectedlist: Array
  },
  data () {
    return {
      my_is_add: false,
      audit_list: {},
      audit_key_list: [],
      audit_key: "",
      departlist: [],
      is_show: false,
      checkModel: [],
      is_get: false,
      auditlist: [],
      auditkey: [],
      departlist: [],
      depart_code: '',
      depart_text: '',
      audit_code: '',
      audit_text: "",
    }
  },
  methods: {
    showPicker () {
      if (!this.picker) {
        console.log(this.departlist)
        this.picker = this.$createPicker({
          title: '部门',
          data: [this.departlist],
          onSelect: this.selectHandle,
          onCancel: this.cancelHandle
        })
      }
      this.picker.show()
    },
    selectHandle (selectedVal, selectedIndex, selectedText) {

      this.depart_code = selectedVal.join(', ')
      this.depart_text = selectedText.join(' ')
    },
    showAuditPicker () {
      if (this.depart_code == '') {
        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '请先选择部门！',
          icon: 'cubeic-alert'
        }).show()
        return false;
      }
      let auditlist = this.auditlist[this.depart_code].conditions
      if (!this.picker_audit) {
        console.log(this.departlist)
        this.picker_audit = this.$createPicker({
          title: '审批',
          data: [auditlist],
          alias: {
            value: 'NodeCode',
            text: 'ConditionName'
          },
          onSelect: this.selectAuditHandle,
          onCancel: this.cancelHandle
        })
      }
      this.picker_audit.show()
    },
    selectAuditHandle (selectedVal, selectedIndex, selectedText) {

      this.audit_code = selectedVal.join(', ')
      this.audit_text = selectedText.join(' ')
    },
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
        this.departlist = []
        for (let i in this.auditkey) {
          this.departlist.push({ text: this.auditlist[this.auditkey[i]].depart_name, value: this.auditkey[i] })
        }

      }).catch(err => {
        console.log(err)
      })
    },
    batchcommitmaindatawithnodecode () {
      let codeval = []
      for (let i in this.selectedlist) {
        codeval.push(this.selectedlist[i].split("_")[0])
      }
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_codes: JSON.stringify(codeval),
        depart_code: this.depart_code,
        node_code: this.audit_code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['batchcommitmaindatawithnodecode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.dialogTableVisible = false
        this.depart_code = ''
        this.depart_text = ''
        this.audit_code = ''
        this.audit_text = ''
        const toast = this.$createToast({
          txt: '提交成功',
          type: 'correct',
          time: 1000
        })
        toast.show()
        this.$emit('auditsubmit')
        this.close()

      }).catch(err => {
        console.log(err)
      })
    },
    submitClik () {
      console.log(this.checkModel.length)
      console.log(this.selectedlist)
      if (this.depart_code == '') {
        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '请选择部门！',
          icon: 'cubeic-alert'
        }).show()
        return false;
      }
      if (this.audit_code == '') {
        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '请选择审批！',
          icon: 'cubeic-alert'
        }).show()
        return false;
      }
      this.batchcommitmaindatawithnodecode()
    },
    submitClick () {
      console.log(this.checkModel)
      if (this.checkModel.length == 0) {
        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '未选择！',
          icon: 'cubeic-alert'
        }).show()
        return false;
      }
      let $this = this
      let checkModel = []
      for (let i in this.selectedlist) {
        checkModel.push(this.selectedlist[i].split("_")[0])
      }
      let payload = {
        data_codes: JSON.stringify(checkModel),
        audit_code: this.checkModel[0],
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      console.log(payload)
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['commitmaindata'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        const toast = this.$createToast({
          txt: '提交成功',
          type: 'correct',
          time: 1000
        })
        toast.show()
        this.$emit('auditsubmit')
        this.close()

      }).catch(err => {
        console.log(err)
      })

    },
    selected (item) {
      this.checkModel = []
      this.checkModel.push(item.Code)
      console.log(this.checkModel)
    },
    showpicker () {
      this.is_show = true
    },
    pickersubmit (val) {
      console.log(val)
      this.is_get = !this.is_get
      this.audit_key = val
      this.checkModel = []
      console.log(this.checkModel)

    },
    pickerBack (val) {
      this.is_show = val
    },
    close () {
      this.my_is_add = !this.my_is_add
    },
    auditinfobymissioncode () {
      let $this = this
      let payload = {
        mission_code: this.mission_code,
        userid: $this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['auditinfobymissioncode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.audit_list = data.data
        this.audit_key_list = Object.keys(data.data)
        this.audit_key = this.audit_key_list[0]
        let departlist = [{ id: -9, city: "", label: "a" },
        { id: -9, city: "", label: "b" }]
        for (let i in this.audit_key_list) {
          departlist.push({ id: parseInt(i), val: this.audit_key_list[i], label: this.audit_key_list[i] })
        }
        departlist.push({ id: -9, city: "", label: "c" },
          { id: -9, city: "", label: "d" })
        this.departlist = departlist
        console.log(this.departlist)
      }).catch(err => {
        console.log(err)
      })
    },

  },
  mounted () {
    this.getAgentId()
  },
  watch: {
    is_add (val) {
      this.my_is_add = val
      if (val) {
        this.getauditlist()
        this.auditinfobymissioncode()
        this.is_get = !this.is_get
      }

    },
    my_is_add (val) {

      this.$emit('back', val)
    }
  }
}
</script>
<style lang="less">
.auditlist {
  .remark_p {
    font-size: 14px;
    color: @color_g;
  }
  .top_audit {
    margin-top: 20px;
  }
  .title {
    font-size: @font_18;
    // padding: 20px;
    text-align: center;
    color: @color_b;
  }
  .depart_select {
    position: absolute;
    right: 10px;
    // top: 20px;
    margin-right: 10px;
    font-size: 16px;
  }
  .content_fill:last-of-type {
    margin-bottom: 50px;
  }
  .footer_fill {
    width: 100%;
    position: fixed;
    bottom: 0;
  }
}
</style>