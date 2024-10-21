import { createBrowserRouter } from "react-router-dom";
import PrivateLayout from "../components/layout/privateLayout";
import PublicLayout from "../components/layout/publicLayout";
import Dashboard from "../pages/Dashboard";
import ModelAssumptions from "../pages/Assumption";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Setting from "../pages/Setting";
import Calculator from "../pages/Calculator";
import UserManagement from "../pages/UserManagement";

export const routes = createBrowserRouter([
	{
		path: "/",
		element: <PrivateLayout children={<>main</>} />,
	},
	{
		path: "/country",
		element: <PrivateLayout children={<Dashboard />} />,
	},
	{
		path: "/calculator",
		element: <PrivateLayout children={<Calculator />} />,
	},
	{
		path: "/assumption",
		element: <PrivateLayout children={<ModelAssumptions />} />
	},
	{
		path: "/user-management",
		element: <PrivateLayout children={<UserManagement />} />
	},
	{
		path: "/setting",
		element: <PrivateLayout children={<Setting />} />
	},
	{
		path: "/register",
		element: <PublicLayout children={<Register />} />
	},
	{
		path: "/login",
		element: <PublicLayout children={<Login />} />
	},
])