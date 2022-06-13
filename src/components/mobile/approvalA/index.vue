<template>
  <div class="index_approval">
    <!-- <cube-tab-bar v-model="selectedLabel" show-slider @click="clickHandler">
      <cube-tab
        v-for="(item, index) in tabs"
        :label="item.label"
        :key="item.label"
      >
      </cube-tab>
    </cube-tab-bar> -->
    <router-view />
    <!-- <cube-tab-panels v-model="selectedLabel" :style="{ height: height }">
      
      <cube-tab-panel label="待审核" :style="{ height: height }">
        <Wait></Wait>
      </cube-tab-panel>
      <cube-tab-panel label="已审核">
        <Already></Already>
      </cube-tab-panel>
    </cube-tab-panels> -->
  </div>
</template>
 <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
  <script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>

<script>
import Wait from './wait'
import Already from './already'
export default {
  name: 'index_approval',
  components: { Wait, Already },
  data () {
    return {
      height: '',
      selectedLabel: '待审批',
      disabled: false,
      tabs: [{
        label: '待审批',
        icon: 'cubeic-like',
        heroes: ['敌法师', '卓尔游侠', '主宰', '米拉娜', '变体精灵', '幻影长矛手', '复仇之魂', '力丸', '矮人狙击手', '圣堂刺客', '露娜', '赏金猎人', '熊战士']
      }, {
        label: '已审批',
        icon: 'cubeic-star',
        heroes: ['血魔', '影魔', '剃刀', '剧毒术士', '虚空假面', '幻影刺客', '冥界亚龙', '克林克兹', '育母蜘蛛', '编织者', '幽鬼', '司夜刺客', '米波']
      }]

    }
  },
  computed: {

  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        console.log(val);
        if (val.name == 'wait') {
          this.selectedLabel = '待审批'
        } else {
          this.selectedLabel = '已审批'
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    clickHandler (label) {
      console.log(label)
      if (label == '待审批') {
        this.$router.push({ name: 'wait' })
      } else {
        this.$router.push({ name: 'already' })
      }
    },
    changePage (current) {
      this.selectedLabel = this.tabLabels[current].label
      console.log(current)
    },
    scroll (pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = x / slideScrollerWidth * tabItemWidth
      this.$refs.tabNav.setSliderTransform(deltaX)
    },
    resolveTitle (item) {
      return `${item.name}关注了问题 · ${item.postTime} 小时前`
    },
    resolveQuestionFollowers (item) {
      return `${item.answers} 赞同 · ${item.followers} 评论`
    },

  },
  mounted () {
    let height = window.innerHeight - 39 + 'px'
    this.height = height
    console.log(height)
    // this.getAgentId()
    console.log(this.$route)
    if (this.$route.name == 'wait') {
      this.selectedLabel = '待审批'
    } else {
      this.selectedLabel = '已审批'
    }
  },
}
</script>
<style lang="less">
.index_approval {
  .cube-tab-bar {
    background-color: #fff;
    width: 100%;
    overflow: hidden;
  }
  .cube-tab,
  .cube-tab_active {
    // color: black;
  }
  .cube-tab-bar-slider {
    // background-color: black;
  }
}
</style>