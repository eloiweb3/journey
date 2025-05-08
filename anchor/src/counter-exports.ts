// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import journeyIDL from '../target/idl/journey.json';
import type { journey } from '../target/types/journey';

// Re-export the generated IDL and type
export { journey, journeyIDL };

// The programId is imported from the program IDL.
export const journey_PROGRAM_ID = new PublicKey(journeyIDL.address);

// This is a helper function to get the journey Anchor program.
export function getjourneyProgram(provider: AnchorProvider) {
  return new Program(journeyIDL as journey, provider);
}

// This is a helper function to get the program ID for the journey program depending on the cluster.
export function getjourneyProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the journey program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg');
    case 'mainnet-beta':
    default:
      return journey_PROGRAM_ID;
  }
}
