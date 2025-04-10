import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from 'sweetalert2';

const API_BASE_URL = "https://full-stack-app.com/laravel_auth_jwt_api_hrd/public/api";

// Function to create a new overtime request
const createEmployeeRequest = async (employeeData:any) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_BASE_URL}/employees-create`, employeeData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

const EmployeeCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createEmployeeRequest,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      Swal.fire({
        icon: "success",
        title: "Your Employee has been created",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/overtime");
    },
    onError: (error) => {
      console.error("Failed to employee request:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to create empoyee request",
        text: "Please try again or contact support",
        confirmButtonText: "OK"
      });
    }
  });

  const handleCreateSubmit = async (data:any) => {
    createMutation.mutate(data);
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Empoyee Create</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Employees</a>
                  </li>
                  <li className="breadcrumb-item active">Create</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header bg-light">
                  Employee Create
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit(handleCreateSubmit)}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="title">รหัสพนักงาน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="title"
                              placeholder="Enter your data"
                              {...register("emp_id", { required: true })}
                            />
                            {errors.emp_id && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="title">ชื่อพนักงาน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="title"
                              placeholder="Enter your data"
                              {...register("emp_name", { required: true })}
                            />
                            {errors.emp_name && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="user">ตำแหน่ง :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              placeholder="Enter your data"
                              {...register("position", { required: true })}
                            />
                            {errors.position && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="user">หน่วยงาน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              placeholder="Enter your data"
                              {...register("agency", { required: true })}
                            />
                            {errors.agency && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="user">ส่วนงาน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              placeholder="Enter your data"
                              {...register("department", { required: true })}
                            />
                            {errors.department && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="user">ฝ่ายงาน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              placeholder="Enter your data"
                              {...register("dept", { required: true })}
                            />
                            {errors.dept && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="user">ประเภทงาน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              placeholder="Enter your data"
                              {...register("bus_group", { required: true })}
                            />
                            {errors.bus_group && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="float-right">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={createMutation.isPending}
                            >
                              {createMutation.isPending ? (
                                <>
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                  Loading...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-check-circle mr-1"></i> Submit
                                </>
                              )}
                            </button>{" "}
                            <button
                              type="button"
                              onClick={() => navigate("/overtime")}
                              className="btn btn-danger"
                            >
                               <i className="fas fa-arrow-circle-left"></i>
                               {' '}Go back
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeCreate;