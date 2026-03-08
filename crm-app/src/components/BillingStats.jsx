import React from 'react';

const BillingStats = ({ data }) => {
    const totalPossible = data.reduce((sum, item) => sum + item.value, 0);

    // SVG Pie Chart helper
    let cumulativePercent = 0;

    function getCoordinatesForPercent(percent) {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    }

    const slices = data.map(slice => {
        if (totalPossible === 0) return null;
        const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
        const percent = slice.value / totalPossible;
        cumulativePercent += percent;
        const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
        const largeArcFlag = percent > 0.5 ? 1 : 0;

        const pathData = [
            `M ${startX} ${startY}`,
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            `L 0 0`,
        ].join(' ');

        return { pathData, color: slice.color, percent: (percent * 100).toFixed(1) };
    }).filter(s => s !== null);

    return (
        <div style={{
            marginTop: '20px',
            padding: '40px',
            background: 'var(--panel-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }} className="glass">
            <h3 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: 'var(--text-primary)', textAlign: 'center' }}>
                Dashboard de Facturación
            </h3>

            <div style={{ display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                {totalPossible > 0 ? (
                    <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                        <svg viewBox="-1 -1 2 2" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
                            {slices.map((slice, i) => (
                                <path
                                    key={i}
                                    d={slice.pathData}
                                    fill={slice.color}
                                    style={{ transition: 'all 0.3s ease' }}
                                />
                            ))}
                        </svg>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100px',
                            height: '100px',
                            background: 'var(--panel-bg)',
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '600' }}>TOTAL</span>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                {totalPossible >= 1000 ? `${(totalPossible / 1000).toFixed(1)}k` : totalPossible.toFixed(0)}€
                            </span>
                        </div>
                    </div>
                ) : (
                    <div style={{ width: '220px', height: '220px', borderRadius: '50%', background: 'var(--panel-bg)', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Sin registros
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}>
                    {data.map((item, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            border: `1px solid ${item.color}33`
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: item.color, boxShadow: `0 0 8px ${item.color}66` }} />
                                <span style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '500' }}>{item.label}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                                    {item.value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                </div>
                                {totalPossible > 0 && (
                                    <div style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: '600' }}>
                                        {((item.value / totalPossible) * 100).toFixed(1)}%
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <div style={{
                        marginTop: '12px',
                        padding: '20px',
                        background: 'var(--accent-color)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 4px 12px rgba(255, 0, 0, 0.3)'
                    }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.8)', letterSpacing: '1px' }}>TOTAL FACTURACIÓN POSIBLE</span>
                        <span style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>
                            {totalPossible.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingStats;
