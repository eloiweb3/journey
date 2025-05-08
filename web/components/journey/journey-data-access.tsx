'use client';

import { getJourneyProgram, getJourneyProgramId } from '@journey/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

interface CreateEntryArgs {
  title: string;
  message: string;
  owner: PublicKey;
}

export function useJourneyProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getJourneyProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getJourneyProgram(provider);

  const accounts = useQuery({
    queryKey: ['journey', 'all', { cluster }],
    queryFn: () => program.account.journeyEntryState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useJourneyProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useJourneyProgram();

  const accountQuery = useQuery({
    queryKey: ['journey', 'fetch', { cluster, account }],
    queryFn: () => program.account.journeyEntryState.fetch(account),
  });

  const createEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['journey-entry', 'create-entry', { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      return program.methods.createJourneyEntry(title, message).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to create entry'),
  });

  const updateEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['journey-entry', 'update-entry', { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      return program.methods.updateJourneyEntry(title, message).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to update entry'),
  });

  const deleteEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['journey-entry', 'delete-entry', { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      return program.methods.deleteJourneyEntry(title).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to delete entry'),
  });

  return {
    accountQuery,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
