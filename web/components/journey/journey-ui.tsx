'use client';

import { Keypair, PublicKey } from '@solana/web3.js';
import { ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import {
  useJourneyProgram,
  useJourneyProgramAccount,
} from './journey-data-access';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function JourneyCreate() {
  // const { initialize } = useJourneyProgram();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const { createEntry } = useJourneyProgramAccount();
  const { publicKey } = useWallet();

  const isFormValid = title?.trim() !== '' && message?.trim() !== '';

  const handleSubmit = () => {
    if (!isFormValid) {
      return;
    }
    createEntry.mutateAsync({
      title,
      message,
      owner: publicKey as PublicKey,
    });
  };

  if (!publicKey) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Please connect your wallet to create a new account.</span>
      </div>
    );
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <textarea name="message" id="message" placeholder="message"></textarea>
      <button
        onClick={handleSubmit}
        disabled={createEntry.isPending || !isFormValid}
        className="btn btn-primary"
      >
        CREATE ENTRY
      </button>
    </div>
  );
}

export function journeyList() {
  const { accounts, getProgramAccount } = useJourneyProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <journeyCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function journeyCard({ account }: { account: PublicKey }) {
  const {
    accountQuery,
    incrementMutation,
    setMutation,
    decrementMutation,
    closeMutation,
  } = useJourneyProgramAccount({ account });

  const count = useMemo(
    () => accountQuery.data?.count ?? 0,
    [accountQuery.data?.count]
  );

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2
            className="card-title justify-center text-3xl cursor-pointer"
            onClick={() => accountQuery.refetch()}
          >
            {count}
          </h2>
          <div className="card-actions justify-around">
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={() => incrementMutation.mutateAsync()}
              disabled={incrementMutation.isPending}
            >
              Increment
            </button>
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={() => {
                const value = window.prompt(
                  'Set value to:',
                  count.toString() ?? '0'
                );
                if (
                  !value ||
                  parseInt(value) === count ||
                  isNaN(parseInt(value))
                ) {
                  return;
                }
                return setMutation.mutateAsync(parseInt(value));
              }}
              disabled={setMutation.isPending}
            >
              Set
            </button>
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={() => decrementMutation.mutateAsync()}
              disabled={decrementMutation.isPending}
            >
              Decrement
            </button>
          </div>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    'Are you sure you want to close this account?'
                  )
                ) {
                  return;
                }
                return closeMutation.mutateAsync();
              }}
              disabled={closeMutation.isPending}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
