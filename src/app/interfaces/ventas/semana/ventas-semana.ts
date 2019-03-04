import { TipoProductos } from '../tipo-productos';

export interface VentasSemana {
    TotalVentas: number;
    Lunes: TipoProductos;
    Martes: TipoProductos;
    Miercoles: TipoProductos;
    Jueves: TipoProductos;
    Viernes: TipoProductos;
    Sabado: TipoProductos;
    Domingo: TipoProductos;
}
