#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("GiT5e2Vg9yTqiozmxjJG86ZLaejUstRTKbkDSz6JSLDk");

#[program]
pub mod journey {
    use super::*;

  pub fn close(_ctx: Context<Closejourney>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.journey.count = ctx.accounts.journey.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.journey.count = ctx.accounts.journey.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<Initializejourney>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.journey.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct Initializejourney<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + journey::INIT_SPACE,
  payer = payer
  )]
  pub journey: Account<'info, journey>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct Closejourney<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub journey: Account<'info, journey>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub journey: Account<'info, journey>,
}

#[account]
#[derive(InitSpace)]
pub struct journey {
  count: u8,
}
