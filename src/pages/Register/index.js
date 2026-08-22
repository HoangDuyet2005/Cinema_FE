import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { register, resetErrorLoginRegister } from "../../reducers/actions/Auth";

export default function Register() {
  const { responseRegister, loadingRegister, errorRegister } = useSelector(
    (state) => state.authReducer
  );
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repassword: "",
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  useEffect(() => {
    if (responseRegister) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Đăng ký thành công!",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        history.push("/dangnhap", location.state);
      }, 1200);
    }
  }, [responseRegister, history, location.state]);

  useEffect(() => {
    dispatch(resetErrorLoginRegister());
    return () => {
      dispatch(resetErrorLoginRegister());
    };
  }, [dispatch]);

  // Hàm validate từng trường trực diện, bắt lỗi chuẩn xác và phản hồi tức thì
  const validateField = (field, value, allValues = formData) => {
    const val = value != null ? value.trim() : "";

    switch (field) {
      case "username": {
        if (!val) return "* Vui lòng nhập tên tài khoản!";
        if (val.length < 4 || val.length > 20) return "* Tên tài khoản phải từ 4 đến 20 ký tự!";
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(val)) {
          return "* Tên tài khoản chỉ gồm chữ cái, chữ số và dấu gạch dưới (_)";
        }
        return "";
      }

      case "password": {
        if (!value) return "* Vui lòng nhập mật khẩu!";
        if (value.length < 6 || value.length > 32) return "* Mật khẩu phải từ 6 đến 32 ký tự!";
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
        if (!passwordRegex.test(value)) {
          return "* Mật khẩu phải chứa ít nhất 1 chữ cái và 1 chữ số!";
        }
        return "";
      }

      case "repassword": {
        if (!value) return "* Vui lòng nhập lại mật khẩu!";
        if (value !== allValues.password) {
          return "* Mật khẩu xác nhận không trùng khớp!";
        }
        return "";
      }

      case "name": {
        if (!val) return "* Vui lòng nhập họ và tên!";
        return "";
      }

      case "email": {
        if (!val) return "* Vui lòng nhập email!";
        if (val.length > 50) return "* Email không được vượt quá 50 ký tự!";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(val)) {
          return "* Email không đúng định dạng!";
        }
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

    // Validate real-time ngay khi gõ phím
    const error = validateField(name, value, newFormData);
    setErrors((prev) => ({ ...prev, [name]: error }));

    // Nếu sửa mật khẩu, kiểm tra lại cả repassword nếu đã nhập
    if (name === "password" && newFormData.repassword) {
      const repassError = validateField("repassword", newFormData.repassword, newFormData);
      setErrors((prev) => ({ ...prev, repassword: repassError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Đánh dấu đã chạm vào tất cả các trường
    const allTouched = {
      username: true,
      password: true,
      repassword: true,
      name: true,
      email: true,
    };
    setTouched(allTouched);

    // Validate toàn bộ form đồng thời
    const newErrors = {
      username: validateField("username", formData.username, formData),
      password: validateField("password", formData.password, formData),
      repassword: validateField("repassword", formData.repassword, formData),
      name: validateField("name", formData.name, formData),
      email: validateField("email", formData.email, formData),
    };
    setErrors(newErrors);

    // Kiểm tra có lỗi nào không
    const hasError = Object.values(newErrors).some((err) => Boolean(err));
    if (hasError) {
      return;
    }

    if (!loadingRegister) {
      dispatch(resetErrorLoginRegister());
      const info = {
        email: formData.email.trim(),
        name: formData.name.trim(),
        password: formData.password,
        username: formData.username.trim(),
      };
      dispatch(register(info));
    }
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
          Đăng Ký Tài Khoản
        </h2>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
          Tạo tài khoản để trải nghiệm đặt vé xem phim tuyệt vời cùng <b style={{ color: "#dc2626" }}>World Cinema</b>!
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 1. TÊN TÀI KHOẢN */}
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
            Tên tài khoản <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            name="username"
            type="text"
            placeholder="Nhập Tên tài khoản"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "2px",
              border: (errors.username && touched.username) || (errorRegister && errorRegister.includes("Tên tài khoản")) ? "1.5px solid #dc2626" : "1.5px solid #d1d5db",
              backgroundColor: "#ffffff",
              fontSize: "14.5px",
              color: "#1e293b",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              if (!errors.username) {
                e.target.style.borderColor = "#60a5fa";
                e.target.style.boxShadow = "0 0 0 3px rgba(96, 165, 250, 0.2)";
              }
            }}
            onBlurCapture={(e) => {
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.username && (touched.username || formData.username.length > 0) && (
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
              <span>{errors.username}</span>
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
              type={showPassword1 ? "text" : "password"}
              placeholder="Nhập Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                width: "100%",
                padding: "10px 40px 10px 14px",
                borderRadius: "2px",
                border: errors.password && touched.password ? "1.5px solid #dc2626" : "1.5px solid #d1d5db",
                backgroundColor: "#ffffff",
                fontSize: "14.5px",
                color: "#1e293b",
                outline: "none",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                if (!errors.password) {
                  e.target.style.borderColor = "#60a5fa";
                  e.target.style.boxShadow = "0 0 0 3px rgba(96, 165, 250, 0.2)";
                }
              }}
              onBlurCapture={(e) => {
                e.target.style.boxShadow = "none";
              }}
            />
            <div
              onClick={() => setShowPassword1(!showPassword1)}
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
              <i className={showPassword1 ? "fa fa-eye-slash" : "fa fa-eye"}></i>
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

        {/* 3. XÁC NHẬN MẬT KHẨU */}
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
            Xác nhận mật khẩu <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              name="repassword"
              type={showPassword2 ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={formData.repassword}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                width: "100%",
                padding: "10px 40px 10px 14px",
                borderRadius: "2px",
                border: errors.repassword && touched.repassword ? "1.5px solid #dc2626" : "1.5px solid #d1d5db",
                backgroundColor: "#ffffff",
                fontSize: "14.5px",
                color: "#1e293b",
                outline: "none",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                if (!errors.repassword) {
                  e.target.style.borderColor = "#60a5fa";
                  e.target.style.boxShadow = "0 0 0 3px rgba(96, 165, 250, 0.2)";
                }
              }}
              onBlurCapture={(e) => {
                e.target.style.boxShadow = "none";
              }}
            />
            <div
              onClick={() => setShowPassword2(!showPassword2)}
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
              <i className={showPassword2 ? "fa fa-eye-slash" : "fa fa-eye"}></i>
            </div>
          </div>
          {errors.repassword && (touched.repassword || formData.repassword.length > 0) && (
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
              <span>{errors.repassword}</span>
            </div>
          )}
        </div>

        {/* 4. HỌ VÀ TÊN */}
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
            Họ và tên <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            name="name"
            type="text"
            placeholder="Nhập Họ và tên"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "2px",
              border: errors.name && touched.name ? "1.5px solid #dc2626" : "1.5px solid #d1d5db",
              backgroundColor: "#ffffff",
              fontSize: "14.5px",
              color: "#1e293b",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              if (!errors.name) {
                e.target.style.borderColor = "#60a5fa";
                e.target.style.boxShadow = "0 0 0 3px rgba(96, 165, 250, 0.2)";
              }
            }}
            onBlurCapture={(e) => {
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.name && (touched.name || formData.name.length > 0) && (
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
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* 5. EMAIL */}
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
            Email <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="Nhập Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "2px",
              border: (errors.email && touched.email) || (errorRegister && errorRegister.includes("Email")) ? "1.5px solid #dc2626" : "1.5px solid #d1d5db",
              backgroundColor: "#ffffff",
              fontSize: "14.5px",
              color: "#1e293b",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              if (!errors.email) {
                e.target.style.borderColor = "#60a5fa";
                e.target.style.boxShadow = "0 0 0 3px rgba(96, 165, 250, 0.2)";
              }
            }}
            onBlurCapture={(e) => {
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.email && (touched.email || formData.email.length > 0) && (
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
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* NÚT ĐĂNG KÝ */}
        <div style={{ marginTop: "6px" }}>
          <button
            type="submit"
            disabled={loadingRegister}
            style={{
              width: "100%",
              padding: "12px 20px",
              borderRadius: "2px",
              backgroundColor: loadingRegister ? "#cbd5e1" : "#dc2626",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "700",
              border: "none",
              cursor: loadingRegister ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!loadingRegister) e.target.style.backgroundColor = "#b91c1c";
            }}
            onMouseLeave={(e) => {
              if (!loadingRegister) e.target.style.backgroundColor = "#dc2626";
            }}
          >
            {loadingRegister ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Đang xử lý đăng ký...</span>
              </>
            ) : (
              "Đăng ký tài khoản"
            )}
          </button>

          {/* THÔNG BÁO LỖI TỪ SERVER */}
          {errorRegister && (
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
              <span>{errorRegister}</span>
            </div>
          )}
        </div>

        {/* Footer chuyển sang Đăng nhập */}
        <div
          style={{
            textAlign: "center",
            marginTop: "4px",
            fontSize: "13.5px",
            color: "#64748b",
          }}
        >
          Đã có tài khoản?{" "}
          <span
            onClick={() => history.push("/dangnhap", location.state)}
            style={{
              color: "#dc2626",
              fontWeight: "700",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Đăng nhập ngay
          </span>
        </div>
      </form>
    </div>
  );
}