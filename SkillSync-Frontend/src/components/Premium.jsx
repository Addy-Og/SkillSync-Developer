import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Premium = () => {
  const user = useSelector((store) => store.user);

  const handleCheckout = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/payment/create-checkout-session",
        {},
        { withCredentials: true }
      );
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Checkout session creation failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10 bg-slate-900 bg-opacity-35">
      <div className="text-center max-w-xl mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Upgrade to SkillSync Premium
        </h1>
        <p className="text-slate-400">
          Get access to exclusive features coming soon......
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch w-full max-w-4xl">
        <div className="card w-full md:w-96 bg-base-300 border border-slate-700 shadow-xl flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title text-xl font-bold text-white mb-2">Free Plan</h2>
            <div className="my-4">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-slate-400">/ forever</span>
            </div>
            <ul className="space-y-3 my-6 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> Basic matching
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> Receive requests
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <span className="text-error font-bold">✗</span> Golden Profile Badge 👑
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <span className="text-error font-bold">✗</span> More coming soon...
              </li>
            </ul>
          </div>
          <div className="card-actions p-6 border-t border-slate-700">
            <button className="btn btn-outline w-full no-animation cursor-default" disabled={user?.isPremium}>
              {user?.isPremium ? "Free Member" : "Current Plan"}
            </button>
          </div>
        </div>

        <div className="card w-full md:w-96 bg-base-300 border-2 border-primary shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
            Popular
          </div>
          <div className="card-body">
            <h2 className="card-title text-xl font-bold text-white mb-2">Premium Plan</h2>
            <div className="my-4">
              <span className="text-4xl font-extrabold text-white">$9.99</span>
              <span className="text-slate-400">/ one-time</span>
            </div>
            <ul className="space-y-3 my-6 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> Basic matching
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> Receive requests
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> **Golden Profile Badge 👑**
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> **Coming soon**
              </li>
            </ul>
          </div>
          <div className="card-actions p-6 border-t border-slate-700">
            {user?.isPremium ? (
              <button className="btn btn-success w-full text-white no-animation cursor-default">
                Premium Active 👑
              </button>
            ) : (
              <button className="btn btn-primary w-full text-white" onClick={handleCheckout}>
                Upgrade Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
