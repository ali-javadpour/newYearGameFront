import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="h-screen w-full flex justify-center " >
      <div className=" w-[600px] h-full ">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
