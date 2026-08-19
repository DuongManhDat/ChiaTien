import React from 'react';
import type { Person, Expense } from '../types';
import { PieChart } from 'lucide-react';

interface Props {
  persons: Person[];
  expenses: Expense[];
}

interface BreakdownItem {
  expenseName: string;
  share: number;
}

export const ResultSummary: React.FC<Props> = ({ persons, expenses }) => {
  if (persons.length === 0) return null;

  // Calculate total expense per person and breakdown
  const perPersonExpense: Record<string, number> = {};
  const perPersonBreakdown: Record<string, BreakdownItem[]> = {};

  persons.forEach(p => {
    perPersonExpense[p.id] = 0;
    perPersonBreakdown[p.id] = [];
  });

  expenses.forEach(exp => {
    if (exp.participants.length > 0 && exp.amount > 0) {
      const share = exp.amount / exp.participants.length;
      exp.participants.forEach(pId => {
        if (perPersonExpense[pId] !== undefined) {
          perPersonExpense[pId] += share;
          perPersonBreakdown[pId].push({ expenseName: exp.name, share });
        }
      });
    }
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(val));
  };

  const totalAppExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div id="result-summary-capture" className="glass-panel mt-4 mb-6">
      <h2 className="flex items-center gap-2 mb-4"><PieChart size={24} className="text-accent" /> Kết quả thanh toán</h2>
      
      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <strong>Tổng chi phí cả nhóm: </strong> <span className="text-accent text-xl">{formatCurrency(totalAppExpense)}</span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Người tham gia</th>
              <th>Phần phải chịu</th>
              <th className="text-right">Đã ứng trước</th>
              <th className="text-right">Số dư (Cần trả / Nhận lại)</th>
            </tr>
          </thead>
          <tbody>
            {persons.map(p => {
              const cost = perPersonExpense[p.id] || 0;
              const paid = p.amountPaid || 0;
              const balance = paid - cost;
              
              let balanceText = '';
              let balanceClass = '';
              
              if (balance > 0) {
                balanceText = `Nhận lại ${formatCurrency(balance)}`;
                balanceClass = 'text-success';
              } else if (balance < 0) {
                balanceText = `Cần đóng thêm ${formatCurrency(Math.abs(balance))}`;
                balanceClass = 'text-danger';
              } else {
                balanceText = 'Đã thanh toán đủ';
                balanceClass = 'text-secondary';
              }

              return (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, verticalAlign: 'top' }}>{p.name}</td>
                  <td style={{ verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 600 }}>{formatCurrency(cost)}</div>
                    {perPersonBreakdown[p.id].length > 0 && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {perPersonBreakdown[p.id].map((b, idx) => (
                          <div key={idx} className="flex justify-between gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem' }}>
                            <span>- {b.expenseName}</span>
                            <span>{formatCurrency(b.share)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="text-right" style={{ verticalAlign: 'top', paddingTop: '1.25rem' }}>{formatCurrency(paid)}</td>
                  <td className={`text-right font-bold ${balanceClass}`} style={{ fontWeight: 600, verticalAlign: 'top', paddingTop: '1.25rem' }}>
                    {balanceText}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
