import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ApiGateawayService } from 'src/app/api-gateway/api-gateaway.service';
import { Options, Options2Create } from '../../model/options.model';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  url = 'options';

  constructor(private apiGateawayService: ApiGateawayService) {}

  searchOptions(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGateawayService.Cget(url).pipe(
      tap((res: any) => {}),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  createOption(option: Options2Create) {
    const updateOptionOptionUrl = this.url;
    return this.apiGateawayService.Cpost(updateOptionOptionUrl, option).pipe(
      tap((res: any) => {
        console.log('🚀 ~ OptionsService ~ tap ~ res:', res);
      }),
      catchError((error) => {
        //write log
        console.log('🚀 ~ OptionsService ~ getOptions ~ error:', error);
        return of([]);
      }),
    );
  }

  updateOption(option: Options) {
    const updateOptionOptionUrl = this.url;
    return this.apiGateawayService.Cput(updateOptionOptionUrl, option).pipe(
      tap((res: any) => {
        console.log('🚀 ~ OptionsService ~ tap ~ res:', res);
      }),
      catchError((error) => {
        //write log
        console.log('🚀 ~ OptionsService ~ getOptions ~ error:', error);
        return of([]);
      }),
    );
  }

  deleteOption(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGateawayService.Cdelete(deleteOptionUrl).pipe(
      tap((res: any) => {
        console.log('🚀 ~ OptionsService ~ tap ~ res:', res);
      }),
      catchError((error) => {
        //write log
        console.log('🚀 ~ OptionsService ~ getOptions ~ error:', error);
        return of([]);
      }),
    );
  }
}
