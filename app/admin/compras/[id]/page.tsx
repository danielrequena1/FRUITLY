import { getCompraDetalle } from '@/app/actions/ventas';
import { notFound } from 'next/navigation';
import ProcesarCompraForm from '@/components/admin/ProcesarCompraForm';

export default async function ProcesarCompraPage({ params }: { params: { id: string } }) {
  const compra = await getCompraDetalle(params.id);

  if (!compra) {
    notFound();
  }

  return <ProcesarCompraForm params={params} compra={compra} />;
}
