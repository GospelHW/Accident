import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import echarts from 'echarts';
import {StatService} from './stat.service';
import {GlobalState} from '../../global.state';
import {BsLocaleService} from 'ngx-bootstrap';
import {defineLocale} from 'ngx-bootstrap';
import {zhCnLocale} from 'ngx-bootstrap/locale';
import $ from 'jquery';
import wx from 'weixin-js-sdk';

defineLocale(zhCnLocale.abbr, zhCnLocale);

@Component({
  selector: 'app-stat',
  templateUrl: './stat.html',
  styleUrls: ['./stat.scss'],
  providers: [StatService]
})
export class PageStatComponent implements OnInit {
  isAccidentList = true;
  @ViewChild('statPie') statPie: ElementRef;
  @ViewChild('statBar') statBar: ElementRef;
  private userId: string;
  accidentList: any = [];
  isManager: boolean;
  isHasStat: boolean;
  accidentStatInfo;
  statUserId;
  isLoading = true;

  initY = 0;
  @ViewChild('dragRefresh') dragRefresh: ElementRef;
  @ViewChild('refresh') refresh: ElementRef;
  @ViewChild('drag') drag: ElementRef;

  selectedTime = 'season';
  locale;
  bsConfig;
  startTime;
  endTime;
  isShowDate = false;
  isGT = false;
  dragHeight;
  createSessions: any = [
    {name: '抢险救灾组', people: ['sunyinglong', 'L10001200', 'L10000099', 'L10000097']},
    {name: '应急指挥组', people: ['sunyinglong', 'L10001201', 'L10000098', 'L10000094']},
    {name: '临时决策组', people: ['sunyinglong', 'L10001202', 'L10000096', 'L10000093']},
    {name: '事故调查组', people: ['sunyinglong', 'L10001203', 'L10000095', 'L10000092']},
  ];

  constructor(private router: Router, private _service: StatService, private _state: GlobalState,
              private render2: Renderer2, private localeService: BsLocaleService) {
    this.userId = this._state.laborUserId;
    // this.userId = '2010149942';

    this.locale = 'zh-cn';
    this.bsConfig = Object.assign({}, {locale: this.locale});
    this.localeService.use(this.locale);
  }

  ngOnInit() {
    this.getUserInfo();
  }

  onMove(e) {
    this.render2.setStyle(this.dragRefresh.nativeElement, 'display', 'block');
    this.dragHeight = e.touches[0].pageY - this.initY;
    this.render2.setStyle(this.dragRefresh.nativeElement, 'height', (this.dragHeight) + 'px');
    if (this.dragHeight >= 120) {

      // 注意：因为height得到的值是px为单位，所以用parseInt解析
      this.render2.setStyle(this.dragRefresh.nativeElement, 'height', '120px');

      if (this.dragHeight > 100) {
        this.render2.setStyle(this.dragRefresh.nativeElement, 'lineHeight', this.dragHeight);
        // this.drag_to_refresh.innerHTML = '松开刷新';
        this.render2.setStyle(this.dragRefresh.nativeElement, 'innerHTML', '松开刷新');
      }
    }
  }

  onStart(e) {
    this.initY = e.touches[0].pageY;
  }

  onEnd() {
    if (this.dragHeight > 120) {
      this.render2.setStyle(this.refresh.nativeElement, 'display', 'block');
      setTimeout(() => {
        this.render2.setStyle(this.refresh.nativeElement, 'display', 'none');
        this.getAccidentList(this.statUserId, this.selectedTime);
      }, 1000);
    }
    this.initY = this.dragHeight = 0;
    this.render2.setStyle(this.dragRefresh.nativeElement, 'display', 'none');
  }

