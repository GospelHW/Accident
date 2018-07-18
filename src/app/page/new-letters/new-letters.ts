import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalState} from '../../global.state';
import {NewLettersService} from './new-letters.service';
import $ from 'jquery';
import wx from 'weixin-js-sdk';
import {NumberValidator} from '../numer.directive';

declare var qq: any;

@Component({
  selector: 'app-new-letters',
  templateUrl: './new-letters.html',
  styleUrls: ['./new-letters.scss'],
  providers: [NewLettersService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNewLettersComponent implements OnInit {
  accidentForm: FormGroup;
  projectName: AbstractControl;
  occurTime: AbstractControl;
  ocurrPart: AbstractControl;
  occurLocation: AbstractControl;
  accidentType: AbstractControl;
  projType: AbstractControl;
  companyDiedAmount: AbstractControl;
  subcontractDiedAmount: AbstractControl;
  otherDiedAmount: AbstractControl;
  companyMissingAmount: AbstractControl;
  subcontractMissingAmount: AbstractControl;
  otherMissingAmount: AbstractControl;
  companyStuckingAmount: AbstractControl;
  subcontractStuckingAmount: AbstractControl;
  otherStuckingAmount: AbstractControl;
  companySeriousInjuryAmount: AbstractControl;
  subcontractSeriousInjuryAmount: AbstractControl;
  otherSeriousInjuryAmount: AbstractControl;
  content: AbstractControl;
  isAbroad: AbstractControl;
  isInvest: AbstractControl;
  disposalMeasures: AbstractControl;

  userInfo: any = {};
  createSessions: any = ['抢险救灾组', '应急指挥组', '临时决策组', '事故调查组'];
  accidentTypeList: any = [];
  projectTypeList: any = [];
  projectCopyName: any = [];
  msgInfo = '';
  isGoTo = true;
  disableSubmitBtn = false;

  currAddress: any;
  latitude: 0;
  longitude: 0;

  hintProjectName;
  hintOccurTime;
  hintAccidentType;
  hintContent;
  hintDiedCount;
  hintMissingCount;
  hintStuckCount;
  hintSeriousInjuryCount;

  private validationMessages = {
    'projName': {
      'required': '请填写项目名称.',
    },
    'ocurrTime': {
      'required': '请填写事故发生时间'
    },
    'ocurrPart': {
      'required': '请填写事故发生部位'
    },

    'ocurrLocation': {
      'required': '请填写事故发生地点.',
    },

    'accidentType': {
      'required': '请选择事故类型.',
    },

    'projType': {
      'required': '请选择项目类型.',
    },

    'companyDiedAmount': {
      'required': '此项必填.',
      'isNumber': '请输入整数'
    },
    'subcontractDiedAmount': {
      'required': '此项必填.',
      'isNumber': '请输入整数'
    },
    'otherDiedAmount': {
      'required': '此项必填.',
      'isNumber': '请输入整数'
    },
    'companyMissingAmount': {
      'required': '此项必填.',
      'isNumber': '请输入整数'
    },
    'subcontractMissingAmount': {
      'required': '此项必填.',
      'isNumber': '请输入整数'
    },

    'otherMissingAmount': {
      'required': '此项必填.',
      'isNumber': '请输入整数'
    },
    'companyStuckingAmount': {
      'required': '此项必填.',
      'isNumber': '请输入整数'
    },
    'subcontractStuckingAmount': {
      'required': '此项必填.',
      'isNumber': '请输入整数'
    },
    'otherStuckingAmount': {
      'required': '此项必填.',
      'isNumber': '请输入整数'
    },
    'companySeriousInjuryAmount': {
      'required': '此项必填.',
      'isNumber': '请输入整数'
    },
    'subcontractSeriousInjuryAmount': {
      'required': '此项必填.',
      'isNumber': '请输入整数'
    },
    'otherSeriousInjuryAmount': {
      'required': '此项必填.',
      'isNumber': '请输入整数'
    },
    'content': {
      'required': '请填写事故简要经过.',
      'maxlength': '最多500个字.'
    }
  };
  formErrors = {
    'projName': '',
    'ocurrTime': '',
    'ocurrPart': '',
    'ocurrLocation': '',
    'accidentType': '',
    'projType': '',
    'companyDiedAmount': '',
    'subcontractDiedAmount': '',
    'otherDiedAmount': '',
    'companyMissingAmount': '',
    'subcontractMissingAmount': '',
    'otherMissingAmount': '',
    'companyStuckingAmount': '',
    'subcontractStuckingAmount': '',
    'otherStuckingAmount': '',
    'companySeriousInjuryAmount': '',
    'subcontractSeriousInjuryAmount': '',
    'otherSeriousInjuryAmount': '',
    'content': '',
    'isAbroad': '',
    'isInvest': '',
    'disposalMeasures': ''
  };
  currentTime = '';

  constructor(private router: Router, private fb: FormBuilder,
              private _state: GlobalState,
              private _service: NewLettersService,
              private cdf: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.userInfo = this._state.userInfo;
    if (this.userInfo.typeext === 'D60') {
      this.projectCopyName = this.userInfo.projName;
    } else {
      this.projectCopyName = '';
    }
    this.getAccidentAndProList();

    this.getlatitudeBywx();

    this.initForm();
  }

  getlatitudeBywx() {
    const that = this;
    wx.getLocation({
      type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        that.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        that.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        that.getLocationBywx();
      }, error: function (res) {
        console.log('获取定位失败！', res.errMsg);
      }
    });
  }

  getLocationBywx() {
    const that = this;
    that.currAddress = '正在获取位置信息...';
    const txgeocoder = new qq.maps.Geocoder({
      complete: function (result) {
        that.currAddress = result.detail.address;
        that.cdf.markForCheck();    // 进行标注
        that.cdf.detectChanges();   // 要多加一行这个 执行一次变化检测
      }
    });
    const coord = new qq.maps.LatLng(that.latitude, that.longitude);
    txgeocoder.getAddress(coord);
    txgeocoder.setError(function () {
      console.log('定位失败，请输入正确的经纬度！！！');
      that.currAddress = '';
      alert('定位失败，请手动输入地址或重新进入事故快报新增页面。');
    });
  }

  getAccidentAndProList() {
    this._service.getAccidentAndProList()
      .subscribe(res => {
        if (res.success === true) {
          this.accidentTypeList = res.accidentTypeList;
          this.projectTypeList = res.projTypeList;
          this.cdf.markForCheck();    // 进行标注
          this.cdf.detectChanges();   // 要多加一行这个 执行一次变化检测
        }
      });
  }

  initForm() {
    this.accidentForm = this.fb.group({
      'projName': [this.projectCopyName, Validators.compose([Validators.required])],
      'ocurrTime': ['', Validators.compose([Validators.required])],
      'ocurrPart': ['', Validators.compose([Validators.required])],
      'ocurrLocation': [this.currAddress, Validators.compose([Validators.required])],
      'accidentType': ['', Validators.compose([Validators.required])],
      'projType': ['', Validators.compose([Validators.required])],
      'companyDiedAmount': [0, Validators.compose([Validators.required, NumberValidator()])],
      'subcontractDiedAmount': [0, Validators.compose([Validators.required, NumberValidator()])],
      'otherDiedAmount': [0, Validators.compose([Validators.required, NumberValidator()])],
      'companyMissingAmount': [0, Validators.compose([Validators.required, NumberValidator()])],
      'subcontractMissingAmount': [0, Validators.compose([Validators.required, NumberValidator()])],
      'otherMissingAmount': [0, Validators.compose([Validators.required, NumberValidator()])],
      'companyStuckingAmount': [0, Validators.compose([Validators.required, NumberValidator()])],
      'subcontractStuckingAmount': [0, Validators.compose([Validators.required, NumberValidator()])],
      'otherStuckingAmount': [0, Validators.compose([Validators.required, NumberValidator()])],
      'companySeriousInjuryAmount': [0, Validators.compose([Validators.required, NumberValidator()])],
      'subcontractSeriousInjuryAmount': [0, Validators.compose([Validators.required, NumberValidator()])],
      'otherSeriousInjuryAmount': [0, Validators.compose([Validators.required, NumberValidator()])],
      'content': ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
      'isAbroad': ['00', Validators.compose([Validators.required])],
      'isInvest': ['00', Validators.compose([Validators.required])],
      'disposalMeasures': ['', Validators.compose([])]
    });

    this.projectName = this.accidentForm.controls['projName'];
    this.occurTime = this.accidentForm.controls['ocurrTime'];
    this.ocurrPart = this.accidentForm.controls['ocurrPart'];
    this.occurLocation = this.accidentForm.controls['ocurrLocation'];
    this.accidentType = this.accidentForm.controls['accidentType'];
    this.projType = this.accidentForm.controls['projType'];
    this.companyDiedAmount = this.accidentForm.controls['companyDiedAmount'];
    this.subcontractDiedAmount = this.accidentForm.controls['subcontractDiedAmount'];
    this.otherDiedAmount = this.accidentForm.controls['otherDiedAmount'];
    this.companyMissingAmount = this.accidentForm.controls['companyMissingAmount'];
    this.subcontractMissingAmount = this.accidentForm.controls['subcontractMissingAmount'];
    this.otherMissingAmount = this.accidentForm.controls['otherMissingAmount'];
    this.companyStuckingAmount = this.accidentForm.controls['companyStuckingAmount'];
    this.subcontractStuckingAmount = this.accidentForm.controls['subcontractStuckingAmount'];
    this.otherStuckingAmount = this.accidentForm.controls['otherStuckingAmount'];
    this.companySeriousInjuryAmount = this.accidentForm.controls['companySeriousInjuryAmount'];
    this.subcontractSeriousInjuryAmount = this.accidentForm.controls['subcontractSeriousInjuryAmount'];
    this.otherSeriousInjuryAmount = this.accidentForm.controls['otherSeriousInjuryAmount'];
    this.content = this.accidentForm.controls['content'];
    this.isAbroad = this.accidentForm.controls['isAbroad'];
    this.isInvest = this.accidentForm.controls['isInvest'];
    this.disposalMeasures = this.accidentForm.controls['disposalMeasures'];

    this.accidentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.accidentForm) {
      return;
    }
    const form = this.accidentForm;
    for (const field in this.formErrors) {

      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  createSession() {
    for (const list in this.createSessions) {
      wx.openEnterpriseChat({
        userIds: 'sunyinglong;L10001200;L10000097',    // 必填，参与会话的成员列表。格式为userid1;userid2;...，用分号隔开，最大限制为2000个。userid单个时为单聊，多个时为群聊。
        groupName: '20180718' + list,  // 必填，会话名称。单聊时该参数传入空字符串""即可。
        success: function (res) {
          console.log("session:::", res);
          alert(list + '创建成功');
        },
        fail: function (res) {
          if (res.errMsg.indexOf('function not exist') > -1) {
            alert('版本过低请升级')
          }
        }
      });
    }
  }

  onSubmit() {
    this.getCurrentTime();
    $('#submitHintDialog').fadeOut(200);

    this.disableSubmitBtn = true;
    const occurTime = this.accidentForm.value.ocurrTime;
    const lettersParams = Object.assign(this.accidentForm.value,
      {
        userid: this.userInfo.userId, username: this.userInfo.username, projOid: this.userInfo.oid, phone: '',
        ocurrTime: occurTime.split('T').join(' '),
        projName: this.accidentForm.value.projName,
        longitude: this.longitude || 0,
        latitude: this.latitude || 0
      });
    if (parseInt(this.accidentForm.value.companyDiedAmount) + parseInt(this.accidentForm.value.subcontractDiedAmount) +
      parseInt(this.accidentForm.value.otherDiedAmount) + parseInt(this.accidentForm.value.companyMissingAmount) +
      parseInt(this.accidentForm.value.subcontractMissingAmount) + parseInt(this.accidentForm.value.otherMissingAmount)
      + parseInt(this.accidentForm.value.companyStuckingAmount) + parseInt(this.accidentForm.value.subcontractStuckingAmount) +
      parseInt(this.accidentForm.value.otherStuckingAmount) + parseInt(this.accidentForm.value.companySeriousInjuryAmount) +
      parseInt(this.accidentForm.value.subcontractSeriousInjuryAmount) + parseInt(this.accidentForm.value.otherSeriousInjuryAmount) === 0) {
      // $('#peopleCountDialog').fadeIn(200);
      alert('未填写人员伤亡情况, 不能进行上报');

    } else if (this.currentTime < occurTime) {
      //$('#peopleCountDialog').fadeIn(200);
      alert('事故发生时间不能大于当前时间！');
    } else {
      $('#androidDialog2').fadeIn(200);
      console.log('this.currentTime < occurTime false###', this.currentTime < occurTime);
      this._service.newAccidentLetters(lettersParams)
        .subscribe(res => {
          if (res.success === true) {
            this.isGoTo = true;
            this.disableSubmitBtn = false;
            this.msgInfo = '事故上报成功';
            this.cdf.markForCheck();    // 进行标注
            this.cdf.detectChanges();   // 要多加一行这个 执行一次变化检测
          } else {
            this.isGoTo = false;
            this.disableSubmitBtn = false;
            this.msgInfo = '服务器异常，事故上报失败';
            this.cdf.markForCheck();    // 进行标注
            this.cdf.detectChanges();   // 要多加一行这个 执行一次变化检测
          }
        });
    }
  }

  submitForm() {
    this.hintProjectName = this.accidentForm.value.projName;
    this.hintOccurTime = this.formatTime(this.accidentForm.value.ocurrTime);
    this.hintContent = this.accidentForm.value.content;
    this.accidentTypeList.forEach(e => {
      if (e.code === this.accidentForm.value.accidentType) {
        this.hintAccidentType = e.name;
        return;
      }
    });
    this.hintDiedCount = (this.accidentForm.value.companyDiedAmount - 0) + (this.accidentForm.value.subcontractDiedAmount - 0) +
      (this.accidentForm.value.otherDiedAmount - 0);
    this.hintMissingCount = (this.accidentForm.value.companyMissingAmount - 0) +
      (this.accidentForm.value.subcontractMissingAmount - 0) + (this.accidentForm.value.otherMissingAmount - 0);
    this.hintStuckCount = (this.accidentForm.value.companyStuckingAmount - 0) + (this.accidentForm.value.subcontractStuckingAmount - 0) +
      (this.accidentForm.value.otherStuckingAmount - 0);
    this.hintSeriousInjuryCount = (this.accidentForm.value.companySeriousInjuryAmount - 0) +
      (this.accidentForm.value.subcontractSeriousInjuryAmount - 0) + (this.accidentForm.value.otherSeriousInjuryAmount - 0);
    $('#submitHintDialog').fadeIn(200);
  }

  getCurrentTime() {
    let dates = new Date().toLocaleDateString().split('/');
    dates = dates.map(ele => {
      if (ele.length < 2) {
        ele = '0' + ele;
      }
      return ele;
    });
    this.currentTime = dates.join('-') + 'T' + new Date().toLocaleTimeString('chinese', {hour12: false});
  }

  formatTime(data) {
    if (data) {
      let date = data.split('T');
      return `${date[0].split('-')[0]}年${date[0].split('-')[1]}月${date[0].split('-')[2]}日` +
        `${date[1].split(':')[0]}时${date[1].split(':')[1]}分`;
    }
  }

  goToStat() {
    if (this.isGoTo) {
      this.router.navigate(['/stat']);
    } else {
      this.router.navigate(['/new']);
    }
  }

  goToNew() {
    $('.js_dialog').fadeOut(200);
  }
}
