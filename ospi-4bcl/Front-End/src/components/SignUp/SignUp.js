import React, { useState } from 'react';
import axios from 'axios';
import "./SignUp.css";
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState(['', '', '']);
    const [answers, setAnswers] = useState(['', '', '']);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [bdrRadius, setBdrRadius] = useState("0%");
    const [bdrRadius2, setBdrRadius2] = useState("0%");

    const navigate = useNavigate();

    
    function generatePassword(length = 12, includeUppercase = true, includeNumbers = true, includeSymbols = true) {
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const symbolChars = '!@#$'; // '!@#$%^&*()_+~`|}{[]:;?><,./-='
        
        let charSet = lowercaseChars;
        if (includeUppercase) charSet += uppercaseChars;
        if (includeNumbers) charSet += numberChars;
        if (includeSymbols) charSet += symbolChars;
      
        let password = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charSet.length);
          password += charSet[randomIndex];
        }
      
        return password;
      }

    const clrscr = () => {
        setUsername("");
        setEmail("");
        setPhone("");
        setPassword("");
        setSelectedQuestions(['', '', '']);
        setAnswers(['', '', '']);
        setSubmitted(false);
        setErrors({});
    }
    const[psString,setPsString] = useState('');
    let suggestedPassword = (psString);

    const handlePasswordFocus = () =>{
        setPsString('Try: '+ generatePassword(12,true,true,true));
    }
    const handlePasswordBlur = () =>{
        setPsString('');
    }
    
    const OnEnter = () => {
        setBdrRadius("20%");
    };

    const onLeave = () => {
        setBdrRadius("0%");
    };

    const OnEnter2 = () => {
        setBdrRadius2("20%");
    };

    const onLeave2 = () => {
        setBdrRadius2("0%");
    };

    const shouldDispClear = (username.length > 0 || email.length > 0 || phone.length > 0 || password.length > 0 || email.length > 0 || answers[0].length > 0 || answers[1].length > 0 || answers[2].length > 0);

    const questions = [
        "What was your childhood best friend’s nickname?",
        "What is your sibling’s favourite movie?",
        "What is your neighbor’s last name?",
        "How many pets did you have at 10 years old?",
        "What is your favourite dessert?"
    ];

    const validate = () => {
        const newErrors = {};
        if (username.length < 3) newErrors.username = "Name must be at least 3 characters long.";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) newErrors.email = "Invalid email address.";
        if (phone.length !== 10) newErrors.phone = "Phone number must be exactly 10 digits.";
        if (password.length < 3) newErrors.password = "Password must be at least 3 characters long.";
        answers.forEach((answer, index) => {
            if (answer.length < 3) newErrors[`answer${index}`] = `Answer must be at least 3 characters long.`;
        });
        return newErrors;
    };

    const handleQuestionChange = (index, event) => {
        const newQuestions = [...selectedQuestions];
        newQuestions[index] = event.target.value;
        setSelectedQuestions(newQuestions);
    };

    const handleAnswerChange = (index, event) => {
        const newAnswers = [...answers];
        newAnswers[index] = event.target.value;
        setAnswers(newAnswers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (new Set(selectedQuestions).size !== 3 || selectedQuestions.includes('')) {
            alert("Please select exactly 3 unique questions.");
            return;
        }

        const userDetails = {
            username,
            password,
            ans1: answers[0],
            ans2: answers[1],
            ans3: answers[2],
            phone_no: phone,
            SQ1: selectedQuestions[0],
            SQ2: selectedQuestions[1],
            SQ3: selectedQuestions[2],
            email_id: email
        };

        axios.post('http://localhost:3001/save', userDetails) // Ensure this URL is correct
            .then(response => {
                console.log(response.data);
                setSubmitted(true);
                navigate('/SignIn');
            })
            .catch(error => {
                console.error('There was an error saving the data!', error);
            });
    };

    return (
        <div>
            <header>
                <h1 align = "center">Sign-Up</h1>
                <hr color = "black"></hr><br></br>
                <form onSubmit={handleSubmit} className="form"><h2 align = "center">
                    <span className="left-side">
                        <label>
                            Name:<br></br>
                            <input className = "inputBox" type="text" value={username} onChange={(e) => setUsername(e.target.value)}  maxLength={20} minLength={3} placeholder='e.g. "your-name123"' required/>
                            {errors.name && <p className="error">{errors.name}</p>}
                        </label><br /><br />
                        <label>
                            Email:<br></br>
                            <input className = "inputBox" type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                            maxLength={50} 
                            minLength={7}
                            placeholder='e.g. name@abcd.com ' 
                            required/>
                            {errors.email && <p className="error">{errors.email}</p>}
                        </label><br /><br />
                        <label>
                            Phone Number:<br></br>
                            <input className = "inputBox" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} 
                            maxLength={10} 
                            minLength={10}
                            placeholder='e.g. "0123456789" ' 
                            required/>
                            {errors.phone && <p className="error">{errors.phone}</p>}
                        </label><br /><br />
                        <label>
                            Password:<br></br>
                            <input className = "inputBox" type="password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={20} minLength={3} required autoComplete="off" placeholder= {suggestedPassword}
                            onFocus={handlePasswordFocus} onBlur={handlePasswordBlur}/><br></br>
                            {errors.password && <p className="error">{errors.password}</p>}
                        </label>
                    </span>
                    <span className="right-side"><br></br>
                        {Array.from({ length: 3 }, (_, i) => (
                            <span key={i}>
                                <label>
                                    Select Question {i + 1}:
                                    <select className = "inputBox" onChange={(e) => handleQuestionChange(i, e)} value={selectedQuestions[i]}>
                                        <option value="" disabled>Select a question</option>
                                        {questions.map((question, index) => (
                                            <option key={index} value={question}>{question}</option>
                                        ))}
                                    </select>
                                </label><br /><br />
                                {selectedQuestions[i] && (
                                    <label>
                                        Answer:<br></br>
                                        <input className = "inputBox" type="text" value={answers[i]} onChange={(e) => handleAnswerChange(i, e)} />
                                        {errors[`answer${i}`] && <p className="error">{errors[`answer${i}`]}</p>}
                                    </label>
                                )}
                                <br /><br />
                            </span>
                        ))}
                        <button type="submit" 
                        className="buttons" 
                        style={{ borderRadius: bdrRadius }} 
                        onMouseEnter={OnEnter} 
                        onMouseLeave={onLeave}>
                            Submit
                            </button><br></br>
                        <h2 align = "center">
                            {shouldDispClear && 
                        <button 
                            onClick={clrscr} 
                            className="buttons" 
                            style={{ borderRadius: bdrRadius2 }} 
                            onMouseEnter={OnEnter2} 
                            onMouseLeave={onLeave2}
                        >
                            Clear
                        </button>
                    }</h2>
                    </span></h2>
                </form> 
                {submitted && (
                    <div className="success-message">
                        <h2>Data saved successfully!</h2>
                    </div>
                )}
            </header>
        </div>
    );
}

export default SignUp;
