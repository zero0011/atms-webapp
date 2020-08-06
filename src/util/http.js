import axios from 'axios'
import QS from 'qs' // 用来序列化post类型的数据
// 环境的切换
if (process.env.NODE_ENV == 'development') {
  // axios.defaults.baseURL = "http://atms.horizon.ai/open/atms/admin"
  // axios.defaults.baseURL = "http://apistore.hobot.cc/mock/1093/open/atms/admin"
  axios.defaults.baseURL = 'http://10.64.152.17:16666/open/atms/admin'
  // axios.defaults.baseURL = "http://10.64.36.183:16060/open/atms/admin"
} else if (process.env.NODE_ENV == 'production') {
  // axios.defaults.baseURL = "http://10.69.2.18:80/open/atms/admin"   //生产环境
  axios.defaults.baseURL = 'http://10.64.152.17:16666/open/atms/admin' //测试环境
  // axios.defaults.baseURL = "http://atms.horizon.ai/open/atms/admin"
}

// axios.defaults.withCredentials = true
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

export function postFormData(url, params) {
  return new Promise((resolve, reject) => {
    axios
      // .post(url, params, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })
      .post(url, params)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
export const baseUrl = axios.defaults.baseURL
