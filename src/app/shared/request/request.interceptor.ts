import { Injectable, Optional } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RequestConfig } from './request.service';
import { BrowserStorageService } from '@services/storage.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  currenConfig: any;
  constructor(
    private storage: BrowserStorageService,
    @Optional() config: RequestConfig,
  ) {
    this.currenConfig = config;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apikey = this.storage.get('apikey');
    const timelineId = this.storage.getUser().timelineId;
    const teamId = this.storage.getUser().teamId;
    let headerClone = req.headers;
    let paramsInject = req.params;

    // inject appkey
    if (this.currenConfig.appkey) {
      let appkey = this.currenConfig.appkey;
      headerClone = headerClone.set('appkey', appkey);
    }
    if (apikey) {
      headerClone = headerClone.set('apikey', apikey);
    }
    if (timelineId) {
      headerClone = headerClone.set('timelineId', timelineId);
    }
    if (teamId) {
      headerClone = headerClone.set('teamId', teamId);
    }

    return next.handle(req.clone({
      headers: headerClone,
      params: paramsInject,
    }));
  }
}
