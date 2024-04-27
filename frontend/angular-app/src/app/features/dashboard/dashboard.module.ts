import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductComponent } from './components/product/product.component';



@NgModule({
  declarations: [
  
    DashboardComponent,
       ProductComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DashboardModule { }
