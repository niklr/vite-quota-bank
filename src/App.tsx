import React, { useEffect, useState } from 'react';
import { Main } from './components';
import { Header } from './components/common';
import { ConnectedWeb3 } from './hooks';
import { getNetworkFromChain } from './util/tools';

const App: React.FC = () => {
  const networkId = '2'
  const [status, setStatus] = useState(true)
  const network = getNetworkFromChain(networkId)

  useEffect(() => {
    // if (network) checkRpcStatus(network.url, setStatus, network)
  }, [network])

  return (
    <>
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
    </>
  );
}

export default App;
