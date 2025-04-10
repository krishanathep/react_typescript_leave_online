import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useBlogStore, BlogInput } from "../../stores/blogStrore"; // Adjust the import path as needed

const Create = () => {
  const navigate = useNavigate();
  const { createBlog, isLoading } = useBlogStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleCreateSubmit = async (data: any) => {
    try {
      // Create a FormData object if there's a file to upload
      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("author", data.author);
        formData.append("image", data.image[0]);

        // You might need to adjust your API call for file uploads
        // This depends on how your backend handles file uploads
        const result = await createBlog(formData as unknown as BlogInput);

        if (result) {
          reset();
          navigate("/blogs");
        }
      } else {
        // If no file, just send the regular data
        const blogData: BlogInput = {
          title: data.title,
          content: data.content,
          author: data.author,
        };

        const result = await createBlog(blogData);

        if (result) {
          reset();
          navigate("/blogs");
        }
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      // You could add error handling here, like showing a notification
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Blogs post create</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Blogs</a>
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
                            <label htmlFor="">Content</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter content"
                              {...register("content", { required: true })}
                            />
                            {errors.content && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="">Author</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter author"
                              {...register("author", { required: true })}
                            />
                            {errors.author && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="">Image</label>
                            <br />
                            <input
                              type="file"
                              {...register("image", { required: true })}
                            />
                            <br />
                            {errors.image && (
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
                              onClick={() => navigate("/blogs")}
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
