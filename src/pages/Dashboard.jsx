import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modals from "../Component/Modal";
import ExpenseTable from "../Component/ExpenseTable";
// import { useExpense } from "../Context/ExpenseContext";
import ExpenseContext from "../Context/ExpenseContext";
import "./dashboard.css";
import { toast } from "react-hot-toast";


function Dashboard() {
  const [show, setShow] = useState(false);
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);
  const navigate = useNavigate();
  const { data } = useContext(ExpenseContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const totalExpense = data
      .filter((item) => item.type === "expense")
      .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

    const totalIncome = data
      .filter((item) => item.type === "income")
      .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);


    setExpense(totalExpense);
    setIncome(totalIncome);
  }, [data]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="dashboard-container">
      <div className="logout-wrapper">
        <Button
          variant="danger"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
            toast.error("Logout Successfully")
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right me-2" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
          </svg>Logout
        </Button>
      </div>

      <h1 className="dashboard-title">
        <span>Track My</span> Cash
      </h1>

      <div className="stats-container">
        <div className="stat-card expense-card">
          <div className="stat-label">Total Expense</div>
          <div className="stat-value">₹{Math.floor(expense).toLocaleString("en-IN")}</div>
        </div>

        <div className="stat-card income-card">
          <div className="stat-label">Total Income</div>
          <div className="stat-value">₹{Math.floor(income).toLocaleString("en-IN")}</div>
        </div>

        <div className="stat-card balance-card">
          <div className="stat-label">Balance</div>
          <div className="stat-value">₹{Math.floor( income - expense ).toLocaleString("en-IN")}
</div>
        </div>
      </div>

      <Button
        variant="light"
        onClick={handleShow}
        className="add-expense-button rounded-circle"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>
      </Button>

      <Modals show={show} handleClose={handleClose} />
      <ExpenseTable />
    </div>
  );
}

export default Dashboard;
