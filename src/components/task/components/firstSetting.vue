<template>
  <div class="first_setting setting_cnt">
    <div class="content_setting">
      <el-form @submit.native.prevent>
        <el-form-item label="任务名称" required>
          <el-input size="small" v-model.trim="firstval.name"></el-input>
        </el-form-item>
        <el-form-item label="任务说明">
          <el-input size="small" v-model.trim="firstval.remark"></el-input>
        </el-form-item>
        <el-form-item label="任务分类" required>
          <div class="select-main">
            <!-- <a-select v-model="itemval">
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0;" />
                <div
                  style="padding: 4px 8px; cursor: pointer;"
                  @mousedown="e => e.preventDefault()"
                >
                  <p v-if="!is_additem" @click="additemShow()">
                    <i class="el-icon-plus"></i>新建分类
                  </p>
                </div>
              </div>

              <a-select-option
                v-for="item in items"
                :key="item"
                :value="item.Id"
              >
                {{ item.Content }}
              </a-select-option>
            </a-select> -->
            <el-select
              v-model="firstval.type_id"
              placeholder=""
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="item in items"
                :key="item.Id"
                :label="item.Content"
                :value="item.Id"
              >
              </el-option>
              <el-option
                ><p @click.stop="additemShow()">
                  <i class="el-icon-plus"></i>新建分类
                </p></el-option
              >
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="管理员(未选为本人)">
          <div
            class="departid_div el-input el-input--small"
            @click="departClick()"
          >
            <span
              v-for="item in firstval.synergylist"
              :key="item"
              class="departid_span"
              >{{ item.Department }}
              <!-- <GetTreeName
                :openid="item.id"
                :isdepart="item.IsDepart"
                v-if="item.depart_id.split('-').length == 1"
              ></GetTreeName
              ><GetTreeNameM
                :openid="item.id"
                :isdepart="item.IsDepart"
                v-else
              ></GetTreeNameM> -->
            </span>
          </div>
        </el-form-item>
        <el-form-item label="填报对象" required>
          <div
            class="departid_div el-input el-input--small"
            @click="departAClick()"
          >
            <span
              v-for="item in firstval.departlist"
              :key="item"
              class="departid_span"
              >{{ item.Department }}
            </span>
          </div>
        </el-form-item>
        <!-- <el-form-item label="公示(不填写默认不公示)">
          <div
            class="departid_div el-input el-input--small"
            @click="departPClick()"
          >
            <span
              v-for="item in firstval.publiclist"
              :key="item"
              class="departid_span"
              >{{ item.Department }}
            </span>
          </div>
        </el-form-item> -->
        <el-form-item label="时间" required>
          <div class="el-input">
            <el-date-picker
              size="small"
              v-model="firstval.dateval"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="是否需要审核流程" required>
          <!-- <span class="fieldinfo">（ 是否需要添加审批，即设置流程设计 ）</span> -->
          <div class="el-input">
            <!-- <el-radio v-model="auditradio" label="1">是</el-radio>
            <el-radio v-model="auditradio" label="2">否</el-radio> -->
            <el-radio-group v-model="auditradio" @change="changeClick()">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="填报图标">
          <div class="el-input el-input--small">
            <!-- <label for="" class="icon-select-item">
              <img :src="icons[selected].value" alt="" />
            </label> -->
            <!-- <el-button size="small" class="margin_top_10">选择图标</el-button> -->
            <el-popover placement="right" width="400" trigger="click">
              <div class="first_icon">
                <label
                  @click="selectIcon"
                  :data-index="index"
                  :data-icon="item.value"
                  v-for="(item, index) in icons"
                  :key="item"
                  class="iconitem"
                  v-bind:class="index == selected ? 'seltected' : ''"
                >
                  <i class="icon icon-checked" v-if="index == selected"></i>
                  <img :src="item.value" />
                </label>
              </div>

              <!-- <el-button slot="reference" size="small" class="margin_top_10"
                >选择图标</el-button
              > -->
              <label for="" slot="reference" class="icon-select-item">
                <img :src="icons[selected].value" alt="" />
                <span class="icon_first_setting_o">
                  <i class="el-icon-refresh icon_first_setting"></i>
                </span>
              </label>
            </el-popover>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <DepartAlert
      :is_add="is_depart"
      :departlist="firstval.synergylist"
      :title="'管理员'"
      @back="departBack"
      @departSub="departSub"
    ></DepartAlert>
    <DepartAlertA
      :is_add="is_depart_a"
      :departlist="firstval.departlist"
      :title="'填报对象'"
      @back="departABack"
      @departSub="departASub"
    ></DepartAlertA>
    <DepartAlertP
      :is_add="is_depart_p"
      :departlist="firstval.publiclist"
      :title="'公示'"
      @back="departPBack"
      @departSub="departPSub"
    ></DepartAlertP>
    <el-dialog
      :append-to-body="true"
      title="新建分类"
      :visible.sync="is_additem"
      :close-on-click-modal="false"
      :custom-class="'depart_aldert_dialog'"
      width="600px"
      height="700px"
      @close="close"
    >
      <div class="member_container">
        <div style="height: 150px">
          <el-form @submit.native.prevent>
            <el-form-item label="分类名">
              <el-input v-model.trim="addselect"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="clearfix"></div>
        <div class="footer">
          <el-button size="small" @click="is_additem = false">取消</el-button>
          <el-button type="primary" size="small" @click="addone()"
            >确定</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DepartAlert from '@/components/public/departAlertA.vue'
