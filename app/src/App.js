import "./App.css"
import { useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useWallet, WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import solanaBanner from "./solana.png";
import idl from "./idl.json";

require("@solana/wallet-adapter-react-ui/styles.css");

const wallets = [
  new PhantomWalletAdapter()
]

const { SystemProgram, Keypair } = web3;
/* create an account  */
const baseAccount = Keypair.generate();

const opts = {
  commitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [value, setValue] = useState(null);
  const [tx, setTx] = useState();
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  async function getProvider() {
    /* create the provider and return it to the caller */
    const network = clusterApiUrl("devnet");
    const connection = new Connection(network, opts.commitment);

    const provider = new AnchorProvider(
      connection,
      wallet,
      opts.commitment,
    );

    return provider;
  }

  async function createCounter() {    
    const provider = await getProvider()
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider);

    try {
      setLoading(true);

      const tx = await program.methods
        .create()
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([baseAccount])
        .rpc();

      setLoading(false);
      setTx(tx);

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      setValue(account.count.toString());
    } catch (err) {
      setLoading(false);
      console.log("Transaction error: ", err);
    }
  }

  async function increment() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);

    try {
      setLoading(true);

      const tx = await program.methods
        .increment()
        .accounts({
          baseAccount: baseAccount.publicKey
        })
        .rpc();

      setLoading(false);
      setTx(tx);

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      setValue(account.count.toString());
    } catch (err) {
      setLoading(false);
      console.log("Transaction error: ", err);
    }
  }

  return (
    <div className="app">
      <div className="app-header">
        <WalletMultiButton />
      </div>

      <div className="app-content">
        {!wallet.connected && (
          <div className="app-banner">
            <img src={solanaBanner} alt="solana" />
            <div className="app-banner-content">
              Building Full Stack dapp with Solana, Anchor, React, Wallet Adapter, Web3.js and Phantom wallet.
            </div>
          </div>
        )}

        {wallet.connected &&
          <div>
            {
              !value && (<button disabled={loading} className="counter-btn" onClick={createCounter}>Create counter</button>)
            }

            {
              value && <button disabled={loading} className="counter-btn" onClick={increment}>Increment counter</button>
            }

            {value && value >= Number(0) ? (
                <h2>{value}</h2>
              ) : (
                <h3>Please create the counter.</h3>
              )
            }

            {loading && <div>Loading...</div>}

            {!loading && tx && (
                <div style={{marginTop: "25px"}}>
                  <a className="link" href={`https://solscan.io/tx/${tx}?cluster=devnet`} target="_blank" rel="noreferrer" >tx: {tx.slice(0, 6)}...{tx.slice(-6)}</a>
                </div>
              )
            }
          </div>
        }
      </div>
    </div>
  );
}

const AppWithProvider = () => (
  <ConnectionProvider endpoint={clusterApiUrl("devnet")}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;