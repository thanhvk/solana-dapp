import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaDapp } from "../target/types/solana_dapp";

describe("solana-dapp", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaDapp as Program<SolanaDapp>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
