export interface Person {
  id: string;
  name: string;
  amountPaid: number;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  participants: string[];
}
