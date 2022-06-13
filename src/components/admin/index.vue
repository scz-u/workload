<template>
  <div class="admin_index">
    <div class="top-content">
      <div class="tplTabsBarWrapper">
        <div class="tagWrapper">
          <div class="tagContent">
            <div class="categoryWrapper classify-loop">
              <div class="category">大分类</div>
              <div class="tags">
                <div class="tagSelect">
                  <div class="tagList">
                    <!-- <span class="tag active">全部</span> -->
                    <span
                      class="tag"
                      v-for="(item, index) in typelist"
                      :key="item"
                      :class="{ active: index == active_index }"
                      @click="tagBigClick(item, index)"
                    >
                      {{ item.Content }}
                    </span>
                    <span class="tag" @click="addtype(1)"
                      ><i class="el-icon-plus other_plus"></i
                    ></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="categoryWrapper classify-loop">
              <div class="category">小分类</div>
              <div class="tags">
                <div class="tagSelect">
                  <div class="tagList">
                    <!-- <span class="tag active">全部</span> -->
                    <!-- <span class="tag">推荐</span> -->

                    <span
                      class="tag"
                      v-for="(item, index) in active_list.Child"
                      :key="item"
                      :class="{ active: index == active_small_index }"
                      @click="tagSmallClick(item, index)"
                    >
                      {{ item.Content }}
                    </span>

                    <span class="tag" @click="addtype(active_list.Id)"
                      ><i class="el-icon-plus other_plus"></i
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="frontRoot">
      <div class="tplTabsContent">
        <div class="tag-code-wrapper">
          <div class="codeListWrapper">
            <div class="codeWrapperTitle">
              <div class="tagName cursor">
                <span
                  title="点击修改名称"
                  @click="editorNameClick(typelist[active_index])"
                  >{{ typelist[active_index].Content }}
                </span>
              </div>
            </div>
            <div
              class="tagName_small cursor"
              style="z-index: 10"
              v-if="Object.keys(active_small_val).length > 0"
              @mouseover="mouseOverFour($event)"
              @mouseleave="mouseLeaveFour($event)"
            >
              <span
                @click="editorNameClick(active_small_val)"
                title="点击修改名称"
                >{{ active_small_val.Content }}
              </span>
              <span class="type_num_span type_editor_text display_none">
                <span
                  class="del_span dispaly_block margin_l_5"
                  @click="delTypeClick(active_small_val)"
                  title="删除"
                  ><i class="el-icon-delete"></i></span
              ></span>
            </div>
            <div
              class="codeListContent"
              v-if="Object.keys(active_small_val).length > 0"
            >
              <div
                class="condeWrapper_item codeWrapper_new blankItem___other"
                @mouseover="mouseOverOne($event)"
                @mouseleave="mouseLeaveOne($event)"
              >
                <div @click="addtemplate()">
                  <i class="el-icon-plus blankIcon"></i>
                  <div class="blankItemTitle">从空白新建</div>
                </div>
              </div>
              <div
                class="condeWrapper_item codeWrapper_new"
                @mouseover="mouseOver($event)"
                @mouseleave="mouseLeave($event)"
                v-for="item in templatelist"
                :key="item"
              >
                <div
                  class="codeImgWrapper"
                  :style="{
                    backgroundImage: 'url(' + imgurl + item.UrlPath + ')',
                  }"
                >
                  <img src="@/assets/img/none.png" alt="" />
                </div>
                <div class="descWrapper">
                  <div class="tplName">
                    <span>{{ item.Title }}</span>
                  </div>
                  <div class="shortDesc">{{ item.Remark }}</div>
                  <div class="footerTags">
                    <div class="recordTag" @click="activetemplate(item)">
                      <span v-if="item.IsActive == false">激活</span>
                      <span v-else>关闭</span>
                    </div>

                    <div class="recordTag" @click="looktemplate(item.Code)">
                      预览
                    </div>
                    <div class="recordTag" @click="eidtortemplate(item.Code)">
                      编辑
                    </div>
                    <div class="recordTag" @click="deltemplate(item)">删除</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :append-to-body="true"
      title="新建分类"
      :visible.sync="is_add"
      :close-on-click-modal="false"
      :custom-class="'depart_aldert_dialog'"
      width="600px"
      height="700px"
      :before-close="handleClose"
      @close="close"
    >
      <el-form @submit.native.prevent>
        <el-form-item label="表单大分类名称" v-if="parent_id == 1">
          <el-input v-model="content" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="表单小分类名称" v-else>
          <el-input v-model="content" placeholder="请填写"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="is_add = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="addTypeOne()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      title="编辑"
      :visible.sync="is_editor"
      :close-on-click-modal="false"
      :custom-class="'depart_aldert_dialog'"
      width="600px"
      height="700px"
      :before-close="handleClose"
      @close="close"
    >
      <el-form @submit.native.prevent>
        <el-form-item label="分类名称">
          <el-input v-model="content" placeholder="请填写"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeClick()" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="editorTypeOne()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { afterEncrypt, beforeEncrypt } from '../../utils/encryption'
