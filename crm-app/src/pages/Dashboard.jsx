import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Search, Plus, LogOut, User, Folder, Phone, Mail, MapPin, Calculator } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import ClientCard from '../components/ClientCard';
import ClientDetail from '../components/ClientDetail';
import BillingStats from '../components/BillingStats';

const STAGES = ["Presupuesto no enviado", "Presupuesto enviado", "Vendido"];

const Dashboard = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const { data } = await api.get(`/clients?t=${Date.now()}`);
            setClients(data);
        } catch (err) {
            console.error('Error fetching clients', err);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStage = destination.droppableId;
        const clientId = parseInt(draggableId);

        // Optimistic update
        const updatedClients = clients.map(c => c.id === clientId ? { ...c, stage: newStage } : c);
        setClients(updatedClients);

        try {
            await api.patch(`/clients/${clientId}/stage`, { stage: newStage });
        } catch (err) {
            console.error('Error updating stage', err);
            fetchClients(); // Rollback on error
        }
    };

    const filteredClients = clients.filter(c => {
        const s = searchTerm.toLowerCase();
        const nameMatch = c.name ? c.name.toLowerCase().includes(s) : false;
        const cityMatch = c.city ? c.city.toLowerCase().includes(s) : false;
        const offerMatch = c.offer_num ? c.offer_num.toLowerCase().includes(s) : false;
        const emailMatch = c.email ? c.email.toLowerCase().includes(s) : false;
        const dniMatch = c.dni ? c.dni.toLowerCase().includes(s) : false;
        const phoneMatch = c.phone ? c.phone.toLowerCase().includes(s) : false;
        
        return nameMatch || cityMatch || offerMatch || emailMatch || dniMatch || phoneMatch;
    });

    const clientsByStage = (stage) => filteredClients.filter(c => c.stage === stage);

    const handleAddClient = (initialData = {}) => {
        setSelectedClient(initialData);
        setIsModalOpen(true);
    };

    const handleEditClient = (client) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="app-header">
                <div className="header-left">
                    <div className="logo">
                        <img src="/logo.png" alt="AquaBLOCK" style={{ height: '50px', objectFit: 'contain' }} />
                    </div>
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar clientes, población o N° oferta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={handleAddClient}
                        style={{
                            background: 'var(--success-color)',
                            color: 'white',
                            padding: '8px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: '600'
                        }}
                    >
                        <Plus size={18} /> Nuevo Cliente
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                        <User size={18} />
                        <span style={{ fontSize: '14px' }}>{user?.username}</span>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                        title="Cerrar sesión"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <main className="kanban-container">
                <DragDropContext onDragEnd={onDragEnd}>
                    {STAGES.map(stage => (
                        <div key={stage} className="kanban-column">
                            <div className="column-header">
                                <div className="column-title">
                                    {stage}
                                </div>
                                <div className="column-count">{clientsByStage(stage).length}</div>
                            </div>

                            <Droppable droppableId={stage}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="cards-container"
                                        style={{ background: snapshot.isDraggingOver ? 'rgba(88, 166, 255, 0.05)' : 'transparent', borderRadius: '4px' }}
                                    >
                                        <button
                                            onClick={() => handleAddClient({ stage })}
                                            style={{
                                                width: '100%',
                                                background: 'transparent',
                                                border: '1px dashed var(--border-color)',
                                                color: 'var(--text-secondary)',
                                                padding: '10px',
                                                marginBottom: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontSize: '13px'
                                            }}
                                        >
                                            <Plus size={16} /> Crear nuevo...
                                        </button>
                                        {clientsByStage(stage).map((client, index) => (
                                            <Draggable key={client.id.toString()} draggableId={client.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => handleEditClient(client)}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            opacity: snapshot.isDragging ? 0.8 : 1
                                                        }}
                                                    >
                                                        <ClientCard client={client} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </DragDropContext>
            </main>

            <div style={{ padding: '0 40px 40px 40px' }}>
                <BillingStats data={[
                    { label: 'Presupuesto no enviado', value: (clientsByStage('Presupuesto no enviado') || []).reduce((sum, c) => sum + (c.amount || 0), 0), color: '#8b949e' },
                    { label: 'Presupuesto enviado', value: (clientsByStage('Presupuesto enviado') || []).reduce((sum, c) => sum + (c.amount || 0), 0), color: '#58a6ff' },
                    { label: 'Vendido', value: (clientsByStage('Vendido') || []).reduce((sum, c) => sum + (c.amount || 0), 0), color: '#238636' }
                ]} />
            </div>

            {isModalOpen && (
                <ClientDetail
                    client={selectedClient}
                    onClose={() => setIsModalOpen(false)}
                    onSave={() => { fetchClients(); setIsModalOpen(false); }}
                    onRefresh={fetchClients}
                />
            )}
        </div>
    );
};

export default Dashboard;
