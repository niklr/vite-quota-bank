import { Button } from '@material-ui/core'
import { useConnectedWeb3Context } from '../hooks'
import { Header } from './common'

export const Main: React.FC = (props: any) => {
  const context = useConnectedWeb3Context()
  return (
    <>
      <Header />
      <Button>Press me</Button>
      <div>NetworkId: {context.network.id}</div>
    </>
  )
}
