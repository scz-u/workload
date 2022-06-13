<template>
  <div class="task_index frame_right">
    <div v-show="!is_more">
      <div class="top_form">
        <span class="name_span">被授权任务</span>
        <span class="right">
          <router-link :to="{ name: 'NewTask', query: { k: Date.now() } }">
            <el-button icon="el-icon-plus" type="primary" size="small" round
              >新建任务</el-button
            >
          </router-link>
          <el-button
            size="small"
            icon="el-icon-plus"
            class="margin_l_15"
            @click="typeClick()"
            round
            >新建分类</el-button
          >
        </span>
      </div>
      <div v-loading="loading">
        <div v-if="Object.keys(tasklist) == 0" class="text_center">
          <img src="@/assets/img/none.png" alt="" />
          <p>暂无数据</p>
        </div>
        <div class="content" v-for="item in sortFun(tasklist)" :key="item.Code">
          <div class="content_title">
            <p class="before display_inline_block"></p>
            <p class="before_font display_inline_block">
              <span v-if="isStr(tasklist[item]) == 1">
                {{ tasklist[item][0].TypeContent }}</span
              >
              <span v-else>{{ tasklist[item] }}</span>
              <!-- <i class="margin_l_10 el-icon-edit cursor" style="color: #5e81f4">
              </i> -->
              <span class="cursor" v-if="item != '2'">
                <el-dropdown trigger="click">
                  <i
                    class="margin_l_10 el-icon-edit cursor"
                    style="color: #5e81f4"
                  >
                  </i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <p
                        v-if="typeof tasklist[item] != 'string'"
                        @click="
                          typeEditorClick(item, tasklist[item][0].TypeContent)
                        "
                      >
                        重命名
                      </p>
                      <p @click="typeEditorClick(item, tasklist[item])" v-else>
                        重命名
                      </p>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="item != '2'">
                      <p @click="delClick(item)">删除该组</p>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

                <el-link :underline="false" type="primary"> </el-link>
                <!-- <el-link :underline="false" class="margin_l_5" type="primary"
                >停用</el-link
              > -->
              </span>
            </p>
            <p
              class="right font_14 before_font margin_r_10 cursor"
              v-if="isStr(tasklist[item]) == 1"
              v-on:click.stop.prevent="
                moreClick(
                  tasklist[item][0].TypeId,
                  tasklist[item][0].TypeContent
                )
              "
            >
              更多
            </p>
          </div>
          <div class="content_middle" v-if="isStr(tasklist[item]) == 1">
            <div>
              <div
                class="left content_middle_list"
                v-for="items in tasklist[item]"
                :key="items"
              >
                <div class="item_list_img">
                  <img
                    class="icon_left left"
                    :src="weburl + items.Icons.icon"
                    alt=""
                  />
                  <span class="left icon_img" v-if="items.DenyCount > 0">{{
                    items.DenyCount
                  }}</span>
                  <div
                    class="item_title_fill_right right success_title_fill"
                    v-if="items.State == 0"
                  >
                    进行中
                  </div>
                  <div
                    class="item_title_fill_right right danger_title_fill"
                    v-else-if="items.State == 2"
                  >
                    关闭
                  </div>
                  <div
                    class="item_title_fill_right right success_title_fill"
                    v-else-if="items.State == 1"
                  >
                    未开始
                  </div>
                  <div class="clearfix"></div>
                  <p
                    class="title_fill_content_right p_over width_140"
                    :title="items.Title"
                  >
                    {{ items.Title }}
                  </p>
                  <p
                    class="p_font_fill_content"
                    :title="
                      '填报时间：' +
                      new Date(
                        +new Date(new Date(items.StartDate * 1000).toJSON()) +
                          8 * 3600 * 1000
                      )
                        .toISOString()
                        .replace(/T/g, ' ')
                        .replace(/\.[\d]{3}Z/, '')
                        .slice(0, -3)
                        .split(' ')[0] +
                      '至' +
                      new Date(
                        +new Date(new Date(items.EndDate * 1000).toJSON()) +
                          8 * 3600 * 1000
                      )
                        .toISOString()
                        .replace(/T/g, ' ')
                        .replace(/\.[\d]{3}Z/, '')
                        .slice(0, -3)
                        .split(' ')[0]
                    "
                  >
                    <i
                      class="iconfont icon-time p_icon_fill_content display_inline_block"
                    ></i>
                    <span class="p_over display_inline_block width_140">
                      {{
                        new Date(
                          +new Date(new Date(items.StartDate * 1000).toJSON()) +
                            8 * 3600 * 1000
                        )
                          .toISOString()
                          .replace(/T/g, " ")
                          .replace(/\.[\d]{3}Z/, "")
                          .slice(0, -3)
                          .split(" ")[0]
                      }}至{{
                        new Date(
                          +new Date(new Date(items.EndDate * 1000).toJSON()) +
                            8 * 3600 * 1000
                        )
                          .toISOString()
                          .replace(/T/g, " ")
                          .replace(/\.[\d]{3}Z/, "")
                          .slice(0, -3)
                          .split(" ")[0]
                      }}
                    </span>
                  </p>
                  <div class="p_font_fill_content">
                    <i
                      class="iconfont icon-description p_icon_fill_content display_inline_block"
                    ></i>
                    <span
                      class="p_over display_inline_block width_140"
                      v-if="items.Remark != ''"
                      :title="'备注：' + items.Remark"
                    >
                      {{ items.Remark }}
                    </span>
                    <span v-else class="p_over display_inline_block width_140"
                      >-</span
                    >
                  </div>
                  <div class="p_font_fill_content">
                    <i
                      class="iconfont icon-object p_icon_fill_content display_inline_block"
                    ></i>
                    <p
                      class="p_over display_inline_block width_130"
                      :title="depList(items.ScopeInfo)"
                    >
                      <span v-for="(d, index) in items.ScopeInfo" :key="d">
                        <span class="">
                          {{ d.Department }}
                          <span v-if="index < items.ScopeInfo.length - 1"
                            >,</span
                          >
                        </span>
                      </span>
                    </p>
                    <i
                      class="el-icon-edit cursor display_inline_block p_icon_fill_content"
                      style="color: #5e81f4"
                      @click="editorDepartClick(items)"
                    ></i>
                  </div>
                  <div class="p_font_fill_content">
                    <i
                      class="iconfont icon-user p_icon_fill_content display_inline_block"
                    ></i>
                    <p
                      class="p_over display_inline_block width_140"
                      :title="'创建人：' + items.CreateUserName"
                    >
                      {{ items.CreateUserName }}
                    </p>
                  </div>
                  <div class="button_fill_content">
                    <el-button
                      type="primary"
                      round
                      size="mini"
                      @click="editorTaskClick(items.Code)"
                      >编辑</el-button
                    >

                    <el-dropdown>
                      <el-button round size="mini"
                        >更多 <i class="el-icon-arrow-down el-icon--right"></i
                      ></el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <p
                            :underline="false"
                            type="primary"
                            @click="switchClick(items)"
                            class="link_font"
                          >
                            <span
                              class="success"
                              v-if="items.State == 1 || items.State == 2"
                              >启动</span
                            >
                            <span v-else class="danger">停用</span>
                          </p>
                        </el-dropdown-item>
                        <!-- <el-dropdown-item
                          ><p @click="editorTaskClick(items.Code)">
                            编辑
                          </p></el-dropdown-item
                        > -->
                        <el-dropdown-item
                          ><p @click="copyClick(items.Code)">
                            复制
                          </p></el-dropdown-item
                        >
                        <el-dropdown-item
                          ><p @click="publicClick(items)">
                            公示
                          </p></el-dropdown-item
                        >
                        <el-dropdown-item
                          ><p @click="goTaskGClick(items)">
                            汇总
                          </p></el-dropdown-item
                        >
                        <el-dropdown-item>
                          <p @click="delTaskClick(items)">
                            删除
                          </p></el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>

    <type-alert
      :is_add="is_add"
      @back="typeBack"
      @subBack="subTypeBack"
    ></type-alert>
    <MoreTaskList
      :is_more="is_more"
      :typeid="typeid"
      :typename="typename"
      @back="moreBack"
    ></MoreTaskList>

    <DepartAlertA
      :is_add="is_depart_a"
      :departlist="departlist_a"
      :title="'填报对象'"
      @back="departABack"
      @departSub="departASub"
    ></DepartAlertA>
    <PublicAlert
      :is_add="is_public"
      :detail="public_detail"
      @back="publickBack"
    ></PublicAlert>
  </div>
