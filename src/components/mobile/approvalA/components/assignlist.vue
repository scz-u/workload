<template>
  <div class="assign_list" v-if="my_is_add">
    <div v-if="!is_depart_m">
      <!-- <div class="top_assign1">
        <span class="top_span_title">分配</span>
        <span class="icon_add right " @click="addAssignClick()">
          <img src="@/assets/img/jiahao.png" alt="" />
        </span>
      </div> -->

      <div class="middle_assign">
        <div class="weui-cells__title">添加分配</div>
        <div class="editor_middle">
          <ul class="flex_ul">
            <li>名称</li>
            <li>原始值</li>
            <li>已分配值</li>
            <li>剩余值</li>
          </ul>
          <ul class="flex_ul" v-for="item in other_length" :key="item">
            <li>{{ other_val.left[0].filed_name }}</li>
            <li>{{ other_val.orgin[0].value }}</li>
            <li>{{ other_val.used[0].value }}</li>
            <li>{{ other_val.left[0].value }}</li>
          </ul>
        </div>
        <div class="editor_middle" v-if="is_stag">
          <div
            class="cube-form cube-form_standard"
            v-if="Object.keys(staging).length != 0"
          >
            <div class="cube-form-group-content">
              <div
                class="cube-form-item border-bottom-1px cube-form-item_required"
              >
                <div class="cube-form-label">
                  <span>被分配人</span>
                </div>
                <div class="cube-validator cube-form-field">
                  <div class="cube-validator-content">
                    <div
                      class="border_div"
                      v-if="staging.to_userid != ''"
                      @click="departSelect()"
                    >
                      {{ staging.to_userid }}
                    </div>
                    <div class="border_div" v-else @click="departSelect()">
                      选择
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="cube-form-item border-bottom-1px cube-form-item_required"
                v-for="item in staging.to_value"
                :key="item"
              >
                <div class="cube-form-label">
                  <span>{{ item.filed_name }}</span>
                </div>
                <div class="cube-validator cube-form-field">
                  <div class="cube-validator-content">
                    <cube-input
                      v-model="item.value"
                      :placeholder="'请输入文字'"
                      v-if="item.filed_type == 1"
                    ></cube-input>
                    <cube-input
                      v-model="item.value"
                      :placeholder="'请输入数字'"
                      v-else-if="item.filed_type == 2"
                    ></cube-input>
                  </div>
                </div>
              </div>
              <!-- <div class="text_center" style="margin-top:10px;">
                <cube-button
                  :outline="true"
                  :inline="true"
                  @click="addclose()"
                  style="margin-right:5px;"
                  >取消</cube-button
                >
                <cube-button :primary="true" :inline="true" @click="addone()"
                  >确认</cube-button
                >
                
              </div> -->
            </div>
          </div>
        </div>
        <div class="middle_content" v-if="assignlist.length != 0">
          <div class="weui-cells" v-for="item in assignlist" :key="item">
            <div class="weui-cell ">
              <div class="weui-cell__bd">
                姓名
              </div>
              <div class="weui-cell__ft">{{ item.ToUserId }}</div>
            </div>
            <div class="weui-cell " v-for="items in item.ToValues" :key="items">
              <div class="weui-cell__bd">
                {{ items.filed_name }}
              </div>
              <div class="weui-cell__ft">
                {{ items.value }}
              </div>
            </div>
            <div class="text_right" style="margin-top:10px;margin-bottom:10px;">
              <cube-button
                :outline="true"
                :inline="true"
                @click="delone(item)"
                style="margin-right:5px;"
                >删除</cube-button
              >
              <cube-button
                :outline="true"
                :inline="true"
                @click="editorone(item)"
                >修改</cube-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="footer_look text__right">
        <!-- <cube-button :outline="true" :inline="true" @click="gorul()"
        >返回</cube-button
      > -->
        <cube-button :outline="true" :inline="true" @click="close()"
          >取消</cube-button
        >
        <cube-button :primary="true" :inline="true" @click="addone()"
          >确认</cube-button
        >
      </div>
    </div>

    <DepartMAlert
      :is_add="is_depart_m"
      :departlist="staging.useridlist"
      @back="departBackM"
      @departSub="departSubM"
    ></DepartMAlert>
  </div>
