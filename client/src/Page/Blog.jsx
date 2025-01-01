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
    setShowPost(res.payload.AllPostGet);
  }
  useEffect(() => {
    handelBlogLoad();
    setShowPost(PostData);
  }, []);
  async function handleDeleteBlog(blogId) {
    setShowPost((prevProducts) =>
      prevProducts.filter((blog) => blog._id !== blogId)
    );
    const res = await dispatch(DeleteBlog(blogId));
    console.log(res);
  }

  return (
    <Layout>
      <div className="min-h-[100vh]">
        <div className="flex flex-wrap  max-sm:justify-center justify-evenly  gap-10 my-10 w-full">
          {showPost?.map((blog) => {
            return (
              <BlogCard
                key={blog._id}
                data={blog}
                onDelete={handleDeleteBlog}
              />
            );
          })}
        </div>
        {/* feedback section */}
        <div className="w-full  ">
          <hr className="h-1 bg-slate-200" />
          <h1 className="text-2xl font-bold mb-4 ml-10 text-start dark:text-white text-black">
            feedback Section
          </h1>
          <FeedbackForm />
          <FeedbackList />
        </div>
      </div>
    </Layout>
  );
}
export default Blog;
