<template>
  <div class="form_list_more frame_right">
    <div class="top_form">
      <span class="name_span">公示数据</span>
    </div>
    <div v-loading="loading">
      <div v-if="tasklist.length == 0" class="text_center">
        <img src="@/assets/img/none.png" alt="" />
        <p>暂无数据</p>
      </div>
      <el-card class="content_audit" v-else>
        <div class="content_middle">
          <div>
            <div
              class="left content_middle_list"
              v-for="items in tasklist"
              :key="items"
            >
              <div class="item_list_img">
                <div class="left">
                  <img
                    class="icon_left left"
                    :src="weburl + items.Icons.icon"
                    alt=""
                  />
                </div>

                <div class="left margin_l_10">
                  <p class="title_fill_content_right p_over">
                    {{ items.Title }}
                  </p>
                  <p class="p_font_fill_content margin_r_10">
                    <i class="iconfont icon-time p_icon_fill_content"></i>
                    <span>
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
                  <div class="p_font_fill_content margin_r_10">
                    <i class="iconfont icon-range p_icon_fill_content"></i>
                    <span v-if="items.Remark != ''" :title="items.Remark">
                      {{ items.Remark }}
                    </span>
                    <span v-else>-</span>
                  </div>
                  <div class="p_font_fill_content margin_r_10">
                    <i class="iconfont icon-object p_icon_fill_content"></i>
                    <span>
                      <span v-for="(d, index) in items.PubScopeInfo" :key="d">
                        <span class="">
                          {{ d.Department }}
                          <span v-if="index < items.PubScopeInfo.length - 1"
                            >,</span
                          >
                        </span>
                      </span>
                    </span>
                  </div>
                  <div class="p_font_fill_content">
                    <i
                      class="iconfont icon-description p_icon_fill_content"
                    ></i>
                    <span>
                      {{ items.TypeContent }}
                    </span>
                  </div>
                </div>

                <div class="button_fill_content right">
                  <el-button
                    round
                    size="mini"
                    @click="goTaskGClick(items)"
                    class="width_90"
                    >查看</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getUser } from '../../utils/auth'
import { beforeEncrypt, debounce } from '../../utils/encryption'
import DepartAlertA from '@/components/public/departAlertA.vue'
export default {
  name: 'form_list',
  props: {
    is_more: Boolean,
    typeid: Number,
    typename: String,
  },
  data () {
    return {
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
    goTaskGClick (item) {
      this.$router.push({ name: 'publicFormFill', query: { id: beforeEncrypt(item.Code), name: item.Title } })
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



    getalltemplateform (pagesize, num) {
      let $this = this

      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,

        page_size: pagesize,
        page_index: num
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      this.loading = true
      let posturl = $this.$apilist['allpubtask'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        this.loading = false
        console.log(data)
        if (data.data.tasks == null) {
          this.tasklist = []
        } else {
          this.tasklist = data.data.tasks
        }

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
    this.getalltemplateform(this.pagesize, this.currentPage)
  },

}
</script>
<style lang="less">
.form_list_more {
  // .bg_task1 {
  //   background: #fff;
  //   padding: 10px;
  //   // height: 765px;
  //   overflow: auto;
  //   position: absolute;
  //   bottom: 50px;
  //   right: 25px;
  //   left: 225px;
  //   top: 25px;
  // }
  .pagination_div {
    text-align: center;
    // position: fixed;
    // // bottom: 10px;
    // text-align: center;
    // // width: 100%;
    // left: 225px;
    // right: 25px;
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