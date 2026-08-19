import { useState } from 'react';
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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

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

        // Dùng Web Share API (native trên điện thoại) nếu có hỗ trợ
        try {
          if (navigator.canShare) {
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'bao-cao-chia-tien.png', { type: 'image/png' });
            
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: 'Báo cáo chia tiền',
              });
              return; // Thành công thì kết thúc
            }
          }
        } catch (shareError) {
          console.log("Share API error:", shareError);
        }

        // Fallback: Hiển thị ảnh trên màn hình nếu là thiết bị di động để người dùng tự nhấn giữ lưu
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          setCapturedImage(dataUrl);
        } else {
          // Tải xuống kiểu truyền thống cho máy tính
          const link = document.createElement('a');
          link.download = 'bao-cao-chia-tien.png';
          link.href = dataUrl;
          link.click();
        }
      } catch (error) {
        console.error("Error capturing image:", error);
        alert("Có lỗi xảy ra khi chụp ảnh!");
      }
    }
  };

  return (
    <div className="app-container">
      <header className="flex flex-col items-center justify-center mb-8 gap-4">
        <div className="flex items-center justify-between w-full flex-wrap gap-4 header-top">
          <div className="header-spacer" style={{ flex: 1 }}></div>
          <div className="flex items-center gap-3 justify-center header-title-container" style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem 2rem', borderRadius: '100px', border: '1px solid rgba(59, 130, 246, 0.5)' }}>
            <Coins size={32} className="text-accent" />
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>Ứng Dụng Chia Tiền</h1>
          </div>
          <div className="header-actions" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
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

      {/* Modal hiển thị ảnh cho thiết bị di động (khi Share API không khả dụng) */}
      {capturedImage && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setCapturedImage(null)}
        >
          <p style={{ color: 'white', marginBottom: '1rem', textAlign: 'center', fontSize: '1.1rem' }}>
            Nhấn giữ vào ảnh bên dưới để lưu vào máy<br/>
            <small style={{ color: '#94a3b8' }}>(Chạm ra ngoài để đóng)</small>
          </p>
          <img 
            src={capturedImage} 
            alt="Báo cáo chia tiền" 
            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} 
          />
        </div>
      )}
    </div>
  );
}

export default App;
