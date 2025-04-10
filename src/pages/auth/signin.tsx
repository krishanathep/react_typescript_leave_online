import { useState } from "react";
import { useForm } from "react-hook-form";
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { useNavigate } from "react-router-dom";
import Preloader from "../../components/Preloader";
import logo from "/assets/imgs/calendar_5387962.png";
import axios from "axios";

const Signin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const signIn = useSignIn();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const REACT_APP_API =
    "https://full-stack-app.com/laravel_auth_jwt_api/public/api/auth/login";

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await axios.post(REACT_APP_API, data).then((res) => {
          if (
            signIn({
              auth: {
                token: res.data.access_token,
                type: "Bearer",
              },
              userState: res.data.user,
            })
          ) {
            navigate("/");
          }
      });
    } catch (error) {
      console.log(error);
      reset({
        email: "",
        password: "",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading === true) {
    return <Preloader />;
  }

  return (
    <>
      <div className="hold-transition login-page">
        <div className="login-box">
        <div className="login-logo">
            <a href="#">
              {/* <b>OT-</b>REQUEST */}
              <img src={logo} width="25%" alt="" />
            </a>
          </div>
          <div id="auth_bg" className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Sign in to start your session</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group mb-3">
                  <input
                    className="form-control"
                    //value={"test@gmail.com"}
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: true })}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-envelope" />
                    </div>
                  </div>
                </div>
                {errors.email && (
                  <p className="text-danger">This username field is required</p>
                )}
                <div className="input-group mb-3">
                  <input
                    className="form-control"
                    //value={"123456"}
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: true })}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                </div>
                {errors.password && (
                  <p className="text-danger">This password field is required</p>
                )}
                <div className="row">
                  <div className="col-8"></div>
                  <div className="col-4">
                    <button type="submit" className="btn btn-primary btn-block">
                      Sign In
                    </button>
                  </div>
                </div>
              </form>
              <p className="mb-0 mt-2">
                {/* <Link to={'/auth/signup'} className="text-center">
                Register a new membership
              </Link> */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
