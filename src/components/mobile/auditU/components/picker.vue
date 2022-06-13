<template>
  <div>
    <div class="picker-main1">
      <!-- <button @click="showPicker()">选择器</button>
    <span>{{ city }}</span> -->
      <div v-if="show" class="picker">
        <section class="picker-main">
          <div class=" h3">
            <span class="left_top_picker" @click="show = false">取消</span>
            <span @click="sure()" class="right_top_picker">确认</span>
            <div class="cube-picker-title-group">
              <h1 class="cube-picker-title">部门</h1>
            </div>
          </div>
          <ul ref="ul">
            <li
              v-for="(item, index) in list"
              :key="index"
              :class="
                active == item.id
                  ? 'active'
                  : active == item.id - 1 || active == item.id + 1
                  ? 'active2'
                  : null
              "
              :ref="'li' + item.label"
            >
              <GetTreeName :openid="item.val"></GetTreeName>
            </li>
            <!-- <li></li>
          <li></li> -->
            <!-- 
          <li
            v-for="(item, index) in list"
            :key="index"
            :class="
              active == item.id
                ? 'active'
                : active == item.id - 1 || active == item.id + 1
                ? 'active2'
                : null
            "
            :ref="'li' + item.label"
          >
            {{ item.val }}
          </li> -->
            <!-- 
          <li></li>
          <li></li> -->
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import GetTreeName from './getTreeName'
export default {
  props: {
    list: Array,
    is_show: Boolean,
    num: String
  },
  components: { GetTreeName },
  data () {
    return {
      list1: [
        { id: -9, city: "", label: "a" },
        { id: -9, city: "", label: "b" },
        {
          id: 0,
          val: "北京",
          label: "bj"
        },
        {
          id: 1,
          val: "上海",
          label: "sh"
        },
        {
          id: 2,
          val: "广州",
          label: "gz"
        },
        {
          id: 3,
          val: "深圳",
          label: "sz"
        },
        {
          id: 4,
          val: "北海",
          label: "bh"
        },
        { id: -9, city: "", label: "c" },
        { id: -9, city: "", label: "d" }
      ],
      show: false,
      active: 0,
      city: "",
      listOffsetTop: [],
      timer: null
    };
  },
  methods: {
    showPicker () {
      this.show = true;
      // let list = [{ id: -9, city: "", label: "a" },
      // { id: -9, city: "", label: "b" }].concat(this.departlist)
      // list = list.concat([{ id: -9, city: "", label: "c" },
      // { id: -9, city: "", label: "d" }])
      // this.list = list
      console.log(this.list)
      this.active = 0;
      // this.active = parseInt(this.num)
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.getOffsetTop();
        this.computeActive();
      }, 500);
    },
    sure () {
      this.list.map((item, index) => {
        item.id == this.active ? (this.city = item.val) : null;
        if (item.id == this.active) {
          this.$emit('pickersubmit', item.val)
        }
      });
      this.show = false;
    },
    getOffsetTop () {
      this.listOffsetTop = [];

      this.list.map((item, index) => {
        let liTop = this.$refs["li" + item.label];
        console.log(liTop[0].offsetTop)
        this.listOffsetTop.push(liTop[0].offsetTop - 41);
      });
    },
    computeActive () {
      let scroll = this.$refs.ul;
      scroll.addEventListener("scroll", () => {
        this.listOffsetTop.map((item, index) => {
          item <= scroll.scrollTop + 100 ? (this.active = index - 2) : null;
        });
      });
    },
  },
  mounted () {
    this.getAgentId()
  },
  watch: {
    is_show (val) {
      this.is_show = val
      if (val) {
        this.showPicker()
      }
    },
    show (val) {
      this.$emit('back', val)
    }
  }
};
</script>
<style lang="less">
.picker {
  background-color: rgba(0, 0, 0, 0.2);
  max-height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  .picker-main {
    width: 100%;
    position: absolute;
    bottom: 0;
    background-color: #fff;
    .h3 {
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: space-around;
      border-bottom: solid 1px #ddd;
      font-size: 20px;
      line-height: 40px;
      height: 40px;
      .left_top_picker {
        position: absolute;
        font-size: 14px;
        color: #999;
        padding: 0 16px;
        left: 0;
      }
      .right_top_picker {
        position: absolute;
        font-size: 14px;
        color: @color;
        padding: 0 16px;
        right: 0;
      }
    }
    ul {
      max-height: 250px;
      padding: 0;
      margin: 0;
      overflow: auto;
      background-color: #fff;
      li {
        list-style: none;
        font-size: 20px;
        line-height: 50px;
        text-align: center;
        opacity: 0.3;
        height: 50px;
        background-color: #fff;
      }
    }
  }
}
.active {
  background-color: rgba(0, 0, 0, 0.1) !important;
  border-top: @border;
  border-bottom: @border;
  color: #333;
  opacity: 1 !important;
}
.active2 {
  color: #333;
  opacity: 0.6 !important;
}
</style>