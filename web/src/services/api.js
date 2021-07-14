//跨域代理前缀
// const API_PROXY_PREFIX ='http://localhost:8081/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  LOGIN: `/api/users/login`,
  REGISTER: `/api/users/register`,
  GETCODE:`/api/users/getcode`,
  CODECHECK: `/api/users/codecheck`,
  ROUTES: `${BASE_URL}/routes`,
  GOODS: `${BASE_URL}/goods`,
  GOODS_COLUMNS: `${BASE_URL}/columns`,

  UPLOADIMG: `/api/personal/uploadImg`,
  PERSONAL_EDIT: `/api/personal/edit`,

  // 项目管理
  PROJECTINFO_EDIT: `/api/projectinfo/edit`,
  PROJECTINFO_LIST: `/api/projectinfo/list`,
  PROJECTINFO_GETBYID: `/api/projectinfo/getByid`,
  PROJECTINFO_REMOVE: `/api/projectinfo/remove`,
  PROJECTINFO_BATCHREMOVE: `/api/projectinfo/batchRemove`,
  PROJECTINFO_GETBYUSERNAME: `/api/projectinfo/getByuserName`,

  // 组织结构
  INSTITUTION_EDIT: `/api/institution/edit`,
  INSTITUTION_LIST: `/api/institution/list`,
  INSTITUTION_GETBYID: `/api/institution/getByid`,
  INSTITUTION_REMOVE: `/api/institution/remove`,
  INSTITUTION_BATCHREMOVE: `/api/institution/batchRemove`,

  // 角色
  ROLE_EDIT: `/api/role/edit`,
  ROLE_LIST: `/api/role/list`,
  ROLE_GETBYID: `/api/role/getByid`,
  ROLE_REMOVE: `/api/role/remove`,
  ROLE_BATCHREMOVE: `/api/role/batchRemove`,
  ROLE_BATCHAdd: `/api/role/batchAdd`,

  // 人员信息
  PERSONINFO_EDIT: `/api/personinfo/edit`,
  PERSONINFO_LIST: `/api/personinfo/list`,
  PERSONINFO_GETBYID: `/api/personinfo/getByid`,
  PERSONINFO_REMOVE: `/api/personinfo/remove`,
  PERSONINFO_BATCHREMOVE: `/api/personinfo/batchRemove`,

  // 权限管理
  LIMIT_EDIT: `/api/limit/edit`,
  LIMIT_LIST: `/api/limit/list`,
  LIMIT_GETBYID: `/api/limit/getByid`,
  LIMIT_REMOVE: `/api/limit/remove`,
  LIMIT_BATCHREMOVE: `/api/limit/batchRemove`,

  // 便签
  NOTE_EDIT: `/api/note/edit`,
  NOTE_LIST: `/api/note/list`,
  NOTE_GETBYID: `/api/note/getByid`,
  NOTE_REMOVE: `/api/note/remove`,
  NOTE_BATCHREMOVE: `/api/note/batchRemove`,

  // 项目步骤
  ITEMSTEP_EDIT: `/api/itemStep/edit`,
  ITEMSTEP_LIST: `/api/itemStep/list`,
  ITEMSTEP_GETBYID: `/api/itemStep/getByid`,
  ITEMSTEP_REMOVE: `/api/itemStep/remove`,
  ITEMSTEP_BATCHREMOVE: `/api/itemStep/batchRemove`,

  // 任务管理
  TASK_EDIT: `/api/task/edit`,
  TASK_LIST: `/api/task/list`,
  TASK_GETBYID: `/api/task/getByid`,
  TASK_REMOVE: `/api/task/remove`,
  TASK_BATCHREMOVE: `/api/task/batchRemove`,
  TASK_GETBYITEMANDUSER: `/api/task/getByitemAndUser`,

  

  // 审批管理
  APPLICATION_EDIT: `/api/application/edit`,
  APPLICATION_EDITAPPROVE: `/api/application/editApprove`,
  APPLICATION_LIST: `/api/application/list`,
  APPLICATION_GETBYID: `/api/application/getByid`,
  APPLICATION_REMOVE: `/api/application/remove`,
  APPLICATION_BATCHREMOVE: `/api/application/batchRemove`,
  APPLICATION_BATCHAPPROVE: `/api/application/batchApprove`,

  // 活动状态
  OPERATION_EDIT: `/api/operation/edit`,
  OPERATION_LIST: `/api/operation/list`,
  OPERATION_GETBYID: `/api/operation/getByid`,
  OPERATION_REMOVE: `/api/operation/remove`,
  OPERATION_BATCHREMOVE: `/api/operation/batchRemove`,
}
