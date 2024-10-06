import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ApiGateawayService } from 'src/app/api-gateway/api-gateaway.service';
import { Product2Create, Produt } from '../../model/product.model';

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

  createProduct(product: Product2Create) {
    const createOptionOptionUrl = this.url;
    console.log("🚀 ~ ProductsService ~ createProduct ~ product:", product);
    return null;
    return this.apiGateawayService.Cpost(createOptionOptionUrl, product).pipe(
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

  updateProduct(produt: Produt) {
    const url = this.url;
    return this.apiGateawayService.Cput(url, produt).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of([]);
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
