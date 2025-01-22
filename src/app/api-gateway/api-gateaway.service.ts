import { HttpClient, HttpContext, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { SkipLoading } from '../shared/Interceptor/loading-interceptor';

export type HttpObserve = 'body' | 'event' | 'response';

@Injectable({
  providedIn: 'root',
})
export class ApiGateawayService extends HttpClient {
  protected api = ENV.apiUrl;

  constructor(handler: HttpHandler) {
    super(handler);
  }

  Cget(url: string, skipLoading: boolean = false) {
    url = this.api + url;
    let headers = new HttpHeaders();
    let context = new HttpContext().set(SkipLoading, skipLoading);
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    headers = headers.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
    );
    return super.get(url, { headers, context });
  }

  Cpost(url: string, body: any, skipLoading: boolean = false) {
    url = this.api + url;
    let headers = new HttpHeaders();
    let context = new HttpContext().set(SkipLoading, skipLoading);
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    headers = headers.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
    );
    return super.post(url, body, { headers, context });
  }

  Cput(url: string, body: any, skipLoading: boolean = false) {
    url = this.api + url;
    let headers = new HttpHeaders();
    let context = new HttpContext().set(SkipLoading, skipLoading);
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    headers = headers.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
    );
    return super.put(url, body, { headers, context });
  }

  Cdelete(url: string, skipLoading: boolean = false) {
    url = this.api + url;
    let headers = new HttpHeaders();
    let context = new HttpContext().set(SkipLoading, skipLoading);
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    headers = headers.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
    );
    return super.delete(url, { headers, context });
  }

  // request(method: string, url: string, options: {
  //   body?: any;
  //   headers?: HttpHeaders | {
  //     [header: string]: string | string[];
  //   };
  //   context?: HttpContext;
  //   observe?: HttpObserve;
  //   params?: HttpParams | {
  //     [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  //   };
  //   reportProgress?: boolean;
  //   responseType: 'arraybuffer' | '' | '' | "";
  //   withCredentials?: boolean;
  // }): Observable<any> {
  //   url += this.api;
  //   return super.request(method as string, url, options as any);
  // }
}
