<template>
  <div class="log">
    <div class="weui-cells__title">日志</div>
    <div class="weui-cells">
      <div class="weui-cell" v-for="item in loginfo" :key="item">
        <div class="weui-cell__bd">
          <!-- <GetTreeNameM :openid="item.UserId" :is_depart="false"></GetTreeNameM> -->
          {{ item.UserName }}
          <span class="style_span danger_span" v-if="item.TypeId == 7">
            #{{ item.TypeDesc }}#</span
          >
          <span class="style_span success_span" v-else>
            #{{ item.TypeDesc }}#</span
          >
          <p>{{ item.Remark }}</p>
        </div>
        <div class="weui-cell__ft">
          {{
            new Date(
              +new Date(new Date(item.CreateTime).toJSON()) + 8 * 3600 * 1000
            )
              .toISOString()
              .replace(/T/g, " ")
              .replace(/\.[\d]{3}Z/, "")

              .slice(5, -3)
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
  <script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>
<script>
import { getUser, setUser } from '@/utils/auth_user';
import { afterEncrypt, beforeEncrypt } from '@/utils/encryption';
import GetTreeNameM from './getTreeNameM'
export default {
  name: 'log',
  components: { GetTreeNameM },
  data () {
    return {
      loginfo: [],
    }
  },
  methods: {
    getallloginfo () {
      let $this = this
      let code = afterEncrypt(getUser('code'))
      let payload = {
        data_code: code,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getallloginfobydatacode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.loginfo = data.data

      }).catch(err => {
        console.log(err)
      })
    },


  },
  mounted () {

    this.getallloginfo()
    // this.getAgentId()
  }
}
</script>
<style lang="less">
.log {
  font-size: 16px;
  .style_span {
    font-size: 16px;
  }
  .success_span {
    color: #67c23a;
  }
  .danger_span {
    color: #f56c6c;
  }
}
</style>