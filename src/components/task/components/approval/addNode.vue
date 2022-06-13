<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <el-popover placement="right-start" v-model="visible">
        <div class="add-node-popover-body">
          <a class="add-node-popover-item approver" @click="addType(1)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>审批人</p>
          </a>
          <!-- <a class="add-node-popover-item notifier" @click="addType(2)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>抄送人</p>
          </a> -->
          <a class="add-node-popover-item condition" @click="addType(4)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>条件分支</p>
          </a>
        </div>
        <button class="btn" type="button" slot="reference">
          <span class="iconfont"></span>
        </button>
      </el-popover>
    </div>
  </div>
</template>
<script>
export default {
  props: ["childNodeP"],
  data () {
    return {
      visible: false
    }
  },
  methods: {
    addType (type) {
      this.visible = false;
      console.log('------------------')
      if (type != 4) {
        var data;
        if (type == 1) {
          data = {
            "nodeName": "审核人",
            "error": true,
            "type": 1,

            "childNode": this.childNodeP,
            "nodeUserList": []
          }
        } else if (type == 2) {
          data = {
            "nodeName": "抄送人",
            "type": 2,
            "ccSelfSelectFlag": 1,
            "childNode": this.childNodeP,
            "nodeUserList": []
          }
        }
        this.$emit("update:childNodeP", data)
      } else {
        this.$emit("update:childNodeP", {
          "nodeName": "路由",
          "type": 4,
          "childNode": null,
          "conditionNodes": [{
            "nodeName": "条件1",
            "error": true,
            "type": 3,
            "priorityLevel": 1,
            "conditionList": [],
            "nodeUserList": [],
            "childNode": this.childNodeP,
          }, {
            "nodeName": "条件2",
            "type": 3,
            "priorityLevel": 2,
            "conditionList": [],
            "nodeUserList": [],
            "childNode": null
          }]
        })
      }
    }
  }
}
</script>
<style lang="less">
// @import "../../../../assets/less/workflow_1.less";
@font-face {
  font-family: IconFont;
  src: url("//at.alicdn.com/t/font_135284_ph2thxxbzgf.eot");
  src: url("//at.alicdn.com/t/font_135284_ph2thxxbzgf.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_135284_ph2thxxbzgf.woff") format("woff"),
    url("//at.alicdn.com/t/font_135284_ph2thxxbzgf.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_135284_ph2thxxbzgf.svg#IconFont") format("svg");
}

.iconfont {
  font-family: IconFont !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
.add-node-popover-item.approver .item-wrapper {
  color: #ff943e;
}

.add-node-popover-item.notifier .item-wrapper {
  color: #3296fa;
}
.add-node-popover-item.condition .item-wrapper {
  color: #15bc83;
}
.add-node-popover-item:hover .item-wrapper {
  background: #3296fa;
  box-shadow: 0 10px 20px 0 rgba(50, 150, 250, 0.4);
}

.add-node-popover-item:hover .iconfont {
  color: #fff;
}

.add-node-popover-item:active .item-wrapper {
  box-shadow: none;
  background: #eaeaea;
}

.add-node-popover-item:active .iconfont {
  color: inherit;
}
.add-node-popover-body {
  display: flex;
}

.add-node-popover-item {
  margin-right: 10px;
  cursor: pointer;
  text-align: center;
  flex: 1;
  color: #191f25 !important;
}

.add-node-popover-item .item-wrapper {
  user-select: none;
  display: inline-block;
  width: 80px;
  height: 80px;
  margin-bottom: 5px;
  background: #fff;
  border: 1px solid #e2e2e2;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.add-node-popover-item .iconfont {
  font-size: 35px;
  line-height: 80px;
}
</style>