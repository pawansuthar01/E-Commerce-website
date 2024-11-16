import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/layout";
import BlogCard from "../Components/BLogCard";
import { useEffect } from "react";
import { getAllPost } from "../Redux/Slice/ContenrSlice";

function Blog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { PostData } = useSelector((state) => state.content);
  async function handelBlogLoad() {
    const res = await dispatch(getAllPost());
  }
  useEffect(() => {
    handelBlogLoad();
  }, []);
  return (
    <Layout>
      <div className="min-h-[100vh]">
        <div className="flex flex-wrap  max-sm:justify-center justify-evenly  gap-10 my-10 w-full">
          {PostData?.map((blog) => {
            return <BlogCard key={blog._id} data={blog} />;
          })}
        </div>
      </div>
    </Layout>
  );
}
export default Blog;
