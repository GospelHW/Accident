import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccidentDetailService} from './accident-detail.service';
import {GlobalState} from '../../global.state';
import wx from 'weixin-js-sdk';
import $ from 'jquery';


@Component({
  selector: 'app-new-letters',
  templateUrl: './accident-detail.html',
  styleUrls: ['./accident-detail.scss'],
  providers: [AccidentDetailService]
})
export class PageAccidentDetailComponent implements OnInit {
  userInfo = {};
  accidentId = '';
  lettersInfo;
  subletInfo = [];
  lettersInSublet;
  isManager: boolean;
  currentUrl = '';
  locationHref = '';
  currentId = '';

  latitude: 0;
  longitude: 0;
  txurl: string;

  constructor(private router: Router, private _service: AccidentDetailService, private activatedRoute: ActivatedRoute,
              private _state: GlobalState) {
    this.activatedRoute.params.subscribe(params => {
      this.accidentId = params['accident_id'];
    });
  }

  ngOnInit() {
    this.locationHref = window.location.href;
    this.currentUrl = decodeURIComponent(window.atob(this.locationHref.match(/param=(\S*)#\/detail/)[1]));

    this.currentId = this.currentUrl.match(/accid=(\S*)&/)[1];

    if (this.currentUrl.match(/txurl=(\S*)#/)) {
      this.txurl = this.currentUrl.match(/txurl=(\S*)#/)[1];
      this.authJJT();
    }
    this.userInfo = this._state.userInfo;
    console.log('detail', this.userInfo['roleType']);
    this.isManager = this.userInfo['roleType'] === 2;
    if (this.accidentId === '') {
      this.accidentId = this._state.accidentId;
    }
    // this.reviewDetail(this.userInfo['userId']);
    this.getUserInfo();
  }

  getUserInfo() {
    this._service.getUserInfo(this.currentId)
      .subscribe(res => {
        if (res.success === true) {
          this._state.userInfo = {
            userId: res.userid, username: res.user_name, oid: res.oid, projName: res.proj_name,
            grule: res.grule, roleType: res.role_type, typeext: res.typeext
          };
          this.isManager = res.role_type === 2;
          this.reviewDetail(res.userid);
        }
      });
  }

  reviewDetail(userId) {
    this._service.reviewDetail(this.accidentId, userId)
      .subscribe(res => {
        if (res.success === true) {
          this.lettersInfo = res.accidentExpressList[0];
          this.latitude = this.lettersInfo.latitude;
          this.longitude = this.lettersInfo.longitude;
          this.subletInfo = res.accidentRenewalList;
          if (this.subletInfo.length > 0) {
            this.subletInfo = this.subletInfo.map(data => {
              let times = data['created_time'].split(':');
              data['created_time'] = `${times[0]}:${times[1]}`;
              return data;
            });
          }
          this.lettersInSublet = this.subletInfo.shift();
        }
      });
  }

  goToStat() {
    this.router.navigate(['/stat']);
  }

  goToSublet() {
    this.router.navigate(['/sublet',
      {
        accidentId: this.accidentId,
        accidentName: this.lettersInfo.accident_name,
        companyDiedAmount: this.lettersInfo.company_died_amount,
        subcontractDiedAmount: this.lettersInfo.subcontract_died_amount,
        otherDiedAmount: this.lettersInfo.other_died_amount,
        companyMissingAmount: this.lettersInfo.company_missing_amount,
        subcontractMissingAmount: this.lettersInfo.subcontract_missing_amount,
        otherMissingAmount: this.lettersInfo.other_missing_amount,
        companyStuckingAmount: this.lettersInfo.company_stucking_amount,
        subcontractStuckingAmount: this.lettersInfo.subcontract_stucking_amount,
        otherStuckingAmount: this.lettersInfo.other_stucking_amount,
        companySeriousInjuryAmount: this.lettersInfo.company_seriousinjury_amount,
        subcontractSeriousInjuryAmount: this.lettersInfo.subcontract_seriousinjury_amount,
        otherSeriousInjuryAmount: this.lettersInfo.other_seriousinjury_amount
      }]);
  }

  previewPhoto(i, data) {
    wx.previewImage({
      current: data[i].path, // 当前显示图片的http链接
      urls: data.map(e => e.path) // 需要预览的图片http链接列表
    });
  }

  showMapBywx() {
    const that = this;
    wx.openLocation({
      latitude: that.latitude - 0, // 纬度，浮点数，范围为90 ~ -90
      longitude: that.longitude - 0, // 经度，浮点数，范围为180 ~ -180。
      name: '事故发生地点', // 位置名
      address: that.lettersInfo.ocurr_location + '\n(' + that.latitude
      + ', ' + that.longitude + ')', // 地址详情说明
      scale: 12, // 地图缩放级别,整形值,范围从1~28。默认为16
    });
  }

  authJJT() {
    $(() => {
      const url = window.location.href.split('#')[0];
      $.ajax({
        async: false,
        type: 'post',
        data: {'url': url, 'fromW': 'accident'},
        url: this._state.txSDKUrl,
        success: function (reult) {
          const json1: any = JSON.parse(reult);
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wl2c5e89d5c4', // 必填，交建通的cropID
            timestamp: json1.timestamp, // 必填，生成签名的时间戳
            nonceStr: json1.nonceStr, // 必填，生成签名的随机串
            signature: json1.signature, // 必填，签名，见附录1
            jsApiList: [
              'openLocation'
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
}
