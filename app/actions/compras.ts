'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Compra, Producto } from '@/lib/supabase/types';

export async function getProductos(): Promise<Producto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error fetching productos:', error);
    return [];
  }
  return data || [];
}

export async function getComprasHoy(trabajadorId: string): Promise<Compra[]> {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('compras')
    .select('*')
    .eq('trabajador_id', trabajadorId)
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching compras hoy:', error);
    return [];
  }
  return data || [];
}

export async function getHistoricoCompras(trabajadorId: string): Promise<Compra[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('compras')
    .select('*')
    .eq('trabajador_id', trabajadorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching historico:', error);
    return [];
  }
  return data || [];
}

export async function registrarCompra(formData: {
  producto_id: string;
  cantidad_kg: number;
  precio_compra: number;
  notas?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'No autorizado' };

  const { error } = await supabase.from('compras').insert({
    trabajador_id: user.id,
    producto_id: formData.producto_id,
    cantidad_kg: formData.cantidad_kg,
    precio_compra: formData.precio_compra,
    notas: formData.notas,
    estado: 'pendiente'
  });

  if (error) {
    console.error('Error registrardo compra:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/trabajador/dashboard');
  revalidatePath('/trabajador/historial');
  return { success: true };
}
