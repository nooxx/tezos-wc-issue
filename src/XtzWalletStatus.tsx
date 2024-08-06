import React, { useState } from "react";
import { useXtzWallet } from "./XtzContextProvider";

const XtzWalletStatus = () => {
  const { account, disconnect, connect } = useXtzWallet();
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  const handleDisconnect = async () => {
    await disconnect();
  };

  const handleCopyAddress = async () => {
    if (!account) return;
    await navigator.clipboard.writeText(account);
    setIsAddressCopied(true);
    setTimeout(() => setIsAddressCopied(false), 1000);
  };

  return (
    <>
      <div>
        {!account ? (
          <div>
            <button onClick={connect}>
              Connect wallet
            </button>
          </div>
        ) : (
          <div>
            {account && (
              <>
                <div>
                  <p>Network: Mainnet</p>
                  <span>{account}</span>
                </div>
                <div>
                  <button onClick={handleCopyAddress}>
                    {isAddressCopied ? (
                      <span>copied</span>
                    ) : (
                      <span>copy</span>
                    )}
                  </button>
                  <button onClick={handleDisconnect}>
                    disconnect
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default XtzWalletStatus;
