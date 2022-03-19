import { NextPage } from "next";
import { useEffect } from "react";
import { useAuth } from "../hooks";
import { api } from "../services";

const Dashboard: NextPage = () => {
  const { user } = useAuth();

  return <h1>{user?.email}</h1>;
};

export default Dashboard;