  createSession() {
    // for(const list in this.createSessions) {
    //   wx.openEnterpriseChat({
    //     userIds: 'sunyinglong;L10001200;L10000099;L10000097',    // 必填，参与会话的成员列表。格式为userid1;userid2;...，用分号隔开，最大限制为2000个。userid单个时为单聊，多个时为群聊。
    //     groupName: '20180718' + list,  // 必填，会话名称。单聊时该参数传入空字符串""即可。
    //     success: function (res) {
    //       console.log("session:::", res);
    //       alert(list + '创建成功');
    //     },
    //     fail: function (res) {
    //       if (res.errMsg.indexOf('function not exist') > -1) {
    //         alert('版本过低请升级')
    //       }
    //     }
    //   });
    // }
    this.createSessions.forEach(ele => {
      wx.openEnterpriseChat({
        userIds: ele.people.join(":"),    // 必填，参与会话的成员列表。格式为userid1;userid2;...，用分号隔开，最大限制为2000个。userid单个时为单聊，多个时为群聊。
        groupName: '20180718' + ele.name,  // 必填，会话名称。单聊时该参数传入空字符串""即可。
        success: function (res) {
          console.log("session:::", res);
          alert(ele + '创建成功');
        },
        fail: function (res) {
          if (res.errMsg.indexOf('function not exist') > -1) {
            alert('版本过低请升级')
          }
        }
      });
    })

  }

  getUserInfo() {
    this._service.getUserInfo(this.userId)
      .subscribe(res => {
        if (res.success === true) {
          this.isManager = res.role_type === 2;
          this.isGT = res.role_type === 1;
          this.isHasStat = res.typeext === 'D60';
          this._state.userInfo = {
            userId: res.userid, username: res.user_name, oid: res.oid, projName: res.proj_name,
            grule: res.grule, roleType: res.role_type, typeext: res.typeext
          };
          console.log('stat', this._state.userInfo);
          this.statUserId = res.userid;
          this.getAccidentList(res.userid, this.selectedTime);
        }
      });
  }

  getAccidentList(userId, selectedTime, startTime?, endTime?) {
    this._service.getAccidentList(userId, selectedTime, startTime, endTime)
      .subscribe(res => {
        this.isLoading = false;
        if (res.success === true) {
          this.accidentList = res.accidentList;
        }
        $('.js_dialog').fadeOut(200);
      });
  }

  getAccidentStatInfo(userId, selectedTime) {
    this._service.getAccidentStatInfo(userId, selectedTime)
      .subscribe(res => {
        if (res.success === true) {
          this.accidentStatInfo = res;
          this.initChart(this.accidentStatInfo);
        }
      });
  }