export default {
  name: 'admin_index',
  data () {
    return {
      imgurl: this.$store.state.imgurl,
      parent_id: 1,
      now_id: 0,
      is_add: false,
      is_editor: false,
      content: '',
      typelist: {},
      active_index: 0,
      active_list: [{ Child: [] }],
      active_small_index: 0,
      active_small_val: {},
      templatelist: [],
    }
  },
  methods: {
    deltemplate (item) {
      this.$confirm('此操作将永久删除该表单, 是否继续?', '提示', {
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
        let posturl = $this.$apilist['deltemplate'] + '?signature=' + keyvalue;
        console.log(payload)
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then((data) => {
          console.log(data)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.alltype()

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      })
    },
    activetemplate (item) {
      console.log(item)
      // return false
      let payload = {
        form_code: item.Code,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
      }
      if (item.IsActive == false) {
        payload['active'] = '111'
      }

      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['activetemplate'] + '?signature=' + keyvalue;
      // return false;
      this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        let message = ''
        if (item.IsActive == false) {
          message = '激活成功'
        } else {
          message = item.IsActive == false ? '关闭成功!' : '激活成功'
        }
        this.$message({
          type: 'success',
          message: item.IsActive == false ? '激活成功!' : '关闭成功!'
        });
        this.alltype()


      }).catch(err => {
        console.log(err)
      })
    },
    addtemplate () {
      console.log(this.active_small_val.Id)
      this.$router.push({ name: 'newTemplate', query: { k: Date.now(), type_id: beforeEncrypt(this.active_small_val.Id.toString()) } })

    },
    eidtortemplate (code) {
      let val = beforeEncrypt(code)
      this.$router.push({ name: 'editorTemplate', query: { k: val } })
    },
    looktemplate (code) {
      let routedata = this.$router.resolve({ name: 'lookTemplate', query: { id: beforeEncrypt(code) } })
      window.open(routedata.href, '_blank');
    },
    delTypeClick (item) {
      console.log(item)
      let $this = this
      this.$confirm('删除分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let payload = {
          id: item.Id,
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          content: this.content
        }
        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['delonetype'] + '?signature=' + keyvalue;
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then((data) => {
          console.log(data)
          // $this.is_additem = true
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.alltype()


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
    editorNameClick (item) {
      this.is_editor = !this.is_editor
      this.content = item.Content
      this.now_id = item.Id
    },
    editorTypeOne () {
      let $this = this
      if (this.content == '') {
        this.$alert('请填写分类名！', '提示', {
          confirmButtonText: '确定',

        });
        return false
      }
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        id: this.now_id,
        content: this.content
      }
      console.log(payload)
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['editonetype'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.$message({
          message: '编辑成功！',
          type: 'success'
        });
        this.is_editor = !this.is_editor
        this.content = ''
        this.alltype()
        // this.formdetail.form_code = afterEncrypt(code)

      }).catch(err => {
        console.log(err)
      })
    },
    closeClick () {
      this.is_editor = false
      this.content = ''
    },
    tagSmallClick (item, index) {
      console.log(item)
      console.log(index)
      this.active_small_index = index
      this.active_small_val = item
      this.alltemplate(this.active_small_val.Id)
    },
    tagBigClick (item, index) {
      this.active_list = item
      this.active_index = index
      this.active_small_index = 0
      if (item.Child.length > 0) {
        this.active_small_val = item.Child[0]
        this.alltemplate(this.active_small_val.Id)
      } else {
        this.active_small_val = {}
      }

    },
    addtype (num) {
      this.parent_id = num
      this.is_add = !this.is_add
    },
    addTypeOne () {
      let $this = this
      if (this.content == '') {
        this.$alert('请填写分类名！', '提示', {
          confirmButtonText: '确定',

        });
        return false
      }
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        parent_id: this.parent_id,
        content: this.content
      }
      console.log(payload)
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['addonetype'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.$message({
          message: '添加成功！',
          type: 'success'
        });
        this.is_add = !this.is_add
        this.content = ''
        this.alltype()
        // this.formdetail.form_code = afterEncrypt(code)

      }).catch(err => {
        console.log(err)
      })
    },
    alltype () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['alltype'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.typelist = data.data
        console.log(this.typelist.length)
        if (this.typelist.length >= this.active_index) {
          this.active_list = this.typelist[this.active_index]
          console.log(this.active_small_index)
          console.log(this.active_list.Child.length)
          if (this.active_small_index < this.active_list.Child.length) {
            console.log('=====================')
            console.log()
            this.active_small_val = this.active_list.Child[this.active_small_index]
            this.alltemplate(this.active_small_val.Id)
            // this.active_small_index = 0
          } else if (this.active_list.Child.length > 0) {
            console.log(this.active_list.Child)
            this.active_small_val = this.active_list.Child[0]
            this.active_small_index = 0
            this.alltemplate(this.active_small_val.Id)
          } else {
            this.active_small_val = {}
            this.active_small_index = 0
          }

        }
        // this.formdetail.form_code = afterEncrypt(code)

      }).catch(err => {
        console.log(err)
      })
    },
    alltemplate (type_id) {
      console.log('---------------------')
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        type_id: type_id
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['alltemplate'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.templatelist = data.data
        // this.formdetail.form_code = afterEncrypt(code)

      }).catch(err => {
        console.log(err)
      })
    },
    mouseOverOne ($event) {
      $event.currentTarget.className = "condeWrapper_item codeWrapper_new blankItem___other  activeAdmin";
    },
    mouseLeaveOne ($event) {
      $event.currentTarget.className = "condeWrapper_item codeWrapper_new blankItem___other";
    },
    mouseOver ($event) {
      $event.currentTarget.className = "condeWrapper_item codeWrapper_new   activeAdmin";
    },
    mouseLeave ($event) {
      $event.currentTarget.className = "condeWrapper_item codeWrapper_new";
    },
    mouseOverFour ($event) {
      console.log($event.currentTarget.lastElementChild.className)
      $event.currentTarget.lastElementChild.className = " type_num_span type_editor_text display_block";
      console.log($event.currentTarget.lastElementChild)
    },
    mouseLeaveFour ($event) {
      $event.currentTarget.lastElementChild.className = "display_none";
    },
  },
  mounted () {
    this.alltype()
  }
}
</script>
<style lang="less">
body {
  background-color: #f4f4f4;
}
.admin_index {
  .footerTags {
    position: absolute;
    left: 10px;
    bottom: 12px;
  }
  .recordTag {
    cursor: pointer;
    background-color: #f0f2f5;
    border-radius: 2px;
    display: inline-block;
    color: #999;
    font-size: 12px;
    padding: 0 4px;
    margin-left: 6px;
    font-weight: 400;
  }
  .other_plus:hover {
    color: @color;
  }
  .activeAdmin {
    -webkit-box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.1);
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.1);
  }
  .tplTabsBarWrapper {
    background: #fff;
    .tagWrapper {
      background-color: #fff;
      width: 1200px;
      margin: 0 auto;
    }
    .tagContent {
      width: 1200px;
      border-radius: 1px;
      margin: 0 auto;
      padding: 12px 0 !important;
      display: flex;
      flex-direction: column;
    }

    .categoryWrapper {
      display: flex;
      border-top: 1px dashed #ddd;
      margin-top: 8px;
      padding-top: 8px;
    }
    .categoryWrapper:first-child {
      margin-top: 0;
      border: 0;
      padding-top: 0;
    }
    .category {
      color: #999;
      font-size: 14px;
      width: 88px;
      flex: 0 0 auto;
      padding: 2px 0;
      line-height: 24px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: clip;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: -8px;
      flex-grow: 1;
    }
    .tagSelect {
      width: 100%;
      padding-right: 40px;
      position: relative;
    }
    .tagList {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .tag {
      color: rgba(0, 0, 0, 0.87);
      padding: 2px 10px;
      cursor: pointer;
      margin-top: 8px;
      margin-right: 8px;
      border-radius: 4px;
      line-height: 24px;
      position: relative;
      display: flex;
    }
    .tag.active {
      background-color: @color;
      color: #fff;
    }
  }
  .tplTabsContent {
    width: 1200px;
    margin: 0 auto;
  }
  .tag-code-wrapper {
    width: 1196px;
    margin: 0 auto;
  }

  .codeListWrapperf {
    margin-top: 64px;
  }
  .codeListWrapper:first-child {
    margin-top: 32px;
  }
  .codeWrapperTitle {
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
    display: flex;
    line-height: 20px;
    padding-left: 0;
  }
  .tagName {
    font-size: 20px !important;
    color: rgba(0, 0, 0, 0.87);
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }
  .tagName_small {
    margin-top: 10px;
    line-height: 30px;
    height: 30px;
  }
  .codeListContent {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    width: 1220px;
    margin-left: -24px;
    // margin-top: -24px;
  }
  // .condeWrapper_item {
  //   position: relative;
  //   display: -ms-flexbox;
  //   display: flex;
  //   -ms-flex-align: center;
  //   align-items: center;
  //   -ms-flex-pack: center;
  //   justify-content: center;
  //   text-align: center;
  //   cursor: pointer;
  // }
  .codeWrapper___item {
    position: relative;
    margin-left: 24px;
    margin-top: 16px;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    background-color: #fff;
    border-radius: 1px;
    width: 220px;
    height: 280px;
    text-decoration: none !important;
  }
  .blankItem___other {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
  }
  .codeWrapper_new {
    position: relative;
    margin-left: 24px;
    margin-top: 16px;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    background-color: #fff;
    border-radius: 1px;
    width: 220px;
    height: 280px;
    text-decoration: none !important;
  }
  .blankIcon {
    color: #bbb;
    font-size: 48px !important;
  }
  .blankItemTitle {
    color: rgba(0, 0, 0, 0.87);
    font-size: 18px !important;
    margin-top: 12px;
  }
  .codeImgWrapper {
    // width: 100%;
    height: 150px;
    background-color: rgba(83, 104, 128, 0.2);
    border-top-left-radius: 1px;
    border-top-right-radius: 1px;
    background-size: cover;
    background-position: 50%;
    img {
      display: none;
      height: 150px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .tplName {
    font-weight: 700;
    font-size: 16px !important;
    color: rgba(0, 0, 0, 0.87);
    line-height: 20px;
    margin: 16px 16px 0;
  }
  .shortDesc {
    margin: 4px 16px 0;
    line-height: 18px;
    max-height: 36px;
    overflow: hidden;
    font-size: 12px;
    color: #666;
  }
}
</style>