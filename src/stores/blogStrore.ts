import axios from "axios";
import { create } from "zustand";

// blogs type definition
export type Blog = {
  id: number;
  title: string;
  content: string;
  author: string;
  image: string;
  created_at: string;
  updated_at: string;
};

// New blog input type for create and update operations
export type BlogInput = {
  title: string;
  content: string;
  author: string;
  image?: string;
};

// defind the store type with additional CRUD operations
export type BlogsStore = {
  blogs: Blog[];
  isLoading: boolean;
  error: string | null;
  fetchBlogs: () => Promise<void>;
  createBlog: (blogData: BlogInput) => Promise<Blog | null>;
  updateBlog: (id: number, blogData: Partial<BlogInput>) => Promise<Blog | null>;
  deleteBlog: (id: number) => Promise<boolean>;
};

// API base URL
const API_BASE_URL = "https://full-stack-app.com/laravel_auth_jwt_api/public/api";

// create and export Zustand store
export const useBlogStore = create<BlogsStore>((set) => ({
  blogs: [],
  isLoading: false,
  error: null,
  
  // gell all blogs
  fetchBlogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<{ blogs: Blog[] }>(
        `${API_BASE_URL}/blogs`
      );
      set({ blogs: response.data.blogs, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch blogs",
        isLoading: false,
      });
    }
  },
  
  // create blog
  createBlog: async (blogData: BlogInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post<{ blog: Blog }>(
        `${API_BASE_URL}/blog-create`,
        blogData
      );
      
      const newBlog = response.data.blog;
      set((state) => ({ 
        blogs: [...state.blogs, newBlog],
        isLoading: false 
      }));
      
      return newBlog;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create blog",
        isLoading: false,
      });
      return null;
    }
  },
  
  // update blog
  updateBlog: async (id: number, blogData: Partial<BlogInput>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put<{ blog: Blog }>(
        `${API_BASE_URL}/blog-update/${id}`,
        blogData
      );
      
      const updatedBlog = response.data.blog;
      set((state) => ({
        blogs: state.blogs.map((blog) => 
          blog.id === id ? updatedBlog : blog
        ),
        isLoading: false,
      }));
      
      return updatedBlog;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update blog",
        isLoading: false,
      });
      return null;
    }
  },
  
  // delete blog
  deleteBlog: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/blog-delete/${id}`);
      
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete blog",
        isLoading: false,
      });
      return false;
    }
  },
}));