import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, CreditCard,
  FileCheck2, Headphones, Menu, RefreshCw, ShieldCheck, Sparkles,
  Wallet, X, Zap, LockKeyhole, Clock3, CircleDollarSign, UserRound
} from "lucide-react";
import "./styles.css";
import { AuthProvider, useAuth } from "./auth.jsx";
import { RATE, BUY_RATE, money } from "./constants.js";
import Account from "./account.jsx";

function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <header className="nav-wrap">
      <nav className="nav container">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark"><Sparkles size={17}/></span>
          <span>vault<span className="brand-x">x</span></span>
        </Link>
        <div className={`nav-links ${open ? "show" : ""}`}>
          <a href="#how">How it works</a>
          <a href="#rates">Rates</a>
          <a href="#why">Why VaultX</a>
          <Link to="/account?track=1" onClick={() => setOpen(false)}>Track order</Link>
          {user ? (
            <>
              <Link to="/account" className="nav-user" onClick={() => setOpen(false)}>
                <UserRound size={15}/> {user.name?.split(" ")[0] || user.email}
              </Link>
              <button className="nav-cta" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Log in</Link>
              <Link className="nav-cta" to="/signup" onClick={() => setOpen(false)}>Sign up <ArrowUpRight size={16}/></Link>
            </>
          )}
        </div>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X/> : <Menu/>}
        </button>
      </nav>
    </header>
  );
}

function RateTicker() {
  return (
    <div className="ticker">
      <div className="ticker-track">
        <span><span className="dot live"></span> LIVE OTC RATES</span>
        <span>BUY <b>₦{money(BUY_RATE)}</b> / USDT</span>
        <span>SELL <b>₦{money(RATE)}</b> / USDT</span>
        <span><span className="dot"></span> MANUAL VERIFICATION</span>
        <span>FAST SETTLEMENT</span>
        <span><span className="dot live"></span> LIVE OTC RATES</span>
        <span>BUY <b>₦{money(BUY_RATE)}</b> / USDT</span>
        <span>SELL <b>₦{money(RATE)}</b> / USDT</span>
      </div>
    </div>
  );
}

function ExchangeCard({ compact=false }) {
  const [mode, setMode] = useState("sell");
  const [amount, setAmount] = useState("1000");
  const rate = mode === "sell" ? RATE : BUY_RATE;
  const naira = Number(amount || 0) * rate;
  return (
    <motion.div className={`exchange-card ${compact ? "compact" : ""}`}
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
      <div className="card-top">
        <div>
          <span className="eyebrow">INSTANT QUOTE</span>
          <h3>Exchange calculator</h3>
        </div>
        <div className="live-pill"><span className="dot live"></span> Live</div>
      </div>
      <div className="segmented">
        <button className={mode === "sell" ? "active" : ""} onClick={() => setMode("sell")}>Sell USDT</button>
        <button className={mode === "buy" ? "active" : ""} onClick={() => setMode("buy")}>Buy USDT</button>
      </div>
      <label className="field-label">You {mode === "sell" ? "send" : "receive"}</label>
      <div className="amount-box">
        <input inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}/>
        <span className="token"><span className="token-icon">₮</span> USDT</span>
      </div>
      <div className="rate-row">
        <span>Rate <b>1 USDT</b></span><span>₦{money(rate)}</span>
      </div>
      <div className="receive-box">
        <span>You {mode === "sell" ? "receive" : "pay"}</span>
        <strong>₦{money(naira)}</strong>
      </div>
      <Link className="primary-btn full" to={`/account?tab=exchange&mode=${mode}&amount=${amount}`}>
        Continue exchange <ArrowRight size={18}/>
      </Link>
      <p className="fine-print"><LockKeyhole size={13}/> Quote is indicative. Final rate is confirmed at order creation.</p>
    </motion.div>
  );
}

