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
          <!-- <a class="add-node-popover-item notifier" @click="addType(4)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>条件</p>
          </a> -->
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

        console.log(data)
        this.$emit("update:childNodeP", data)
      }
      else {
        this.$emit("update:childNodeP", {
          "nodeName": "路由",
          "type": 4,
          "childNode": null,
          "conditionNodes": [{
            "nodeName": "标签1",
            // "error": true,
            "type": 3,
            "priorityLevel": 1,
            "conditionList": [],
            "nodeUserList": [],
            "childNode": this.childNodeP,
          }, {
            "nodeName": "标签2",
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