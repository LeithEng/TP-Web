import { Component, computed, effect, inject, linkedSignal, signal } from "@angular/core";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";
import { DEFAULT_SETTINGS } from "./constants/defautl-setting";
import { rxResource } from "@angular/core/rxjs-interop";
import { ProductApiResponse } from "./dto/product-api-response.dto";
import { tap } from "rxjs";

@Component({
    selector: "app-products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.css"],
    standalone: true,
    imports: [],
})
export class ProductsComponent {

  private productService = inject(ProductService);

  settings = signal<Settings>(DEFAULT_SETTINGS);

  productResource = rxResource<ProductApiResponse, Settings>({
    request: () => this.settings(),
    loader: ({ request }) => this.productService.getProducts(request).pipe(
      tap(response => console.log('Response from API:', response))
    ),
  });


  totalProducts = linkedSignal<number | undefined, number>({
    source: () => (this.productResource.value()?.total),
    computation: (source, previous) => {
      //total is undefined take previous value
      if (source === undefined) {
        return previous?.value ?? 0;
      }
      return source;
    }
  });

  currentProducts = linkedSignal<Product[] | undefined, Product[]>({
    source: computed(() => this.productResource.value()?.products),
    computation: (source, previous) => {
      //products is undefined take previous value
      if (source=== undefined) {
        return previous?.value ?? [];
      }
      return source;
    }
  });

  products = linkedSignal<Product[], Product[]>({
    source : () => this.currentProducts(),
    computation : (newProducts , previousProduct) =>{
      if (!previousProduct) return newProducts;
      if (newProducts.length === 0) return previousProduct.value; //hedhi zeyda
      return [...previousProduct.value, ...newProducts].reverse(); 
    } 
  })

  hasMoreProducts = computed(() => this.products().length < this.totalProducts());

  loadMore() {
    if (this.hasMoreProducts() && !this.productResource.isLoading()) {
      this.settings.update(current => ({
        ...current,
        skip: current.skip + current.limit
      }));
    }
  }

   constructor() {
    effect(() => {
      console.log('=== important  Status ===');
      console.log('Current Settings:', this.settings());
      console.log('isLoading:', this.productResource.isLoading());
      console.log('hasValue:', this.productResource.hasValue());
      console.log('value:', this.productResource.value());
      console.log('error:', this.productResource.error());
      console.log('status:', this.productResource.status());
      console.log('totalProducts :', this.totalProducts());
      console.log('length of products :', this.products().length);
      console.log('hasMoreProducts :', this.hasMoreProducts());
      console.log('current products:', this.currentProducts());
      console.log('products:', this.products());
      console.log('**==============================**');
    });
  }
  
}


/*
  totalProducts = linkedSignal<{ total: number | undefined; hasValue: boolean }, number>({
    source: computed(() => ({
      total: this.productResource.value()?.total,
      hasValue: this.productResource.hasValue()
    })),
    computation: (source, previous) => {
      // check if source has no value or total is undefined
      if (!source.hasValue || source.total === undefined) {
        return previous?.value ?? 0;
      }
      return source.total;
    }
  });
*/

/*
  isLoading = computed(() => this.productResource.isLoading());
*/

/*
old version:


  totalProducts = linkedSignal<number | undefined, number>({
    source: () => (this.productResource.value()?.total),
    computation: (source, previous) => {
      // check if source has no value or total is undefined
      if (!this.productResource.hasValue || source === undefined) {
        return previous?.value ?? 0;
      }
      return source;
    }
  });

  currentProducts = linkedSignal<{ products: Product[] | undefined; hasValue: boolean }, Product[]>({
    source: computed(() => ({
      products: this.productResource.value()?.products,
      hasValue: this.productResource.hasValue()
    })),
    computation: (source, previous) => {
      // check if source has no value or products is undefined
      if (!source.hasValue || source.products === undefined) {
        return previous?.value ?? [];
      }
      return source.products;
    }
  });

  products = linkedSignal<Product[], Product[]>({
    source : () => this.currentProducts(),
    computation : (newProducts , previewProduct) =>{
      if (!previewProduct) return newProducts;
      return newProducts.length > 0 ? [...previewProduct.value, ...newProducts] : previewProduct.value;
    } 
  })

  hasMoreProducts = computed(() => {
    console.log("current products length:",this.products().length );
    console.log("total products:", this.totalProducts());
    const currentProductLength = this.products().length;
    const total = this.totalProducts();
    return currentProductLength < total;
  });

  loadMore() {
    if (this.hasMoreProducts() && !this.productResource.isLoading()) {
      this.settings.update(current => ({
        ...current,
        skip: current.skip + current.limit
      }));
    }
  }

  */