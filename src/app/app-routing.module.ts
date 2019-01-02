import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// importacion de los componentes para establecerlo en las rutas
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SeleccionarPlataformaComponent } from './pages/seleccionar-plataforma/seleccionar-plataforma.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InventarioComponent } from './pages/inventario/inventario.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'ingresar', component: LoginComponent},
  {path: 'registrar', component: SignupComponent},
  {path: 'plataforma', component: SeleccionarPlataformaComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'inventario', component: InventarioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
