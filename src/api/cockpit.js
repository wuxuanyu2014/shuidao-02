/*
 * @Author: huangl
 * @Date: 2022-09-14 19:52:37
 * @LastEditors: huangl
 * @LastEditTime: 2022-09-15 22:55:46
 * @Description: file content
 * @FilePath: \money-datav\vue-dataV\src\api\cockpit.js
 */
import axios from "axios";


//经营主体单位
export const getShop = params => {
  return axios({
    method: "get",
    url: "/api/bigData/getShop",
    params
  });
};

//经营主体单位分页
export const getShopList = (params, typeId) => {
  return axios({
    method: "get",
    url: `/api/bigData/getShopList/${typeId}`,
    params
  });
};

//检测共享实验室
export const getReport = params => {
  return axios({
    method: "get",
    url: "/api/bigData/getReport",
    params
  });
};

//供应商分色管理
export const getSupplyShop = params => {
  return axios({
    method: "get",
    url: "/api/bigData/getSupplyShop",
    params
  });
};

// 食品溯源--分类
export const getCategory = params => {
  return axios({
    method: "get",
    url: "/api/bigData/getCategory",
    params
  });
};
// 食品溯源-分类商品列表
export const getReportByCategory = (categoryId) => {
  return axios({
    method: "get",
    url: `/api/bigData/getReportByCategory/${categoryId}`,
  });
};

// 消息推送
export const getSystemMsg = (params) => {
  return axios({
    method: "get",
    url: `/api/bigData/getSystemMsg`,
    params
  });
};
// 信用评价
export const getEvaluate = (params) => {
  return axios({
    method: "get",
    url: `/api/bigData/getEvaluate`,
    params
  });
};

// 食链-票据管理
export const getBill = (params) => {
  return axios({
    method: "get",
    url: `/api/bigData/getBill`,
    params
  });
};

// 冷库列表
export const getColdStorage = (params) => {
  return axios({
    method: "get",
    url: "/api/bigData/getColdStorage",
    params
  });
};

//车辆列表
export const getColdVehicle = (params) => {
  return axios({
    method: "get",
    url: "/api/bigData/getColdVehicle",
    params
  });
};

// 健康证列表
export const getStaff = (params) => {
  return axios({
    method: "get",
    url: `/api/bigData/getStaff`,
    params
  });
};

// 测温记录
export const getStaffTemperature = (params) => {
  return axios({
    method: "get",
    url: "/api/bigData/getStaffTemperature",
    params
  });
};

export const getSupplyShopList = (params, typeId) => {
  return axios({
    method: "get",
    url: `/api/bigData/getSupplyShopList/${typeId}`,
    params
  });
};

export const getEventList = (params) => {
  return axios({
    method: "get",
    url: `/api/bigData/getEventList`,
    params
  });
};

//经营主体单位详情
export const getBigDataShop = (id) => axios.get(`/api/v1/bigData/shop/${id}`);
//获取供应商管理
export const getShopGetShopList = (id, typeId) => axios.get(`/api/v1/bigData/shop/getShopList/${id}/${typeId}`);
//获取从页人员
export const getShopStaff = (id) => axios.get(`/api/v1/bigData/shop/getStaff/${id}`);
//车辆列表
export const getShopColdVehicle = (id) => axios.get(`/api/v1/bigData/shop/getColdVehicle/${id}`);

//检测管理
export const getShopReport = (id) => axios.get(`/api/v1/bigData/shop/getReport/${id}`);

//AI抓拍记录
export const getShopEventList = (id) => axios.get(`/api/v1/bigData/shop/eventList/${id}`);

export const getShopAiCamera = (id, params) => axios.get(`/api/v1/bigData/shop/getAiCamera/${id}`, {params});

//冷库管理
export const getShopColdStorage = (id, params) => axios.get(`/api/v1/bigData/shop/getColdStorage/${id}`,  {params});

//获取车辆的定位
export const getShopTrack = (id) => axios.get(`/api/v1/bigData/shop/getTrack/${id}`);

// 获取商店统一信息接口
export const getShopInfo = () => {
  return axios.get('/api/getShopInfo');
};

// 农资配送相关接口
// 获取商品列表
export const getProductList = (params) => {
  return axios({
    method: "post",
    url: "/api/getProductList",
    data: {
      ...params,
      isAdmin: true
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// 创建商品
export const createProduct = (data) => {
  return axios({
    method: "post",
    url: "/api/createProduct",
    data: {
      ...data,
      isAdmin: true
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// 更新商品
export const updateProduct = (data) => {
  return axios({
    method: "post",
    url: "/api/updateProduct",
    data: {
      ...data,
      isAdmin: true
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// 删除商品
export const deleteProduct = (data) => {
  return axios({
    method: "post",
    url: "/api/deleteProduct",
    data: {
      ...data,
      isAdmin: true
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
};