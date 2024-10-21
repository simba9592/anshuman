import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import { LOG_OUT } from '../../redux/actions/types'
import { useDispatch, useSelector } from 'react-redux';

import Country from "../../assets/svg/Country.svg"
import Country_white from "../../assets/svg/Country_white.svg"
import Express from "../../assets/svg/Express.svg"
import Express_white from "../../assets/svg/Express_white.svg"
import Setting from "../../assets/svg/Setting.svg"
import Setting_white from "../../assets/svg/Setting_white.svg"
import LogOut from "../../assets/svg/logout.svg"
import Calculator from "../../assets/svg/calculator.svg"
import Calculator_white from "../../assets/svg/Calculator_white.svg"
import UserManagement from "../../assets/svg/UserManagement.svg"
import UserManagement_white from "../../assets/svg/UserManagement_white.svg"

type AdminMobileSidebarProps = {
  isOpen: Boolean, 
  setIsOpen: any
}

export default function AdminMobileSidebar({ isOpen, setIsOpen }: AdminMobileSidebarProps) {
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
    <div className={`mobile-sidebar${isOpen === true ? "" : " remove"}`}>
			<div className='s-lists'>
				{
					user.role === "admin"
					? <div className='s-list' onClick={() => { navigator("/country"); setActiveTab("Country"); setIsOpen(false); }}>
							<div className={`s-list-nav${activeTab === "Country" ? " s-activeTab" : ""}`}>
								<img width={22} height={22} src={activeTab === "Country" ? Country_white : Country} alt='Country' />
								<span>Dashboard</span>
							</div>
						</div>
					: <div className='s-list' onClick={() => { navigator("/calculator"); setActiveTab("Calculator"); setIsOpen(false); }}>
							<div className={`s-list-nav${activeTab === "Calculator" ? " s-activeTab" : ""}`}>
								<img width={22} height={22} src={activeTab === "Calculator" ? Calculator_white : Calculator} alt='Country' />
								<span>Calculator</span>
							</div>
						</div>
				}
				

				{
					user.role === "admin" && <div className='s-list' onClick={() => { navigator("/assumption"); setActiveTab("Expense"); setIsOpen(false); }}>
						<div className={`s-list-nav${activeTab === "Expense" ? " s-activeTab" : ""}`}>
							<img width={22} height={22} src={activeTab === "Expense" ? Express_white : Express} alt='Expense' />
							<span>Model assumptions</span>
						</div>
					</div>
				}

				{
					user.role === "admin" && <div className='s-list' onClick={() => { navigator("/user-management"); setActiveTab("UserManagement"); setIsOpen(false); }}>
						<div className={`s-list-nav${activeTab === "UserManagement" ? " s-activeTab" : ""}`}>
							<img width={22} height={22} src={activeTab === "UserManagement" ? UserManagement_white : UserManagement} alt='UserManagement' />
							<span>Manage Users</span>
						</div>
					</div>
				}

				{/* <div className='s-list' onClick={() => { navigator("/setting"); setActiveTab("Setting"); setIsOpen(false); }}>
					<div className={`s-list-nav${activeTab === "Setting" ? " s-activeTab" : ""}`}>
						<img width={22} height={22} src={activeTab === "Setting" ? Setting_white : Setting} alt='Setting' />
						<span>Setting</span>
					</div>
				</div> */}
			</div>
			
			<div className='s-list divider' onClick={() => handleLogout()}>
				<div className='s-leftBorder' />
				<div className='s-list-nav'>
					<img width={22} height={22} src={LogOut} alt='CompanyProfile' />
					<span>Log Out</span>
				</div>
			</div>
    </div>
  )
}
