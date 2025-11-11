import { Component } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  concatMap,
  map,
  takeWhile,
  scan,
  tap,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";
import { DEFAUT_SETTINGS } from "./constants/default-settings.contant";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {
  
  readonly settings$: BehaviorSubject<Settings> = new BehaviorSubject<Settings>(
    DEFAUT_SETTINGS
  );

  products$!: Observable<Product[]>;

  hasMoreProducts: boolean = true;

  constructor(private productService : ProductService) {}

  ngOnInit() {
    this.products$ = this.settings$.pipe(
      concatMap((settings) => this.productService.getProducts(settings)
                    .pipe(
                            tap(response => {
                              const loadedProducts = settings.skip + response.products.length;
                              this.hasMoreProducts = loadedProducts < response.total;
                            }),
                            map(response => response.products)
                    ),
                ),
      scan((allProducts, newProducts) => [...allProducts, ...newProducts], [] as Product[]),
      takeWhile(() => this.hasMoreProducts, true)
      
    );
  }

  loadMore() {
    console.log("Load more products clicked");
    if (this.hasMoreProducts) {
      this.settings$.next({
        limit : this.settings$.value.limit,
        skip: this.settings$.value.skip + this.settings$.value.limit,
      });
    }
  }
}
