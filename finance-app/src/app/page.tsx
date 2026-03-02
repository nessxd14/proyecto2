'use client';

import React, { useState } from 'react';
// Importamos los componentes necesarios de Recharts
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Datos de prueba para el gráfico
const data = [
  { name: 'Ene', ingresos: 4000, gastos: 2400 },
  { name: 'Feb', ingresos: 3000, gastos: 1398 },
  { name: 'Mar', ingresos: 5200, gastos: 1850 },
];

export default function Home() {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('gasto');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ monto, descripcion, tipo });
    alert(`Registrado: ${descripcion} por Bs ${monto}`);
    setMonto('');
    setDescripcion('');
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Control de Finanzas</h1>
          <p className="text-gray-500">Visualiza tu flujo de caja en tiempo real</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Formulario (Ocupa 1 de 4 columnas) */}
          <div className="lg:col-span-1">
            {/* ... (Aquí va el código del formulario que ya tenemos) ... */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold mb-4">Nuevo Registro</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción" className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number" value={monto} onChange={(e) => setMonto(e.target.value)}
                  placeholder="Monto Bs" className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full p-2 border rounded-lg">
                  <option value="gasto">Gasto</option>
                  <option value="ingreso">Ingreso</option>
                </select>
                <button className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700">Guardar</button>
              </form>
            </div>
          </div>

          {/* Dashboard Visual (Ocupa 3 de 4 columnas) */}
          <div className="lg:col-span-3 space-y-6">

            {/* Tarjetas Superiores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
                <p className="text-xs text-gray-400 font-bold uppercase">Total Ingresos</p>
                <h2 className="text-2xl font-black text-green-600">Bs 5,200</h2>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
                <p className="text-xs text-gray-400 font-bold uppercase">Total Gastos</p>
                <h2 className="text-2xl font-black text-red-600">Bs 1,850</h2>
              </div>
            </div>

            {/* GRÁFICO DE TENDENCIA */}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Tendencia Mensual</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorIngreso" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="ingresos" stroke="#22c55e" fillOpacity={1} fill="url(#colorIngreso)" strokeWidth={3} />
                    <Area type="monotone" dataKey="gastos" stroke="#ef4444" fill="transparent" strokeWidth={3} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}