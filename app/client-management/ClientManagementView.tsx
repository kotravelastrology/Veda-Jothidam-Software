'use client';

import { useState } from 'react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: string;
  createdAt: string;
  lastConsultation: string;
  charts: number;
  notes: string;
}

export default function ClientManagementView() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      birthDate: '1990-05-15',
      birthTime: '10:30:00',
      birthPlace: 'Chennai, India',
      gender: 'Male',
      createdAt: '2024-01-15',
      lastConsultation: '2024-09-10',
      charts: 3,
      notes: 'Career consultation completed. Follow-up on dasha changes.',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'Male' | 'Female' | 'Other'>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt'>>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: '',
    lastConsultation: new Date().toISOString().split('T')[0],
    charts: 0,
    notes: '',
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesGender = filterGender === 'all' || client.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  const handleAddClient = () => {
    if (formData.name && formData.email) {
      const newClient: Client = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setClients([...clients, newClient]);
      setFormData({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        gender: '',
        lastConsultation: new Date().toISOString().split('T')[0],
        charts: 0,
        notes: '',
      });
      setShowForm(false);
    }
  };

  const handleUpdateClient = () => {
    if (selectedClient && formData.name) {
      setClients(
        clients.map(c =>
          c.id === selectedClient.id
            ? { ...c, ...formData }
            : c
        )
      );
      setSelectedClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        gender: '',
        lastConsultation: new Date().toISOString().split('T')[0],
        charts: 0,
        notes: '',
      });
    }
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
          Client Management
        </p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          வாடிக்கையாளர் நிர்வாகம் (Client Management)
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          வாடிக்கையாளர் தகவல் மற்றும் ஆலோசனை வரலாறு நிர்வாகம். Manage client information and consultation history.
        </p>
      </header>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-info/10 border border-info rounded-lg p-4">
          <p className="text-xs font-semibold text-info uppercase mb-1">Total Clients</p>
          <p className="text-3xl font-bold text-info">{clients.length}</p>
        </div>
        <div className="bg-green/10 border border-green rounded-lg p-4">
          <p className="text-xs font-semibold text-green uppercase mb-1">Active This Month</p>
          <p className="text-3xl font-bold text-green">
            {clients.filter(c => {
              const lastDate = new Date(c.lastConsultation);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return lastDate > thirtyDaysAgo;
            }).length}
          </p>
        </div>
        <div className="bg-saffron/10 border border-saffron rounded-lg p-4">
          <p className="text-xs font-semibold text-saffron uppercase mb-1">Total Charts</p>
          <p className="text-3xl font-bold text-saffron">
            {clients.reduce((sum, c) => sum + c.charts, 0)}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search clients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-ink-soft/10 border border-line rounded-lg"
          />
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value as any)}
            className="px-4 py-2 bg-ink-soft/10 border border-line rounded-lg"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setSelectedClient(null);
            }}
            className="px-4 py-2 bg-saffron text-ink rounded-lg font-medium hover:bg-saffron/90"
          >
            {showForm ? '✕ Cancel' : '+ Add Client'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showForm || selectedClient) && (
          <div className="bg-info/5 border border-info/20 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-ink mb-4">{selectedClient ? 'Edit Client' : 'Add New Client'}</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <label>
                <span className="block text-xs font-medium text-ink-soft mb-1">Name *</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-ink-soft mb-1">Email *</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-ink-soft mb-1">Phone</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-ink-soft mb-1">Gender</span>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                <span className="block text-xs font-medium text-ink-soft mb-1">Birth Date</span>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                />
              </label>
              <label>
                <span className="block text-xs font-medium text-ink-soft mb-1">Birth Time</span>
                <input
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="block text-xs font-medium text-ink-soft mb-1">Birth Place</span>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="block text-xs font-medium text-ink-soft mb-1">Notes</span>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectedClient ? handleUpdateClient : handleAddClient}
                className="px-4 py-2 bg-green text-white rounded font-medium text-sm hover:bg-green/90"
              >
                {selectedClient ? '✓ Update' : '+ Add'} Client
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedClient(null);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    birthDate: '',
                    birthTime: '',
                    birthPlace: '',
                    gender: '',
                    lastConsultation: new Date().toISOString().split('T')[0],
                    charts: 0,
                    notes: '',
                  });
                }}
                className="px-4 py-2 bg-line/20 text-ink rounded font-medium text-sm hover:bg-line/30"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Clients List */}
      <div className="space-y-3">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-surface border border-line rounded-lg p-4 hover:border-saffron/50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-ink text-lg">{client.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-ink-soft">
                    <span>📧 {client.email}</span>
                    <span>📞 {client.phone}</span>
                    <span>📅 {client.birthDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs">
                    <span className="px-2 py-1 bg-info/10 text-info rounded">
                      📍 {client.birthPlace}
                    </span>
                    <span className="px-2 py-1 bg-green/10 text-green rounded">
                      📊 {client.charts} charts
                    </span>
                    <span className="px-2 py-1 bg-orange/10 text-orange rounded">
                      🕐 Last: {client.lastConsultation}
                    </span>
                  </div>
                  {client.notes && (
                    <p className="text-sm text-ink-soft mt-2 italic">"{client.notes}"</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setFormData({
                        name: client.name,
                        email: client.email,
                        phone: client.phone,
                        birthDate: client.birthDate,
                        birthTime: client.birthTime,
                        birthPlace: client.birthPlace,
                        gender: client.gender,
                        lastConsultation: client.lastConsultation,
                        charts: client.charts,
                        notes: client.notes,
                      });
                      setShowForm(false);
                    }}
                    className="px-3 py-2 bg-info/10 text-info rounded font-medium text-sm hover:bg-info/20 transition"
                  >
                    ✎ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="px-3 py-2 bg-rose/10 text-rose rounded font-medium text-sm hover:bg-rose/20 transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-ink-soft">
            <p className="text-sm">No clients found. Add a new client to get started.</p>
          </div>
        )}
      </div>

      <footer className="mt-12 pt-6 border-t border-line text-xs text-ink-soft text-center">
        <p>
          வாடிக்கையாளர் நிர்வாகம் — ஆலோசனை வரலாறு மற்றும் ஜாதக பதிவு வைக்கவும்.
          Professional client management system for astrology practice.
        </p>
      </footer>
    </main>
  );
}
