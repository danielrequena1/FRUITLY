export type Role = 'trabajador' | 'administrador';

export interface Profile {
  id: string;
  email: string;
  role: Role;
  nombre: string;
  created_at: string;
}

export interface Producto {
  id: string;
  nombre: string;
  unidad: 'kg' | 'caja' | 'unidad';
  activo: boolean;
}

export interface Compra {
  id: string;
  trabajador_id: string;
  producto_id: string;
  cantidad_kg: number;
  precio_compra: number;
  estado: 'pendiente' | 'completada' | 'cancelada';
  created_at: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  nif: string;
  direccion: string;
  telefono?: string;
}

export interface Venta {
  id: string;
  compra_id: string;
  cliente_id: string;
  pvp: number;
  tipo_iva: 4 | 10 | 21;
  factura_pdf_url?: string;
  enviada: boolean;
  pagada: boolean;
  vencimiento: string;
  created_at: string;
}
