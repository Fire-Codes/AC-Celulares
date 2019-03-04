import { Usuario } from './usuario';
import { Cliente } from 'src/app/interfaces/cliente';
import { ProductoFactura } from './producto-factura';

export interface Factura {
    Productos: ProductoFactura[];
    Cliente: Cliente;
    Vendedor: Usuario;
    Fecha: string;
    Mes: number;
    Ano: number;
    Dia: number;
    Hora: number;
    Minuto: number;
    Segundo: number;
    Tiempo: string;
    Id: string;
    NumeroFactura: number;
    TotalCordoba: number;
    TotalDolar: number;
    Descuento: number;
    Interes: number;
    TipoPago: string;
}