import DepartAlertA from '@/components/public/departAlertA.vue'
import DepartAlertP from '@/components/public/departAlertA.vue'
// import GetTreeNameM from '../../publicLibrary/getTreeNameM'
// import GetTreeName from '../../publicLibrary/getTreeName'
export default {
  name: 'first_setting',
  props: {
    firstval: Object,
    auditradio: String
  },
  components: { DepartAlert, DepartAlertA, DepartAlertP },
  data () {
    return {
      dateval: [],
      value: '',
      weburl: this.$store.state.weburl,
      items: [],
      itemval: '',
      addselect: '',
      is_additem: false,
      departlist: [],
      ruleForm: {},
      is_depart: false,
      departlist_a: [],
      departlist_p: [],
      is_depart_a: false,
      is_depart_p: false,
      firstVal: {},
      selected: 0,
      icons: [
        {
          name: "common",
          value: "img/icon1.png"
        },
        {
          name: "trip",
          value: "img/icon2.png"
        }, {
          name: "out",
          value: "img/icon3.png"
        },
        {
          name: "goods",
          value: "img/icon4.png"
        }, {
          name: "biz",
          value: "img/icon5.png"
        },
        {
          name: "leave",
          value: "img/icon6.png"
        }, {
          name: "message",
          value: "img/icon7.png"
        },
        {
          name: "favorite",
          value: "img/icon8.png"
        }, {
          name: "datacurve",
          value: "img/icon9.png"
        },
        {
          name: "timefades",
          value: "img/icon10.png"
        }, {
          name: "official",
          value: "img/icon11.png"
        },
        {
          name: "fly",
          value: "img/icon12.png"
        },
        {
          name: "house",
          value: "img/TB1ESwQOXXXXXbaaXXXXXXXXXXX-102-102.png"
        },
        {
          name: "datapie",
          value: "img/TB1q5U5OXXXXXXPXVXXXXXXXXXX-102-102.png"
        }, {
          name: "tag",
          value: "img/TB1Pb4eOpXXXXcGXpXXXXXXXXXX-102-102.png"
        },
        {
          name: "love",
          value: "img/TB1GCw.OXXXXXbOXFXXXXXXXXXX-102-102.png"
        }, {
          name: "daily",
          value: "img/TB1J20kOpXXXXc1XpXXXXXXXXXX-102-102.png"
        },
        {
          name: "weekly",
          value: "img/TB14v8rOpXXXXXYXpXXXXXXXXXX-102-102.png"
        }, {
          name: "monthly",
          value: "img/TB1NI0nOpXXXXX2XpXXXXXXXXXX-102-102.png"
        },
        {
          name: "promotion",
          value: "img/TB1Nb.3OXXXXXalaXXXXXXXXXXX-102-102.png"
        }, {
          name: "visiting",
          value: "img/TB1_Y.5OXXXXXcEXVXXXXXXXXXX-102-102.png"
        }, {
          name: "behavior",
          value: "img/TB15DEPOXXXXXXTaFXXXXXXXXXX-102-102.png"
        }, {
          name: "warehouse",
          value: "img/TB13Bw.OXXXXXXQXVXXXXXXXXXX-102-102.png"
        }, {
          name: "schoolAttendance",
          value: "img/TB1zhc.OXXXXXa4XVXXXXXXXXXX-102-102.png"
        }, {
          name: "schoolLog",
          value: "img/TB1i4ldOpXXXXaHXFXXXXXXXXXX-102-102.png"
        }, {
          name: "schoolStatement",
          value: "img/TB1Ons_OXXXXXbpXVXXXXXXXXXX-102-102.png"
        }, {
          name: "meeting",
          value: "img/TB1mZhiOpXXXXccXpXXXXXXXXXX-102-102.png"
        }, {
          name: "temporaryNotice",
          value: "img/TB118RbOpXXXXahXVXXXXXXXXXX-102-102.png"
        }, {
          name: "dutyLog",
          value: "img/TB18D0zOpXXXXXbXXXXXXXXXXXX-102-102.png"
        }, {
          name: "propaganda",
          value: "img/TB1a.VeOpXXXXc1XVXXXXXXXXXX-102-102.png"
        }, {
          name: "jobs",
          value: "img/TB1FXVmOpXXXXbGXFXXXXXXXXXX-102-102.png"
        }, {
          name: "recruitment",
          value: "img/TB1i7lmOpXXXXbvXFXXXXXXXXXX-102-102.png"
        }, {
          name: "inchapter",
          value: "img/TB1HXRxOpXXXXbbXpXXXXXXXXXX-102-102.png"
        }, {
          name: "class",
          value: "img/TB1Tv0GOpXXXXX7XXXXXXXXXXXX-102-102.png"
        }, {
          name: "department",
          value: "img/TB1E2NEOpXXXXaHXXXXXXXXXXXX-102-102.png"
        }, {
          name: "conference",
          value: "img/TB19xFfOpXXXXbBXVXXXXXXXXXX-102-102.png"
        }, {
          name: "gas",
          value: "img/TB13G0EOpXXXXbuXXXXXXXXXXXX-102-102.png"
        }, {
          name: "salary",
          value: "img/TB1QWA7OXXXXXb9aXXXXXXXXXXX-102-102.png"
        }, {
          name: "discount",
          value: "img/TB1_Lw6OXXXXXcCaXXXXXXXXXXX-102-102.png"
        }, {
          name: "pay",
          value: "img/TB1L8xjOpXXXXbYXFXXXXXXXXXX-102-102.png"
        }, {
          name: "contract",
          value: "img/TB1MLxpOpXXXXbeXFXXXXXXXXXX-102-102.png"
        }, {
          name: "collection",
          value: "img/TB1XQdaOpXXXXbwaXXXXXXXXXXX-102-102.png"
        }, {
          name: "cashier",
          value: "img/TB1z4I6OXXXXXX3apXXXXXXXXXX-102-102.png"
        }, {
          name: "departure",
          value: "img/TB19RptOpXXXXXQXFXXXXXXXXXX-102-102.png"
        }, {
          name: "courier",
          value: "img/TB1k6Z0OXXXXXcyapXXXXXXXXXX-102-102.png"
        }, {
          name: "procurement",
          value: "img/TB14X4tOpXXXXX2XFXXXXXXXXXX-102-102.png"
        }, {
          name: "attendance_supplementary",
          value: "img/TB13Rg5OXXXXXcgaXXXXXXXXXXX-102-102.png"
        }, {
          name: "positive",
          value: "img/TB1Rp0eOpXXXXayaXXXXXXXXXXX-102-102.png"
        }, {
          name: "work_instructions",
          value: "img/TB1eMBJOpXXXXXAXXXXXXXXXXXX-102-102.png"
        }, {
          name: "repeat_order",
          value: "img/TB1GxBnOpXXXXcbXFXXXXXXXXXX-102-102.png"
        }, {
          name: "follow",
          value: "img/TB1fJo3OXXXXXa8apXXXXXXXXXX-102-102.png"
        }, {
          name: "general_log",
          value: "img/TB1E9BoOpXXXXcHXFXXXXXXXXXX-102-102.png"
        }, {
          name: "business",
          value: "img/TB13336OXXXXXcGapXXXXXXXXXX-102-102.png"
        }
      ],
      remark: '',

    }
  },
  methods: {
    changeClick () {
      this.$emit('update:auditradio', this.auditradio)
    },
    selectIcon: function (e) {
      this.selected = e.currentTarget.getAttribute('data-index')
      let obj = {
        icon: this.icons[this.selected].value,
        index: parseInt(this.selected)
      }
      console.log(obj)
      this.firstval.icon = obj
      this.$emit("update:firstval", this.firstval)

    },
    additemShow () {
      this.is_additem = !this.is_additem
    },
    addItem () {
      console.log('addItem');
      this.items.push({ name: this.addselect, val: this.addselect });
      console.log(this.items)
    },
    departSub (val) {
      console.log(val)
      this.departlist = val
      this.ruleForm.departid = val
      this.firstval.synergylist = val
      for (let i in val) {
        delete this.departlist[i].Children
        delete this.departlist[i].ParentId
      }
      this.$emit("update:firstval", this.firstval)
    },
    departClick () {
      this.is_depart = !this.is_depart
      console.log(this.is_depart)
    },
    departBack (val) {
      console.log('sdfsdf')
      this.is_depart = val
    },
    departASub (val) {
      console.log(val)
      this.departlist_a = val
      for (let i in val) {
        delete this.departlist_a[i].Children
        delete this.departlist_a[i].ParentId
      }
      this.firstval.departlist = val
      this.$emit("update:firstval", this.firstval)
      console.log(this.firstval)
      // this.ruleForm.departid = val
    },
    departAClick () {
      this.is_depart_a = !this.is_depart_a
      console.log(this.is_depart_a)
    },
    departABack (val) {
      this.is_depart_a = val
    },
    departPSub (val) {
      console.log(val)
      this.departlist_p = val
      for (let i in val) {
        delete this.departlist_p[i].Children
        delete this.departlist_p[i].ParentId
      }
      this.firstval.publiclist = val
      this.$emit("update:firstval", this.firstval)
      console.log(this.firstval)
      // this.ruleForm.departid = val
    },
    departPClick () {
      this.is_depart_p = !this.is_depart_p
      console.log(this.is_depart_a)
    },
    departPBack (val) {
      this.is_depart_p = val
    },

    getallbytype (num, val) {
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
        this.items = data.data
        if (num == 1) {
          if (this.items.length > 0) {
            this.firstVal.type_id = data.data[0].Id
          } else {
            this.firstVal.type_id = ''
          }
        } else {
          this.firstval.type_id = val
        }


      }).catch(err => {
        console.log(err)
      })
    },
    addone () {
      let $this = this
      if (this.addselect == '') {
        this.$alert('请填写分类名！', '提示', {
          confirmButtonText: '确定',

        });
        return false
      }
      let payload = {
        type_desc: '任务类型',
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        content: this.addselect
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['addone'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        this.addselect = ''

        this.additemShow()
        $this.getallbytype(2, data.data)

      }).catch(err => {
        console.log(err)
      })
    },
  },
  mounted () {
    this.getallbytype(1)
  },
  watch: {
    firstval (val) {
      console.log(val)
      this.selected = val.icon.index
    }
  }
}
</script>
<style lang="less">
.el-range-editor--small.el-input__inner {
  width: 100% !important;
}

