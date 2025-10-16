import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

const getToken = () => localStorage.getItem("token");

// API base (updated to use the Render-hosted backend)
export const API_BASE = "https://express-application-b92j.onrender.com";
const EXPENSES_URL = `${API_BASE}/api/expenses`;

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-GB").replaceAll("/", ".");
};

export const ExpenseProvider = ({ children }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error("Token missing. Please login again.");
      return;
    }

    fetch(EXPENSES_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or Invalid Token");
        return res.json();
      })
      .then((expenses) => {
        setData(expenses);
      })
      .catch((err) => {
        console.error("Fetch Error:", err.message);
        toast.error("Failed to fetch expenses!");
      });
  }, []);

  const addExpense = (expense) => {
    const token = getToken();
    if (!token) {
      toast.error("Token missing");
      return;
    }

    const correctedExpense = {
      date: formatDate(expense.date),
      type: expense.type.toLowerCase(),
      amount: Number(expense.amount),
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      notes: expense.notes,
    };

    fetch(EXPENSES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(correctedExpense),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error("Failed to add expense");
        }
        return res.json();
      })
      .then((newExpense) => {
        setData((prev) => [...prev, newExpense]);
      })
      .catch((err) => {
        console.error("Add Error:", err.message);
        toast.error("Error adding expense!");
      });
  };

  const deleteExpense = (id) => {
    const token = getToken();
    if (!token) {
      toast.error("Token missing");
      return;
    }

    fetch(`${EXPENSES_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete");
        return res.json();
      })
      .then(() => {
        setData((prev) => prev.filter((item) => item._id !== id));
        toast.success("Deleted Successfully!");
      })
      .catch((err) => {
        console.error("Delete Error:", err.message);
        toast.error("Error deleting expense!");
      });
  };

  const editExpense = (id, updatedExpense) => {
    const token = getToken();
    if (!token) {
      toast.error("Token missing");
      return;
    }

    const correctedUpdate = {
      date: formatDate(updatedExpense.date),
      type: updatedExpense.type.toLowerCase(),
      amount: updatedExpense.amount,
      category: updatedExpense.category,
      paymentMethod: updatedExpense.paymentMethod,
      notes: updatedExpense.notes,
    };

    fetch(`${EXPENSES_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(correctedUpdate),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update");
        return res.json();
      })
      .then((updatedItem) => {
        setData((prev) =>
          prev.map((item) => (item._id === id ? updatedItem : item))
        );
      })
      .catch((err) => {
        console.error("Update Error:", err.message);
        toast.error("Error updating expense!");
      });
  };

  return (
    <ExpenseContext.Provider
      value={{ data, addExpense, deleteExpense, editExpense }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContext;
