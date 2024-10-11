import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ApiGateawayService } from 'src/app/api-gateway/api-gateaway.service';
import { Category, Category2Create } from '../../model/categories.model';

@Injectable({
  providedIn: 'root',
})
export class CatagoriesService {
  url = 'catagories';

  constructor(private apiGateawayService: ApiGateawayService) { }

  searchCaterogies(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGateawayService.Cget(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  createCategory(category: Category2Create) {
    const updatecategorycategoryUrl = this.url;
    return this.apiGateawayService.Cpost(updatecategorycategoryUrl, category).pipe(
      tap((res: any) => {
        console.log('🚀 ~ CaterogiesService ~ tap ~ res:', res);
      }),
      catchError((error) => {
        //write log
        console.log('🚀 ~ CaterogiesService ~ getCaterogies ~ error:', error);
        return of([]);
      }),
    );
  }

  updateCategory(category: Category) {
    const updatecategorycategoryUrl = this.url;
    return this.apiGateawayService.Cput(updatecategorycategoryUrl, category).pipe(
      tap((res: any) => {
        console.log('🚀 ~ CaterogiesService ~ tap ~ res:', res);
      }),
      catchError((error) => {
        //write log
        console.log('🚀 ~ CaterogiesService ~ getCaterogies ~ error:', error);
        return of([]);
      }),
    );
  }

  deleteCategory(id: string) {
    const deleteCategoryUrl = this.url + `/${id}`;
    return this.apiGateawayService.Cdelete(deleteCategoryUrl).pipe(
      tap((res: any) => {
        console.log('🚀 ~ CaterogiesService ~ tap ~ res:', res);
      }),
      catchError((error) => {
        //write log
        console.log('🚀 ~ CaterogiesService ~ getCaterogies ~ error:', error);
        return of([]);
      }),
    );
  }
}
