'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { Compra, Profile, Producto, Cliente } from '@/lib/supabase/types';

// ... (existing code)

export async function getUsuarios() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function actualizarUsuario(id: string, updates: { nombre: string, role: 'trabajador' | 'administrador', activo: boolean }) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id);

  return { success: !error, error };
}

export async function resetearPassword(id: string, newPassword: string) {
  const adminClient = await createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(id, {
    password: newPassword
  });

  return { success: !error, error };
}

export async function getAdminDashboardData() {
  const supabase = await createClient();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Compras hoy
  const { count: comprasHoy } = await supabase
    .from('compras')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  // 2. Compras pendientes de procesar
  const { data: pendientes } = await supabase
    .from('compras')
    .select(`
      *,
      profiles:trabajador_id (nombre),
      productos:producto_id (nombre)
    `)
    .eq('estado', 'pendiente')
    .order('created_at', { ascending: false });

  // 3. Clientes totales
  const { count: clientesTotales } = await supabase
    .from('clientes')
    .select('*', { count: 'exact', head: true });

  // 4. Facturado hoy (MOCK por ahora hasta tener lógica de ventas completa)
  // En el futuro esto sumará las ventas del día
  const facturadoHoy = 0;

  return {
    metrics: {
      comprasHoy: comprasHoy || 0,
      pendientes: pendientes?.length || 0,
      facturadoHoy: facturadoHoy,
      clientes: clientesTotales || 0
    },
    pendientes: pendientes || []
  };
}

export async function getClientes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error fetching clientes:', error);
    return [];
  }
  return data || [];
}

export async function crearCliente(cliente: Omit<Cliente, 'id'>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clientes')
    .insert(cliente)
    .select()
    .single();

  if (error) {
    console.error('Error creating cliente:', error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function procesarCompra(data: {
  compra_id: string;
  cliente_id: string;
  pvp: number;
  tipo_iva: number;
}) {
  const supabase = await createClient();

  // 1. Crear la venta
  const { error: ventaError } = await supabase
    .from('ventas')
    .insert({
      compra_id: data.compra_id,
      cliente_id: data.cliente_id,
      pvp: data.pvp,
      tipo_iva: data.tipo_iva,
      pagada: false,
      vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

  if (ventaError) {
    console.error('Error al crear venta:', ventaError);
    return { success: false, error: ventaError.message };
  }

  // 2. Marcar la compra como completada
  const { error: compraError } = await supabase
    .from('compras')
    .update({ estado: 'completada' })
    .eq('id', data.compra_id);

  if (compraError) {
    console.error('Error al actualizar compra:', compraError);
    return { success: false, error: compraError.message };
  }

  return { success: true };
}

export async function getVentas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ventas')
    .select(`
      *,
      clientes:cliente_id (*),
      compras:compra_id (
        *,
        productos:producto_id (nombre)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ventas:', error);
    return [];
  }
  return data || [];
}

export async function marcarVentaComoEnviada(ventaId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('ventas')
    .update({ enviada: true })
    .eq('id', ventaId);

  if (error) {
    console.error('Error al marcar como enviada:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getProductosConStock() {
  const supabase = await createClient();
  
  const { data: productos, error: prodError } = await supabase
    .from('productos')
    .select('*')
    .order('nombre', { ascending: true });

  if (prodError) return [];

  const { data: stockData } = await supabase
    .from('compras')
    .select('producto_id, cantidad_kg')
    .eq('estado', 'pendiente');

  return productos.map(p => {
    const stock = stockData
      ?.filter(s => s.producto_id === p.id)
      .reduce((acc, curr) => acc + Number(curr.cantidad_kg), 0) || 0;
    
    return { ...p, stock };
  });
}

export async function getComprasAnalytics() {
  const supabase = await createClient();
  
  // Obtener todas las compras con sus productos y ventas asociadas
  const { data: compras, error } = await supabase
    .from('compras')
    .select(`
      *,
      productos:producto_id (nombre),
      profiles:trabajador_id (nombre),
      ventas:ventas (pvp, tipo_iva)
    `)
    .order('created_at', { ascending: false });

  if (error) return null;

  const totalInversion = compras.reduce((acc, c) => acc + (Number(c.cantidad_kg) * Number(c.precio_compra)), 0);
  const totalVentas = compras.reduce((acc, c) => {
    const venta = c.ventas?.[0];
    return acc + (venta ? Number(venta.pvp) : 0);
  }, 0);

  const beneficio = totalVentas - totalInversion;
  const margenMedio = totalVentas > 0 ? (beneficio / totalVentas) * 100 : 0;

  return {
    compras,
    stats: {
      totalInversion,
      totalVentas,
      beneficio,
      margenMedio
    }
  };
}

export async function getFiscalData() {
  const supabase = await createClient();
  
  const { data: ventas, error } = await supabase
    .from('ventas')
    .select(`
      *,
      clientes:cliente_id (nombre)
    `)
    .order('vencimiento', { ascending: true });

  if (error) return null;

  const summary = {
    baseTotal: 0,
    ivaTotal: 0,
    totalFacturado: 0,
    iva4: 0,
    iva10: 0,
    iva21: 0,
    pendientesCobro: 0
  };

  ventas.forEach(v => {
    const base = Number(v.pvp) || 0;
    const iva = (base * (Number(v.tipo_iva) || 0)) / 100;
    
    summary.baseTotal += base;
    summary.ivaTotal += iva;
    summary.totalFacturado += (base + iva);

    if (v.tipo_iva === 4) summary.iva4 += iva;
    if (v.tipo_iva === 10) summary.iva10 += iva;
    if (v.tipo_iva === 21) summary.iva21 += iva;

    if (!v.pagada) {
      summary.pendientesCobro += (base + iva);
    }
  });

  return {
    ventas,
    summary
  };
}

export async function marcarVentaComoPagada(ventaId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('ventas')
    .update({ pagada: true })
    .eq('id', ventaId);

  return { success: !error, error };
}
