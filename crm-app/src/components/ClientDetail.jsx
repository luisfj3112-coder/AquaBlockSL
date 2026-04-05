import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, FileText, Calculator } from 'lucide-react';
import api from '../api/api';
import BudgetCalculator from './BudgetCalculator';

const ClientDetail = ({ client, onClose, onSave, onRefresh }) => {
    const isNew = !client || !client.id;
    
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        zip: '',
        phone: '',
        email: '',
        offer_num: 'OF',
        offer_date: new Date().toISOString().split('T')[0],
        invoice_num: '',
        invoice_date: '',
        amount: 0,
        ordered: 0,
        man_num: '',
        order_date: '',
        stage: client?.stage || 'Sin presupuesto'
    });

    const [items, setItems] = useState([]);
    const [workItems, setWorkItems] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isNew) {
            setFormData({
                name: client.name || '',
                address: client.address || '',
                city: client.city || '',
                zip: client.zip || '',
                phone: client.phone || '',
                email: client.email || '',
                offer_num: client.offer_num || 'OF',
                offer_date: client.offer_date || '',
                invoice_num: client.invoice_num || '',
                invoice_date: client.invoice_date || '',
                amount: client.amount || 0,
                ordered: client.ordered || 0,
                man_num: client.man_num || '',
                order_date: client.order_date || '',
                stage: client.stage || 'Sin presupuesto'
            });
            fetchItems();
        }
    }, [client]);

    const fetchItems = async () => {
        try {
            const [itemsRes, workRes] = await Promise.all([
                api.get(`/clients/${client.id}/items`),
                api.get(`/clients/${client.id}/work`)
            ]);
            setItems(itemsRes.data || []);
            setWorkItems(workRes.data || []);
        } catch (err) {
            console.error('Error cargando los ítems', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Calcular importe total en base a los items + workItems (opcional, o dejar que sumen manualmente)
            const calculatedAmount = items.reduce((acc, el) => acc + (parseFloat(el.price) || 0), 0);
            const payload = { 
                ...formData, 
                items: items, 
                workItems: workItems,
                amount: calculatedAmount > 0 ? calculatedAmount : formData.amount 
            };

            if (isNew) {
                await api.post('/clients', payload);
            } else {
                await api.put(`/clients/${client.id}`, payload);
            }
            onSave();
        } catch (err) {
            console.error('Error guardando cliente', err);
            alert('Error al guardar el cliente');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddBudgetFromCalculator = (budgetObj) => {
        const newItem = {
            id: Date.now(), // temporary id
            description: budgetObj.description,
            medidas_ancho: budgetObj.medidas_ancho,
            medidas_alto: budgetObj.medidas_alto,
            price: budgetObj.price
        };
        setItems(prev => [...prev, newItem]);
    };

    const handleRemoveItem = (idxToRemove) => {
        setItems(prev => prev.filter((_, idx) => idx !== idxToRemove));
    };

    const handleItemChange = (idx, field, value) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[idx] = { ...newItems[idx], [field]: value };
            return newItems;
        });
    };

    return (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.6)', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass" style={{ width: '900px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '12px', padding: '30px', background: 'var(--bg-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                    <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{isNew ? 'Nuevo Cliente' : `Cliente: ${formData.name}`}</h2>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-secondary)' }}><X size={24} /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div className="form-group">
                        <label>Nombre del Cliente</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div className="form-group">
                        <label>Teléfono</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div className="form-group">
                        <label>Dirección</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div className="form-group">
                        <label>Población</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div className="form-group">
                        <label>Estado</label>
                        <select name="stage" value={formData.stage} onChange={handleChange} style={{ width: '100%', padding: '8px', background: 'var(--panel-bg)', color: 'white' }}>
                            <option value="Presupuesto no enviado">Presupuesto no enviado</option>
                            <option value="Presupuesto enviado">Presupuesto enviado</option>
                            <option value="Vendido">Vendido</option>
                        </select>
                    </div>
                </div>

                {/* Calculadora de Presupuestos (AquaBLOCK) */}
                <BudgetCalculator onSaveBudget={handleAddBudgetFromCalculator} />

                {/* Tabla de Condiciones Particulares */}
                <div style={{ marginTop: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Condiciones Particulares (Oferta)</h3>
                        <button 
                            onClick={() => setItems(prev => [...prev, { id: Date.now(), description: '', medidas_ancho: '', medidas_alto: '', price: 0 }])}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--panel-bg)', padding: '6px 12px', fontSize: '12px' }}
                        >
                            <Plus size={14} /> Añadir Fila Manual
                        </button>
                    </div>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ background: 'var(--panel-bg)', textAlign: 'left' }}>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>Descripción</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)', width: '100px' }}>Ancho (m)</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)', width: '100px' }}>Alto (m)</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)', width: '120px' }}>Precio (€)</th>
                                <th style={{ padding: '10px', borderBottom: '1px solid var(--border-color)', width: '50px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay ítems en la oferta</td>
                                </tr>
                            ) : items.map((item, idx) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '8px' }}>
                                        <input 
                                            type="text" 
                                            value={item.description || ''} 
                                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                                            style={{ width: '100%', padding: '6px', background: 'transparent', border: '1px solid transparent', color: 'white' }} 
                                            placeholder="Descripción del ítem"
                                        />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                        <input 
                                            type="number" step="0.1"
                                            value={item.medidas_ancho || ''} 
                                            onChange={(e) => handleItemChange(idx, 'medidas_ancho', e.target.value)}
                                            style={{ width: '100%', padding: '6px' }} 
                                        />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                        <input 
                                            type="number" step="0.5"
                                            value={item.medidas_alto || ''} 
                                            onChange={(e) => handleItemChange(idx, 'medidas_alto', e.target.value)}
                                            style={{ width: '100%', padding: '6px' }} 
                                        />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                        <input 
                                            type="number" step="0.01"
                                            value={item.price || 0} 
                                            onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                                            style={{ width: '100%', padding: '6px' }} 
                                        />
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                        <button onClick={() => handleRemoveItem(idx)} style={{ background: 'transparent', color: '#ff4c4c', padding: '5px' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '10px 20px', color: 'white' }}>
                        Cancelar
                    </button>
                    <button onClick={handleSave} disabled={isSaving} style={{ background: 'var(--accent-color)', color: 'white', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                        <Save size={18} /> {isSaving ? 'Guardando...' : 'Guardar Cliente'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientDetail;
