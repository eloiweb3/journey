'use client';

import { getjourneyProgram, getjourneyProgramId } from '@journey/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function usejourneyProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getjourneyProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getjourneyProgram(provider);

  const accounts = useQuery({
    queryKey: ['journey', 'all', { cluster }],
    queryFn: () => program.account.journey.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['journey', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ journey: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function usejourneyProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = usejourneyProgram();

  const accountQuery = useQuery({
    queryKey: ['journey', 'fetch', { cluster, account }],
    queryFn: () => program.account.journey.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['journey', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ journey: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['journey', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ journey: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['journey', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ journey: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['journey', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ journey: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
