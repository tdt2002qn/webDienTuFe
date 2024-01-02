import React, { useState } from "react";
import { WrapperContainerLeft, WrapperContainerRight } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";

const ForgotPasswordPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const mutation = useMutationHooks((data) => UserService.forgotPassword(data));

  const { data, isLoading, isSuccess } = mutation;

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const handleGoBack = () => {
    navigate("/sign-in");
  };

  const handleResetPassword = () => {
    mutation.mutate({
      email,
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
            <h1>Quên Mật Khẩu</h1>
            <p>Nhập địa chỉ email của bạn để khôi phục mật khẩu</p>

            <InputForm
              style={{ marginBottom: "10px" }}
              placeholder="Email"
              onChange={handleOnchangeEmail}
            />

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
                {/* {isShowPassword ? (<EyeFilled /> ): (<EyeInvisibleFilled />)} */}
              </span>
              {/* Không cần mật khẩu ở trang quên mật khẩu */}
              {/* <InputForm
                placeholder="Mật khẩu"
                type={isShowPassword ? "text" : "password"}
              /> */}
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
                disabled={!email.length}
                onClick={handleResetPassword}
                size={60}
                textbutton={"Khôi phục mật khẩu"}
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

export default ForgotPasswordPage;
