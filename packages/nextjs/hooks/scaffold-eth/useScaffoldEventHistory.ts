import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Abi, AbiEvent, ExtractAbiEventNames } from "abitype";
import { Hash, Log } from "viem";
import { usePublicClient } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import {
  ContractAbi,
  ContractName,
  UseScaffoldEventHistoryConfig,
  UseScaffoldEventHistoryData,
} from "~~/utils/scaffold-eth/contract";

const CHUNK_SIZE = 100000n;

/**
 * Reads events from a deployed contract
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.eventName - name of the event to listen for
 * @param config.fromBlock - the block number to start reading events from
 * @param config.filters - filters to be applied to the event (parameterName: value)
 * @param config.blockData - if set to true it will return the block data for each event (default: false)
 * @param config.transactionData - if set to true it will return the transaction data for each event (default: false)
 * @param config.receiptData - if set to true it will return the receipt data for each event (default: false)
 * @param config.watch - if set to true, the events will be updated every pollingInterval milliseconds set at scaffoldConfig (default: false)
 * @param config.enabled - set this to false to disable the hook from running (default: true)
 */
export const useScaffoldEventHistory = <
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
  TBlockData extends boolean = false,
  TTransactionData extends boolean = false,
  TReceiptData extends boolean = false,
>({
  contractName,
  eventName,
  fromBlock,
  filters,
  blockData,
  transactionData,
  receiptData,
  watch,
  enabled = true,
}: UseScaffoldEventHistoryConfig<TContractName, TEventName, TBlockData, TTransactionData, TReceiptData>) => {
  const [events, setEvents] = useState<any[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const { targetNetwork } = useTargetNetwork();
  const publicClient = usePublicClient({ chainId: targetNetwork.id });

  const isFetching = useRef(false);
  const isWatching = useRef(false);

  const memoizedFilters = useMemo(() => JSON.stringify(filters), [filters]);

  const getHistoricalEvents = useCallback(async () => {
    if (!enabled || !publicClient || !deployedContractData || isFetching.current) {
      return;
    }
    isFetching.current = true;
    setIsLoading(true);
    setError(undefined);

    try {
      const event = (deployedContractData.abi as Abi).find(
        part => part.type === "event" && part.name === eventName,
      ) as AbiEvent;

      const blockNumber = await publicClient.getBlockNumber();

      if (fromBlock > blockNumber) {
        setEvents([]);
        return;
      }

      const historicalLogs: Log[] = [];
      for (let i = fromBlock; i <= blockNumber; i += CHUNK_SIZE) {
        const toBlock = i + CHUNK_SIZE - 1n < blockNumber ? i + CHUNK_SIZE - 1n : blockNumber;
        const logs = await publicClient.getLogs({
          address: deployedContractData.address,
          event,
          args: filters as any,
          fromBlock: i,
          toBlock,
        });
        historicalLogs.push(...logs);
      }

      const newEvents = await Promise.all(
        historicalLogs.map(async log => {
          const block = blockData ? await publicClient.getBlock({ blockHash: log.blockHash as Hash }) : null;
          const transaction = transactionData
            ? await publicClient.getTransaction({ hash: log.transactionHash as Hash })
            : null;
          const receipt = receiptData
            ? await publicClient.getTransactionReceipt({ hash: log.transactionHash as Hash })
            : null;

          return {
            log,
            args: (log as any).args,
            block,
            transaction,
            receipt,
          };
        }),
      );

      setEvents(newEvents.reverse());
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [
    enabled,
    publicClient,
    deployedContractData,
    eventName,
    fromBlock,
    filters,
    blockData,
    transactionData,
    receiptData,
  ]);

  useEffect(() => {
    // Reset state when any of these dependencies change
    setEvents(undefined);
    setError(undefined);
    isFetching.current = false;
    isWatching.current = false;
  }, [contractName, eventName, fromBlock, targetNetwork.id, memoizedFilters]);

  useEffect(() => {
    getHistoricalEvents();

    if (!watch || !publicClient || !deployedContractData || isWatching.current) {
      return;
    }

    isWatching.current = true;

    const unwatch = publicClient.watchContractEvent({
      address: deployedContractData.address,
      abi: deployedContractData.abi,
      eventName: eventName,
      args: filters as any,
      onLogs: async newLogs => {
        const newEvents = await Promise.all(
          newLogs.map(async log => {
            const block = blockData ? await publicClient.getBlock({ blockHash: log.blockHash as Hash }) : null;
            const transaction = transactionData
              ? await publicClient.getTransaction({ hash: log.transactionHash as Hash })
              : null;
            const receipt = receiptData
              ? await publicClient.getTransactionReceipt({ hash: log.transactionHash as Hash })
              : null;

            return {
              log,
              args: (log as any).args,
              block,
              transaction,
              receipt,
            };
          }),
        );
        setEvents(prevEvents => [...newEvents, ...(prevEvents || [])]);
      },
    });

    return () => {
      unwatch();
      isWatching.current = false;
    };
  }, [
    watch,
    publicClient,
    deployedContractData,
    eventName,
    filters,
    blockData,
    transactionData,
    receiptData,
    getHistoricalEvents,
  ]);

  const eventHistoryData = useMemo(
    () =>
      events?.map(addIndexedArgsToEvent) as UseScaffoldEventHistoryData<
        TContractName,
        TEventName,
        TBlockData,
        TTransactionData,
        TReceiptData
      >,
    [events],
  );

  return {
    data: eventHistoryData,
    isLoading: isLoading,
    error: error,
  };
};

export const addIndexedArgsToEvent = (event: any) => {
  if (event.args && !Array.isArray(event.args)) {
    return { ...event, args: { ...event.args, ...Object.values(event.args) } };
  }

  return event;
};
