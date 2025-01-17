import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/layout";
import BlogCard from "../Components/Blog/BLogCard";
import { useEffect, useState } from "react";
import { DeleteBlog, getAllPost } from "../Redux/Slice/ContentSlice";
import FeedbackForm from "../Components/feedbackfrom";
import FeedbackList from "../Components/feedbackList";

function Blog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { PostData } = useSelector((state) => state.content);
  const [showPost, setShowPost] = useState([]);
  async function handelBlogLoad() {
    const res = await dispatch(getAllPost());
    setShowPost(res?.payload?.AllPostGet);
  }
  useEffect(() => {
    handelBlogLoad();
    setShowPost(PostData);
  }, []);
  async function handleDeleteBlog(blogId) {
    const iConfirm = window.confirm("Delete this Blog...");
    if (!iConfirm) return;
    setShowPost((prevBlog) => prevBlog.filter((blog) => blog._id !== blogId));
    await dispatch(DeleteBlog(blogId));
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Blog Posts Grid */}
          <div className="flex   justify-evenly ">
            {showPost.length === 0 ? (
              <div className="col-span-full flex items-center justify-center h-64">
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  No blogs found...
                </p>
              </div>
            ) : (
              showPost.map((blog) => (
                <BlogCard
                  key={blog._id}
                  data={blog}
                  onDelete={handleDeleteBlog}
                />
              ))
            )}
          </div>

          {/* Feedback Section */}
          <div className="mt-16">
            <hr className="border-gray-200 dark:border-gray-700 mb-8" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Feedback
            </h2>
            <div className="space-y-8">
              <FeedbackForm />
              <FeedbackList />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default Blog;
