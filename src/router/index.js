import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../pages/login-view.vue")
  },
  {
    path: "/manage",
    component: () => import("../pages/main/Main.vue"),
    children:[
      // 我的项目
      {
        path:"/manage/myProject",
        component:()=>import("../pages/project/my-project.vue")
      },
      {
        path:"/manage/user",
        component:()=>import("../pages/project/project-user.vue")
      },
      //标签管理
      {
        path:"/manage/label",
        component:()=>import("../pages/label/label-manage.vue")
      },
      {
        path:"/manage/historyLabel",
        component:()=>import("../pages/label/label-history.vue")
      },
      {
        path:'/manage/dataset',
        component:()=>import('../pages/dataSet/dataset-manage.vue')
      },
      {
        path:'/manage/sceneLibrary',
        component:()=>import('../pages/sceneLibrary/scene-library-manage.vue')
      },
      {
        path:'/manage/datasetDetail',
        component:()=>import('../pages/dataSet/dataset-detail.vue')
      },
      {
        path:'/manage/versionManagement',
        component: () => import('../pages/version/version-management.vue')
      },
      {
        path: '/manage/scene',
        component: () => import('../pages/sceneLibrary/scene-manage.vue')
      },
      {
        path:'/manage/gt',
        component:()=>import('../pages/dataSet/gt-manage.vue')
      },
      {
        path:'/manage/pack',
        component:()=>import('../pages/dataSet/pack-manage.vue')
      },
      {
        path:'/manage/image',
        component:()=>import('../pages/dataSet/image-manage.vue')
      },
      {
        path:'/manage/sceneManagement',
        component: () => import('../pages/scene/scene-management.vue')
      },
      {
        path:'/manage/gtDetail',
        component:()=>import('../pages/dataSet/gt-detail.vue')
      },
      {
        path:'/manage/badcase',
        component:()=>import('../pages/badcase/badcase-main.vue')
      },
      {
        path:'/manage/badcaseHistory',
        component:()=>import('../pages/badcase/badcase-history.vue')
      },
      {
        path:'/manage/historyDetail',
        component:()=>import('../pages/badcase/history-detail.vue')
      }
    ]
  },
];

const router = new VueRouter({
  mode: "hash",
  // base: process.env.BASE_URL,
  routes,
});

export default router;
