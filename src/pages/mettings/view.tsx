import { useEffect,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMeetingStore } from "../../stores/meetingStore"; // Adjust the import path as needed
import axios from "axios";

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading } = useMeetingStore();

  const [title, setTitle]=useState('')
  const [detail, setDetail]=useState('')
  const [user, setUser]=useState('')
  const [start, setStart]=useState('')
  const [end, setEnd]=useState('')

  const getData = async()=> {
    axios.get('https://full-stack-app.com/laravel_auth_jwt_api/public/api/event/'+id)
    .then((res)=>{
       setTitle(res.data.event.title) 
       setDetail(res.data.event.detail) 
       setUser(res.data.event.user) 
       setStart(res.data.event.start) 
       setEnd(res.data.event.end) 
    })
  }

  useEffect(() => {
    getData()
  }, []);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Meeting View</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Meetings</a>
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
                    ) : (
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="">Title : </label>
                            {title}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="">Detail : </label>
                            {detail}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="">User : </label>
                            {user}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="">Start : </label>
                            {start}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="">End :</label>
                            {end}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="float-right">
                            <button
                              type="button"
                              onClick={() => navigate("/meetings")}
                              className="btn btn-danger"
                            >
                              <i className="fas fa-times-circle mr-1"></i>
                              Cancel
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

export default View;
