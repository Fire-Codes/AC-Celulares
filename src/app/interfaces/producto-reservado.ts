import { Producto } from 'src/app/interfaces/producto';
import { Cliente } from 'src/app/interfaces/cliente';
import { Usuario } from './usuario';
export interface ProductoReservado {
    Cliente: Cliente;
    Vendedor: Usuario;
    Producto: Producto;
    PrecioUnidad: number;
    TipoPago: string;
    Interes: number;
    FechaReserva: Date;
    FechaRetiro: Date;
    Restante: number;
    Estado: string;
}
