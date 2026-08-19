import React from 'react';
import type { Person, Expense } from '../types';
import { CurrencyInput } from './CurrencyInput';
import { Calculator } from 'lucide-react';

interface Props {
  persons: Person[];
  expenses: Expense[];
  onUpdateExpenseAmount: (id: string, amount: number) => void;
  onToggleParticipant: (expenseId: string, personId: string) => void;
  onToggleAll: (expenseId: string, isAllChecked: boolean) => void;
}

export const SplitTable: React.FC<Props> = ({
  persons,
  expenses,
  onUpdateExpenseAmount,
  onToggleParticipant,
  onToggleAll
}) => {
  if (persons.length === 0 || expenses.length === 0) return null;

  return (
    <div className="glass-panel mt-4">
      <h2 className="flex items-center gap-2 mb-4"><Calculator size={24} className="text-accent" /> Ma Trận Chia Tiền</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Khoản chi</th>
              <th>Tổng tiền (VNĐ)</th>
              {persons.map(p => (
                <th key={p.id} className="text-center">{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => {
              const allChecked = persons.every(p => exp.participants.includes(p.id));
              
              return (
                <tr key={exp.id}>
                  <td style={{ fontWeight: 500 }}>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={allChecked} 
                        onChange={(e) => onToggleAll(exp.id, e.target.checked)} 
                        title="Chọn/Bỏ chọn tất cả"
                      />
                      {exp.name}
                    </div>
                  </td>
                  <td style={{ width: '200px' }}>
                    <CurrencyInput
                      value={exp.amount || 0}
                      onChange={(val) => onUpdateExpenseAmount(exp.id, val)}
                      placeholder="0"
                      style={{ padding: '0.5rem', width: '100%' }}
                    />
                  </td>
                  {persons.map(p => {
                    const isParticipating = exp.participants.includes(p.id);
                    return (
                      <td key={p.id} className="text-center">
                        <input
                          type="checkbox"
                          checked={isParticipating}
                          onChange={() => onToggleParticipant(exp.id, p.id)}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
