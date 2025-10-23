import { useEffect } from "react";
import { useGetUserQuery } from "../redux/api";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const { data, isLoading, isError, error, refetch } = useGetUserQuery(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
      const currentPath = window.location.pathname;
      navigate(currentPath);
    } else if (!isLoading && (isError || error || !data)) {
      dispatch(setUser(null));
      navigate("/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError]);

  return { isLoading, refetch };
};

export default useAuth;
