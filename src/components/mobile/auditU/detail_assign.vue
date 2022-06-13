<template>
  <div class="detail_assign">
    <div v-if="assign_list.length == 0">
      <img src="@/assets/img/none.png" alt="" />
      <p class="text_center">
        暂无分配值
      </p>
    </div>
    <div class="content_fill" v-for="item in assign_list" :key="item">
      <!-- <div class="weui-cells__title">{{ rule_list[item].name }}</div> -->
      <div class="weui-cells" v-for="items in item.ToValues" :key="items">
        <div
          class="weui-cell weui-cell_access"
          @click="goassign(item.DataCode)"
        >
          <div class="weui-cell__bd">
            <p>{{ items.field_label }}</p>
          </div>
          <div class="weui-cell__ft">
            {{ items.value }}
          </div>
        </div>
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
      assign_list: []
    }
  },
  methods: {
    goassign (code) {
      setUser('datacode', beforeEncrypt(code))
      this.$router.push({ name: 'detail_assign_single' })
    },
    gatherbyuerid () {
      let $this = this
      let missioncode = afterEncrypt(getUser('task_code'))
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: missioncode
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['othertoselfassigndata'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)

        this.assign_list = data.data

      }).catch(err => {
        console.log(err)
      })
    },
    othertoselfassigndata () {
      this.task_code = afterEncrypt(this.$route.query.code)
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: this.task_code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['othertoselfassigndata'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.assigndata = data.data
        // this.tasklist = data.data
        // this.task_type_list = JSON.parse(JSON.stringify(Object.keys(data.data)))
        // console.log(Object.keys(data.data))

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