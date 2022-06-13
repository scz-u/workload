
export const apilist = {

  //--------------------------------------------------------
  'getloginuserid': 'api/common/getloginuserid',//auth_code  手机端
  'getpcloginuser': 'api/common/getpcloginuser',//auth_code  pc端
  'getjssdksign': 'api/common/getjssdksign',//corpid url

  //通讯录
  'getalluserinfobydepartid': 'api/user/getalluserinfobydepartid',//通过departid 获取用户 corpid  department_id  page_size  page_index 
  'getalldepartment': 'api/department/getalldepartment',//部门列表corpid
  'getalldepartmentanduser': 'api/department/getalldepartmentanduser',//corpid
  'adddepartment': 'api/department/adddepartment',//添加部门 corpid department  parentid
  'deldepartment': 'api/department/deldepartment',//删除部门 corpid  department_id
  'editdepartment': 'api/department/editdepartment',//编辑部门 corpid  department_id  parent_id  department
  'checkuserid': 'api/user/checkuserid',//检查用户名 corpid userid
  'checkmobile': 'api/user/checkmobile',//检查手机号 corpid mobile
  'addoneuser': 'api/user/addoneuser',//添加成员 departids  userid  corpid  username  mobile
  'edituser': 'api/user/edituser',//编辑成员 departids userid  corpid  username  mobile
  'deloneuser': 'api/user/deloneuser',//删除成员 corpid userid
  'deluserinfos': 'api/user/deluserinfos',//批量删除 corpid userids
  'uploadfiles': 'api/common/uploadfiles',//上传 file userid
  'uploadimages': 'api/common/uploadimages',//
  'adduserbyexcel': 'api/user/adduserbyexcel',//doc_code corpid departid
  'exportalluser': 'api/user/exportalluser',//导出 corpid
  'searchuser': 'api/user/searchuser',//搜索 corpid query_data depart_id
  'oneuserdetail': 'api/user/oneuserdetail',//userid corpid
  'addadmin': 'api/user/addadmin',//admin_userid corpid
  'deloneadmin': 'api/user/deloneadmin',//userid admin_userid corpid
  'getalladmin': 'api/user/getalladmin',//corpid
  //表单
  'addone': 'api/type/addone',// corpid type_desc  content  userid
  'getalltemplateform': 'api/form/getalltemplateform',//corpid userid  获取所有的模板
  'addonetemplateform': 'api/form/addonetemplateform',//创建模板 corpid  userid  form_info 
  'gettemplateformdetail': 'api/form/gettemplateformdetail',//form_code  获取该模板的详情
  'deltemplateform': 'api/form/deltemplateform',//form_code 删除
  'getallbytype': 'api/type/getallbytype',//typedesc  corpid  userid
  'editone': 'api/type/editone',//corpid id content
  'delone': 'api/type/delone',//corpid id userid
  'edittype': 'api/form/edittype',//code type_id
  'edittitle': 'api/form/edittitle',//code title
  'updatecooper': 'api/form/updatecooper',//code cooper

  'checkformula': 'api/form/checkformula',//formula_methods
  'getallformbytypeid': 'api/form/getallformbytypeid',//userid corpid type_id
  'getallauthorizetemplateform': 'api/form/getallauthorizetemplateform',// corpid userid 获取他人授权给我的模板
  'getallauthorizeformbytypeid': 'api/form/getallauthorizeformbytypeid',//corpid userid type_id 通过类型查看所有
  'createonetask': 'api/task/createonetask',//corpid userid base_info form_info workflow_info
  'getallformtree': 'api/form/getallformtree',//userid corpid

  'createoneworkflow': 'api/task/createonetask',//base_info  form_info  workflow_info
  'getalltaskbyuserid': 'api/task/getalltaskbyuserid',//userid corpid type_id  其中如果type_id不传就是全部
  'deltask': 'api/task/deltask',//task_code
  'switchtaskstate': 'api/task/switchtaskstate',//task_code state
  'updatescope': 'api/task/updatescope',//task_code scope  scope是json
  'gettaskfullinfo': 'api/task/gettaskfullinfo',//task_code  获取
  'gettemplateform': 'api/form/gettemplateform',//userid corpid
  'gettemplatedetailbyformcode': 'api/form/gettemplatedetailbyformcode',//form_code

  'usercheckpermission': 'api/common/usercheckpermission',//
  'getlistbytaskcode': 'api/maindata/getlistbytaskcode',//userid  task_code
  'addone_main': 'api/maindata/addone',//corpid userid form_field_info  form_code  task_code
  'getallauthorizetaskbyuserid': 'api/task/getallauthorizetaskbyuserid',//userid corpid 授权的任务
  'getalltaskbytypeid': 'api/task/getalltaskbytypeid',//userid corpid type_id page_index page_size 通过type_id查看所有task  分页
  'getallauthorizetaskbytypeid': 'api/task/getallauthorizetaskbytypeid',//userid corpid type_id page_index page_size 通过type_id查看所有授权task  分页
  'selfcreatesearch': 'api/task/selfcreatesearch',//userid corpid title  搜索自己创建的任务
  'authorizesearch': 'api/task/authorizesearch',//userid corpid title  搜索授权的任务   
  'getallclosedtaskbyuserid': 'api/task/getallclosedtaskbyuserid',//

  'getreporttask': 'api/task/getreporttask',//userid corpid，进行中的填报任务
  'getreportedtask': 'api/task/getreportedtask',//userid corpid,结束的填报任务
  'getformlist': 'api/task/getformlist',//task_code
  'getformdetail': 'api/task/getformdetail',//form_code
  'getreportedtaskbytypeid': 'api/task/getreportedtaskbytypeid',//

  'countfunction': 'api/maindata/countfunction',//form_code  rule_file_info
  'allusernameandid': 'api/user/allusernameandid',//corpid
  'allmaindatabyformcodeanduserid': 'api/maindata/allmaindatabyformcodeanduserid',//task_code userid form_code
  'detailbycode': 'api/maindata/detailbycode',//main_code
  'delone_main': 'api/maindata/delone',//
  'batchdel': 'api/maindata/batchdel',//
  'edit': 'api/maindata/edit',//main_code form_field_info
  'counttempfunction': 'api/maindata/counttempfunction',//

  'checkaudittype': 'api/maindata/checkaudittype',//task_code 获取下这个任务的审核类型 审核类型一共三种  一个是不用审批  一个是自己选择审批 一个是按照自己的工号自动审批
  //不要审批的情况
  'commitmaindatawithoutaudit': 'api/maindata/commitmaindatawithoutaudit',//main_code  提交审批
  'batchcommitmaindatawithoutaudit': 'api/maindata/batchcommitmaindatawithoutaudit',//main_codes  批量提交审批 传数组
  //自己选择审批
  'getauditlist': 'api/maindata/getauditlist',//审批列表   task_code
  'commitmaindatawithnodecode': 'api/maindata/commitmaindatawithnodecode',//提交审批   main_code  depart_code  node_code
  'batchcommitmaindatawithnodecode': 'api/maindata/batchcommitmaindatawithnodecode',//批量提交审批   main_codes  depart_code  node_code
  //按照条件直接审批
  'commitmaindatawithtask': 'api/maindata/commitmaindatawithtask',//main_code
  'batchcommitmaindatawithtask': 'api/maindata/batchcommitmaindatawithtask',//main_codes
  'callbackone': 'api/maindata/callbackone',//main_code
  'edit_main': 'api/maindata/edit',//main_code form_field_info
  //审批
  'alltoauditelist': 'api/maindata/alltoauditelist',//userid corpid 获取审批列表
  'allhaveauditedlist': 'api/maindata/allhaveauditedlist',//userid corpid  已审批列表
  'denyone': 'api/maindata/denyone',//main_code  userid content 拒绝
  'denymaindatas': 'api/maindata/denymaindatas',//main_codes userid content 批量拒绝
  'approveone': 'api/maindata/approveone',//main_code  userid 通过
  'approvemaindatas': 'api/maindata/approvemaindatas',//main_codes userid 批量通过

  'getallloginfobydatacode': 'api/maindata/getallloginfobydatacode',//

  'gatherlist': 'api/gather/gatherlist',//corpid task_code
  'export': 'api/gather/export',//corpid task_code
  'qiniudown': 'api/common/qiniudown',//key
  'login': 'api/user/login',//userid passwd
  'qiniutoken': 'api/common/qiniutoken',//get

  'deltemplateform': 'api/form/deltemplateform',//form_code

  'getselfformlist': 'api/task/getselfformlist',//
  'count': 'api/maindata/count',//task_code form_code
  'adminaddone': 'api/maindata/adminaddone',//admin_userid  corpid  form_field_info  form_code  userid  task_code
  'getexceltemplate': 'api/task/getexceltemplate',//form_code
  'addmaindatabyexcel': 'api/task/addmaindatabyexcel',//doc_code  userid  corpid  task_code  form_code

  //登录注册
  'signup': 'api/login/signup',//注册 corp_name userid  user_name mobile passwd
  'signin': 'api/login/signin',//登录 mobile passwd
  'checkmobile': 'api/login/checkmobile',//手机号检查 mobile
  'ssyzm': 'api/login/ssyzm',//start end
  'checkyzm': 'api/login/checkyzm',//ssid randf
  'checkad': 'api/login/checkad',//corpid userid
  'sendsms': 'api/login/sendsms',//mobile  验证码
  'loginbymobile': 'api/login/loginbymobile',//mobile verify_code
  'setpassswd': 'api/login/setpassswd',//userid corpid passwd
  'updatepersonaldata': 'api/user/updatepersonaldata',//userid corpid mobile passwd change_userid name 修改哪个传哪个  
  'checkmobileyzm': 'api/login/checkmobileyzm',//mobile verify_code
  'gatherlistbyuserid': 'api/gather/gatherlistbyuserid',//corpid userid task_code  个人汇总
  'othertoselfassigndata': 'api/maindata/othertoselfassigndata',//task_code corpid userid form_code 他人分配给自己的，如果不传form_code 就是这个任务所有的

  'checkisauditor': 'api/task/checkisauditor',//corpid userid
  'getallaudittaskbyuserid': 'api/task/getallaudittaskbyuserid',//corpid userid page_index page_size
  'gatherlistaudit': 'api/gather/gatherlistaudit',//corpid task_code userid
  'exportaudit': 'api/gather/exportaudit',//corpid task_code userid
  'getaudformlist': 'api/task/getaudformlist',//userid corpid task_code
  'allmaindatabyformcodeandaudituserid': 'api/maindata/allmaindatabyformcodeandaudituserid',//task_code userid form_code corpid

  'getallopentemplateform': 'api/form/getallopentemplateform',//
  'installopentemplateform': 'api/form/installopentemplateform',//corpid userid form_code
  'getallopenformbytypeid': 'api/form/getallopenformbytypeid',//type_id
  'allpubmaindatabyformcodeanduserid': 'api/maindata/allpubmaindatabyformcodeanduserid',//task_code userid form_code

  'getpubinfo': 'api/pubtask/getpubinfo',//task_code
  'updatepubinfo': 'api/pubtask/updatepubinfo',//task_code state start_date end_date pub_scope
  'allpubtask': 'api/pubtask/allpubtask',//userid corpid page_index page_size
  'allpubdata': 'api/pubtask/allpubdata',//userid corpid task_code form_code


  'alltype': 'api/market/alltype',//
  'addonetype': 'api/market/addonetype',//parent_id  content 大类的parent_id是1
  'editonetype': 'api/market/editonetype',//id content
  'delonetype': 'api/market/delonetype',//id  其中一个错误  90001 存在子类不可删除
  'alltemplate': 'api/market/alltemplate',//ac type_id
  'addtemplate': 'api/market/addtemplate',//userid  form_info
  'activetemplate': 'api/market/activetemplate',//form_code active
  'deltemplate': 'api/market/deltemplate',//form_code
  'gettemplateformdetail_market': 'api/market/gettemplateformdetail',//
  'login_market': 'api/market/login',//userid passwd
  'dependencies': 'api/charts/dependencies',//userid corpid
  'counttempfunction_market': 'api/market/counttempfunction',//form_code rule_file_info

  'fsearch': 'api/maindata/fsearch',//corpid task_codes  userid  start_time  end_time  content
  'alltaskinfo': 'api/task/alltaskinfo',//cproid
  'allusernameandid': 'api/user/allusernameandid',//cproid




  //mobile
  'mobiletasklist': 'api/task/mobiletasklist',//corpid  userid type_id page_index
  'checkisauditor': 'api/task/checkisauditor',//userid corpid
  'mobiletasktype': 'api/task/mobiletasktype',//userid corpid 获取所有type
  'batchdel': 'api/maindata/batchdel',//main_codes 批量删除
  'gatherbyuserid': 'api/gather/gatherbyuserid',//汇总 corpid  mission_code  userid

  //----------------
  'checkauditmission': 'api/mission/checkauditmission',//corpid  userid确认用户是否有审核任务
  'missionlistbyuserid': 'api/mission/missionlistbyuserid',//corpid  userid  type_id  page_index get 如果type_id不传 就是全部

  'ruleinfobymissioncode': 'api/mission/ruleinfobymissioncode',//corpid mission_code 某个任务下的规则
  'addonemaindata': 'api/maindata/addonemaindata',//corpid  rule_code  rule_file_info  create_userid  mission_code
  'enableassign': 'api/rules/enableassign',//rule_code  是否需要分配
  'enablecount': 'api/rules/enablecount',//rule_code 是否需要计算
  'commitmaindata': 'api/maindata/commitmaindata',//提交审批 data_codes  audit_code data_codes为数组
  'recallonemaindata': 'api/maindata/recallonemaindata',//data_code  撤回一条
  'recallmaindatas': 'api/maindata/recallmaindatas',//data_codes 批量撤回  data_codes为数组
  'auditinfobymissioncode': 'api/mission/auditinfobymissioncode',//mission_code  获取该任务下的审批流程列表
  'getalltoautidmaindata': 'api/maindata/getalltoautidmaindata',//userid  is_pass  如果is_pass传值就是已经通过的，不传就是需要审批的
  'applyonemaindata': 'api/maindata/applyonemaindata',//data_code  userid  通过一条
  'applymaindatas': 'api/maindata/applymaindatas',//data_codes  userid  批量通过
  'missiontypesbyuserid': 'api/mission/missiontypesbyuserid',//corpid  userid
  'delmaindatabycodes': 'api/maindata/delmaindatabycodes',//corpid  data_code

  'getopenid': 'api/login/getopenid',// code
  'unbinduser': "api/login/unbinduser",//openid  userid  coprid  解绑
  'openidtouserid': 'api/login/openidtouserid',//openid
  'loginbymobile': 'api/login/loginbymobile',//
  'signin': 'api/login/signin',//增加openid

};