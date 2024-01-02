import React, { useEffect } from 'react'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'
import * as message from '../../components/Message/Message'
import socket from '../../services/socket'

import CustomModal from './CustomModal'
const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const location = useLocation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  // Thuộc thông báo socket, phần đăng nhập
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state) => state.user)
  const [check, setCheck] = useState(false);
  const navigate = useNavigate()

  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
  const { data, isLoading, isSuccess } = mutation

  useEffect(() => {
    if (isSuccess && data && data.status === 'OK') {

      setTimeout(() => {
        if (location?.state) {
          // Pass the success state to the next page
          navigate(location.state, { state: { loginSuccess: true } });
        } else {
          navigate('/', { state: { loginSuccess: true } });
        }
      }, 2000);
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token)
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isSuccess])

  useEffect(() => {
    // Lắng nghe sự kiện đăng nhập thành công từ server
    socket.on('login_success', (data) => {
      console.log('OKKKK', data?.message); // Log hoặc thực hiện hành động cần thiết
      // In ra bảng thông báo login thành công
      setModalMessage(data?.message);
    });
  }, []);

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }))
  }


  const handleNavigateSignUp = () => {
    navigate('/sign-up')
  }

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnchangePassword = (value) => {
    setPassword(value)
  }

  const handleSignIn = () => {

    // Gửi sự kiện đăng nhập cho server
    socket.emit('login', { email });

    mutation.mutate({
      email,
      password
    })
  }

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Xin chào bạn!</h1>
          <p>Đăng nhập tài khoản</p>
          <InputForm style={{ marginBottom: '10px' }} placeholder="nhập tài khoản (abc@gmail.com)" value={email} onChange={handleOnchangeEmail} />
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm
              placeholder="nhập mật khẩu "
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              size={40}
              styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
              }}
              textbutton={'Đăng nhập'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </Loading>
          
          {/* <p onClick={handleForgotPassword} style={{ color: "blue", cursor: "pointer" }}> Quên mật khẩu</p> */}
          <p><WrapperTextLight onClick={handleForgotPassword} style={{ color: "blue", cursor: "pointer" }}>Quên mật khẩu?</WrapperTextLight></p> 
          <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}> Đăng ký</WrapperTextLight></p>
        </WrapperContainerLeft>
        {/* <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="iamge-logo" height="203px" width="203px" />
          <h4>Mua sắm tại LTTD</h4>
        </WrapperContainerRight> */}
      </div>
      {/* Container để hiển thị thông báo */}
      {/* {showModal && <CustomModal message={modalMessage} />} */}
    </div >
  )
}

export default SignInPage