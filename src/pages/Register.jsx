import { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name) {
            toast.error("Name is required!");
            return;
        }
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

        fetch("https://express-application-b92j.onrender.com/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        })
            .then((res) => {
                return res.json().then((data) => {
                    if (res.ok === true) {
                        toast.success(data.message);
                        navigate("/");
                    } else {
                        toast.error(data.message);
                    }
                    return data;
                });
            })
            .catch(() => {
                toast.error("Something went wrong");
            });
    };

    return (
        <Form
            onSubmit={handleSubmit}
            className="w-50 mx-auto mt-5 p-4 border rounded shadow-sm">
            <h2 className="text-center mb-4">
                <span className="text-primary">Register</span> Page
            </h2>

            <Form.Group as={Row} className="mb-3" controlId="name">
                <Form.Label column sm={4} className="text-sm-end">
                    Name
                </Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="email">
                <Form.Label column sm={4} className="text-sm-end">
                    Email address
                </Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="password">
                <Form.Label column sm={4} className="text-sm-end">
                    Password
                </Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="password"
                        placeholder="Password (6-10 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Col>
            </Form.Group>

            <div className="text-center">
                <Button type="submit" variant="primary">
                    Register
                </Button>
            </div>

            <div className="mt-3 text-center">
                <span>Already have an account? </span>
                <Link className="m-1" to="/login">
                    Click here to login
                </Link>
            </div>
        </Form>
    );
}

export default Register;
