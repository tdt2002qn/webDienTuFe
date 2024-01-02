import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
const CardComponent = (props) => {
    const user = useSelector((state) => state.user);
    const { countInStock, description, image, name, price, rating, type, discount, selled, id } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {

        // Nếu user đã đăng nhập, bạn có thể thực hiện hành động cần thiết ở đây
        if (user?.access_token) {
            navigate(`/product-details/${id}`)
            console.log('ko')
        } else {
            navigate(`/sign-in`)
            console.log('ok')
        }


    }
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: '200px', height: '200px' }}
            style={{ width: 200 }}
            bodyStyle={{ padding: '10px' }}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailsProduct(id)}
        >
            <img
                src={logo}
                style={{
                    width: '68px',
                    height: '14px',
                    position: 'absolute',
                    top: -1,
                    left: -1,
                    borderTopLeftRadius: '3px'
                }}
            />
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating} </span> <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
                </span>
                <WrapperStyleTextSell> | Đã bán {selled}+</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>

            </WrapperPriceText>
        </WrapperCardStyle>
    )
}

export default CardComponent