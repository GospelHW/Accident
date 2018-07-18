import {Injectable} from '@angular/core';
import {GlobalState} from '../../global.state';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class NewLettersService {
  accidentAndProListUrl = 'aqhb/accident_mobile/getTypes.do';
  newAccidentLettersUrl = 'aqhb/accident_mobile/accidentExpressNew.do';

  constructor(private _state: GlobalState, private http: HttpClient) {
    this.accidentAndProListUrl = this._state.aLBaseUrl + this.accidentAndProListUrl;
    this.newAccidentLettersUrl = this._state.aLBaseUrl + this.newAccidentLettersUrl;
  }

  getAccidentAndProList(): Observable<any> {
    return this.http.get(this.accidentAndProListUrl, {withCredentials: true});
  }

  newAccidentLetters(params): Observable<any> {
    // const newAccidentLettersUrl = `${this.newAccidentLettersUrl}?userid=${params.userid}` +
    //   `&projOid=${params.projOid}&username=${params.username}&projName=${params.projName}` +
    //   `&ocurrTime=${params.ocurrTime}&ocurrPart=${params.ocurrPart}&ocurrLocation=${params.ocurrLocation}&accidentType=${params.accidentType}` +
    //   `&companyDiedAmount=${params.companyDiedAmount}&subcontractDiedAmount=${params.subcontractDiedAmount}` +
    //   `&otherDiedAmount=${params.otherDiedAmount}&companyMissingAmount=${params.companyMissingAmount}` +
    //   `&subcontractMissingAmount=${params.subcontractMissingAmount}&otherMissingAmount=${params.otherMissingAmount}` +
    //   `&companyStuckingAmount=${params.companyStuckingAmount}&subcontractStuckingAmount=${params.subcontractStuckingAmount}` +
    //   `&companySeriousInjuryAmount=${params.companySeriousInjuryAmount}&subcontractSeriousInjuryAmount=${params.subcontractSeriousInjuryAmount}` +
    //   `&otherSeriousInjuryAmount=${params.otherSeriousInjuryAmount}&latitude=${params.latitude || 0}&longitude=${params.longitude || 0}` +
    //   `&otherStuckingAmount=${params.otherStuckingAmount}&content=${params.content}&projType=${params.projType}` +
    //   `&isAbroad=${params.isAbroad}&isInvest=${params.isInvest}&disposalMeasures=`;
    console.log(JSON.stringify(params));
    return this.http.post(this.newAccidentLettersUrl, JSON.stringify(params), {
      headers: new HttpHeaders({'Content-type': 'application/json;charset=UTF-8'}),
      withCredentials: true
    });
  }

  takePhotos(): Observable<any> {
    return this.http.post('http://58.23.36.194:8087/accident/accidentgetSDK.action',
      {'url': window.location.href, 'fromW': 'accident'});
  }
}
