import React from 'react';

const HeadTitle = ({ pageTitle }) => (
  <title>{`Bibliotheque-E ${pageTitle ? `| ${pageTitle}` : ''}`}</title>
);

export default HeadTitle;
