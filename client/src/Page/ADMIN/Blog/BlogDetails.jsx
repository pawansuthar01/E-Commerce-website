import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DeleteBlog, getPost } from "../../../Redux/Slice/ContentSlice";
import BlogCard from "../../../Components/Blog/BLogCard";
import Layout from "../../../layout/layout";

function BlogDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { PostData } = useSelector((state) => state.content);
  const [showPost, setShowPost] = useState([]);
  const { pathname } = useLocation();

  const PostId = pathname.split("/").pop();
  async function handelBlogLoad() {
    const res = await dispatch(getPost(PostId));
    setShowPost(res.payload.data);
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
          <BlogCard w={"w-full"} data={showPost} onDelete={handleDeleteBlog} />
        </div>
      </div>
    </Layout>
  );
}
export default BlogDetails;
