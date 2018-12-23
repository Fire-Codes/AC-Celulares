import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// importacion de los componentes para establecerlo en las rutas
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'ingresar', component: LoginComponent},
  {path: 'registrar', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
