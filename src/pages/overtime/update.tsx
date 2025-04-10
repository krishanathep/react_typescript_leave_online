import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from 'sweetalert2';
import { useEffect } from "react";

const API_BASE_URL = "https://full-stack-app.com/laravel_auth_jwt_api_hrd/public/api";

// Function to fetch employee details
const fetchEmployeeDetails = async (employeeId: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Function to update an existing employee
const updateEmployeeRequest = async ({ id, data }: { id: string, data: any }) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_BASE_URL}/employees-update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

const EmployeeUpdate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams(); // Get the employee ID from URL params
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  // Fetch employee data when component loads
  const { data, isLoading, isError } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployeeDetails(id as string),
    enabled: !!id, // Only run query if id exists
  });

  // Use useEffect to set form values after data is loaded
  useEffect(() => {
    if (data && data.employee) {
      // Set each field individually to ensure the form gets updated
      const employeeData = data.employee;
      setValue("emp_id", employeeData.emp_id);
      setValue("emp_name", employeeData.emp_name);
      setValue("position", employeeData.position);
      setValue("agency", employeeData.agency);
      setValue("department", employeeData. department);
      setValue("dept", employeeData.dept);
      setValue("bus_group", employeeData.bus_group);
    }
    // If API returns flat data without employee wrapper
    else if (data) {
      setValue("emp_id", data.emp_id);
      setValue("emp_name", data.emp_name);
      setValue("position", data.position);
      setValue("agency", data.agency);
      setValue("department", data.department);
      setValue("dept", data.dept);
      setValue("bus_group", data.bus_group);
    }
  }, [data, setValue]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateEmployeeRequest,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      
      Swal.fire({
        icon: "success",
        title: "อัพเดตข้อมูลพนักงานสำเร็จ",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/overtime");
    },
    onError: (error) => {
      console.error("Failed to update employee:", error);
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถอัพเดตข้อมูลพนักงาน",
        text: "กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ",
        confirmButtonText: "ตกลง"
      });
    }
  });

  const handleUpdateSubmit = async (data: any) => {
    updateMutation.mutate({ id: id as string, data });
  };

  // Check data in console for debugging
  useEffect(() => {
    if (data) {
      console.log("Fetched employee data:", data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="content-wrapper">
        <div className="content">
          <div className="container-fluid">
            <div className="d-flex justify-content-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">กำลังโหลด...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="content-wrapper">
        <div className="content">
          <div className="container-fluid">
            <div className="alert alert-danger">
              เกิดข้อผิดพลาดในการโหลดข้อมูลพนักงาน กรุณาลองใหม่อีกครั้ง
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/overtime")}
            >
              <i className="fas fa-arrow-circle-left"></i> ย้อนกลับ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Employee Update</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Employees</a>
                  </li>
                  <li className="breadcrumb-item active">Update</li>
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
                    Employee Update
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit(handleUpdateSubmit)}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="emp_id">รหัสพนักงาน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="emp_id"
                              placeholder="กรอกรหัสพนักงาน"
                              {...register("emp_id", { required: true })}
                            />
                            {errors.emp_id && (
                              <span className="text-danger">
                                กรุณากรอกรหัสพนักงาน
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="emp_name">ชื่อพนักงาน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="emp_name"
                              placeholder="กรอกชื่อพนักงาน"
                              {...register("emp_name", { required: true })}
                            />
                            {errors.emp_name && (
                              <span className="text-danger">
                                กรุณากรอกชื่อพนักงาน
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="position">ตำแหน่ง :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="position"
                              placeholder="กรอกตำแหน่ง"
                              {...register("position", { required: true })}
                            />
                            {errors.position && (
                              <span className="text-danger">
                                กรุณากรอกตำแหน่ง
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="agency">หน่วยงาน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="agency"
                              placeholder="กรอกหน่วยงาน"
                              {...register("agency", { required: true })}
                            />
                            {errors.agency && (
                              <span className="text-danger">
                                กรุณากรอกหน่วยงาน
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="department">ส่วนงาน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="department"
                              placeholder="กรอกส่วนงาน"
                              {...register("department", { required: true })}
                            />
                            {errors.department && (
                              <span className="text-danger">
                                กรุณากรอกส่วนงาน
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="dept">ฝ่ายงาน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="dept"
                              placeholder="กรอกฝ่ายงาน"
                              {...register("dept", { required: true })}
                            />
                            {errors.dept && (
                              <span className="text-danger">
                                กรุณากรอกฝ่ายงาน
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="bus_group">ประเภทงาน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="bus_group"
                              placeholder="กรอกประเภทงาน"
                              {...register("bus_group", { required: true })}
                            />
                            {errors.bus_group && (
                              <span className="text-danger">
                                กรุณากรอกประเภทงาน
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="float-right">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={updateMutation.isPending}
                            >
                              {updateMutation.isPending ? (
                                <>
                                  <span className="spinner-border spinner-border-sm"></span>{'  '}
                                  Loading...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-check-circle"></i>{' '}Submit
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

export default EmployeeUpdate;