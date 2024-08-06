import React, { useState } from "react";
import { useXtzWallet } from "./XtzContextProvider";

const XtzStakingWidget = () => {
  const [stakingState, setStakingState] = useState<
    "initial" | "pending_tx_signature" | "processing_tx" | "delegating_success"
  >("initial");
  const [txSignature, setTxSignature] = useState("");
  const { account, delegate } = useXtzWallet();

  const handleStakeNow = async () => {
    if (!delegate || !account) return;
    try {
      // Pending tx signature
      setStakingState("pending_tx_signature");
      const op = await delegate();

      if(!op) {
        throw new Error("No operation found.");
      }

      // Pending tx confirmation
      setStakingState("processing_tx");
      const result = await op.confirmation();

      // Transaction confirmed
      if (result?.completed && op.opHash) {
        setTxSignature(op.opHash);
        setStakingState("delegating_success");
      } else {
        // Transaction failed
        throw new Error("Transaction failed.");
      }
    } catch (err) {
      console.log(err);
      alert("Transaction failed. Please try again later.");
      setStakingState("initial");
    }
  };


  // if(!account) return null;

  return (
    <div>
      <div>
        {stakingState === "initial" && (
          <>
            <button
              onClick={handleStakeNow}
              disabled={!account}
            >
              Stake
            </button>
          </>
        )}

        {stakingState === "pending_tx_signature" && <p>Waiting for signature...</p>}

        {stakingState === "processing_tx" && <p>Processing transaction...</p>}

        {stakingState === "delegating_success" && (
          <>
            <div>
              You have successfully staked!
              <br />
              <a
                href={`https://tzstats.com/${txSignature}`}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  View transaction
                </span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default XtzStakingWidget;
