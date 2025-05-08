#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("6zWkuhQsb7AYBjt9zHSQdmgyBFMoPhmHqBaCXvMBuFvM");

#[program]
pub mod journey {
    use super::*;

    pub fn create_journey_entry(
        ctx: Context<CreateJourneyEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        let journey_entry = &mut ctx.accounts.journey_entry;
        journey_entry.owner = *ctx.accounts.owner.key;
        journey_entry.title = title;
        journey_entry.message = message;
        Ok(())
    }

    pub fn update_journey_entry(
        ctx: Context<UpdateJourneyEntry>,
        _title: String,
        message: String,
    ) -> Result<()> {
        let journey_entry = &mut ctx.accounts.journey_entry;
        journey_entry.message = message;
        Ok(())
    }

    pub fn delete_journey_entry(_ctx: Context<DeleteJourneyEntry>, _title: String) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateJourneyEntry<'info> {
    #[account(init,
      seeds = [title.as_bytes(), owner.key().as_ref()],
      bump,
      space = 8 + JourneyEntryState::INIT_SPACE,
      payer = owner)]
    pub journey_entry: Account<'info, JourneyEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateJourneyEntry<'info> {
    #[account(
      mut,
      seeds = [title.as_bytes(), owner.key().as_ref()],
      bump,
      realloc = 8 + JourneyEntryState::INIT_SPACE,
      realloc::payer = owner,
      realloc::zero = true,
  )]
    pub journey_entry: Account<'info, JourneyEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteJourneyEntry<'info> {
    #[account(
      mut,
      seeds = [title.as_bytes(), owner.key().as_ref()],
      bump,
      close = owner,
  )]
    pub journey_entry: Account<'info, JourneyEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct JourneyEntryState {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(1000)]
    pub message: String,
}
