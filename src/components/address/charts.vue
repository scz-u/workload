<template>
  <div class="charts">
    <div class="top_form">
      <span class="right">
        <el-select
          size="small"
          v-model="userid"
          filterable
          placeholder="请选择人员"
          class="assign_input"
          :filter-method="dataFilter"
          @change="initChartSearch()"
        >
          <el-option
            v-for="item in userlist"
            :key="item.uid"
            :label="item.name"
            :value="item.uid"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.uid
            }}</span>
          </el-option>
        </el-select>
      </span>
    </div>
    <div :class="className" :id="id" ref="myEchart"></div>
  </div>
</template>
<script>
import echarts from 'echarts';
import { debounce } from '@/assets/utils/index.js'
export default {
  name: 'charts',
  props: {
    className: {
      type: String,
      default: "echartsClass"
    },
    id: {
      type: String,
      default: "yourID"
    },
    width: {
      type: String,
      default: "1000px"
    },
    height: {
      type: String,
      default: "900px"
    }
  },
  data () {
    return {
      userid: '',
      userlist: [],
      userlist_two: [],
      colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
        '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],

      chart: null,
      weburl: this.$store.state.weburl,
    };
  },
  mounted () {
    this.initChart();
    this.alluser()
    this.debounceSearch = debounce(this.initChartSearch, 500)
  },
  beforeDestroy () {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    searchDepUser () {
      if (!this.searchString) {
        this.searchRes = []
        return
      }
      this.searchLoading = true
      const activeConfig = this.getActiveConf()
      new Promise((resolve, reject) => {
        activeConfig.onsearch(this.searchString, resolve, reject)
      })
        .then(res => {
          this.searchRes = res.map(t => ({ nodeId: activeConfig.nodeId(t), ...t }))
        })
        .catch(err => console.warn(err))
        .finally(() => this.searchLoading = false)
    },
    initChartSearch () {
      let _this = this
      this.chart = echarts.init(this.$refs.myEchart);

      let corpid = this.$store.state.corpid
      // let posturl = this.$apilist['getalluserinfotree'] + '?corpid=' + corpid + '&userid=' + this.$store.state.userid;
      let $this = this
      this.loading = true
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['dependencies'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(res => {
        console.log(res)

        console.log(json)
        let json = res.data
        console.log(json)
        let option =
        {
          title: {
            // text: 'NPM Dependencies'
          },
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          series: [
            {
              type: 'graph',
              layout: 'none',
              // progressiveThreshold: 700,
              data: json.nodes.map(function (node) {
                return {
                  x: node.x,
                  y: node.y,
                  id: node.id,
                  name: node.label,
                  symbolSize: node.size,
                  itemStyle: {
                    color: node.color
                  }
                };
              }),
              edges: json.edges.map(function (edge) {
                return {
                  source: edge.sourceID,
                  target: edge.targetID
                };
              }),
              emphasis: {
                label: {
                  position: 'right',
                  show: true
                }
              },
              roam: true,
              focusNodeAdjacency: true,
              lineStyle: {
                width: 0.5,
                curveness: 0.3,
                opacity: 0.7
              }
            }
          ]
        }
        _this.chart.setOption(option, true);


      }).catch(err => {
        console.log(err)
      })
    },
    initChart () {
      let _this = this
      this.chart = echarts.init(this.$refs.myEchart);

      let corpid = this.$store.state.corpid
      // let posturl = this.$apilist['getalluserinfotree'] + '?corpid=' + corpid + '&userid=' + this.$store.state.userid;
      let $this = this
      this.loading = true
      let payload = {
        corpid: this.$store.state.corpid,
        // userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['dependencies'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(res => {
        console.log(res)

        console.log(json)
        let json = res.data
        console.log(json)
        let option =
        {
          title: {
            // text: 'NPM Dependencies'
          },
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          series: [
            {
              type: 'graph',
              layout: 'none',
              // progressiveThreshold: 700,
              data: json.nodes.map(function (node) {
                return {
                  x: node.x,
                  y: node.y,
                  id: node.id,
                  name: node.label,
                  symbolSize: node.size,
                  itemStyle: {
                    color: node.color
                  }
                };
              }),
              edges: json.edges.map(function (edge) {
                return {
                  source: edge.sourceID,
                  target: edge.targetID
                };
              }),
              emphasis: {
                label: {
                  position: 'right',
                  show: true
                }
              },
              roam: true,
              focusNodeAdjacency: true,
              lineStyle: {
                width: 0.5,
                curveness: 0.3,
                opacity: 0.7
              }
            }
          ]
        }
        _this.chart.setOption(option, true);


      }).catch(err => {
        console.log(err)
      })
    },
    alluser () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allusernameandid'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        data.data.unshift({ name: '全部', uid: '' })
        this.userlist = data.data
        this.userlist_two = Object.assign(data.data)
      }).catch(err => {
        console.log(err)
      })
    },
    dataFilter (val) {
      console.log(val)
      // 对绑定数据赋值
      this.userlist = this.userlist_two.filter((item) => {
        // 如果直接包含输入值直接返回true
        console.log(item)
        if (item.uid.indexOf(val) !== -1 || item.name.indexOf(val) !== -1) return true
      })
    },
  },
  watch: {
    // userid (newVal) {
    //   // this.searchMode = !!newVal

    //   this.debounceSearch()
    // },
  }
}
</script>
<style lang="less">
.charts {
  overflow-y: hidden;
}
.echartsClass {
  // border: 1px solid #e3e3e4;
  margin: auto;
  height: calc(100vh - 140px);
  min-height: 770px;
  width: calc(100vh);
  // min-width: 1100px;
  width: 100%;
}
</style>