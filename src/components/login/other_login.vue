<template>
  <div>
    <div
      style="height: 400px; background-color: transparent"
      v-loading="loading"
    ></div>
  </div>
</template>
<script>
export default {
  name: 'other_login',
  data () {
    return {
      loading: true
    }
  },
  methods: {
    checkisauditor () {
      let _this = this
      let payload1 = {

        corpid: _this.$store.state.corpid,
        userid: _this.$store.state.userid
      }
      let createvalue = _this.$createObj(payload1);
      let posturl = _this.$apilist['checkisauditor'];
      // alert('1231231')
      _this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.$store.dispatch('check', data.data.toString()).then(() => {
          // alert('000s')
          let url = "/fill/listfill"
          window.location.replace(url);


        }).catch(err => {
          console.log(err)
        })
      })
    },
    pwdSubmit () {
      let $this = this
      let payload = {
        passwd: '123456789',
        mobile: '15384087113'
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['signin'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // return false
        if (data.data.state == -1) {
          this.$alert('密码错误！', '提示', {
            confirmButtonText: '确定',

          });
          return false
        } else {
          if (data.data.corps.length == 1) {
            // this.getP(data.data.corps[0].Corpid, data.data.corps[0].UserId)
            this.$store.dispatch('login_other', { permission: data.data.corps[0].IsAdmin == true ? 1 : 0, username: data.data.corps[0].Name, userid: data.data.corps[0].UserId, corpname: data.data.corps[0].CorpName, corpid: data.data.corps[0].Corpid }).then(() => {
              //  this.is_mes = true
              // this.mescrollInit()
              // _this.getAgentId1(1)
              $this.checkisauditor()



            }).catch(err => {
              console.log(err)
            })
          } else {
            this.corplist = data.data.corps
            this.is_corp = true
          }
        }


      }).catch(err => {
        console.log(err)
      })
    },
  },
  mounted () {
    this.pwdSubmit()
  }
}
</script>