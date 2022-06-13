<template>
  <div class="get_tree_name">
    <ww-open-data :type="type" :openid="openid" />
    <!-- <ww-open-data :type="type" openid="1" />
    <ww-open-data :type="type" openid="2" />
    <ww-open-data :type="type" openid="3" />
    <ww-open-data :type="type" openid="4" /> -->
    <div id="container"></div>

    <remote-js src="http://pv.sohu.com/cityjson?ie=utf-8"></remote-js>
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
  <script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>
<script>
export default {
  // props: ['type', 'openid'],
  props: {
    openid: String,
    isdepart: Boolean,
  },
  components: {
    'remote-js': {
      render (createElement) {
        return createElement('script', { attrs: { type: 'text/javascript', src: this.src } });
      },
      props: {
        src: { type: String, required: true },
      },

    },
  },
  data () {
    return {
      type: 'userName',
      openid111: this.$store.state.userid
    }
  },
  methods: {
    getname () {
      // if (isdepart) {
      //   this.type = "departmentName"

      // } else {
      //   this.type = "userName"
      //   WWOpenData.bind(document.querySelectorAll('ww-open-data'))
      // }
      // const container = document.getElementById('container')
      // const element = document.createElement('ww-open-data')
      // element.setAttribute('type', 'departmentName')
      // element.setAttribute('openid', this.openid)
      // container.appendChild(element)
      WWOpenData.bindAll(document.querySelectorAll('ww-open-data'))

    },
    chargeClick () {
      let $this = this
      let url = window.location.href
      let corpid = this.$store.state.corpid
      let payload = {
        url: url,
        corpid: corpid,
      }
      console.log(payload)
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getjssdksign'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        wx.config({
          beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.data.Corpid, // 必填，企业微信的corpID
          timestamp: data.signdata.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.signdata.noncestr, // 必填，生成签名的随机串
          signature: data.signdata.sign,// 必填，签名，见 附录-JS-SDK使用权限签名算法
          jsApiList: ['selectExternalContact', 'shareToExternalContact'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
        });
        // console.log(data)
        wx.agentConfig({
          corpid: data.data.Corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
          agentid: data.data.Agentid, // 必填，企业微信的应用id （e.g. 1000247）
          timestamp: data.agensindata.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.agensindata.noncestr, // 必填，生成签名的随机串
          signature: data.agensindata.sign,// 必填，签名，见附录1
          jsApiList: ['selectExternalContact', 'shareToExternalContact'], //必填
          success: function (res) {
            // 回调
            // console.log('sdfsdf')
            // console.log(this.$el)
            // WWOpenData.bind(document.querySelector('ww-open-data'))
          },
          fail: function (res) {
            console.log(res)
            if (res.errMsg.indexOf('function not exist') > -1) {
              alert('版本过低请升级')
            }
          }
        });
        // const container = document.getElementById('container')
        // 这里的 window.openidList 是该 demo 页面自行组织的数据，不具备普遍性
        // 开发者进行开发时，需要自己拿到授权企业相对应的 openid
        // 关于 openid 的定义与获得方式，可以关注文档注意事项的第 5 点
        // console.log()
        // for (const openid of window.openidList) {
        // const element = document.createElement('ww-open-data')
        // element.setAttribute('type', 'userName')
        // element.setAttribute('openid', '15140438637')
        // container.appendChild(element)
        // }
        // console.info('window.WWOpenData', window.WWOpenData)
        // console.log(WWOpenData.checkSession)
        WWOpenData.bindAll(document.querySelectorAll('ww-open-data'))
        // console.info('WWOpenData demo end')

      }).catch(err => {
        console.log(err)
      })
    }
  },

  mounted () {
    // console.log('-----------------------------')
    // const container = document.getElementById('container')
    // const element = document.createElement('ww-open-data')
    // element.setAttribute('type', 'departmentName')
    // element.setAttribute('openid', this.openid)
    // container.appendChild(element)
    WWOpenData.bindAll(document.querySelectorAll('ww-open-data'))
    // this.getname()
    // // console.info('window.WWOpenData', window.WWOpenData)
    // // WWOpenData.bind(document.querySelector('ww-open-data'))
    // this.chargeClick()
  },
  watch: {
    key (val) {
      console.log(val)
    },
    openid (val) {
      // getname()
    }
  }
}
</script>
<style lang="less">
.get_tree_name {
  display: inline-block;
}
</style>