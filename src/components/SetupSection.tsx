import React, { useState } from 'react';
import type { Person, Expense } from '../types';
import { Plus, Trash2, Users, Receipt } from 'lucide-react';

interface Props {
  persons: Person[];
  expenses: Expense[];
  onAddPerson: (name: string) => void;
  onRemovePerson: (id: string) => void;
  onAddExpense: (name: string) => void;
  onRemoveExpense: (id: string) => void;
}

export const SetupSection: React.FC<Props> = ({
  persons,
  expenses,
  onAddPerson,
  onRemovePerson,
  onAddExpense,
  onRemoveExpense,
}) => {
  const [newPersonName, setNewPersonName] = useState('');
  const [newExpenseName, setNewExpenseName] = useState('');

  const handleAddPerson = () => {
    const name = newPersonName.trim();
    if (name) {
      if (persons.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        alert('⚠️ Tên người này đã tồn tại! Vui lòng chọn tên khác hoặc thêm số phía sau (VD: Hải 1, Hải 2).');
        return;
      }
      onAddPerson(name);
      setNewPersonName('');
    }
  };

  const handleAddExpense = () => {
    const name = newExpenseName.trim();
    if (name) {
      if (expenses.some(e => e.name.toLowerCase() === name.toLowerCase())) {
        alert('⚠️ Khoản chi này đã tồn tại! Vui lòng đặt tên khác.');
        return;
      }
      onAddExpense(name);
      setNewExpenseName('');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {/* People Setup */}
      <div className="glass-panel" style={{ flex: 1, minWidth: '300px' }}>
        <h2 className="flex items-center gap-2">
          <Users size={24} className="text-accent" /> 
          Người tham gia {persons.length > 0 && <span className="text-secondary" style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>({persons.length})</span>}
        </h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Tên người tham gia..."
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPerson()}
          />
          <button onClick={handleAddPerson}><Plus size={20} /> Thêm</button>
        </div>
        <div className="flex flex-col gap-2">
          {persons.map((p) => (
            <div key={p.id} className="flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
              <span>{p.name}</span>
              <button className="icon-btn danger" onClick={() => onRemovePerson(p.id)}><Trash2 size={18} /></button>
            </div>
          ))}
          {persons.length === 0 && <p className="text-secondary text-center mt-4">Chưa có ai tham gia.</p>}
        </div>
      </div>

      {/* Expenses Setup */}
      <div className="glass-panel" style={{ flex: 1, minWidth: '300px' }}>
        <h2 className="flex items-center gap-2">
          <Receipt size={24} className="text-accent" /> 
          Các khoản chi {expenses.length > 0 && <span className="text-secondary" style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>({expenses.length})</span>}
        </h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Tên khoản chi (vd: Ăn trưa)..."
            value={newExpenseName}
            onChange={(e) => setNewExpenseName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddExpense()}
          />
          <button onClick={handleAddExpense}><Plus size={20} /> Thêm</button>
        </div>
        <div className="flex flex-col gap-2">
          {expenses.map((e) => (
            <div key={e.id} className="flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
              <span>{e.name}</span>
              <button className="icon-btn danger" onClick={() => onRemoveExpense(e.id)}><Trash2 size={18} /></button>
            </div>
          ))}
          {expenses.length === 0 && <p className="text-secondary text-center mt-4">Chưa có khoản chi nào.</p>}
        </div>
      </div>
    </div>
  );
};
