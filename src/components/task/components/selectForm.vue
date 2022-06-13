<template>
  <div class="select_form">
    <el-dialog
      :append-to-body="true"
      title="选择表单"
      :visible.sync="my_is_add"
      :close-on-click-modal="false"
      :custom-class="'depart_aldert_dialog'"
      width="600px"
      height="700px"
      :before-close="handleClose"
      @close="close"
    >
      <el-form @submit.native.prevent>
        <el-form-item label="任务分类名称">
          <el-input v-model="content" placeholder="请填写"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="my_is_add = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="addType()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'select_form',
  props: {
    is_add: Boolean
  },
  data () {
    return {
      my_is_add: false
    }
  },
  methods: {
    close () {
      this.my_is_add = false
    }
  },
  watch: {
    is_add (val) {
      this.my_is_add = val
    },
    my_is_add (val) {
      this.$emit('back', val)
    }
  }
}
</script>