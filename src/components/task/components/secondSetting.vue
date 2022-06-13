<template>
  <div class="second_setting setting_cnt">
    <div class="content_setting">
      <div v-if="otherval.length > 0">
        <div
          v-for="(item, index) in otherval"
          :key="item"
          class="list_second_setting"
        >
          <!-- <p class="left left_font p_over">{{ item.title }}</p> -->
          <p class="left left_font p_over">
            {{ item.title }}
          </p>
          <p class="right right_font">
            <span
              class="margin_l_5 display_inline_block"
              @click="editorClick(item, index)"
              >编辑</span
            >
            <span
              class="margin_l_5 display_inline_block"
              @click="delClick(index)"
              >移除</span
            >
          </p>
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="add_second cursor">
        <span @click="addClick()"> <i class="el-icon-plus"></i> 添加表单 </span>
      </div>
    </div>
    <!-- <FormListAlert
      :is_add="is_add"
      @back="listBack"
      @subback="subBack"
    ></FormListAlert>
    

   -->
    <DynamicForm
      ref="formDesign"
      :conf="JSON.parse(JSON.stringify(detail))"
      :is_add="is_form"
      tabName="formDesign"
      @back="formBack"
      @subback="subAlertBack"
      :num="'editor'"
    />
    <FormAlert
      :is_add="is_add"
      :departlist="departlist"
      :title="'选择表单'"
      @back="selectBack"
      @departSub="selectSub"
    ></FormAlert>
  </div>
