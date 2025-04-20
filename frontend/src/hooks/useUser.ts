import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "@/userSlice";
import { RootState } from "@/store";

const useUser = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const updateUser = (userData: unknown) => {
    console.log("updateUser", userData);
    dispatch(setUser(userData));
  };

  const clearUserData = () => {
    dispatch(clearUser());
  };

  return {
    user,
    updateUser,
    clearUserData,
  };
};

export default useUser;
