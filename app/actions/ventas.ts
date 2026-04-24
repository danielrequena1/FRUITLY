'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Compra, Cliente, Producto, Venta } from '@/lib/supabase/types';

export async function getMetricasHoy() {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Compras hoy
  const { count: comprasHoy } = await supabase
    .from('compras')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  // 2. Pendientes de procesar
  const { count: pendientes } = await supabase
    .from('compras')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'pendiente');

  // 3. Facturado hoy
  const { data: ventasHoy } = await supabase
    .from('ventas')
    .select('total_con_iva')
    .gte('created_at', today.toISOString());
  
  const facturadoHoy = ventasHoy?.reduce((acc: number, curr: { total_con_iva: number | string }) => acc + Number(curr.total_con_iva), 0) || 0;

  // 4. Clientes activos
  const { count: clientesActivos } = await supabase
    .from('clientes')
    .select('*', { count: 'exact', head: true });

  return {
    comprasHoy: comprasHoy || 0,
    pendientes: pendientes || 0,
    facturadoHoy,
    clientesActivos: clientesActivos || 0
  };
}

export async function getComprasPendientes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('compras')
    .select('*, profiles(nombre), productos(nombre)')
    .eq('estado', 'pendiente')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pendientes:', error);
    return [];
  }
  return data || [];
}

export async function getCompraDetalle(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('compras')
    .select('*, profiles(nombre), productos(nombre)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function buscarClientes(query: string): Promise<Cliente[]> {
  const supabase = await createClient();
  if (!query) return [];

  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .or(`nombre.ilike.%${query}%,email.ilike.%${query}%,nif.ilike.%${query}%`)
    .limit(5);

  if (error) return [];
  return data || [];
}

export async function crearCliente(cliente: Omit<Cliente, 'id' | 'created_at'>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clientes')
    .insert(cliente)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function procesarVenta(
  compraId: string, 
  pvp: number, 
  tipoIva: number, 
  clienteId: string
) {
  const supabase = await createClient();

  // 1. Crear la venta
  const { error: ventaError } = await supabase.from('ventas').insert({
    compra_id: compraId,
    cliente_id: clienteId,
    pvp,
    tipo_iva: tipoIva,
    enviada: false
  });

  if (ventaError) return { success: false, error: ventaError.message };

  // 2. Actualizar estado de la compra
  const { error: compraError } = await supabase
    .from('compras')
    .update({ estado: 'completada' })
    .eq('id', compraId);

  if (compraError) return { success: false, error: compraError.message };

  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/compras');
  return { success: true };
}
