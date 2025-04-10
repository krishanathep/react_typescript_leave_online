import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const API_BASE_URL =
  "https://full-stack-app.com/laravel_auth_jwt_api_hrd/public/api";

  // Define queries for different dashboard stats
  const fetchEmployeeCount = async () => {
    const response = await fetch(`${API_BASE_URL}/employees`);
    if (!response.ok) throw new Error('Failed to fetch employee count');
    const data = await response.json();
    return data.length; // คืนค่าจำนวนพนักงานแทนข้อมูลทั้งหมด
  };

  // Use React Query to fetch data
  const employeeQuery = useQuery({
    queryKey: ['employeeCount'],
    queryFn: fetchEmployeeCount,
    staleTime: 300000, // 5 minutes
  });
  
  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            {/* <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Home</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item active">Home</li>
                </ol>
              </div>
            </div> */}
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3">
                <div className="small-box bg-primary">
                {employeeQuery.isLoading && (
                    <div className="overlay dark">
                      <i className="fas fa-3x fa-sync-alt fa-spin"></i>
                    </div>
                  )}
                  <div className="inner">
                    <h3>10%</h3>
                    <p>CPU Traffic</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-cog"></i>
                  </div>
                  <a href="#" className="small-box-footer">
                    <span className="text-white">More info</span>{" "}
                    <i className="fas fa-arrow-circle-right text-white"></i>
                  </a>
                </div>
              </div>
              <div className="col-md-3">
                <div className="small-box bg-danger">
                {employeeQuery.isLoading && (
                    <div className="overlay dark">
                      <i className="fas fa-3x fa-sync-alt fa-spin"></i>
                    </div>
                  )}
                  <div className="inner">
                    <h3>41,410</h3>
                    <p>Blogs</p>
                  </div>
                  <div className="icon">
                    <i className="far fa-comment-alt"></i>
                  </div>
                  <a href="#" className="small-box-footer">
                    <span className="text-white">More info</span>{" "}
                    <i className="fas fa-arrow-circle-right text-white"></i>
                  </a>
                </div>
              </div>
              <div className="col-md-3">
                <div className="small-box bg-success">
                {employeeQuery.isLoading && (
                    <div className="overlay dark">
                      <i className="fas fa-3x fa-sync-alt fa-spin"></i>
                    </div>
                  )}
                  <div className="inner">
                    <h3>760</h3>
                    <p>Sales</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                  <a href="#" className="small-box-footer">
                    <span className="text-white">More info</span>{" "}
                    <i className="fas fa-arrow-circle-right text-white"></i>
                  </a>
                </div>
              </div>
              <div className="col-md-3">
                <div className="small-box bg-info">
                  {employeeQuery.isLoading && (
                    <div className="overlay dark">
                      <i className="fas fa-3x fa-sync-alt fa-spin"></i>
                    </div>
                  )}
                  <div className="inner">
                    {/* <h3>{employeeQuery.isSuccess ? employeeQuery.data?.count?.toLocaleString() || '0' : '0'}</h3> */}
                    <h3>10,000</h3>
                    <p>New Employees</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <a href="#" className="small-box-footer">
                    <span className="text-white">More info</span>{" "}
                    <i className="fas fa-arrow-circle-right text-white"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
