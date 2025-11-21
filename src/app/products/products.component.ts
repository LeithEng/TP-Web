import { Component } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  concatMap,
  map,
  takeWhile,
  scan,
  tap,
  take,
  shareReplay,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";
import { DEFAUT_SETTINGS } from "./constants/default-settings.contant";
import { ProductApiResponse } from "./dto/product-api-response.dto";

@Component({
  standalone: false,
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {
    constructor(private productService : ProductService) {}

  readonly settings$: BehaviorSubject<Settings> = new BehaviorSubject<Settings>(
    DEFAUT_SETTINGS
  );
  
  
  apiResponse$ : Observable<ProductApiResponse> = this.settings$.pipe(
    concatMap((settings) => this.productService.getProducts(settings)),
    scan ((allResponses, newResponse) => {
        const combinedProducts = [...allResponses.products, ...newResponse.products];
        return {
            ...newResponse,
            products: combinedProducts
        };
      }
    ),
    tap((response) => {
      console.log("all products length :", response.products.length)
      console.log("total products available:", response.total)
      })
    ,
    takeWhile((response) => response.products.length < response.total , true),
    shareReplay(1)
  );



  products$ : Observable<Product[]> = this.apiResponse$.pipe(
    map(response => response.products)
  )


  hasMoreProducts$: Observable<boolean> = this.apiResponse$.pipe(
    map(response => response.products.length < response.total)
  );

    loadMore() {
    console.log("Load more products clicked");
    this.settings$.next({
        limit : this.settings$.value.limit,
        skip: this.settings$.value.skip + this.settings$.value.limit,
    });
    }


/*
  products$ : Observable<Product[]> = this.settings$.pipe(
     
    concatMap((settings) => this.productService.getProducts(settings)),
   
    scan ((allResponses, newResponse) => {
        const combinedProducts = [...allResponses.products, ...newResponse.products];
        return {
            ...newResponse,
            products: combinedProducts
        };
      }
    ),
    
    takeWhile((apiResponse) => apiResponse.skip +apiResponse.limit < apiResponse.total , true),
    map((apiResponse) => apiResponse.products),
  )

   loadMore() {
    console.log("Load more products clicked");
    this.settings$.next({
        limit : this.settings$.value.limit,
        skip: this.settings$.value.skip + this.settings$.value.limit,
    });
    
  }
*/
}

/*


*/

  
 
/*



    */