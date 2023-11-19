import Head from 'next/head';
import MainContentContainer from './MainContentContainer';
import { RouterReadyWrapper, UserAuthWrapper } from 'components/Wrappers';
import { HeadTitle } from 'components/Head';

const UserAccountPageLayout = ({ children, pageTitle }) => (
  <>
    <Head>
      <HeadTitle pageTitle={pageTitle} />
      <meta name="description" content="Bibliotheque Electronic" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <RouterReadyWrapper>
        <UserAuthWrapper>
          <MainContentContainer>{children}</MainContentContainer>
        </UserAuthWrapper>
      </RouterReadyWrapper>
    </main>
  </>
);

export default UserAccountPageLayout;
