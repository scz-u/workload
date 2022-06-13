<template>
  <div class="formt_list_m">
    <div v-if="!is_more">
      <!-- <div class="text_right top_form">
        <router-link :to="{ name: 'NewForm', query: { k: Date.now() } }">
          <el-button icon="el-icon-plus" type="primary" size="small"
            >新建表单</el-button
          >
        </router-link>
      </div> -->
      <!-- <el-alert title="不可关闭的 alert" type="success" :closable="false">
    </el-alert> -->
      <!-- <div class="el-alert el-alert--success is-light">sdfsdfsdf</div> -->
      <div class="content" v-for="item in sortFun(formlist)" :key="item">
        <div class="content_title">
          <p class="before before_bei display_inline_block"></p>
          <div class="before_font display_inline_block">
            <span v-if="isStr(formlist[item]) != 1">
              <span v-if="item == '1'">
                {{ formlist[item] }}
              </span>
              <span @click="typeEditorClick(item, formlist[item])" v-else>
                {{ formlist[item] }}
              </span>
              <span class="type_num_span type_editor_text display_none">
                <span
                  class="dispaly_block margin_l_15"
                  v-if="item != '1'"
                  title="编辑"
                >
                  <i
                    class="el-icon-edit-outline margin-l_5"
                    @click="typeEditorClick(item, formlist[item])"
                  ></i>
                </span>

                <span
                  class="del_span dispaly_block margin_l_5"
                  v-if="item != '1'"
                  @click="delTypeClick(item)"
                  title="删除"
                  ><i class="el-icon-delete"></i></span
              ></span>
            </span>
            <div v-else>
              <span
                @click="typeEditorClick(item, formlist[item][0].TypeContent)"
              >
                {{ formlist[item][0].TypeContent }}
              </span>
              <span
                class="type_num_span right cursor font_14"
                v-on:click.stop.prevent="
                  moreClick(
                    formlist[item][0].TypeId,
                    formlist[item][0].TypeContent
                  )
                "
                >更多
              </span>
              <span class="type_num_span type_editor_text display_none">
                <span
                  class="dispaly_block margin_l_15"
                  v-if="item != '1'"
                  title="编辑"
                >
                  <i
                    class="el-icon-edit-outline margin-l_5"
                    @click="
                      typeEditorClick(item, formlist[item][0].TypeContent)
                    "
                  ></i>
                </span>

                <span
                  class="del_span dispaly_block margin_l_5"
                  v-if="item != '1'"
                  @click="delTypeClick(item)"
                  title="删除"
                  ><i class="el-icon-delete"></i
                ></span>
                <!-- <span v-if="item != '1'"> 鼠标点击分类名称即可修改 </span> -->
              </span>
            </div>
          </div>
          <div class="clearfix"></div>
          <ul
            class="eform-list clearfix color_other_ul"
            v-if="isStr(formlist[item]) == 1"
          >
            <li
              v-for="items in formlist[item]"
              :key="items"
              @mouseover="mouseOver($event)"
              @mouseleave="mouseLeave($event)"
            >
              <div class="list_box">
                <div class="content_list_item">
                  <p class="left width_180">
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
                    <span class="p_over" slot="reference">
                      {{ items.Title }}
                    </span>
                  </p>
                  <!-- <p class="right task_form_p">
                  <router-link
                    :to="{ name: 'NewTask', query: { k: Date.now() } }"
                  >
                    构建任务
                  </router-link>
                </p> -->
                  <div class="right right_yan cursor">
                    <!-- <i class="el-icon-view"></i> -->
                  </div>
                  <div class="clearfix"></div>
                </div>
                <div class="left other_left">
                  <p class="time_p_formlist">
                    <!-- {{
                      new Date(
                        +new Date(new Date(items.CreateTime).toJSON()) +
                          8 * 3600 * 1000
                      )
                        .toISOString()
                        .replace(/T/g, " ")
                        .replace(/\.[\d]{3}Z/, "")
                        .slice(0, -3)
                    }} -->
                  </p>
                </div>
                <div>
                  <ul class="operation flex right">
                    <li @click="gorFormClick(items.Code)">
                      <span> 预览 </span>
                    </li>
                    <li @click="installopentemplateform(items)">
                      <span> 安装 </span>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
          <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>

    <MoreFormList
      :is_more="is_more"
      :typeid="typeid"
      :typename="typename"
      @back="moreBack"
    ></MoreFormList>
  </div>
