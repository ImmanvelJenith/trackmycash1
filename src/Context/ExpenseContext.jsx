import { createContext, useContext } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

const getToken = () => localStorage.getItem('token');

export const API_BASE = 'https://express-application-b92j.onrender.com';
const EXPENSES_URL = `${API_BASE}/api/expenses`;

export const ExpenseProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const fetchExpenses = async () => {
    const token = getToken();
    if (!token) {
      throw new Error('Token missing');
    }
    const res = await fetch(EXPENSES_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error('Unauthorized or Invalid Token');
    }
    return res.json();
  };

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
    onError: (err) => {
      console.error('Fetch Error:', err.message);
      toast.error('Failed to fetch expenses!');
    },
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (expense) => {
      const token = getToken();
      if (!token) throw new Error('Token missing');

      const correctedExpense = {
        type: expense.type,
        amount: Number(expense.amount),
        category: expense.category,
        paymentMethod: expense.paymentMethod,
        notes: expense.notes,
      };

      const res = await fetch(EXPENSES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(correctedExpense),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to add expense');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (err) => {
      console.error('Add Error:', err.message);
      toast.error('Error adding expense!');
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id) => {
      const token = getToken();
      if (!token) throw new Error('Token missing');

      const res = await fetch(`${EXPENSES_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to delete');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Deleted Successfully!');
    },
    onError: (err) => {
      console.error('Delete Error:', err.message);
      toast.error('Error deleting expense!');
    },
  });

  const editExpenseMutation = useMutation({
    mutationFn: async ({ id, updatedExpense }) => {
      const token = getToken();
      if (!token) throw new Error('Token missing');

      const correctedUpdate = {
        date: updatedExpense.date,
        type: updatedExpense.type,
        amount: updatedExpense.amount,
        category: updatedExpense.category,
        paymentMethod: updatedExpense.paymentMethod,
        notes: updatedExpense.notes,
      };

      const res = await fetch(`${EXPENSES_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(correctedUpdate),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to update');
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
    onError: (err) => {
      console.error('Update Error:', err.message);
      toast.error('Error updating expense!');
    },
  });

  const addExpense = (expense) => addExpenseMutation.mutate(expense);
  const deleteExpense = (id) => deleteExpenseMutation.mutate(id);
  const editExpense = (id, updatedExpense) => editExpenseMutation.mutate({ id, updatedExpense });

  return (
    <ExpenseContext.Provider
      value={{ data, isLoading, isError, addExpense, deleteExpense, editExpense }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContext;
