import {Injectable} from '@angular/core';
import {GlobalState} from '../../global.state';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AccidentDetailService {
  detailUrl = 'aqhb/accident_mobile/accidentDetail.do';
  userInfoUrl = 'aqhb/accident_mobile/aqhbLogin.do';

  constructor(private _state: GlobalState, private http: HttpClient) {
    this.detailUrl = this._state.aLBaseUrl + this.detailUrl;
    this.userInfoUrl = this._state.aLBaseUrl + this.userInfoUrl;
  }

  reviewDetail(accidentId, userId): Observable<any> {
    const detailUrl = `${this.detailUrl}?userid=${userId}&accident_id=${accidentId}`;
    return this.http.get(detailUrl, {withCredentials: true});
  }

  getUserInfo(userid): Observable<any>  {
    const userInfoUrl = `${this.userInfoUrl}?userid=${userid}`;
    return this.http.get(userInfoUrl, {withCredentials: true});
  }
}