</template>
<script>
import MoreFormList from './components/moreFormList'
// import TypeAlert from './components/typeAlert'
import { getUser } from '../../utils/auth'
import { beforeEncrypt } from '../../utils/encryption'
export default {
  name: 'form_list',
  components: { MoreFormList },
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
    isStr (item) {
      if (typeof item != 'string') {
        return 1
      } else {
        return '123'
      }
    },
    sortFun (lists) {
      let list_h = []
      let list_s = []
      let objs = Object.keys(lists)
      for (let i in objs) {
        if (typeof lists[objs[i]] == 'string') {
          list_s.push(objs[i])
        } else {
          list_h.push(objs[i])
        }
      }
      return list_h.reverse().concat(list_s.reverse())
    },
    gorFormClick (code) {
      let routedata = this.$router.resolve({ name: 'lookForm', query: { id: beforeEncrypt(code) } })
      window.open(routedata.href, '_blank');
    },
    moreClick (typeid, typename) {
      console.log('000000')
      this.is_more = !this.is_more
      this.typeid = typeid
      this.typename = typename

    },
    moreBack (val) {
      this.is_more = val
    },
    installopentemplateform (item) {
      this.$confirm('安装表单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let $this = this
        let payload = {
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          form_code: item.Code
        }
        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['installopentemplateform'] + '?signature=' + keyvalue;
        console.log(payload)
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then((data) => {
          console.log(data)
          this.$message({
            type: 'success',
            message: '安装成功!'
          });
          this.$router.push({ name: 'List', query: { k: Date.now() } })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消安装'
          });
        });
      })
    },
    authorizationFormClick (item) {
      console.log(item)
      this.is_depart = true
      this.form_code = item.Code
      this.departlist = item.CooperationInfo
    },
    departBack (val) {
      this.is_depart = val
    },
    departSub (val) {
      console.log(val)
      console.log(this.form_code)
      let userids = []
      let $this = this
      for (let i in val) {
        delete val[i].Children
        delete val[i].ParentId
        // userids.push({ id: val[i].id, depart_id: val[i].depart_id })
      }
      let payload = {
        cooper: JSON.stringify(val),
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        code: this.form_code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['updatecooper'] + '?signature=' + keyvalue;
      console.log(payload)
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        this.$message({
          type: 'success',
          message: '授权成功!'
        });
        this.getalltemplateform()

      }).catch(err => {
        console.log(err)
      })
    },
    eidtorFormClick (code) {
      let val = beforeEncrypt(code)
      this.$router.push({ name: 'editorForm', query: { k: val } })
    },
    formEditorClick (item) {
      console.log(item)
      this.is_form_editor = true
      this.form_title = item.Title
      this.form_code = item.Code
    },
    formEditorSub () {
      let $this = this
      if (this.form_title.trim() == '') {
        this.$alert('请填写表单名！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      let payload = {
        title: this.form_title,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        code: this.form_code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['edittitle'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        this.is_form_editor = false
        this.getalltemplateform()

      }).catch(err => {
        console.log(err)
      })
    },
    typeItemEditorClick (item) {
      this.is_type_editor_item = true
      this.typeid_item = item.TypeId
      this.conent_type_item = item.Code
    },
    typeItemEditorSub () {
      let $this = this
      let payload = {
        type_id: this.typeid_item,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        code: this.conent_type_item
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['edittype'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        this.is_type_editor_item = false
        this.getalltemplateform()

      }).catch(err => {
        console.log(err)
      })
    },
    typeEditorClick (item, content) {
      console.log(content)
      this.is_type_editor = true
      this.typeid = item
      this.conent_type = content
    },
    typeEditorSub () {
      let $this = this
      let payload = {
        id: this.typeid,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        content: this.conent_type
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['editone'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        this.is_type_editor = false
        this.getalltemplateform()

      }).catch(err => {
        console.log(err)
      })
    },

    mouseOver ($event) {
      $event.currentTarget.className = "  active";
    },
    mouseLeave ($event) {
      $event.currentTarget.className = "";
    },


    mouseOverFour ($event) {
      console.log($event.currentTarget.lastElementChild.className)
      $event.currentTarget.lastElementChild.className = " type_num_span type_editor_text display_block";
      console.log($event.currentTarget.lastElementChild)
    },
    mouseLeaveFour ($event) {
      $event.currentTarget.lastElementChild.className = "display_none";
    },
    getalltemplateform () {
      let $this = this

      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,

      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getallopentemplateform'] + '?signature=' + keyvalue;
      // return false;
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
.formt_list_m {
  .content {
    .before_bei {
      background: #67c23a;
    }
  }
  .color_other_ul {
    > li {
      border-left: 3px solid #67c23a;
    }
  }
  .font_weight {
    font-weight: bold;
  }
  .display_none {
    display: none;
  }
  .display_block {
    display: inline-block;
  }
  .title_form:hover {
    border-bottom: @border;
  }
  .type_div {
    margin-top: 20px;
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
  .before_font {
    width: calc(100% - 36px);
  }
  .operation {
    width: 164px;
    margin-top: 20px;
    border: none;
    > li {
      width: 77px;
      text-align: center;
      border: @border;
      li {
        text-align: left;
      }
    }
    > li:hover {
      border: 1px solid #67c23a;
      span {
        color: #67c23a;
      }
    }
    > li:first-of-type {
      margin-right: 10px;
    }
  }
  .other_left {
    margin-top: 15px;
    line-height: 20px;
    font-size: @font_14;
    color: @other;
    .time_p_formlist {
      font-size: @font_14;
      color: #303133;
    }
  }
  .eform-list li .right_yan {
    background: #67c23a;
  }
}
</style>