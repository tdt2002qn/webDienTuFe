import { Badge, Button, Col, Popover } from 'antd'
import React from 'react'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
  WechatOutlined,
  MoneyCollectOutlined
} from '@ant-design/icons';
import ButttonInputSearch from '../ButtonInputSearch/ButttonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import { useState } from 'react';
import Loading from '../LoadingComponent/Loading';
import { useEffect } from 'react';
import { searchProduct } from '../../redux/slides/productSlide';
import socket from '../../services/socket';
import CustomModal from './CustomModal';
import ModalWrapper from './CustomModalWrapper';
const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search, setSearch] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const order = useSelector((state) => state.order)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('');
  // Thuộc thông báo socket, phần đăng xuat
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  const handleLogout = async () => {


    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    setLoading(false)
    localStorage.removeItem("access_token")
  }

  useEffect(() => {
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name, user?.avatar])

  //Phần của SOCKET thông báo đăng xuất
  useEffect(() => {
    // Lắng nghe sự kiện đăng xuat thành công từ server
    socket.on('logout_success', (data) => {
      setModalMessage(data?.message);
    });
  }, []);
  const closeModal = () => {
    setShowModal(false);
  };
  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')} >Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (
        
        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
        )}
        {!user?.isAdmin && (
          <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</WrapperContentPopup>

        )}
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>

    </div>
  );

  const handleClickNavigate = (type) => {
    if (type === 'profile') {
      navigate('/profile-user')
    } else if (type === 'admin') {
      navigate('/system/admin')
    } else if (type === 'my-order') {
      navigate('/my-order', {
        state: {
          id: user?.id,
          token: user?.access_token
        }
      })
    } else {
      setShowModal(true);
      console.log("Gui đăng xuat cho sever ne")
      socket.emit('logout', { email });
      {/* Container để hiển thị thông báo */ }
      setTimeout(() => {
        handleLogout()
      }, 1000)

    }
    setIsOpenPopup(false)
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (

    <div style={{ heiht: '100%', width: '100%', display: 'flex', background: '#ffd400', justifyContent: 'center' }}>

      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
        <Col span={5}>
          <WrapperTextHeader to='/'>Trang chủ</WrapperTextHeader>
        </Col>

        {!isHiddenSearch && (
          <Col span={10}>
            <ButttonInputSearch
              size="large"
              bordered={false}
              textbutton="Tìm kiếm"
              placeholder="Nhập tìm kiếm"
              onChange={onSearch}
              backgroundColorButton="#ffac0a99"
            />
          </Col>
        )}
        <Col span={9} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
          <Loading isLoading={loading}>
            <WrapperHeaderAccout>
              {userAvatar ? (
                <img src={userAvatar} alt="avatar" style={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} />
              ) : (
                <UserOutlined style={{ fontSize: '30px' }} />
              )}
              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click" open={isOpenPopup}>
                    <div style={{ cursor: 'pointer', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
                  </Popover>
                </>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccout>
          </Loading>
          {!isHiddenCart && user?.access_token ? (
            <div onClick={() => user?.isAdmin ? navigate('/system/admin') : navigate('/order')} style={{ cursor: 'pointer' }}>
              <Badge count={order?.orderItems?.length} size="small">
                <ShoppingCartOutlined style={{ color: 'white', fontSize: '30px' }} />
              </Badge>
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>
          ) : (
            <div onClick={() => navigate('/sign-in')} style={{ cursor: 'pointer' }}>
              <Badge count={0} size="small">
                <ShoppingCartOutlined style={{ color: 'white', fontSize: '30px' }} />
              </Badge>
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>
          )}
          <span>
            {
              user?.isAdmin ? (
                <div onClick={() => navigate('/chatpage')} style={{ cursor: 'pointer' }}>
                  <WechatOutlined style={{ fontSize: '30px', color: '#fff' }} />
                  <WrapperTextHeaderSmall>Hỗ trợ</WrapperTextHeaderSmall>
                </div>
              ) : user?.access_token ? (
                <div onClick={() => navigate('/chatpage')} style={{ cursor: 'pointer' }}>
                  <WechatOutlined style={{ fontSize: '30px', color: '#fff' }} />
                  <WrapperTextHeaderSmall>Hỗ trợ</WrapperTextHeaderSmall>
                </div>
              ) : (
                <div onClick={() => navigate('/sign-in')} style={{ cursor: 'pointer' }}>
                  <WechatOutlined style={{ fontSize: '30px', color: '#fff' }} />
                  <WrapperTextHeaderSmall>Hỗ trợ</WrapperTextHeaderSmall>
                </div>
              )
            }

          </span>
          <span>
            {user?.isAdmin ? (
              <div onClick={() => navigate('/postnews')} style={{ cursor: 'pointer' }}>
                <MoneyCollectOutlined style={{ fontSize: '30px', color: '#fff' }} />
                <WrapperTextHeaderSmall>Đăng thông tin khuyến mãi</WrapperTextHeaderSmall>
              </div>
            ) : (
              // Có thể thêm logic hoặc hiển thị gì đó khi không chuyển hướng
              <div onClick={() => navigate('/promotion')} style={{ cursor: 'pointer' }}>
                <MoneyCollectOutlined style={{ fontSize: '30px', color: '#fff' }} />
                <WrapperTextHeaderSmall>Xem thông tin khuyến mãi</WrapperTextHeaderSmall>
              </div>
            )}
          </span>

        </Col>
      </WrapperHeader>
      <ModalWrapper showModal={showModal} modalMessage={modalMessage} closeModal={closeModal} />
    </div>


  )
}

export default HeaderComponent