use anchor_lang::prelude::*;

declare_id!("65D1me4RDs45aHUb59Uv7RcGFivkxvFVTDoDWvNfaE41");

#[program]
pub mod solana_dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
