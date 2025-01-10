import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

const SimpleLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default SimpleLayout;
