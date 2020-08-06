import { post, get, postFormData, put } from '../util/http'
// 登录
export const loginPower = p => post('/user/login.action', p)
// 登录页面获取所有项目名称
export const getProjectName = p =>get('/project/allName.action',p)
/****************项目管理******************* */
//项目管理 获取所有的项目信息
export const getProject = p =>get('/opens/dev-api/system/project/list',p)
// 删除项目
export const deleteProject = p =>post('/opens/project/deleteProject',p)
//创建项目
export const createProjectApi = p =>post('/opens/dev-api/system/project',p)
//编辑项目
export const editProjectApi = p =>put('/opens/dev-api/system/project',p)
// 查询项目下的人员
export const getUserList = p =>get('/opens/dev-api/system/project/user/list',p)
// 删除项目下的人员
export const deleteUser = p =>post('/opens/dev-api/system/project/user/{userIds}',p)
/**************************标签管理************************************/
// 查询标签根节点
export const getRootNode = p => get('/label/rootNode.action',p)
// 查询标签子节点
export const getChildNode = p =>get('/label/childNode.action',p)
// 查询标签组详情
export const labelOrlabelGroupMes = p =>get('/label/labelDetail.action',p)
// 新增标签/标签组
export const addLabelOrLabelGroup = p => postFormData('/label/insertOneLabel.action',p)
// 编辑标签/标签组
export const editLabelOrLabelGroup = p =>postFormData('/label/updateOneLabel.action',p)
// 正例反例上传图片
export const uploadPic = p =>postFormData('/label/uploadPic.action',p)
//删除标签组/标签
export const delLabel = p =>post('/label/delLabel.action',p)
// 导入标签
export const importLabel = p =>post('/label/importLabel.action',p)
// 导出标签
export const exportLabel = p =>post('/label/exportLabel.action',p)
// 获取模板
export const downloadFormWork= p =>get('/label/jsonPath.action',p)
// 查询标签版本信息
export const getLabelVersion = p =>get('/label/getLabelVersion.action',p)
// 创建标签版本
export const creatOneVersion = p =>postFormData('/version/creatOneVersion.action',p)
//查询所有的标签版本
export const versionListByType = p =>get('/version/versionListByType.action',p)
/******************************数据集********************/
// 查询数据集
export const getDataSet = p =>get('/data/getDataSet.action',p)
//创建数据集
export const createDataSetApi= p =>postFormData('/data/createDataSet.action',p)
// 编辑数据集
export const editDataSetApi = p =>postFormData('/data/updateDataSet.action',p)
// 删除数据集
export const delDataSetApi = p =>postFormData('/data/delDataSet.action',p)
// 查询gt数据
export const getGt = p =>get('/data/getGt.action',p)
// 查询所有标签
export const getAllLabel = p =>get('/label/getAllLabel.action',p)
// 查询数据集下pack
export const getDatasetPack= p =>get('/data/queryAllDataFileInDateset.action',p)
// 删除pack
export const delPack = p =>postFormData('/data/delPack.action',p)
//pack播放
export const playPack = p=>get('/data/playPack.action',p)
//查询项目下的pack
export const getProjectPack = p =>get('/data/getPack.action',p)
// 查询当前项目或数据集下所有数据文件
export const queryAllDataFileInDatesetOrProject = p=>postFormData('/data/queryAllDataFileInDatesetOrProject.action',p)
// 保存数据集和数据的关联关系
export const saveDatasInDataSet = p =>postFormData('/data/saveDatasInDataSet.action',p)
// 刷新pack
export const flushPack = p => post('/data/flushPack.action',p)
// 对pack进行标签绑定
export const bindLabelByPack = p =>postFormData('/data/addPackLabel.action',p)
//对image进行标签绑定
export const addImageLabel = p =>postFormData('/data/addImageLabel.action',p)
//刷新image
export const flushImage = p => get('/data/flushImage.action',p)
//根据文件类型获取数据集（用于下拉选）
export const getDataSetOptions = p =>get('/data/getDataSetOptions.action',p)
/**************************场景库管理************************************/
// 查询场景库
export const searchSceneLibrary = p => get('data/getSceneRespo.action',p)
// 创建场景库
export const createSceneLibrary = p => post('data/createSceneRespo.action',p)
// 删除场景库
export const deleteSceneLibrary = p => post('data/delSceneRepo.action',p)
// 编辑场景库
export const editSceneLibrary = p => postFormData('data/editSceneRepo.action',p)
// 获取场景库下的所有版本
export const getVersionListBySecneLibraryId = p => get('data/getSceneRespoVersionHistory.action',p)
// 查询场景列表
export const searchScene = p => get('data/getSceneRespo.action',p)
// 查询所有的标签版本
export const getAllLabelVersions = p => get('label/getVersion.action',p)
// 查询项目/场景库下的所有场景
export const searchSceneByProjectOrSceneLibrary = p =>get('/data/getScene.action',p)
//关联数据
export const connectSceneData = p =>get('/data/connectSceneData.action',p)
// 创建场景
export const createScene = p => postFormData('/data/createScene.action',p)
// 场景库绑定场景
export const bindSceneBySceneLibrary = p => postFormData('/data/saveSceneInRepo.action',p)
// 场景下标签绑定
export const bindLabelByScene = p => postFormData('/data/addSceneLabel.action',p)
// 获取所有的模型
export const getModel = p =>get('/model/getModel.action',p)
/***********************版本管理********************/
export const versionList = p =>get('/version/versionList.action',p)
//根据版本号查询标签跟节点
export const rootNodeByVersionId = p =>get('/label/rootNodeByVersionId.action',p)
//根据版本号查询标签子节点
export const childNodeByVersionId = p =>get('/label/childNodeByVersionId.action',p)
//查询标签版本详情信息
export const labelDetailByVersionId = p =>get('/label/labelDetailByVersionId.action',p)
/*******************gt*********************************/
// 刷新gt
export const flushGt = p => get('/data/flushGt.action',p)
// 删除GT
export const delGt = p =>post('/data/delGt.action',p)
// 预览GT
export const previewGt = p =>post('/data/previewGt.action',p)
//对gt进行标签绑定
export const addGtLabel = p => postFormData('/data/addGtLabel.action',p)
//查看gt详情
export const previewImageContext = p =>get('/data/previewImageContext.action',p)
/************************badcase管理*********/
//创建badcase版本
export const createBadcaseVersion = p =>postFormData('/badcase/at/version.action',p)
//badcase查询
export const getAllCase = p => get('/badcase/at/allcase.action',p)
//badcase版本查询
export const getAllVersion = p =>get('/badcase/at/getVersion.action',p)
// badcase标签绑定
export const addBadcaseLabel = p =>postFormData('/badcase/at/addBadcaseLabel.action',p)
// 删除badcase
export const delBadcase = p =>postFormData('/badcase/at/delBadcase.action',p)
// 刷新badcase
export const flushBadcase = p =>get('/badcase/at/flushBadcase.action',p)
// 分类汇总
export const makeCollect = p =>postFormData('/badcase/at/makeCollect.action',p)
// 查询已绑定的标签
export const bindBadcaseLabel = p =>get('/badcase/at/bindLabel.action',p)
// 获取所有的badcaseId
export const getBadcaseIds = p =>get('/badcase/at/id.action',p)
//查询分类汇总数据
export const allCollectHistory = p =>get('/badcase/at/allCollectHistory.action',p)
//获取分类汇总历史详情
export const historyDetail = p =>get('/badcase/at/historyDetail.action',p)
//编辑Badcase的描述信息
export const badcaseDesc = p =>post('/badcase/at/badcaseDesc.action',p)