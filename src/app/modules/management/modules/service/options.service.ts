import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ApiGateawayService } from 'src/app/api-gateway/api-gateaway.service';
import { Options, Options2Create, SearchOptions } from '../../model/options.model';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  private baseUrl = 'options';

  constructor(private apiGateawayService: ApiGateawayService) { }

  searchOptions(pageIdx: number, pageSize: number) {
    const url = `${this.baseUrl}?pageIdx=${pageIdx}&pageSize=${pageSize}`;
    return this.apiGateawayService.Cget<SearchOptions>(url).pipe(
      tap((res: SearchOptions) => {
        console.log('🚀 ~ OptionsService ~ searchOptions ~ res:', res);
      }),
      catchError((error) => {
        console.error('🚀 ~ OptionsService ~ searchOptions ~ error:', error);
        return of(null);
      }),
    );
  }

  createOption(option: Options2Create) {
    return this.apiGateawayService.Cpost<Options>(this.baseUrl, option).pipe(
      tap((res: Options) => {
        console.log('🚀 ~ OptionsService ~ createOption ~ res:', res);
      }),
      catchError((error) => {
        console.error('🚀 ~ OptionsService ~ createOption ~ error:', error);
        return of(null);
      }),
    );
  }

  updateOption(option: Options) {
    return this.apiGateawayService.Cput<Options>(this.baseUrl, option).pipe(
      tap((res: Options) => {
        console.log('🚀 ~ OptionsService ~ updateOption ~ res:', res);
      }),
      catchError((error) => {
        console.error('🚀 ~ OptionsService ~ updateOption ~ error:', error);
        return of(null);
      }),
    );
  }

  deleteOption(id: string) {
    const deleteOptionUrl = `${this.baseUrl}/${id}`;
    return this.apiGateawayService.Cdelete<any>(deleteOptionUrl).pipe(
      tap((res: any) => {
        console.log('🚀 ~ OptionsService ~ deleteOption ~ res:', res);
      }),
      catchError((error) => {
        console.error('🚀 ~ OptionsService ~ deleteOption ~ error:', error);
        return of(null);
      }),
    );
  }
}
