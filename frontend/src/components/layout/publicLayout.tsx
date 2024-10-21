import { ReactNode } from 'react'
import { useLocation } from "react-router-dom"
import './layout.scss'
import AdminBanner from "../../assets/images/AdminBanner.png"
import SignInBanner from "../../assets/images/SignInBanner.png"

export default function PublicLayout({children}: { children: ReactNode} ) {
	const location = useLocation();
	const path = location.pathname

  return (
    <div className='public-layout'>
		<div className='public-image'>
			<img src={path === "/login" ? SignInBanner : AdminBanner} alt='logo' />
		</div>
		<div className='children-box'>
			{children}
		</div>
    </div>
  )
}
