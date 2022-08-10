import { useWeb3React } from '@web3-react/core';
import { network } from 'connectors';
import { NetworkContextName } from '../../constants';
import { useEagerConnect, useInactiveListener } from 'hooks';
import { useEffect, useState } from 'react';
import { useClasses } from 'hooks';
import { styles as web3ReactManagerStyles } from './Web3ReactManager.styles';
import { CircularProgress } from '@chakra-ui/react';

export const Web3ReactManager = ({ children }: { children: JSX.Element }) => {
  const styles = useClasses(web3ReactManagerStyles);
  const { active } = useWeb3React();
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React(NetworkContextName);

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();
  //const triedEager = true

  //console.log({ active, networkActive, networkError, triedEager });

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd

  //console.log('eager', {triedEager, networkActive, networkError, active})
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      //console.log('eager activate')
      activateNetwork(network);
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active]);

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager);

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    console.error('eager fail');
    return null;
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return <div className={styles.messageWrapper}>Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device.</div>;
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? (
      <div className={styles.messageWrapper}>
        <CircularProgress />
      </div>
    ) : null;
  }

  return children;
};