</template>
<script>
import TypeAlert from './components/typeAlert'
import { getUser, setUser, removeUser } from '@/utils/auth_user';
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';
import MoreTaskList from './components/moreATaskList'
import DepartAlertA from '@/components/public/departAlertA.vue'
import PublicAlert from './components/publicAlert'
export default {
  name: 'task_index',
  components: { TypeAlert, MoreTaskList, DepartAlertA, PublicAlert },
  data () {
    return {
      is_public: false, public_detail: {},
      loading: false,
      is_add: false,
      weburl: this.$store.state.weburl,
      typelist: [],
      typeval: '',
      tableDate: [{ title: '标题' }],
      is_add: false,
      detail_name: {},
      tasklist: [],
      task_type_list: [],
      is_depart_a: false,
      departlist_a: [],
      depart_a_detail: {},
      is_type_editor: false,
      typeid: '',
      typename: '',
      conent_type: '',
      is_more: false,
      departlist_a: [],
      depart_a_detail: {},
      is_depart_a: false
    }
  },
  methods: {
    depList (val) {
      let list = []
      console.log(val)
      for (let i in val) {
        list.push(val[i].Department)
      }
      console.log(list)
      return '填报范围：' + list.join(',')
    },
    isStr (item) {
      if (typeof item != 'string') {
        return 1
      } else {
        return '123'
      }
    },
    publicClick (item) {
      this.is_public = true
      this.public_detail = item
    },
    publickBack (val) {
      this.is_public = val
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
      console.log(list_h.concat(list_s))
      return list_h.concat(list_s)
    },
    goTaskGClick (item) {
      this.$router.push({ name: 'gatherTask', params: { other: 2 }, query: { id: beforeEncrypt(item.Code), name: item.Title } })
    },
    switchClick (items) {
      let $this = this
      let payload = {
        task_code: items.Code,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      if (items.State == 0) {
        payload['state'] = 2
      } else {
        payload['state'] = 0
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['switchtaskstate'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.getalltaskbyuserid()

      }).catch(err => {
        console.log(err)
      })
    },
    editorDepartClick (items) {
      this.departlist_a = items.ScopeInfo
      console.log(this.departlist_a)
      this.depart_a_detail = items
      this.is_depart_a = !this.is_depart_a
    },
    departASub (val) {
      console.log(val)
      this.depart_a_detail.ScopeInfo = val
      let $this = this
      let payload = {
        task_code: this.depart_a_detail.Code,
        scope: JSON.stringify(val),
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['updatescope'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        if (this.typeval == '') {
          this.getalltaskbyuserid(1)
        } else {
          this.getalltaskbyuserid(2)
        }

      }).catch(err => {
        console.log(err)
      })
    },

    departABack (val) {
      this.is_depart_a = val
    },
    moreClick (typeid, typename) {
      this.is_more = !this.is_more
      this.typeid = typeid
      this.typename = typename

    },
    moreBack (val) {
      console.log(val)
      this.is_more = val
    },
    editorTaskClick (code) {
      this.$router.push({ name: 'EditorTask', query: { id: beforeEncrypt(code) } })
    },
    copyClick (code) {
      this.$router.push({ name: 'copyTask', query: { id: beforeEncrypt(code) } })
    },
    goTaskClick (item) {
      this.$router.push({ name: 'FormTask', query: { id: beforeEncrypt(item.Code), k: beforeEncrypt(item.FormCodes[0]) } })
    },
    delTaskClick (items) {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let $this = this
        let payload = {
          task_code: items.Code,
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid
        }

        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['deltask'] + '?signature=' + keyvalue;
        // return false;
        console.log(payload)
        $this.$server.post(posturl, createvalue['fd']).then((data) => {
          console.log(data)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getalltaskbyuserid()


        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },

    typeClick () {
      this.is_add = !this.is_add
    },
    typeBack (val) {
      this.is_add = val
    },

    typeEditorClick (item, content) {
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
        this.getalltaskbyuserid()

      }).catch(err => {
        console.log(err)
      })
    },
    delTypeClick (item) {
      console.log(item)
      let $this = this
      this.$confirm('删除分类后，给分类的表单会自动归类到【其他】中, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let payload = {
          id: item,
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          content: this.content
        }
        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['delone'] + '?signature=' + keyvalue;
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then((data) => {
          console.log(data)
          // $this.is_additem = true
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getalltemplateform()

        }).catch(err => {
          console.log(err)
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    getalltaskbyuserid () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getallauthorizetaskbyuserid'] + '?signature=' + keyvalue;
      // return false;
      this.loading = true
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.loading = false
        if (data.data != null) {
          this.tasklist = data.data
          this.task_type_list = JSON.parse(JSON.stringify(Object.keys(data.data)))
          console.log(Object.keys(data.data))
        } else {
          this.tasklist = []
          this.task_type_list = []
        }


      }).catch(err => {
        console.log(err)
      })
    },
    getallbytype () {
      let $this = this
      let payload = {
        typedesc: '任务类型',
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getallbytype'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.typelist = data.data



      }).catch(err => {
        console.log(err)
      })
    },
  },
  mounted () {
    this.getalltaskbyuserid()
    this.getallbytype()
  }
}
</script>
<style lang="less">
.task_index {
  .button_fill_content {
    .el-dropdown {
      width: 47%;
      .el-button {
        width: 100%;
      }
      margin-left: 10px;
    }
  }
  .time_p {
    font-size: @font_12;
    margin-top: 10px;
    color: @color_g;
  }
  .operation {
    margin-top: 15px;
  }
  .bg_task {
    background: @white;
    padding: 10px;
    min-height: 765px;
    // top: 70px;
  }
  .more_span {
    margin-left: 10px;
  }
}
</style>