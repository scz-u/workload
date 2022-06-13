<template>
  <div class="func_add">
    <!-- <el-dialog  :append-to-body="true"
      title="公式设置"
      :visible.sync="my_is_func"
      :close-on-click-modal="false"
      width="800px"
    > -->
    <div
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-label="添加工作量"
      class="el-message-box__wrapper"
      style="z-index: 2000"
      v-if="my_is_func"
    >
      <div class="el-message-box">
        <div class="el-message-box__header">
          <div class="el-message-box__title">
            <span>公式编辑</span>
          </div>
          <button class="el-message-box__headerbtn" aria-label>
            <i
              class="el-message-box__close el-icon-close"
              @click="icon_close"
            ></i>
          </button>
        </div>
        <div
          class="el-message-box__content"
          style="height: 500px; overflow-y: auto"
        >
          <div class="el-message-box__message">
            <div class="func_div_alert">
              <div class="name_func left operator_title">{{ func_name }} =</div>
              <div class="text_func left">
                <!-- 公式编辑区域 -->
                <div
                  class="formulaView"
                  ref="formulaView"
                  id="formulaView"
                  contentEditable="true"
                  @click="recordPosition"
                  @keyup="editEnter($event)"
                  @copy="copy($event)"
                  @paste="paste($event)"
                ></div>
              </div>
              <div class="clearfix"></div>

              <div class="func_middle">
                <div class="left">
                  <el-button size="medium" @click="checkFunc()"
                    >公式校验</el-button
                  >
                </div>
                <div class="1" style="float: right">
                  <span class="outcome_state_span">
                    <el-select
                      v-model="outcome_state"
                      size="medium"
                      style="width: 100px"
                    >
                      <el-option
                        v-for="item in outcome_list"
                        :key="item"
                        :value="item.val"
                        :label="item.name"
                        >{{ item.name }}</el-option
                      >
                    </el-select>
                  </span>
                  <span>保留</span>
                  <span class="decimal_span">
                    <el-select v-model="decimal_point" size="medium">
                      <el-option v-for="item in 5" :key="item" :value="item">{{
                        item
                      }}</el-option>
                    </el-select>
                  </span>
                  <span>位小数</span>
                </div>
                <div class="clearfix"></div>
                <div class="operator">
                  <div class="operator_title">快捷运算符</div>
                  <div class="operator_list">
                    <span
                      class="operator_list_item"
                      v-for="item in operator_list"
                      :key="item.name"
                      @click="addItem($event, 2, 2)"
                      >{{ item.name }}</span
                    >
                  </div>
                </div>
                <div class="operator">
                  <div class="operator_title">自定义函数</div>
                  <div class="operator_list">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="IFS函数解释，待定"
                      placement="top-start"
                    >
                      <!-- <div class="operator_list_item"> -->
                      <el-button
                        size="small"
                        type="text"
                        class="operator_list_item"
                        @click="addItemTwo($event, 1, 'IFS')"
                        >IFS</el-button
                      >
                      <!-- </div> -->
                    </el-tooltip>
                    <!-- <span
                      class="operator_list_item"
                      @click="addItemTwo($event, 1, 'IFS')"
                      >IFS</span
                    > -->
                  </div>
                </div>
                <div class="selectstring">
                  <div class="operator_title">点击选择字段</div>
                  <div
                    v-for="item in strginglist"
                    :key="item"
                    style="display: inline-block"
                  >
                    <div
                      class="string_list"
                      v-if="
                        (item.C == 'number' || item.C == 'select_number') &&
                        item.Is == true
                      "
                    >
                      <p
                        class="string_span p_over"
                        :title="item.Name"
                        @click="addItem($event, 1, item.Code)"
                      >
                        {{ item.Name }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button @click="my_is_func = false" size="small">取 消</el-button>
          <el-button type="primary" @click="funcSubmit()" size="small"
            >确 定</el-button
          >
        </div>
      </div>
    </div>
    <!-- </el-dialog> -->
    <div
      class="v-modal1"
      tabindex="0"
      style="z-index: 1999 !important"
      v-show="my_is_func"
    ></div>
  </div>
</template>
<script>
import { getUser } from '@/utils/auth_user';
export default {
  name: 'func_add',
  props: {
    is_func: Boolean,
    func_name: String,
    code: String,
    funcnum: Number,
    funclist: Object
  },
  data () {
    return {
      formlist: {},
      strlist: [],
      str_id_list: [],
      // 公式字符串
      formulaStr: '',
      formulaId: '',
      // 公式编辑器最后光标位置
      formulaLastRange: null,
      my_is_func: false,
      decimal_point: 2,
      outcome_state: 1,
      strginglist: [],
      outcome_list: [{ val: 1, name: '四舍五入' }, { val: 2, name: '向上取整' }, { val: 3, name: '向下取整' }],
      operator_list: [{ name: '≥', val: '≥' }, { name: '≤', val: '≤' }, { name: '>', val: '>' }, { name: '<', val: '<' }, { name: '=', val: '=' }, { name: '|', val: '|' }, { name: '&', val: '&' }, { name: '+', val: '+' }, { name: '-', val: '-' }, { name: '*', val: '*' }, { name: '/', val: '/' }, { name: '(', val: '(' }, { name: ')', val: ')' },
      { name: '.', val: '.' },],
    }
  },
  methods: {
    icon_close () {
      this.my_is_func = !this.my_is_func
    },
    checkFunc () {
      let strlist = this.getFormula()
      console.log(this.formulaStr)
      this.formulaStr = strlist[0]
      this.formulaId = strlist[1]
      console.log(strlist)
      if (this.formulaStr == '') {
        this.$alert('公式未填写！', '提示', {
          confirmButtonText: '确定',
        });
        return false;
      }
      console.log(this.str_id_list)
      // return false
      let $this = this
      let payload = {
        formula_methods: JSON.stringify(this.str_id_list),
        userid: $this.$store.state.userid,
        corpid: $this.$store.state.corpid

      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['checkformula'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.$message({
          message: '公式校验成功！',
          type: 'success'
        });

      }).catch(err => {
        console.log(err)
      })
    },
    checkFuncBefore () {
      let $this = this
      let payload = {
        formula_methods: JSON.stringify(this.str_id_list),
        userid: $this.$store.state.userid,
        corpid: $this.$store.state.corpid

      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['checkformula'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        return 1;

      }).catch(err => {
        console.log(err)
      })
    },
    funcSubmit () {
      let $this = this
      let strlist = this.getFormula()
      console.log(this.formulaStr)
      this.formulaStr = strlist[0]
      this.formulaId = strlist[1]
      if (this.formulaStr == '') {
        this.$alert('公式未填写！', '提示', {
          confirmButtonText: '确定',
        });
        return false;
      }

      let backstr = { formulaStr: strlist[0], formulaId: strlist[1], decimal_point: this.decimal_point, outcome_state: this.outcome_state }
      console.log(backstr)
      let payload = {
        formula_methods: JSON.stringify(this.str_id_list),
        userid: $this.$store.state.userid,
        corpid: $this.$store.state.corpid

      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['checkformula'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then(() => {
        console.log(this.strlist)
        console.log(this.str_id_list)
        $this.$emit('subBack', { strlist: this.strlist, str_id_list: this.str_id_list, formulaStr: strlist[0], formulaId: strlist[1], decimal_point: this.decimal_point, outcome_state: this.outcome_state })
        $this.my_is_func = false

      }).catch(err => {
        console.log(err)
      })

      // let checkval = this.checkFuncBefore()
      // console.log(checkval)
      // if (this.checkFuncBefore()) {
      //   $this.$emit('subBack', { strlist: this.strlist, str_id_list: this.str_id_list, formulaStr: strlist[0], formulaId: strlist[1], decimal_point: this.decimal_point, outcome_state: this.outcome_state })
      //   $this.my_is_func = false
      // }



    },
    getallrulefiled () {
      // let $this = this
      // let posturl = $this.$apilist['allrulefiled'] + '?rule_code=' + this.code + '&userid=' + this.$store.state.userid;
      // // return false;
      // $this.$server.get(posturl).then((data) => {

      //   console.log(data)
      //   this.strginglist = data.data.common
      //   // this.countlist = data.data.count

      // }).catch(err => {
      //   console.log(err)
      // })
      this.strginglist = []
      console.log(this.$store.state.formItemList)
      this.strginglist = JSON.parse(JSON.stringify(this.$store.state.formItemList))
      console.log(this.strginglist)
      // for (let i in list) {
      //   if (list[i].C == 'numberfield') {
      //     console.log('sdf')
      //     this.strginglist.push(list[i])
      //   }
      // }
      // console.log(list)
    },

    // 获取公式
    getFormula: function () {
      var nodes = this.$refs.formulaView.childNodes;
      let str = "";
      let str_id = "";
      let strlist = []
      let str_id_list = []
      console.log(nodes)
      for (let i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (el.nodeName == "SPAN") {
          // console.log(el);
          str += el.innerHTML.trim();
          str_id += el.className
          console.log(el.className)
          strlist.push(el.innerHTML.trim())
          str_id_list.push(el.className)
        } else {
          // console.log(el.data);

          // console.log('=======')
          // console.log(el.data)
          str += el.data ? el.data.trim() : '';
          str_id += el.data ? el.data.trim() : '';
          // console.log(str_id)
          // console.log(i)
          if (el.data ? el.data.trim() : '' !== '') {
            // console.log(el.data.trim().split(''))
            // console.log(el.data)
            // console.log(el.data.length)
            // console.log(str_id_list.concat(el.data.trim().split('')))
            // let list = el.data.trim().split('')
            // strlist.push(el.data ? el.data.trim() : '')
            // str_id_list.push(el.data ? el.data.trim() : '')
            // strlist = strlist.content(list)
            // strlist.push.apply(strlist, list);
            // str_id_list.push.apply(str_id_list, list);
            // str_id_list = str_id_list.content(list)
            // console.log("9999999999999")
            // console.log(str_id_list)
            // console.log(i)
            // var pattern = new RegExp("[`~!@#$^&*+()=|{}':;',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
            var pattern = new RegExp(/[`~!@#$%^&*()_\-+=<>≥≤?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/)
            // let strlist = new RegExp("[`+-{}()*/|&<>]")

            console.log(i)
            console.log(nodes[i - 1])
            if (i != 0) {
              if (nodes[i - 1].nodeName == 'SPAN') {
                let other1 = el.data.trim().replace(/\s+/g, "")
                let other = other1.split('')
                console.log(other)
                for (let item in other) {
                  console.log(pattern.test(other[item]))
                  console.log(other[item])
                  if (pattern.test(other[item])) {
                    strlist.push(other[item])
                    str_id_list.push(other[item])
                  } else {
                    if (!pattern.test(str_id_list[str_id_list.length - 1])) {
                      // strlist.push(el.data ? el.data.trim() : '')
                      strlist[strlist.length - 1] = strlist[strlist.length - 1] + other[item]
                      str_id_list[str_id_list.length - 1] = str_id_list[str_id_list.length - 1] + other[item]
                    } else {
                      strlist.push(other[item])
                      str_id_list.push(other[item])
                    }
                  }
                }
              } else {
                let other = el.data.trim().split('')
                console.log(other)
                for (let item in other) {
                  console.log(pattern.test(other[item]))
                  console.log(other[item])
                  if (pattern.test(other[item])) {
                    strlist.push(other[item])
                    str_id_list.push(other[item])
                  } else {
                    if (!pattern.test(str_id_list[str_id_list.length - 1])) {
                      strlist[strlist.length - 1] = strlist[strlist.length - 1] + other[item]
                      str_id_list[str_id_list.length - 1] = str_id_list[str_id_list.length - 1] + other[item]
                    } else {
                      strlist.push(other[item])
                      str_id_list.push(other[item])
                    }
                  }
                }
              }
            } else {
              let other = el.data.trim().split('')
              console.log(other)
              strlist.push(other[0])
              str_id_list.push(other[0])
              other.splice(0, 1)
              for (let item in other) {
                console.log(pattern.test(other[item]))
                console.log(other[item])
                if (pattern.test(other[item])) {
                  strlist.push(other[item])
                  str_id_list.push(other[item])
                } else {
                  if (!pattern.test(str_id_list[str_id_list.length - 1])) {
                    strlist[strlist.length - 1] = strlist[strlist.length - 1] + other[item]
                    str_id_list[str_id_list.length - 1] = str_id_list[str_id_list.length - 1] + other[item]
                  } else {
                    strlist.push(other[item])
                    str_id_list.push(other[item])
                  }
                }
              }
            }

          }

        }
      }
      // console.log(str);
      console.log('-------------------------------------------')
      console.log(str_id_list)
      console.log(strlist)
      this.formulaStr = str;
      this.formulaId = str_id
      this.formlist = { strlist: strlist, str_id_list: str_id_list }
      this.strlist = strlist
      this.str_id_list = str_id_list
      return [str, str_id]
    },
    // 点选时记录光标位置
    recordPosition: function () {
      // 保存最后光标点
      this.formulaLastRange = window.getSelection().getRangeAt(0);
    },
    // 添加字段 type 1 字段  2 公式
    addItem: function (e, type, code) {
      console.log(e)
      // 当前元素所有子节点
      var nodes = this.$refs.formulaView.childNodes;
      // 当前子元素偏移量
      var offset = this.formulaLastRange && this.formulaLastRange.startOffset;
      // 当前光标后的元素
      var nextEl = this.formulaLastRange && this.formulaLastRange.endContainer;
      console.log(nextEl)
      // 创建节点片段  
      var fd = document.createDocumentFragment();
      // 创建字段节点  空白间隔节点  公式节点
      var spanEl = document.createElement("span");
      spanEl.className = code
      spanEl.setAttribute('contentEditable', false);
      // 标识为新添加元素 用于定位光标
      spanEl.setAttribute('new-el', true);
      spanEl.innerHTML = '#' + e.target.innerHTML + '#';
      var empty = document.createTextNode(' ');
      var formulaEl = document.createTextNode('' + e.target.innerText + ' ');
      console.log(nextEl)
      console.log(formulaEl)
      console.log(spanEl)
      // 区分文本节点替换 还是父节点插入
      if (nextEl && nextEl.className != 'formulaView') {
        console.log('2222')
        // 获取文本节点内容
        var content = nextEl.data;
        console.log(content)
        // 添加前段文本
        fd.appendChild(document.createTextNode(content.substr(0, offset) + ' '));
        fd.appendChild(type == 1 ? spanEl : formulaEl);
        // 添加后段文本
        fd.appendChild(document.createTextNode(' ' + content.substr(offset)));
        // 替换节点
        this.$refs.formulaView.replaceChild(fd, nextEl);

      } else {
        console.log('1111')
        // 添加前段文本
        fd.appendChild(empty);
        fd.appendChild(type == 1 ? spanEl : formulaEl);
        fd.appendChild(empty);

        // 如果有偏移元素且不是最后节点  中间插入节点  最后添加节点
        if (nodes.length && nodes.length > offset) {
          this.$refs.formulaView.insertBefore(fd,
            (nextEl && nextEl.className != 'formulaView') ? nextEl : nodes[offset]
          );
        } else {
          this.$refs.formulaView.appendChild(fd);
        }
      }


      // 遍历光标偏移数据 删除标志
      var elOffSet = 0;
      for (let i = 0; i < nodes.length; i++) {
        let el = nodes[i];
        // console.log(el,el.nodeName == 'SPAN'&&el.getAttribute('new-el'));
        if (el.nodeName == 'SPAN' && el.getAttribute('new-el')) {
          elOffSet = i;
          el.removeAttribute('new-el');
        }
      }

      // 创建新的光标对象
      var range = document.createRange()
      // 光标对象的范围界定
      range.selectNodeContents(type == 1 ? this.$refs.formulaView : formulaEl);
      // 光标位置定位 
      range.setStart(
        type == 1 ? this.$refs.formulaView : formulaEl,
        type == 1 ? elOffSet + 1 : formulaEl.data.length - 1
      );

      // 使光标开始和光标结束重叠
      range.collapse(true)
      // 清除选定对象的所有光标对象
      window.getSelection().removeAllRanges()
      // 插入新的光标对象
      window.getSelection().addRange(range);

      // 保存新光标
      this.recordPosition();

    },
    addItemTwo: function (e, type, code) {
      console.log(e)
      // 当前元素所有子节点
      var nodes = this.$refs.formulaView.childNodes;
      // 当前子元素偏移量
      var offset = this.formulaLastRange && this.formulaLastRange.startOffset;
      // 当前光标后的元素
      var nextEl = this.formulaLastRange && this.formulaLastRange.endContainer;
      console.log(nextEl)
      // 创建节点片段  
      var fd = document.createDocumentFragment();
      // 创建字段节点  空白间隔节点  公式节点
      var spanEl = document.createElement("span");
      spanEl.className = code
      spanEl.setAttribute('contentEditable', false);
      // 标识为新添加元素 用于定位光标
      spanEl.setAttribute('new-el', true);
      spanEl.innerHTML = e.target.innerHTML;
      var empty = document.createTextNode(' ');
      var formulaEl1 = document.createTextNode(' [');
      var formulaEl2 = document.createTextNode('()] ');
      var formulaEl = document.createTextNode(' [{' + e.target.innerHTML + '()] ');
      console.log(nextEl)
      console.log(formulaEl)
      console.log(spanEl)
      // 区分文本节点替换 还是父节点插入
      if (nextEl && nextEl.className != 'formulaView') {
        console.log('2222')
        // 获取文本节点内容
        var content = nextEl.data;
        console.log(content)
        // 添加前段文本
        fd.appendChild(document.createTextNode(content.substr(0, offset) + ' '));
        // fd.appendChild(type == 1 ? spanEl : formulaEl);
        fd.appendChild(formulaEl1)
        fd.appendChild(spanEl)
        fd.appendChild(formulaEl2)
        // 添加后段文本
        fd.appendChild(document.createTextNode(' ' + content.substr(offset)));
        // 替换节点
        this.$refs.formulaView.replaceChild(fd, nextEl);

      } else {
        console.log('1111')
        // 添加前段文本
        fd.appendChild(empty);
        // fd.appendChild(type == 1 ? spanEl : formulaEl);
        fd.appendChild(formulaEl1)
        fd.appendChild(spanEl)
        fd.appendChild(formulaEl2)
        fd.appendChild(empty);

        // 如果有偏移元素且不是最后节点  中间插入节点  最后添加节点
        if (nodes.length && nodes.length > offset) {
          this.$refs.formulaView.insertBefore(fd,
            (nextEl && nextEl.className != 'formulaView') ? nextEl : nodes[offset]
          );
        } else {
          this.$refs.formulaView.appendChild(fd);
        }
      }


      // 遍历光标偏移数据 删除标志
      var elOffSet = 0;
      for (let i = 0; i < nodes.length; i++) {
        let el = nodes[i];
        // console.log(el,el.nodeName == 'SPAN'&&el.getAttribute('new-el'));
        if (el.nodeName == 'SPAN' && el.getAttribute('new-el')) {
          elOffSet = i;
          el.removeAttribute('new-el');
        }
      }

      // 创建新的光标对象
      var range = document.createRange()
      // 光标对象的范围界定
      range.selectNodeContents(type == 1 ? this.$refs.formulaView : formulaEl);
      // 光标位置定位 
      range.setStart(
        type == 2 ? this.$refs.formulaView : formulaEl2,
        type == 2 ? elOffSet + 1 : formulaEl2.data.length - 3
      );

      // 使光标开始和光标结束重叠
      range.collapse(true)
      // 清除选定对象的所有光标对象
      window.getSelection().removeAllRanges()
      // 插入新的光标对象
      window.getSelection().addRange(range);

      // 保存新光标
      this.recordPosition();

    },
    // 复制
    copy: function (e) {
      // 选中复制内容
      e.preventDefault();
      //
      var selContent = document.getSelection().toString().split("\n")[0];
      // 替换选中内容
      e.clipboardData.setData('text/plain', selContent);
    },
    // 输入回车
    editEnter: function (e) {
      // console.log(e);
      e.preventDefault();

      // return '<br/>';
      // return
      if (e.keyCode == 13) {
        // 获取标签内容 并把多个换行替换成1个
        var content = this.$refs.formulaView.innerHTML.replace(/(<div><br><\/div>){2,2}/g, "<div><br></div>");

        // debugger;

        // 记录是否第一行回车
        var divCount = this.$refs.formulaView.querySelectorAll("div");
        // var tE = this.$refs.formulaView.querySelect('div');
        // console.log(this.$refs.formulaView.childNodes);
        // console.log(this.$refs.formulaView.querySelectorAll("div"));
        // 获取当前元素内所有子节点
        var childNodes = this.$refs.formulaView.childNodes;
        // 记录当前光标子节点位置
        var rangeIndex = 0;
        for (let i = 0; i < childNodes.length; i++) {
          var one = childNodes[i];
          if (one.nodeName == 'DIV') {
            rangeIndex = i;
          }
        }
        // console.log(rangeIndex);
        // debugger;
        // console.log(content);

        // 如果有替换则进行光标复位
        if (divCount.length >= 1) {
          // 替换回车插入的div标签
          content = content.replace(/<div>|<\/div>/g, function (word) {
            // console.log(word);
            if (word == "<div>") {
              // 如果是第一行不在替换br
              return divCount.length > 1 ? ' ' : ' <br>';
            } else if (word == '</div>') {
              return ' ';
            }
          });
          // 更新替换内容，光标复位
          this.$refs.formulaView.innerHTML = content;
          // 创建新的光标对象
          var range = document.createRange()
          // 光标对象的范围界定为新建的表情节点
          range.selectNodeContents(this.$refs.formulaView)
          // 光标位置定位在表情节点的最大长度
          range.setStart(this.$refs.formulaView, rangeIndex + (divCount.length > 1 ? 0 : 1));
          // 使光标开始和光标结束重叠
          range.collapse(true)
          // 清除选定对象的所有光标对象
          window.getSelection().removeAllRanges()
          // 插入新的光标对象
          window.getSelection().addRange(range);
        }

      }
      // 保存最后光标点
      this.formulaLastRange = window.getSelection().getRangeAt(0);

    },
    // 获取粘贴事件
    paste: function (e) {
      e.preventDefault();
      // var txt=e.clipboardData.getData();
      // console.log(e, e.clipboardData.getData());
      return "";
    },
    addItem1: function (e, type, code) {
      console.log(e)
      // 当前元素所有子节点
      var nodes = this.$refs.formulaView.childNodes;
      // 当前子元素偏移量
      var offset = this.formulaLastRange && this.formulaLastRange.startOffset;
      // 当前光标后的元素
      var nextEl = this.formulaLastRange && this.formulaLastRange.endContainer;
      console.log(nextEl)
      // 创建节点片段  
      var fd = document.createDocumentFragment();
      // 创建字段节点  空白间隔节点  公式节点
      var spanEl = document.createElement("span");
      spanEl.className = code
      spanEl.setAttribute('contentEditable', false);
      // 标识为新添加元素 用于定位光标
      spanEl.setAttribute('new-el', true);
      spanEl.innerHTML = e;
      var empty = document.createTextNode(' ');
      var formulaEl = document.createTextNode(' ' + e + ' ');

      // 区分文本节点替换 还是父节点插入
      if (nextEl && nextEl.className != 'formulaView') {
        console.log('444444')
        // 获取文本节点内容
        var content = nextEl.data;
        console.log(content)
        // // 添加前段文本
        fd.appendChild(document.createTextNode(content.substr(0, offset) + ' '));
        fd.appendChild(type == 1 ? spanEl : formulaEl);
        // // 添加后段文本
        fd.appendChild(document.createTextNode(' ' + content.substr(offset)));
        // 替换节点
        this.$refs.formulaView.replaceChild(fd, nextEl);

      } else {
        console.log('33333')
        // 添加前段文本
        fd.appendChild(empty);
        fd.appendChild(type == 1 ? spanEl : formulaEl);
        fd.appendChild(empty);
        // console.log(type == 1 ? spanEl : formulaEl)
        // 如果有偏移元素且不是最后节点  中间插入节点  最后添加节点
        if (nodes.length && nodes.length > offset) {
          this.$refs.formulaView.insertBefore(fd,
            (nextEl && nextEl.className != 'formulaView') ? nextEl : nodes[offset]
          );
        } else {
          this.$refs.formulaView.appendChild(fd);
        }
      }


      // 遍历光标偏移数据 删除标志
      var elOffSet = 0;
      for (let i = 0; i < nodes.length; i++) {
        let el = nodes[i];
        // console.log(el,el.nodeName == 'SPAN'&&el.getAttribute('new-el'));
        if (el.nodeName == 'SPAN' && el.getAttribute('new-el')) {
          elOffSet = i;
          el.removeAttribute('new-el');
        }
      }

      // 创建新的光标对象
      var range = document.createRange()
      // 光标对象的范围界定
      range.selectNodeContents(type == 1 ? this.$refs.formulaView : formulaEl);
      // 光标位置定位 
      range.setStart(
        type == 1 ? this.$refs.formulaView : formulaEl,
        type == 1 ? elOffSet + 1 : formulaEl.data.length - 1
      );

      // 使光标开始和光标结束重叠
      range.collapse(true)
      // 清除选定对象的所有光标对象
      window.getSelection().removeAllRanges()
      // 插入新的光标对象
      window.getSelection().addRange(range);

      // 保存新光标
      this.recordPosition();

    },


  },
  watch: {
    is_func (val) {
      this.my_is_func = val
      if (val) {
        this.getallrulefiled()
        let that = this
        console.log(this.funclist)
        this.$nextTick(function () {
          if (this.funcnum == 2) {
            console.log(this.funclist)
            document.getElementById('formulaView').innerHTML = '';
            console.log('-------------------')
            that.formulaLastRange = null
            for (let i in that.funclist.strlist) {
              console.log('sdf')
              if (that.funclist.str_id_list[i] <= 'Z' && that.funclist.str_id_list[i] >= 'A') {
                console.log('----')
                that.addItem1(that.funclist.strlist[i], 1, that.funclist.str_id_list[i])
              } else {
                console.log('999999999999')
                that.addItem1(that.funclist.strlist[i], 2, 2)
              }

            }

          }
          else if (this.funcnum == 1) {
            console.log('-----------')
            this.formulaId = ''
            this.formulaStr = ''
            this.decimal_point = 2
            this.outcome_state = 1
            document.getElementById('formulaView').innerHTML = '';
            this.formulaLastRange = null
            // // 创建新的光标对象
            // var range = document.createRange()
            // // 光标对象的范围界定
            // range.selectNodeContents(this.$refs.formulaView);
            // // 光标位置定位 
            // range.setStart(this.$refs.formulaView, 1

            // );

            // // 使光标开始和光标结束重叠
            // range.collapse(true)
            // // 清除选定对象的所有光标对象
            // window.getSelection().removeAllRanges()
            // // 插入新的光标对象
            // window.getSelection().addRange(range);

            // // 保存新光标
            // this.recordPosition();

          }
        })

      }
    },
    my_is_func (val) {
      if (!val) {
        this.$emit('back', val)
      }

    }
  }
}
</script>
<style lang="less">
.func_add {
  .text_func:focus,
  .formulaView:focus {
    border: 1px solid red;
  }
  .v-modal1 {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
  }
  .el-loading-mask {
    z-index: 1 !important;
  }
  .el-message-box {
    width: 800px;
    height: 600px;
    font-size: 14px;
  }
  // .el-message-box__header {
  //   border-bottom: 1px solid #e5e5e5;
  // }
  .el-message-box__btns {
    // border-top: 1px solid #e3e3e4;
  }
  .func_div_alert {
    // padding: 20px;
    .name_func {
      margin-right: 10px;
      width: 75px;
      text-align: right;
    }
    .text_func {
      width: 670px;
    }
    .fun_textarea_alert {
      height: 96px;
      border: @border;
      border-radius: 5px;
      padding: 5px 10px;
      color: #c0c4cc;
      .func_select_list {
        color: @color;
      }
    }
  }
  .func_middle {
    margin-top: 15px;
    margin-left: 85px;
  }
  .outcome_state_span {
    display: inline-block;
    margin: auto 5px;
    width: 105px;
    input {
      width: 100% !important;
    }
  }
  .decimal_span {
    display: inline-block;
    width: 60px;
    margin: auto 5px;
    input {
      width: 100% !important;
    }
  }
  .operator {
    margin: 20px auto;
    display: flex;
    .operator_title {
      line-height: 30px;
      font-weight: bold;
    }
  }
  // .selectstring {
  .operator_title {
    // line-height: 30px;
    font-weight: bold;
  }
  // }
  .operator_list {
    padding-left: 5px;
  }
  .operator_list_item {
    color: #333;
    display: inline-block;
    border: @border;
    padding: 3px 8px;
    margin: auto 5px;
    font-size: 14px;
    // font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    height: 30px;
  }
  .string_list {
    display: inline-block;
    margin-top: 10px;
    border: @border;
    border-radius: 5px;
    width: 106px;
    padding: 5px 0px;
    text-align: center;
    margin-right: 10px;
    cursor: pointer;
    .string_span {
      // display: inline-block;
      width: 100%;
      padding: 0 5px;
    }
  }
  .dialog-footer {
    border-top: @border;
    width: 100%;
    // background: red;
    // margin-top: 30px;
    text-align: right;
    padding-right: 10px;
    padding-top: 15px;
    // margin-bottom: -15px;
  }
  .formulaView {
    border: @border;
    padding: 5px;
    min-height: 100px;
    border-radius: 5px;
    span {
      display: inline-block;
      color: @color;
    }
  }
}
</style>