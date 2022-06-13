<template>
  <div class="permissions frame_cnt member_container">
    <div class="member_colRight">
      <div class="operation_member">
        <el-row>
          <el-col :span="18">
            <el-button
              size="small"
              @click="departClick()"
              icon="el-icon-plus"
              round
              type="primary"
              class="width_90"
              >添加</el-button
            >
            <!-- <el-button class="margin_l_5" size="small" @click="delClick()"
              >删除</el-button
            > -->
          </el-col>
        </el-row>
      </div>
      <data-tables
        v-loading="loading"
        :data="tasklist"
        :pagination-props="{ pageSizes: [5, 10, 15] }"
        :row-key="row_key"
        :expand-row-keys="expandRowKeys"
        @selection-change="handleSelectionChange"
        :table-props="tableProps"
      >
        <el-table-column type="selection" width="65"></el-table-column>
        <el-table-column label="工号" prop="UserId"> </el-table-column>
        <el-table-column label="用户名" prop="Name"> </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="props">
            <div class="form_operate">
              <el-link
                :underline="false"
                type="danger"
                @click="delClick(props.row)"
              >
                <span>删除</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
      </data-tables>
    </div>
    <DepartAlert
      :is_add="is_depart"
      :departlist="departlist"
      :title="'权限添加'"
      @back="departBack"
      @departSub="departSub"
    ></DepartAlert>
  </div>
</template>
<script>
import DepartAlert from '../../public/departAlertF'
export default {
  name: 'permisiions',
  data () {
    return {
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      tasklist: [],
      loading: false,
      is_depart: false,
      departlist: []
    }
  },
  components: { DepartAlert },
  methods: {
    departClick () {
      this.is_depart = !this.is_depart
    },
    departBack (val) {
      this.is_depart = val
    },
    departSub (val) {
      let userids = []
      console.log(val)
      for (let i in val) {
        userids.push(val[i].id)
      }
      console.log(val)
      let payload = {
        corpid: this.$store.state.corpid,
        admin_userids: JSON.stringify(userids)
      }
      console.log(payload)
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['addadmin'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.$message({
          type: 'success',
          message: '添加成功!'
        });
        _this.getalladmin()
        // _this.tasklist = data.data
      }).catch(err => {
        console.log(err)
      })
    },
    delClick (item) {
      this.$confirm('是否移除该管理员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let payload = {
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          admin_userid: item.UserId
        }
        console.log(payload)
        let createvalue = this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = this.$apilist['deloneadmin'] + '?signature=' + keyvalue;
        let _this = this
        this.$server.post(posturl, createvalue['fd']).then(() => {
          _this.getalladmin()
          _this.$message({
            type: 'success',
            message: '移除成功!'
          });
        }).catch(err => {
          console.log(err)
        })


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSelectionChange () { },
    getalladmin () {
      let payload = {
        corpid: this.$store.state.corpid
      }
      console.log(payload)
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['getalladmin'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.tasklist = data.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.getalladmin()
  }
}
</script>
<style lang="less">
.permissions {
  // padding: 16px;
  .member_colRight {
    display: table;
    width: 100%;
  }
  .operation_member {
    padding-top: 20px;
    padding-left: 20px;
  }
}
</style>