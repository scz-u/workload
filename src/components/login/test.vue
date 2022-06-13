<template>
  <div>
    <div id="printMe">
      <p>11111打印内容</p>
      <p class="no-print">非打印内容 方法1：添加no-print样式类</p>
      <p class="className">非打印内容 方法2：自定义类名</p>
    </div>
    <button v-print="printObj">打印</button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      printObj: {
        id: "printMe",
        popTitle: '',
        // extraCss: 'https://www.google.com,https://www.google.com',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      }
    };
  },
  methods: {
    print () {
      this.$print(this.$refs.print, { 'no-print': '.className' });
    }
  }
}
</script>
<style lang="less">
@page {
  margin: 2mm; //去掉页脚
}
#printMe {
  text-align: center;
}
</style>
