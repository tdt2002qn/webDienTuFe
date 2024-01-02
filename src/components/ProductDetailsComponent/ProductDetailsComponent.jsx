import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './YourComponent.css';
import { Col, Image, Rate, Row } from 'antd'
import React from 'react'
import imageProductSmall from '../../assets/images/imagesmall.webp'
import { WrapperStyleImageSmall, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct, WrapperPriceTextProduct, WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber, WrapperBtnQualityProduct } from './style'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'
import { convertPrice, initFacebookSDK } from '../../utils'
import { useEffect } from 'react'
import * as message from '../Message/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'
import { useMemo } from 'react'
import socket from '../../services/socket'
const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const onChange = (value) => {
        setNumProduct(Number(value))
    }
    // SOCKET COMMET
    const [reviews, setReviews] = useState([]);


    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }
    useEffect(() => {
        initFacebookSDK()
    }, [])

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
        if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if (productDetails?.countInStock === 0) {
            setErrorLimitOrder(true)
        }
    }, [numProduct])

    useEffect(() => {
        if (order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSucessOrder])

    const handleChangeCount = (type, limited) => {
        if (type === 'increase') {
            if (!limited) {
                setNumProduct(numProduct + 1)
            }
        } else {
            if (!limited) {
                setNumProduct(numProduct - 1)
            }
        }
    }

    const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled: !!idProduct })
    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            // {
            //     name: { type: String, required: true },
            //     amount: { type: Number, required: true },
            //     image: { type: String, required: true },
            //     price: { type: Number, required: true },
            //     product: {
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref: 'Product',
            //         required: true,
            //     },
            // },
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInstock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
    }
    useEffect(() => {
        socket.emit('joinRoom', idProduct);

        // Other useEffect cleanup...

    }, [idProduct]);

    useEffect(() => {
        socket.on('commentHistory', (history) => {
            setReviews(history);

        });
        // Ngừng lắng nghe khi component unmount

    }, []); // [] đảm bảo chỉ thực hiện một lần sau khi component được render

    // Sử dụng useEffect để lắng nghe sự kiện khi có đánh giá mới từ server
    useEffect(() => {
        socket.on('newReview', (newReview) => {
            setReviews([...reviews, newReview]);
        });

    }, [reviews]); // Lắng nghe lại khi reviews thay đổi

    const addReview = (content, rating) => {
        // Gửi đánh giá mới tới server
        socket.emit('addReview', { content, rating: rating, user: user?.email, productId: idProduct });
    };

    return (
        <div>
            <Loading isLoading={isLoading}>
                <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px', height: '100%', marginBottom: '20px' }}>
                    <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                        <Image src={productDetails?.image} alt="image prodcut" preview={false} />
                        {/* <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                            <WrapperStyleColImage span={4} sty>
                                <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                            </WrapperStyleColImage>
                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                            </WrapperStyleColImage>

                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                            </WrapperStyleColImage>

                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                            </WrapperStyleColImage>

                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                            </WrapperStyleColImage>

                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                            </WrapperStyleColImage>

                        </Row> */}
                    </Col>
                    <Col span={14} style={{ paddingLeft: '10px' }}>
                        <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                        <div>
                            <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />

                        </div>
                        <WrapperPriceProduct>
                            <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
                        </WrapperPriceProduct>
                        <WrapperAddressProduct>
                            <span>Giao đến </span>
                            <span className='address'>{user?.address}</span>
                            {/* <span className='change-address'>Đổi địa chỉ</span> */}
                        </WrapperAddressProduct>
                        {/* <LikeButtonComponent
                            dataHref={process.env.REACT_APP_IS_LOCAL
                                ? "https://developers.facebook.com/docs/plugins/"
                                : window.location.href
                            }
                        /> */}
                        <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                            <div style={{ marginBottom: '10px' }}>Số lượng</div>
                            <WrapperQualityProduct>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                                    <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                                </button>
                                <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size="small" />
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}>
                                    <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                                </button>
                            </WrapperQualityProduct>
                        </div>
                        <div style={{ display: 'flex', aliggItems: 'center', gap: '12px' }}>
                            <div>
                                <ButtonComponent
                                    size={40}
                                    styleButton={{
                                        background: 'rgb(255, 57, 69)',
                                        height: '48px',
                                        width: '220px',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}
                                    onClick={handleAddOrderProduct}
                                    textbutton={'Chọn mua'}
                                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                ></ButtonComponent>
                                {errorLimitOrder && <div style={{ color: 'red' }}>San pham het hang</div>}
                            </div>
                            {/* <ButtonComponent
                                size={40}
                                styleButton={{
                                    background: '#fff',
                                    height: '48px',
                                    width: '220px',
                                    border: '1px solid rgb(13, 92, 182)',
                                    borderRadius: '4px'
                                }}
                                textbutton={'Mua trả sau'}
                                styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
                            ></ButtonComponent> */}
                        </div>
                    </Col>
                    {/* <CommentComponent
                        dataHref={process.env.REACT_APP_IS_LOCAL
                            ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                            : window.location.href
                        }
                        width="1270"
                    /> */}
                </Row >

            </Loading>

            <div className="review-container">
                {/* Form thêm đánh giá */}
                <form className="review-form" onSubmit={(e) => { e.preventDefault(); addReview({ content: e.target.elements.content.value, rating: e.target.elements.rating.value }); }}>
                    <input className="review-input" type="text" name="content" placeholder="Nhập nội dung đánh giá" />
                    <select className="review-select" name="rating">
                        <option value="1"><FontAwesomeIcon icon={faStar} /> 1 sao</option>
                        <option value="2"><FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} /> 2 sao</option>
                        <option value="3"><FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} /> 3 sao</option>
                        <option value="4"><FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} /> 4 sao</option>
                        <option value="5"><FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} /> 5 sao</option>
                    </select>
                    <button className="review-btn" type="submit">Thêm đánh giá</button>
                </form>

                {/* Hiển thị đánh giá và bình luận */}
                {reviews.map((review) => (
                    // Check if the review belongs to the current product
                    review.productId === idProduct && (
                        <div key={review._id} className="review-item">
                            <p className="review-user">{review.user}</p>
                            <p className="review-content">{review.content}</p>
                            <p className="review-rating">Đánh giá: {Array.from({ length: parseInt(review.rating, 10) }).map((_, index) => <FontAwesomeIcon key={index} icon={faStar} />)}</p>
                            <p className="review-date">Ngày đánh giá: {review.createdAt}</p>
                        </div>
                    )
                ))}
            </div>
        </div>

    )
}

export default ProductDetailsComponent