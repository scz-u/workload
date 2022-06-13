<template>
  <div class="charts">
    <div
      :class="className"
      :id="id"
      :style="{ height: height, width: width }"
      ref="myEchart"
    ></div>
  </div>
</template>
<script>
import echarts from 'echarts';
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
      default: "1000px"
    }
  },
  data () {
    return {
      colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
        '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],

      chart: null,
      weburl: this.$store.state.weburl,
    };
  },
  mounted () {
    this.initChart();
  },
  beforeDestroy () {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart1 () {
      this.chart = echarts.init(this.$refs.myEchart);
      // 把配置和数据放这里
      this.chart.setOption({
        backgroundColor: "#2c343c",

        title: {
          text: "Customized Pie",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc"
          }
        },

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 274, name: "联盟广告" },
              { value: 235, name: "视频广告" },
              { value: 400, name: "搜索引擎" }
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: {
              normal: {
                textStyle: {
                  color: "rgba(255, 255, 255, 0.3)"
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: "rgba(255, 255, 255, 0.3)"
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: "#c23531",
                shadowBlur: 200,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      });
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
    }
  }
}
</script>
<style lang="less">
.echartsClass {
  border: 1px solid #000;
  margin: auto;
}
</style>