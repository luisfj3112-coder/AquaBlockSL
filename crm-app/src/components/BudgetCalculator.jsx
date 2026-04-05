import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

const BudgetCalculator = ({ onSaveBudget }) => {
    const [ancho, setAncho] = useState(1.2);
    const [alto, setAlto] = useState(1.0);
    const [numMastiles, setNumMastiles] = useState(0);
    const [total, setTotal] = useState(0);

    const MATH_MODULE_PER_METER = 309.3833; // (371.26 / 1.2)
    const MATH_MASTIL_PER_METER = 96.36;
    const MATH_MASTIL_05 = 54.00;

    useEffect(() => {
        if (ancho > 0 && alto >= 0.5) {
            // Cálculo Módulos
            const moduleLayers = alto / 0.5;
            const moduleCostPerLayer = ancho * MATH_MODULE_PER_METER;
            const totalModulesCost = moduleLayers * moduleCostPerLayer;

            // Cálculo Mástiles
            let totalMastilCost = 0;
            if (numMastiles > 0) {
                if (alto === 0.5) {
                    totalMastilCost = numMastiles * MATH_MASTIL_05;
                } else {
                    totalMastilCost = numMastiles * (alto * MATH_MASTIL_PER_METER);
                }
            }

            setTotal(totalModulesCost + totalMastilCost);
        } else {
            setTotal(0);
        }
    }, [ancho, alto, numMastiles]);

    const handleSave = () => {
        if (onSaveBudget) {
            onSaveBudget({
                description: `Módulos AquaBlock (${numMastiles} Uniones/Mástiles)`,
                medidas_ancho: parseFloat(ancho),
                medidas_alto: parseFloat(alto),
                price: parseFloat(total.toFixed(2))
            });
            // Reset state
            setAncho(1.2);
            setAlto(1.0);
            setNumMastiles(0);
        }
    };

    return (
        <div style={{ background: 'var(--panel-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <Calculator size={18} /> Calculadora de Presupuestos Automática
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                <div className="form-group">
                    <label>Ancho (metros)</label>
                    <input 
                        type="number" 
                        step="0.1" 
                        min="0.1"
                        value={ancho} 
                        onChange={(e) => setAncho(parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <div className="form-group">
                    <label>Alto (metros) - Tramos 0.5</label>
                    <input 
                        type="number" 
                        step="0.5" 
                        min="0.5"
                        value={alto} 
                        onChange={(e) => {
                            // Asegurar que el alto es múltiplo de 0.5
                            let val = parseFloat(e.target.value) || 0.5;
                            setAlto(val);
                        }}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div className="form-group">
                    <label>Nº de Mástiles (Uniones)</label>
                    <input 
                        type="number" 
                        step="1" 
                        min="0"
                        value={numMastiles} 
                        onChange={(e) => setNumMastiles(parseInt(e.target.value) || 0)}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '15px', background: 'var(--bg-color)', borderRadius: '6px' }}>
                <div>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Calculado:</span>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                        {total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </div>
                </div>
                
                <button 
                    onClick={handleSave}
                    disabled={total <= 0}
                    style={{
                        background: 'var(--success-color)',
                        color: 'white',
                        padding: '10px 20px',
                        fontWeight: '600',
                        opacity: total <= 0 ? 0.5 : 1,
                        cursor: total <= 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Añadir a Obras
                </button>
            </div>
        </div>
    );
};

export default BudgetCalculator;
