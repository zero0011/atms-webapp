# atms-webapp

# 展示


# 介绍
这是一个后台管理系统平台

主要技术栈为
- vue
- vue-router
- element-ui
- axios

# 结构介绍
- build : 配置文件
- src : 资源文件
    - api : 接口文件
        - api.js : 统一接口
    - assets : 静态资源文件
    - components : 公共组件
    - pages : 路由页面
    - router : 前端路由
    - util : 公共方法
        - http.js : 统一请求方式
- App.vue  : 顶级组件
- main.js : 全局方法

# 功能具体介绍

## 统一前端请求接口
使用axios拦截器进行 token权限认证
```js
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    const token = sessionStorage.getItem('token')
    if (token) {
      // console.log(token)
      config.headers.token = token
    } else if (
      config.url.indexOf('allName') === -1 &&
      config.url.indexOf('login') === -1
    ) {
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    }
    return config
  },
  (error) => {
    return Promise.error(error)
  }
)
```

### get&post请求
```js
//get
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
//post
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, QS.stringify(params))
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
```

## 登录
位置 : src/pages/login-view.vue

```js
login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const userType = this.isAdmin ? 2 : 1
          loginPower({
            userAccount: this.ruleForm.userAccount,
            password: this.ruleForm.password,
            projectId: this.ruleForm.projectId,
            userType
          }).then(res => {
            if (res.state === 1000) {
              this.$message({
                type: 'success',
                message: '登录成功',
                duration: 1000
              })
              // 存到sessionStorage 中, 方便在之后的请求中携带 token
              sessionStorage.setItem('token', res.data.token);
              sessionStorage.setItem('userAccount', this.ruleForm.userAccount)
              sessionStorage.setItem('isAdmin',this.isAdmin)
              sessionStorage.setItem('projectId',this.ruleForm.projectId)
              setTimeout(() => {
                if(this.isAdmin){
                  this.$router.push({ path: '/manage/label' })
                }else{
                  this.$router.push({ path: '/manage/sceneManagement' })
                }
                 
              }, 1000);
            }
            else{
               this.$message({
                type: 'error',
                message: res.message,
                duration: 1000
              })
            }
          })
        } else {
          return false;
        }
      });
    }
```