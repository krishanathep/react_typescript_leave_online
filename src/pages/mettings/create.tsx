import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMeetingStore } from "../../stores/meetingStore"; // Adjust import path as needed
import Swal from 'sweetalert2'

const Create = () => {
  const navigate = useNavigate();
  const { addMeeting, isLoading } = useMeetingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCreateSubmit = async (data: any) => {
    try {
      // Use the addMeeting function from the store instead of direct axios call
      await addMeeting(data);
      Swal.fire({
        icon: "success",
        title: "Your Meeting has been created",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/meetings");
    } catch (error) {
      console.error("Failed to create meeting:", error);
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Meeting Create</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Meetings</a>
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
                  <div className="card-body">
                    <form onSubmit={handleSubmit(handleCreateSubmit)}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="">Title</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter title"
                              {...register("title", { required: true })}
                            />
                            {errors.title && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="">Detail</label>
                            <textarea
                              className="form-control"
                              {...register("detail", { required: true })}
                              placeholder="Enter meeting details"
                            ></textarea>
                            {errors.detail && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="">User</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter participant"
                              {...register("user", { required: true })}
                            />
                            {errors.user && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="">Start</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter start time"
                              {...register("start", { required: true })}
                            />
                            {errors.start && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="">End</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter end time"
                              {...register("end", { required: true })}
                            />
                            {errors.end && (
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
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                  Loading...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-check-circle"></i> Submit
                                </>
                              )}
                            </button>{" "}
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

export default Create;
