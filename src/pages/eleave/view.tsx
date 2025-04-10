import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";

const API_BASE_URL =
  "https://full-stack-app.com/laravel_auth_jwt_api/public/api";

// Function to fetch a single overtime request
const fetchEleave = async (id: any) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/eleave/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.eleave;
};

const EleaveView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch overtime request data using React Query
  const {
    data: eleave,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["eleave", id],
    queryFn: () => fetchEleave(id),
    retry: 1,
  });

  if (isError) {
    console.error("Error fetching eleave :", error);
  }

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          {/* <div className="container-fluid">
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
          </div> */}
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header bg-light">Eleave View</div>
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
                        Failed to load eleave data. Please try again.
                      </div>
                    ) : (
                      <div className="row">
                        <div className="container-fluid">
                          <table className="table table-bordered">
                            <tbody>
                              <tr>
                                <th>รหัส :</th>
                                <td width="50%">LE-104025-{eleave?.emp_id}</td>
                              </tr>
                              <tr>
                                <th>ชื่อพนักงาน :</th>
                                <td width="50%">{eleave?.emp_name}</td>
                              </tr>
                              <tr>
                                <th>ตำแหน่ง :</th>
                                <td width="50%">{eleave?.emp_dept}</td>
                              </tr>
                              <tr>
                                <th>หัวข้อการลา :</th>
                                <td width="50%">{eleave?.leave_title}</td>
                              </tr>
                              <tr>
                                <th>ประเภท :</th>
                                <td width="50%">{eleave?.leave_type}</td>
                              </tr>
                              <tr>
                                <th>รายละเอียด :</th>
                                <td width="50%">{eleave?.leave_desc}</td>
                              </tr>
                              <tr>
                                <th>วันที่ลา :</th>
                                <td width="50%">
                                  {eleave?.leave_date
                                    ? dayjs(eleave.leave_date).format(
                                        "DD-MMM-YYYY"
                                      )
                                    : ""}
                                </td>
                              </tr>
                              <tr>
                                <th>จำนวน :</th>
                                <td width="50%">{eleave?.leave_total}</td>
                              </tr>
                              <tr>
                                <th>สถานะ :</th>
                                <td width="50%">{eleave?.leave_status}</td>
                              </tr>
                              <tr>
                                <th>ไฟล์แนบ :</th>
                                <td width="50%">{eleave?.file}</td>
                              </tr>
                              <tr>
                                <th>วันที่สร้าง :</th>
                                <td width="50%">
                                  {eleave?.created_at
                                    ? dayjs(eleave.created_at).format(
                                        "DD-MMM-YYYY"
                                      )
                                    : ""}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col-md-12">
                          <div className="float-right">
                            <button
                              type="button"
                              onClick={() => navigate("/leave")}
                              className="btn btn-danger"
                            >
                              <i className="fas fa-arrow-circle-left"></i> Go
                              back
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

export default EleaveView;
