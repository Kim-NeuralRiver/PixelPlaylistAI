'use client';

import { useTranslation } from 'react-i18next';

const AdminPage = () => {
  const { t } = useTranslation(['admin']);

  return <div>{t('admin:welcomeMessage')}</div>;
};

export default AdminPage;
