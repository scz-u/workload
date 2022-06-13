<template>
  <div class="fill_add">
    <div v-if="!is_add">
      <div class="title">
        <h1>选择表单</h1>
      </div>
      <div class="content_fill">
        <!-- <div class="weui-cells__title">{{ rules[item][0].TypeContent }}</div> -->
        <div class="weui-cells weui-cells_checkbox" style="margin-top: 0;">
          <label
            class="weui-cell weui-check__label"
            :for="option.Code"
            v-for="(option, index) in rules"
            :key="index"
            @click="selected(option)"
          >
            <div class="weui-cell__bd">
              <p>{{ option.Title }}</p>
              <p class="remark_p" v-if="option.Remark != ''">
                备注：{{ option.Remark }}
              </p>
            </div>
            <div class="weui-cell__ft">
              <input
                type="radio"
                class="weui-check"
                name="radio1"
                :id="option.Code"
              />
              <span class="weui-icon-checked"></span>
            </div>
          </label>
        </div>
      </div>
      <div class="footer_fill">
        <cube-button :primary="true" @click="nextClick()">下一步</cube-button>
      </div>
    </div>
    <AddDetailFill
      :is_add="is_add"
      @back="addBack"
      :form_code="checkModel"
      :task_code="task_code"
    ></AddDetailFill>
  </div>
</template>
<script>
import AddDetailFill from './components/add_detail_fill'
import { getUser } from '@/utils/auth_user';
import { afterEncrypt } from '@/utils/encryption';
export default {
  name: 'fill_add',
  components: { AddDetailFill },
  data () {
    return {
      task_code: '',
      rule_code: '',
      rules: {},
      rules_key: {},
      checkModel: '',
      is_add: false,
      selected4: '1',

    }
  },
  methods: {
    selected (item) {
      console.log(item)
      console.log(item.Code)
      this.checkModel = item.Code
    },
    addBack (val) {
      this.is_add = val
    },
    nextClick () {
      if (this.checkModel == '') {
        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '请先选择表单！',
          icon: 'cubeic-alert'
        }).show()
        return false;
      }

      this.is_add = !this.is_add
    },

    getrules () {
      this.task_code = afterEncrypt(getUser('task_code'))

      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: this.task_code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getformlist'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.rules = data.data

      }).catch(err => {
        console.log(err)
      })

    }
  },
  mounted () {
    this.getrules()
  }
}
</script>
<style lang="less">
.fill_add {
  .remark_p {
    font-size: 14px;
    color: @color_g;
  }
  .title {
    font-size: @font_18;
    padding: 20px;
    text-align: center;
    color: @color_b;
  }
  // .
  .content_fill {
    margin-bottom: 80px;
  }
  .footer_fill {
    width: 100%;
    position: fixed;
    bottom: 0;
  }
}
</style>