  initChart(accidentStatInfo) {
    let xBarLabel, accidentCount, diedCount, maxAaccidentCount = 0, maxDiedCount = 0;
    if (accidentStatInfo.secondUnitsStatisticsList) {
      xBarLabel = accidentStatInfo.secondUnitsStatisticsList
        .map(data => data.second_unit_name);
      accidentCount = accidentStatInfo.secondUnitsStatisticsList
        .map(data => {
          const temp = data.general_accident_num + data.serious_accident_num + data.greater_accident_num + data.important_accident_num;
          if (temp > maxAaccidentCount) {
            maxAaccidentCount = temp;
          }
          return temp;
        });
      diedCount = accidentStatInfo.secondUnitsStatisticsList
        .map(data => {
          if (data.company_died_amount + data.subcontract_died_amount + data.other_died_amount > maxDiedCount) {
            maxDiedCount = data.company_died_amount + data.subcontract_died_amount + data.other_died_amount;
          }
          return data.company_died_amount + data.subcontract_died_amount + data.other_died_amount;
        });
    }
    const pieChart = echarts.init(this.statPie.nativeElement);
    // 指定图表的配置项和数据
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}'
      },
      color: ['#4b69de', '#fcb228', '#ee5ee1', '#ff7567'],
      legend: {
        orient: 'vertical',
        x: '75%',
        y: '25%',
        data: [
          {name: '一般事故', icon: 'circle'},
          {
            name: '较大事故',
            icon: 'circle'
          },
          {name: '重大事故', icon: 'circle'},
          {name: '特大事故', icon: 'circle'}],
        textStyle: {
          color: '#666',
          fontSize: '12'
        }
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['30%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'inside',
              formatter: '{d}%'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '15',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            {value: accidentStatInfo.allStatisticsList[0].general_accident_num, name: '一般事故'},
            {value: accidentStatInfo.allStatisticsList[0].greater_accident_num, name: '较大事故'},
            {value: accidentStatInfo.allStatisticsList[0].important_accident_num, name: '重大事故'},
            {value: accidentStatInfo.allStatisticsList[0].serious_accident_num, name: '特大事故'}
          ]
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    pieChart.setOption(option);

    const barChart = echarts.init(this.statBar.nativeElement);

    const barOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      grid: {
        top: '30%'

      },
      legend: {
        data: [
          {name: '发生事故数'},
          {name: '死亡人数'}],
        textStyle: {
          color: '#666',
          fontSize: '13'
        },
        left: '4%'
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            show: false
          },
          axisLabel: {
            interval: 0,
            rotate: 40,
            fontSize: 12
          },
          data: xBarLabel,
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '事故数',
          min: 0,
          max: maxAaccidentCount + 10,
          interval: Math.ceil(maxAaccidentCount + 10),
          nameTextStyle: {
            color: '#333',
            fontSize: '14',
            fontWeight: '600'
          }
        },
        {
          type: 'value',
          name: '死亡人数',
          min: 0,
          max: maxDiedCount + 10,
          interval: Math.ceil((maxDiedCount + 10) / 5),
          nameTextStyle: {
            color: '#333',
            fontSize: '14',
            fontWeight: '600'
          }
        }
      ],
      series: [
        {
          name: '发生事故数',
          type: 'bar',
          data: accidentCount,
          color: ['#5db3ff']
        },
        {
          name: '死亡人数',
          type: 'line',
          yAxisIndex: 1,
          data: diedCount,
          color: ['#fc6f4f']
        }
      ]
    };

    barChart.setOption(barOption);
  }

  selectAccidentList() {
    this.isAccidentList = true;
  }

  selectStat() {
    this.isAccidentList = false;
    this.getAccidentStatInfo(this.statUserId, this.selectedTime);
  }

  // handleSelect() {
  //   console.log(this.selectedTime);
  //   this.getAccidentList(this.statUserId, this.selectedTime);
  //   this.getAccidentStatInfo(this.statUserId, this.selectedTime);
  // }

  newAccident() {
    this.router.navigate(['/new']);
  }

  sublet() {
    this.router.navigate(['/sublet']);
  }

  detail(data) {
    this._state.accidentId = data.accident_id;
    this.router.navigate(['/detail', {accident_id: data.accident_id}]);
    return false;
  }

  selectTime(data, datepicker) {
    if (data === 'date') {
      this.selectedTime = data;
      this.isShowDate = true;
      datepicker.isOpen = true;
    } else {
      this.isShowDate = false;
      if (data !== this.selectedTime) {
        this.selectedTime = data;
        $('#hintDialog').fadeIn(200);
        this.getAccidentList(this.statUserId, this.selectedTime);
        if (!this.isManager && !this.isAccidentList) {
          this.getAccidentStatInfo(this.statUserId, this.selectedTime);
        }
      }
    }
  }

  onValueChange(event) {
    this.startTime = this.formatDate(event[0]);
    this.endTime = this.formatDate(event[1]);
    $('#hintDialog').fadeIn(200);
    this.getAccidentList(this.statUserId, this.selectedTime, this.startTime, this.endTime);
  }

  formatDate(date) {
    let dates = new Date(date).toLocaleString().split(' ')[0].split('/');
    dates = dates.map(e => {
      if (e.length < 2) {
        e = `0${e}`;
      }
      return e;
    });
    return dates.join('-');
  }
}
