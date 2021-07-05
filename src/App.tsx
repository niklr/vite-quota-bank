import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Main } from './components';
import { ConnectedWeb3 } from './hooks';
import { Web3Provider } from './hooks/web3';

const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Web3Provider>
        <ConnectedWeb3>
          <Main />
        </ConnectedWeb3>
      </Web3Provider>
    </SnackbarProvider>
  );
}

export default App;
