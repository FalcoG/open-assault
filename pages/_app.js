import Head from 'next/head'
import '../styles/core.scss'
import { siteTitle } from '../components/layout'

export default function App ({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel='shortcut icon' href='/favicon.ico' />
        <title>{siteTitle}</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
