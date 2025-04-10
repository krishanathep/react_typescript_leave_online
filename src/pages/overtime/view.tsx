import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";

const API_BASE_URL = "https://full-stack-app.com/laravel_auth_jwt_api_hrd/public/api";

// Function to fetch a single overtime request
const fetchOvertimeRequest = async (id:any) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/employees/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.employee;
};

const EmployeeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch overtime request data using React Query
  const { data: employee, isLoading, isError, error } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchOvertimeRequest(id),
    retry: 1,
  });

  if (isError) {
    console.error("Error fetching employee :", error);
  }

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Employee View</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Employees</a>
                  </li>
                  <li className="breadcrumb-item active">View</li>
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
                  Employee View
                  </div>
                  <div className="card-body">
                    {isLoading ? (
                      <div className="text-center p-5">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : isError ? (
                      <div className="alert alert-danger">
                        Failed to load employee data. Please try again.
                      </div>
                    ) : (
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="" className="font-weight-bold">รหัสพนักงาน : </label>
                            <span className="ml-2">{employee?.emp_id}</span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="" className="font-weight-bold">ชื่อพนักงาน : </label>
                            <span className="ml-2">{employee?.emp_name}</span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="" className="font-weight-bold">ตำแหน่ง : </label>
                            <span className="ml-2">{employee?.position}</span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="" className="font-weight-bold">หน่วยงาน : </label>
                            <span className="ml-2">{employee?.agency}</span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="" className="font-weight-bold">ส่วนงาน : </label>
                            <span className="ml-2">{employee?.department}</span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="" className="font-weight-bold">ฝ่ายงาน : </label>
                            <span className="ml-2">{employee?.dept}</span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="" className="font-weight-bold">บริษัท : </label>
                            <span className="ml-2">{employee?.company}</span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="" className="font-weight-bold">Update : </label>
                            <span className="ml-2">
                              {employee?.updated_at ? dayjs(employee.updated_at).format("DD-MMM-YYYY") : ""}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="" className="font-weight-bold">Created : </label>
                            <span className="ml-2">
                              {employee?.created_at ? dayjs(employee.created_at).format("DD-MMM-YYYY") : ""}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="float-right">
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
                    )}
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

export default EmployeeView;