</template>
<script>
import DepartMAlert from './departMAlert'
export default {
  name: 'assign_list',
  components: { DepartMAlert },
  props: {
    is_add: Boolean,
    detail: Object
  },
  data () {
    return {
      is_depart_m: false,
      departlist_m: [],
      my_is_add: false,
      assignlist: [],
      staging: {},
      is_stag: false,
      is_stag_editor: false,
      other_val: {},
      other_length: 0
    }
  },
  methods: {
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
          this.$createToast({
            type: 'warn',
            time: 1000,
            txt: '点击确认按钮'
          }).show()
          let payload = {
            data_code: this.detail.Code,
            as_id: item.Id,
            corpid: this.$store.state.corpid
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
            toast.show()
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
    editorone (items) {
      console.log(item)
      let item = JSON.parse(JSON.stringify(items))
      this.staging = { id: item.Id, data_code: this.detail.Code, to_userid: item.ToUserId, to_value: item.ToValues, useridlist: item.ToValues[0].useridlist }
      // let common = JSON.parse(JSON.stringify(item.RulesFieldInfos))
      // for (let i in common) {
      //   if (common[i].is_count) {
      //     this.staging.to_value.push({            rule_code: this.detail.RuleCode, filed_name: common[i].filed_name, filed_name_code: common[i].filed_name_code,
      //       filed_code: common[i].filed_code, filed_type: common[i].filed_type, value: '', is_count: true, enable_assign: common[i].enable_assign, enable_greater: common[i].enable_greater          })
      //   }
      // }
      this.is_stag = true
      this.is_stag_editor = true
    },
    editoroneClick () {

    },
    addclose () {
      this.is_stag = false
      this.is_stag_editor = false
    },
    addone () {
      if (this.staging.userid == '') {

        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '未选择人员！',
          icon: 'cubeic-alert'
        }).show()

        return false;
      }
      for (let i in this.staging.to_value) {
        if (this.staging.to_value[i].value == '') {
          this.$createDialog({
            type: 'alert',
            title: '提示',
            content: this.staging.to_value[i].filed_name + '不能为空',
            icon: 'cubeic-alert'
          }).show()
          return false;
        }
        if (/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(this.staging.to_value[i].value)) {
          this.staging.to_value[i].value = parseFloat(this.staging.to_value[i].value)
        } else {
          this.$createDialog({
            type: 'alert',
            title: '提示',
            content: this.staging.to_value[i].filed_name + '请填写数字',
            icon: 'cubeic-alert'
          }).show()
          return false;
        }
      }
      console.log(this.staging)
      this.addoneassigndata()
      // if (this.is_stag_editor) {
      //   this.editoneassigndata()
      // } else {
      //   this.addoneassigndata()
      // }

      // this.assignlist.push(this.staging)
      // this.is_stag = false
      // this.is_stag_editor = false
      // this.staging = {}

    },
    addoneassigndata () {
      let $this = this
      let payload = {
        data_code: this.detail.Code,
        to_userid: this.staging.to_userid,
        userid: this.$store.state.userid,
        to_value: JSON.stringify(this.staging.to_value),
        corpid: this.$store.state.corpid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['addoneassigndata'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        const toast = this.$createToast({
          txt: '添加成功！',
          time: 1000,
          type: 'correct'
        })
        toast.show()
        this.is_stag = false
        this.is_stag_editor = false
        this.staging = {}
        // this.allassigndata()

        // $this.$router.go(-1)
        // $this.$emit('editorSub')
        $this.close()

      }).catch(err => {
        console.log(err)
      })
    },
    editoneassigndata () {
      let $this = this
      let payload = {
        data_code: this.detail.Code,
        to_userid: this.staging.to_userid,
        userid: this.$store.state.userid,
        to_value: JSON.stringify(this.staging.to_value),
        as_id: this.staging.id,
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
      this.staging.to_value[0]['useridlist'] = val.list
      this.staging['useridlist'] = val.list
      console.log(this.staging)
      console.log(this.departlist_m)
      for (let i in val.list) {
        this.staging.to_userid = (val.list[i].id)

      }
    },
    close () {
      this.my_is_add = !this.my_is_add
    },
    addAssignClick () {
      this.staging = { data_code: this.detail.Code, to_userid: '', to_value: [] }
      let common = JSON.parse(JSON.stringify(this.detail.RulesFieldInfos))
      for (let i in common) {
        if (common[i].enable_assign) {
          this.staging.to_value.push({            is_flag: false, rule_code: this.detail.RuleCode, filed_name: common[i].filed_name, filed_name_code: common[i].filed_name_code,
            filed_code: common[i].filed_code, filed_type: common[i].filed_type, value: '', is_count: true, enable_assign: common[i].enable_assign, enable_greater: common[i].enable_greater          })
        }
      }
      this.is_stag_editor = false
      this.is_stag = true
    },
    allassigndata () {
      let code = this.detail.Code
      this.code = code
      let posturl = this.$apilist['allassigndata'] + '?data_code=' + code + '&userid=' + this.$store.state.userid + '&corpid=' + this.$store.state.corpid;
      this.$server.get(posturl).then(data => {
        console.log(data)
        for (let i in data.data) {
          data.data[i].ToValues = JSON.parse(data.data[i].ToValue)
        }
        console.log(data)
        this.assignlist = data.data

      }).catch(err => {
        console.log(err)
      })
    },
    leftvalue () {
      let $this = this
      console.log(this.detail)
      let payload = {
        data_code: this.detail.Code,
        corpid: this.$store.state.corpid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['leftvalue'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.other_val = data.data
        this.other_length = data.data.left.length

      }).catch(err => {
        console.log(err)
      })
    },

  },
  watch: {
    is_add (val) {
      this.my_is_add = val
      if (val) {
        // this.allassigndata()
        this.leftvalue()
        this.addAssignClick()
      }
    },
    my_is_add (val) {
      this.$emit('back', val)
    }
  }
}
</script>
<style lang="less">
.assign_list {
  .flex_ul {
    border-top: @border;
    display: flex;
    text-align: center;
    height: 30px;

    li {
      flex: 1;
      overflow: hidden;
      height: 30px;
    }
  }
  .flex_ul:first-of-type {
    border-top: none;
  }
  .top_assign {
    -webkit-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    width: 100%;
    background: @white;
    // padding: 3px 5px;
    // text-align: right;
    .top_span_title {
      display: inline-block;
      margin: 3px 15px;
    }
    .icon_add {
      display: inline-block;
      margin: 3px 15px;
    }
  }
  .middle_content {
    margin: 15px;
    .weui-cells {
      -webkit-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
      -moz-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    }
  }
  .text_right {
    border-top: @border;
    padding-top: 10px;
    padding-right: 10px;
    text-align: right;
  }
  .editor_middle {
    // border: 1px solid #000;
    margin: 15px;
    padding: 5px 0;
    background: #fff;
    -webkit-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }
  .middle_assign {
    // margin-top: 41px;
    .border_div {
      display: inline-block;
      border: @border;
      padding: 2px 15px;
      border-radius: 5px;
    }
  }
}
</style>