import React, { useState, useEffect } from 'react'
import Logo from "../../assets/images/logo.png"
import { useNavigate, useLocation } from "react-router-dom";
import { LOG_OUT } from '../../redux/actions/types';
import { useDispatch, useSelector } from 'react-redux';

import Country from "../../assets/svg/Country.svg"
import Country_colored from "../../assets/svg/Country_colored.svg"
import Express from "../../assets/svg/Express.svg"
import Express_colored from "../../assets/svg/Express_colored.svg"
import Setting from "../../assets/svg/Setting.svg"
import Setting_colored from "../../assets/svg/Setting_colored.svg"
import LogOut from "../../assets/svg/logout.svg"
import Calculator from "../../assets/svg/calculator.svg"
import Calculator_colored from "../../assets/svg/calculator_colored.svg"
import UserManagement from "../../assets/svg/UserManagement.svg"
import UserManagement_colored from "../../assets/svg/UserManagement_colored.svg"

export default function AdminSidebar() {
	const navigator = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const [ activeTab, setActiveTab ] = useState("")
	const user = useSelector((state:any) => state.auth.user)


	useEffect(() => {
    const path = location.pathname
    if (path === '/country') setActiveTab("Country")
    else if (path === '/assumption') setActiveTab("Expense")
    else if (path === '/setting') setActiveTab("Setting")
		else if (path === '/calculator') setActiveTab("Calculator")
		else if (path === '/user-management') setActiveTab("UserManagement")
	}, [location])

	const handleLogout = () => {
		dispatch({ type: LOG_OUT, payload: {} })
		localStorage.removeItem('token')
		navigator('/login')
	}
  return (
    <div className='adminSidebar'>
		<div>
			<div className='logo'>
				<img src={Logo} alt='Logo' width={55} height={50} />
			</div>
			<div className='lists'>
				{
					user.role === "admin"
					? <div className='list' onClick={() => { navigator("/country"); setActiveTab("Country") }}>
							<div className={`list-nav${activeTab === "Country" ? " activeTab" : ""}`}>
								<img width={22} height={22} src={activeTab === "Country" ? Country_colored : Country} alt='Country' />
								<span>Country table</span>
							</div>
						</div>
					: <div className='list' onClick={() => { navigator("/calculator"); setActiveTab("Calculator") }}>
							<div className={`list-nav${activeTab === "Calculator" ? " activeTab" : ""}`}>
								<img width={22} height={22} src={activeTab === "Calculator" ? Calculator_colored : Calculator} alt='Country' />
								<span>Calculator</span>
							</div>
						</div>
				}
				
				{
					user.role === "admin" && <div className='list' onClick={() => { navigator("/assumption"); setActiveTab("Expense"); }}>
						<div className={`list-nav${activeTab === "Expense" ? " activeTab" : ""}`}>
							<img width={22} height={22} src={activeTab === "Expense" ? Express_colored : Express} alt='Expense' />
							<span>Model assumptions</span>
						</div>
					</div>
				}

				{
					user.role === "admin" && <div className='list' onClick={() => { navigator("/user-management"); setActiveTab("UserManagement"); }}>
						<div className={`list-nav${activeTab === "UserManagement" ? " activeTab" : ""}`}>
							<img width={22} height={22} src={activeTab === "UserManagement" ? UserManagement_colored : UserManagement} alt='UserManagement' />
							<span>Manage Users</span>
						</div>
					</div>
				}

				{/* <div className='list' onClick={() => { navigator("/setting"); setActiveTab("Setting"); }}>
					<div className={`list-nav${activeTab === "Setting" ? " activeTab" : " "}`}>
						<img width={22} height={22} src={activeTab === "Setting" ? Setting_colored : Setting} alt='Setting' />
						<span>Setting</span>
					</div>
				</div> */}

			</div>
		</div>
			
		<div className='list topBorder' onClick={() => handleLogout()}>
			<div className='leftBorder' />
			<div className='list-nav'>
				<img width={22} height={22} src={LogOut} alt='CompanyProfile' />
				<span>Log Out</span>
			</div>
		</div>
    </div>
  )
}
