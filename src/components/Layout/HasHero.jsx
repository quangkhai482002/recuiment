import { Layout } from "antd";
import city from "assets/images/city.jpg";
import { Outlet } from "react-router-dom";
import "./Layout.scss";

export default function HasHero() {
  return (
    <>
      <Layout className="HasHero">
        <figure>
          <img src={city} alt="city" />
        </figure>
      </Layout>
      <Outlet />
    </>
  );
}
