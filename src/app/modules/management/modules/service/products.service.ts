import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ApiGateawayService } from 'src/app/api-gateway/api-gateaway.service';
import { Product2Create, Product } from '../../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  url = 'products';

  constructor(private apiGateawayService: ApiGateawayService) { }

  searchProducts(pageIdx: number, pageSize: number, keyword: string, sortBy: string) {
    const url = `${this.url}?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGateawayService.Cget(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  getProductById(id: string) {
    const createOptionOptionUrl = `${this.url}/findOne?id=${id}`;
    return this.apiGateawayService.Cget(createOptionOptionUrl).pipe(
      tap((res: any) => {
        console.log("🚀 ~ ProductsService ~ tap ~ res:", res)
      }),
      catchError((error) => {
        console.log("🚀 ~ ProductsService ~ catchError ~ error:", error)
        //write log
        return of([]);
      }),
    );
  }

  createProduct(product: Product2Create) {
    const createOptionOptionUrl = this.url;
    return this.apiGateawayService.Cpost(createOptionOptionUrl, product).pipe(
      tap((res: any) => {
        console.log("🚀 ~ ProductsService ~ tap ~ res:", res)
      }),
      catchError((error) => {
        console.log("🚀 ~ ProductsService ~ catchError ~ error:", error)
        //write log
        return of(null);
      }),
    );
  }

  updateProduct(produt: Product) {
    const url = this.url;
    return this.apiGateawayService.Cput(url, produt).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }

  deleteProduct(id: string) {
    const deleteProductUrl = this.url + `/${id}`;
    return this.apiGateawayService.Cdelete(deleteProductUrl).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }
}
