// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import journeyIDL from '../target/idl/journey.json';
import type { Journey } from '../target/types/journey';

// Re-export the generated IDL and type
export { Journey, journeyIDL };

// The programId is imported from the program IDL.
export const journey_PROGRAM_ID = new PublicKey(journeyIDL.address);

// This is a helper function to get the Journey Anchor program.
export function getJourneyProgram(provider: AnchorProvider) {
  return new Program(journeyIDL as Journey, provider);
}

// This is a helper function to get the program ID for the Journey program depending on the cluster.
export function getJourneyProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Journey program on devnet and testnet.
      return new PublicKey('6zWkuhQsb7AYBjt9zHSQdmgyBFMoPhmHqBaCXvMBuFvM');
    case 'mainnet-beta':
    default:
      return journey_PROGRAM_ID;
  }
}
