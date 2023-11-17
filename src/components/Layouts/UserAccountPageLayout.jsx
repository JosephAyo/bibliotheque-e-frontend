import Head from 'next/head';
import MainContentContainer from './MainContentContainer';

const UserAccountPageLayout = ({ children, pageTitle }) => (
  <>
    <Head>
      <title>Bibliotheque-E {pageTitle ? `| ${pageTitle}` : ''}</title>
      <meta name="description" content="Bibliotheque Electronic" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <MainContentContainer>{children}</MainContentContainer>
    </main>
  </>
);

export default UserAccountPageLayout;