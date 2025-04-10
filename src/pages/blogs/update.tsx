import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useBlogStore, BlogInput } from "../../stores/blogStrore"; // Adjust the import path as needed

const Update = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the blog ID from URL params
  const blogId = id ? parseInt(id) : 0;
  
  const { blogs, updateBlog, isLoading, fetchBlogs } = useBlogStore();
  const [blogNotFound, setBlogNotFound] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Fetch blog data when component mounts if we don't have it already
  useEffect(() => {
    const initializeForm = async () => {
      try {
        // If blogs array is empty, fetch all blogs first
        if (blogs.length === 0) {
          await fetchBlogs();
        }
        
        // Find the blog to edit
        const blogToEdit = blogs.find(blog => blog && blog.id === blogId);
        
        if (blogToEdit) {
          // Pre-populate the form with existing data
          reset({
            id:blogToEdit.id,
            title: blogToEdit.title,
            content: blogToEdit.content,
            author: blogToEdit.author
          });
          setIsInitialized(true);
        } else {
          // If blog not found after fetching
          console.error(`Blog with ID ${blogId} not found`);
          setBlogNotFound(true);
        }
      } catch (error) {
        console.error("Error initializing update form:", error);
        setBlogNotFound(true);
      }
    };

    initializeForm();
  }, [blogs, blogId, fetchBlogs, reset]);

  const handleUpdateSubmit = async (data: any) => {
    if (!blogId) {
      console.error("No blog ID provided");
      return;
    }
    
    try {
      // Create a FormData object if there's a file to upload
      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("author", data.author);
        formData.append("image", data.image[0]);
        
        // You might need to adjust your API call for file uploads
        const result = await updateBlog(blogId, formData as unknown as Partial<BlogInput>);
        
        if (result) {
          reset();
          navigate('/blogs');
        }
      } else {
        // If no file, just send the regular data
        const blogData: Partial<BlogInput> = {
          title: data.title,
          content: data.content,
          author: data.author
        };
        
        const result = await updateBlog(blogId, blogData);
        
        if (result) {
          reset();
          navigate('/blogs');
        }
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      // You could add error handling here, like showing a notification
    }
  };

  // Show error message if blog not found
  if (blogNotFound) {
    return (
      <div className="content-wrapper">
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="alert alert-danger">
                      Blog post not found. Please check the URL and try again.
                    </div>
                    <button 
                      onClick={() => navigate('/blogs')} 
                      className="btn btn-primary"
                    >
                      Back to Blogs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while initializing form
  if (!isInitialized) {
    return (
      <div className="content-wrapper">
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body text-center p-5">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-3">Loading blog data...</p>
                  </div>
                </div>
              </div>
            </div>
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
                <h1 className="m-0">Update Blog Post</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Blogs</a>
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
                            <label htmlFor="">Title : {id}</label>
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
                              {...register("image", { required: false })}
                            />
                            <br />
                            <small className="text-muted">
                              Leave empty to keep the current image
                            </small>
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
                                "Update"
                              )}
                            </button>{" "}
                            <button 
                              type="button" 
                              onClick={()=>navigate('/blogs')} 
                              className="btn btn-default"
                              disabled={isLoading}
                            >
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