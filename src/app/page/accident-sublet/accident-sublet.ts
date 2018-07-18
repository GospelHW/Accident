import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccidentSubletService} from './accident-sublet.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalState} from '../../global.state';
import $ from 'jquery';
import wx from 'weixin-js-sdk';
import {moneyValidator, NumberValidator} from '../numer.directive';


@Component({
  selector: 'app-new-letters',
  templateUrl: './accident-sublet.html',
  styleUrls: ['./accident-sublet.scss'],
  providers: [AccidentSubletService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageAccidentSubletComponent implements OnInit {
  accidentSubletForm: FormGroup;
  latestProgress: AbstractControl;
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
  directEconomyDamage: AbstractControl;

  userInfo: any = {};
  accidentInfo;
  msgInfo = '';
  isGoTo = true;
  disableSubmitBtn = false;
  injuresState;
  private validationMessages = {
    'latestProgress': {
      'required': '请填写事故最新进展.',
    },
    'companyDiedAmount': {
      'isNumber': '请输入整数'
    },
    'subcontractDiedAmount': {
      'isNumber': '请输入整数'
    },
    'otherDiedAmount': {
      'isNumber': '请输入整数'
    },
    'companyMissingAmount': {
      'isNumber': '请输入整数'
    },
    'subcontractMissingAmount': {
      'isNumber': '请输入整数'
    },

    'otherMissingAmount': {
      'isNumber': '请输入整数'
    },
    'companyStuckingAmount': {
      'isNumber': '请输入整数'
    },
    'subcontractStuckingAmount': {
      'isNumber': '请输入整数'
    },
    'otherStuckingAmount': {
      'isNumber': '请输入整数'
    },
    'companySeriousInjuryAmount': {
      'isNumber': '请输入整数'
    },
    'subcontractSeriousInjuryAmount': {
      'isNumber': '请输入整数'
    },
    'otherSeriousInjuryAmount': {
      'isNumber': '请输入整数'
    },
    'directEconomyDamage': {
      'isNumber': '金额为正整数且最多2位小数'
    }
  };
  formErrors = {
    'latestProgress': '',
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
    'directEconomyDamage': ''
  };
  selectPhotos = [];
  serverIds = [];
  localIds = [];
  iosLocalIds = [];
  isShowPicture = false;
  @ViewChild('thumbnail') thumbnail: ElementRef;
  @ViewChild('addImg') addImg: ElementRef;
  isIos = false;

  constructor(private router: Router, private _service: AccidentSubletService, private fb: FormBuilder,
              private _state: GlobalState, private activatedRoute: ActivatedRoute, private cdf: ChangeDetectorRef,
              private render2: Renderer2) {
    this.activatedRoute.params.subscribe(params => {
      this.accidentInfo = {id: params['accidentId'], name: params['accidentName']};
      this.injuresState = {
        companyDiedAmount: params.companyDiedAmount,
        subcontractDiedAmount: params.subcontractDiedAmount,
        otherDiedAmount: params.otherDiedAmount,
        companyMissingAmount: params.companyMissingAmount,
        subcontractMissingAmount: params.subcontractMissingAmount,
        otherMissingAmount: params.otherMissingAmount,
        companyStuckingAmount: params.companyStuckingAmount,
        subcontractStuckingAmount: params.subcontractStuckingAmount,
        otherStuckingAmount: params.otherStuckingAmount,
        companySeriousInjuryAmount: params.companySeriousInjuryAmount,
        subcontractSeriousInjuryAmount: params.subcontractSeriousInjuryAmount,
        otherSeriousInjuryAmount: params.otherSeriousInjuryAmount
      };
    });
    this.isIos = this._state.isIos;
  }

  ngOnInit() {
    this.userInfo = this._state.userInfo;
    this.initForm();
  }

  getPhotoPath(serverId, that) {
    that._service.getPhotoPath(serverId)
      .subscribe(res => {
        if (res.success === true) {
          that.selectPhotos.push(res.filepath);
          that.isShowPicture = false;
          that.cdf.markForCheck();    // 进行标注
          that.cdf.detectChanges();   // 要多加一行这个 执行一次变化检测
        } else {
        }
      });
  }

  takePhotos() {
    const that = this;
    this.isShowPicture = true;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        that.localIds = that.localIds.concat(localIds);
        // that.localIds = that.localIds.map(ele => ele.split('://')[1]);
        that.cdf.markForCheck();    // 进行标注
        that.cdf.detectChanges();   // 要多加一行这个 执行一次变化检测
        that.render2.destroy();
        localIds.forEach(id => {
          const img = that.render2.createElement('img');
          that.render2.setAttribute(img, 'src', id);
          that.render2.setAttribute(img, 'height', '75');
          that.render2.setAttribute(img, 'width', '75');
          that.render2.addClass(img, 'thumbnail-sublet');
          that.render2.listen(img, 'click', (event) => {
            that.previewPhoto(id, that.localIds);
          });
          that.render2.insertBefore(that.thumbnail.nativeElement, img, that.addImg.nativeElement);

          // wx.getLocalImgData({
          //   localId: id, // 图片的localID
          //   success: function (data) {
          //     that.localIds.push(data.localData); // localData是图片的base64数据，可以用img标签显示
          //     that.cdf.markForCheck();    // 进行标注
          //     that.cdf.detectChanges();   // 要多加一行这个 执行一次变化检测
          //   }
          // });
          wx.uploadImage({
            localId: id, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: function (data) {
              const serverId = data.serverId; // 返回图片的服务器端ID
              that.serverIds.push(serverId);
              // that.getPhotoPath(serverId, that);
            }, error: function (err) {
              console.log('上传图片失败！' + err.errMsg);
            }
          });
        });
      },
      cancel: function () {
        that.isShowPicture = false;
        that.cdf.markForCheck();    // 进行标注
        that.cdf.detectChanges();   // 要多加一行这个 执行一次变化检测
      },
      error: function (res) {
        alert(res.errMsg);
        console.log('选择图片失败！' + res.errMsg);
      }
    });
  }

  initForm() {
    this.accidentSubletForm = this.fb.group({
      'latestProgress': ['', Validators.compose([Validators.required])],
      'companyDiedAmount': [this.injuresState.companyDiedAmount, Validators.compose([NumberValidator()])],
      'subcontractDiedAmount': [this.injuresState.subcontractDiedAmount, Validators.compose([NumberValidator()])],
      'otherDiedAmount': [this.injuresState.otherDiedAmount, Validators.compose([NumberValidator()])],
      'companyMissingAmount': [this.injuresState.companyMissingAmount, Validators.compose([NumberValidator()])],
      'subcontractMissingAmount': [this.injuresState.subcontractMissingAmount, Validators.compose([NumberValidator()])],
      'otherMissingAmount': [this.injuresState.otherMissingAmount, Validators.compose([NumberValidator()])],
      'companyStuckingAmount': [this.injuresState.companyStuckingAmount, Validators.compose([NumberValidator()])],
      'subcontractStuckingAmount': [this.injuresState.subcontractStuckingAmount, Validators.compose([NumberValidator()])],
      'otherStuckingAmount': [this.injuresState.otherStuckingAmount, Validators.compose([NumberValidator()])],
      'companySeriousInjuryAmount': [this.injuresState.companySeriousInjuryAmount,
        Validators.compose([NumberValidator()])],
      'subcontractSeriousInjuryAmount': [this.injuresState.subcontractSeriousInjuryAmount,
        Validators.compose([NumberValidator()])],
      'otherSeriousInjuryAmount': [this.injuresState.otherSeriousInjuryAmount, Validators.compose([NumberValidator()])],
      'directEconomyDamage': [0, Validators.compose([moneyValidator()])]
    });
    this.latestProgress = this.accidentSubletForm.controls['latestProgress'];
    this.companyDiedAmount = this.accidentSubletForm.controls['companyDiedAmount'];
    this.subcontractDiedAmount = this.accidentSubletForm.controls['subcontractDiedAmount'];
    this.otherDiedAmount = this.accidentSubletForm.controls['otherDiedAmount'];
    this.companyMissingAmount = this.accidentSubletForm.controls['companyMissingAmount'];
    this.subcontractMissingAmount = this.accidentSubletForm.controls['subcontractMissingAmount'];
    this.otherMissingAmount = this.accidentSubletForm.controls['otherMissingAmount'];
    this.companyStuckingAmount = this.accidentSubletForm.controls['companyStuckingAmount'];
    this.subcontractStuckingAmount = this.accidentSubletForm.controls['subcontractStuckingAmount'];
    this.otherStuckingAmount = this.accidentSubletForm.controls['otherStuckingAmount'];
    this.companySeriousInjuryAmount = this.accidentSubletForm.controls['companySeriousInjuryAmount'];
    this.subcontractSeriousInjuryAmount = this.accidentSubletForm.controls['subcontractSeriousInjuryAmount'];
    this.otherSeriousInjuryAmount = this.accidentSubletForm.controls['otherSeriousInjuryAmount'];
    this.directEconomyDamage = this.accidentSubletForm.controls['directEconomyDamage'];
    this.accidentSubletForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.accidentSubletForm) {
      return;
    }
    const form = this.accidentSubletForm;
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

  previewPhoto(id, data) {
    if (!this.isIos) {
      wx.previewImage({
        current: id, // 当前显示图片的http链接
        urls: data // 需要预览的图片http链接列表
      });
    } else {
      const iosId = 'unsafe:' + id;
      const iosData = data.map(e => 'unsafe:' + e);
      wx.previewImage({
        current: iosId, // 当前显示图片的http链接
        urls: iosData // 需要预览的图片http链接列表
      });
    }
  }

  onSubmit() {
    this.disableSubmitBtn = true;
    $('#androidDialog2').fadeIn(200);
    const subletParams = Object.assign(this.accidentSubletForm.value,
      {
        userid: this.userInfo.userId, username: this.userInfo.username,
        accidentId: this.accidentInfo['id'], accidentName: this.accidentInfo['name'],
        photos: this.serverIds.join(',')
      });
    let keys = Object.keys(subletParams);
    keys.forEach(e => {
      if (subletParams[e] === null || subletParams[e] === undefined || subletParams[e] === '') {
        if (e !== 'photos') {
          subletParams[e] = '0';
        }
      }
    });
    console.log(subletParams);
    this._service.subletAccident(subletParams)
      .subscribe(res => {
        if (res.success === true) {
          this.msgInfo = '事故续报成功';
          this.isGoTo = true;
          this.disableSubmitBtn = false;
          this.cdf.markForCheck();    // 进行标注
          this.cdf.detectChanges();   // 要多加一行这个 执行一次变化检测
        } else {
          this.isGoTo = false;
          this.disableSubmitBtn = false;
          this.msgInfo = '服务器异常，事故续报失败';
          this.cdf.markForCheck();    // 进行标注
          this.cdf.detectChanges();   // 要多加一行这个 执行一次变化检测
        }
      });
  }

  goToStat() {
    if (this.isGoTo) {
      this.router.navigate(['/stat']);
    } else {
      $('.js_dialog').fadeOut(200);
    }
  }

  goToDetail() {
    this.router.navigate(['/detail']);
  }
}
