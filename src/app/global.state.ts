import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class GlobalState {
  private _data = new Subject<Object>();
  private _dataStream$ = this._data.asObservable();

  private _subscriptions: Map<string, Array<Function>> = new Map<string, Array<Function>>();

  // public aLBaseUrl = 'http://58.23.36.194:8087/';
  public aLBaseUrl = 'http://220.160.104.225:8099/safe/';
  // public aLBaseUrl = 'http://localhost:4200/';
  public userInfo = {};
  public accidentId = '';
  public laborUserId = '';
  public isAndroid = false;
  public isIos = false;
  public txSDKUrl = '';
  public accToken = {key: '', times: 0};
  public accTokenGetsdk = {key: '', times: 0};

  constructor() {
    this._dataStream$.subscribe((data) => this._onEvent(data));
  }

  notifyDataChanged(event, value) {

    let current = this._data[event];
    if (current !== value) {
      this._data[event] = value;

      this._data.next({
        event: event,
        data: this._data[event]
      });
    }
  }

  subscribe(event: string, callback: Function) {
    let subscribers = this._subscriptions.get(event) || [];
    subscribers.push(callback);

    this._subscriptions.set(event, subscribers);
  }

  _onEvent(data: any) {
    let subscribers = this._subscriptions.get(data['event']) || [];

    subscribers.forEach((callback) => {
      callback.call(null, data['data']);
    });
  }
}
