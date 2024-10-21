import React, { useState } from 'react'
import './style.scss'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import MainButton from '../../components/mainButton';
import { useNavigate } from "react-router-dom";
import { apis } from '../../apis';
import { useSnackbar } from "notistack";

export default function Register() {
	const navigator = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const [showPassword, setShowPassword] = useState(false);
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [termSelect, setTermSelect] = useState(false)
	const [emailError, setEmailError] = useState({
		status: false, 
		message: ""
	})
	const [nameError, setNameError] = useState({
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
			status: isValidEmail, 
			message: "You should write correct email."
		})
	}

	const handleRegister = async () => {

		if (email === "") {
			setEmailError({
				status: false, 
				message: "You should enter valid email"
			})
		}

		if (name === "") {
			setNameError({
				status: true, 
				message: "You should enter your name"
			})
		}

		if (password === "") {
			setPasswordError({
				status: true, 
				message: "You should enter the password."
			})
		} else {
			
			const doPasswordsMatch = password === confirmPassword;
			if (!doPasswordsMatch) {
				setPasswordError({
					status: true, 
					message: "You should re-enter the correct password"
				})
			} else {
				setPasswordError({
					status: false, 
					message: ""
				})
			}
		}

		if (!termSelect) {
			enqueueSnackbar({
				variant: "error",
				message: "Please agree to the Terms & Conditions",
			});
		}
		if (emailError.status && !nameError.status && !passwordError.status && termSelect) {
			const registerData = {
				email: email.toLowerCase(), 
				role: 'user', 
				name: name, 
				password: password
			}
			await apis.signup(registerData)
			.then((res) => {
				enqueueSnackbar({
					variant: "success",
					message: res.data?.msg,
				});
				setTimeout(() => {
					navigator('/login')
				}, 1000)
				
			}).catch((error) => {
				console.log(error)
				enqueueSnackbar({
					variant: "error",
					message: error.response.data.msg || error.message,
				});
			})
		}
	}

  return (
    <div className='registerBox'>
			<div className='titleBox'>	
				<div className='title'>Welcome to <span>'Daily Rate Estimator'</span> <br /> (freelance <span>management consulting</span> resources) </div>
			</div>
			<div className='subBox'>
				<div className='subTitle'>Name</div>
				<input type='text' placeholder='Enter your Name' value={name} onChange={(e) => setName(e.target.value)} />
				{
					nameError.status ? <div className='errorText'>{nameError.message}</div> : <div className='errorFalse'>Error</div>
				}
			</div>
			<div className='subBox'>
				<div className='subTitle'>Email</div>
				<input type='text' placeholder='Enter your Email' value={email} onChange={handleEmail} />
				{
					!emailError.status ? <div className='errorText'>{emailError.message}</div> : <div className='errorFalse'>Error</div>
				}
			</div>
			<div className='passwordBox'>
				<div className='password-input'>
					<div className='passwordSubBox'>
						<div className='subTitle'>Password</div>
						<div className='passwordInputTag'>
							<input 
								type={showPassword ? 'text' : 'password'} 
								value={password} placeholder='Enter your password' 
								onChange={(e) => setPassword(e.target.value)} />
							<div className='icon' onClick={togglePasswordVisibility}>
								{showPassword ? <FaEyeSlash color='#949CA9' /> : <FaEye color='#949CA9'/>}
							</div>
						</div>
					</div>
					<div className='passwordSubBox'>
						<div className='subTitle'>Confirm Password</div>
						<div className='passwordInputTag'>
							<input 
								type={showPassword ? 'text' : 'password'} 
								value={confirmPassword} placeholder='Enter your password' 
								onChange={(e) => setConfirmPassword(e.target.value)} />
							<div className='icon' onClick={togglePasswordVisibility}>
								{showPassword ? <FaEyeSlash color='#949CA9' /> : <FaEye color='#949CA9'/>}
							</div>
						</div>
					</div>
				</div>
				{
					passwordError.status ? <div className='errorText'>{passwordError.message}</div> : <div className='errorFalse'>Error</div>
				}
			</div>
			<div className='termsBox'>
				<input type='checkbox' checked={termSelect} onChange={(event) => setTermSelect(event.target.checked)} />
				<a href="https://www.aspire-advisors.net/hubfs/27102803/Terms%20and%20Conditions%20for%20the%20Use%20of%20the%20Daily%20Rate%20Estimator%20Tool_Aspire%20Advisors%20AG-1.pdf?hsLang=en" target="_blank" rel="noreferrer">
					<div>I agree to the <span>Terms & Conditions</span></div>
				</a>
			</div>
			<MainButton title="Sign up" onClick={handleRegister} />
			<div className='other'>
				<div>Already have an account? <span onClick={() => navigator("/login")}>Sign in</span></div>
			</div>
    </div>
  )
}
