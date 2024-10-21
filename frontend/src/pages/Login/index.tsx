import React, { useState } from 'react'
import './style.scss'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import MainButton from '../../components/mainButton';
import { useNavigate } from "react-router-dom";
import { apis } from '../../apis';
import { useSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { SET_CURRENT_USER } from '../../redux/actions/types';

export default function Login() {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState({
    status: false, 
    message: ""
  })
  const [passwordError, setPasswordError] = useState({
    status: false, 
    message: ""
  })

  const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

  const handleEmail = (e:any) => {
		setEmail(e.target.value)

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValidEmail = emailRegex.test(e.target.value);
		setEmailError({
			status: !isValidEmail, 
			message: "You should enter correct email."
		})
	}

  const login = async () => {
    if (email === "") {
      setEmailError({
				status: true, 
				message: "You should enter an email."
			})
    }
    if (password === "") {
      setPasswordError({
				status: true, 
				message: "You should enter the password."
			})
    }

    if (!emailError.status && !passwordError.status) {
      const loginData = {
        email: email.toLowerCase(), 
        password: password
      }
      await apis.login(loginData)
      .then(async (res) => {
        enqueueSnackbar({
          variant: "success",
          message: res.data.msg
        })
        await localStorage.setItem('token', res.data.token)
        const decoded: any = jwtDecode(res.data.token)
        dispatch({ type: SET_CURRENT_USER, payload: decoded })
        if (decoded.role === "admin") navigator('/country')
        else navigator('/calculator')
      })
      .catch((error) => {
        enqueueSnackbar({
					variant: "error",
					message: error.response.data.msg || error.message,
				});
      })
    }
  }

  return (
    <div className='loginBox'>
    	<div className='titleBox'>	
				<div className='title'>Welcome back!</div>
			</div>
      <div className='subBox'>
				<div className='subTitle'>Email</div>
				<input type='text' placeholder='Enter your Email' value={email} onChange={handleEmail}  />
        {
					emailError.status ? <div className='errorText'>{emailError.message}</div> : <div className='errorFalse'>Error</div>
				}
			</div>
      <div className='passwordSubBox'>
        <div className='subTitle'>Password</div>
        <div className='passwordBox'>
          <div className='password-input'>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' />
            <div className='icon' onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash color='#949CA9' /> : <FaEye color='#949CA9'/>}
            </div>
          </div>
          {
					  passwordError.status ? <div className='errorText'>{passwordError.message}</div> : <div className='errorFalse'>Error</div>
				  }
        </div>
      </div>
      <MainButton title="Login" onClick={login} />
      <div className='forgetButton'>
        <span>Forgot Password?</span>
      </div>
      <div className='other'>
        Don't you have an account? <span onClick={() => navigator("/register")}>Sign up</span>
      </div>
    </div>
  )
}
