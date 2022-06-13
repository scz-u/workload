<template>
  <div class="form_list_more" v-if="my_is_more">
    <div class="top_form">
      <span class="name_span">{{ typename }}</span>
      <span class="right">
        <el-input
          placeholder="搜索任务"
          size="middle"
          v-model="searchval"
          style="width: 240px"
        ></el-input>
        <router-link
          :to="{ name: 'NewForm', query: { k: Date.now() } }"
          class="margin_l_15"
        >
          <el-button icon="el-icon-plus" type="primary" size="small" round
            >新建任务</el-button
          >
        </router-link>
        <el-button
          size="small"
          icon="iconfont icon-cancel"
          class="margin_l_15"
          @click="close()"
          round
          >返回</el-button
        >
      </span>
    </div>
    <!-- <el-alert title="不可关闭的 alert" type="success" :closable="false">
    </el-alert> -->
    <!-- <div class="el-alert el-alert--success is-light">sdfsdfsdf</div> -->
    <div v-if="tasklist.length == 0" class="text_center">
      <img src="@/assets/img/none.png" alt="" />
      <p>暂无数据</p>
    </div>
    <div class="content" v-else>
      <div class="content_middle">
        <div>
          <div
            class="left content_middle_list"
            v-for="items in tasklist"
            :key="items.Code"
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
                      <span v-if="index < items.ScopeInfo.length - 1">,</span>
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
                      ><p @click="publicClick(items)">公示</p></el-dropdown-item
                    >
                    <el-dropdown-item
                      ><p @click="goTaskGClick(items)">
                        汇总
                      </p></el-dropdown-item
                    >
                    <el-dropdown-item>
                      <p @click="delTaskClick(items)">删除</p></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="pagination_div margin_top_10" v-if="!search_falg">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count"
          >
          </el-pagination>
        </div>
      </div>
      <div class="clearfix"></div>
    </div>

    <el-dialog
      :append-to-body="true"
      title="编辑分类名"
      :visible.sync="is_type_editor"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form @submit.native.prevent>
        <el-form-item>
          <el-input v-model="conent_type"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="is_type_editor = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="typeEditorSub()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      title="编辑分类"
      :visible.sync="is_type_editor_item"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form @submit.native.prevent>
        <el-form-item>
          <el-select v-model="typeid_item" style="width: 100%">
            <el-option
              v-for="item in typelist"
              :key="item"
              :label="item.Content"
              :value="item.Id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="is_type_editor_item = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="typeItemEditorSub()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <type-alert
      :is_add="is_add"
      @back="typeBack"
      @subBack="subTypeBack"
    ></type-alert>
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
import TypeAlert from './typeAlert'
import { getUser } from '../../../utils/auth'
import { beforeEncrypt, debounce } from '../../../utils/encryption'
import DepartAlertA from '@/components/public/departAlertA.vue'
import PublicAlert from './publicAlert'
export default {
  name: 'form_list',
  components: { TypeAlert, DepartAlertA, PublicAlert },
  props: {
    is_more: Boolean,
    typeid: Number,
    typename: String,
  },
  data () {
    return {
      is_public: false, public_detail: {},
      loading: false,
      weburl: this.$store.state.weburl,
      my_is_more: false,
      active: [],
      num: [],
      is_add: false,
      tasklist: [],
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
      count: 0,
      pagesize: 10,
      currentPage: 1, //初始页
      searchval: '',
      search_falg: false,
      departlist_a: '',
      is_depart_a: false,
      depart_a_detail: {},
    }
  },
  methods: {
    depList (val) {
      let list = []
      for (let i in val) {
        list.push(val[i].Department)
      }
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
    goTaskGClick (item) {
      this.$router.push({ name: 'gatherTask', params: { other: 1 }, query: { id: beforeEncrypt(item.Code), name: item.Title } })
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
        this.getalltemplateform(this.pagesize, this.currentPage)

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
        this.getalltemplateform(this.pagesize, this.currentPage)
      }).catch(err => {
        console.log(err)
      })
    },

    departABack (val) {
      this.is_depart_a = val
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize)  //每页下拉显示数据
      this.getalltemplateform(this.pagesize, this.currentPage)
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage)  //点击第几页
      this.getalltemplateform(this.pagesize, this.currentPage)
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
    editorTaskClick (code) {
      this.$router.push({ name: 'EditorTask', query: { id: beforeEncrypt(code) } })
    },
    copyClick (code) {
      this.$router.push({ name: 'copyTask', query: { id: beforeEncrypt(code) } })
    },
    formEditorClick (item) {
      console.log(item)
      this.is_form_editor = true
      this.form_title = item.Title
      this.form_code = item.Code
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
    typeClick () {
      this.is_add = !this.is_add
    },
    typeBack (val) {
      this.is_add = val
    },
    subTypeBack () {
      //运行全部
      this.getalltemplateform()
    },

    getalltemplateform (pagesize, num) {
      let $this = this

      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        type_id: this.typeid,
        page_size: pagesize,
        page_index: num
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      this.loading = true
      let posturl = $this.$apilist['getalltaskbytypeid'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        this.loading = false
        console.log(data)
        this.tasklist = data.data.tasks
        this.count = data.data.count

      }).catch(err => {
        console.log(err)
      })
    },
    getallbytype () {
      let $this = this
      let payload = {
        typedesc: '规则类型',
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
    close () {
      this.my_is_more = false
    },
    searchClick (val) {
      let $this = this
      let payload = {
        title: val,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['selfcreatesearch'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.tasklist = data.data
        this.search_falg = true


      }).catch(err => {
        console.log(err)
      })
    },

  },
  mounted () {
    // this.getalltemplateform()
    // this.getallbytype()
  },
  created () {
    this.$watch('searchval', debounce((newQuery) => {
      if (newQuery == '') {
        this.search_falg = false
        this.getalltemplateform(this.pagesize, this.currentPage)
      } else {
        this.searchClick(newQuery)
      }

    }, 200))
  },
  watch: {
    is_more (val) {
      this.my_is_more = val
      this.searchval = ''
      if (val) {
        this.getalltemplateform(this.pagesize, this.currentPage)

      }
    },
    my_is_more (val) {
      this.$emit('back', val)
    }
  }
}
</script>
<style lang="less">
.form_list_more {
  .pagination_div {
    text-align: center;
  }
  .type_div {
    min-height: 300px;
  }
  .name_span {
    font-size: @font_16;
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
}
</style>