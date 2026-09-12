import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const verifyPayment = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/payment/verify",
        { sessionId },
        { withCredentials: true }
      );
      
      if (res.data.user) {
        dispatch(addUser(res.data.user));
        setSuccess(true);
      }
      setLoading(false);
    } catch (err) {
      console.error("Payment verification failed:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-slate-400 font-semibold">Verifying your payment, please wait...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
      <div className="card bg-base-300 w-full max-w-md shadow-2xl border border-slate-700 text-center">
        <div className="card-body py-10">
          {success ? (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Payment Successful!</h2>
              <div className="flex justify-center items-center gap-1 text-yellow-400 text-lg font-bold my-4">
                👑 Premium Active
              </div>
              <p className="text-slate-300 mb-6">
                Thank you for upgrading! Your profile now has the premium badge, and you have access to unlimited connection requests.
              </p>
              <div className="card-actions justify-center">
                <Link to="/" className="btn btn-primary px-8">
                  Back to Feed
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Verification Failed</h2>
              <p className="text-slate-300 mb-6">
                We could not verify your payment session. If you completed the payment, please contact support with your Session ID:
              </p>
              <code className="bg-slate-800 p-2 text-xs rounded text-slate-400 block break-all my-4">
                {sessionId || "Missing Session ID"}
              </code>
              <div className="card-actions justify-center">
                <Link to="/premium" className="btn btn-outline px-8">
                  Try Again
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
