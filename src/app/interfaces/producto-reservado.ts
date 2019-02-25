import { Producto } from 'src/app/interfaces/producto';
import { Cliente } from 'src/app/interfaces/cliente';
import { Usuario } from './usuario';
export interface ProductoReservado {
    Id: string;
    Cliente: Cliente;
    Vendedor: Usuario;
    Producto: Producto;
    PrecioUnidad: number;
    TipoPago: string;
    Interes: number;
    FechaReserva: Date;
    FechaRetiro: Date;
    DiaReserva: number;
    MesReserva: number;
    AnoReserva: number;
    DiaRetiro: number;
    MesRetiro: number;
    AnoRetiro: number;
    Restante: number;
    Estado: string;
}
