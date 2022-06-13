<template>
  <div class="sumlist">
    <!-- <div class="content_fill" v-for="item in gather_keys" :key="item">
      <div v-if="item != 'userid'">
        <div class="weui-cells__title">
          {{ rule_list[item.split("||")[1]].name }}
        </div>
        <div class="weui-cells">
          <div
            class="weui-cell"
            v-for="option in gather_list[item]"
            :key="option"
          >
            <div class="weui-cell__bd">
              <p>{{ option.filed_name }}</p>
            </div>
            <div class="weui-cell__ft">
              {{ option.value }}
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div
      class="content_fill"
      v-for="item in Object.keys(rule_list)"
      :key="item"
    >
      <div>
        <div class="weui-cells__title">
          {{ rule_list[item].name }}
        </div>
        <div class="weui-cells">
          <div
            class="weui-cell"
            v-for="option in rule_list[item].data"
            :key="option"
          >
            <div class="weui-cell__bd">
              <p>{{ option.filed_name }}</p>
            </div>
            <div class="weui-cell__ft">
              {{ gather_list[option.filed_code] }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      style="margin:20px;color:#2f7dcd;font-size:16px;line-height:16px;height:16px;"
      class="cursor"
    >
      <div class="right">
        <p class="log_p cursor" @click="goassign()">被分配值>></p>
      </div>
    </div>
  </div>
</template>
<script>
import { getUser, setUser } from '@/utils/auth_user';
import { afterEncrypt, beforeEncrypt } from '@/utils/encryption';
export default {
  name: 'sumlist',
  data () {
    return {
      userid: this.$store.state.userid,
      rule_list: {},
      gather_list: {},
      gather_keys: []
    }
  },
  methods: {
    getname (val) {
      console.log(val)
    },
    goassign () {
      this.$router.push({ name: 'detail_assign' })
    },
    gatherbyuerid () {
      let $this = this
      let missioncode = afterEncrypt(getUser('task_code'))
      console.log(missioncode)
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: missioncode
      }
      console.log(payload)
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['gatherbyuserid'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)

        this.rule_list = data.data.form
        this.gather_list = data.data.gather[0]
        console.log(Object.keys(this.gather_list))
        this.gather_keys = Object.keys(this.gather_list)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.gatherbyuerid()
  }
}
</script>
<style lang="less">
.sumlist {
}
</style>