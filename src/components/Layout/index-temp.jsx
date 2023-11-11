// import { ConfigProvider, Layout, Typography } from "antd";
// import city from "assets/images/city.webp";
// import { authActions, authSelectors } from "features/auth/authSlice";
// import { useCallback, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Outlet, useNavigate } from "react-router-dom";
// import CandidateHeader from "../Common/CandidateHeader";
// import InternalHeader from "../Common/InternalHeader";
// import MyFooter from "../Common/MyFooter";
// import Sider from "../Common/Sider";
// import "./Layout.scss";

// const { Footer, Content } = Layout;

// export default function MyLayout(props) {
//   //
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { role } = props;
//   const { currentUser, status } = useSelector(authSelectors);

//   const handleLogoutClick = useCallback(() => {
//     dispatch(authActions.logout());
    
//   }, [dispatch]);

//   //	effect---------

//   useEffect(() => {
//     const currentRole = localStorage.getItem("currentRole");
//     if (!status) {
//       if (currentRole) {
//         if (currentRole === role) dispatch(authActions.getInfo(role));
//         else navigate(`/${currentRole === "candidate" ? "" : currentRole}`);
//       }
//     } else if (status === "403") {
//       if (!currentRole) {
//         dispatch(authActions.logout());
//         navigate("/login");
//       } else {
//         navigate(`/${currentRole === "candidate" ? "" : currentRole}`);
//       }
//     } else if (status === "200") {
//       if (!currentRole) dispatch(authActions.getInfo(role));
//     }
//   }, [dispatch, navigate, role, status]);

//   //	return------------
//   return role === "candidate" ? (
//     <Layout className="Layout">
//       <CandidateHeader
//         handleLogoutClick={handleLogoutClick}
//         role={role}
//         currentUser={currentUser ? currentUser.email : undefined}
//       />
//       <Content className="Content">
//         <Outlet />
//       </Content>
//       <Footer className="Footer">
//         <MyFooter role={role} />
//       </Footer>
//     </Layout>
//   ) : (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorBgLayout: "#dee2e6",
//         },
//       }}
//     >
//       <Layout hasSider className="Layout" style={{ maxHeight: "100vh" }}>
//         <Sider role={role} />
//         <Content className="Content internal-content">
//           <InternalHeader
//             handleLogoutClick={handleLogoutClick}
//             role={role}
//             currentUser={currentUser ? currentUser.firstName : undefined}
//             status={status ? status : undefined}
//           />
//           {status === "200" && currentUser && <Outlet />}
//         </Content>
//       </Layout>
//     </ConfigProvider>
//   );
// }

// export const HasHero = () => {
//   return (
//     <>
//       <Layout className="HasHero" style={{ backgroundImage: `url(${city})` }}>
//         <Typography.Text>OUR MISSION IS ...</Typography.Text>
//       </Layout>
//       <Outlet />
//     </>
//   );
// };
