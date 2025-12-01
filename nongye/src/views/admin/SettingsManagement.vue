<template>
  <div class="settings-management">
    <div class="page-header">
      <h3>系统配置</h3>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="saveSettings" :loading="settingsLoading">
          <i class="el-icon-check"></i> 保存配置
        </el-button>
        <el-button size="small" @click="loadSettings" :loading="settingsLoading">
          <i class="el-icon-refresh"></i> 刷新
        </el-button>
      </div>
    </div>

    <div v-loading="settingsLoading" class="settings-content">
      <el-tabs v-model="activeSettingsTab" class="settings-tabs">
        <!-- 基础配置 -->
        <el-tab-pane label="基础配置" name="basic">
          <el-form :model="configData" label-width="120px">
            <el-card class="config-card">
              <div slot="header">
                <span>系统基本信息</span>
              </div>
              <el-form-item label="系统标题">
                <el-input v-model="configData.shopInfo.title" placeholder="请输入系统标题"></el-input>
              </el-form-item>
              <el-form-item label="系统描述">
                <el-input 
                  type="textarea" 
                  :rows="4" 
                  v-model="configData.shopInfo.content" 
                  placeholder="请输入系统描述"
                ></el-input>
              </el-form-item>
              <el-form-item label="主标题">
                <el-input v-model="configData.title.mainTitle" placeholder="请输入主标题"></el-input>
              </el-form-item>
              <el-form-item label="副标题">
                <el-input v-model="configData.title.subTitle" placeholder="请输入副标题"></el-input>
              </el-form-item>
            </el-card>
          </el-form>
        </el-tab-pane>

        <!-- 统计数据配置 -->
        <el-tab-pane label="统计数据" name="statistics">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="config-card">
                <div slot="header">
                  <span>中心信息数据</span>
                </div>
                <el-form :model="configData" label-width="100px">
                  <el-form-item label="实时监控">
                    <el-input-number v-model="configData['center-info'].centetData.number1" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="冷库面积">
                    <el-input-number v-model="configData['center-info'].centetData.number2" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="基地面积">
                    <el-input-number v-model="configData['center-info'].centetData.number3" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="农产品销售">
                    <el-input-number v-model="configData['center-info'].centetData.number4" :min="0"></el-input-number>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="config-card">
                <div slot="header">
                  <span>农机服务统计</span>
                </div>
                <el-form :model="configData" label-width="100px">
                  <el-form-item label="设备数量">
                    <el-input-number v-model="configData['agricultural-machinery-services'].number" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="累计服务">
                    <el-input-number v-model="configData['agricultural-machinery-services'].kilometer" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="累计田地">
                    <el-input-number v-model="configData['agricultural-machinery-services'].mu" :min="0"></el-input-number>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>

          <el-card class="config-card">
            <div slot="header">
              <span>统计数据展示</span>
            </div>
            <div v-for="(item, index) in configData['statistical-data'].defaultStatistics" :key="index" class="statistics-item">
              <el-row :gutter="10" style="margin-bottom: 10px;">
                <el-col :span="6">
                  <el-input v-model="item.unit" placeholder="单位描述"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="item.number" placeholder="数值"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="item.title" placeholder="单位"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="item.img" placeholder="图标"></el-input>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- 监控数据配置 -->
        <el-tab-pane label="监控数据" name="monitoring">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="config-card">
                <div slot="header">
                  <span>土壤监控数据</span>
                </div>
                <div v-for="(item, index) in configData['center-main'].monitor" :key="index" class="monitor-item">
                  <el-row :gutter="10" style="margin-bottom: 10px;">
                    <el-col :span="8">
                      <el-input-number v-model="item.deep" :min="0" placeholder="深度"></el-input-number>
                    </el-col>
                    <el-col :span="8">
                      <el-input-number v-model="item.humidity" :min="0" placeholder="湿度"></el-input-number>
                    </el-col>
                    <el-col :span="8">
                      <el-input-number v-model="item.temperature" :min="0" placeholder="温度"></el-input-number>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="config-card">
                <div slot="header">
                  <span>气象数据配置</span>
                </div>
                <el-form :model="configData.meteorological.sensorData" label-width="100px">
                  <el-form-item label="光照强度">
                    <el-input-number v-model="configData.meteorological.sensorData.illuminance" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="空气温度">
                    <el-input-number v-model="configData.meteorological.sensorData.airTemperature" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="空气湿度">
                    <el-input-number v-model="configData.meteorological.sensorData.airHumidity" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="大气压强">
                    <el-input-number v-model="configData.meteorological.sensorData.atmosphericPressure" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="CO2浓度">
                    <el-input-number v-model="configData.meteorological.sensorData.co2" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="风速">
                    <el-input-number v-model="configData.meteorological.sensorData.windSpeed" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="降雨量">
                    <el-input-number v-model="configData.meteorological.sensorData.rainfall" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="PM2.5">
                    <el-input-number v-model="configData.meteorological.sensorData.pm25" :min="0"></el-input-number>
                  </el-form-item>
                  <el-form-item label="PM10">
                    <el-input-number v-model="configData.meteorological.sensorData.pm10" :min="0"></el-input-number>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <!-- 内容配置 -->
        <el-tab-pane label="内容配置" name="content">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="config-card">
                <div slot="header">
                  <span>数字乡村配置</span>
                </div>
                <el-form :model="configData" label-width="100px">
                  <el-form-item label="标题">
                    <el-input v-model="configData['digital-countryside'].digitalTitle" placeholder="请输入标题"></el-input>
                  </el-form-item>
                  <el-form-item label="内容">
                    <el-input 
                      type="textarea" 
                      :rows="4" 
                      v-model="configData['digital-countryside'].digitalContent" 
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="默认内容">
                    <el-input 
                      type="textarea" 
                      :rows="4" 
                      v-model="configData['digital-countryside'].defaultContent" 
                      placeholder="请输入默认内容"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="config-card">
                <div slot="header">
                  <span>产业升级配置</span>
                </div>
                <el-form :model="configData" label-width="100px">
                  <el-form-item label="标题">
                    <el-input v-model="configData['industrial-upgrading'].industryTitle" placeholder="请输入标题"></el-input>
                  </el-form-item>
                  <el-form-item label="内容">
                    <el-input 
                      type="textarea" 
                      :rows="4" 
                      v-model="configData['industrial-upgrading'].industryContent" 
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="默认内容">
                    <el-input 
                      type="textarea" 
                      :rows="4" 
                      v-model="configData['industrial-upgrading'].defaultContent" 
                      placeholder="请输入默认内容"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>

          <el-card class="config-card">
            <div slot="header">
              <span>视频展示配置</span>
            </div>
            <el-form :model="configData" label-width="120px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="视频地址">
                    <el-input v-model="configData['video-display'].videoSrc" placeholder="请输入视频地址"></el-input>
                  </el-form-item>
                  <el-form-item label="视频封面">
                    <el-input v-model="configData['video-display'].videoPoster" placeholder="请输入视频封面地址"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="默认视频地址">
                    <el-input v-model="configData['video-display'].defaultVideoSrc" placeholder="请输入默认视频地址"></el-input>
                  </el-form-item>
                  <el-form-item label="默认视频封面">
                    <el-input v-model="configData['video-display'].defaultVideoPoster" placeholder="请输入默认视频封面地址"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </el-tab-pane>

        <!-- 农业管理配置 -->
        <el-tab-pane label="农业管理" name="agricultural-management">
          <el-card class="config-card">
            <div slot="header">
              <span>农业管理配置</span>
            </div>
            <div class="agricultural-management-config">
              <h4>农药管理</h4>
              <div v-for="(pesticide, index) in configData['agricultural-management'][0]" :key="index" class="pesticide-item">
                <el-row :gutter="10" style="margin-bottom: 10px;">
                  <el-col :span="8">
                    <el-input v-model="pesticide.name" placeholder="农药名称"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="pesticide.num" placeholder="数量规格"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="pesticide.address" placeholder="登记证号"></el-input>
                  </el-col>
                </el-row>
              </div>
              
              <h4>农事操作</h4>
              <div v-for="(operation, index) in configData['agricultural-management'][1]" :key="index" class="operation-item">
                <el-row :gutter="10" style="margin-bottom: 10px;">
                  <el-col :span="8">
                    <el-input v-model="operation.name" placeholder="操作类型"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="operation.num" placeholder="操作内容"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="operation.address" placeholder="操作说明"></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- 农业服务配置 -->
        <el-tab-pane label="农业服务" name="agricultural-services">
          <el-card class="config-card">
            <div slot="header">
              <span>农业服务配置</span>
            </div>
            <div class="agricultural-services-config">
              <h4>配送服务</h4>
              <div v-for="(delivery, index) in configData['agricultural-services'][0]" :key="index" class="delivery-item">
                <el-row :gutter="10" style="margin-bottom: 10px;">
                  <el-col :span="8">
                    <el-input v-model="delivery.name" placeholder="商品名称"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="delivery.num" placeholder="数量"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="delivery.address" placeholder="配送地址"></el-input>
                  </el-col>
                </el-row>
              </div>
              
              <h4>服务记录</h4>
              <div v-for="(service, index) in configData['agricultural-services'][1]" :key="index" class="service-item">
                <el-row :gutter="10" style="margin-bottom: 10px;">
                  <el-col :span="8">
                    <el-input v-model="service.name" placeholder="服务类型"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="service.num" placeholder="服务内容"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="service.address" placeholder="服务地址"></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- 设备列表配置 -->
        <el-tab-pane label="设备列表" name="device-list">
          <el-card class="config-card">
            <div slot="header">
              <span>农机设备配置</span>
            </div>
            <div class="device-list-config">
              <div v-for="(device, index) in configData.deviceList" :key="index" class="device-item">
                <el-row :gutter="10" style="margin-bottom: 10px;">
                  <el-col :span="8">
                    <el-input v-model="device.name" placeholder="设备名称"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input-number v-model="device.count" :min="0" placeholder="数量"></el-input-number>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="device.unit" placeholder="单位"></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- 二维码配置 -->
        <el-tab-pane label="二维码配置" name="qr-info">
          <el-card class="config-card">
            <div slot="header">
              <span>二维码信息配置</span>
            </div>
            <el-form :model="configData" label-width="120px">
              <el-form-item label="二维码图片">
                <el-input v-model="configData['qr-info'].qrcode" placeholder="请输入二维码图片URL"></el-input>
              </el-form-item>
              <el-form-item label="二维码文字">
                <el-input v-model="configData['qr-info'].qrtext" placeholder="请输入二维码下方显示文字"></el-input>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <!-- 技术配置 -->
        <el-tab-pane label="技术配置" name="technology">
          <el-card class="config-card">
            <div slot="header">
              <span>专家配置</span>
            </div>
            <div class="technology-config">
              <h4>标签页配置</h4>
              <div v-for="(tab, index) in configData.technology.tabs" :key="index" class="tab-item">
                <el-input v-model="tab.name" placeholder="标签页名称" style="margin-bottom: 10px;"></el-input>
              </div>
              
              <h4>专家信息配置</h4>
              <div v-for="(banner, index) in configData.technology.banners" :key="index" class="banner-item">
                <el-row :gutter="10" style="margin-bottom: 10px;">
                  <el-col :span="12">
                    <el-input v-model="banner.banner" placeholder="专家图片"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="banner.name" placeholder="专家名称"></el-input>
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-bottom: 10px;">
                  <el-col :span="12">
                    <el-input v-model="banner.phone" placeholder="联系电话"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="banner.description" placeholder="专家简介"></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- 评价配置 -->
        <el-tab-pane label="评价配置" name="evaluation">
          <el-card class="config-card">
            <div slot="header">
              <span>评价系统配置</span>
            </div>
            <div class="evaluation-config">
              <h4>表头配置</h4>
              <div v-for="(header, index) in configData.evaluate.headerTexts" :key="index" class="header-item">
                <el-row :gutter="10" style="margin-bottom: 10px;">
                  <el-col :span="12">
                    <el-input v-model="header.text" placeholder="表头文字"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="header.background" placeholder="背景图片"></el-input>
                  </el-col>
                </el-row>
              </div>
              
              <h4>评价数据</h4>
              <div v-for="(data, index) in configData.evaluate.datas" :key="index" class="data-item">
                <el-row :gutter="10" style="margin-bottom: 10px;">
                  <el-col :span="8">
                    <el-input v-model="data.name" placeholder="时间"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="data.num" placeholder="评价内容"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="data.address" placeholder="评分"></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SettingsManagement',
  data() {
    return {
      // 系统配置相关数据
      settingsLoading: false,
      activeSettingsTab: 'basic',
      configData: {
        shopInfo: {
          title: '',
          content: ''
        },
        title: {
          mainTitle: '',
          subTitle: ''
        },
        'center-info': {
          centetData: {
            number1: 0,
            number2: 0,
            number3: 0,
            number4: 0
          },
          centetName: {
            name1: '实时监控',
            name2: '冷库面积',
            name3: '基地面积',
            name4: '农产品销售'
          }
        },
        'agricultural-machinery-services': {
          number: 0,
          kilometer: 0,
          mu: 0
        },
        'statistical-data': {
          defaultStatistics: []
        },
        'center-main': {
          monitor: [],
          watherStations: [],
          monitorVisible: false,
          watherStationVisible: false,
          sensorVisible: false,
          sensorData: {
            airTemperature: 0,
            soilTemperature: 0,
            soilHumidity: 0,
            illuminance: 0,
            totalSensors: 0,
            batteryVoltage: 0,
            lastUpdateTime: ''
          },
          timer: null
        },
        meteorological: {
          sensorData: {
            illuminance: 0,
            airTemperature: 0,
            airHumidity: 0,
            atmosphericPressure: 0,
            co2: 0,
            windSpeed: 0,
            rainfall: 0,
            pm25: 0,
            pm10: 0,
            lastUpdateTime: ''
          },
          timer: null
        },
        'digital-countryside': {
          banners: [],
          digitalTitle: '',
          digitalContent: '',
          defaultContent: ''
        },
        'industrial-upgrading': {
          banners: [],
          industryTitle: '',
          industryContent: '',
          defaultContent: ''
        },
        'video-display': {
          videoSrc: '',
          videoPoster: '',
          defaultVideoSrc: '',
          defaultVideoPoster: ''
        },
        technology: {
          tabs: [],
          banners: [],
          pot: 0
        },
        evaluate: {
          headerTexts: [],
          config: {
            rowNum: 3,
            evenRowBGC: 'transparent',
            oddRowBGC: 'transparent',
            columnWidth: [196, 408, 170],
            data: []
          },
          datas: []
        },
        'agricultural-management': [[], []],
        'agricultural-services': [[], []],
        deviceList: [],
        'qr-info': {
          qrcode: '',
          qrtext: ''
        },
        'center-bottom': {
          serveVisible: true
        }
      }
    }
  },
  mounted() {
    this.loadSettings();
  },
  methods: {
    // 加载系统配置数据
    async loadSettings() {
      this.settingsLoading = true;
      try {
        const requestData = {};
        console.log('系统配置请求数据:', requestData);
        const response = await axios({
          method: 'post',
          url: '/api/getShopInfo',
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('系统配置API响应:', response.data);
        let data = null;
        if (response.data && response.data.success === true && response.data.data) {
          data = response.data.data;
        } else if (response.data && response.data.shopInfo) {
          data = response.data;
        }
        if (data) {
          console.log('原始数据字段:', Object.keys(data));
          this.configData = {
            shopInfo: data.shopInfo || { title: '', content: '' },
            title: data.title || { mainTitle: '', subTitle: '' },
            'center-info': data['center-info'] || { 
              centetData: { number1: 0, number2: 0, number3: 0, number4: 0 },
              centetName: { name1: '实时监控', name2: '冷库面积', name3: '基地面积', name4: '农产品销售' }
            },
            'agricultural-machinery-services': data['agricultural-machinery-services'] || { number: 0, kilometer: 0, mu: 0 },
            'statistical-data': data['statistical-data'] || { defaultStatistics: [] },
            'center-main': data['center-main'] || { 
              monitor: [],
              watherStations: [],
              monitorVisible: false,
              watherStationVisible: false,
              sensorVisible: false,
              sensorData: {
                airTemperature: 0, soilTemperature: 0, soilHumidity: 0,
                illuminance: 0, totalSensors: 0, batteryVoltage: 0, lastUpdateTime: ''
              },
              timer: null
            },
            meteorological: data.meteorological || { 
              sensorData: {
                illuminance: 0, airTemperature: 0, airHumidity: 0, atmosphericPressure: 0,
                co2: 0, windSpeed: 0, rainfall: 0, pm25: 0, pm10: 0, lastUpdateTime: ''
              },
              timer: null
            },
            'digital-countryside': data['digital-countryside'] || { 
              banners: [], digitalTitle: '', digitalContent: '', defaultContent: '' 
            },
            'industrial-upgrading': data['industrial-upgrading'] || { 
              banners: [], industryTitle: '', industryContent: '', defaultContent: '' 
            },
            'video-display': data['video-display'] || { 
              videoSrc: '', videoPoster: '', defaultVideoSrc: '', defaultVideoPoster: '' 
            },
            technology: data.technology || { tabs: [], banners: [], pot: 0 },
            evaluate: data.evaluate || { 
              headerTexts: [], 
              config: { rowNum: 3, evenRowBGC: 'transparent', oddRowBGC: 'transparent', columnWidth: [196, 408, 170], data: [] },
              datas: [] 
            },
            'agricultural-management': data['agricultural-management'] || [[], []],
            'agricultural-services': data['agricultural-services'] || [[], []],
            deviceList: data.deviceList || [],
            'qr-info': data['qr-info'] || { qrcode: '', qrtext: '' },
            'center-bottom': data['center-bottom'] || { serveVisible: true }
          };
          this.$message.success('配置数据加载成功');
        } else {
          console.error('系统配置API返回异常:', response.data);
          this.$message.error('获取配置数据失败：缺少必要的数据字段');
        }
      } catch (error) {
        console.error('加载配置失败:', error);
        this.$message.error('网络请求失败：' + error.message);
      } finally {
        this.settingsLoading = false;
      }
    },

    // 保存系统配置数据
    async saveSettings() {
      this.settingsLoading = true;
      try {
        // 构建要提交的数据结构 - 尝试扁平化格式
        const submitData = this.configData;

        console.log('提交的配置数据:', submitData);

        const response = await axios({
          method: 'post',
          url: '/api/setShopInfo',
          data: submitData,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('配置保存API响应:', response.data);
        
        // 检查响应格式 - 可能有success字段，也可能直接返回成功状态
        if (response.data && (response.data.success === true || response.status === 200)) {
          this.$message.success('配置保存成功！');
        } else {
          console.error('配置保存失败:', response.data);
          this.$message.error('保存配置失败：' + (response.data?.error || response.data?.message || '未知错误'));
        }
      } catch (error) {
        console.error('保存配置失败:', error);
        this.$message.error('网络请求失败：' + error.message);
      } finally {
        this.settingsLoading = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.settings-management {
  .settings-content {
    .settings-tabs {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    
    .config-card {
      margin-bottom: 20px;
      
      .el-card__header {
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        
        span {
          font-weight: 600;
          color: #333;
        }
      }
    }
    
    .statistics-item,
    .monitor-item,
    .header-item,
    .data-item,
    .tab-item,
    .banner-item,
    .pesticide-item,
    .operation-item,
    .delivery-item,
    .service-item,
    .device-item {
      padding: 10px;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      margin-bottom: 10px;
      background: #f8f9fa;
    }
    
    .technology-config,
    .evaluation-config,
    .agricultural-management-config,
    .agricultural-services-config,
    .device-list-config {
      h4 {
        margin: 20px 0 10px 0;
        color: #333;
        font-size: 14px;
        font-weight: 600;
      }
    }
    
    .el-form-item {
      margin-bottom: 16px;
    }
    
    .el-input-number {
      width: 100%;
    }
  }
}
</style> 