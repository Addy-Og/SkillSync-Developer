import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Feed from "./Feed";

const Home = () => {
  const user = useSelector((store) => store.user);

  if (user && user._id) {
    return <Feed />;
  }

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center px-4 text-center">
      <div className="max-w-3xl py-12">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
          Developer Networking Platform
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          Connect, Match &amp; Build with Fellow Developers
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          SkillSync pairs developers based on skills, interests, and project goals. Discover peers, expand your network, and start real-time conversations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all"
          >
            Sign In
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-white mb-2">Smart Skill Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find developers with complementary technical stacks and shared coding interests.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-white mb-2">Real-Time Messaging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Chat directly with matched connections using instantaneous WebSocket messaging.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-white mb-2">Verified Profiles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Showcase your skills, portfolio projects, and earn premium badges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
