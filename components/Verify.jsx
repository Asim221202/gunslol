import { useState } from "react";

export default function Verify({ email, onVerified }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.msg);
        onVerified();
      } else {
        setMsg(data.msg || "Doğrulama başarısız");
      }
    } catch (err) {
      setMsg("Sunucuya bağlanılamadı");
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <input
        type="text"
        placeholder="Doğrulama Kodu"
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button type="submit">Doğrula</button>
      <p>{msg}</p>
    </form>
  );
}
