import { Button } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
`

const App: React.FC = () => {
  return (
    <Container>
      <Button>Press me?</Button>
    </Container>
  );
}

export default App;
