import { useQuery } from "@apollo/client/react";
import { Suspense, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";
import { USER_QUERY } from "./query/userQuery";
import Spinner from "./ui/Spinner/Spinner";

export const Home: FC = () => {
  type ResponceData = {
    user: {
      email: String;
      firstName: String;
      lastName: String;
    };
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state;
  const { data } = useQuery<ResponceData>(USER_QUERY, {
    variables: { id },
  });

  return (
    <Suspense fallback={<Spinner />}>
      <div className={styles.userInfo}>
        <p>User info:</p>
        <div>{data?.user?.email}</div>
        <div>{data?.user?.firstName}</div>
        <div>{data?.user?.lastName}</div>
        <button
          onClick={() => {
            if (window.confirm("Are you want to logout?")) {
              localStorage.removeItem("token");
              navigate("/login");
            }
          }}
        >
          Logout
        </button>
      </div>
    </Suspense>
  );
};
