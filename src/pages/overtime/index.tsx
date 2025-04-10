import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { DataTable } from "mantine-datatable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

interface Employee {
  id: number;
  emp_id: string;
  emp_name: string;
  work_exp: string;
  ot_date: string;
  bus_group: string;
  start_date: string;
  position: string;
  agency: string;
  department: string;
  dept: string;
  company: string;
  create_name: string;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL =
  "https://full-stack-app.com/laravel_auth_jwt_api_hrd/public/api";

// Function to fetch overtimes
const fetchEmployees = async () => {
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
  const response = await axios.get(`${API_BASE_URL}/employees`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  //console.log(response.data)
  return response.data.employees;
};

// Function to delete overtime
const deleteEmployee = async (id: number) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_BASE_URL}/employees-delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const Employees = () => {
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<Employee[]>([]);

  const queryClient = useQueryClient();

  // Fetch overtimes using react-query
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  // แก้ไขฟังก์ชัน handleDeleteEvent:
  const handleDeleteEvent = (employee: Employee) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete employee ${employee.emp_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(employee.id);
      }
    });
  };

  useEffect(() => {
    if (Array.isArray(employees) && employees.length > 0) {
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      setRecords(employees.slice(from, to));
    } else {
      setRecords([]);
    }
  }, [page, pageSize, employees]);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Employees list</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Employees</li>
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
                    Employees list
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="float-right">
                          <Link
                            to={"/overtime/create"}
                            className="btn btn-success mb-2"
                          >
                            <i className="fas fa-plus"></i> Create
                          </Link>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <DataTable
                          style={{
                            fontFamily: "Prompt",
                          }}
                          withBorder
                          striped
                          highlightOnHover
                          withColumnBorders
                          fontSize={"md"}
                          records={records}
                          fetching={isLoading || deleteMutation.isPending}
                          idAccessor="id"
                          minHeight={200}
                          totalRecords={employees.length}
                          recordsPerPage={pageSize}
                          page={page}
                          onPageChange={(p) => setPage(p)}
                          recordsPerPageOptions={PAGE_SIZES}
                          onRecordsPerPageChange={setPageSize}
                          paginationColor="gray"
                          paginationSize="md"
                          columns={[
                            {
                              accessor: "id",
                              title: "#",
                              textAlignment: "center",
                              width: 80,
                            },
                            {
                              accessor: "emp_id",
                              title: "รหัสพนักงาน",
                              textAlignment: "center",
                            },
                            {
                              accessor: "emp_name",
                              title: "ชื่อพนักงาน",
                              titleStyle: { textAlign: "center" },
                            },
                            {
                              accessor: "bus_group",
                              title: "ประเภทงาน",
                              textAlignment: "center",
                            },
                            {
                              accessor: "position",
                              title: "ตำแหน่ง",
                              titleStyle: { textAlign: "center" },
                            },
                            // {
                            //   accessor: "agency",
                            //   title: "หน่วย",
                            //   titleStyle: { textAlign: "center" },
                            // },
                            // {
                            //   accessor: "department",
                            //   title: "ส่วน",
                            //   titleStyle: { textAlign: "center" },
                            // },
                            {
                              accessor: "dept",
                              title: "ฝ่ายงาน",
                              textAlignment: "center",
                            },
                            // {
                            //   accessor: "start_date",
                            //   title: "วันที่เริ่มงาน",
                            //   textAlignment: "center",
                            // },
                            {
                              accessor: "created_at",
                              title: "วันที่สร้าง",
                              textAlignment: "center",
                              render: (record: Employee) =>
                                dayjs(record.created_at).format("DD-MMM-YYYY"),
                            },
                            {
                              accessor: "actions",
                              title: "ดำเนินการ",
                              textAlignment: "center",
                              render: (employee: Employee) => (
                                <>
                                  <Link
                                    to={`/overtime/view/${employee.id}`}
                                    className="btn btn-primary btn-sm"
                                  >
                                    <i className="fas fa-eye"></i> View
                                  </Link>{" "}
                                  <Link
                                    to={`/overtime/update/${employee.id}`}
                                    className="btn btn-info btn-sm"
                                  >
                                    <i className="fas fa-edit"></i> Edit
                                  </Link>{" "}
                                  <button
                                    onClick={() => handleDeleteEvent(employee)}
                                    className="btn btn-danger btn-sm"
                                    disabled={deleteMutation.isPending}
                                  >
                                    <i className="fas fa-trash"></i> Delete
                                  </button>
                                </>
                              ),
                            },
                          ]}
                        />
                      </div>
                    </div>
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

export default Employees;
