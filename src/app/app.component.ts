import {Component} from '@angular/core';
import {GlobalState} from './global.state';
import $ from 'jquery';
import wx from 'weixin-js-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  txSDKUrl = '';
  txUserValidUrl = '';
  txUserValidErro = '';
  userAgent;
  currentUrl;
  locationHref;
  onceCode;
  atpref;
  aturl;
  userUrl;
  subPref;

  constructor(private _state: GlobalState) {
    this.userAgent = navigator.userAgent;
    this._state.isAndroid = this.userAgent.indexOf('Android') > -1 || this.userAgent.indexOf('Adr') > -1;
    this._state.isIos = !!this.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

    this.locationHref = window.location.href;
    this.currentUrl = decodeURIComponent(window.atob(this.locationHref.match(/param=(\S*)#\/stat/)[1]));
    // code
    this.onceCode = this.locationHref.indexOf('code=') > -1 ? this.locationHref.match(/code=(\S*)/)[1] : '0';
    console.log('onceCode', this.onceCode);
    // 获取accessToken 的url和参数
    this.atpref = this.currentUrl.match(/atpref=(\S*)&getuserurl/)[1]; // http域名公共部分
    console.log('atpref', this.atpref);
    this.userUrl = this.currentUrl.match(/getuserurl=(\S*)&aturl/)[1]; // 获取用户信息方法名及参数部分
    console.log('userUrl', this.userUrl);
    this.aturl = this.currentUrl.match(/aturl=(\S*)&pref/)[1]; // 获取accesstoken方法名及参数部分
    console.log('aturl', this.aturl);
    // 子系统认证及url签名
    this.subPref = this.currentUrl.match(/&pref=(\S*)&uvr/)[1]; // 获取accesstoken方法名及参数部分
    console.log('subPref', this.subPref);

    // this._state.laborUserId = this.currentUrl.match(/accid=(\S*)&uvr/)[1];
    this.txUserValidUrl = this.txUserValidUrl = this.currentUrl.match(/uvr=(\S*)&txurl/)[1];
    this._state.txSDKUrl = this.txSDKUrl = this.currentUrl.match(/txurl=(\S*)&txErrorurl/)[1];
    this.txUserValidErro = this.txUserValidErro = this.currentUrl.match(/txErrorurl=(\S*)/)[1];

    $(() => {
      const url = this.locationHref.split('#')[0];
      console.log('this.atpref + this.aturl::::', this.atpref + this.aturl);
      const that = this;
      // if (that._state.accToken.key === '' || (Date.parse(new Date().toString()) - that._state.accToken.times) / 1000 > 7000) {
      //   // 获取accesstoken
      //   $.ajax({
      //     async: false,
      //     type: 'post',
      //     url: that.atpref + that.aturl,
      //     success: function (ATResult) {
      //       console.log('ATResult', ATResult);
      //       that._state.accToken.key = ATResult.access_token;
      //       this._state.accToken.times = Date.parse(new Date().toString());
      //     }, error: function (res) {
      //       console.log('获取accesstoken异常：', res.errMsg);
      //       alert('获取accesstoken异常：' + res.errMsg);
      //     }
      //   });
      // }

      // 获取UserInfo
      // $.ajax({
      //   async: false,
      //   type: 'post',
      //   data: {'access_token': that._state.accToken.key, 'code': that.onceCode},
      //   url: that.atpref + that.userUrl,
      //   success: function (UResult) {
      //     console.log('ATResult', UResult);
      //     that._state.laborUserId = UResult.userId;
      //     // 子系统用户认证
      //     $.ajax({
      //       async: false,
      //       type: 'post',
      //       data: {'userid': that._state.laborUserId, 'fromW': 'accident'},
      //       url: this.txUserValidUrl,
      //       success: function (uvResult) {
      //         $.ajax({
      //           async: false,
      //           type: 'post',
      //           data: {'url': url, 'fromW': 'accident'},
      //           url: that.txSDKUrl,
      //           success: function (reult) {
      //             console.log('reult', reult);
      //             const json1: any = JSON.parse(reult);
      //             wx.config({
      //               debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      //               appId: 'wl2c5e89d5c4', // 必填，交建通的cropID
      //               timestamp: json1.timestamp, // 必填，生成签名的时间戳
      //               nonceStr: json1.nonceStr, // 必填，生成签名的随机串
      //               signature: json1.signature, // 必填，签名，见附录1
      //               jsApiList: [
      //                 'openLocation',
      //                 'getLocation',
      //                 'getNetworkType',
      //                 'startRecord',
      //                 'stopRecord',
      //                 'onVoiceRecordEnd',
      //                 'playVoice',
      //                 'pauseVoice',
      //                 'stopVoice',
      //                 'onVoicePlayEnd',
      //                 'uploadVoice',
      //                 'downloadVoice',
      //                 'chooseImage',
      //                 'previewImage',
      //                 'uploadImage',
      //                 'downloadImage',
      //                 'getLocalImgData'
      //               ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      //             });
      //           }, error: function (res) {
      //             console.log('js-sdk签名失败', res.errMsg);
      //           }
      //         });
      //       }, error: function (res) {
      //         console.log('第三方未授权', res.errMsg);
      //         window.location.href = this.txUserValidErro;
      //       }
      //     });
      //
      //   }, error: function (res) {
      //     console.log('获取UserInfo：', res.errMsg);
      //     alert('获取UserInfo：' + res.errMsg);
      //   }
      // });

      $.ajax({
        async: false,
        type: 'post',
        data: {'url': url, 'fromW': 'accident'},
        url: that.txSDKUrl,
        success: function (reult) {
          console.log('reult', reult);
          const json1: any = JSON.parse(reult);
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wl2c5e89d5c4', // 必填，交建通的cropID
            timestamp: json1.timestamp, // 必填，生成签名的时间戳
            nonceStr: json1.nonceStr, // 必填，生成签名的随机串
            signature: json1.signature, // 必填，签名，见附录1
            jsApiList: [
              'openLocation',
              'getLocation',
              'getNetworkType',
              'startRecord',
              'stopRecord',
              'onVoiceRecordEnd',
              'playVoice',
              'pauseVoice',
              'stopVoice',
              'onVoicePlayEnd',
              'uploadVoice',
              'downloadVoice',
              'chooseImage',
              'previewImage',
              'uploadImage',
              'downloadImage',
              'getLocalImgData'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
        }, error: function (res) {
          console.log('js-sdk签名失败', res.errMsg);
        }
      });

      wx.ready(function () {

        wx.error(function (res) {
          console.log('ready.error', res.errMsg);
        });
      });
    });
  }

  getCurrentTime() {
    let dates = new Date().toLocaleDateString().split('/');
    dates = dates.map(ele => {
      if (ele.length < 2) {
        ele = '0' + ele;
      }
      return ele;
    });
    return dates.join('-') + new Date().toLocaleTimeString('chinese', {hour12: false});
  }
}
