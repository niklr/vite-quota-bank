import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Header } from './components/common';
import { ConnectedWeb3 } from './hooks';
import { getNetworkFromChain } from './util/tools';

const Container = styled.div`
  text-align: center;
`

const App: React.FC = () => {
  const networkId = '2'
  const [status, setStatus] = useState(true)
  const network = getNetworkFromChain(networkId)

  useEffect(() => {
    // if (network) checkRpcStatus(network.url, setStatus, network)
  }, [network])

  return (
    <Container>
      {!status ? (
        <>
          <Header />
        </>
      ) : (
        <>
          <Header />
          <ConnectedWeb3 networkId={network?.id} setStatus={setStatus}>
            <Button>Press me</Button>
            <div>NetworkId: {networkId}</div>
            <div>Status: {String(status)}</div>
          </ConnectedWeb3>
        </>
      )}
    </Container>
  );
}

export default App;
