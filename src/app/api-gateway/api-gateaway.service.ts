import { HttpClient, HttpContext, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';

export type HttpObserve = 'body' | 'event' | 'response';

@Injectable({
  providedIn: 'root',
})
export class ApiGateawayService extends HttpClient {
  protected api = ENV.apiUrl;

  constructor(handler: HttpHandler) {
    super(handler);
  }

  Cget(url: string) {
    url = this.api + url;
    let headers = new HttpHeaders();
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    headers = headers.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
    );
    return super.get(url, { headers: headers });
  }

  Cpost(url: string, body: any) {
    url = this.api + url;
    let headers = new HttpHeaders();
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    headers = headers.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
    );
    return super.post(url, body, { headers: headers });
  }

  Cput(url: string, body: any) {
    url = this.api + url;
    let headers = new HttpHeaders();
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    headers = headers.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
    );
    return super.put(url, body, { headers: headers });
  }

  Cdelete(url: string) {
    url = this.api + url;
    let headers = new HttpHeaders();
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    headers = headers.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
    );
    return super.delete(url, { headers: headers });
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
