import { RouterModule, Routes } from '@angular/router';
import { LayoutDashboardComponent } from './layout-dashboard/layout-dashboard.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: LayoutDashboardComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        data: {
          title: 'Dashboard',
        },
      },
      {
        path: 'purchase',
        loadComponent: () =>
          import('./facturacion/purchase/purchase.component').then(
            (m) => m.PurchaseComponent
          ),
      },
      {
        path: 'sale',
        loadComponent: () =>
          import('./facturacion/sale/sale.component').then(
            (m) => m.SaleComponent
          ),
      },
      {
        path: 'ordering',
        loadComponent: () =>
          import('./ordering/ordering.component').then(
            (m) => m.OrderingComponent
          ),
      },
      {
        path: 'vouchers',
        loadComponent: () =>
          import('./vouchers/vouchers.component').then(
            (m) => m.VouchersComponent
          ),
      },
      {
        path: 'product',
        loadComponent: () =>
          import('./product/product.component').then((m) => m.ProductComponent),
      },
      {
        path: 'category',
        loadComponent: () =>
          import('./gestion/category/category.component').then(
            (m) => m.CategoryComponent
          ),
      },
      {
        path: 'brand',
        loadComponent: () =>
          import('./gestion/brand/brand.component').then(
            (m) => m.BrandComponent
          ),
      },
      {
        path: 'movimiento',
        loadComponent: () =>
          import('./movimiento/movimiento.component').then(
            (m) => m.MovimientoComponent
          ),
      },
      {
        path: 'admin-user',
        loadComponent: () =>
          import('./admin-user/admin-user.component').then(
            (m) => m.AdminUserComponent
          ),
      },
      {
        path: 'quotation',
        loadComponent: () =>
          import('./facturacion/quotation/quotation.component').then(
            (m) => m.QuotationComponent
          ),
      },
      {
        path: 'list-quotation',
        loadComponent: () =>
          import('./facturacion/list-quotation/list-quotation.component').then(
            (m) => m.ListQuotationComponent
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./reportes/reportes.component').then(
            (m) => m.ReportesComponent
          ),
      },
    ],
  },
] as Routes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutesModule {}
