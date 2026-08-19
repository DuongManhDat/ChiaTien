import React from 'react';
import type { Person } from '../types';
import { CurrencyInput } from './CurrencyInput';
import { Wallet } from 'lucide-react';

interface Props {
  persons: Person[];
  onUpdateAdvancePayment: (id: string, amount: number) => void;
}

export const AdvancePayment: React.FC<Props> = ({ persons, onUpdateAdvancePayment }) => {
  if (persons.length === 0) return null;

  return (
    <div className="glass-panel mt-4">
      <h2 className="flex items-center gap-2 mb-4"><Wallet size={24} className="text-accent" /> Số tiền đã ứng trước</h2>
      <p className="text-secondary mb-4">Nhập số tiền mà mỗi người đã bỏ ra trả trước cho cả nhóm (nếu có).</p>
      
      <div className="table-container" style={{ maxWidth: '600px' }}>
        <table>
          <thead>
            <tr>
              <th>Người tham gia</th>
              <th>Số tiền đã trả (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {persons.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td>
                  <CurrencyInput
                    value={p.amountPaid || 0}
                    onChange={(val) => onUpdateAdvancePayment(p.id, val)}
                    placeholder="0"
                    style={{ padding: '0.5rem', width: '100%' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
