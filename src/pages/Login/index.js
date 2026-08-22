import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { login, resetErrorLoginRegister } from "../../reducers/actions/Auth";
import { LOADING_BACKTO_HOME } from "../../reducers/constants/Lazy";

export default function Login() {
  const { currentUser, loadingLogin, errorLogin } = useSelector(
    (state) => state.authReducer
  );
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Đăng nhập thành công!",
        showConfirmButton: false,
        timer: 1200,
      });

      setTimeout(() => {
        if (location.state === "/") {
          dispatch({ type: LOADING_BACKTO_HOME });
          history.push("/");
          return;
        }
        if (
          location.state &&
          location.state.startsWith("/admin") &&
          !currentUser?.data?.role?.includes("ROLE_ADMIN")
        ) {
          history.push("/");
        } else if (
          location.state &&
          location.state.startsWith("/staff") &&
          !currentUser?.data?.role?.includes("ROLE_STAFF")
        ) {
          history.push("/");
        } else {
          history.push(location.state || "/");
        }
      }, 500);
    }
  }, [currentUser, history, location.state, dispatch]);

  useEffect(() => {
    dispatch(resetErrorLoginRegister());
    return () => {
      dispatch(resetErrorLoginRegister());
    };
  }, [dispatch]);

  const validateField = (field, value) => {
    const val = value != null ? value.trim() : "";
    switch (field) {
      case "usernameOrEmail": {
        if (!val) return "* Vui lòng nhập tên tài khoản hoặc email!";
        return "";
      }
      case "password": {
        if (!value) return "* Vui lòng nhập mật khẩu!";
        return "";
      }
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allTouched = {
      usernameOrEmail: true,
      password: true,
    };
    setTouched(allTouched);

    const newErrors = {
      usernameOrEmail: validateField("usernameOrEmail", formData.usernameOrEmail),
      password: validateField("password", formData.password),
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => Boolean(err));
    if (hasError) return;

    if (!loadingLogin) {
      dispatch(resetErrorLoginRegister());
      dispatch(
        login({
          usernameOrEmail: formData.usernameOrEmail.trim(),
          password: formData.password,
        })
      );
    }
  };

  const handleGoToRegister = () => {
    dispatch(resetErrorLoginRegister());
    history.push("/dangky", location.state);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "460px",
        backgroundColor: "#ffffff",
        borderRadius: "0px",
        padding: "32px 28px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
        margin: "0 auto",
      }}
    >
      {/* Tiêu đề Form */}
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <h2
          style={{
            fontSize: "23px",
            fontWeight: "800",
            color: "#1e293b",
            marginBottom: "6px",
            letterSpacing: "-0.3px",
          }}
        >
          Đăng Nhập
        </h2>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
          Đăng nhập để trải nghiệm đặt vé xem phim tuyệt vời cùng <b style={{ color: "#dc2626" }}>World Cinema</b>!
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* 1. TÊN TÀI KHOẢN HOẶC EMAIL */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#4b5563",
              marginBottom: "5px",
            }}
          >
            Tên tài khoản hoặc Email <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            name="usernameOrEmail"
            type="text"
            placeholder="Nhập Tên tài khoản hoặc Email"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "2px",
              border:
                (errors.usernameOrEmail && touched.usernameOrEmail) || errorLogin
                  ? "1.5px solid #dc2626"
                  : "1.5px solid #d1d5db",
              backgroundColor: "#ffffff",
              fontSize: "14.5px",
              color: "#1e293b",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              if (!errors.usernameOrEmail && !errorLogin) {
                e.target.style.borderColor = "#60a5fa";
                e.target.style.boxShadow = "0 0 0 3px rgba(96, 165, 250, 0.2)";
              }
            }}
            onBlurCapture={(e) => {
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.usernameOrEmail && (touched.usernameOrEmail || formData.usernameOrEmail.length > 0) && (
            <div
              style={{
                color: "#dc2626",
                fontSize: "12px",
                fontWeight: "600",
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>⚠️</span>
              <span>{errors.usernameOrEmail}</span>
            </div>
          )}
        </div>

        {/* 2. MẬT KHẨU */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#4b5563",
              marginBottom: "5px",
            }}
          >
            Mật khẩu <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                width: "100%",
                padding: "10px 40px 10px 14px",
                borderRadius: "2px",
                border:
                  (errors.password && touched.password) || errorLogin
                    ? "1.5px solid #dc2626"
                    : "1.5px solid #d1d5db",
                backgroundColor: "#ffffff",
                fontSize: "14.5px",
                color: "#1e293b",
                outline: "none",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                if (!errors.password && !errorLogin) {
                  e.target.style.borderColor = "#60a5fa";
                  e.target.style.boxShadow = "0 0 0 3px rgba(96, 165, 250, 0.2)";
                }
              }}
              onBlurCapture={(e) => {
                e.target.style.boxShadow = "none";
              }}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#64748b",
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
            </div>
          </div>
          {errors.password && (touched.password || formData.password.length > 0) && (
            <div
              style={{
                color: "#dc2626",
                fontSize: "12px",
                fontWeight: "600",
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>⚠️</span>
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        {/* NÚT ĐĂNG NHẬP */}
        <div style={{ marginTop: "8px" }}>
          <button
            type="submit"
            disabled={loadingLogin}
            style={{
              width: "100%",
              padding: "12px 20px",
              borderRadius: "2px",
              backgroundColor: loadingLogin ? "#cbd5e1" : "#dc2626",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "700",
              border: "none",
              cursor: loadingLogin ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!loadingLogin) e.target.style.backgroundColor = "#b91c1c";
            }}
            onMouseLeave={(e) => {
              if (!loadingLogin) e.target.style.backgroundColor = "#dc2626";
            }}
          >
            {loadingLogin ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>

          {/* THÔNG BÁO LỖI ĐĂNG NHẬP */}
          {errorLogin && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px 14px",
                borderRadius: "2px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: "13px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                lineHeight: "1.4",
              }}
            >
              <span style={{ fontSize: "15px" }}>❌</span>
              <span>Tài khoản hoặc mật khẩu không chính xác!</span>
            </div>
          )}
        </div>

        {/* Footer chuyển sang Đăng ký */}
        <div
          style={{
            textAlign: "center",
            marginTop: "6px",
            fontSize: "13.5px",
            color: "#64748b",
          }}
        >
          Chưa có tài khoản?{" "}
          <span
            onClick={handleGoToRegister}
            style={{
              color: "#dc2626",
              fontWeight: "700",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Đăng ký ngay
          </span>
        </div>
      </form>
    </div>
  );
}