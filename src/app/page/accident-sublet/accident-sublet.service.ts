import {Injectable} from '@angular/core';
import {GlobalState} from '../../global.state';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AccidentSubletService {
  subletUrl = 'aqhb/accident_mobile/accidentRenewalNew.do';
  photoUrl = 'aqhb/accident_mobile/getPhotoPaths.do';

  constructor(private _state: GlobalState, private http: HttpClient) {
    this.subletUrl = this._state.aLBaseUrl + this.subletUrl;
    this.photoUrl = this._state.aLBaseUrl + this.photoUrl;
  }

  subletAccident(params): Observable<any> {
    // const subletUrl = `${this.subletUrl}?userid=${params.userid}` +
    //   `&accidentId=${params.accidentId}&username=${params.username}&accidentName=${params.accidentName}` +
    //   `&latestProgress=${params.latestProgress}&directEconomyDamage=${params.directEconomyDamage || 0}` +
    //   `&companyDiedAmount=${params.companyDiedAmount || 0}&subcontractDiedAmount=${params.subcontractDiedAmount || 0}` +
    //   `&otherDiedAmount=${params.otherDiedAmount || 0}&companyMissingAmount=${params.companyMissingAmount || 0}` +
    //   `&subcontractMissingAmount=${params.subcontractMissingAmount || 0}&otherMissingAmount=${params.otherMissingAmount || 0}` +
    //   `&companyStuckingAmount=${params.companyStuckingAmount || 0}&subcontractStuckingAmount=${params.subcontractStuckingAmount || 0}` +
    //   `&companySeriousInjuryAmount=${params.companySeriousInjuryAmount || 0}&subcontractSeriousInjuryAmount=${params.subcontractSeriousInjuryAmount || 0}` +
    //   `&otherSeriousInjuryAmount=${params.otherSeriousInjuryAmount || 0}&otherStuckingAmount=${params.otherStuckingAmount || 0}` +
    //   `&photos=${params.photos.join(',')}&videos=&tape&contacts=`;
    return this.http.post(this.subletUrl, JSON.stringify(params),
      {headers: new HttpHeaders({'Content-type': 'application/json;charset=UTF-8'}), withCredentials: true});
  }

  getPhotoPath(serverId): Observable<any> {
    const photoUrl = `${this.photoUrl}?serverid=${serverId}`;
    return this.http.get(photoUrl, {withCredentials: true});
  }
}
