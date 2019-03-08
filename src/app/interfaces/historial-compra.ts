import { ProductoFactura } from './producto-factura';
export interface HistorialCompra {
    'Articulos Comprados': ProductoFactura[];
    TipoPago: string;
    TotalCordoba: number;
    TotalDolar: number;
    Hora: number;
    Minuto: number;
    Segundo: number;
    Dia: number;
    Mes: string;
    Ano: number;
    Fecha: string;
    Tiempo: string;
    Id: string;
    Interes: number;
}
