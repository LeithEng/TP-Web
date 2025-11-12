import { Component, computed, inject, linkedSignal, signal } from "@angular/core";
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
    source : this.currentProducts,
    computation : (newProducts , previewProduct) =>{
      if (!previewProduct) return newProducts;
      return newProducts.length > 0 ? [...previewProduct.value, ...newProducts] : previewProduct.value;
    } 
  })

  hasMoreProducts = computed(() => {
    console.log("cuerrent settings:", this.settings());
    console.log("total products:", this.totalProducts());
    const current = this.settings();
    const total = this.totalProducts();
    return (current.skip + current.limit) < total;
  });
/*
  isLoading = computed(() => this.productResource.isLoading());
*/
  loadMore() {
    if (this.hasMoreProducts() && !this.productResource.isLoading()) {
      this.settings.update(current => ({
        ...current,
        skip: current.skip + current.limit
      }));
    }
  }
  
}
