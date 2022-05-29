import Layout from '../components/layout'
import Game from '../components/game'

export default function Play (): JSX.Element {
  return (
    <Layout focus>
      <h1>It's time to play.</h1>
      <p>Click the game to start</p>

      <Game />
    </Layout>
  )
}
