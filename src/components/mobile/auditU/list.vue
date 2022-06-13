<template>
  <div class="form_list_fill_mobile">
    <div v-if="!is_more">
      <!-- <el-alert title="不可关闭的 alert" type="success" :closable="false">
    </el-alert> -->
      <!-- <div class="el-alert el-alert--success is-light">sdfsdfsdf</div> -->
      <div class="type_div">
        <ul class="eform-list clearfix">
          <li
            v-for="items in formlist"
            :key="items"
            @mouseover="mouseOver($event)"
            @mouseleave="mouseLeave($event)"
            @click="goClick(items)"
          >
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
                  <p class="p_over" slot="reference">
                    {{ items.Title }}
                  </p>
                </el-popover> -->
                <p class="p_over left width_150" slot="reference">
                  {{ items.Title }}
                </p>
                <p class="right other_count" v-if="items.DenyCount > 0">
                  {{ items.DenyCount }}
                </p>
                <div class="clearfix"></div>
              </div>

              <div>
                <div class="left other_left">
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
        <!-- <div class="text_right">
          <el-link type="primary" class="margin_l_5 link_font" @click="gourl()"
            >查看汇总>></el-link
          >
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { getUser } from '../../../utils/auth'
import { afterEncrypt, beforeEncrypt } from '../../../utils/encryption'
export default {
  name: 'form_list',
  data () {
    return {
      active: [],
      num: [],
      is_add: false,
      formlist: [],
      is_type_editor: false,
      conent_type: '',
      typeid: '',
      is_type_editor_item: false,
      conent_type_item: '',
      typeid_item: '',
      typelist: [],
      is_form_editor: false,
      form_code: '',
      form_title: '',
      departlist: [],
      is_depart: false,
      is_more: false,
      typename: ''
    }
  },
  methods: {
    gourl () {
      this.$router.push({ name: 'detail_audit', query: { id: this.$route.query.task_code, name: this.$route.query.name } })
    },
    mouseOver ($event) {
      $event.currentTarget.className = "  active";
    },
    mouseLeave ($event) {
      $event.currentTarget.className = "";
    },
    goClick (item) {
      console.log(item)
      this.$router.push({ name: 'detail_audit', query: { name: item.Title, taskname: this.$route.query.name, id: beforeEncrypt(item.Code), task_code: this.$route.query.task_code } })
    },

    getalltemplateform () {
      let $this = this
      let code = this.$route.query.task_code
      console.log(code)
      this.name = this.$route.query.name
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: afterEncrypt(this.$route.query.task_code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getselfformlist'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.formlist = data.data

      }).catch(err => {
        console.log(err)
      })
    },

  },
  mounted () {
    console.log('000000')
    this.getalltemplateform()
  }
}
</script>
<style lang="less">
.form_list_fill_mobile {
  .other_count {
    background: #f56c6c;
    display: inline-block;
    font-size: 12px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    color: #fff;
  }

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
  .eform-list {
    > li {
      width: 96%;
      margin: 10px 2%;
    }
  }

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