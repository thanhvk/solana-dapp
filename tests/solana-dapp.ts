import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaDapp } from "../target/types/solana_dapp";
import { expect } from "chai";

describe("solana-dapp", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaDapp as Program<SolanaDapp>;
  const programProvider = program.provider as anchor.AnchorProvider;
  const { SystemProgram } = anchor.web3
  const baseAccount = anchor.web3.Keypair.generate();

  it("Creates a counter", async () => {
    await program.methods
      .create()
      .accounts({
        baseAccount: baseAccount.publicKey,
        user: programProvider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([baseAccount])
      .rpc();

    /* Fetch the account and check the value of count */
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('account:', account);
    console.log('Count 0: ', account.count.toString())

    expect(+account.count.toString())
      .to
      .eq(0)
  });

  it("Increments the counter", async () => {
    await program.methods
      .increment()
      .accounts({
        baseAccount: baseAccount.publicKey,
      })
      .rpc();

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Count 1: ', account.count.toString())
    expect(+account.count.toString())
      .to
      .eq(1)
  });
});
