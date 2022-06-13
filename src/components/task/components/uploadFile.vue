<template>
  <div class="upload_file">
    <el-upload
      class="upload-demo"
      :action="domain"
      :data="QiniuData"
      :on-remove="(file, fileList) => handleRemoveFile(file, fileList, item)"
      :on-error="uploadErrorFile"
      :on-success="
        (response, file, fileList) =>
          uploadSuccessFile(response, file, fileList, item)
      "
      :before-remove="
        (file, fileList) => beforeRemoveFile(file, fileList, item)
      "
      :before-upload="beforeAvatarUploadFile"
      multiple
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传附件</el-button>
      <div slot="tip" class="el-upload__tip">
        <p class="upload_p">只能上传不超过20MB的文件</p>
        <p class="upload_p">{{ item.placeholder }}</p>
      </div>
    </el-upload>
  </div>
</template>
<script>
import { getDate } from '@/utils/encryption'
import { genUpToken, uploadQi } from '@/utils/qiniuToken'
export default {
  name: 'upload_file',
  props: {
    fileList: Object,
    item: Object
  },
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
      // fileList: [{ name: '123', url: '-----' }],
      imgList: [],
      nowTime: '',
      fileExtension: '',
      otherlist: [],
    }
  },
  methods: {
    getval (fileList) {
      let otherlist = []
      for (let i in fileList) {
        if (Object.keys(fileList[i]).join(',').indexOf('response') != -1) {
          otherlist.push({ name: fileList[i].response.key, hash: fileList[i].response.hash, url: fileList[i].url })
        }
      }
      return otherlist
    },
    beforeAvatarUploadFile (file) {

      console.log(this.nowTime);
      //这个this.fileExtension是文件名的后缀
      let filename = file.name.split(".")
      this.fileExtension = filename.pop();
      console.log(this.fileExtension);
      console.log(filename)

      //这里的key给加上了时间戳，目的是为了防止上传冲突
      this.nowTime = getDate();
      this.QiniuData.key = `${filename.join('')}__${this.$store.state.corpid}_${this.nowTime}.${this.fileExtension}`;
    },

    uploadSuccessFile (response, file, fileList, item) {
      console.log(fileList);
      console.log(response)
      console.log(file)
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
        this.otherlist = fileList
        console.log(this.fileList)
        console.log(response.data)
        this.fileList.push({ name: response.key.split('__' + this.$store.state.corpid)[0] + '.' + response.key.split('.').pop(), key: response.key, hash: response.hash, url: data.data })
        item.value = this.fileList
        console.log(item)
        this.$emit('updata:item', item)
      }).catch(err => {
        console.log(err)
      })
      console.log(this.fileList)

      console.log(this.uploadPicUrl);
      //在这里你就可以获取到上传到七牛的外链URL了
    },
    uploadErrorFile (err, file, fileList) {
      console.log(err)
      this.$message({
        message: "上传出错，请重试！",
        type: "error",
        center: true
      });
    },
    handleRemoveFile (file, fileList, item) {
      console.log(fileList)
      this.fileList = fileList
      item.value = fileList
      this.$emit('updata:item', item)
      console.log(file)
    },
    beforeRemoveFile (file, fileList, item) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
      console.log(this.fileList)
      // this.otherlist = fileList
      // if (fileList.length > 0) {
      //   item.value = this.getval(fileList)
      //   this.$emit('update:item', item)
      // }
    },

  },
  created () {
    this.nowTime = getDate();
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
  }
}
</script>