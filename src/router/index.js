import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/learning/teacher',
    component: Layout,
    redirect: '/learning/teacher/list',
    name: 'teacher',
    meta: { title: '讲师管理', icon: '' },
    children: [
      {
        path: 'list',
        name: 'teacherList',
        component: () => import('@/views/learning/teacher/list'),
        meta: { title: '讲师列表', icon: '' }
      },
      {
        path: 'form',
        name: 'teacherForm',
        component: () => import('@/views/learning/teacher/form'),
        meta: { title: '添加讲师', icon: '' }
      },
      {
        path: 'edit/:id',
        name: 'tacherEdit',
        component: () => import('@/views/learning/teacher/form'),
        meta: { title: '编辑讲师' },
        hidden: true
      }
    ]
  },

  {
    path: '/learning/course',
    component: Layout,
    redirect: '/learning/course/list',
    name: 'course',
    meta: {
      title: '课程管理',
      icon: ''
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/learning/course/list'),
        name: 'courseList',
        meta: { title: '课程列表' }
      },
      {
        path: 'add',
        component: () => import('@/views/learning/course/add'),
        meta: { title: '发布课程' }
      },
      {
        path: 'categoryList',
        name: 'categoryList',
        component: () => import('@/views/learning/category/list'),
        meta: { title: '课程分类管理' }
      },
      {
        path: 'add/:id',
        component: () => import('@/views/learning/course/add'),
        meta: { title: '编辑课程基本信息' },
        hidden: true
      },
      {
        path: 'chapter/:id',
        component: () => import('@/views/learning/course/chapter'),
        meta: { title: '编辑课程大纲' },
        hidden: true
      },
      {
        path: 'publish/:id',
        component: () => import('@/views/learning/course/publish'),
        meta: { title: '确认发布' },
        hidden: true
      }
    ]
  },

  {
    path: '/home',
    component: Layout,
    redirect: 'home/banner/banner/list',
    name: 'home',
    meta: { title: '首页内容管理', icon: '' },
    children: [
      {
        path: 'banner/list',
        name: 'bannerList',
        component: () => import('@/views/home/banner/list'),
        meta: { title: '轮播图列表' }
      },
      {
        path: 'banner/add',
        name: 'bannerAdd',
        component: () => import('@/views/home/banner/add'),
        meta: { title: '轮播图添加' }
      },
      {
        path: 'banner/edit/:id',
        name: 'bannerEdit',
        component: () => import('@/views/home/banner/add'),
        meta: { title: '编辑轮播图' },
        hidden: true
      }
    ]
  },

  {
    path: '/plan',
    component: Layout,
    redirect: 'plan/list',
    name: 'plan',
    meta: { title: '培训计划管理', icon: '' },
    children: [
      {
        path: 'list',
        name: 'planList',
        component: () => import('@/views/plan/list'),
        meta: { title: '培训计划列表' }
      },
      {
        path: 'add',
        name: 'planAdd',
        component: () => import('@/views/plan/add'),
        meta: { title: '发布培训计划' }
      },
      {
        path: 'edit/:id',
        name: 'planEdit',
        component: () => import('@/views/plan/add'),
        meta: { title: '编辑培训计划' },
        hidden: true
      },
      {
        path: 'staff',
        name: 'planStaff',
        component: () => import('@/views/plan/planStaffList'),
        meta: { title: '职工培训情况' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
