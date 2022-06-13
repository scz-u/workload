<template>
  <div class="add_detail_fill" v-if="my_is_add">
    <!-- {{ form_data }} -->
    <div class="content_list_fill">
      <el-form
        class="add_form"
        v-if="!is_show"
        :label-width="form_data.labelWidth + 'px'"
        :label-position="form_data.labelPosition"
      >
        <el-form-item class="remark_style" v-if="form_data.remark != ''">
          {{ form_data.remark }}
        </el-form-item>
        <div v-for="item in form_fields" :key="item">
          <el-form-item
            :label-width="
              item.labelWidth > 0
                ? item.labelWidth + 'px'
                : form_data.labelWidth + 'px'
            "
            :label="item.label"
            :label-position="form_data.labelPosition"
            v-if="item.tagIcon != 'calculate'"
            :required="item.required"
          >
            <div v-if="item.tagIcon == 'input'">
              <el-input
                v-model.trim="item.value"
                :placeholder="item.placeholder"
                :maxlength="item.maxlength"
              ></el-input>
            </div>
            <div v-if="item.tagIcon == 'textarea'">
              <el-input
                type="textarea"
                :rows="3"
                v-model="item.value"
                :maxlength="item.maxlength"
                :placeholder="item.placeholder"
              >
              </el-input>
            </div>
            <div v-if="item.tagIcon == 'number'">
              <el-input
                v-model.trim="item.value"
                type="number"
                :placeholder="item.placeholder"
              ></el-input>
            </div>
            <div v-if="item.tagIcon == 'select'">
              <el-select v-model="item.value" :placeholder="item.placeholder">
                <el-option
                  v-for="items in item.options"
                  :key="items.value"
                  :label="items.label"
                  :value="items.value"
                >
                </el-option>
              </el-select>
            </div>
            <div v-if="item.tagIcon == 'select_number'">
              <el-select
                v-model="item.is_counted"
                :placeholder="item.placeholder"
              >
                <el-option
                  v-for="items in item.options"
                  :key="items.value + '__' + items.label"
                  :label="items.label"
                  :value="items.value + '__' + items.label"
                >
                </el-option>
              </el-select>
            </div>
            <div v-if="item.tagIcon == 'date'">
              <div
                class="el-date-editor el-input el-input--prefix el-input--suffix el-date-editor--date"
              >
                <!-- <i class="el-input__icon el-icon-date"></i> -->
                <input
                  v-model="item.value"
                  type="text"
                  :placeholder="item.placeholder"
                  @focus="showDatePicker(item)"
                  class="el-input__inner"
                />
                <span class="el-input__prefix">
                  <i class="el-input__icon el-icon-date"></i>
                </span>
              </div>
            </div>
            <div v-if="item.tagIcon == 'rate'">
              <el-rate v-model="item.value" :allow-half="item['allow-half']">
              </el-rate>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <el-form v-else class="show_form">
        <div v-for="item in form_info" :key="item">
          <el-form-item label-width="150px" :label="item.field_label + '：'">
            <p
              v-if="Object.keys(item).indexOf('opt_label') > -1"
              class="form_item_p"
            >
              {{ item.opt_label.split("__")[1] }}
            </p>
            <div v-else>
              <p
                v-if="item.value != '' && item.value != null"
                class="form_item_p"
              >
                {{ item.value }}
              </p>
              <p v-else class="form_item_p">未填写</p>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="footer_fill">
      <div v-if="!is_show">
        <cube-button :outline="true" :inline="true" @click="close()"
          >返 回</cube-button
        >
        <cube-button :primary="true" :inline="true" @click="subClick()"
          >下一步</cube-button
        >
      </div>
      <div v-else>
        <cube-button :outline="true" :inline="true" @click="is_show = false"
          >上一步</cube-button
        >
        <cube-button :primary="true" :inline="true" @click="submitClick()"
          >确 认</cube-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'add_detail_fill',
  props: {
    is_add: Boolean,
    detail: Object,
    task_code: String,
  },
  data () {
    return {
      my_is_add: false,
      form_fields: [],
      form_data: [],
      is_count: false,
      form_code: '',
      is_show: false,
    }
  },
  methods: {
    getnowdate (val) {
      let date = new Date(val)
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday = date.getDate();

      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      return (myyear + "/" + mymonth + "/" + myweekday);//想要什么格式都可以随便自己拼

    },
    showDatePicker (item) {
      console.log(item)
      let val = ''
      let $this = this
      if (item.value == null) {

        this.datePicker = this.$createDatePicker({
          title: item.label,
          min: new Date(2008, 7, 8),
          value: new Date(),
          onSelect: function (date, selectedVal, selectedText) {
            console.log(date)
            item.value = $this.getnowdate(date)
          },
          onCancel: this.cancelHandle
        })
      } else {
        this.datePicker = this.$createDatePicker({
          title: item.label,
          min: new Date(2008, 7, 8),
          value: new Date(item.value),
          onSelect: function (date, selectedVal, selectedText) {
            console.log(date)
            item.value = $this.getnowdate(date)
          },
          onCancel: this.cancelHandle
        })
      }

      this.datePicker.show()
    },
    msgClick (msg) {
      // const toast = this.$createToast({
      //   txt: msg,
      //   mask: false,
      //   time: 1000,
      //   type: 'warn'
      // })
      // toast.show()
      this.$createDialog({
        type: 'alert',
        title: msg.field_label,
        content: msg.remark,
        icon: 'cubeic-alert'
      }).show()
    },
    subClick () {
      let formlist = []
      console.log(this.form_fields)
      for (let i in this.form_fields) {
        if (this.form_fields[i].required) {

          if (this.form_fields[i].tagIcon == 'select_number') {
            if (this.form_fields[i].is_counted == false) {
              this.$createDialog({
                type: 'alert',
                title: '提示',
                content: this.form_fields[i].label + '不能为空',
                icon: 'cubeic-alert'
              }).show()
              return false;

            }
          } else if (this.form_fields[i].tagIcon == 'number') {
            console.log(this.form_fields[i].value)
            if (!(/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(this.form_fields[i].value))) {
              this.$createDialog({
                type: 'alert',
                title: '提示',
                content: this.form_fields[i].label + ' 请填写数字',
                icon: 'cubeic-alert'
              }).show()
              return false;

            }
          } else {
            if (this.form_fields[i].value == null || this.form_fields[i].value == '') {
              this.$createDialog({
                type: 'alert',
                title: '提示',
                content: this.form_fields[i].label + '不能为空',
                icon: 'cubeic-alert'
              }).show()
              return false;

            }
          }


          console.log('ss')
          if (this.form_fields[i].tagIcon == 'number') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": parseFloat(this.form_fields[i].value) })

          }
          else if (this.form_fields[i].tagIcon == 'select_number') {

            formlist.push({ "field_code": this.form_fields[i].filed_code, opt_label: this.form_fields[i].is_counted, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": false, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": parseFloat(this.form_fields[i].is_counted.split('__')[0]) })

          }
          else if (this.form_fields[i].tagIcon == 'date') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": this.getnowdate(this.form_fields[i].value) })

          }
          else {
            let enable_assign = this.form_fields[i].enable_assign
            formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": enable_assign, "value": this.form_fields[i].value })
          }
        }
        else {
          console.log('-------2')
          console.log(i)
          if (this.form_fields[i].tagIcon == 'number') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": parseFloat(this.form_fields[i].value) })

          }
          else if (this.form_fields[i].tagIcon == 'select_number') {

            formlist.push({ "field_code": this.form_fields[i].filed_code, opt_label: this.form_fields[i].is_counted, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": false, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": parseFloat(this.form_fields[i].is_counted.split('__')[0]) })

          }
          else if (this.form_fields[i].tagIcon == 'date') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": this.getnowdate(this.form_fields[i].value) })

          }
          // else if (this.form_fields[i].tagIcon == 'calculate') {
          //   console.log({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": this.form_fields[i].value })

          //   formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": this.getnowdate(this.form_fields[i].value) })
          //   console.log(JSON.stringify(formlist))
          // }
          else {
            let enable_assign = this.form_fields[i].enable_assign
            formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": enable_assign, "value": this.form_fields[i].value })

          }
        }
      }
      console.log(formlist)
      // return false;
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: this.form_code,
        rule_file_info: JSON.stringify(formlist),
        task_code: this.task_code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['countfunction'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // this.formlist = data.data
        // this.form_fields = data.data.fields
        if (data.data.length > 0) {
          for (let i in formlist) {
            for (let j in data.data) {
              if (formlist[i].field_code == data.data[j].field_code) {
                formlist[i].value = data.data[j].value
                // break;
              }
            }

          }
        }
        this.form_info = formlist
        console.log($this.form_info)
        this.is_show = true


      }).catch(err => {
        console.log(err)
      })

    },
    submitClick () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: this.detail.FormCode,
        form_field_info: JSON.stringify(this.form_info),
        task_code: this.detail.TaskCode,
        main_code: this.detail.Code,
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['edit_main'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // this.formlist = data.data
        // this.form_fields = data.data.fields
        const toast = this.$createToast({
          time: 1000,
          txt: '编辑成功！',
          type: 'correct'
        })
        toast.show()

        $this.$emit('editorSub')
        this.my_is_add = false
        this.is_show = false
        this.formlist = []
        this.formcode = ''
        this.form_fields = []
        this.form_info = []


      }).catch(err => {
        console.log(err)
      })
    },

    toadd () {
      for (let i in this.strginglist) {
        if (this.strginglist[i].value == '') {
          this.$createDialog({
            type: 'alert',
            title: '提示',
            content: this.strginglist[i].filed_name + '不能为空',
            icon: 'cubeic-alert'
          }).show()
          return false;
        }
        if (this.strginglist[i].filed_type == 2) {
          if (/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(this.strginglist[i].value)) {
            this.strginglist[i].value = parseFloat(this.strginglist[i].value)
          } else {
            this.$createDialog({
              type: 'alert',
              title: '提示',
              content: this.strginglist[i].filed_name + '请填写数字',
              icon: 'cubeic-alert'
            }).show()
            return false;
          }
          console.log((/(^[\-0-9][0-9]*(.[0-9]+)?)$/).test(this.strginglist[i].value))
        }

      }
      if (this.is_count) {
        this.countfunction()

      } else {
        this.addonemaindata(1)
      }

    },
    addonemaindata (val) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: this.detail.Code,
        rule_file_info: JSON.stringify(this.strginglist),
        data_code: this.detail.Code
      }
      if (val == 1) {
        payload['rule_file_info'] = JSON.stringify(this.strginglist)
      } else {
        payload['rule_file_info'] = JSON.stringify(this.countlist)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['editonemaindata'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.$router.go(-1)
        $this.$emit('editorSub')
        $this.close()

      }).catch(err => {
        console.log(err)
      })
    },
    countfunction () {
      let $this = this
      let payload = {
        rule_code: this.detail.RuleCode,
        rule_file_info: JSON.stringify(this.strginglist),
        userid: this.$store.state.userid,
        corpid: this.$store.state.corpid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['countfunction'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.countlist = JSON.parse(JSON.stringify(this.strginglist)).concat(data.data)
        this.$createDialog({
          type: 'confirm',
          title: '提示',
          // content: '我是内容',
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
            console.log(this.countlist)
            this.addonemaindata(22)

          }
        }, (createElement) => {
          let s = []
          for (let i in data.data) {
            s.push(createElement('div', {
              'class': {
                'my-content': true
              },
              slot: 'content'
            }, [
              createElement('span', data.data[i].filed_name + '：'),
              createElement('span', {
                'class': {
                  'my_value': true
                }
              }, data.data[i].value)
            ]))
          }
          return s
          //  [

          //   createElement('p', {
          //     'class': {
          //       'my-content': true
          //     },
          //     slot: 'content'
          //   }, datalist)
          // ]
        }).show()

      }).catch(err => {
        console.log(err)
      })
    },
    close () {
      this.my_is_add = !this.my_is_add
    },
    allrulefiled () {
      let common = JSON.parse(JSON.stringify(this.detail.FField))

      console.log(common)
      this.form_fields = common
      for (let i in this.form_fields) {
        for (let j in this.detail.FormFieldInfos) {
          if (this.form_fields[i].filed_code == this.detail.FormFieldInfos[j].field_code) {

            this.form_fields[i].value = this.detail.FormFieldInfos[j].value
            if (this.detail.FormFieldInfos[j]['opt_label'] !== '') {
              this.form_fields[i].opt_label = this.detail.FormFieldInfos[j].opt_label
              this.form_fields[i].is_counted = this.detail.FormFieldInfos[j].opt_label
            }
          }
        }
      }
      this.is_show = false
    },
    getdetailbyformcode () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: this.detail.FormCode
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getdetailbyformcode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.form_data = data.data
        // this.form_fields = data.data.fields

      }).catch(err => {
        console.log(err)
      })
    },

  },
  watch: {
    is_add (val) {
      this.my_is_add = val
      if (val) {
        console.log(this.detail)
        this.form_code = this.detail.Code
        // this.form_data = this.detail
        this.allrulefiled()
        this.getdetailbyformcode()
        // this.enablecount()
      }
    },
    my_is_add (val) {
      this.$emit('back', val)
    }
  }
}
</script>
<style lang="less">
.my-content {
  margin-left: 30px;
  margin-right: 30px;
}
.el-select-dropdown__item {
  font-size: @font_18!important;
}
.add_detail_fill {
  padding-top: 20px;
  .el-input,
  .el-form-item__label,
  .form_item_p {
    font-size: @font_18;
  }
  .el-select {
    width: 100%;
  }
  .el-form-item {
    margin-bottom: 12px;
    padding: 8px 10px;
  }
  .show_form {
    .el-form-item {
      margin-bottom: 2px;
      padding: 0px 10px;
    }
  }
  .cube-validator-msg {
    color: #ccc;
    font-size: @font_18;
  }
  .border-bottom-1px::after {
    border-bottom: 2px solid #ebebeb;
  }
  .cube-form {
    margin-bottom: 60px;
  }
  .my-content {
    margin-left: 30px;
    margin-right: 30px;
  }
  .footer_fill {
    border-top: @border;
    text-align: right;
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
    // button:first-of-type {
    //   margin-right: 15px;
    // }
  }
}
</style>