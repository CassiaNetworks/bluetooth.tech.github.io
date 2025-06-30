<template lang="javascript">
<div id="app" v-cloak>
  <el-container style="height: 100%">
    <!-- 标题栏 -->
    <el-header :style="{'height': '50px', 
          'padding-left': '20px',
          'width': store.devConfDisplayVars.isConfigMenuItemOpen ? '100%' : '100%',
          'background-color': '#0089ff',
          'color': '#fff',
          'vertical-align': 'middle',
          'line-height': '50px',
          'position': 'fixed',
          'z-index': '999',
          'left': store.devConfDisplayVars.isConfigMenuItemOpen ? store.devConfDisplayVars.leftConfWidth : '0px'}
          ">
      <span class="icon-logo" style="display: inline-block; font-size: 30px; vertical-align: middle; margin-bottom: 5px;"></span>
      <span style="font-size: 18px;">
        {{ $t('message.title') }}
      </span>
      <span style="float: right; font-size: 12px;">
        <a target="_blank" :href="store.devConfDisplayVars.oldVersionUrl" style="font-weight: 700; padding-top: 2px; color: #fff; margin-right: 10px; text-decoration: none;">{{ $t('message.oldVersion') }}</a>
        Language
        <el-select class="language" @change="changeLanguage" v-model="store.devConfDisplayVars.language" size="small" style="width: 120px; padding-right: 15px;">
          <el-option label="中文" value="cn"></el-option>
          <el-option label="English" value="en"></el-option>
          <el-option label="日本語" value="ja"></el-option>
          <el-option label="русский" value="ru"></el-option>
          <el-option label="Română" value="ro"></el-option>
          <el-option label="Limba" value="mo"></el-option>
        </el-select>
      </span>
    </el-header>
    <el-container>
      <!-- 左侧配置 -->
      <el-drawer :with-header="false" :modal="true" :wrapperClosable="true" :visible.sync="store.devConfDisplayVars.isConfigMenuItemOpen" direction="ltr" :size="store.devConfDisplayVars.leftConfWidth">
        <template slot="title">
          <span></span>
        </template>
        <el-aside :style="{'width': store.devConfDisplayVars.leftConfWidth}" style="border-right: 1px solid #f2f2f2; background-color: #F2F4F8; height: 100%; ">
          <el-container :style="{'height': store.devConfDisplayVars.leftConfHeight}" style="width: 100%;">
            <el-main style="margin-bottom: 85px;">
              <el-form ref="refConfig" :label-width="store.devConfDisplayVars.leftConfLabelWidth" size="small" :model="store.devConf" :rules="cache.devConfRules">
                <el-row style="font-size: 16px; border-bottom: 1px solid #ddd; margin-top: 10px;">
                  <span>{{ $t('message.configConnectParams') }}</span>
                </el-row>
                <el-form-item :label="$t('message.connectStyle')" style="margin-top: 15px;">
                  <el-radio-group v-model="store.devConf.controlStyle" @change="controlStyleChange">
                    <el-radio-button label="AP">Gateway</el-radio-button>
                    <el-radio-button label="AC"></el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('message.serviceURI')" prop="apServerURI" v-show="store.devConf.controlStyle === 'AP'" style="margin-top: 15px;">
                  <el-input v-model="store.devConf.apServerURI" class="server-ip" clearable placeholder="http://192.168.0.100"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.serviceURI')" prop="acServerURI" v-show="store.devConf.controlStyle === 'AC'" style="margin-top: 15px;">
                  <el-input v-model="store.devConf.acServerURI" class="server-ip" @blur="acServerURIBlur" clearable placeholder="http://192.168.0.100"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.devKey')" prop="acDevKey" v-show="store.devConf.controlStyle === 'AC'" style="margin-top: 15px;">
                  <el-input v-model="store.devConf.acDevKey" class="ac-dev-key" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.devSecret')" prop="acDevSecret" v-show="store.devConf.controlStyle === 'AC'" style="margin-top: 15px;">
                  <el-input v-model="store.devConf.acDevSecret" class="ac-dev-secret" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.apMac')" prop="mac" v-show="store.devConf.controlStyle === 'AC'" style="margin-top: 15px;">
                  <el-select @focus="getAcRouterList" :remote-method="getAcRouterList" :loading="cache.isGettingAcRouterList" v-model="store.devConf.mac" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" filterable remote style="width: 100%" @change="routerChange">
                    <el-option-group key="Online" label="Online">
                      <el-option v-for="item in cache.acRouterList.filter(x => x.status === 'online')" :key="item.mac" :label="item.label" :value="item.mac">
                        <span style="float: left; color: #8492a6; font-size: 13px; margin-right: 15px">{{ item.mac }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                      </el-option>
                    </el-option-group>

                    <el-option-group key="Offline" label="Offline">
                      <el-option v-for="item in cache.acRouterList.filter(x => x.status && x.status !== 'online')" :key="item.mac" :label="item.label" :value="item.mac">
                        <span style="float: left; color: #8492a6; font-size: 13px; margin-right: 15px">{{ item.mac }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
                <el-row style="font-size: 16px; border-bottom: 1px solid #ddd; margin-top: 30px;">
                  <span>{{$t('message.configScanParams')}}</span>
                </el-row>
                <el-form-item :label="$t('message.useChip')" style="margin-top: 15px;">
                  <el-select v-model="store.devConf.chip" style="width: 100%">
                    <el-option :label="$t('message.chip0')" value="0"></el-option>
                    <el-option :label="$t('message.chip1')" value="1"></el-option>
                    <el-option :label="$t('message.chipAll')" value="all"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.filterName')">
                  <el-select v-model="store.devConf.filter_name" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" multiple filterable allow-create default-first-option clearable style="width: 100%">
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.filterMac')">
                  <el-select v-model="store.devConf.filter_mac" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" multiple filterable allow-create default-first-option clearable style="width: 100%">
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.phy')">
                  <el-select v-model="store.devConf.phy" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" multiple filterable allow-create default-first-option clearable style="width: 100%">
                    <el-option label="1M" value="1M" key="1M"></el-option>
                    <el-option label="2M" value="2M" key="2M"></el-option>
                    <el-option label="CODED" value="CODED" key="CODED"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.fitlerRSSI')">
                  <el-slider v-model="store.devConf.filter_rssi" :min="-85" :max="0">
                  </el-slider>
                </el-form-item>
                <el-form-item :label="$t('message.others')">
                  <el-input v-model="store.devConf.scanParams" placeholder="key1=value1&key2=value2"></el-input>
                </el-form-item>
                <el-row style="font-size: 16px; border-bottom: 1px solid #ddd; margin-top: 30px;">
                  <span>{{$t('message.configConnParams')}}</span>
                </el-row>
                <el-form-item :label="$t('message.autoSelectionOn')" style="margin-top: 15px;" v-show="store.devConf.controlStyle === 'AC'">
                  <el-select v-model="store.devConf.autoSelectionOn" style="width: 100%" @change="autoSelectionChanged">
                    <el-option :label="$t('message.on')" value="on"></el-option>
                    <el-option :label="$t('message.off')" value="off"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.aps')" prop="mac" v-show="store.devConf.controlStyle === 'AC' && store.devConf.autoSelectionOn === 'on'" style="margin-top: 15px;">
                  <el-select @focus="getAcRouterListWillAll" :remote-method="getAcRouterListWillAll" :loading="cache.isGettingAcRouterList" v-model="store.devConf.aps" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" placeholder="" multiple filterable clearable remote style="width: 100%" @change="autoSelectionRouterChanged">
                    <el-option-group key="All" label="All">
                      <el-option v-for="item in cache.acRouterList.filter(x => x.mac === '*')" :key="item.mac" :label="item.label" :value="item.mac">
                        <span style="float: left; color: #8492a6; font-size: 13px; margin-right: 15px">{{ item.mac }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                      </el-option>
                    </el-option-group>

                    <el-option-group key="Online" label="Online">
                      <el-option v-for="item in cache.acRouterList.filter(x => x.status === 'online')" :key="item.mac" :label="item.label" :value="item.mac">
                        <span style="float: left; color: #8492a6; font-size: 13px; margin-right: 15px">{{ item.mac }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                      </el-option>
                    </el-option-group>

                    <el-option-group key="Offline" label="Offline">
                      <el-option v-for="item in cache.acRouterList.filter(x => x.status && x.status !== 'online')" :key="item.mac" :label="item.label" :value="item.mac">
                        <span style="float: left; color: #8492a6; font-size: 13px; margin-right: 15px">{{ item.mac }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.useChip')" v-show="store.devConf.autoSelectionOn === 'off'" style="margin-top: 15px;">
                  <el-select v-model="store.devConf.connChip" style="width: 100%">
                    <el-option :label="$t('message.chip0')" value="0"></el-option>
                    <el-option :label="$t('message.chip1')" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.discovergatt')" style="margin-top: 15px;">
                  <el-select v-model="store.devConf.discovergatt" style="width: 100%">
                    <el-option :label="$t('message.open')" value="1"></el-option>
                    <el-option :label="$t('message.close')" value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.connTimeout')" prop="connTimeout">
                  <el-input v-model="store.devConf.connTimeout"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.phy')" v-show="store.devConf.autoSelectionOn === 'off'">
                  <el-select v-model="store.devConf.connPhy" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" clearable multiple filterable allow-create default-first-option style="width: 100%">
                    <el-option label="1M" value="1M" key="1M"></el-option>
                    <el-option label="CODED" value="CODED" key="CODED"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.secondaryPhy')" v-show="store.devConf.autoSelectionOn === 'off'">
                  <el-select v-model="store.devConf.secondaryPhy" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" clearable multiple filterable allow-create default-first-option style="width: 100%">
                    <el-option label="1M" value="1M" key="1M"></el-option>
                    <el-option label="2M" value="2M" key="2M"></el-option>
                    <el-option label="CODED" value="CODED" key="CODED"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.others')">
                  <el-input v-model="store.devConf.connParams" placeholder="key1=value1&key2=value2"></el-input>
                </el-form-item>
              </el-form>
            </el-main>
            <el-footer :style="{'width': store.devConfDisplayVars.leftConfWidth}" style="z-index: 999; border-top: 1px solid #ddd; background-color: #F2F4F8; height: 85px; line-height: 85px; vertial-align: middle; text-align: center; position: fixed; bottom: 0; left: 0;">
              <el-button size="small" @click="reboot" style="margin-right: 15px;">{{$t('message.restartAP')}}</el-button>
              <el-button size="small" style="margin-left: 15px;" type="primary" @click="startScan" v-show="!store.devConfDisplayVars.isScanning">{{$t('message.startScan')}}</el-button>
              <el-button size="small" style="margin-left: 15px;" type="primary" @click="stopScan" v-show="store.devConfDisplayVars.isScanning">{{$t('message.stopScan')}}</el-button>
            </el-footer>
          </el-container>
        </el-aside>
      </el-drawer>
      <el-main :style="{'background-color': '#fff', 'padding': 0, 'margin-left': store.devConfDisplayVars.isConfigMenuItemOpen ? store.devConfDisplayVars.leftConfWidth : '0px', 'margin-top': '50px'}">
        <el-container style="height: 100%; background-color: #fff;">
          <!-- 菜单栏 -->
          <el-aside width="180px" style="height: 100%; background-color: #F8FAFF; box-shadow:-1px 0px 6px 0px rgba(195,212,227,0.28); position: fixed; z-index: 999; ">
            <el-menu :collapse="false" @select="menuSelect" background-color="#f8faff" text-color="#505050" active-text-color="#232635" default-active="scanListMenuItem" style="width: 180px; " class="el-menu-vertical-demo">
              <el-menu-item index="configMenuItem" class="configMenuItem" :style="{'color': store.devConfDisplayVars.activeMenuItem === 'configMenuItem' ? '#0089ff' : '#232635'}">
                <i :class="this.store.devConfDisplayVars.isConfigMenuItemOpen ? 'icon-fold' : 'icon-unfold'" :style="{'font-size': '16px', 'color': store.devConfDisplayVars.activeMenuItem === 'scanListMenuItem' ? '#232635' : '#232635', 'margin-right': '10px'}"></i>
                <span slot="title">{{$t('message.configParams')}}</span>
              </el-menu-item>
              <el-menu-item index="scanListMenuItem" :style="{'color': store.devConfDisplayVars.activeMenuItem === 'scanListMenuItem' ? '#0089ff' : '#232635'}">
                <i class="icon-scan-list" :style="{'font-size': '16px', 'color': store.devConfDisplayVars.activeMenuItem === 'scanListMenuItem' ? '#0089ff' : '#232635', 'margin-right': '10px'}"></i>
                <span slot="title">{{$t('message.scanList')}}</span>
              </el-menu-item>
              <el-menu-item index="connectListMenuItem" :style="{'color': store.devConfDisplayVars.activeMenuItem === 'connectListMenuItem' ? '#0089ff' : '#232635'}">
                <i class="icon-connection-list" :style="{'font-size': '16px', 'color': store.devConfDisplayVars.activeMenuItem === 'connectListMenuItem' ? '#0089ff' : '#232635', 'margin-right': '10px'}"></i>
                <span slot="title">{{$t('message.connectList')}}</span>
              </el-menu-item>
              <el-menu-item index="notifyListMenuItem" :style="{'color': store.devConfDisplayVars.activeMenuItem === 'notifyListMenuItem' ? '#0089ff' : '#232635'}">
                <i class="icon-notification-list" :style="{'font-size': '16px', 'color': store.devConfDisplayVars.activeMenuItem === 'notifyListMenuItem' ? '#0089ff' : '#232635', 'margin-right': '10px'}"></i>
                <span slot="title">{{$t('message.notifyList')}}</span>
              </el-menu-item>
              <el-menu-item index="apiLogListMenuItem" :style="{'color': store.devConfDisplayVars.activeMenuItem === 'apiLogListMenuItem' ? '#0089ff' : '#232635'}">
                <i class="icon-API-log" :style="{'font-size': '16px', 'color': store.devConfDisplayVars.activeMenuItem === 'apiLogListMenuItem' ? '#0089ff' : '#232635', 'margin-right': '10px'}"></i>
                <span slot="title">{{$t('message.apiLogList')}}</span>
              </el-menu-item>
              <el-menu-item index="apiDebuggerMenuItem" :style="{'color': store.devConfDisplayVars.activeMenuItem === 'apiDebuggerMenuItem' ? '#0089ff' : '#232635'}">
                <i class="icon-api-debugger" :style="{'font-size': '16px', 'color': store.devConfDisplayVars.activeMenuItem === 'apiDebuggerMenuItem' ? '#0089ff' : '#232635', 'margin-right': '10px'}"></i>
                <span slot="title">{{$t('message.apiDebugger')}}</span>
              </el-menu-item>
              <el-menu-item index="apiDemoMenuItem" :style="{'color': store.devConfDisplayVars.activeMenuItem === 'apiDemoMenuItem' ? '#0089ff' : '#232635'}">
                <i class="icon-API-demo" :style="{'font-size': '16px', 'color': store.devConfDisplayVars.activeMenuItem === 'apiDemoMenuItem' ? '#0089ff' : '#232635', 'margin-right': '10px'}"></i>
                <span slot="title">{{$t('message.apiDemo')}}</span>
              </el-menu-item>
              <el-menu-item index="toolsMenuItem" :style="{'color': store.devConfDisplayVars.activeMenuItem === 'toolsMenuItem' ? '#0089ff' : '#232635'}">
                <i class="icon-tools" :style="{'font-size': '16px', 'color': store.devConfDisplayVars.activeMenuItem === 'toolsMenuItem' ? '#0089ff' : '#232635', 'margin-right': '10px'}"></i>
                <span slot="title">{{$t('message.tools')}}</span>
              </el-menu-item>
              <el-menu-item index="resourcesMenuItem" :style="{'color': store.devConfDisplayVars.activeMenuItem === 'resourcesMenuItem' ? '#0089ff' : '#232635'}">
                <i class="icon-API-log" :style="{'font-size': '16px', 'color': store.devConfDisplayVars.activeMenuItem === 'resourcesMenuItem' ? '#0089ff' : '#232635', 'margin-right': '10px'}"></i>
                <span slot="title">{{$t('message.resources')}}</span>
              </el-menu-item>
              <el-menu-item style="position: absolute; bottom: 50px; padding: 0; width: 152px; text-align: center; border-top: 0px solid #e8eaed;">
                <span>v2.0.8</span>
              </el-menu-item>
            </el-menu>
          </el-aside>

          <!-- API调试主题内容 -->
          <el-row style="margin: 0 0 0 180px; height: 100%; width: 100%;" v-show="store.devConfDisplayVars.activeMenuItem === 'apiDebuggerMenuItem'">
            <el-aside class="apiDebuggerMenu" :width="store.devConfDisplayVars.language === 'cn' ? '180px' : '180px'" style="height: 100%; background-color: #FFF; box-shadow:-1px 0px 6px 0px rgba(195,212,227,0.28); position: fixed; z-index: 999; border-right: 1px solid #ebedf2">
              <!-- API调试菜单 -->
              <el-menu :collapse="false" @select="apiDebuggerMenuSelect" background-color="#fff" text-color="#505050" active-text-color="#0089ff" :default-active="store.devConfDisplayVars.activeApiDebugMenuItem" ref="refApiDebuggerMenu" class="el-menu-api-debugger">
                <el-menu-item index="auth" v-show="store.devConf.controlStyle === 'AC'">
                  <span slot="title">{{$t('message.auth')}}</span>
                </el-menu-item>
                <el-menu-item index="scan">
                  <span slot="title">{{$t('message.scanDevices')}}</span>
                </el-menu-item>
                <el-menu-item index="connect">
                  <span slot="title">{{$t('message.connectDevice')}}</span>
                </el-menu-item>
                <el-menu-item index="read">
                  <span slot="title">{{$t('message.readData')}}</span>
                </el-menu-item>
                <el-menu-item index="write">
                  <span slot="title">{{$t('message.writeData')}}</span>
                </el-menu-item>
                <el-menu-item index="disconnect">
                  <span slot="title">{{$t('message.disConnect')}}</span>
                </el-menu-item>
                <el-menu-item index="connectList">
                  <span slot="title">{{$t('message.connectList')}}</span>
                </el-menu-item>
                <el-menu-item index="discover">
                  <span slot="title">{{$t('message.deviceServices')}}</span>
                </el-menu-item>
                <el-menu-item index="notify">
                  <span slot="title">{{$t('message.openNotify')}}</span>
                </el-menu-item>
                <el-menu-item index="connectStatus">
                  <span slot="title">{{$t('message.connectStatus')}}</span>
                </el-menu-item>
                <el-menu-item index="pair">
                  <span slot="title">{{$t('message.pair')}}</span>
                </el-menu-item>
                <el-menu-item index="pairInput">
                  <span slot="title">{{$t('message.pairInput')}}</span>
                </el-menu-item>
                <el-menu-item index="unpair">
                  <span slot="title">{{$t('message.unpair')}}</span>
                </el-menu-item>
                <el-menu-item index="readPhy">
                  <span slot="title">{{$t('message.readPhy')}}</span>
                </el-menu-item>
                <el-menu-item index="updatePhy">
                  <span slot="title">{{$t('message.updatePhy')}}</span>
                </el-menu-item>
                
              </el-menu>
            </el-aside>
            <el-main :style="{'height': '100%', 'margin': store.devConfDisplayVars.language === 'cn' ? '0 0 0 180px' : '0 0 0 180px', 'padding-top': '0'}">
              <el-col :span="18" style="height: 100%; border-right: 1px solid #ebedf2; padding-top: 10px;">
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'auth' && store.devConf.controlStyle === 'AC'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.auth')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.serviceURI')">
                        <el-input v-model="store.devConf.acServerURI"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.devKey')">
                        <el-input v-model="store.devConf.acDevKey"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.devSecret')">
                        <el-input v-model="store.devConf.acDevSecret"></el-input>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'scan'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.scanDevices')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.useChip')">
                        <el-radio-group v-model="store.devConfDisplayVars.apiDebuggerParams['scan'].chip" size="small">
                          <el-radio-button :label="0">{{$t('message.chip0')}}</el-radio-button>
                          <el-radio-button :label="1">{{$t('message.chip1')}}</el-radio-button>
                          <el-radio-button :label="'all'">{{$t('message.chipAll')}}</el-radio-button>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item :label="$t('message.filterName')">
                        <el-select v-model="store.devConfDisplayVars.apiDebuggerParams['scan'].filter_name" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" clearable multiple filterable allow-create default-first-option style="width: 100%">
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t('message.filterMac')">
                        <el-select v-model="store.devConfDisplayVars.apiDebuggerParams['scan'].filter_mac" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" clearable multiple filterable allow-create default-first-option style="width: 100%">
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t('message.phy')">
                        <el-select v-model="store.devConfDisplayVars.apiDebuggerParams['scan'].phy" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" clearable multiple filterable allow-create default-first-option style="width: 100%">
                          <el-option label="1M" value="1M" key="1M"></el-option>
                          <el-option label="2M" value="2M" key="2M"></el-option>
                          <el-option label="CODED" value="CODED" key="CODED"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t('message.fitlerRSSI')">
                        <el-slider v-model="store.devConfDisplayVars.apiDebuggerParams['scan'].filter_rssi" show-input :min="-85" :max="0">
                        </el-slider>
                      </el-form-item>
                      <el-form-item :label="$t('message.timestamp')">
                        <el-select v-model="store.devConfDisplayVars.apiDebuggerParams['scan'].timestamp" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" default-first-option style="width: 100%">
                          <el-option label="ON" value="1" key="ON"></el-option>
                          <el-option label="OFF" value="0" key="OFF"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t('message.others')">
                        <el-input v-model="store.devConfDisplayVars.apiDebuggerParams['scan'].scanParams" placeholder="key1=value1&key2=value2"></el-input>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi" v-show="!store.devConfDisplayVars.isApiScanning">{{$t('message.startDebug')}}</el-button>
                        <el-button size="small" @click="stopApiScan" v-show="store.devConfDisplayVars.isApiScanning">{{$t('message.stopScan')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'connect'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.connectDevice')}}</span>
                    <el-form label-width="150px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.useChip')">
                        <el-radio-group v-model="store.devConfDisplayVars.apiDebuggerParams['connect'].chip" size="small">
                          <el-radio-button label="0">{{$t('message.chip0')}}</el-radio-button>
                          <el-radio-button label="1">{{$t('message.chip1')}}</el-radio-button>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item :label="$t('message.addrType')">
                        <el-radio-group v-model="store.devConfDisplayVars.apiDebuggerParams['connect'].addrType" size="small">
                          <el-radio-button label="public">PUBLIC</el-radio-button>
                          <el-radio-button label="random">RANDOM</el-radio-button>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item :label="$t('message.deviceAddr')">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['connect'].deviceMac"></el-input>
                      </el-form-item>
                      <el-collapse>
                        <el-collapse-item>
                          <template slot="title">
                            <div style="font-weight: normal; text-align: center; width: 100%;">{{$t('message.moreArgs')}}</div>
                          </template>
                          <el-form-item :label="$t('message.discovergatt')" style="margin-top: 15px;">
                            <el-select v-model="store.devConfDisplayVars.apiDebuggerParams['connect'].discovergatt" style="width: 100%">
                              <el-option :label="$t('message.open')" value="1"></el-option>
                              <el-option :label="$t('message.close')" value="0"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item :label="$t('message.connTimeout')" prop="connTimeout">
                            <el-input v-model="store.devConfDisplayVars.apiDebuggerParams['connect'].connTimeout"></el-input>
                          </el-form-item>
                          <el-form-item :label="$t('message.phy')">
                              <el-select v-model="store.devConfDisplayVars.apiDebuggerParams['connect'].connPhy" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" clearable multiple filterable allow-create default-first-option style="width: 100%">
                              <el-option label="1M" value="1M" key="1M"></el-option>
                              <el-option label="CODED" value="CODED" key="CODED"></el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item :label="$t('message.secondaryPhy')">
                              <el-select v-model="store.devConfDisplayVars.apiDebuggerParams['connect'].secondaryPhy" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" clearable multiple filterable allow-create default-first-option style="width: 100%">
                              <el-option label="1M" value="1M" key="1M"></el-option>
                              <el-option label="2M" value="2M" key="2M"></el-option>
                              <el-option label="CODED" value="CODED" key="CODED"></el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item :label="$t('message.others')">
                              <el-input v-model="store.devConfDisplayVars.apiDebuggerParams['connect'].connParams" placeholder="key1=value1&key2=value2"></el-input>
                          </el-form-item>   
                        </el-collapse-item>
                      </el-collapse>
                      <el-form-item align="right" style="margin-top: 12px">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'read'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.readData')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item label="HANDLE">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['read'].handle"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.deviceAddr')">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['read'].deviceMac"></el-input>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'readPhy'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.readPhy')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.deviceAddr')">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['readPhy'].deviceMac"></el-input>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'updatePhy'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.updatePhy')}}</span>
                    <el-form label-width="150px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.deviceAddr')">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['updatePhy'].deviceMac"></el-input>
                      </el-form-item>
                      <el-form-item label="TX PHY">
                        <el-select v-model="store.devConfDisplayVars.apiDebuggerParams['updatePhy'].tx" clearable multiple filterable style="width: 100%">
                          <el-option label="1M" value="1M" key="1M"></el-option>
                          <el-option label="2M" value="2M" key="2M"></el-option>
                          <el-option label="CODED" value="CODED" key="CODED"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="RX PHY">
                        <el-select v-model="store.devConfDisplayVars.apiDebuggerParams['updatePhy'].rx" clearable multiple filterable style="width: 100%">
                          <el-option label="1M" value="1M" key="1M"></el-option>
                          <el-option label="2M" value="2M" key="2M"></el-option>
                          <el-option label="CODED" value="CODED" key="CODED"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="TX CODED Option" v-show="store.devConfDisplayVars.apiDebuggerParams['updatePhy'].tx.includes('CODED')">
                        <el-select v-model="store.devConfDisplayVars.apiDebuggerParams['updatePhy'].codedOption" style="width: 100%">
                          <el-option label="Auto Negotiation" value="0" key="1M"></el-option>
                          <el-option label="S2" value="1" key="S2"></el-option>
                          <el-option label="S8" value="2" key="S8"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'write'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.writeData')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item label="HANDLE">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['write'].handle"></el-input>
                      </el-form-item>
                      <el-form-item label="VALUE">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['write'].value"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.writeStyle')">
                        <el-radio-group v-model="store.devConfDisplayVars.apiDebuggerParams['write'].noresponse" size="small">
                          <el-radio-button label="false">{{$t('message.wait')}}</el-radio-button>
                          <el-radio-button label="true">{{$t('message.noWait')}}</el-radio-button>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item :label="$t('message.deviceAddr')">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['write'].deviceMac"></el-input>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'disconnect'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.disConnect')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.deviceAddr')">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['disconnect'].deviceMac"></el-input>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'connectList'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.connectList')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'discover'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.deviceServices')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.deviceAddr')">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['discover'].deviceMac"></el-input>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'notify'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.openNotify')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'connectStatus'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.connectStatus')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'pair'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.pair')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.deviceAddr')">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['pair'].deviceMac"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.ioCap')">
                        <el-select v-model="store.devConfDisplayVars.apiDebuggerParams['pair'].iocapability" style="width: 100%">
                          <el-option label="DisplayOnly" value="DisplayOnly" key="DisplayOnly"></el-option>
                          <el-option label="DisplayYesNo" value="DisplayYesNo" key="DisplayYesNo"></el-option>
                          <el-option label="KeyboardOnly" value="KeyboardOnly" key="KeyboardOnly"></el-option>
                          <el-option label="NoInputNoOutput" value="NoInputNoOutput" key="NoInputNoOutput"></el-option>
                          <el-option label="KeyboardDisplay" value="KeyboardDisplay" key="KeyboardDisplay"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'pairInput'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.pairInput')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.deviceAddr')">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['pairInput'].deviceMac"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.inputType')">
                        <el-select v-model="store.devConfDisplayVars.apiDebuggerParams['pairInput'].inputType" style="width: 100%">
                          <el-option label="Passkey" value="Passkey" key="Passkey"></el-option>
                          <el-option label="LegacyOOB" value="LegacyOOB" key="LegacyOOB"></el-option>
                          <el-option label="SecurityOOB" value="SecurityOOB" key="SecurityOOB"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="passkey" v-show="store.devConfDisplayVars.apiDebuggerParams['pairInput'].inputType === 'Passkey'">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['pairInput'].passkey"></el-input>
                      </el-form-item>
                      <el-form-item label="tk" v-show="store.devConfDisplayVars.apiDebuggerParams['pairInput'].inputType === 'LegacyOOB'">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['pairInput'].tk"></el-input>
                      </el-form-item>
                      <el-form-item label="rand" v-show="store.devConfDisplayVars.apiDebuggerParams['pairInput'].inputType === 'SecurityOOB'">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['pairInput'].rand"></el-input>
                      </el-form-item>
                      <el-form-item label="confirm" v-show="store.devConfDisplayVars.apiDebuggerParams['pairInput'].inputType === 'SecurityOOB'">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['pairInput'].confirm"></el-input>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'unpair'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.unpair')}}</span>
                    <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                      <el-form-item :label="$t('message.router')">
                        <el-input v-model="store.devConf.controlStyle === 'AP' ? store.devConf.apServerURI : store.devConf.mac"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('message.deviceAddr')">
                        <el-input clearable v-model="store.devConfDisplayVars.apiDebuggerParams['unpair'].deviceMac"></el-input>
                      </el-form-item>
                      <el-form-item align="right">
                        <el-button size="small" @click="genCode">{{$t('message.genCode')}}</el-button>
                        <el-button type="primary" size="small" @click="startDebugApi">{{$t('message.startDebug')}}</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                </el-tabs>
                <el-row style="box-shadow:0px 0px 5px 0px rgba(214,214,214,0.49); border-radius:1px; padding: 15px; width: 98%; ">
                  <el-menu :collapse="false" mode="horizontal" @select="apiDebuggerOutputMenuSelect" background-color="#fff" text-color="#505050" active-text-color="#505050" default-active="output" ref="apiDebuggerOutputMenu" class="apiDebuggerOutputMenu">
                    <el-menu-item index="output">
                      <span slot="title">{{$t('message.debugResult')}}</span>
                    </el-menu-item>
                    <el-menu-item index="curl">
                      <span slot="title">cURL</span>
                    </el-menu-item>
                    <el-menu-item index="nodejs">
                      <span slot="title">NodeJS</span>
                    </el-menu-item>
                  </el-menu>
                  <el-row v-if="store.devConfDisplayVars.activeApiDebugOutputMenuItem === 'output'" style="padding: 15px; min-height: 240px; background-color: #f0f0f0; width: 100%;">
                    <div class="code" lang="javascript" style="color: #505050; font-size: 12px; min-height: 240px; background-color: #f0f0f0; word-break: break-all;" v-if="cache.apiDebuggerResult[store.devConfDisplayVars.activeApiDebugMenuItem].resultList">
                      <p v-for="item in (cache.apiDebuggerResult[store.devConfDisplayVars.activeApiDebugMenuItem].resultList || [' '])">{{item}}</p>
                    </div>
                  </el-row>
                  <el-row v-if="store.devConfDisplayVars.activeApiDebugOutputMenuItem === 'curl'" style="min-height: 240px; background-color: #f0f0f0;">
                    <highlight-code class="code" lang="bash" v-if="cache.apiDebuggerResult[store.devConfDisplayVars.activeApiDebugMenuItem].code['curl'].length > 0">
                      {{ cache.apiDebuggerResult[store.devConfDisplayVars.activeApiDebugMenuItem].code['curl'] }}
                    </highlight-code>
                  </el-row>
                  <el-row v-if="store.devConfDisplayVars.activeApiDebugOutputMenuItem === 'nodejs'" style="min-height: 240px; background-color: #f0f0f0;">
                    <highlight-code class="code" lang="js" v-if="cache.apiDebuggerResult[store.devConfDisplayVars.activeApiDebugMenuItem].code['nodejs'].length > 0">
                      {{ cache.apiDebuggerResult[store.devConfDisplayVars.activeApiDebugMenuItem].code['nodejs'] }}
                    </highlight-code>
                  </el-row>
                </el-row>
              </el-col>
              <!-- API帮助 -->
              <el-col :span="6" style="padding: 0 0px 0 26px; padding-top: 10px;">
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'auth'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.authInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/Getting-Started#access-cassia-router-through-the-cassia-ac" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'scan'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.scanDevicesInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#scan-bluetooth-devices" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'connect'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.connectDeviceInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#connectdisconnect-to-a-target-device" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'read'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.scanDevicesInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#readwrite-the-value-of-a-specific-characteristic" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'write'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.writeDataInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#readwrite-the-value-of-a-specific-characteristic" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'disconnect'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.disConnectInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#connectdisconnect-to-a-target-device" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'connectList'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.connectListInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#connectdisconnect-to-a-target-device" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'discover'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.deivceServicesInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#discover-gatt-services-and-characteristics" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'notify'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.openNotifyInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#receive-notification-and-indication" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'connectStatus'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.connectStatusInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#get-device-connection-status" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'pair'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.pairInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#pair-request" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'pairInput'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.pairInputInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#pair-input-request" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'unpair'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.unpairInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API#unpair-request" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'readPhy'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.apiReadPhyInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/BLE-5-Interface-Specification-For-X2000#11-update-phy-for-ble-connection" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDebugMenuItem === 'updatePhy'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.apiUpdatePhyInfo')}}
                      <p><a href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/BLE-5-Interface-Specification-For-X2000#11-update-phy-for-ble-connection" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
              </el-col>
            </el-main>
          </el-row>

          <!-- API Demo 主题内容 -->
          <el-row style="margin: 0 0 0 180px; height: 100%; width: 100%; " v-show="store.devConfDisplayVars.activeMenuItem === 'apiDemoMenuItem'">
            <el-aside class="apiDebuggerMenu" width="110px" style="height: 100%; background-color: #FFF; box-shadow:-1px 0px 6px 0px rgba(195,212,227,0.28); position: fixed; z-index: 999; border-right: 1px solid #ebedf2">
              <!-- API Demo 菜单 -->
              <el-menu :collapse="false" @select="apiDebuggerDemoMenuSelect" background-color="#fff" text-color="#505050" active-text-color="#0089ff" default-active="demo1" ref="apiDebuggerDemoMenu" class="el-menu-api-demo">
                <el-menu-item index="demo1">
                  <span slot="title">{{$t('message.demo1')}}</span>
                </el-menu-item>
                <el-menu-item index="demo2">
                  <span slot="title">{{$t('message.demo2')}}</span>
                </el-menu-item>
              </el-menu>
            </el-aside>
            <el-main style="height: 100%; margin: 0 0 0 110px; padding-top: 0;">
              <el-col :span="18" style="height: 100%; border-right: 1px solid #ebedf2; padding-top: 10px; padding-right: 15px;">
                <el-tabs v-show="store.devConfDisplayVars.activeApiDemoMenuItem === 'demo1'" style="min-height: 380px; ">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.demo1')}}</span>
                    <el-card shadow="hover">
                      <div slot="header" class="clearfix">
                        <span>1.{{$t('message.connectDevice')}}</span>
                        <el-button @click="apiDemoConnectTest" style="float: right; padding: 3px 0" type="text">{{$t('message.test')}}</el-button>
                      </div>
                      <el-form label-width="100px" size="small" style="width: 70%;">
                        <el-form-item :label="$t('message.historyApi')">
                          <el-select @change="apiDemoConnectChanged" v-model="store.devConfDisplayVars.apiDemoParams.connectWriteNotify.connect.tempFromApiLogUrl" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseSelect')" style="width: 100%">
                            <el-option v-for="(logItem, index) in getApiLogListByFilter({apiName: $t('message.apiConnect')})" :label="JSON.stringify(logItem.apiContent)" :value="logItem.apiContentJson" :key="index"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.useChip')">
                          <el-radio-group v-model="store.devConfDisplayVars.apiDemoParams.connectWriteNotify.connect.chip" size="small">
                            <el-radio-button label="0">{{$t('message.chip0')}}</el-radio-button>
                            <el-radio-button label="1">{{$t('message.chip1')}}</el-radio-button>
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('message.addrType')">
                          <el-radio-group v-model="store.devConfDisplayVars.apiDemoParams.connectWriteNotify.connect.addrType" size="small">
                            <el-radio-button label="public">PUBLIC</el-radio-button>
                            <el-radio-button label="random">RANDOM</el-radio-button>
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('message.deviceAddr')">
                          <el-input clearable v-model="store.devConfDisplayVars.apiDemoParams.connectWriteNotify.connect.deviceMac"></el-input>
                        </el-form-item>
                      </el-form>
                    </el-card>
                    <el-card shadow="hover" style="margin-top: 15px;">
                      <div slot="header" class="clearfix">
                        <span>2.{{$t('message.writeCmd')}}</span>
                        <el-button @click="apiDemoWriteTest" style="float: right; padding: 3px 0" type="text">{{$t('message.test')}}</el-button>
                      </div>
                      <el-form label-width="100px" size="small" style="width: 70%;">
                        <el-form-item :label="$t('message.historyApi')">
                          <el-select @change="apiDemoWriteChanged" v-model="store.devConfDisplayVars.apiDemoParams.connectWriteNotify.write.tempFromApiLogUrl" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseSelect')" style="width: 100%">
                            <el-option v-for="(logItem, index) in getApiLogListByFilter({apiName: $t('message.apiWrite')})" :label="JSON.stringify(logItem.apiContent)" :value="logItem.apiContentJson" :key="index"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="HANDLE">
                          <el-input clearable v-model="store.devConfDisplayVars.apiDemoParams.connectWriteNotify.write.handle"></el-input>
                        </el-form-item>
                        <el-form-item label="VALUE">
                          <el-input clearable v-model="store.devConfDisplayVars.apiDemoParams.connectWriteNotify.write.value"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('message.writeStyle')">
                          <el-radio-group v-model="store.devConfDisplayVars.apiDemoParams.connectWriteNotify.write.noresponse" size="small">
                            <el-radio-button label="false">{{$t('message.wait')}}</el-radio-button>
                            <el-radio-button label="true">{{$t('message.noWait')}}</el-radio-button>
                          </el-radio-group>
                        </el-form-item>
                      </el-form>
                    </el-card>
                    <el-card shadow="hover" style="margin-top: 15px;">
                      <div slot="header" class="clearfix">
                        <span>3.{{$t('message.receiveNotify')}}</span>
                      </div>
                      <el-form label-width="100px" size="small" style="width: 70%;">
                        <span style="font-size: 12px">{{$t('message.receiveDataBySSE')}}</span>
                      </el-form>
                    </el-card>
                    <el-button type="primary" style="float: right; margin-top: 15px; margin-bottom: 15px;" size="small" @click="apiDemo1GenCode">{{$t('message.genCode')}}</el-button>
                    <highlight-code class="code" style="clear: both;" lang="javascript" v-if="store.devConfDisplayVars.apiDemoParams.connectWriteNotify.code.length > 0">
                      {{ store.devConfDisplayVars.apiDemoParams.connectWriteNotify.code }}
                    </highlight-code>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDemoMenuItem === 'demo2'" style="min-height: 380px;">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.demo2')}}</span>
                    <el-card shadow="hover">
                      <div slot="header" class="clearfix">
                        <span>1.{{$t('message.scanDevices')}}</span>
                        <el-button @click="apiDemoScanTest" style="float: right; padding: 3px 0" type="text">{{$t('message.test')}}</el-button>
                      </div>
                      <el-form label-width="100px" style="margin-top: 15px; width: 70%;" size="small">
                        <el-form-item :label="$t('message.historyApi')">
                          <el-select @change="apiDemoScanChanged" v-model="store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.scan.tempFromApiLogUrl" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" style="width: 100%">
                            <el-option v-for="(logItem, index) in getApiLogListByFilter({apiName: $t('message.apiScan')})" :label="JSON.stringify(logItem.apiContent)" :value="logItem.apiContentJson" :key="index"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.useChip')">
                          <el-radio-group v-model="store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.scan.chip" size="small">
                            <el-radio-button :label="0">{{$t('message.chip0')}}</el-radio-button>
                            <el-radio-button :label="1">{{$t('message.chip1')}}</el-radio-button>
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('message.filterName')">
                          <el-select v-model="store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.scan.filter_name" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" clearable multiple filterable allow-create default-first-option style="width: 100%">
                          </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.filterMac')">
                          <el-select v-model="store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.scan.filter_mac" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" clearable multiple filterable allow-create default-first-option style="width: 100%">
                          </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.phy')">
                          <el-select v-model="store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.scan.phy" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseInput')" clearable multiple filterable allow-create default-first-option style="width: 100%">
                          </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.fitlerRSSI')">
                          <el-slider v-model="store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.scan.filter_rssi" show-input :min="-85" :max="0">
                          </el-slider>
                        </el-form-item>
                      </el-form>
                    </el-card>
                    <el-card shadow="hover" style="margin-top: 15px;">
                      <div slot="header" class="clearfix">
                        <span>2.{{$t('message.connectScannedDevices')}}</span>
                      </div>
                      <el-form label-width="100px" size="small" style="width: 70%;">
                        <span style="font-size: 12px">{{$t('message.connectScannedDevices')}}</span>
                      </el-form>
                    </el-card>
                    <el-card shadow="hover" style="margin-top: 15px;">
                      <div slot="header" class="clearfix">
                        <span>3.{{$t('message.writeCmd')}}</span>
                      </div>
                      <el-form label-width="100px" size="small" style="width: 70%;">
                        <el-form-item :label="$t('message.historyApi')">
                          <el-select @change="apiDemoWriteChanged" v-model="store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.write.tempFromApiLogUrl" :no-data-text="$t('message.noData')" :no-match-text="$t('message.noMatchData')" :placeholder="$t('message.pleaseSelect')" style="width: 100%">
                            <el-option v-for="(logItem, index) in getApiLogListByFilter({apiName: $t('message.apiWrite')})" :label="JSON.stringify(logItem.apiContent)" :value="logItem.apiContentJson" :key="index"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="HANDLE">
                          <el-input clearable v-model="store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.write.handle"></el-input>
                        </el-form-item>
                        <el-form-item label="VALUE">
                          <el-input clearable v-model="store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.write.value"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('message.writeStyle')">
                          <el-radio-group v-model="store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.write.noresponse" size="small">
                            <el-radio-button label="false">{{$t('message.wait')}}</el-radio-button>
                            <el-radio-button label="true">{{$t('message.noWait')}}</el-radio-button>
                          </el-radio-group>
                        </el-form-item>
                      </el-form>
                    </el-card>
                    <el-button type="primary" style="float: right; margin-top: 15px; margin-bottom: 15px;" size="small" @click="apiDemo2GenCode">{{$t('message.genCode')}}</el-button>
                    <highlight-code class="code" style="clear: both; " lang="javascript" v-if="store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.code.length > 0">
                      {{ store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.code }}
                    </highlight-code>
                  </el-tab-pane>
                </el-tabs>
              </el-col>
              <!-- API Demo帮助 -->
              <el-col :span="6" style="padding: 0 0px 0 26px; ">
                <el-tabs v-show="store.devConfDisplayVars.activeApiDemoMenuItem === 'demo1'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDemoDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.demo1Info')}}
                      <p><a href="https://github.com/CassiaNetworks/node-cassia-sdk" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
                <el-tabs v-show="store.devConfDisplayVars.activeApiDemoMenuItem === 'demo2'">
                  <el-tab-pane>
                    <span slot="label"> {{$t('message.apiDemoDescription')}}</span>
                    <el-row class="apiHelp">
                      {{$t('message.demo2Info')}}
                      <p><a href="https://github.com/CassiaNetworks/node-cassia-sdk" target="_blank">{{$t('message.more')}}</a></p>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
              </el-col>
            </el-main>
          </el-row>

          <!-- 其他主题内容 -->
          <el-main style="height: 100%; margin-left: 190px; " v-show="store.devConfDisplayVars.activeMenuItem !== 'apiDebuggerMenuItem' && store.devConfDisplayVars.activeMenuItem !== 'apiDemoMenuItem'">
            <el-tabs style="background-color: #fff" v-model="store.devConfDisplayVars.scanTabsActiveTab" @tab-click="scanTabsClick" v-show="store.devConfDisplayVars.activeMenuItem === 'scanListMenuItem'">
              <el-tab-pane name="scanResult" style="height: 100%; background-color: #fff; ">
                <span slot="label"> {{$t('message.scanResult')}}</span>
                <vxe-toolbar>
                  <template v-slot:buttons>
                    <span>{{$t('message.devicesCount')}}: <span style="font-weight: bold; color: #409eff; margin-right: 20px;">{{ getComputedScanDisplayResultList.length }} </span></span>
                    <vxe-input v-model="cache.scanDisplayFilterContent" type="search" :placeholder="$t('message.searchMacOrName')" size="small" style="margin-right: 20px;"></vxe-input>
                    <vxe-button @click="scanDisplayResultExport" status="primary" size="small">{{$t('message.export')}}</vxe-button>
                    <vxe-button @click="scanDisplayResultClear" size="small">{{$t('message.clear')}}</vxe-button>
                  </template>
                </vxe-toolbar>
                <!-- 注意设置为固定高度，否则页面在过多的数据时候会造成卡顿，TODO: 是否考虑使用分页优化? -->
                <vxe-grid border="none" show-overflow stripe highlight-hover-row :header-row-style="{'background-color': '#f4f5f6'}" :height="cache.vxeGridHeight + 'px'" ref="refScanDisplayResultGrid" :sort-config="{trigger: 'cell'}" :data="getComputedScanDisplayResultList">
                  <vxe-table-column field="name" :title="$t('message.name')" type="html" width="25%" sortable></vxe-table-column>
                  <vxe-table-column field="mac" :title="$t('message.addr')" type="html" width="15%" show-overflow></vxe-table-column>
                  <vxe-table-column field="bdaddrType" :title="$t('message.type')" width="15%" sortable></vxe-table-column>
                  <vxe-table-column field="rssi" :title="$t('message.signal')" width="15%" sortable></vxe-table-column>
                  <!-- 暂时不显示广播包了，没有找到合适位置，上面的字段自定义slot，数据量大的话会卡顿 -->
                  <!-- <vxe-table-column field="adData" title="广播包" :width="store.devConfDisplayVars.adDataWidth" show-overflow></vxe-table-column> -->
                  <vxe-table-column :title="$t('message.operation')" width="30%">
                    <template v-slot="{ row }">
                      <vxe-button status="primary" size="small" @click="connectDeviceByRow(row, row.mac)" :loading="cache.devicesConnectLoading[row.mac]">{{$t('message.connect')}}</vxe-button>
                      <vxe-button size="small" v-show="!(cache.scanDevicesRssiHistory[row.mac] && cache.scanDevicesRssiHistory[row.mac].length !== 0)" @click="add2RssiChart(row, row.mac)">{{$t('message.add2RssiChart')}}</vxe-button>
                      <vxe-button size="small" v-show="(cache.scanDevicesRssiHistory[row.mac] && cache.scanDevicesRssiHistory[row.mac].length !== 0)" @click="removeFromRssiChart(row, row.mac)">{{$t('message.removeFromRssiChart')}}</vxe-button>
                    </template>
                  </vxe-table-column>
                  <template v-slot:empty>
                    <span>
                      <p>{{$t('message.noData')}}</p>
                    </span>
                  </template>
                </vxe-grid>
              </el-tab-pane>
              <el-tab-pane name="rssiChart" style="width: 100%;">
                <span slot="label"> {{$t('message.rssiChart')}}</span>
                <el-row>
                  <el-form inline size="small">
                    <el-form-item :label="$t('message.statsCycle')">
                      <el-select v-model="store.devConfDisplayVars.rssiChartPeriod" :placeholder="$t('message.statsCycle')" style="width: 100px;">
                        <el-option :label="$t('message.seconds60')" value="60"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('message.statsInterval')">
                      <el-select v-model="store.devConfDisplayVars.rssiChartDataSpan" :placeholder="$t('message.statsInterval')" @change="rssiChartDataSpanChange" style="width: 100px;">
                        <el-option :label="$t('message.millseconds200')" value="200"></el-option>
                        <el-option :label="$t('message.millseconds500')" value="500"></el-option>
                        <el-option :label="$t('message.seconds1')" value="1000"></el-option>
                        <el-option :label="$t('message.seconds2')" value="2000"></el-option>
                        <el-option :label="$t('message.seconds5')" value="5000"></el-option>
                        <el-option :label="$t('message.seconds10')" value="10000"></el-option>
                        <el-option :label="$t('message.seconds30')" value="30000"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button v-show="!store.devConfDisplayVars.rssiChartSwitch" size="small" @click="destoryAndCreateRssiChart" type="primary">{{$t('message.open')}}</el-button>
                      <el-button v-show="store.devConfDisplayVars.rssiChartSwitch && !store.devConfDisplayVars.rssiChartStopped" size="small" @click="stopRssiChart" type="primary">{{$t('message.stop')}}</el-button>
                      <el-button v-show="store.devConfDisplayVars.rssiChartSwitch && store.devConfDisplayVars.rssiChartStopped" size="small" @click="startRssiChart" type="primary">{{$t('message.continue')}}</el-button>
                      <el-button v-show="store.devConfDisplayVars.rssiChartSwitch" size="small" @click="destoryRssiChart">{{$t('message.close')}}</el-button>
                    </el-form-item>
                  </el-form>
                </el-row>
                <v-chart :options="chartOptions" ref="rssiChart" :autoresize="true" :style="{width: '100%', height: cache.vxeGridHeight + 'px'}"></v-chart>
              </el-tab-pane>
              <el-tab-pane name="deviceScanData" style="width: 100%;">
                <span slot="label"> {{$t('message.deviceScanData')}}</span>
                <el-row>
                  <el-form inline size="small">
                    <el-form-item :label="$t('message.timestamp')">
                      <el-select v-model="store.devConfDisplayVars.deviceScanDataTimestamp" :placeholder="$t('message.timestamp')" @change="deviceScanDataFilterChange" style="width: 100px;">
                        <el-option label="OFF" value="0"></el-option>
                        <el-option label="ON" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('message.filterDuplicate')">
                      <el-select v-model="store.devConfDisplayVars.deviceScanDataFilterDuplicate" :placeholder="$t('message.deviceScanDataFilterDuplicate')" @change="deviceScanDataFilterChange" style="width: 100px;">
                        <el-option label="OFF" value=""></el-option>
                        <el-option :label="$t('message.seconds1')" value="1000"></el-option>
                        <el-option :label="$t('message.seconds2')" value="2000"></el-option>
                        <el-option :label="$t('message.seconds5')" value="5000"></el-option>
                        <el-option :label="$t('message.seconds10')" value="10000"></el-option>
                        <el-option :label="$t('message.seconds30')" value="30000"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-tooltip class="item" effect="light" :content="$t('message.scanDetailInfo')">
                        <el-button v-show="!store.devConfDisplayVars.deviceScanDataSwitch" size="small" @click="openDeviceScanData" type="primary">{{$t('message.open')}}<i class="el-icon-info el-icon--right"></i></el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="light" :content="$t('message.scanDetailInfo')">
                        <el-button v-show="store.devConfDisplayVars.deviceScanDataSwitch" size="small" @click="closeDeviceScanDetail">{{$t('message.close')}}<i class="el-icon-info el-icon--right"></i></el-button>
                      </el-tooltip>
                      <el-button type="primary" @click="showDeviceScanDataRealTimeNewTab" size="small">{{$t('message.deviceScanDataRealTime')}}</el-button>
                    </el-form-item>
                  </el-form>
                </el-row>
                <el-row style="padding: 15px 3px 15px 15px; height: calc(100vh - 200px); background-color: #f0f0f0; width: 100%; ">
                  <div class="code scanDataDetail" lang="javascript" style="color: #505050; font-size: 12px; height: 100%; background-color: #f0f0f0; word-break: break-all; overflow-y: auto;" v-if="cache.deviceScanDetail.data">
                    <p v-for="item in (cache.deviceScanDetail.data)">{{item}}</p>
                  </div>
                </el-row>
              </el-tab-pane>
            </el-tabs>
            <el-tabs @tab-click="connectTabsClick" v-model="cache.currentConnectedTab" @tab-remove="connectedListTabRemove" v-show="store.devConfDisplayVars.activeMenuItem === 'connectListMenuItem'">
              <el-tab-pane name="connectTab0" :closable="false">
                <span slot="label"> {{$t('message.connectList')}} </span>
                <vxe-toolbar>
                  <template v-slot:buttons>
                    <span>{{$t('message.connectedDevices')}}: <span style="font-weight: bold; color: #409eff; margin-right: 20px;">{{ getComputedConnectDisplayResultList().length }} </span></span>
                    <vxe-input v-model="cache.connectDisplayFilterContent" type="search" :placeholder="$t('message.searchMacOrName')" size="small" style="margin-right: 20px;"></vxe-input>
                    <vxe-button @click="connectDisplayResultExport" status="primary" size="small">{{$t('message.export')}}</vxe-button>
                    <vxe-button size="small">{{$t('message.clear')}}</vxe-button>
                    <vxe-button @click="disconnectAll" size="small">{{$t('message.disconnectAll')}}</vxe-button>
                  </template>
                </vxe-toolbar>
                <!-- 注意设置为固定高度，否则页面在过多的数据时候会造成卡顿，TODO: 是否考虑使用分页优化? -->
                <vxe-grid border="none" show-overflow stripe highlight-hover-row :height="cache.vxeGridHeight + 'px'" :header-row-style="{'background-color': '#f4f5f6'}" ref="refConnectDisplayResultGrid" :sort-config="{trigger: 'cell'}" :data="getComputedConnectDisplayResultList()">
                  <vxe-table-column field="name" :title="$t('message.name')" type="html" width="15%" sortable></vxe-table-column>
                  <vxe-table-column field="mac" :title="$t('message.addr')" type="html" width="15%" show-overflow></vxe-table-column>
                  <vxe-table-column field="chip" :title="$t('message.chip')" type="html" width="10%" sortable></vxe-table-column>
                  <vxe-table-column field="bdaddrType" :title="$t('message.type')" width="10%" sortable></vxe-table-column>
                  <vxe-table-column :title="$t('message.operation')" width="50%">
                    <template v-slot="{ row }">
                      <el-button-group>
                        <el-button plain type="primary" size="small" @click="getDeviceServices(row.mac)">{{$t('message.services')}}</el-button>
                        <el-button plain type="primary" size="small" @click="disconnectDevice(row.mac)">{{$t('message.disconnect')}}</el-button>
                        <el-button plain type="primary" size="small" @click="showPairDialog(row.mac)">{{$t('message.pair')}}</el-button>
                        <el-button plain type="primary" size="small" @click="unpair(row.mac)">{{$t('message.unpair')}}</el-button>
                        <el-button plain type="primary" size="small" @click="exportDeviceServices(device.mac)">{{$t('message.export')}}</el-button>
                        <el-button plain type="primary" size="small" @click="readDevicePhy(row.mac)">{{$t('message.readPhy')}}</el-button>
                        <el-button plain type="primary" size="small" @click="showUpdateDevicePhyDialog(row.mac)">{{$t('message.updatePhy')}}</el-button>
                      </el-button-group>
                    </template>
                  </vxe-table-column>
                  <template v-slot:empty>
                    <span>
                      <p>{{$t('message.noData')}}</p>
                    </span>
                  </template>
                </vxe-grid>
              </el-tab-pane>
              <el-tab-pane :closable="true" v-for="(device, index) in cache.connectedList" :key="device.mac" :name="device.mac">
                <span slot="label"> {{ device.mac }}</span>
                <el-row style="background-color: #0089ff; font-size: 14px; font-style: normal; border-radius: 3px; color: #fff; height: 60px; display: flex; align-items: center; padding-left: 15px; padding-right: 15px;">
                  <el-col :span="6">
                    <el-row>{{ device.name }}</el-row>
                    <el-row style="font-style:normal">{{ device.mac }}</el-row>
                  </el-col>
                  <el-col :span="3">{{ device.bdaddrType }}</el-col>
                  <el-col :span="1">chip{{ device.chip }}</el-col>
                  <el-col :span="12">
                    <el-button-group style="float: right; ">
                      <el-button size="small" @click="getDeviceServices(device.mac)" style="color: #2897ff">{{$t('message.services')}}</el-button>
                      <el-button size="small" @click="disconnectDevice(device.mac)" style="color: #2897ff">{{$t('message.disconnect')}}</el-button>
                      <el-button size="small" @click="showPairDialog(device.mac)" style="color: #2897ff">{{$t('message.pair')}}</el-button>
                      <el-button size="small" @click="unpair(device.mac)" style="color: #2897ff">{{$t('message.unpair')}}</el-button>
                      <el-button size="small" @click="exportDeviceServices(device.mac)" style="color: #2897ff">{{$t('message.export')}}</el-button>
                      <el-button size="small" @click="readDevicePhy(device.mac)" style="color: #2897ff">{{$t('message.readPhy')}}</el-button>
                      <el-button size="small" @click="showUpdateDevicePhyDialog(device.mac)" style="color: #2897ff">{{$t('message.updatePhy')}}</el-button>
                    </el-button-group>
                  </el-col>
                </el-row>
                <el-row style="padding-left: 0px; margin-top: 15px; ">
                  <el-collapse class="gatt">
                    <el-collapse-item v-for="(service, index) in cache.devicesServiceList[device.mac]" :key="service.uuid">
                      <template slot="title">
                        <el-col style="padding-left: 5px; font-size: 14px; font-weight: normal;">{{ service.uuid }}</el-col>
                        <el-col style="float: right; font-size: 14px; font-weight: normal;">{{ service.name }}</el-col>
                      </template>
                      <el-row style="background-color: #e6e6e6; padding: 15px; border-bottom: 1px solid #fff" v-for="(char, index) in service.characteristics" title="char.name" :key="char.uuid">
                        <el-row style="font-size: 14px; font-weight: bold; font-style: normal;">{{ char.name }}</el-row>
                        <el-row style="font-size: 12px; font-style: normal;">UUID: {{ char.uuid }}</el-row>
                        <el-row style="font-size: 12px; font-style: normal;">HANDLE: {{ char.handle }}</el-row>
                        <el-row style="font-size: 12px; font-style: normal; ">
                          Properties:
                          <el-button-group>
                            <el-button style="font-style: normal; font-weight: bold;" v-show="char.propertiesStr.includes('READ')" type="primary" size="small" @click="propertyClick('READ', device.mac, char)">
                              READ
                            </el-button>
                            <el-button style="font-style: normal; font-weight: bold;" v-bind:type="char.notifyStatus === 'on' ? 'primary' : 'info'" v-show="char.propertiesStr.includes('NOTIFY')" size="small" @click="propertyClick('NOTIFY', device.mac, char)">
                              NOTIFY
                            </el-button>
                            <el-button style="font-style: normal; font-weight: bold;" v-bind:type="char.notifyStatus === 'on' ? 'primary' : 'info'" v-show="char.propertiesStr.includes('INDICATE')" size="small" @click="propertyClick('INDICATE', device.mac, char)">
                              INDICATE
                            </el-button>
                            </el-switch>
                            <el-button style="font-style: normal; font-weight: bold;" v-show="char.propertiesStr.includes('WRITE NO RES')" type="primary" size="small" @click="propertyClick('WRITE NO RES', device.mac, char)">
                              WRITE NO RES
                            </el-button>
                            <el-button style="font-style: normal; font-weight: bold;" v-show="char.propertiesStr.includes('WRITE')" type="primary" size="small" @click="propertyClick('WRITE', device.mac, char)">
                              WRITE
                            </el-button>
                          </el-button-group>
                          <el-radio-group v-show="char.propertiesStr.includes('WRITE') || char.propertiesStr.includes('WRITE NO RES')" style="float: right" size="small" v-model="char.writeValueType">
                            <el-radio-button label="hex">HEX</el-radio-button>
                            <el-radio-button label="text">TEXT</el-radio-button>
                          </el-radio-group>
                          <el-input v-show="char.propertiesStr.includes('WRITE') || char.propertiesStr.includes('WRITE NO RES')" clearable style="width: 220px; float: right; font-size: 12px; font-style: normal;" size="small" v-model="char.writeValue" :placeholder="char.writeValueType === 'hex' ? '格式：aa00bb11cc22（支持空格）' : '格式：任意字符'">
                          </el-input>
                        </el-row>
                        <el-row style="font-size: 12px; font-style: normal; color: #409eff" v-show="char.readValue.toString().length !== 0">
                          Value: (0x)
                          <el-popover trigger="click" width="600" placement="right">
                            <el-table :data="char.parsedReadValues" width="100%" stripe :empty-text="$t('message.noParser')">
                              <el-table-column :label="$t('message.field')" width="180">
                                <template slot-scope="scope">
                                  <span>{{ scope.row.name }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column :label="$t('message.parse')" width="300">
                                <template slot-scope="scope">
                                  <span>{{ scope.row.parsed }}</span>
                                </template>
                              </el-table-column>
                              <el-table-column label="HEX(0x)" width="120">
                                <template slot-scope="scope">
                                  <span>{{ scope.row.raw }}</span>
                                </template>
                              </el-table-column>
                            </el-table>
                            <el-button slot="reference" type="text">
                              {{ char.readValue }}
                            </el-button>
                          </el-popover>
                        </el-row>
                      </el-row>
                    </el-collapse-item>
                  </el-collapse>
                </el-row>
              </el-tab-pane>
            </el-tabs>
            <el-tabs v-show="store.devConfDisplayVars.activeMenuItem === 'notifyListMenuItem'">
              <el-tab-pane>
                <span slot="label"> {{$t('message.notifyList')}}</span>
                <el-row>
                  <vxe-toolbar>
                    <template v-slot:buttons>
                      <span>{{$t('message.receivedNotifys')}}: <span style="font-weight: bold; color: #409eff; margin-right: 20px;">{{ getComputedNotifyDisplayResultList.length }} </span></span>
                      <vxe-input v-model="cache.notifyDisplayFilterContent" type="search" :placeholder="$t('message.searchMac')" size="small" style="margin-right: 20px;"></vxe-input>
                      
                      <el-tooltip class="item" effect="light" :content="$t('message.timestampInfo')">
                        <span style="margin-right: 8px;">{{$t('message.timestamp')}}<i class="el-icon-info el-icon--right"></i></span>
                      </el-tooltip>
                      <el-select v-model="cache.notifyDisplayTimestamp" :placeholder="$t('message.timestamp')" size="small" @change="deviceScanDataFilterChange" style="width: 110px; margin-right: 20px;">
                        <el-option label="OFF" value="0"></el-option>
                        <el-option label="Local Time" value="1"></el-option>
                        <el-option label="ISO 8601" value="2"></el-option>
                        <el-option label="Timestamp" value="3"></el-option>
                      </el-select>

                      <el-tooltip class="item" effect="light" :content="$t('message.timestampInfo')">
                        <span style="margin-right: 8px;">{{$t('message.notificationSequence')}}<i class="el-icon-info el-icon--right"></i></span>
                      </el-tooltip>
                      <el-select v-model="cache.notifyDisplaySequence" :placeholder="$t('message.timestamp')" size="small" @change="deviceScanDataFilterChange" style="width: 90px; margin-right: 20px;">
                        <el-option label="OFF" value="0"></el-option>
                        <el-option label="Global" value="1"></el-option>
                        <el-option label="Device" value="2"></el-option>
                      </el-select>

                      <el-tooltip class="item" effect="light" :content="$t('message.notificationDetailInfo')">
                        <vxe-button @click="openNotify" status="primary" size="small" v-show="!store.devConfDisplayVars.isNotifyOn">{{$t('message.open')}}<i class="el-icon-info el-icon--right"></i></vxe-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="light" :content="$t('message.notificationDetailInfo')">
                        <vxe-button @click="closeNotify" size="small" v-show="store.devConfDisplayVars.isNotifyOn">{{$t('message.close')}}<i class="el-icon-info el-icon--right"></i></vxe-button>
                      </el-tooltip>
                      <vxe-button @click="notifyDisplayResultExport" status="primary" size="small">{{$t('message.export')}}</vxe-button>
                      <vxe-button @click="notifyDisplayResultClear" size="small" style="margin-right: 10px">{{$t('message.clear')}}</vxe-button>
                      <vxe-button type="primary" @click="showDeviceNotificationDataRealTimeNewTab" size="small">{{$t('message.deviceScanDataRealTime')}}</vxe-button>
                    </template>
                  </vxe-toolbar>
                  <!-- 注意设置为固定高度，否则页面在过多的数据时候会造成卡顿，TODO: 是否考虑使用分页优化? -->
                  <vxe-grid border="none" show-overflow stripe :height="cache.vxeGridHeight + 'px'" highlight-hover-row :header-row-style="{'background-color': '#f4f5f6'}" ref="refNotifyDisplayResultGrid" :sort-config="{trigger: 'cell'}" :data="getComputedNotifyDisplayResultList">
                    <vxe-table-column field="seqNum" :title="$t('message.notificationSequence')" type="html" width="15%" sortable></vxe-table-column>
                    <vxe-table-column field="time" :title="$t('message.timestamp')" type="html" width="15%" sortable></vxe-table-column>
                    <vxe-table-column field="mac" :title="$t('message.addr')" type="html" width="15%" show-overflow></vxe-table-column>
                    <vxe-table-column field="handle" title="HANDLE" width="10%"></vxe-table-column>
                    <vxe-table-column field="value" title="VALUE" width="40%" show-overflow></vxe-table-column>
                    <template v-slot:empty>
                      <span>
                        <p>{{$t('message.noData')}}</p>
                      </span>
                    </template>
                  </vxe-grid>
                </el-row>
              </el-tab-pane>
            </el-tabs>
            <el-tabs v-show="store.devConfDisplayVars.activeMenuItem === 'apiLogListMenuItem'">
              <el-tab-pane>
                <span slot="label"> {{$t('message.apiLogList')}}</span>
                <el-row>
                  <vxe-toolbar>
                    <template v-slot:buttons>
                      <span>{{$t('message.logsCount')}}: <span style="font-weight: bold; color: #409eff; margin-right: 20px;">{{ getComputedApiLogDisplayResultList().length }} </span></span>
                      <vxe-input v-model="cache.apiLogDisplayFilterContent" type="search" :placeholder="$t('message.search')" size="small" style="margin-right: 20px;"></vxe-input>
                      <vxe-button @click="apiLogDisplayResultExport" status="primary" size="small">{{$t('message.export')}}</vxe-button>
                      <vxe-button @click="apiLogDisplayResultClear" size="small">{{$t('message.clear')}}</vxe-button>
                    </template>
                  </vxe-toolbar>
                  <!-- 注意设置为固定高度，否则页面在过多的数据时候会造成卡顿，TODO: 是否考虑使用分页优化? -->
                  <vxe-grid class="apiLog" border="none" stripe :height="cache.vxeGridHeight + 'px'" highlight-hover-row :header-row-style="{'background-color': '#f4f5f6'}" ref="refApiLogDisplayResultGrid" :sort-config="{trigger: 'cell'}" :data="getComputedApiLogDisplayResultList()">
                    <vxe-table-column field="timeStr" :title="$t('message.time')" type="html" width="20%" sortable></vxe-table-column>
                    <vxe-table-column field="apiName" :title="$t('message.apiName')" type="html" width="15%" sortable></vxe-table-column>
                    <vxe-table-column field="apiContentJson" :title="$t('message.reqContent')" type="html" width="55%" sortable></vxe-table-column>
                    <vxe-table-column :title="$t('message.operation')" width="10%">
                      <template v-slot="{ row }">
                        <vxe-button status="primary" size="small" @click="replayApi(row)">{{$t('message.replayApiOperation')}}</vxe-button>
                      </template>
                    </vxe-table-column>
                    <template v-slot:empty>
                      <span>
                        <p>{{$t('message.noData')}}</p>
                      </span>
                    </template>
                  </vxe-grid>
                </el-row>
              </el-tab-pane>
            </el-tabs>
            <el-tabs v-show="store.devConfDisplayVars.activeMenuItem === 'toolsMenuItem'">
              <el-tab-pane>
                <span slot="label"> {{$t('message.tools')}}</span>
                <el-card shadow="hover">
                  <div slot="header" class="clearfix">
                    <span>BASE64</span>
                  </div>
                  <el-form :inline="true" size="small" style="width: 100%">
                    <el-form-item>
                      <el-radio-group v-model="store.devConfDisplayVars.toolsBase64.type">
                        <el-radio-button label="base64"></el-radio-button>
                        <el-radio-button label="text"></el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                      <el-input clearable v-model="store.devConfDisplayVars.toolsBase64.value" style="min-width: 350px;">
                      </el-input>
                    </el-form-item>
                  </el-form>
                </el-card>
                <el-card shadow="hover" style="margin-top: 15px">
                  <div slot="header" class="clearfix">
                    <span>{{$t('message.binaryConversion')}}</span>
                  </div>
                  <el-form :inline="true" size="small" style="width: 100%">
                    <el-form-item>
                      <el-radio-group v-model="store.devConfDisplayVars.toolsBinaryConversion.type">
                        <el-radio-button label="2"></el-radio-button>
                        <el-radio-button label="10"></el-radio-button>
                        <el-radio-button label="16"></el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                      <el-input clearable v-model="store.devConfDisplayVars.toolsBinaryConversion.value">
                      </el-input>
                    </el-form-item>
                  </el-form>
                </el-card>
                <el-card shadow="hover" style="margin-top: 15px">
                  <div slot="header" class="clearfix">
                    <span>HEX/TEXT</span>
                  </div>
                  <el-form :inline="true" size="small" style="width: 100%">
                    <el-form-item>
                      <el-radio-group v-model="store.devConfDisplayVars.toolsHexTextConversion.type">
                        <el-radio-button label="hex"></el-radio-button>
                        <el-radio-button label="text"></el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                      <el-input clearable v-model="store.devConfDisplayVars.toolsHexTextConversion.value">
                      </el-input>
                    </el-form-item>
                  </el-form>
                </el-card>
                <el-card shadow="hover" style="margin-top: 15px">
                  <div slot="header" class="clearfix">
                    <span>{{$t('message.jsonFormatter')}}</span>
                  </div>
                  <el-form size="small" style="width: 100%">
                    <el-form-item>
                      <el-input clearable v-model="store.devConfDisplayVars.toolsJsonConversion.inline">
                      </el-input>
                    </el-form-item>
                    <el-form-item>
                      <highlight-code class="code" lang="javascript" v-if="store.devConfDisplayVars.toolsJsonConversion.format.length > 0">
                        {{ store.devConfDisplayVars.toolsJsonConversion.format }}
                      </highlight-code>
                    </el-form-item>
                  </el-form>
                </el-card>
              </el-tab-pane>
            </el-tabs>
            <el-tabs v-show="store.devConfDisplayVars.activeMenuItem === 'resourcesMenuItem'" class="resourcesPage">
              <el-tab-pane>
                <span slot="label"> {{$t('message.resources')}}</span>
                <ul>
                  <li><a target="_blank" href="https://www.cassianetworks.com/knowledge-base/general-documents/">Cassia User Manual</a></li>
                  <li><a target="_blank" href="https://github.com/CassiaNetworks/CassiaSDKGuide/wiki">Cassia SDK & RESTful API</a></li>
                  <li><a target="_blank" href="https://github.com/CassiaNetworks/CassiaSDKGuide">Cassia RESTful API Sample Code</a></li>
                  <li><a target="_blank" href="https://www.cassianetworks.com/support/">Contact Cassia Support</a></li>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog title="Security OOB" center :visible.sync="store.devConfDisplayVars.pairBySecurityOOB.visible">
    <el-form label-width="80px" size="small">
      <el-form-item :label="$t('message.deviceAddr')">
        <el-input v-model="store.devConfDisplayVars.pairBySecurityOOB.deviceMac" disabled></el-input>
      </el-form-item>
      <el-form-item label="rand">
        <el-input v-model="store.devConfDisplayVars.pairBySecurityOOB.rand" clearable></el-input>
      </el-form-item>
      <el-form-item label="confirm">
        <el-input v-model="store.devConfDisplayVars.pairBySecurityOOB.confirm" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="store.devConfDisplayVars.pairBySecurityOOB.visible = false">{{$t('message.cancel')}}</el-button>
      <el-button type="primary" @click="pairBySecurityOOB">{{$t('message.ok')}}</el-button>
    </span>
  </el-dialog>
  <el-dialog title="LE Legacy OOB" center :visible.sync="store.devConfDisplayVars.pairByLegacyOOB.visible">
    <el-form label-width="80px" size="small">
      <el-form-item :label="$t('message.deviceAddr')">
        <el-input v-model="store.devConfDisplayVars.pairByLegacyOOB.deviceMac" disabled></el-input>
      </el-form-item>
      <el-form-item label="tk">
        <el-input v-model="store.devConfDisplayVars.pairByLegacyOOB.tk" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="store.devConfDisplayVars.pairByLegacyOOB.visible = false">{{$t('message.cancel')}}</el-button>
      <el-button type="primary" @click="pairByLegacyOOB">{{$t('message.ok')}}</el-button>
    </span>
  </el-dialog>
  <el-dialog title="Passkey" center :visible.sync="store.devConfDisplayVars.pairByPasskey.visible">
    <el-form label-width="80px" size="small">
      <el-form-item :label="$t('message.deviceAddr')">
        <el-input v-model="store.devConfDisplayVars.pairByPasskey.deviceMac" disabled></el-input>
      </el-form-item>
      <el-form-item label="passkey">
        <el-input v-model="store.devConfDisplayVars.pairByPasskey.passkey" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="store.devConfDisplayVars.pairByPasskey.visible = false">{{$t('message.cancel')}}</el-button>
      <el-button type="primary" @click="pairByPasskey">{{$t('message.ok')}}</el-button>
    </span>
  </el-dialog>
  <el-dialog title="Pair" center :visible.sync="store.devConfDisplayVars.pair.visible">
    <el-form label-width="130px" size="small">
      <el-form-item label="Device Mac">
        <el-input v-model="store.devConfDisplayVars.pair.deviceMac" disabled></el-input>
      </el-form-item>
      <el-form-item label="Timeout(Seconds)">
        <el-input v-model="store.devConfDisplayVars.pair.timeout"></el-input>
      </el-form-item>
      <el-form-item label="Io Capability">
        <el-select v-model="store.devConfDisplayVars.pair.iocapability" style="width: 100%">
          <el-option label="KeyboardDisplay" value="KeyboardDisplay"></el-option>
          <el-option label="DisplayOnly" value="DisplayOnly"></el-option>
          <el-option label="DisplayYesNo" value="DisplayYesNo"></el-option>
          <el-option label="KeyboardOnly" value="KeyboardOnly"></el-option>
          <el-option label="NoInputNoOutput" value="NoInputNoOutput"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Bond">
        <el-select v-model="store.devConfDisplayVars.pair.bond" style="width: 100%">
          <el-option label="YES" value="1"></el-option>
          <el-option label="NO" value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="store.devConfDisplayVars.pair.visible = false" size="small">{{$t('message.cancel')}}</el-button>
      <el-button type="primary" @click="pair" size="small">{{$t('message.ok')}}</el-button>
    </span>
  </el-dialog>

  <el-dialog title="Update PHY" center :visible.sync="store.devConfDisplayVars.updatePhy.visible">
    <el-form label-width="130px" size="small">
      <el-form-item label="Device Mac">
        <el-input v-model="store.devConfDisplayVars.updatePhy.deviceMac" disabled></el-input>
      </el-form-item>
      <el-form-item label="TX PHY">
        <el-select v-model="store.devConfDisplayVars.updatePhy.tx" clearable multiple filterable style="width: 100%">
          <el-option label="1M" value="1M" key="1M"></el-option>
          <el-option label="2M" value="2M" key="2M"></el-option>
          <el-option label="CODED" value="CODED" key="CODED"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="RX PHY">
        <el-select v-model="store.devConfDisplayVars.updatePhy.rx" clearable multiple filterable style="width: 100%">
          <el-option label="1M" value="1M" key="1M"></el-option>
          <el-option label="2M" value="2M" key="2M"></el-option>
          <el-option label="CODED" value="CODED" key="CODED"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="TX CODED Option" v-show="store.devConfDisplayVars.updatePhy.tx.includes('CODED')">
        <el-select v-model="store.devConfDisplayVars.updatePhy.codedOption" style="width: 100%">
          <el-option label="Auto Negotiation" value="0" key="1M"></el-option>
          <el-option label="S2" value="1" key="S2"></el-option>
          <el-option label="S8" value="2" key="S8"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="store.devConfDisplayVars.updatePhy.visible = false" size="small">{{$t('message.cancel')}}</el-button>
      <el-button type="primary" @click="updatePhy" size="small">{{$t('message.ok')}}</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import vueModule from './module/vue.js';
export default vueModule.createVue();
</script>

<style>
HTML {}

@font-face {
  font-family: 'icomoon';
  src: url('assets/fonts/icomoon.eot?76a4xn');
  src: url('assets/fonts/icomoon.eot?76a4xn#iefix') format('embedded-opentype'),
    url('assets/fonts/icomoon.ttf?76a4xn') format('truetype'),
    url('assets/fonts/icomoon.woff?76a4xn') format('woff'),
    url('assets/fonts/icomoon.svg?76a4xn#icomoon') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

[class^="icon-"],
[class*=" icon-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-logo:before {
  content: "\e900";
  color: #fff;
}

.icon-fold:before {
  content: "\e901";
}

.icon-unfold:before {
  content: "\e902";
}

.icon-api-debugger:before {
  content: "\e903";
}

.icon-API-demo:before {
  content: "\e904";
}

.icon-API-log:before {
  content: "\e905";
}

.icon-connection-list:before {
  content: "\e906";
}

.icon-notification-list:before {
  content: "\e907";
}

.icon-scan-list:before {
  content: "\e908";
}

.icon-tools:before {
  content: "\e909";
}

HTML,
BODY {
  margin: 0px;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
}

* {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

#app {
  width: 100%;
  height: 100%;
}

/* 取消显示侧边菜单的右侧边框 */
.el-menu-vertical-demo {
  /* border-left: 1px solid #e6e6e6; */
  border-right: 0px;
  width: 100%;
  height: 100%;
  text-align: left;
}

.el-drawer__body { 
  overflow: auto; 
}

.el-menu-api-demo,
.el-menu-api-debugger {
  width: 100%;
  height: 100%;
  border: 0;
}

input::-webkit-input-placeholder {
  /* font-style: italic; */
}

div::-webkit-scrollbar {
  width: 0;
}

.scanDataDetail::-webkit-scrollbar {
  width: 6px;
}

pre::-webkit-scrollbar {
  width: 0;
}

code {
  overflow-y: scroll;
}

.hljs {
  font-size: 12px;
  padding: 15px;
}

/* 当页面加载完再显示 */
[v-cloak] {
  display: none;
}

.el-menu-item.is-active {
  background-color: rgba(0, 137, 255, 0.05) !important;
}

.apiDebuggerMenu .el-menu-item.is-active {
  border-left: 2px solid rgba(0, 137, 255, 1);
}

.el-menu.el-menu--horizontal {
  border: 0px;
}

.apiDebuggerOutputMenu .el-menu-item.is-active {
  border-bottom: 2px solid #0089ff;
}

.apiDebuggerOutputMenu .el-menu-item {
  height: 40px;
  line-height: 40px;
}

.apiDebuggerOutputMenu .el-menu-item.is-active {
  background-color: #fff !important;
  border-bottom-color: rgba(0, 137, 255, 1) !important;
}

.apiHelp {
  color: #505050;
  font-size: 14px;
  line-height: 24px;
}

.apiHelp a {
  font-size: 12px;
  text-decoration: none;
  color: rgba(0, 137, 255, 1);
}

.apiLog a {
  color: #2897ff;
}

.resourcesPage a {
  color: #2897ff;
}

.code * {
  /* 强制换行 */
  font-family: "Monaco", "Courier New", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif !important;
  white-space: pre-wrap;
  word-break: break-all;
  /* CSS 2.1 */
}

.gatt .el-collapse-item * {
  font-family: "Courier New", "Monaco", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif !important;
}

.el-collapse-item [class^="el-icon-"],
.el-collapse-item .el-select__caret,
.el-collapse-item .el-input__icon,
.el-collapse-item .el-cascader__caret,
.el-collapse-item .el-date-editor .el-icon-date,
.el-collapse-item [class*=" el-icon-"],
.el-collapse-item [class^="el-icon-"]::before,
.el-collapse-item [class*=" el-icon-"]::before {
  font-family: 'element-icons' !important;
}

.el-notification__content {
  word-break: break-all;
}

.el-menu-item:hover {
  background-color: #f2f8ff !important;
}

.configMenuItem {
  border-bottom: 1px solid #eef1fa;
}

.el-drawer__header {
  background-color: #0089ff;
  border-color: #0089ff;
}

.vxe-button.type--button.theme--primary:not(.is--disabled),
.el-radio-button__orig-radio:checked+.el-radio-button__inner,
.el-button--primary {
  background-color: #0089ff;
  border-color: #0089ff;
}

.el-tabs__item.is-active {
  color: #0089ff;
}

.language .el-input__inner {
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
  border: 1px solid #fff;
}

.language .el-input__inner:hover {
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
  border: 1px solid #fff;
}

.el-radio-button__inner {
  width: 80px;
}
</style>
