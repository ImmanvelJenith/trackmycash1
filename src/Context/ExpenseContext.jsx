import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

const getToken = () => localStorage.getItem("token");

export const API_BASE = "https://express-application-b92j.onrender.com";
const EXPENSES_URL = `${API_BASE}/api/expenses`;

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-GB").replaceAll("/", ".");
};


export const ExpenseProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const token = getToken();
      if (!token) throw new Error('Token missing. Please login again.');
      try {
        const res = await axios.get(EXPENSES_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      } catch (err) {
        throw new Error(err.response?.data?.message || 'Unauthorized or Invalid Token');
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to fetch expenses!');
    },
  });


  const addExpenseMutation = useMutation({
    mutationFn: async (expense) => {
      const token = getToken();
      if (!token) throw new Error('Token missing');
      const correctedExpense = {
        date: formatDate(expense.date),
        type: expense.type.toLowerCase(),
        amount: Number(expense.amount),
        category: expense.category,
        paymentMethod: expense.paymentMethod,
        notes: expense.notes,
      };
      try {
        const res = await axios.post(EXPENSES_URL, correctedExpense, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to add expense');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Error adding expense!');
    },
  });

  const addExpense = (expense) => {
    addExpenseMutation.mutate(expense);
  };

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id) => {
      const token = getToken();
      if (!token) throw new Error('Token missing');
      try {
        const res = await axios.delete(`${EXPENSES_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to delete');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Deleted Successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Error deleting expense!');
    },
  });

  const deleteExpense = (id) => {
    deleteExpenseMutation.mutate(id);
  };


  const editExpenseMutation = useMutation({
    mutationFn: async ({ id, updatedExpense }) => {
      const token = getToken();
      if (!token) throw new Error('Token missing');
      const correctedUpdate = {
        date: formatDate(updatedExpense.date),
        type: updatedExpense.type.toLowerCase(),
        amount: updatedExpense.amount,
        category: updatedExpense.category,
        paymentMethod: updatedExpense.paymentMethod,
        notes: updatedExpense.notes,
      };
      try {
        const res = await axios.put(`${EXPENSES_URL}/${id}`, correctedUpdate, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to update');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Error updating expense!');
    },
  });

  const editExpense = (id, updatedExpense) => {
    editExpenseMutation.mutate({ id, updatedExpense });
  };

  // In-app API connectivity check. Returns a small status object.
  const checkApi = async () => {
    const token = getToken();
    try {
      const res = await axios.get(EXPENSES_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return { ok: true, status: res.status, data: res.data };
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      return { ok: false, status, error: message };
    }
  };

  return (
    <ExpenseContext.Provider
      value={{ data, addExpense, deleteExpense, editExpense, isLoading, isError, error, checkApi }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContext;
