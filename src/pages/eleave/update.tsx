import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from 'sweetalert2';
import { useEffect } from "react";

const API_BASE_URL = "https://full-stack-app.com/laravel_auth_jwt_api/public/api";

// Function to fetch employee details
const fetchEleaveDetails = async (eleaveID: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/eleave/${eleaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Function to update an existing employee
const updateEleaveRequest = async ({ id, data }: { id: string, data: any }) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_BASE_URL}/eleave-update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

const EleaveUpdate = () => {
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
    queryFn: () => fetchEleaveDetails(id as string),
    enabled: !!id, // Only run query if id exists
  });

  // Use useEffect to set form values after data is loaded
  useEffect(() => {
    if (data && data.eleave) {
      // Set each field individually to ensure the form gets updated
      const eleaveData = data.eleave;
      setValue("emp_id", eleaveData.emp_id);
      setValue("emp_name", eleaveData.emp_name);
      setValue("emp_dept", eleaveData.emp_dept);
      setValue("leave_title", eleaveData.leave_title);
      setValue("leave_desc", eleaveData.leave_desc);
      setValue("leave_type", eleaveData.leave_type);
      setValue("leave_total", eleaveData.leave_total);
      setValue("leave_date", eleaveData.leave_date);
      setValue("file", eleaveData.file);
      setValue("leave_status", eleaveData.leave_status);
    }
    // If API returns flat data without employee wrapper
    else if (data) {
      setValue("emp_id", data.emp_id);
      setValue("emp_name", data.emp_name);
      setValue("emp_dept", data.emp_dept);
      setValue("leave_title", data.leave_title);
      setValue("leave_desc", data.leave_desc);
      setValue("leave_type", data.leave_type);
      setValue("leave_total", data.leave_total);
      setValue("leave_date", data.leave_date);
      setValue("file", data.file);
      setValue("leave_status", data.leave_status);
    }
  }, [data, setValue]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateEleaveRequest,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['eleaves'] });
      queryClient.invalidateQueries({ queryKey: ['eleave', id] });
      
      Swal.fire({
        icon: "success",
        title: "อัพเดตข้อมูลพนักงานสำเร็จ",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/leave");
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
      console.log("Fetched eleave data:", data);
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
              onClick={() => navigate("/eleave")}
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
                            <label htmlFor="title">รหัส :</label>
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
                              {...register("emp_dept", { required: true })}
                            />
                            {errors.emp_dept && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="user">หัวข้อการลา :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              placeholder="Enter your data"
                              {...register("leave_title", { required: true })}
                            />
                            {errors.leave_title && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="user">รายละเอียด :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              placeholder="Enter your data"
                              {...register("leave_desc", { required: true })}
                            />
                            {errors.leave_desc && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="user">ประเภท :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              placeholder="Enter your data"
                              {...register("leave_type", { required: true })}
                            />
                            {errors.leave_type && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="user">วันที่ลา :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              placeholder="Enter your data"
                              {...register("leave_date", { required: true })}
                            />
                            {errors.leave_date && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="user">จำนวน :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              placeholder="Enter your data"
                              {...register("leave_total", { required: true })}
                            />
                            {errors.leave_total && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="user">สถานะ :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              placeholder="Enter your data"
                              {...register("leave_status", { required: true })}
                            />
                            {errors.leave_status && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="user">ไฟล์แนบ :</label>
                            <input
                              type="text"
                              className="form-control"
                              id="user"
                              placeholder="Enter your data"
                              {...register("file", { required: true })}
                            />
                            {errors.file && (
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
                              disabled={updateMutation.isPending}
                            >
                              {updateMutation.isPending ? (
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
                              onClick={() => navigate("/leave")}
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

export default EleaveUpdate;