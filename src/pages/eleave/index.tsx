import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { DataTable } from "mantine-datatable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

interface Eleave {
  id: number;
  emp_id: string;
  emp_name: string;
  emp_dept: string;
  leave_title: string;
  leave_desc: string;
  leave_type: string;
  leave_date: string;
  leave_total: string;
  file: string;
  leave_status: string;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL =
  "https://full-stack-app.com/laravel_auth_jwt_api/public/api";

// Function to fetch overtimes
const fetchEleaves = async () => {
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
  const response = await axios.get(`${API_BASE_URL}/eleaves`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  //console.log(response.data)
  return response.data.eleaves;
};

// Function to delete overtime
const deleteEleave = async (id: number) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_BASE_URL}/eleave-delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const leaveList = () => {
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [page, setPage] = useState<number>(1);
  const [records, setRecords] = useState<Eleave[]>([]);

  const queryClient = useQueryClient();

  // Fetch overtimes using react-query
  const { data: eleaves = [], isLoading } = useQuery({
    queryKey: ["eleaves"],
    queryFn: fetchEleaves,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEleave,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["eleaves"] });
    },
  });

  // แก้ไขฟังก์ชัน handleDeleteEvent:
  const handleDeleteEleave = (eleave: Eleave) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete eleave ${eleaves.emp_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(eleave.id);
      }
    });
  };

  useEffect(() => {
    if (Array.isArray(eleaves) && eleaves.length > 0) {
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      setRecords(eleaves.slice(from, to));
    } else {
      setRecords([]);
    }
  }, [page, pageSize, eleaves]);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            {/* <div className="row mb-2">
              <div className="col-sm-6">
               
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Leave</li>
                </ol>
              </div>
            </div> */}
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header bg-light">
                    Leave list
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="float-right">
                          <Link
                            to={"/leave/create"}
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
                          totalRecords={eleaves.length}
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
                              title: "รหัส",
                              textAlignment: "center",
                              render: ({emp_id}) =>
                               <>LE-104025-{emp_id}</>
                            },
                            {
                              accessor: "emp_name",
                              title: "ชื่อพนักงาน",
                              titleStyle: { textAlign: "center" },
                            },
                            {
                              accessor: "emp_dept",
                              title: "ตำแหน่ง",
                              titleStyle: { textAlign: "center" },
                            },
                            {
                              accessor: "leave_title",
                              title: "หัวข้อการลา",
                              titleStyle: { textAlign: "center" },
                              render: (record) => (
                                <span title={record.leave_title}>
                                  {record.leave_title.length > 20
                                    ? record.leave_title.substring(0, 20) + "..."
                                    : record.leave_title}
                                </span>
                              ),
                            },
                            {
                              accessor: "leave_type",
                              title: "ประเภท",
                              titleStyle: { textAlign: "center" },
                            },
                            {
                              accessor: "leave_date",
                              title: "วันที่ลา",
                              titleStyle: { textAlign: "center" },
                              render: (record: Eleave) =>
                                dayjs(record.leave_date).format("DD-MMM-YYYY"),
                            },
                            {
                              accessor: "leave_total",
                              title: "จำนวน",
                              textAlignment: "center",
                            },
                            {
                              accessor: "leave_status",
                              title: "สถานะ",
                              textAlignment: "center",
                            },
                            {
                              accessor: "created_at",
                              title: "วันที่สร้าง",
                              textAlignment: "center",
                              render: (record: Eleave) =>
                                dayjs(record.created_at).format("DD-MMM-YYYY"),
                            },
                            {
                              accessor: "actions",
                              title: "ดำเนินการ",
                              textAlignment: "center",
                              render: (record: Eleave) => (
                                <>
                                  <Link
                                    to={`/leave/view/${record.id}`}
                                    className="btn btn-primary btn-sm"
                                  >
                                    <i className="fas fa-eye"></i> View
                                  </Link>{" "}
                                  <Link
                                    to={`/leave/update/${record.id}`}
                                    className="btn btn-info btn-sm"
                                  >
                                    <i className="fas fa-edit"></i> Edit
                                  </Link>{" "}
                                  <button
                                    onClick={() => handleDeleteEleave(record)}
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

export default leaveList;
