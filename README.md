# atms-webapp

# 展示
![Image text](https://github.com/zero0011/puzzle_look/blob/master/static/img/login.png)

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

## 首页结构
我采用 header 导航栏固定 , 左侧菜单栏固定 , 中间组件切换的布局

![Image text](https://github.com/zero0011/puzzle_look/blob/master/static/img/main.png)

```vue
<template>
  <div class="box">
    <HeaderBar></HeaderBar>
    <div class="container">
      <SideMenu></SideMenu>
      <div class="container-right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.box {
  display: flex;
  flex-direction: column;
  height: 100%;
  background:#f0f2f5;
  .container {
    flex: 1;
    display: flex;
    height: calc(100% - 64px);
    .container-right{
      flex: 1;
      margin: 20px;
      background:#fff;    
      width: calc(100% - 290px);
    }
  }
}
</style>
```

## 项目难点

### 视频播放
![Image text](https://github.com/zero0011/puzzle_look/blob/master/static/img/video.png)
基本功能
- 视频显示
- 播放 
- 暂停 
- 进度条

**请求接口**
```js
// url 是 视频流地址
playPack({ packId: rowData.id }).then((res) => {
    if (res.state === 1000) {
        this.url = res.data.path
    }
})
```

**视频进度条html**
```html
<img :src="packUrl" />
<vue-slider v-model="value" @drag-end="change()" ref="slider" drag-on-click/>

// packUrl 视频地址
// vue-slide 是视频进度条
```
**视频脚本**
```js
// 监听 url 变化
watch : {
    url(val) {
      this.packUrl = val
      this.sliderSpeed()
    }
}
```

```js
// 对应的进度条的变化

sliderSpeed() {
    let _this = this
    if(_this.timer&&this.count===2){
    this.value=0
    clearInterval(this.timer)
    }
    const speed = (100 / (_this.frameNumber /(_this.count*25))) / 20
    _this.timer = setInterval(() => {    
    _this.value += speed
    if (_this.value >= 100) {
        clearInterval(_this.timer)
        _this.value = 0
    }
    }, 50)
}

```

### 文件上传

```html
<!-- 上传的html -->
<el-upload
    class="upload-demo"
    :action="url"
    :show-file-list="false"
    accept=".json"
    :before-upload="beforeUploadFile"
    :on-success="uploadSuccess"
    :data="upLoadText"
    :headers="importHeaders"
  >
  <el-button type="primary" @click="upLoadFile()">json文件导入</el-button>
</el-upload>
```

```js
// 验证文件类型和文件大小
beforeUploadFile(file) {
  this.fileName = file.name.slice(0, file.name.lastIndexOf('.'))
  const fileSize = file.size / 1024 / 1024 < 3
  const fileType = file.type === 'application/json'
  if (!fileSize) {
    this.$message.error('上传文件大小不能超过3MB!')
  }
  if (!fileType) {
    this.$message.error('上传文件只能json')
  }
  return fileSize && fileType
}

// 导入前增加用户名参数

upLoadFile() {
  this.upLoadText = {
    accountName: sessionStorage.getItem('userAccount')
  }
}


// 上传前增加 token 头部,验证用户信息

created() {
  this.importHeaders={token:sessionStorage.getItem('token')}
}

```

