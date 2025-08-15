"use client";

import { useEffect, useState } from 'react';
import { usePrivy, type CrossAppAccountWithMetadata } from "@privy-io/react-auth";
import './MonadGamesId.css';

export default function MonadGamesId() {
  const { authenticated, user, ready, logout, login } = usePrivy();
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchUsername = async (walletAddress: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        setUsername(data.hasUsername ? data.user.username : "");
      }
    } catch (err) {
      console.error("Error fetching username:", err);
      setError("Failed to load username");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAccountAddress("");
    setUsername("");
    setError("");

    if (authenticated && user && ready && user.linkedAccounts.length > 0) {
      const crossAppAccount = user.linkedAccounts.find(
        account => account.type === "cross_app" && account.providerApp.id === "cmd8euall0037le0my79qpz42"
      ) as CrossAppAccountWithMetadata;

      if (crossAppAccount?.embeddedWallets.length > 0) {
        const walletAddress = crossAppAccount.embeddedWallets[0].address;
        setAccountAddress(walletAddress);
        fetchUsername(walletAddress);
      } else {
        setError("Monad Games ID account not found");
      }
    } else if (authenticated && user && ready) {
      setError("Please link your Monad Games ID account");
    }
  }, [authenticated, user, ready]);

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  if (!ready) return <div>Loading...</div>;

  return (
    <div className="card">
      {error && <p className="error">{error}</p>}

      {accountAddress ? (
        <div className="row">
          {loading ? (
            <p className="loading">Loading...</p>
          ) : username ? (
            <div className="username">User: {username}</div>
          ) : (
            <div className="register">
              <a href="https://monad-games-id-site.vercel.app/" target="_blank" rel="noopener noreferrer">
                Register Username
              </a>
            </div>
          )}

          <div className="wallet">{truncateAddress(accountAddress)}</div>

          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      ) : (
        !authenticated && (
          <button onClick={login} className="login-btn">Login</button>
        )
      )}
    </div>
  );
}
