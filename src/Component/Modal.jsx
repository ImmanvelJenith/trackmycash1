import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect, useContext } from "react";
// import { useExpense } from "../Context/ExpenseContext";
import ExpenseContext from "../Context/ExpenseContext";
import { toast } from 'react-hot-toast';

function Modals({ show, handleClose, editData = null }) {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNote] = useState("");

  const { addExpense, editExpense } = useContext(ExpenseContext);

  useEffect(() => {
    if (editData) {
      setType(editData.type || "");
      setAmount(editData.amount || "");
      setCategory(editData.category || "");
      setPaymentMethod(editData.paymentMethod || "");
      setNote(editData.notes || "");
    } else {

      setType(""); setAmount(""); setCategory(""); setPaymentMethod(""); setNote("");
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();


    const newEntry = {
      date: editData ? editData.date : new Date().toISOString(),
      type,
      amount: Number(amount),
      category,
      paymentMethod,
      notes,
    };

    if (editData) {
      editExpense(editData._id, newEntry);
      toast.success("Updated successfully");
    } else {
      addExpense(newEntry);
      toast.success("Stored successfully");
    }

    setType(""); setAmount(""); setCategory(""); setPaymentMethod(""); setNote("");
    handleClose();
  };


  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Entry" : "Track My Cash"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="type">
            <Form.Label>Type</Form.Label>
            <Form.Select value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="" disabled>select one</option>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="" disabled>select one</option>
              <option value="Others">Others</option>
              <option value="Work">Work</option>
              <option value="Salary">Salary</option>
              <option value="Groceries">Groceries</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Transport">Transport</option>
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Education">Education</option>
              <option value="Clothing">Clothing</option>
              <option value="Travel">Travel</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="paymentMethod">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
              <option value="" disabled>select one</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="notes">
            <Form.Label>Notes (Optional)</Form.Label>
            <Form.Control as="textarea" rows={3} value={notes} onChange={(e) => setNote(e.target.value)} />
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button type="submit" variant="primary">
              {editData ? "Update Changes" : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Modals;
