import { useSelector } from 'react-redux'
import Avatar from "../../assets/images/avatar.png"
import MobileHamburger from "../../assets/svg/mobile-hamburger.svg" 

type Props = {
  showSideBar:any
}

export default function Header({ showSideBar }: Props) {

	const user = useSelector((state:any) => state.auth.user)

  return (
    <div className='header'>
			<div className='header-content'>
				<div></div>
				<div className='avatarBox'>
					<div className='imageBox'>
						<img src={user.avatar === "" ? Avatar : user.avatar} alt='avatar' />
					</div>
					<div className='avatarInfo'>
						<div className='name'>{user.name}</div>
						<div className='role'>{user.email}</div>
					</div>
				</div>
			</div>
			<div className='mobile-header'>
				<div className='hamburger' onClick={() => showSideBar()}>
					<img src={MobileHamburger} alt='Hamburger' width={30} height={30} />
				</div>
				<div className='avatarBox'>
					<div className='avatar'>
						<img src={user.avatar === "" ? Avatar : user.avatar} alt='avatar' />
					</div>
					<div className='avatarInfo'>
						<div className='name'>{user.name}</div>
						<div className='role'>{user.role}</div>
					</div>
				</div>
			</div>
    </div>
  )
}
