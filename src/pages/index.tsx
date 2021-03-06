import Head from 'next/head';

import { CurrencyConverter } from 'components/CurrencyConverter/CurrencyConverter';

const Home = () => (
  <div className="flex justify-center p-4 md:p-8">
    <Head>
      <title>Currency Converter</title>
      <meta name="description" content="Test assignment for Secfi" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <CurrencyConverter />
    </main>
  </div>
);

export default Home;
