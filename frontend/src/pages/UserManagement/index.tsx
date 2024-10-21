import React, { useState, useEffect } from 'react'
import './style.scss'
import { apis } from '../../apis'
import moment from 'moment'
import { useSnackbar } from "notistack";
import MainButton from '../../components/mainButton'
import UpdateByAdmin from '../../components/updateByAdmin';
import PasswordInput from '../../components/passwordInput';
import CommonInput from '../../components/commonInput';
import PlusIcon from "../../assets/svg/Plus.svg"

interface UserData {
  _id: string,
  name: string, 
  email: string
  createAt: string, 
  logInAt: string, 
  currentNumber: number, 
  permittedNumber: number
}

export default function UserManagement() {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState<UserData[]>([])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [permittedNumber, setPermittedNumber] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState({
    _id: String
  })
  const [showPassword, setShowPassword] = useState(false);
  const [addIsOpen, setAddIsOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [userConfirmPassword, setUserConfirmPassword] = useState("")
  const [userShowPassword, setUserShowPassword] = useState(false)
  

  useEffect(() => {
    const fetchData = async () => {
      await apis.getUsers()
      .then((res: any) => {
        setUsers(res.data)
      })
    }
    fetchData();
  }, [])

  const inputPermittedNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue: any = event.target.value.replace(/[^0-9]/g, '');
    setPermittedNumber(numericValue)
  }

  const initialState = () => {
    setPassword("")
    setConfirmPassword("")
    setPermittedNumber("")
    setShowPassword(false)
  }

  const initalAddState = () => {
    setUserName("")
    setUserEmail("")
    setUserPassword("")
    setUserConfirmPassword("")
    setUserShowPassword(false)
  }

  const updateUser = async () => {
    if (password === "") {
      enqueueSnackbar({
        variant: "error",
        message: "Please enter the new password"
      })
      return;
    }
    if (confirmPassword === "") {
      enqueueSnackbar({
        variant: "error",
        message: "Please confirm the new password"
      })
      return;
    }
    const doPasswordsMatch = password === confirmPassword
    if (!doPasswordsMatch) {
      enqueueSnackbar({
        variant: "error",
        message: "Please match the new password"
      })
      return;
    }
    if (permittedNumber === "") {
      enqueueSnackbar({
        variant: "error",
        message: "Please enter the number of calculations permitted"
      })
      return;
    }
    
    let payload = {
      id: user._id, 
      password: password, 
      permittedNumber: parseInt(permittedNumber)
    }
    await apis.updateUserByAdmin(payload)
    .then((res:any) => {
      const updateUsers = users.map((user: any) => {
        if (user._id === res.data.id) {
          return {
            ...user, 
            permittedNumber: res.data.permittedNumber
          };
        }
        return user;
      })
      setUsers(updateUsers)
      setIsOpen(false)
      initialState()
      enqueueSnackbar({
        variant: "success",
        message: "Successfully updated",
      });

    })
  }

  const showModal = (user:any) => {
    setIsOpen(true)
    setUser(user)
  }

  const closeModal = () => {
    setIsOpen(false)
    initialState()
  }

  const closeAddModal = () => {
    setAddIsOpen(false)
    initalAddState()
  }

  const handleAddUser = () => {
    setAddIsOpen(true)
    initalAddState()
  }

  const addUserByAdmin = async () => {
    if (userName === "") {
      enqueueSnackbar({
        variant: "error",
        message: "Please enter user's name"
      })
      return;
    }
    if (userEmail === "") {
      enqueueSnackbar({
        variant: "error",
        message: "Please enter user's email"
      })
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(userEmail);
    if (!isValidEmail) {
      enqueueSnackbar({
        variant: "error",
        message: "You should write correct email."
      })
      return;
    }
    if (userPassword === "") {
      enqueueSnackbar({
        variant: "error",
        message: "Please enter user's password"
      })
      return;
    }
    const doPasswordsMatch = userPassword === userConfirmPassword
    if (!doPasswordsMatch) {
      enqueueSnackbar({
        variant: "error",
        message: "Please match the user's password"
      })
      return;
    }

    let addData = {
        email: userEmail.toLowerCase(), 
				role: 'user', 
				name: userName, 
				password: userPassword
    }
    await apis.signup(addData)
    .then((res:any) => {
      setAddIsOpen(false)
      initalAddState()
      setUsers(prevUsers => [...prevUsers, res.data.newUser]);
      console.log("res.data", res.data.newUser)
    })
  }

  const handleDeleteUser = async () => {
    let data = {
      id: user._id
    }
    await apis.deleteUser(data)
    .then(async (res) => {
      setIsOpen(false)
      enqueueSnackbar({
        variant: "success",
        message: res.data,
      });
      initialState()
      let newUsers = users.filter((item) => item._id !== user._id.toString())
      setUsers(newUsers)
    })
    .catch((error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response.data.msg || error.message,
      });
    })
  }
  
  return (
    <div className='page'>
      <div className='userManagement-container'>
        <div className='title-part'>
          <div className='pageTitle'>Management Users</div>
          <div>
            <MainButton icon={PlusIcon} title='Add user' onClick={handleAddUser} />
          </div>
        </div>
        <div className='manageTable'>
          <table className='userManage-table'>
            <tbody>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: "80px" }}>Calculation Max</th>
                <th style={{ width: "100px" }}>Calculation Actual</th>
                <th>Created Date</th>
                <th>Last logged in Date</th>
              </tr>
              {
                users.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td><span className='showName' onClick={() => showModal(user)}>{user.name}</span></td>
                      <td>{user.email}</td>
                      <td>{user.permittedNumber}</td>
                      <td>{user.currentNumber}</td>
                      <td>{moment(user.createAt).format('DD/MM/YYYY')}</td>
                      <td>{moment(user.logInAt).format('DD/MM/YYYY')}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
      <UpdateByAdmin
        isOpen={isOpen}
        closeModal={() => closeModal()}
        handleMain={() => updateUser()}
        title="Update user's info"
        handleMainTitle="Save changes"
        deleteBtn={true}
        handleDelete={handleDeleteUser}
      >
        <div className='update-user-modalBody'>
          <div className='update-inputBox'>
            <div>The Number of calculations permitted</div>
            <PasswordInput
              onClick={() => setShowPassword(!showPassword)}
              onChange={(event:any) => setPassword(event.target.value)}
              show={showPassword}
              value={password}
              placeholder="Enter your password"
            />
            <PasswordInput
              onClick={() => setShowPassword(!showPassword)}
              onChange={(event:any) => setConfirmPassword(event.target.value)}
              show={showPassword}
              value={confirmPassword}
              placeholder="Confirm your password"
            />
          </div>
          <div className='update-inputBox'>
            <div>The Number of calculations permitted</div>
            <CommonInput placeholder='Enter only value' value={permittedNumber} onChange={inputPermittedNumber} />
          </div>
        </div>
      </UpdateByAdmin>

      <UpdateByAdmin
        isOpen={addIsOpen}
        closeModal={() => closeAddModal()}
        handleMain={() => addUserByAdmin()}
        title="Add user"
        handleMainTitle="Add user"
      >
        <div className='update-user-modalBody'>
          <div className='update-inputBox'>
            <div>Name</div>
            <CommonInput placeholder="Enter user's name" value={userName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUserName(event.target.value)} />
          </div>
          <div className='update-inputBox'>
            <div>Email</div>
            <CommonInput placeholder="Enter user's email" value={userEmail} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUserEmail(event.target.value)} />
          </div>
          <div className='update-inputBox'>
            <div>Enter User's password</div>
            <PasswordInput
              onClick={() => setUserShowPassword(!showPassword)}
              onChange={(event:any) => setUserPassword(event.target.value)}
              show={userShowPassword}
              value={userPassword}
              placeholder="Enter your password"
            />
            <PasswordInput
              onClick={() => setUserShowPassword(!userShowPassword)}
              onChange={(event:any) => setUserConfirmPassword(event.target.value)}
              show={userShowPassword}
              value={userConfirmPassword}
              placeholder="Confirm your password"
            />
          </div>
        </div>
      </UpdateByAdmin>
    </div>
  )
}
