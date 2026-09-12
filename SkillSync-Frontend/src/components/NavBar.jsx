import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(removeUser());
      navigate("/login");
    }
  };

  const isUserLoggedIn = user && user._id && user.firstName;

  return (
    <div className="navbar bg-base-300 px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold text-white">
          👩‍💻 SkillSync
        </Link>
      </div>
      {isUserLoggedIn ? (
        <div className="flex-none gap-2 items-center">
          <div className="text-sm font-medium text-slate-200 flex items-center gap-1">
            Welcome, {user.firstName}
            {user.isPremium && <span className="text-yellow-400">👑</span>}
          </div>
          <div className="dropdown dropdown-end ml-2">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar border border-slate-700"
            >
              <div className="w-10 rounded-full">
                <img
                  alt={`${user.firstName}'s photo`}
                  src={user.photoUrl || "https://geographyandyou.com/images/user-profile.png"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-xl border border-slate-800"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge badge-sm badge-primary">Edit</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <Link to="/premium" className="font-semibold text-yellow-500">
                  Premium Membership 👑
                </Link>
              </li>
              <li>
                <a onClick={handleLogout} className="text-red-400 hover:text-red-300">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link to="/login" className="btn btn-sm btn-primary">
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;