.first_icon {
  height: 300px;
  overflow: auto;
  background: @bg;
  .el-range-editor--small.el-input__inner {
    width: 100% !important;
  }
  .iconitem {
    width: 50px;
    height: 50px;
    display: block;
    float: left;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid transparent;
    overflow: hidden;
    position: relative;
    img {
      max-width: 100%;
      max-height: 100%;
      padding: 10px;
      background: #fff;
      border-radius: 30%;
    }
    .icon {
      position: absolute;
      display: block;
      border-radius: 50%;
      bottom: 1px;
      right: 1px;
      color: #fff;
      padding: 3px 2px 2px 3px;
      font-size: 14px;
      background: #3f9af9;
    }
  }
}
.first_setting {
  .fieldinfo {
    color: #ccc;
    font-size: 13px !important;
    margin-left: 8px;
    font-weight: normal;
    // opacity: 0.9;
  }
  .departid_div {
    // margin-left: 100px;
    width: 100%;
    min-height: 32px;
    border: @border;
    border-radius: 5px;
    cursor: pointer;
  }
  .departid_div:hover {
    border: 1px solid #c0c4cc;
  }
  .departid_span:first-of-type {
    margin-left: 5px;
  }
  .departid_span {
    display: inline-block;
    border: @border;
    padding: 4px 15px;
    border-radius: 4px;
    margin-right: 5px;
    line-height: 14px;
    font-size: 12px;
  }
  .icon-select-item {
    width: 50px;
    height: 50px;
    display: block;
    margin: 5px;
    float: left;
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid transparent;
    overflow: hidden;
    position: relative;
    img {
      max-width: 40px;
      max-height: 40px;
      margin: 5px;
      background: #fff;
      border-radius: 5px;
    }
    .icon_first_setting_o {
      // display: block;
      background: @white;
      position: absolute;
      top: 0px;
      // margin-top: -5px;
      right: 0;
      padding: 1px;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      .icon_first_setting {
        background: @white;
        position: absolute;
        z-index: 20;
        background: #ff5d56;
        color: @white;
        border-radius: 50%;
        padding: 1px;
      }
    }
  }
  .footer {
    text-align: right;
    // margin-bottom: 20px;
    padding-bottom: 20px;
  }
}
</style>