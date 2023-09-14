import React, { useState, useRef, useEffect } from 'react';
import Logo from '../../components/Logo';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { setUserName } from '../../features/userSlice';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router';
import { createUserWithEmailAndPassword} from "firebase/auth";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './signinpage.css'

const Signinpage = () => {
  const [formData, setformData] = useState({email:"", password:"", passwordCheck:""}); 
  const [type, setType] = useState('password');
  const [confirmType, setConfirmType] = useState('password');
  const [strengthLabel, setStrengthLabel] = useState('');
  const [strengthWidth, setStrengthWidth] = useState('0%');
  const [background, setBackground] = useState('');
  const [textColor, setTextColor] = useState('')
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const indicatorTextElRef = useRef(null);
  const indicatorStrenghtElRef = useRef(null);

  useEffect(() => {
    calculatePasswordStrength(formData.password)
  }, [formData.password])

  //Function for updating state of the form
  const handleChange = (e) => {
    const {name, value} = e.target;
    setformData(prevData => {
      return {
        ...prevData,
        [name]: value
      }      
    }) 
  }

  //Function for Hiding/Revealing Password
  const hideShow = (name) => {
    if (name === 'password') {
      setType((prevType) => (prevType === 'password' ? 'text' : 'password'));
    } else if (name === 'passwordCheck') {
      setConfirmType((prevConfirmType) =>
        prevConfirmType === 'password' ? 'text' : 'password'
      );
    }
  };

  //Function for signing up user with google firebase authentication
  const signInUser = (e) => {
    if(formData.password !== formData.passwordCheck){
      alert('Passwords do not match');
    }else{
      e.preventDefault();
      // dispatch(setUserName(formData.username))
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        navigate("/movies");        
        // ...
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
      // ..
      });
    }   
  }

  //This function uses RegEx to calculate password strength
  function calculatePasswordStrength(password) {
    const lengthScore = password.length >= 6 ? 10 : 0;
    const lowercaseRegex = /[a-z]/g;
    const uppercaseRegex = /[A-Z]/g;
    const numericRegex = /[0-9]/g;
    const specialRegex = /[^a-zA-Z0-9\s]/g;
    const characterScores = {
      lowercase: password.match(lowercaseRegex) ? 20 : 0,
      uppercase: password.match(uppercaseRegex) ? 20 : 0,
      numeric: password.match(numericRegex) ? 20 : 0,
      special: password.match(specialRegex) ? 20 : 0,
    };
    const repeatedCharsRegex = /(.)\1/g;
    const repeatedCharsScore = password.match(repeatedCharsRegex) ? -10 : 0;
  
    const strength = lengthScore +
      characterScores.lowercase +
      characterScores.uppercase +
      characterScores.numeric +
      characterScores.special +
      repeatedCharsScore;
  
    const mappedStrength = Math.max(Math.floor((strength / 90) * 100), 0);
    console.log('Strength >>>', strength, 'mapped-Strength >>>', mappedStrength);
    getStrengthLabel(mappedStrength);       
    setStrengthWidth(`${mappedStrength}%`);
    return mappedStrength;
  }

  //this function updates the strength indicator as appropriate.
  const getStrengthLabel = (mappedStrength) => {
    if (mappedStrength <= 25) {
        setTextColor('#ff0000');
        setBackground('#ff0000');
        setStrengthLabel('Too Weak');      
    } else if (mappedStrength <= 50) {
        setTextColor('#ff4757');
        setBackground('#ff4757');
        setStrengthLabel('Weak');      
    } else if (mappedStrength <= 75) {
        setTextColor('#ffa500');
        setBackground('#ffa500');
        setStrengthLabel('Strong');      
    } else {
        setTextColor('#008000');
        setBackground('#008000');
        setStrengthLabel('Very Strong');      
    }
  };



  return (
    <div className="signup-page">
    <nav>
      <div className="nav__container container">
        <Link to="/">
          <Logo/> 
        </Link>          
        <button className="btn btn-rounded">Sign Up</button>            
      </div> 
    </nav>
    <div className="signup-modal">
      <h3>Sign In</h3>
      <form>
        <div className="password_input">
          <input 
            type="email" 
            autoComplete="email" 
            maxLength="50" 
            minLength="5" 
            name="email" 
            onChange={handleChange} 
            value={formData.email}
            className={formData.email !== "" ? "has-value" : ""}
          />
          <span className={formData.email.length > 0 ? "has-value" : ""}>Email address</span>
        </div>
        <div className="password-input">
          <input 
            type={type}
            autoComplete="password" 
            maxLength="50"
            minLength="5" 
            name="password" 
            onChange={handleChange} value={formData.password}
            className={formData.password.length > 0 ? "has-value" : ""}
          />
          {type === 'password' ? (
            <VisibilityIcon className="icon" onClick={() => hideShow('password')} />
              ) : (
            <VisibilityOffIcon className="icon" onClick={() => hideShow('password')} />
          )}
          <span className={formData.password.length > 0 ? "has-value" : ""}>Password</span>
        </div>           
        <button type="submit" className="button" onClick={signInUser}>Sign In</button>
      </form>
      <p>New to Netflix? <b onClick={() => navigate("/signup")}>Sign Up Now</b></p>
    </div> 
  </div>
  )
}

export default Signinpage