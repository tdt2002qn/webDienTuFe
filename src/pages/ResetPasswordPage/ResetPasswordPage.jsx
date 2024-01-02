import React, { useEffect, useState } from "react";
import { WrapperContainerLeft, WrapperContainerRight } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as UserService from "../../services/UserService";
import * as message from '../../components/Message/Message'

const ResetPasswordPage = () => {
  const location = useLocation()
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/sign-in");
  };
  const mutation = useMutationHooks((data) => UserService.resetPassword(data));

  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success()
      if(location?.state) {
        navigate(location?.state)
      }else {
        navigate('/sign-in')
      }
      // localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      // localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
      // if (data?.access_token) {
      //   const decoded = jwtDecode(data?.access_token)
      //   if (decoded?.id) {
      //     handleGetDetailsUser(decoded?.id, data?.access_token)
      //   }
      // }
    }if(isError){
      message.error()
    }
  }, [isSuccess, isError])

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleResetPassword = () => {
    mutation.mutate({
      resetToken,
      password,
    });
  };

  return (
    <div style={{ padding: '0 120px' }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "500px",
            height: "445px",
            borderRadius: "6px",
            background: "#fff",
            display: "flex",
          }}
        >
          <WrapperContainerLeft>
            <h1>Đặt lại mật khẩu</h1>
            <p>Nhập mật khẩu mới</p>

            <div style={{ position: "relative" }}>
              <span
                onClick={() => setIsShowPassword(!isShowPassword)}
                style={{
                  zIndex: 10,
                  position: "absolute",
                  top: "4px",
                  right: "8px",
                }}
              >
                {isShowPassword ? (<EyeFilled />): (<EyeInvisibleFilled />)}
              </span>
              <InputForm
                placeholder="Mật khẩu mới"
                type={isShowPassword ? "text" : "password"}
                value={password}
                onChange={handleOnchangePassword}
              />
            </div>
            {data?.status === "ERR" && (
              <span style={{ color: "red" }}>{data?.message}</span>
            )}
            <Loading isLoading={isLoading}>
              <ButtonComponent
                styleButton={{
                  background: "red",
                  height: "48px",
                  width: "100%",
                  border: "none",
                  margin: "26px 0 20px",
                }}
                disabled={!password.length}
                onClick={handleResetPassword}
                size={60}
                textbutton={"Đặt lại mật khẩu"}
                styleTextButton={{ color: "#fff", fontSize: "15px" }}
              ></ButtonComponent>
            </Loading>
            <p onClick={handleGoBack} style={{ color: "blue", cursor: "pointer" }}>
              Quay lại đăng nhập
            </p>
          </WrapperContainerLeft>
          <WrapperContainerRight></WrapperContainerRight>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
