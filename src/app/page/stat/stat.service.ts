import {Injectable} from '@angular/core';
import {GlobalState} from '../../global.state';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class StatService {
  userInfoUrl = 'aqhb/accident_mobile/aqhbLogin.do';
  accidentListUrl = 'aqhb/accident_mobile/accidentExpressList.do';
  accidentStatUrl = 'aqhb/accident_mobile/accidentStatistics.do';

  constructor(private _state: GlobalState, private http: HttpClient) {
    this.userInfoUrl = this._state.aLBaseUrl + this.userInfoUrl;
    this.accidentListUrl = this._state.aLBaseUrl + this.accidentListUrl;
    this.accidentStatUrl = this._state.aLBaseUrl + this.accidentStatUrl;
  }

  getUserInfo(userid): Observable<any> {
    const userInfoUrl = `${this.userInfoUrl}?userid=${userid}`;
    return this.http.get(userInfoUrl, {withCredentials: true});
  }

  getAccidentList(userid, selectedTime, startTime?, endTime?): Observable<any> {
    const accidentListUrl = `${this.accidentListUrl}?userid=${userid}&selectedTime=${selectedTime}`
      + `&startTime=${startTime || ''}&endTime=${endTime || ''}`;
    return this.http.get(accidentListUrl, {withCredentials: true});
  }

  getAccidentStatInfo(userid, selectedTime): Observable<any> {
    const accidentStatUrl = `${this.accidentStatUrl}?userid=${userid}`;
    return this.http.get(accidentStatUrl, {withCredentials: true});
  }

}
