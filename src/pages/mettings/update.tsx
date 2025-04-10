import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMeetingStore } from "../../stores/meetingStore"; // Adjust the import path as needed
import Swal from "sweetalert2";

const Update = () => {
  const { id } = useParams();
  const meetingId = id ? parseInt(id) : 0;
  const navigate = useNavigate();
  const { updateMeeting, meetings, fetchMeetings, isLoading } =
    useMeetingStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // First fetch all meetings if not already loaded
    if (meetings.length === 0) {
      fetchMeetings();
    } else {
      // Find the current meeting and populate the form
      const currentMeeting = meetings.find(
        (meeting) => meeting.id === meetingId
      );
      if (currentMeeting) {
        reset({
          title: currentMeeting.title,
          detail: currentMeeting.detail,
          user: currentMeeting.user,
          start: currentMeeting.start,
          end: currentMeeting.end,
        });
      }
    }
  }, [fetchMeetings, meetingId, meetings, reset]);

  // Use the store's updateMeeting function
  const handleUpdateSubmit = async (data: any) => {
    try {
      await updateMeeting(meetingId, data);
      Swal.fire({
        icon: "success",
        title: "Your Meeting has been updated",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/meetings");
    } catch (error) {
      console.error("Failed to update meeting:", error);
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Meeting Update</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Meetings</a>
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
                  <div className="card-body">
                    <form onSubmit={handleSubmit(handleUpdateSubmit)}>
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
                              placeholder="Enter content"
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
                              placeholder="Enter user"
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

export default Update;
