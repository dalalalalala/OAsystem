// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  login: {
    authority: '*',
    path: '/login',
    component: () => import('@/pages/login')
  },
  register:{
    path: '/register',
    component: () => import('@/pages/register/Register')
  },
  root: {
    path: '/',
    name: '首页',
    redirect: '/login',
    component: view.tabs
  },
  dashboard: {
    name: 'Dashboard',
    component: view.blank
  },
  workplace: {
    name: '工作台',
    component: () => import('@/pages/dashboard/workplace')
  },
  analysis: {
    name: '分析页',
    component: () => import('@/pages/dashboard/analysis')
  },
  form: {
    name: '表单页',
    icon: 'form',
    component: view.page
  },
  basicForm: {
    path: 'basic',
    name: '基础表单',
    component: () => import('@/pages/form/basic')
  },
  stepForm: {
    path: 'step',
    name: '分步表单',
    component: () => import('@/pages/form/step')
  },
  advanceForm: {
    path: 'advance',
    name: '高级表单',
    component: () => import('@/pages/form/advance')
  },
  list: {
    name: '列表页',
    icon: 'table',
    component: view.page
  },
  queryList: {
    path: 'query',
    name: '查询表格',
    component: () => import('@/pages/list/QueryList')
  },
  primaryList: {
    path: 'primary',
    name: '标准列表',
    component: () => import('@/pages/list/StandardList')
  },
  cardList: {
    path: 'card',
    name: '卡片列表',
    component: () => import('@/pages/list/CardList')
  },
  searchList: {
    path: 'search',
    name: '搜索列表',
    component: () => import('@/pages/list/search/SearchLayout')
  },
  article: {
    name: '文章',
    component: () => import('@/pages/list/search/ArticleList')
  },
  application: {
    name: '应用',
    component: () => import('@/pages/list/search/ApplicationList')
  },
  project: {
    name: '项目',
    component: () => import('@/pages/list/search/ProjectList')
  },
  details: {
    name: '详情页',
    icon: 'profile',
    component: view.blank
  },
  basicDetails: {
    path: 'basic',
    name: '基础详情页',
    component: () => import('@/pages/detail/BasicDetail')
  },
  advanceDetails: {
    path: 'advance',
    name: '高级详情页',
    component: () => import('@/pages/detail/AdvancedDetail')
  },
  result: {
    name: '结果页',
    icon: 'check-circle-o',
    component: view.page
  },
  success: {
    name: '成功',
    component: () => import('@/pages/result/Success')
  },
  error: {
    name: '失败',
    component: () => import('@/pages/result/Error')
  },
  exception: {
    name: '异常页',
    icon: 'warning',
    component: view.blank
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/pages/exception/404')
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: () => import('@/pages/exception/500')
  },
  components: {
    name: '小组件',
    icon: 'appstore-o',
    component: view.page
  },
  taskCard: {
    name: '任务卡片',
    component: () => import('@/pages/components/TaskCard')
  },
  palette: {
    name: '颜色复选框',
    component: () => import('@/pages/components/Palette')
  },

  personal: {
    name: '个人中心',
    invisible: true,
    component: () => import('@/pages/personal/PersonalList')
  },
  institution: {
    name: '组织机构',
    component: () => import('@/pages/institution/Institutionlist')
  },
  personinfo: {
    name: '人员信息',
    component: () => import('@/pages/personinfo/PersoninfoList')
  },
  roleinfo: {
    name: '角色信息',
    invisible: true,
    component: () => import('@/pages/roleinfo/RoleinfoList')
  },
  limit: {
    name: '权限管理',
    invisible: true,
    component: () => import('@/pages/limit/LimitList')
  },
  projectinfo: {
    name: '项目信息',
    component: () => import('@/pages/projectinfo/ProjectinfoList')
  },
  projectcom: {
    name: '项目完成度',
    component: () => import('@/pages/projectcom/ProjectcomList')
  },
  assignTask: {
    name: '派发任务',
    invisible: true,
    component: () => import('@/pages/assignTask/AssignTaskList')
  },
  mytask: {
    name: '我的任务',
    component: () => import('@/pages/mytask/MytaskList')
  },
  teamtask: {
    name: '队员任务',
    invisible: true,
    component: () => import('@/pages/teamtask/TeamTaskList')
  },
  taskcom: {
    name: '任务完成度',
    component: () => import('@/pages/taskcom/TaskcomList')
  },
  // approval: {
  //   name: '审批管理',
  //   component: () => import('@/pages/components/Palette')
  // },
  myApprove: {
    name: '我的审批',
    component: () => import('@/pages/myApprove/MyApproveList')
  },
  waitApprove:{
    name: '待我审批',
    component: () => import('@/pages/waitApprove/WaitApproveList')
  },
  approvalnotice: {
    name: '审批单信息',
    component: () => import('@/pages/components/Palette')
  },
  operatetask: {
    name: '操作任务信息',
    component: () => import('@/pages/components/Palette')
  },

  teamwork: {
    name: '团队管理',
    component: view.blank
  },
  projectwork: {
    name: '项目管理',
    component: view.blank
  },
  taskwork: {
    name: '任务管理',
    component: view.blank
  },
  approval: {
    name: '审批管理',
    component: view.blank
  },
  systeminfo: {
    name: '系统信息',
    invisible: true,
    component: view.blank
  },
}
export default routerMap

