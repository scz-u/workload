<template>
  <div class="three_setting">
    <!-- <div class="fd-nav">
      <div class="fd-nav-left">
        <div class="fd-nav-back" @click="toReturn">
          <i class="anticon anticon-left"></i>
        </div>
        <div class="fd-nav-title">{{ workFlowDef.name }}123</div>
      </div>

      <div class="fd-nav-right">
        <button type="button" class="ant-btn button-preview">
          <span>预 览</span>
        </button>
        <button type="button" class="ant-btn button-publish" @click="saveSet">
          <span>发 布</span>
        </button>
      </div>
    </div> -->
    <div class="fd-nav-content">
      <section class="dingflow-design">
        <div class="zoom">
          <div
            :class="'zoom-out' + (nowVal == 50 ? ' disabled' : '')"
            @click="zoomSize(1)"
          ></div>
          <span>{{ nowVal }}%</span>
          <div
            :class="'zoom-in' + (nowVal == 300 ? ' disabled' : '')"
            @click="zoomSize(2)"
          ></div>
        </div>
        <div
          class="box-scale"
          id="box-scale"
          :style="
            'transform: scale(' +
            nowVal / 100 +
            '); transform-origin: 50% 0px 0px;'
          "
        >
          <nodeWrapM
            :nodeConfig.sync="nodeConfig"
            :flowPermission.sync="flowPermission"
            :isTried.sync="isTried"
            :directorMaxLevel="directorMaxLevel"
            :tableId="tableId"
            :departlist_look.sync="sumval.firstval.departlist"
            :alldepart="alldepart"
          ></nodeWrapM>
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <!-- <el-dialog  :append-to-body="true" title="提示" :visible.sync="tipVisible">
      <div class="ant-confirm-body">
        <i class="anticon anticon-close-circle" style="color: #f00;"></i>
        <span class="ant-confirm-title">当前无法发布</span>
        <div class="ant-confirm-content">
          <div>
            <p class="error-modal-desc">以下内容不完善，需进行修改</p>
            <div class="error-modal-list">
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
        <el-button @click="tipVisible = false">我知道了</el-button>
        <el-button type="primary" @click="tipVisible = false"
          >前往修改</el-button
        >
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'three_setting',
  props: {
    sumval: Object,
    departlist_str: String,
    mycode: String,
    worktype: Number,
    show_click: Number,
  },
  data () {
    return {
      alldepart: [],
      isTried: true,
      tipList: [],
      tipVisible: false,
      nowVal: 100,
      processConfig: {},
      nodeConfig: {},
      // workFlowDef: {},
      flowPermission: [],
      directorMaxLevel: 0,
      dialogVisible: true,
      tableId: "",
      node: {
        "nodeName": "部门1",
        "type": 3,
        "priorityLevel": 1,

        "conditionList": [
          {
            "columnId": 0,
            "type": 1,
          }
        ],
        "nodeUserList": [],
        "childNode": {
          "nodeName": "路由",
          "type": 4,
          "priorityLevel": 1,

          "conditionList": [],
          "nodeUserList": [],
          "conditionNodes": [
            {
              "nodeName": "标签1(可改)",
              "type": 3,
              "priorityLevel": 1,

              "conditionList": [
                {
                  "columnId": 0,
                  "type": 1,

                }
              ],
              "nodeUserList": [{ targetId: 0, type: 0 }],
              "childNode": {
                "nodeName": "审核人",
                "type": 1,
                "priorityLevel": 1,

                "conditionList": [],
                "nodeUserList": [],
                "childNode": null,
                "conditionNodes": [],
                "error": true
              },
              "conditionNodes": [],
              "error": false
            },
            {
              "nodeName": "标签2(可改)",
              "type": 3,
              "priorityLevel": 2,

              "conditionList": [],
              "nodeUserList": [],
              "childNode": {
                "nodeName": "审核人",
                "type": 1,
                "priorityLevel": 1,

                "conditionList": [],
                "nodeUserList": [],
                "childNode": null,
                "conditionNodes": [],
                "error": true
              },
              "conditionNodes": [],
              "error": false
            }
          ]
        },
        "conditionNodes": [],
        "error": false
      },
    };
  },
  watch: {
    departlist_str (val) {
      console.log(val)
      console.log('bbbbbbbb')
      let nodelist = []
      let departlist = []
      let conditionlist = []
      let num = 0
      if (this.sumval.firstval.departlist != undefined) {
        for (let i in this.sumval.firstval.departlist) {

          nodelist.push({
            type: this.sumval.firstval.departlist[i].IsDepart == true ? 3 : 1,
            targetId: this.sumval.firstval.departlist[i].IsDepart == true ? parseInt(this.sumval.firstval.departlist[i].id) : this.sumval.firstval.departlist[i].id,
            // is_depart: this.sumval.firstval.departlist[i].IsDepart
            name: this.sumval.firstval.departlist[i].depart_id,
            department: this.sumval.firstval.departlist[i].Department
          })
          departlist.push({
            id: this.sumval.firstval.departlist[i].id,
            IsDepart: this.sumval.firstval.departlist[i].IsDepart,
            type: 3,
            depart_id: this.sumval.firstval.departlist[i].depart_id,
            Department: this.sumval.firstval.departlist[i].Department
          })
          console.log(i)
          if (this.sumval.firstval.departlist[i].IsDepart) {
            num = num + 1
            let node = JSON.parse(JSON.stringify(this.node))
            console.log(num)
            node.nodeName = this.sumval.firstval.departlist[i].Department
            node.nodeUserList = [{
              type: this.sumval.firstval.departlist[i].IsDepart == true ? 3 : 1,
              targetId: this.sumval.firstval.departlist[i].IsDepart == true ? parseInt(this.sumval.firstval.departlist[i].id) : this.sumval.firstval.departlist[i].id,
              // is_depart: this.sumval.firstval.departlist[i].IsDepart
              name: this.sumval.firstval.departlist[i].depart_id,
              department: this.sumval.firstval.departlist[i].Department
            }]
            conditionlist.push(node)
          }
        }
      }
      this.sumval.threeval.nodeConfig.childNode.conditionNodes = conditionlist
      this.nodeConfig = this.sumval.threeval.nodeConfig;
      this.nodeConfig.nodeUserList = nodelist
      this.sumval.threeval.flowPermission = nodelist
      this.flowPermission = this.sumval.threeval.flowPermission;
      this.$emit('update:sumval', this.sumval)
    },

  },
  mounted () {
    this.getalldepartmenttree()
    if (this.mycode != '123') {
      console.log(this.sumval)

      if (this.worktype == 3 && this.show_click == 2) {

        let nodelist = []
        let departlist = []
        let conditionlist = []
        if (this.sumval.firstval.departlist != undefined) {
          for (let i in this.sumval.firstval.departlist) {

            nodelist.push({

              "targetId": this.sumval.firstval.departlist[i].IsDepart == true ? parseInt(this.sumval.firstval.departlist[i].id) : this.sumval.firstval.departlist[i].id,
              "type": this.sumval.firstval.departlist[i].IsDepart == true ? 3 : 1,
              name: parseInt(this.sumval.firstval.departlist[i].id),
              department: this.sumval.firstval.departlist[i].Department
              // is_depart: this.sumval.firstval.departlist[i].IsDepart
            })
            departlist.push({
              id: this.sumval.firstval.departlist[i].id,
              IsDepart: this.sumval.firstval.departlist[i].IsDepart,
              type: 3,
              depart_id: this.sumval.firstval.departlist[i].depart_id,
              Department: this.sumval.firstval.departlist[i].Department
            })
            console.log(JSON.stringify(nodelist))

            let string = '"targetId":' + this.sumval.firstval.departlist[i].id
            console.log(string)
            console.log(this.sumval.threeval.nodeConfig.UserList)
            // let nn = this.sumval.threeval.nodeConfig.UserList.indexOf(string)

            console.log(JSON.stringify(nodelist))
            console.log(this.sumval.threeval.nodeConfig.UserList)
            console.log(this.sumval.threeval.nodeConfig.UserList == JSON.stringify(nodelist))
          }
          // if (JSON.stringify(nodelist).indexOf(this.sumval.threeval.nodeConfig.UserList) != -1) {
          //   for (let i in this.sumval.firstval.departlist) {

          //     nodelist.push({

          //       "targetId": this.sumval.firstval.departlist[i].IsDepart == true ? parseInt(this.sumval.firstval.departlist[i].id) : this.sumval.firstval.departlist[i].id,
          //       "type": this.sumval.firstval.departlist[i].IsDepart == true ? 3 : 1,
          //       // is_depart: this.sumval.firstval.departlist[i].IsDepart
          //     })
          //     departlist.push({
          //       id: this.sumval.firstval.departlist[i].id,
          //       IsDepart: this.sumval.firstval.departlist[i].IsDepart,
          //       type: 3,
          //       depart_id: this.sumval.firstval.departlist[i].depart_id
          //     })
          //     console.log(JSON.stringify(nodelist))

          //     let string = '"targetId":' + this.sumval.firstval.departlist[i].id
          //     console.log(string)
          //     console.log(this.sumval.threeval.nodeConfig.UserList)
          //     let nn = this.sumval.threeval.nodeConfig.UserList.indexOf(string)
          //     console.log(nn)
          //     if (this.sumval.firstval.departlist[i].IsDepart && nn == -1) {
          //       let num = parseInt(i) + 1
          //       let node = JSON.parse(JSON.stringify(this.node))
          //       console.log(num)
          //       node.nodeName = "部门" + num
          //       node.nodeUserList = [{
          //         type: this.sumval.firstval.departlist[i].IsDepart == true ? 3 : 1,
          //         targetId: this.sumval.firstval.departlist[i].IsDepart == true ? parseInt(this.sumval.firstval.departlist[i].id) : this.sumval.firstval.departlist[i].id,
          //         // is_depart: this.sumval.firstval.departlist[i].IsDepart
          //         name: this.sumval.firstval.departlist[i].depart_id
          //       }]
          //       conditionlist.push(node)
          //       this.sumval.threeval.nodeConfig.childNode.conditionNodes.push(node)
          //     }
          //   }
          // }
          // else {
          //   for (let i in this.sumval.firstval.departlist) {

          //     nodelist.push({

          //       "targetId": this.sumval.firstval.departlist[i].IsDepart == true ? parseInt(this.sumval.firstval.departlist[i].id) : this.sumval.firstval.departlist[i].id,
          //       "type": this.sumval.firstval.departlist[i].IsDepart == true ? 3 : 1,
          //       // is_depart: this.sumval.firstval.departlist[i].IsDepart
          //     })
          //     let string = '"targetId":' + this.sumval.firstval.departlist[i].id
          //     console.log(string)
          //     console.log(this.sumval.threeval.nodeConfig.UserList)
          //     let nn = this.sumval.threeval.nodeConfig.UserList.indexOf(string)
          //     console.log(nn)
          //     if (this.sumval.firstval.departlist[i].IsDepart) {
          //       let num = parseInt(i) + 1
          //       let node = JSON.parse(JSON.stringify(this.node))
          //       console.log(num)
          //       node.nodeName = "部门" + num
          //       node.nodeUserList = [{
          //         type: this.sumval.firstval.departlist[i].IsDepart == true ? 3 : 1,
          //         targetId: this.sumval.firstval.departlist[i].IsDepart == true ? parseInt(this.sumval.firstval.departlist[i].id) : this.sumval.firstval.departlist[i].id,
          //         // is_depart: this.sumval.firstval.departlist[i].IsDepart
          //         name: this.sumval.firstval.departlist[i].depart_id
          //       }]
          //       conditionlist.push(node)

          //     }
          //   }
          //   this.sumval.threeval.nodeConfig.childNode.conditionNodes = conditionlist
          // }
        }
        // this.sumval.threeval.nodeConfig.childNode.conditionNodes = conditionlist
        console.log(this.sumval.threeval)
        this.nodeConfig = this.sumval.threeval.nodeConfig
        this.nodeConfig.nodeUserList = nodelist
        this.flowPermission = nodelist

      } else {
        this.axiosMethod()
      }
    } else {
      this.axiosMethod()
    }

  },
  methods: {
    axiosMethod () {
      let weburl = this.$store.state.weburl
      axios.get(weburl + "/condition.json", {
        workFlowDefId: this.$route.params.workFlowDefId
      }).then(res => {
        console.log(res)
        this.processConfig = res.data.data;
        console.log(this.processConfig)
        let nodelist = []
        let departlist = []
        let conditionlist = []
        if (this.sumval.firstval.departlist != undefined) {
          for (let i in this.sumval.firstval.departlist) {

            nodelist.push({
              type: this.sumval.firstval.departlist[i].IsDepart == true ? 3 : 1,
              targetId: this.sumval.firstval.departlist[i].IsDepart == true ? parseInt(this.sumval.firstval.departlist[i].id) : this.sumval.firstval.departlist[i].id,
              // is_depart: this.sumval.firstval.departlist[i].IsDepart
              name: this.sumval.firstval.departlist[i].depart_id,
              department: this.sumval.firstval.departlist[i].Department
            })
            departlist.push({
              id: this.sumval.firstval.departlist[i].id,
              IsDepart: this.sumval.firstval.departlist[i].IsDepart,
              type: 3,
              depart_id: this.sumval.firstval.departlist[i].depart_id,
              Department: this.sumval.firstval.departlist[i].Department
            })
            console.log(i)
            if (this.sumval.firstval.departlist[i].IsDepart) {
              let num = parseInt(i) + 1
              let node = JSON.parse(JSON.stringify(this.node))
              console.log(num)
              node.nodeName = this.sumval.firstval.departlist[i].Department
              node.nodeUserList = [{
                type: this.sumval.firstval.departlist[i].IsDepart == true ? 3 : 1,
                targetId: this.sumval.firstval.departlist[i].IsDepart == true ? parseInt(this.sumval.firstval.departlist[i].id) : this.sumval.firstval.departlist[i].id,
                // is_depart: this.sumval.firstval.departlist[i].IsDepart
                name: this.sumval.firstval.departlist[i].depart_id,
                department: this.sumval.firstval.departlist[i].Department
              }]
              conditionlist.push(node)
            }
          }
          console.log(this.processConfig.nodeConfig.childNode.conditionNodes)
          this.processConfig.nodeConfig.childNode.conditionNodes = conditionlist
          this.departlist = departlist
          this.nodeConfig = this.processConfig.nodeConfig;
          this.nodeConfig.nodeUserList = nodelist
          this.processConfig.flowPermission = nodelist
          this.flowPermission = this.processConfig.flowPermission;
          this.directorMaxLevel = this.processConfig.directorMaxLevel;
          // this.workFlowDef = this.processConfig.workFlowDef
          this.tableId = this.processConfig.tableId
          this.sumval.threeval = this.processConfig
          this.$emit('update:sumval', this.sumval)
        } else {
          console.log('9999999999999999999')
          this.$alert('请先在基础设置中设置填报对象！', '提示', {
            confirmButtonText: '确定',
          });
          this.sumval.threeval = {}
          this.$emit('update:sumval', this.sumval)
          return false;

        }

      })
    },
    getalldepartmenttree () {
      let $this = this
      let corpid = this.$store.state.corpid
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getalluserinfotree'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        // console.log(data)
        $this.loading = false
        $this.alldepart = data.data
      }).catch(err => {
        console.log(err)
      })
    },
    toReturn () {
      //window.location.href = ""
    },
    reErr (data) {
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
    },
    saveSet () {
      this.isTried = true;
      this.tipList = [];
      this.reErr(this.nodeConfig);
      if (this.tipList.length != 0) {
        this.tipVisible = true;
        return;
      }
      this.processConfig.flowPermission = this.flowPermission
      console.log(JSON.stringify(this.processConfig))
      console.log(this.processConfig)
      // this.$axios.post("", this.processConfig).then(res => {
      //     if (res.code == 200) {
      //         this.$message.success("设置成功");
      //         setTimeout(function () {
      //             window.location.href = ""
      //         }, 200)
      //     }
      // })
    },
    zoomSize (type) {
      if (type == 1) {
        if (this.nowVal == 50) {
          return;
        }
        this.nowVal -= 10;
      } else {
        if (this.nowVal == 300) {
          return;
        }
        this.nowVal += 10;
      }
    }
  }

}
</script>
<style lang="less" >
@import "../../../../assets/less/workflow_2.css";
@import "../../../../assets/less/workflow_1.less";

// @import "../../../../assets/less/workflow_2.css";
.three_setting {
  // @import "../../../assets/less/workflow.css";
  .error-modal-list {
    width: 455px;
  }
}
</style>