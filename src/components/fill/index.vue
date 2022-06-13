<template>
  <div class="fill_index frame_right">
    <div v-show="!is_more">
      <div>
        <p class="title_zong">待完成任务</p>
      </div>
      <div v-loading="loading">
        <div v-if="Object.keys(tasklist) == 0" class="text_center">
          <img src="@/assets/img/none.png" alt="" />
          <p>暂无数据</p>
        </div>
        <div
          class="content"
          v-for="item in Object.keys(tasklist).reverse()"
          :key="item.Code"
        >
          <div class="content_title">
            <p class="before display_inline_block"></p>
            <p class="before_font display_inline_block">
              <span v-if="isStr(tasklist[item]) == 1">
                {{ tasklist[item][0].TypeContent }}</span
              >
              <span v-else>{{ tasklist[item] }}</span>
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
                  <div class="item_title_fill_right right success_title_fill">
                    进行中
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
                      class="p_over display_inline_block width_140"
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
                      @click="editorTaskClick(items)"
                      >填报</el-button
                    >
                    <el-button round size="mini" @click="gourl(items)"
                      >汇总</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { beforeEncrypt } from '../../utils/encryption'
export default {
  name: 'task_index',
  data () {
    return {
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
    gourl (item) {
      this.$router.push({ name: 'sumFill', query: { id: beforeEncrypt(item.Code), name: item.Title } })
    },
    editorTaskClick (item) {
      console.log(item)
      this.$router.push({ name: 'formFill', query: { name: item.Title, id: beforeEncrypt(item.Code) } })
    },
    publicTaskClick (item) {
      this.$router.push({ name: 'publicFormFill', params: { other: 1 }, query: { id: beforeEncrypt(item.Code), name: item.Title } })
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
      let posturl = $this.$apilist['getreporttask'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      this.loading = true
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.loading = false
        if (data.data != null) {
          this.tasklist = data.data
          this.task_type_list = JSON.parse(JSON.stringify(Object.keys(data.data)))
          console.log(Object.keys(data.data))
        } else {
          this.tasklist = {}
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
.fill_index {
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
  }
  .more_span {
    margin-left: 10px;
  }
  .denycont_span {
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
}
</style>