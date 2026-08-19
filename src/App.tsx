import React, { useState } from 'react';
import './App.css';
import type { Person, Expense } from './types';
import { SetupSection } from './components/SetupSection';
import { SplitTable } from './components/SplitTable';
import { AdvancePayment } from './components/AdvancePayment';
import { ResultSummary } from './components/ResultSummary';
import { Coins, Camera } from 'lucide-react';
import { toPng } from 'html-to-image';

function App() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleAddPerson = (name: string) => {
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name,
      amountPaid: 0,
    };
    setPersons([...persons, newPerson]);
    // Auto add new person to all expenses participants
    setExpenses(expenses.map(exp => ({
      ...exp,
      participants: [...exp.participants, newPerson.id]
    })));
  };

  const handleRemovePerson = (id: string) => {
    setPersons(persons.filter(p => p.id !== id));
    setExpenses(expenses.map(exp => ({
      ...exp,
      participants: exp.participants.filter(pId => pId !== id)
    })));
  };

  const handleAddExpense = (name: string) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      name,
      amount: 0,
      participants: persons.map(p => p.id), // By default, everyone participates
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleUpdateExpenseAmount = (id: string, amount: number) => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, amount } : exp));
  };

  const handleToggleParticipant = (expenseId: string, personId: string) => {
    setExpenses(expenses.map(exp => {
      if (exp.id === expenseId) {
        const hasParticipant = exp.participants.includes(personId);
        return {
          ...exp,
          participants: hasParticipant 
            ? exp.participants.filter(p => p !== personId)
            : [...exp.participants, personId]
        };
      }
      return exp;
    }));
  };

  const handleToggleAll = (expenseId: string, isAllChecked: boolean) => {
    setExpenses(expenses.map(exp => {
      if (exp.id === expenseId) {
        return {
          ...exp,
          participants: isAllChecked ? persons.map(p => p.id) : []
        };
      }
      return exp;
    }));
  };

  const handleUpdateAdvancePayment = (personId: string, amount: number) => {
    setPersons(persons.map(p => p.id === personId ? { ...p, amountPaid: amount } : p));
  };

  const handleCapture = async () => {
    const element = document.getElementById('result-summary-capture');
    if (element) {
      try {
        // Loại bỏ thanh cuộn tạm thời trước khi chụp để lấy toàn bộ nội dung
        const containers = element.getElementsByClassName('table-container');
        for (let i = 0; i < containers.length; i++) {
          (containers[i] as HTMLElement).style.overflow = 'visible';
        }

        const dataUrl = await toPng(element, { 
          backgroundColor: '#0f172a',
          pixelRatio: 2 // Higher resolution
        });

        // Khôi phục lại thanh cuộn
        for (let i = 0; i < containers.length; i++) {
          (containers[i] as HTMLElement).style.overflow = '';
        }

        const link = document.createElement('a');
        link.download = 'bao-cao-chia-tien.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error capturing image:", error);
        alert("Có lỗi xảy ra khi chụp ảnh!");
      }
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header className="flex flex-col items-center justify-center mb-8 gap-4">
        <div className="flex items-center justify-between w-full flex-wrap gap-4">
          <div style={{ flex: 1 }}></div>
          <div className="flex items-center gap-3 justify-center" style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem 2rem', borderRadius: '100px', border: '1px solid rgba(59, 130, 246, 0.5)' }}>
            <Coins size={32} className="text-accent" />
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>Ứng Dụng Chia Tiền</h1>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleCapture} style={{ background: 'var(--success-color)' }}>
              <Camera size={20} /> Lưu Ảnh Báo Cáo
            </button>
          </div>
        </div>
        <p className="text-secondary text-center max-w-2xl mt-2">
          Nhập danh sách người tham gia, các khoản chi, đánh dấu ai trả khoản nào và xem kết quả tính toán tức thì.
        </p>
      </header>

      <div style={{ padding: '1rem', margin: '-1rem', borderRadius: '16px' }}>
        <SetupSection 
          persons={persons} 
          expenses={expenses} 
          onAddPerson={handleAddPerson}
          onRemovePerson={handleRemovePerson}
          onAddExpense={handleAddExpense}
          onRemoveExpense={handleRemoveExpense}
        />

        <SplitTable 
          persons={persons}
          expenses={expenses}
          onUpdateExpenseAmount={handleUpdateExpenseAmount}
          onToggleParticipant={handleToggleParticipant}
          onToggleAll={handleToggleAll}
        />

        <AdvancePayment 
          persons={persons}
          onUpdateAdvancePayment={handleUpdateAdvancePayment}
        />

        <ResultSummary 
          persons={persons}
          expenses={expenses}
        />
      </div>
    </div>
  );
}

export default App;