</template>
<script>
// import FormListAlert from './formListAlert'
// import FormAlert from './formEditorAlert'
import DynamicForm from './DynamicForm'
import SelectForm from './selectForm'
import FormAlert from '../../public/formAlert'
export default {
  name: 'second_setting',
  components: { FormAlert, DynamicForm },
  props: {
    selectdepart: Array,
    sumval: Object,
    key: Number
  },
  data () {
    return {
      departlist: [],
      is_add: false,
      secondval: [],
      otherval: [],
      otherval_two: [],
      secondval_two: [],
      is_form: false,
      detail: {},
      nownum: 0,
      "formData": {
        "fields": [
        ],
        "title": "elForm123",
        "labelPosition": "right",
        "labelWidth": 100,
        "is_template": false,
        "type_id": ''
      },
      filters: [
        {
          prop: ['title'],
          value: ''
        }
      ],
    }
  },
  methods: {
    selectSub (val) {
      console.log(val)
      this.departlist = val
      this.is_add = false
      let formlist_str = JSON.stringify(this.otherval)
      console.log(formlist_str)
      console.log(this.departlist)
      console.log('--------------start---------------------')
      for (let i in this.departlist) {
        console.log(this.departlist[i])
        console.log(formlist_str.indexOf(this.departlist[i]))
        if (formlist_str.indexOf(this.departlist[i].Name) > -1) {
          this.$confirm('新添加的表单 ' + this.departlist[i].Name + ' 与现有的表单名称存在重复，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (formlist_str.indexOf(this.departlist[i].Code) == -1) {

              this.gettemplateformdetail(this.departlist[i].Code, i)
              console.log(this.otherval)
            }
          }).catch(() => {
            return false;
          });
        } else {
          if (formlist_str.indexOf(this.departlist[i].Code) == -1) {

            this.gettemplateformdetail(this.departlist[i].Code, i)
            console.log(this.otherval)
          }
        }

      }
      console.log('--------------end---------------------')
      // this.$emit('update:selectdepart', this.departlist)
    },
    delClick (indexnum) {
      // this.$delete(this.departlist, indexnum)
      // this.$emit('update:selectdepart', this.departlist)
      console.log(this.departlist)

      // return false
      if (this.otherval[indexnum].other_type == 'new') {
        this.$confirm('确认删除该表单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$delete(this.departlist, indexnum)
          this.$delete(this.otherval, indexnum)
          this.sumval.secondval = this.otherval
          this.$emit('update:sumval', this.sumval)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      } else {
        let $this = this
        // this.form_code = code
        let payload = {
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          task_code: this.sumval.firstval.code,
          form_code: this.otherval[indexnum].form_code

        }
        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['count'] + '?signature=' + keyvalue;
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then((data) => {
          this.$confirm('该表单已有 ' + data.data + ' 条数据，是否继续删除该表单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$delete(this.departlist, indexnum)
            this.$delete(this.otherval, indexnum)
            this.sumval.secondval = this.otherval
            this.$emit('update:sumval', this.sumval)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });

        }).catch(err => {
          console.log(err)
        })
      }

      return false
      this.$delete(this.departlist, indexnum)
      this.$delete(this.otherval, indexnum)
      this.sumval.secondval = this.otherval
      this.$emit('update:sumval', this.sumval)
      return false
      this.$confirm('确认删除该表单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let index = this.secondval.findIndex(item => {
          if (item == indexnum) {
            return true;
          }
        });
        console.log(indexnum)
        console.log(index)
        this.$delete(this.departlist, index)
        this.$delete(this.secondval, index)
        this.$delete(this.secondval_two, index)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.sumval.secondval = this.secondval
        this.$emit('update:sumval', this.sumval)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    formBack (val) {
      this.is_form = val
      console.log(this.nownum)
      console.log(this.secondval_two)
      this.otherval[this.nownum] = this.secondval_two[this.nownum]
      this.sumval.secondval = this.otherval
      console.log(this.otherval)
      this.$emit('update:sumval', this.sumval)
    },
    editorClick (item, otherindex) {
      console.log(item)
      // this.detail = JSON.parse(JSON.stringify(item))
      // console.log(JSON.stringify(this.otherval))
      let index = this.otherval.findIndex(item1 => {
        if (item1 == item) {
          return true;
        }
      });
      console.log(index)
      this.nownum = otherindex
      console.log(this.nownum)
      this.detail = (item)
      for (let i in this.detail.fields) {
        if (this.detail.fields[i].tagIcon == 'describeImg') {
          let key = this.detail.fields[i].placeholder
          if (key.indexOf('https://xxx/dialog_icon.png') == -1) {
            let url1 = key.split('http://xxx/')[1].split('?e=')[0]
            console.log(url1)
            console.log('ddddddddddddddd')
            let $this = this
            let payload = {
              key: url1
            }

            let createvalue = $this.$createObj(payload);
            var keyvalue = createvalue['keyvalue'];
            let posturl = $this.$apilist['qiniudown'] + '?signature=' + keyvalue;
            // return false;
            $this.$server.post(posturl, createvalue['fd']).then((data) => {
              // console.log(data)
              // key = data.data
              this.detail.fields[i].placeholder = data.data
              // return data.data
            }).catch(err => {
              console.log(err)
            })
          }
        }
      }
      console.log(this.detail)
      this.otherval_two = JSON.parse(JSON.stringify(this.otherval))
      this.secondval_two = JSON.parse(JSON.stringify(this.otherval))
      this.is_form = !this.is_form
    },
    // subBack (val) {
    //   console.log(val)
    //   this.secondval.push(JSON.parse(JSON.stringify(val)))
    //   this.secondval_two.push(JSON.parse(JSON.stringify(val)))
    //   // console.log(JSON.stringify(this.secondval_two))
    //   this.sumval.secondval = this.secondval
    //   console.log()
    //   this.$emit('update:sumval', this.sumval)
    // },
    subAlertBack (val) {
      console.log(val)
      console.log(JSON.stringify(this.otherval))
      // this.secondval[this.nownum] = val
      // this.secondval_two[this.nownum] = val
      console.log(this.nownum)
      this.otherval = JSON.parse(JSON.stringify(this.otherval_two))
      this.secondval_two = JSON.parse(JSON.stringify(this.otherval_two))
      console.log(JSON.stringify(this.secondval_two))
      this.secondval_two[this.nownum].title = val.title
      this.secondval_two[this.nownum].remark = val.remark
      this.secondval_two[this.nownum].type_id = val.type_id
      this.secondval_two[this.nownum].is_template = val.is_template
      this.secondval_two[this.nownum].urlpath = val.urlpath
      this.secondval_two[this.nownum].fields = val.fields
      this.secondval_two[this.nownum].labelPosition = val.labelPosition
      this.secondval_two[this.nownum].labelWidth = val.labelWidth
      this.secondval_two[this.nownum]
      this.secondval_two[this.nownum]
      console.log(this.otherval)
      console.log(this.otherval[this.nownum])
      this.otherval[this.nownum].title = val.title
      this.otherval[this.nownum].remark = val.remark
      this.otherval[this.nownum].type_id = val.type_id
      this.otherval[this.nownum].is_template = val.is_template
      this.otherval[this.nownum].urlpath = val.urlpath
      this.otherval[this.nownum].fields = val.fields
      this.otherval[this.nownum].labelPosition = val.labelPosition
      this.otherval[this.nownum].labelWidth = val.labelWidth
      let newval = this.otherval[this.nownum]
      console.log(this.otherval)
      this.$set(this.otherval, this.nownum, newval)
      this.sumval.secondval = this.otherval
      // this.$emit('update:sumval', this.sumval)
    },
    addClick () {
      this.departlist = []
      this.is_add = !this.is_add
    },
    listBack (val) {
      this.is_add = val
    },
    gettemplateformdetail (code, i) {
      // let code = afterEncrypt(this.$route.query.k)
      let $this = this
      // this.form_code = code
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: code

      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['gettemplateformdetail'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        data.data['other_type'] = 'new'
        $this.otherval.splice(i, 0, data.data)
        this.sumval.secondval = this.otherval
        this.$emit('update:sumval', this.sumval)
        // console.log($this.secondval)
        // return data.data

      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    key (val) {
      console.log(val)
      this.secondval_two = JSON.parse(JSON.stringify(this.sumval.secondval))
      this.otherval = JSON.parse(JSON.stringify(this.sumval.secondval))
      this.departlist = []
      console.log(this.otherval)
      for (let i in this.otherval) {
        this.departlist.push({ Code: this.otherval[i].form_code, Name: this.otherval[i].title })
      }
      console.log(this.secondval)
    }
  }
}
</script>
<style lang="less">
.second_setting {
  .add_second {
    color: @color;
    margin-top: 15px;
  }
  .list_second_setting {
    border-bottom: @border;
    // height: 40px;
    // line-height: 40px;
    padding-left: 5px;
    padding-right: 5px;
    display: table;
    padding: 10px;
  }
  .left_font {
    font-size: 14px;
    font-weight: bold;
    display: table-cell;
    vertical-align: middle;
    width: 450px;
  }
  .right_font {
    font-size: 12px;
    cursor: pointer;
    display: table-cell;
    vertical-align: middle;
  }
  .right_font span:hover {
    color: @color;
  }
}
</style>