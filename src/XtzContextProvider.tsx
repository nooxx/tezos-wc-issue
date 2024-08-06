import React, { createContext, useContext, useState } from "react";
import { NetworkType } from "@airgap/beacon-dapp";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { DelegationWalletOperation, MichelCodecPacker, TezosToolkit } from "@taquito/taquito";
import { ReadOnlySigner } from "./ReadOnlySigner";

export const michelEncoder = new MichelCodecPacker();

export type XtzContextType = {
  account: string | undefined;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  delegate?: () => Promise<DelegationWalletOperation | void>;
};

const XTZ_RPC = "https://mainnet.api.tez.ie";
const BAKER_ADDRESS = "tz1ffYUjwjduZkoquw8ryKRQaUjoWJviFVK6"

export const XtzContext = createContext({} as XtzContextType);

export const beaconWallet = new BeaconWallet({
  name: "My dapp",
  network: { type: NetworkType.MAINNET },
  // walletConnectOptions: {
  //   projectId: env.WALLET_CONNECT_PROJECT_ID,
  // },
});

type Props = {
  children: React.ReactNode;
};

const XtzContextProvider = ({ children }: Props) => {
  const [account, setAccount] = useState<string>();
  const [tezosToolkit, setTezosToolkit] = useState<TezosToolkit>();

  // Connect wallet
  const connect = async (): Promise<void> => {
    if (!beaconWallet) return;
    try {
      // Reset state
      await reset();

      // Request permissions
      await beaconWallet.requestPermissions();

      // Check if we are connected. If not, do a permission request first.
      const activeAccount = await beaconWallet.client.getActiveAccount();
      if (!activeAccount || !activeAccount.publicKey) {
        throw new Error("No active account found.");
      }
      setAccount(activeAccount.address);
      const tezos = new TezosToolkit(XTZ_RPC);
      setTezosToolkit(tezos);
      tezos.setWalletProvider(beaconWallet);
      tezos.setSignerProvider(new ReadOnlySigner(activeAccount.address, activeAccount.publicKey));
      tezos.setPackerProvider(michelEncoder);
    } catch (err) {
      console.log(err);
    }
  };

  // Disconnect wallet
  const disconnect = async (): Promise<void> => {
    try {
      await reset();
    } catch (err) {
      console.log(err);
    }
  };

  const reset = async (): Promise<void> => {
    setAccount(undefined);
    if (!beaconWallet) return;
    await beaconWallet.clearActiveAccount();
  };

  // Send delegate operation
  const delegate = async (): Promise<DelegationWalletOperation | void> => {
    if (!tezosToolkit) return;

    try {
      return await tezosToolkit.wallet.setDelegate({ delegate: BAKER_ADDRESS }).send();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <XtzContext.Provider
      value={{
        account,
        connect,
        disconnect,
        delegate,
      }}
    >
      {children}
    </XtzContext.Provider>
  );
};

export const useXtzWallet = () => useContext(XtzContext);

export default XtzContextProvider;
