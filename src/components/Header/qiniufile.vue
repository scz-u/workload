<template>
  <div>
    <el-upload
      class="upload-pic"
      :action="domain"
      :data="QiniuData"
      :on-remove="handleRemove"
      :on-error="uploadError"
      :on-success="uploadSuccess"
      :before-remove="beforeRemove"
      :before-upload="beforeAvatarUpload"
      multiple
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传图片</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过2MB
      </div>
    </el-upload>
    <div>
      <img class="pic-box" :src="uploadPicUrl" v-if="uploadPicUrl" />
    </div>
    <div>{{ uploadPicUrl }}</div>
  </div>
</template>
<script>
import { genUpToken, uploadQi } from '../../utils/qiniuToken'
export default {
  name: 'index',
  data () {
    return {
      uploadKey: "0pc99vFCTZFb-FxnwxuyzbVcmlC_n0qkQ37INru4",
      uploadToken: "gbNuDHhFDyjIRLDXdJ6HRzp-uc_D6QypslKMJ85m",
      baseUrl: "http://images.xxxx.cn/",
      QiniuData: {
        key: "", //图片名字处理
        token: "" //七牛云token
      },
      // domain: "http://up-z2.qiniu.com", // 七牛云的上传地址（华南区）
      domain: "https://upload-z1.qiniup.com", // 七牛云的上传地址（华北区）
      qiniuaddr: "http://xxx/", // 七牛云的图片外链地址 你的七牛云里配置有
      uploadPicUrl: "", //提交到后台图片地址
      fileList: [],
      nowTime: '',
      fileExtension: ''
    }
  },
  methods: {
    //upload的生命周期函数见element-ui官方文档 https://element.eleme.cn/#/zh-CN/component/upload#methods
    handleRemove (file, fileList) {
      this.uploadPicUrl = "";
    },
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 1 张图片，如需更换，请删除上一张图片在重新选择！`
      );
    },
    beforeAvatarUpload (file) {
      const isPNG = file.type === "image/png";
      const isJPEG = file.type === "image/jpeg";
      const isJPG = file.type === "image/jpg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPNG && !isJPEG && !isJPG) {
        this.$message.error("上传图片只能是 jpg、png、jpeg 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false;
      }
      const isSize = new Promise(function (resolve, reject) {
        let width = 100;
        let height = 100;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function () {
          //在这里可以获取你上传图片的宽高size 
          console.log(`img.width:${img.width} img.height:${img.height} img.size:${file.size}`)
          let valid = img.width >= width && img.height >= height;
          valid ? resolve() : reject();
        }
        img.src = _URL.createObjectURL(file);
      }).then(() => {
        return file;
      }, () => {
        this.$message.error('上传的icon必须是等于或大于100*100!');
        return Promise.reject();
      });
      console.log(this.nowTime);
      //这个this.fileExtension是文件名的后缀
      this.fileExtension = file.name.split(".").pop();
      console.log(this.fileExtension);
      //这里的key给加上了时间戳，目的是为了防止上传冲突
      this.QiniuData.key = `upload_pic_${this.nowTime}.${this.fileExtension}`;
    },
    uploadSuccess (response, file, fileList) {
      console.log(fileList);
      console.log(response)
      this.uploadPicUrl = `${this.qiniuaddr}/${response.key}`;
      // this.uploadPicUrl = uploadQi(this.uploadToken, this.uploadToken, this.qiniuaddr, response.key)

      let $this = this
      let payload = {
        key: response.key
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['qiniudown'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)

        this.uploadPicUrl = data.data
      }).catch(err => {
        console.log(err)
      })


      console.log(this.uploadPicUrl);
      //在这里你就可以获取到上传到七牛的外链URL了
    },
    uploadError (err, file, fileList) {
      console.log(err)
      this.$message({
        message: "上传出错，请重试！",
        type: "error",
        center: true
      });
    },
    beforeRemove (file, fileList) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
    },
    //以下是时间戳函数
    getDate () {
      var myDate = new Date();
      //获取当前年
      var year = myDate.getFullYear();
      //获取当前月
      var month = myDate.getMonth() + 1;
      //获取当前日
      var date = myDate.getDate();
      var h = myDate.getHours(); //获取当前小时数(0-23)
      var m = myDate.getMinutes(); //获取当前分钟数(0-59)
      var s = myDate.getSeconds();
      //获取当前时间
      var now = year + '_' + this.conver(month) + "_" + this.conver(date) + "_" + this.conver(h) + '_' + this.conver(m) + "_" + this.conver(s);
      return now;
    },
    conver (s) {
      return s < 10 ? '0' + s : s;
    },


  },
  computed: {
  },
  created () {
    this.nowTime = this.getDate();
    console.log(this.nowTime)
    var token;
    var policy = {};
    var bucketName = 'xxx';//你的七牛桶名称
    var AK = this.uploadToken; //你的七牛AK
    var SK = this.uploadKey;//你的七牛SK
    var deadline = Math.round(new Date().getTime() / 1000) + 3600;
    policy.scope = bucketName;
    policy.deadline = deadline;
    token = genUpToken(AK, SK, policy);
    this.QiniuData.token = token;
    console.log(this.QiniuData.token);
  },

  mounted () {
    // this.getQiniuToken();
  }
}
</script>