<template>
  <div class="setting_model">
    <div class="title">
      <el-row>
        <el-col :span="4">
          <div>
            <div class="fd-nav-back" @click="backClick()">
              <i class="el-icon-arrow-left"></i>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <div style="margin: auto; width: 600px">
            <div class="fd-nav-container">
              <div
                class="ghost-bar"
                :style="{ transform: 'translateX(' + transval + 'px)' }"
              ></div>
              <div
                class="fd-nav-item"
                @click="navHover(1)"
                :class="{ active: active == 1 }"
              >
                <span class="order-num">1</span>基础信息
              </div>
              <div
                class="fd-nav-item"
                @click="navHover(2)"
                :class="{ active: active == 2 }"
              >
                <span class="order-num">2</span>表单选择
              </div>
              <div
                class="fd-nav-item"
                v-if="this.auditradio != 2"
                @click="navHover(3)"
                :class="{ active: active == 3 }"
              >
                <span class="order-num">3</span>流程设计
              </div>
              <!-- <div
                class="fd-nav-item"
                @click="navHover(4)"
                :class="{ active: active == 4 }"
              >
                <span class="order-num">4</span>高级设置
              </div> -->
            </div>
          </div>
        </el-col>
        <el-col :span="4" style="line-height: 60px">
          <el-button size="small" @click="saveSet(1)">保存并返回</el-button>
          <!-- <el-button size="small" @click="saveEditorClick()" v-else
            >保存并返回</el-button
          > -->
        </el-col>
      </el-row>
    </div>

    <div class="clearfix"></div>
    <div class="middle">
      <FirstSetting
        v-show="active == 1"
        :firstval.sync="val.firstval"
        :auditradio.sync="auditradio"
      ></FirstSetting>
      <SecondSetting
        v-show="active == 2"
        :sumval.sync="val"
        :selectdepart.sync="selectdepart"
        :key.sync="key"
        :mycode="mycode"
      ></SecondSetting>
      <ThreeSetting
        v-show="active == 3"
        :sumval.sync="val"
        :departlist="JSON.stringify(val.firstval.departlist)"
        :key.sync="key"
        :mycode="mycode"
      ></ThreeSetting>
    </div>
    <el-dialog
      :append-to-body="true"
      title="提示"
      :visible.sync="tipVisible"
      width="700px"
      :close-on-click-modal="false"
    >
      <div class="ant-confirm-body">
        <i class="anticon anticon-close-circle" style="color: #f00"></i>
        <span class="ant-confirm-title">当前无法发布</span>
        <div class="ant-confirm-content">
          <div>
            <p class="error-modal-desc">以下内容不完善，需进行修改</p>
            <div class="error-modal-list">
              <div
                class="error-modal-item"
                v-for="(item, index) in tipOneList"
                :key="index"
              >
                <div class="error-modal-item-label">基础信息</div>
                <div class="error-modal-item-content">
                  {{ item.type }}
                </div>
              </div>
              <div class="error-modal-item" v-if="val.secondval.length == 0">
                <div class="error-modal-item-label">表单选择</div>
                <div class="error-modal-item-content">未添加表单</div>
              </div>
              <div
                class="error-modal-item"
                v-for="(item, index) in tipList"
                :key="index"
              >
                <div class="error-modal-item-label">流程设计</div>
                <div class="error-modal-item-content">
                  {{ item.name }} 未选择{{ item.type }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="tipVisible = false">我知道了</el-button> -->
        <el-button type="primary" @click="tipVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import FirstSetting from './components/firstSetting'
import SecondSetting from './components/secondSetting'
import ThreeSetting from './components/threeSetting'
import { afterEncrypt } from '@/utils/encryption';

export default {
  name: 'design_model',
  components: { FirstSetting, SecondSetting, ThreeSetting },
  data () {
    return {
      mycode: undefined,
      select_departlist: [],
      key: 0,
      transval: 0,
      active: 1,
      firstval: {},
      auditradio: 1,
      val: {
        firstval: { name: '', departlist: [], synergylist: [], icon: { icon: 'img/icon1.png', index: 0 }, remark: '', dateval: [], type_id: '' },
        threeval: {},
        secondval: [],
      },
      tipList: [],
      tipOneList: [],
      tipVisible: false,
      selectdepart: [],
    }
  },
  methods: {
    saveEditorClick () {
      this.$confirm('已编辑, 是否保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveSet(2)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    save () {
      console.log(this.val)
    },
    reErr (data) {
      console.log(data)
      if (data == undefined) {
        this.tipList.push({ name: '', })
      } else {
        if (data.childNode) {
          if (data.childNode.type == 1) {//审批人
            if (data.childNode.error) {
              this.tipList.push({ name: data.childNode.nodeName, type: "审核人" })
            }
            this.reErr(data.childNode)
          } else if (data.childNode.type == 2) {
            if (data.childNode.error) {
              this.tipList.push({ name: data.childNode.nodeName, type: "抄送人" })
            }
            this.reErr(data.childNode)
          } else if (data.childNode.type == 3) {
            this.reErr(data.childNode.childNode)
          } else if (data.childNode.type == 4) {
            this.reErr(data.childNode)
            for (var i = 0; i < data.childNode.conditionNodes.length; i++) {
              if (data.childNode.conditionNodes[i].error) {
                this.tipList.push({ name: data.childNode.conditionNodes[i].nodeName, type: "条件" })
              }
              this.reErr(data.childNode.conditionNodes[i])
            }
          }
        } else {
          data.childNode = null
        }
      }

    },
    firstErr (data) {
      console.log('sdfsdf')
      if (data.name == '') {
        this.tipOneList.push({ type: '未填写任务名称' })
      }
      if (data.departlist.length == 0) {
        this.tipOneList.push({ type: '未选择填报对象' })
      }
      // if (data.synergylist.length == 0) {
      //   this.tipOneList.push({ type: '未选择可见范围1' })
      // }
      if (data.dateval.length == 0) {
        this.tipOneList.push({ type: '未选择时间' })
      } if (data.type_id == '') {
        this.tipOneList.push({ type: '未选择分类' })
      }
      console.log(data)
      console.log(this.tipOneList)
    },
    secondGet () {
      this.select_departlist = []
      for (let i in this.selectdepart) {
        this.gettemplateformdetail(this.selectdepart[i].Code)
        // console.log(val)
      }
      console.log(this.select_departlist.length)
    },
    saveSet (num) {
      // this.isTried = true;
      this.tipList = [];
      this.tipOneList = []
      // this.secondGet()
      this.firstErr(this.val.firstval)
      let $this = this

      let base_info = JSON.parse(JSON.stringify(this.val.secondval))
      // if (num == 1) {
      for (let i in base_info) {
        // console.log()
        if (base_info[i].other_type == 'new') {
          base_info[i].form_code = ''
        }
      }
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        base_info: JSON.stringify(this.val.firstval),
        form_info: JSON.stringify(base_info),
      }
      // if (num == 2) {
      //   payload['code'] = afterEncrypt(this.mycode)
      // }

      if (this.auditradio == 1) {

        this.reErr(this.val.threeval.nodeConfig);
        if (this.val.threeval.nodeConfig.childNode == null && this.tipList.length == 0) {

          this.tipList.push({ name: '审核人', type: "审核人" })
          // return false
        }
        if (this.tipList.length != 0 || this.tipOneList.length != 0 || this.val.secondval.length == 0) {
          this.tipVisible = true;
          return;
        }
        payload['workflow_info'] = JSON.stringify(this.val.threeval)
      } else {
        if (this.tipOneList.length != 0 || this.val.secondval.length == 0) {
          this.tipVisible = true;
          return;
        }
      }
      console.log(payload)

      // return false
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['createoneworkflow'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        if (num == '2') {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
        } else {
          this.$message({
            message: '发布成功！',
            type: 'success'
          });
        }


        $this.$router.push({ name: 'ListTask', query: { k: Date.now() } })

      }).catch(err => {
        console.log(err)
      })

    },
    backClick () {
      this.$confirm('有修改的内容未发布，确认离开吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({ name: 'ListTask', query: { k: Date.now() } })
      })


    },
    navHover (num) {
      this.key += + 1
      console.log(this.key)
      if (num == 3) {
        if (this.auditradio == 2) {
          this.$alert('不可审批，流程设计不可点击！', '提示', {
            confirmButtonText: '确定',
          });
          return false
        }
        if (this.val.firstval.departlist.length == 0) {
          this.$alert('请先选择填报对象！', '提示', {
            confirmButtonText: '确定',
          });
          return false
        }
        this.active = num
        this.transval = (num - 1) * 150
      } else {
        this.active = num
        this.transval = (num - 1) * 150
      }
    },
    gettaskfullinfo (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['gettaskfullinfo'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        data.data.base_info.code = ""
        for (let i in data.data.form_info) {
          data.data.form_info[i].form_code = ''
        }
        this.val = {
          firstval: data.data.base_info,
          threeval: data.data.workflow_info,
          secondval: data.data.form_info,
        }
        this.val.firstval.dateval[0] = this.val.firstval.dateval[0] * 1000
        this.val.firstval.dateval[1] = this.val.firstval.dateval[1] * 1000
        console.log(this.val)
        if (data.data.base_info.workflow_enable) {
          this.auditradio = 1
        } else {
          this.auditradio = 2
        }

      }).catch(err => {
        console.log(err)
      })

    },
    gettemplateformdetail (code) {
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
        console.log(data)
        // this.formData = data.data
        // this.is_form = true
        $this.select_departlist.push(data.data)
        console.log($this.select_departlist)
        // return data.data

      }).catch(err => {
        console.log(err)
      })
    }

  },
  created () {
    let code = this.$route.query.id
    this.mycode = '123'
    // this.getAgentId()
    if (code != undefined) {
      this.gettaskfullinfo(code)
      this.mycode = code
    }
  }
}
</script>
<style lang="less">
.setting_model {
  .title {
    color: #fff;
    background: @color;
  }
  .middle {
    margin-top: 20px;
  }
  .fd-nav-back {
    display: inline-block;
    width: 60px;
    height: 60px;
    font-size: 22px;
    border-right: 1px solid #1583f2;
    text-align: center;
    line-height: 60px;
    cursor: pointer;
  }
  .fd-nav-back:hover {
    background: #5af;
  }
  .fd-nav-container {
    position: relative;
  }
  .ghost-bar {
    position: absolute;
    width: 150px;
    height: 100%;
    left: 0;
    background: #1583f2;
    -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .ghost-bar:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -5px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 5px 6px;
    border-color: transparent transparent #f6f6f6;
  }
  .fd-nav-item.active .order-num {
    color: #1583f2;
    background: #fff;
  }
  .fd-nav-item {
    position: relative;
    cursor: pointer;
    display: inline-block;
    line-height: 60px;
    width: 150px;
    text-align: center;
    white-space: nowrap;
    .order-num {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border: 1px solid #fff;
      border-radius: 50%;
      margin-right: 6px;
      -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
  }
  .error-modal-desc {
    font-size: 13px;
    color: rgba(25, 31, 37, 0.56);
    line-height: 22px;
    margin-bottom: 14px;
  }
  .error-modal-list {
    height: 200px;

    overflow-y: auto;
    // margin-right: -25px;
    padding-right: 25px;
  }
  .error-modal-item {
    padding: 10px 20px;
    line-height: 21px;
    background: #f6f6f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    border-radius: 4px;
  }
}
</style>