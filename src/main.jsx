import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Copy, CreditCard,
  FileCheck2, Headphones, Menu, RefreshCw, ShieldCheck, Sparkles,
  Wallet, X, Zap, LockKeyhole, Clock3, CircleDollarSign
} from "lucide-react";
import "./styles.css";

const RATE = 1420;
const BUY_RATE = 1400;

function money(n) {
  return new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(n || 0);
}

function Header() {
  const [open, setOpen] = useState(false);
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
          <Link to="/track">Track order</Link>
          <Link className="nav-cta" to="/exchange">Start exchange <ArrowUpRight size={16}/></Link>
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
      <Link className="primary-btn full" to={`/exchange?mode=${mode}&amount=${amount}`}>
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
              <Link className="primary-btn" to="/exchange">Start an exchange <ArrowRight size={18}/></Link>
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
            <div><span className="eyebrow">WHY VAULTX</span><h2>Built around<br/><em>your confidence.</em></h2><p>We don't hide the important parts. You see your rate, payment instructions and transaction status at every stage.</p><Link className="outline-btn" to="/track">Track an order <ArrowRight size={17}/></Link></div>
            <div className="feature-stack">
              <div className="feature"><ShieldCheck/><div><h3>Human-verified payments</h3><p>Every receipt is checked against the business bank alert before an order advances.</p></div></div>
              <div className="feature"><Clock3/><div><h3>Clear transaction status</h3><p>Know whether your order is pending, payment confirmed or completed.</p></div></div>
              <div className="feature"><Headphones/><div><h3>Real human support</h3><p>Need help? Your order isn't trapped inside a bot. Reach the exchange desk directly.</p></div></div>
            </div>
          </div>
        </section>

        <section className="cta-section container">
          <div className="cta-box"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Let's make your next exchange simple.</h2><p>Get a quote and create your order in minutes.</p></div><Link className="primary-btn light" to="/exchange">Start exchange <ArrowRight size={18}/></Link></div>
        </section>
      </main>
      <Footer/>
    </>
  );
}

function Exchange() {
  const [step,setStep] = useState(1);
  const [mode,setMode] = useState("sell");
  const [amount,setAmount] = useState("1000");
  const [form,setForm] = useState({phone:"",wallet:""});
  const rate = mode === "sell" ? RATE : BUY_RATE;
  const naira = Number(amount||0)*rate;
  const [ref] = useState(() => `FX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random()*899999)}`);

  return <><Header/><main className="exchange-page container">
    <div className="flow-heading"><div><span className="eyebrow">EXCHANGE DESK</span><h1>{step === 4 ? "Order created." : "Create your exchange."}</h1><p>{step === 4 ? "Keep your reference safe to track payment and settlement." : "A clear, guided process from quote to order."}</p></div><Link className="ghost-btn" to="/">← Back home</Link></div>
    <div className="progress"><div className="progress-line"><span style={{width:`${((step-1)/3)*100}%`}}></span></div>{["Exchange","Your details","Confirm","Done"].map((x,i)=><div className={step>=i+1?"p-step active":"p-step"} key={x}><span>{i+1}</span>{x}</div>)}</div>
    <AnimatePresence mode="wait">
      {step===1 && <motion.div className="flow-card" key="one" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
        <h2>What would you like to do?</h2><p className="muted">Choose your direction and enter the amount.</p>
        <div className="big-toggle"><button className={mode==="sell"?"active":""} onClick={()=>setMode("sell")}><span>Sell USDT</span><small>Receive Naira</small></button><button className={mode==="buy"?"active":""} onClick={()=>setMode("buy")}><span>Buy USDT</span><small>Pay Naira</small></button></div>
        <label className="field-label">USDT amount</label><div className="amount-box large"><input autoFocus value={amount} onChange={e=>setAmount(e.target.value.replace(/[^0-9.]/g,""))}/><span className="token"><span className="token-icon">₮</span> USDT</span></div>
        <div className="quote-summary"><span>Rate</span><b>₦{money(rate)} / USDT</b><span>You {mode==="sell"?"receive":"pay"}</span><b>₦{money(naira)}</b></div>
        <button className="primary-btn full" onClick={()=>setStep(2)}>Continue <ArrowRight size={18}/></button>
      </motion.div>}
      {step===2 && <motion.div className="flow-card" key="two" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
        <h2>Your transaction details</h2><p className="muted">We'll use these to identify your order and send the USDT when applicable.</p>
        <label className="field-label">Phone number</label><input className="text-input" placeholder="0800 000 0000" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
        <label className="field-label">USDT wallet address</label><input className="text-input" placeholder="Enter your wallet address" value={form.wallet} onChange={e=>setForm({...form,wallet:e.target.value})}/>
        <div className="info-box"><ShieldCheck size={18}/><span>Double-check your wallet address. The exchange desk will use the details submitted with this order.</span></div>
        <div className="button-row"><button className="ghost-btn" onClick={()=>setStep(1)}>Back</button><button className="primary-btn" onClick={()=>setStep(3)}>Review order <ArrowRight size={18}/></button></div>
      </motion.div>}
      {step===3 && <motion.div className="flow-card" key="three" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
        <h2>Review your order</h2><p className="muted">Make sure everything is correct before creating the order.</p>
        <div className="review"><div><span>Direction</span><b>{mode==="sell"?"Sell USDT":"Buy USDT"}</b></div><div><span>USDT amount</span><b>{money(Number(amount))} USDT</b></div><div><span>Exchange rate</span><b>₦{money(rate)}</b></div><div className="total"><span>Naira amount</span><b>₦{money(naira)}</b></div><div><span>Phone</span><b>{form.phone || "—"}</b></div><div><span>Wallet</span><b className="wallet-review">{form.wallet || "—"}</b></div></div>
        <div className="button-row"><button className="ghost-btn" onClick={()=>setStep(2)}>Back</button><button className="primary-btn" onClick={()=>setStep(4)}>Create order <ArrowRight size={18}/></button></div>
      </motion.div>}
      {step===4 && <motion.div className="flow-card success-card" key="four" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}>
        <div className="success-icon"><Check size={34}/></div><span className="eyebrow">ORDER CREATED</span><h2>Your order is ready.</h2><p className="muted">Use the reference below whenever you contact the exchange desk or check your status.</p>
        <div className="order-ref"><span>Order reference</span><strong>{ref}</strong><button onClick={()=>navigator.clipboard?.writeText(ref)}><Copy size={16}/> Copy</button></div>
        <div className="payment-box"><div><span>Amount to {mode==="sell"?"receive":"pay"}</span><strong>₦{money(naira)}</strong></div><div><span>USDT</span><strong>{money(Number(amount))}</strong></div><div><span>Status</span><strong className="status-pending">Pending</strong></div></div>
        <div className="info-box"><CreditCard size={18}/><span>For this MVP, payment instructions and bank details are displayed by the exchange desk after order creation. Upload your receipt against this reference.</span></div>
        <div className="button-row"><Link className="ghost-btn" to="/track">Track order</Link><Link className="primary-btn" to="/">Done <Check size={17}/></Link></div>
      </motion.div>}
    </AnimatePresence>
  </main><Footer/></>;
}

