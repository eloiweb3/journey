import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { journey } from '../target/types/journey';

describe('journey', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.journey as Program<journey>;

  const journeyKeypair = Keypair.generate();

  it('Initialize journey', async () => {
    await program.methods
      .initialize()
      .accounts({
        journey: journeyKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([journeyKeypair])
      .rpc();

    const currentCount = await program.account.journey.fetch(
      journeyKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment journey', async () => {
    await program.methods
      .increment()
      .accounts({ journey: journeyKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.journey.fetch(
      journeyKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment journey Again', async () => {
    await program.methods
      .increment()
      .accounts({ journey: journeyKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.journey.fetch(
      journeyKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement journey', async () => {
    await program.methods
      .decrement()
      .accounts({ journey: journeyKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.journey.fetch(
      journeyKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set journey value', async () => {
    await program.methods
      .set(42)
      .accounts({ journey: journeyKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.journey.fetch(
      journeyKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the journey account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        journey: journeyKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.journey.fetchNullable(
      journeyKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
