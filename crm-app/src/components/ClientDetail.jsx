import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Upload, Plus, FileText, Camera } from 'lucide-react';
import api from '../api/api';
import axios from 'axios';

const ClientDetail = ({ client, onClose, onSave, onRefresh }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        zip: '',
        phone: '',
        email: '',
        offer_num: '',
        offer_date: '',
        amount: 0,
        ordered: false,
        man_num: '',
        order_date: '',
        stage: 'Sin presupuesto'
    });

    const [items, setItems] = useState([{ description: '', price: '' }]);
    const [images, setImages] = useState([]);
    const [pendingFiles, setPendingFiles] = useState([]);
    const [pendingPreviews, setPendingPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (client) {
            setFormData(prev => ({
                ...prev,
                ...client,
                ordered: !!client.ordered
            }));
            if (client.id) {
                fetchImages(client.id);
                fetchItems(client.id);
            }
        }
    }, [client]);

    const fetchItems = async (clientId) => {
        try {
            const { data } = await api.get(`/clients/${clientId}/items`);
            if (data.length > 0) {
                setItems(data);
                // Sync amount with items
                const total = data.reduce((sum, item) => sum + (parseFloat(item.price) * 1.21 || 0), 0);
                setFormData(prev => ({ ...prev, amount: total }));
            } else {
                setItems([{ description: '', price: '' }]);
            }
        } catch (err) {
            console.error('Error fetching items', err);
        }
    };

    const fetchImages = async (clientId) => {
        try {
            const { data } = await api.get(`/images/${clientId}`);
            setImages(data);
        } catch (err) {
            console.error('Error fetching images', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleItemChange = (index, field, value) => {
        const cleanValue = typeof value === 'string' ? value.replace(',', '.') : value;
        const numValue = cleanValue === '' ? '' : parseFloat(cleanValue) || 0;

        const newItems = items.map((item, i) => {
            if (i === index) {
                if (field === 'rowTotal') {
                    // Back-calculate price from total: price = total / 1.21
                    const newPrice = numValue === '' ? '' : numValue / 1.21;
                    return { ...item, price: newPrice, rowTotal: value };
                }
                return { ...item, [field]: field === 'price' ? numValue : value, priceStr: field === 'price' ? value : item.priceStr };
            }
            return item;
        });

        setItems(newItems);

        // Update total amount automatically
        const total = newItems.reduce((sum, item) => {
            const itemPrice = parseFloat(item.price) || 0;
            return sum + (itemPrice * 1.21);
        }, 0);
        setFormData(prev => ({ ...prev, amount: total }));
    };

    const addItem = () => {
        setItems([...items, { description: '', price: '' }]);
    };

    const removeItem = (index) => {
        if (items.length <= 1) return;
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);

        const total = newItems.reduce((sum, item) => sum + ((parseFloat(item.price) || 0) * 1.21), 0);
        setFormData(prev => ({ ...prev, amount: total }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const parsedItems = items.map(it => ({ ...it, price: parseFloat(it.price) || 0 }));
            const payload = { ...formData, items: parsedItems };
            let savedClientId = null;

            if (client && client.id) {
                await api.put(`/clients/${client.id}`, payload);
                savedClientId = client.id;
            } else {
                const res = await api.post('/clients', payload);
                savedClientId = res.data.id;
            }

            // Subir imágenes pendientes si hay
            if (pendingFiles.length > 0 && savedClientId) {
                const fd = new FormData();
                for (let i = 0; i < pendingFiles.length; i++) {
                    fd.append('photos', pendingFiles[i]);
                }
                await api.post(`/images/${savedClientId}`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            onSave();
        } catch (err) {
            console.error('Error saving client', err);
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (client && client.id) {
            const fd = new FormData();
            for (let i = 0; i < files.length; i++) {
                fd.append('photos', files[i]);
            }

            setUploading(true);
            try {
                await api.post(`/images/${client.id}`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                fetchImages(client.id);
                if (onRefresh) onRefresh();
            } catch (err) {
                console.error('Error uploading images', err);
            } finally {
                setUploading(false);
            }
        } else {
            // Cliente nuevo, guardar en previsualización
            setPendingFiles(prev => [...prev, ...files]);
            const previews = files.map(file => ({
                id: Math.random().toString(),
                isPending: true,
                file: file,
                url: URL.createObjectURL(file)
            }));
            setPendingPreviews(prev => [...prev, ...previews]);
        }
    };

    const handleDeleteImage = async (image, isPending = false) => {
        if (!window.confirm('¿Eliminar esta imagen?')) return;
        if (isPending) {
            setPendingFiles(prev => prev.filter(f => f !== image.file));
            setPendingPreviews(prev => prev.filter(p => p.id !== image.id));
        } else {
            try {
                await api.delete(`/images/${image.id}`);
                setImages(images.filter(img => img.id !== image.id));
                if (onRefresh) onRefresh();
            } catch (err) {
                console.error('Error deleting image', err);
            }
        }
    };

    const handleDeleteClient = async () => {
        if (!client) return;
        if (!window.confirm(`¿Seguro que desea eliminar a "${client.name}"?`)) return;
        try {
            await api.delete(`/clients/${client.id}`);
            onSave();
        } catch (err) {
            console.error('Error deleting client', err);
        }
    };

    const handleGenerateOffer = async () => {
        try {
            const webhookUrl = 'https://n-n8n.ywrumf.easypanel.host/webhook/4c9f6f95-101e-48eb-8197-09cc14d6eeff';

            // Format data for the GET request
            const params = {
                nombre: formData.name,
                telefono: formData.phone,
                email: formData.email,
                direccion: formData.address,
                poblacion: formData.city,
                cp: formData.zip,
                num_oferta: formData.offer_num,
                fecha_oferta: formData.offer_date,
                importe_total: formData.amount,
                items: JSON.stringify(items.map(item => ({
                    descripcion: item.description,
                    precio: parseFloat(item.price) || 0,
                    total: ((parseFloat(item.price) || 0) * 1.21).toFixed(2)
                })))
            };

            await axios.get(webhookUrl, { params });
            alert('Oferta enviada correctamente');
        } catch (err) {
            console.error('Error sending offer to webhook', err);
            alert('Error al enviar la oferta');
        }
    };

    const allImages = [
        ...images.map(img => ({
            ...img,
            url: `https://zihdvtkxlufsnzteuhhi.supabase.co/storage/v1/object/public/images/${encodeURIComponent(img.filename)}`,
            isPending: false
        })),
        ...pendingPreviews
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content glass">
                <header className="modal-header">
                    <h2 style={{ fontSize: '18px' }}>{client && client.id ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                        <X size={24} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nombre del cliente</label>
                            <input name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Dirección</label>
                            <input name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Población</label>
                            <input name="city" value={formData.city} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Código Postal</label>
                            <input name="zip" value={formData.zip} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Número de Oferta</label>
                            <input name="offer_num" value={formData.offer_num} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Fecha de Oferta</label>
                            <input name="offer_date" type="date" value={formData.offer_date} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Importe Total (€)</label>
                            <input
                                name="amount"
                                type="text"
                                value={formData.displayAmount !== undefined ? formData.displayAmount : (formData.amount || 0).toString().replace('.', ',')}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9.,]/g, '');
                                    const cleanVal = val.replace(',', '.');
                                    setFormData(prev => ({ ...prev, amount: parseFloat(cleanVal) || 0, displayAmount: val }));
                                }}
                                style={{ background: 'var(--panel-bg)', fontWeight: 'bold', color: 'var(--accent-color)' }}
                                placeholder="0,00"
                            />
                        </div>
                        <div className="form-group">
                            <label>Pedido</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%' }}>
                                <input type="checkbox" name="ordered" checked={formData.ordered} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                                <span style={{ fontSize: '14px' }}>Sí</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Número de fabricación</label>
                            <input name="man_num" value={formData.man_num} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Fecha de pedido</label>
                            <input name="order_date" type="date" value={formData.order_date} onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Condiciones Particulares de la oferta</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ background: '#d71920', color: 'white' }}>
                                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #c9d1d9' }}>Descripción</th>
                                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #c9d1d9', width: '120px' }}>Precio</th>
                                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #c9d1d9', width: '120px' }}>21% IVA</th>
                                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #c9d1d9', width: '150px' }}>Total</th>
                                        <th style={{ width: '40px', border: 'none', background: 'transparent' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td style={{ border: '1px solid var(--border-color)', padding: '0' }}>
                                                <input
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '8px', color: 'var(--text-primary)' }}
                                                    placeholder="Descripción del producto..."
                                                />
                                            </td>
                                            <td style={{ border: '1px solid var(--border-color)', padding: '0' }}>
                                                <input
                                                    type="text"
                                                    value={item.priceStr !== undefined ? item.priceStr : (item.price === '' ? '' : (item.price || 0).toString().replace('.', ','))}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/[^0-9.,]/g, '');
                                                        handleItemChange(idx, 'price', val);
                                                    }}
                                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '8px', textAlign: 'right', color: 'var(--text-primary)' }}
                                                    placeholder=""
                                                />
                                            </td>
                                            <td style={{ border: '1px solid var(--border-color)', padding: '8px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                                {((parseFloat(item.price) || 0) * 0.21).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                            </td>
                                            <td style={{ border: '1px solid var(--border-color)', padding: '0' }}>
                                                <input
                                                    type="text"
                                                    value={item.rowTotal !== undefined ? item.rowTotal : item.price === '' ? '' : ((parseFloat(item.price) || 0) * 1.21).toFixed(2).replace('.', ',')}
                                                    onChange={(e) => handleItemChange(idx, 'rowTotal', e.target.value)}
                                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '8px', textAlign: 'right', fontWeight: '600', color: 'var(--text-primary)' }}
                                                    placeholder=""
                                                />
                                            </td>
                                            <td style={{ padding: '4px', textAlign: 'center' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(idx)}
                                                    style={{ background: 'transparent', color: 'var(--error-color)', padding: '4px' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                type="button"
                                onClick={addItem}
                                style={{
                                    marginTop: '12px',
                                    background: 'transparent',
                                    color: 'var(--accent-color)',
                                    border: '1px dashed var(--accent-color)',
                                    width: '100%',
                                    padding: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Plus size={16} /> Añadir fila
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Imágenes de la instalación
                            {uploading && <span style={{ fontSize: '12px', color: 'var(--accent-color)' }}>Subiendo...</span>}
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                            {allImages.map(img => (
                                <div key={img.id} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                                    <img
                                        src={img.url}
                                        alt="Instalación"
                                        onClick={() => setSelectedImage(img.url)}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteImage(img, img.isPending); }}
                                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px', borderRadius: '4px' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}

                            <label style={{
                                aspectRatio: '1/1',
                                border: '2px dashed var(--border-color)',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)',
                                gap: '8px'
                            }}>
                                <Plus size={24} />
                                <span style={{ fontSize: '12px', textAlign: 'center' }}>Subir fotos</span>
                                <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                            </label>

                            <label style={{
                                aspectRatio: '1/1',
                                border: '2px dashed var(--border-color)',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)',
                                gap: '8px'
                            }}>
                                <Camera size={24} />
                                <span style={{ fontSize: '12px', textAlign: 'center' }}>Hacer foto</span>
                                <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>
                </form>

                <footer className="modal-footer">
                    {client && client.id && (
                        <button
                            type="button"
                            onClick={handleDeleteClient}
                            style={{ background: 'transparent', color: 'var(--error-color)', marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <Trash2 size={18} /> Eliminar Cliente
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleGenerateOffer}
                        style={{ background: 'var(--success-color)', color: 'white', padding: '8px 16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}
                    >
                        <FileText size={18} /> Generar Oferta
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', padding: '8px 16px' }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        style={{ background: 'var(--accent-color)', color: 'white', padding: '8px 24px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Save size={18} /> {client && client.id ? 'Guardar Cambios' : 'Crear Cliente'}
                    </button>
                </footer>
            </div>

            {selectedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.9)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px'
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', color: 'white' }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Enlarged"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
                    />
                </div>
            )}
        </div>
    );
};

export default ClientDetail;
