import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Banknote, Check, Copy, FileText, RefreshCw, Search,
  ShieldCheck, UploadCloud, X, LayoutDashboard, ArrowLeftRight, Receipt
} from "lucide-react";
import { useAuth } from "./auth.jsx";
import { RATE, BUY_RATE, money } from "./constants.js";

/**
 * DEMO STORAGE — frontend only.
 * Submission metadata is saved in localStorage per account. The receipt
 * file itself is only kept in memory for the session (with a thumbnail
 * preview for images) — nothing is uploaded anywhere yet. Swap the handlers
 * below (handlePaymentSubmit, demoAdvanceStatus) for real API calls once
 * the Node backend + admin panel exist. The "demo controls" block in
 * TrackPanel is a temporary stand-in for admin status changes — remove it
 * once the backend can update status for real.
 */

const BANK_DETAILS = {
  bankName: "Providus Bank",
  accountName: "VaultX Exchange Ltd",
  accountNumber: "0123456789",
};

function submissionsKey(email) {
  return `vaultx_submissions_${email}`;
}
function loadSubmissions(email) {
  try { return JSON.parse(localStorage.getItem(submissionsKey(email))) || []; }
  catch { return []; }
}
function saveSubmissions(email, list) {
  localStorage.setItem(submissionsKey(email), JSON.stringify(list));
}

function StatusPill({ status }) {
  const cls = status === "Verified" ? "status-verified" : status === "Successful" ? "status-completed" : "status-pending";
  return <span className={`status-pill ${cls}`}>{status}</span>;
}

function RateStrip() {
  return (
    <div className="account-rates">
      <div className="account-rate-card"><span>We buy USDT</span><strong>₦{money(BUY_RATE)}</strong></div>
      <div className="account-rate-card featured"><span>We sell USDT</span><strong>₦{money(RATE)}</strong></div>
      <div className="account-rate-note"><RefreshCw size={14}/> Rates may change during the day</div>
    </div>
  );
}

function BankCard() {
  const [copied, setCopied] = useState(false);
  function copyAccount() {
    navigator.clipboard?.writeText(BANK_DETAILS.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <div className="flow-card bank-card">
      <div className="card-top"><div><span className="eyebrow">TRANSFER TO</span><h3><Banknote size={18}/> Payment details</h3></div></div>
      <div className="bank-row"><span>Bank</span><b>{BANK_DETAILS.bankName}</b></div>
      <div className="bank-row"><span>Account name</span><b>{BANK_DETAILS.accountName}</b></div>
      <div className="bank-row"><span>Account number</span><b>{BANK_DETAILS.accountNumber}</b>
        <button type="button" className="copy-btn" onClick={copyAccount}>{copied ? "Copied" : "Copy"}</button>
      </div>
      <p className="fine-print">Transfer the exact Naira amount shown in your quote, then submit your receipt below.</p>
    </div>
  );
}

function SubmissionsList({ items }) {
  if (!items.length) {
    return (
      <div className="flow-card empty-state">
        <Receipt size={22}/>
        <p className="muted">No transactions yet. Start an exchange to create your first one.</p>
      </div>
    );
  }
  return (
    <div className="submissions-list">
      {items.map(s => (
        <div className="submission-item" key={s.id}>
          <div className="submission-top"><b>{s.ref}</b><StatusPill status={s.status}/></div>
          <div className="submission-meta">
            <span><FileText size={13}/> {s.fileName}</span>
            <span>{new Date(s.createdAt).toLocaleString()}</span>
          </div>
          <div className="submission-wallet">Wallet: <code>{s.wallet}</code></div>
        </div>
      ))}
    </div>
  );
}

// ---------------- Tab nav ----------------
function TabNav({ active, onChange }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "exchange", label: "Exchange", icon: ArrowLeftRight },
    { id: "payments", label: "Payments", icon: Receipt },
  ];
  return (
    <div className="account-tabs">
      {tabs.map(t => (
        <button key={t.id} className={active === t.id ? "active" : ""} onClick={() => onChange(t.id)}>
          <t.icon size={15}/> {t.label}
        </button>
      ))}
    </div>
  );
}