function Home() {
  return (
    <>
      <Header/>
      <RateTicker/>
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <div className="status-badge"><span className="dot live"></span> Your trusted OTC exchange desk</div>
            <h1>Move value.<br/><em>Without the friction.</em></h1>
            <p className="hero-text">Buy and sell USDT with a simple, human-verified process built for speed, clarity and peace of mind.</p>
            <div className="hero-actions">
              <Link className="primary-btn" to="/account?tab=exchange">Start an exchange <ArrowRight size={18}/></Link>
              <a className="ghost-btn" href="#how">See how it works <ChevronDown size={17}/></a>
            </div>
            <div className="trust-line">
              <span><ShieldCheck size={16}/> Manual payment verification</span>
              <span><Zap size={16}/> Fast settlement</span>
            </div>
          </div>
          <div className="hero-widget">
            <div className="glow-orb"></div>
            <ExchangeCard/>
            <motion.div className="floating-card float-one" animate={{ y:[0,-7,0] }} transition={{repeat:Infinity,duration:3}}>
              <div className="mini-icon"><Check size={15}/></div><div><b>Payment verified</b><span>Just now · ₦2.84M</span></div>
            </motion.div>
            <motion.div className="floating-card float-two" animate={{ y:[0,7,0] }} transition={{repeat:Infinity,duration:4}}>
              <div className="mini-icon purple"><CircleDollarSign size={15}/></div><div><b>Rate locked</b><span>1 USDT = ₦{money(RATE)}</span></div>
            </motion.div>
          </div>
        </section>

        <section id="rates" className="rate-section">
          <div className="container rate-grid">
            <div><span className="eyebrow">TODAY'S MARKET</span><h2>Simple rates.<br/>No guesswork.</h2></div>
            <div className="rate-panel">
              <div className="rate-card"><span>We buy USDT</span><strong>₦{money(BUY_RATE)}</strong><small>per USDT</small><div className="rate-change">Your selling rate</div></div>
              <div className="rate-card featured"><span>We sell USDT</span><strong>₦{money(RATE)}</strong><small>per USDT</small><div className="rate-change">Your buying rate</div></div>
              <div className="rate-note"><RefreshCw size={17}/><span>Rates are controlled by our desk and may change throughout the day.</span></div>
            </div>
          </div>
        </section>

        <section id="how" className="section container">
          <div className="section-head"><div><span className="eyebrow">HOW IT WORKS</span><h2>Four steps. Zero confusion.</h2></div><p>From quote to completion, every step is visible and easy to follow.</p></div>
          <div className="steps">
            {[
              ["01","Choose your exchange","Select whether you're buying or selling USDT and enter your amount.",Wallet],
              ["02","Create your order","Add your contact and wallet details. We generate a unique reference.",FileCheck2],
              ["03","Make payment","Transfer the exact Naira amount to the business account and upload your receipt.",CreditCard],
              ["04","We verify & settle","Your payment is manually verified. Once confirmed, your transaction is completed.",Check]
            ].map(([num,title,desc,Icon]) => (
              <motion.div className="step-card" key={num} whileHover={{y:-5}}>
                <span className="step-num">{num}</span><Icon className="step-icon" size={25}/><h3>{title}</h3><p>{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="why" className="dark-section">
          <div className="container why-grid">
            <div><span className="eyebrow">WHY VAULTX</span><h2>Built around<br/><em>your confidence.</em></h2><p>We don't hide the important parts. You see your rate, payment instructions and transaction status at every stage.</p><Link className="outline-btn" to="/account?track=1">Track an order <ArrowRight size={17}/></Link></div>
            <div className="feature-stack">
              <div className="feature"><ShieldCheck/><div><h3>Human-verified payments</h3><p>Every receipt is checked against the business bank alert before an order advances.</p></div></div>
              <div className="feature"><Clock3/><div><h3>Clear transaction status</h3><p>Know whether your order is pending, payment confirmed or completed.</p></div></div>
              <div className="feature"><Headphones/><div><h3>Real human support</h3><p>Need help? Your order isn't trapped inside a bot. Reach the exchange desk directly.</p></div></div>
            </div>
          </div>
        </section>

        <section className="cta-section container">
          <div className="cta-box"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Let's make your next exchange simple.</h2><p>Get a quote and create your order in minutes.</p></div><Link className="primary-btn light" to="/account?tab=exchange">Start exchange <ArrowRight size={18}/></Link></div>
        </section>
      </main>
      <Footer/>
    </>
  );
}

function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <main className="auth-page container">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
        {footer}
      </motion.div>
    </main>
  );
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      login(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header/>
      <AuthLayout
        eyebrow="WELCOME BACK"
        title="Log in to VaultX"
        subtitle="Access your exchange desk and track your orders."
        footer={<p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>}
      >
        <form onSubmit={handleSubmit} noValidate>
          <label className="field-label">Email</label>
          <input className="text-input" type="email" required autoComplete="email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"/>
          <label className="field-label">Password</label>
          <input className="text-input" type="password" required autoComplete="current-password"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"/>
          {error && <div className="auth-error">{error}</div>}
          <button className="primary-btn full auth-submit" type="submit" disabled={loading}>
            {loading ? "Logging in…" : <>Log in <ArrowRight size={18}/></>}
          </button>
        </form>
      </AuthLayout>
      <Footer/>
    </>
  );
}

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      signup(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header/>
      <AuthLayout
        eyebrow="GET STARTED"
        title="Create your account"
        subtitle="Sign up to start exchanging USDT with VaultX."
        footer={<p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>}
      >
        <form onSubmit={handleSubmit} noValidate>
          <label className="field-label">Full name</label>
          <input className="text-input" required autoComplete="name"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Jane Doe"/>
          <label className="field-label">Email</label>
          <input className="text-input" type="email" required autoComplete="email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"/>
          <label className="field-label">Password</label>
          <input className="text-input" type="password" required autoComplete="new-password"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="At least 6 characters"/>
          <label className="field-label">Confirm password</label>
          <input className="text-input" type="password" required autoComplete="new-password"
            value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
            placeholder="••••••••"/>
          {error && <div className="auth-error">{error}</div>}
          <div className="info-box">
            <ShieldCheck size={18}/>
            <span>Demo signup for this MVP frontend — accounts are stored in your browser only, not on a server.</span>
          </div>
          <button className="primary-btn full auth-submit" type="submit" disabled={loading}>
            {loading ? "Creating account…" : <>Create account <ArrowRight size={18}/></>}
          </button>
        </form>
      </AuthLayout>
      <Footer/>
    </>
  );
}

function Footer() {
  return <footer><div className="container footer-inner"><div className="brand"><span className="brand-mark"><Sparkles size={17}/></span>vault<span className="brand-x">x</span></div><p>Modern OTC exchange, built around clarity.</p><div className="footer-links"><a href="#how">How it works</a><Link to="/account?track=1">Track order</Link><Link to="/account?tab=exchange">Exchange</Link></div><span className="copyright">© 2026 VaultX</span></div></footer>;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/account" element={<Account/>}/>
      </Routes>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(<BrowserRouter><App/></BrowserRouter>);
