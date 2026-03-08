import React from 'react';
import { Folder, MapPin, Phone, Calculator, Calendar } from 'lucide-react';

const ClientCard = ({ client }) => {
    const images = client.images_list ? client.images_list.split(',').map(img => img.trim()).filter(img => img !== '') : [];

    return (
        <div className="client-card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
                <div className="card-title">{client.name}</div>
                <div className="card-info">
                    <div className="info-item">
                        <Calendar size={12} className="info-label" />
                        <span>{client.offer_date || 'Sin fecha'}</span>
                    </div>
                    <div className="info-item">
                        <MapPin size={12} className="info-label" />
                        <span>{client.city || '?'}</span>
                    </div>
                    <div className="info-item">
                        <Calculator size={12} className="info-label" />
                        <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>
                            {client.amount ? `${client.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}` : '0,00 €'}
                        </span>
                    </div>
                    {client.offer_num && (
                        <div className="info-item">
                            <span className="info-label">N°:</span>
                            <span>{client.offer_num}</span>
                        </div>
                    )}
                </div>
            </div>

            {images.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '64px', flexShrink: 0 }}>
                    {images.slice(0, 2).map((img, idx) => (
                        <div key={idx} style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)',
                            background: 'var(--panel-bg)'
                        }}>
                            <img
                                src={`http://localhost:5000/uploads/${encodeURIComponent(img)}`}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                    {images.length > 2 && (
                        <div style={{
                            fontSize: '10px',
                            color: 'var(--text-secondary)',
                            textAlign: 'center',
                            background: 'var(--card-hover)',
                            borderRadius: '4px',
                            padding: '2px'
                        }}>
                            +{images.length - 2} ítem
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClientCard;