// ---------------- Track modal ----------------
function TrackPanel({ open, onClose, submissions, initialRef, onDemoAdvance }) {
  const [refInput, setRefInput] = useState("");
  const [searchedRef, setSearchedRef] = useState(null);

  useEffect(() => {
    if (open) {
      setRefInput(initialRef || "");
      setSearchedRef(initialRef || null);
    }
  }, [open, initialRef]);

  const result = useMemo(() => {
    if (!searchedRef) return null;
    return submissions.find(s => s.ref.toLowerCase() === searchedRef.trim().toLowerCase()) || null;
  }, [submissions, searchedRef]);

  function handleTrack(e) {
    e.preventDefault();
    setSearchedRef(refInput);
  }

  function copyRef() {
    navigator.clipboard?.writeText(result.ref);
  }

  if (!open) return null;

  const steps = result ? [
    ["Order submitted", "Your payment submission was received.", true],
    ["Payment confirmation", "We're waiting for payment to be verified.", result.status !== "Pending"],
    ["Crypto release", "This step begins after payment confirmation.", result.status === "Successful"],
    ["Completed", "Transaction is complete.", result.status === "Successful"],
  ] : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="modal-card" onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button type="button" className="modal-close" onClick={onClose}><X size={18}/></button>
        <span className="eyebrow">TRACK ORDER</span>
        <h2>Where is your order?</h2>
        <p className="muted">Paste your order reference to see the latest status.</p>
        <form onSubmit={handleTrack} className="search-input">
          <input placeholder="e.g. FX-2026-482193" value={refInput} onChange={e => setRefInput(e.target.value)}/>
          <button type="submit"><Search size={16}/> Track</button>
        </form>

        {searchedRef && !result && <div className="auth-error">No submission found for that reference.</div>}

        {result && (
          <motion.div className="tracking-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="tracking-top">
              <div><span className="eyebrow">ORDER</span><h3>{result.ref}</h3></div>
              <div className="tracking-top-right">
                <StatusPill status={result.status}/>
                <button type="button" className="copy-btn" onClick={copyRef}><Copy size={13}/> Copy</button>
              </div>
            </div>
            <div className="timeline">
              {steps.map(([t, d, done], i) => (
                <div className={`timeline-item ${done ? "done" : ""}`} key={t}>
                  <div className="timeline-dot">{done ? <Check size={13}/> : i + 1}</div>
                  <div><b>{t}</b><p>{d}</p></div>
                </div>
              ))}
            </div>
            {result.status !== "Successful" && (
              <div className="demo-controls">
                <span>Demo controls — remove once the backend handles this:</span>
                <div className="demo-buttons">
                  {result.status === "Pending" && (
                    <button type="button" className="ghost-btn" onClick={() => onDemoAdvance(result.id, "Verified")}>Mark verified</button>
                  )}
                  <button type="button" className="ghost-btn" onClick={() => onDemoAdvance(result.id, "Successful")}>Mark successful</button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ---------------- Dashboard tab ----------------
function DashboardTab({ submissions, onGoExchange, onOpenTrack }) {
  const counts = useMemo(() => ({
    pending: submissions.filter(s => s.status === "Pending").length,
    verified: submissions.filter(s => s.status === "Verified").length,
    successful: submissions.filter(s => s.status === "Successful").length,
  }), [submissions]);

  return (
    <>
      <RateStrip/>
      <div className="dash-stats">
        <div className="dash-stat"><span>Pending</span><strong>{counts.pending}</strong></div>
        <div className="dash-stat"><span>Verified</span><strong>{counts.verified}</strong></div>
        <div className="dash-stat"><span>Successful</span><strong>{counts.successful}</strong></div>
      </div>
      <div className="dash-actions">
        <button className="primary-btn" onClick={onGoExchange}>Start an exchange <ArrowRight size={18}/></button>
        <button className="ghost-btn" onClick={onOpenTrack}><Search size={16}/> Track an order</button>
      </div>
      <div className="section-head compact"><div><span className="eyebrow">RECENT</span><h2>Latest transactions</h2></div></div>
      <SubmissionsList items={submissions.slice(0, 4)}/>
    </>
  );
}

// ---------------- Exchange tab ----------------
function ExchangeTab({ initialMode, initialAmount, onContinue }) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(initialMode === "buy" ? "buy" : "sell");
  const [amount, setAmount] = useState(initialAmount || "1000");
  const [form, setForm] = useState({ phone: "", wallet: "" });
  const rate = mode === "sell" ? RATE : BUY_RATE;
  const naira = Number(amount || 0) * rate;

  return (
    <>
      <div className="progress">
        <div className="progress-line"><span style={{ width: `${((step - 1) / 2) * 100}%` }}></span></div>
        {["Exchange", "Your details", "Confirm"].map((x, i) => (
          <div className={step >= i + 1 ? "p-step active" : "p-step"} key={x}><span>{i + 1}</span>{x}</div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div className="flow-card" key="one" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2>What would you like to do?</h2><p className="muted">Choose your direction and enter the amount.</p>
            <div className="big-toggle">
              <button className={mode === "sell" ? "active" : ""} onClick={() => setMode("sell")}><span>Sell USDT</span><small>Receive Naira</small></button>
              <button className={mode === "buy" ? "active" : ""} onClick={() => setMode("buy")}><span>Buy USDT</span><small>Pay Naira</small></button>
            </div>
            <label className="field-label">USDT amount</label>
            <div className="amount-box large">
              <input autoFocus value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}/>
              <span className="token"><span className="token-icon">₮</span> USDT</span>
            </div>
            <div className="quote-summary"><span>Rate</span><b>₦{money(rate)} / USDT</b><span>You {mode === "sell" ? "receive" : "pay"}</span><b>₦{money(naira)}</b></div>
            <button className="primary-btn full" onClick={() => setStep(2)}>Continue <ArrowRight size={18}/></button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div className="flow-card" key="two" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2>Your transaction details</h2><p className="muted">We'll use these to identify your order and send the USDT when applicable.</p>
            <label className="field-label">Phone number</label>
            <input className="text-input" placeholder="0800 000 0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/>
            <label className="field-label">USDT wallet address</label>
            <input className="text-input" placeholder="Enter your wallet address" value={form.wallet} onChange={e => setForm({ ...form, wallet: e.target.value })}/>
            <div className="info-box"><ShieldCheck size={18}/><span>Double-check your wallet address — it's used to send your coins once verified.</span></div>
            <div className="button-row"><button className="ghost-btn" onClick={() => setStep(1)}>Back</button><button className="primary-btn" onClick={() => setStep(3)}>Review <ArrowRight size={18}/></button></div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div className="flow-card" key="three" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2>Review your quote</h2><p className="muted">Confirm this is correct, then continue to payment.</p>
            <div className="review">
              <div><span>Direction</span><b>{mode === "sell" ? "Sell USDT" : "Buy USDT"}</b></div>
              <div><span>USDT amount</span><b>{money(Number(amount))} USDT</b></div>
              <div><span>Exchange rate</span><b>₦{money(rate)}</b></div>
              <div className="total"><span>Naira amount</span><b>₦{money(naira)}</b></div>
              <div><span>Phone</span><b>{form.phone || "—"}</b></div>
              <div><span>Wallet</span><b className="wallet-review">{form.wallet || "—"}</b></div>
            </div>
            <div className="button-row">
              <button className="ghost-btn" onClick={() => setStep(2)}>Back</button>
              <button className="primary-btn" onClick={() => onContinue({ mode, amount, rate, naira, phone: form.phone, wallet: form.wallet })}>
                Continue to payment <ArrowRight size={18}/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------- Payments tab ----------------
function QuoteSummaryCard({ draft }) {
  return (
    <div className="flow-card quote-card">
      <div className="card-top"><div><span className="eyebrow">YOUR QUOTE</span><h3>{draft.mode === "sell" ? "Selling" : "Buying"} {money(Number(draft.amount))} USDT</h3></div></div>
      <div className="bank-row"><span>Rate</span><b>₦{money(draft.rate)} / USDT</b></div>
      <div className="bank-row"><span>{draft.mode === "sell" ? "You receive" : "You pay"}</span><b>₦{money(draft.naira)}</b></div>
      <div className="bank-row"><span>Wallet</span><b className="wallet-review">{draft.wallet || "—"}</b></div>
    </div>
  );
}

function SubmissionForm({ draft, onSubmit }) {
  const [wallet, setWallet] = useState(draft?.wallet || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const okType = f.type === "application/pdf" || f.type.startsWith("image/");
    if (!okType) { setError("Please upload an image or a PDF file."); return; }
    if (f.size > 8 * 1024 * 1024) { setError("File is too large — please keep it under 8MB."); return; }
    setError("");
    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    } else setPreview(null);
  }

  function clearFile() { setFile(null); setPreview(null); }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!wallet.trim()) return setError("Please enter the wallet address to receive your coins.");
    if (!file) return setError("Please upload your payment receipt.");
    setSubmitting(true);
    onSubmit({ wallet: wallet.trim(), fileName: file.name, fileType: file.type });
  }

  return (
    <form className="flow-card submission-form" onSubmit={handleSubmit}>
      <div className="card-top"><div><span className="eyebrow">SUBMIT PAYMENT</span><h3>Confirm your transfer</h3></div></div>
      <label className="field-label">Wallet address to receive coins</label>
      <input className="text-input" placeholder="Enter your wallet address" value={wallet} onChange={e => setWallet(e.target.value)}/>
      <label className="field-label">Payment receipt</label>
      {!file ? (
        <label className="upload-box">
          <UploadCloud size={22}/><span>Click to upload image or PDF</span><small>Max 8MB</small>
          <input type="file" accept="image/*,application/pdf" onChange={handleFile} hidden/>
        </label>
      ) : (
        <div className="file-preview">
          {preview ? <img src={preview} alt="Receipt preview"/> : <div className="file-icon"><FileText size={22}/></div>}
          <div className="file-meta"><b>{file.name}</b><span>{(file.size / 1024).toFixed(0)} KB</span></div>
          <button type="button" className="file-remove" onClick={clearFile}><X size={15}/></button>
        </div>
      )}
      {error && <div className="auth-error">{error}</div>}
      <div className="info-box"><ShieldCheck size={18}/><span>Your order reference will be generated once you submit — copy it to track your payment.</span></div>
      <button className="primary-btn full" type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : <>Submit for verification <ArrowRight size={18}/></>}
      </button>
    </form>
  );
}

function PaymentSuccess({ submission, onTrack, onDashboard }) {
  const [copied, setCopied] = useState(false);
  function copyRef() {
    navigator.clipboard?.writeText(submission.ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <motion.div className="flow-card success-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <div className="success-icon"><Check size={34}/></div>
      <span className="eyebrow">PAYMENT SUBMITTED</span>
      <h2>Your order reference is ready.</h2>
      <p className="muted">Copy this reference — you'll need it to track your order.</p>
      <div className="order-ref">
        <span>Order reference</span><strong>{submission.ref}</strong>
        <button type="button" onClick={copyRef}><Copy size={16}/> {copied ? "Copied" : "Copy"}</button>
      </div>
      <div className="button-row">
        <button className="ghost-btn" onClick={onDashboard}>Back to dashboard</button>
        <button className="primary-btn" onClick={onTrack}>Track this order <Search size={16}/></button>
      </div>
    </motion.div>
  );
}

function PaymentsTab({ draft, successSubmission, onSubmit, onTrackSuccess, onDismissSuccess, onGoExchange }) {
  if (successSubmission) {
    return <PaymentSuccess submission={successSubmission} onTrack={onTrackSuccess} onDashboard={onDismissSuccess}/>;
  }

  if (!draft) {
    return (
      <div className="flow-card empty-state">
        <Receipt size={22}/>
        <p className="muted">Start an exchange first to get a quote, then come back here to submit your payment.</p>
        <button className="primary-btn" onClick={onGoExchange}>Start an exchange <ArrowRight size={18}/></button>
      </div>
    );
  }

  return (
    <div className="account-grid">
      <div className="payments-left">
        <QuoteSummaryCard draft={draft}/>
        <BankCard/>
      </div>
      <SubmissionForm draft={draft} onSubmit={onSubmit}/>
    </div>
  );
}

// ---------------- Account (top-level) ----------------
export default function Account() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "exchange" ? "exchange" : "dashboard");
  const [draft, setDraft] = useState(null);
  const [successSubmission, setSuccessSubmission] = useState(null);
  const [trackOpen, setTrackOpen] = useState(searchParams.get("track") === "1");
  const [trackInitialRef, setTrackInitialRef] = useState("");

  useEffect(() => {
    if (user) setSubmissions(loadSubmissions(user.email));
  }, [user]);

  if (!user) return <Navigate to="/login" replace/>;

  function goTab(tab) {
    setActiveTab(tab);
    setSearchParams({});
  }

  function openTrack(ref = "") {
    setTrackInitialRef(ref);
    setTrackOpen(true);
  }

  function closeTrack() {
    setTrackOpen(false);
    if (searchParams.get("track")) setSearchParams({});
  }

  function handleExchangeContinue(exchangeDraft) {
    setDraft(exchangeDraft);
    setActiveTab("payments");
  }

  function handlePaymentSubmit(partial) {
    const ref = `FX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`;
    const submission = {
      id: `SUB-${Date.now()}`,
      ref,
      mode: draft.mode,
      amount: draft.amount,
      naira: draft.naira,
      rate: draft.rate,
      phone: draft.phone,
      wallet: partial.wallet,
      fileName: partial.fileName,
      fileType: partial.fileType,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    const updated = [submission, ...submissions];
    setSubmissions(updated);
    saveSubmissions(user.email, updated);
    setDraft(null);
    setSuccessSubmission(submission);
  }

  function demoAdvanceStatus(id, status) {
    const updated = submissions.map(s => s.id === id ? { ...s, status } : s);
    setSubmissions(updated);
    saveSubmissions(user.email, updated);
  }

  return (
    <main className="account-page container">
      <div className="flow-heading">
        <div>
          <span className="eyebrow">YOUR ACCOUNT</span>
          <h1>Welcome, {user.name?.split(" ")[0] || user.email}.</h1>
          <p className="muted">Manage your exchanges, payments and orders in one place.</p>
        </div>
        <div className="account-header-actions">
          <button className="ghost-btn" onClick={() => openTrack()}><Search size={16}/> Track order</button>
          <Link className="ghost-btn" to="/">← Back home</Link>
        </div>
      </div>

      <TabNav active={activeTab} onChange={goTab}/>

      {activeTab === "dashboard" && (
        <DashboardTab submissions={submissions} onGoExchange={() => goTab("exchange")} onOpenTrack={() => openTrack()}/>
      )}

      {activeTab === "exchange" && (
        <ExchangeTab
          initialMode={searchParams.get("mode")}
          initialAmount={searchParams.get("amount")}
          onContinue={handleExchangeContinue}
        />
      )}

      {activeTab === "payments" && (
        <PaymentsTab
          draft={draft}
          successSubmission={successSubmission}
          onSubmit={handlePaymentSubmit}
          onTrackSuccess={() => { openTrack(successSubmission.ref); setSuccessSubmission(null); }}
          onDismissSuccess={() => { setSuccessSubmission(null); goTab("dashboard"); }}
          onGoExchange={() => goTab("exchange")}
        />
      )}

      {activeTab !== "dashboard" && (
        <div className="section-head compact" style={{ marginTop: 40 }}>
          <div><span className="eyebrow">HISTORY</span><h2>All transactions</h2></div>
        </div>
      )}
      {activeTab !== "dashboard" && <SubmissionsList items={submissions}/>}

      <TrackPanel
        open={trackOpen}
        onClose={closeTrack}
        submissions={submissions}
        initialRef={trackInitialRef}
        onDemoAdvance={demoAdvanceStatus}
      />
    </main>
  );
}
