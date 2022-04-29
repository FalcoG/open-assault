import Layout from '../components/layout'
import Game from '../components/game'

export default function Play (): JSX.Element {
  return (
    <Layout>
      <h1>It's time to play.</h1>
      <p>Click <a>here</a>, or press SPACE to start</p>

      <Game />
    </Layout>
  )
}
