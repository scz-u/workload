<template>
  <div class="depart_alert_mobile_x" v-if="my_is_add">
    <!-- <div class="member_container"> -->
    <div class="treelist">
      <ElementTree
        :getdata="alldepart"
        :departlist="my_select_id_list"
        :exend="exend"
        :is_colse="is_colse"
        @getTreelist="getTreelist"
      ></ElementTree>
    </div>
    <!-- <div class="left member_colRight">
        <ul>
          <li
            class="step_right_li"
            v-for="(item, index) in my_selectlist"
            :key="index"
          >
            <span class=""
              ><GetTreeNameM
                :openid="item.id"
                :isdepart="item.IsDepart"
              ></GetTreeNameM
              >{{ item.id }}</span
            >
            <i class="el-icon-close del_select " @click="delClick(index)"></i>
            <div class="clearfix"></div>
          </li>
        </ul>
      </div> -->
    <div class="clearfix"></div>
    <div class="footer">
      <div class="footer_step">
        <div
          class="step_right_li"
          v-for="(item, index) in my_selectlist"
          :key="index"
        >
          <span class=""
            ><GetTreeNameM
              :openid="item.id"
              :isdepart="item.IsDepart"
            ></GetTreeNameM
          ></span>
          <!-- <i class="el-icon-close del_select " @click="delClick(index)"></i> -->
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="footer_btn">
        <cube-button :outline="true" :inline="true" @click="close()"
          >返回</cube-button
        >
        <cube-button :primary="true" :inline="true" @click="departSub()"
          >确认</cube-button
        >
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
  <script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>
<script>
import ElementTree from './elementTreeM'
import GetTreeNameM from './getTreeNameM'
export default {
  name: 'depart_alert',
  components: { ElementTree, GetTreeNameM },
  props: {
    is_add: Boolean,
    departlist: Array,
    auditnum: Number,
  },
  data () {
    return {
      alldepart: [],
      my_is_add: false,
      my_selectlist: [],
      my_select_id_list: [],
      exend: ['1', 1],
      is_colse: false
    }
  },
  methods: {
    departSub () {
      if (this.my_selectlist.length == 0) {

        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '未选择人员！',
          icon: 'cubeic-alert'
        }).show()

        return false;
      }
      console.log(this.my_selectlist)
      this.$emit('departSub', { list: this.my_selectlist })
      this.close()
    },
    delClick (index) {
      this.is_colse = !this.is_colse
      this.$delete(this.my_selectlist, index)
      this.$delete(this.my_select_id_list, index)
      let otherlist = JSON.stringify(this.my_selectlist)
      this.my_selectlist = []
      let $this = this
      setTimeout(function () {
        $this.my_selectlist = JSON.parse(otherlist)
      }, 100)
    },
    close () {
      this.is_colse = !this.is_colse
      this.my_is_add = false
    },
    getTreelist (val) {
      this.my_selectlist = val.label
      this.my_select_id_list = []
      this.exend = ['1', 1]
      for (let i in this.my_selectlist) {
        this.my_select_id_list.push(this.my_selectlist[i].depart_id)
        this.exend.push(this.my_selectlist[i].ParentId)
      }
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

  },
  mounted () {
    this.getalldepartmenttree()
  },
  watch: {
    is_add (val) {
      // console.log(this.is_add)
      // console.log(val)

      // console.log(this.my_is_add)
      if (val) {
        this.is_colse = !this.is_colse
        this.my_is_add = val
        // this.getAgentId()
        console.log(this.departlist)
        if (this.departlist != undefined) {
          this.my_selectlist = JSON.parse(JSON.stringify(this.departlist))
          this.my_select_id_list = []
          this.exend = ['1', 1]

          for (let i in this.my_selectlist) {
            this.my_select_id_list.push(this.my_selectlist[i].depart_id)
            if (this.my_selectlist[i].ParentId != undefined) {
              this.exend.push(this.my_selectlist[i].ParentId)
            }
          }
        } else {
          this.my_selectlist = []
          this.my_select_id_list = []
        }
      }
    },
    my_is_add (val) {
      this.$emit('back', val)
    }
  }
}
</script>
<style lang="less">
.depart_alert_mobile_x {
  // padding: 5px;
  margin-top: 20px;
  .is-leaf + .el-checkbox {
    display: block !important;
  }

  .el-tree {
    background: transparent;
  }
  .el-tree-node__content > .el-checkbox {
    position: absolute;
    right: 10px;
  }
  .el-tree {
    background: transparent;
  }
  .el-tree-node__content > .el-checkbox {
    position: absolute;
    right: 10px;
  }

  .treelist {
    background: @white;
    padding: 10px;
  }
  .treelist {
    margin-bottom: 102px;
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    // text-align: right;
    padding-top: 10px;
    padding-bottom: 5px;
    background: @white;
    .footer_step {
      width: 94%;
      height: 35px;
      margin-left: 3%;
      // padding: 5px 3%;
      border: @border;
      border-radius: 5px;
      // margin: px auto;
    }
    .step_right_li {
      border: @border;
      display: inline-block;
      // line-height: 25px;
      font-size: 14px;
      border-radius: 5px;
      padding: 3px 5px;
      margin: 3px;
      span {
        // width: 250px;
      }
    }

    // margin-top: 20px;
    .footer_btn {
      text-align: center;
      margin-top: 10px;
      .cube-btn-inline {
        padding: 8px 20px;
        font-size: 16px;
        margin-right: 15px;
      }
    }
  }
}
</style>