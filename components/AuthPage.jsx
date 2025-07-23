import { useState } from "react";
import Register from "./Register";
import Verify from "./Verify";
import Login from "./Login";

export default function AuthPage() {
  const [stage, setStage] = useState("login"); // login, register, verify
  const [emailToVerify, setEmailToVerify] = useState("");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  return (
    <div>
      {stage === "login" && (
        <>
          <Login
            onLogin={(tok, usr) => {
              setToken(tok);
              setUser(usr);
            }}
          />
          <p>
            Hesabın yok mu?{" "}
            <button onClick={() => setStage("register")}>Kayıt Ol</button>
          </p>
        </>
      )}

      {stage === "register" && (
        <>
          <Register
            onRegistered={(email) => {
              setEmailToVerify(email);
              setStage("verify");
            }}
          />
          <p>
            Zaten üye misin?{" "}
            <button onClick={() => setStage("login")}>Giriş Yap</button>
          </p>
        </>
      )}

      {stage === "verify" && (
        <>
          <Verify
            email={emailToVerify}
            onVerified={() => setStage("login")}
          />
          <p>
            Kodu aldın mı? <button onClick={() => setStage("login")}>Giriş Yap</button>
          </p>
        </>
      )}

      {token && <p>Hoşgeldin, {user.username}!</p>}
    </div>
  );
}