function Track() {
  const {ref: urlRef} = useParams();
  const [ref,setRef] = useState(urlRef || "");
  const [searched,setSearched] = useState(!!urlRef);
  return <><Header/><main className="track-page container">
    <div className="center-head"><span className="eyebrow">ORDER TRACKING</span><h1>Where is your order?</h1><p>Enter your unique order reference to view the latest status.</p></div>
    <div className="track-card">
      <label className="field-label">Order reference</label><div className="search-input"><input placeholder="e.g. FX-2026-482193" value={ref} onChange={e=>setRef(e.target.value)}/><button onClick={()=>setSearched(true)}>Track <ArrowRight size={17}/></button></div>
      {searched && <motion.div className="tracking-result" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <div className="tracking-top"><div><span className="eyebrow">ORDER</span><h3>{ref || "FX-2026-482193"}</h3></div><span className="status-chip">Pending confirmation</span></div>
        <div className="tracking-amount"><span>Transaction amount</span><strong>₦14,200,000</strong><small>10,000 USDT · Sell</small></div>
        <div className="timeline">{[
          ["Order submitted","Your order was created successfully.",true],
          ["Payment confirmation","We're waiting for payment to be verified.",true],
          ["Crypto release","This step begins after payment confirmation.",false],
          ["Completed","Transaction is complete.",false]
        ].map(([t,d,done],i)=><div className={`timeline-item ${done?"done":""}`} key={t}><div className="timeline-dot">{done?<Check size={13}/>:i+1}</div><div><b>{t}</b><p>{d}</p></div></div>)}</div>
      </motion.div>}
    </div>
  </main><Footer/></>;
}

function Footer() {
  return <footer><div className="container footer-inner"><div className="brand"><span className="brand-mark"><Sparkles size={17}/></span>vault<span className="brand-x">x</span></div><p>Modern OTC exchange, built around clarity.</p><div className="footer-links"><a href="#how">How it works</a><Link to="/track">Track order</Link><Link to="/exchange">Exchange</Link></div><span className="copyright">© 2026 VaultX</span></div></footer>;
}

function App() {
  return <Routes><Route path="/" element={<Home/>}/><Route path="/exchange" element={<Exchange/>}/><Route path="/track" element={<Track/>}/><Route path="/track/:ref" element={<Track/>}/></Routes>;
}

createRoot(document.getElementById("root")).render(<BrowserRouter><App/></BrowserRouter>);
