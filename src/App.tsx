import { SnackbarProvider } from 'notistack';
import React, { useState } from 'react';
import { getNetworkFromChain } from './common/networks';
import { Main } from './components';
import { Header } from './components/common';
import { ConnectedWeb3 } from './hooks';
import { Web3Provider } from './hooks/web3';

const App: React.FC = () => {
  const networkId = '2'
  const [status, setStatus] = useState(true)
  const network = getNetworkFromChain(networkId)

  return (
    <SnackbarProvider maxSnack={3}>
      <Web3Provider>
        {!status ? (
          <>
            <Header />
          </>
        ) : (
          <>
            <ConnectedWeb3 networkId={network?.id} setStatus={setStatus}>
              <Main />
            </ConnectedWeb3>
          </>
        )}
      </Web3Provider>
    </SnackbarProvider>
  );
}

export default App;
