import { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required!");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!password) {
      toast.error("Password is required!");
      return;
    }
    if (password.length < 6 || password.length > 10) {
      toast.error("Password must be between 6 to 10 characters!");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;

    if (!passwordRegex.test(password)) {
      toast.error("Password must contain at least 1 letter, 1 number, and 1 special character!");
      return;
    }

    fetch("https://express-application-b92j.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/");
          toast.success("Login successful");
        } else {
          toast.error("User Not Found! Register Now");
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  return (
    <Form className="w-50 mx-auto mt-5 p-3 border rounded" onSubmit={handleSubmit}>
      <h2 className="text-center mb-4">
        <span className="text-primary">Login</span> Page
      </h2>

      <Form.Group as={Row} className="mb-3" controlId="email">
        <Form.Label column sm="4" className="text-sm-end">
          Email address
        </Form.Label>
        <Col sm="6">
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="password">
        <Form.Label column sm="4" className="text-sm-end">
          Password
        </Form.Label>
        <Col sm="6">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Col>
      </Form.Group>

      <div className="text-center">
        <Button type="submit" variant="primary">
          Login
        </Button>
      </div>

      <div className="mt-3 text-center">
        <span>Don't have an account?</span>
        <Link className="m-1" to="/register">Click here to register</Link>
      </div>
    </Form>
  );
}

export default Login;
