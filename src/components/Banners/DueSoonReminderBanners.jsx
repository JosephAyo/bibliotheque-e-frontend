import useUserRoles from '@/hooks/useUserRoles';
import { DUE_STATUSES } from '@/utils/constants';
import ReminderBanner from './ReminderBanner';
import { viewBorrowedBooksReminder } from '@/services/api/queries/library';
import { useQuery } from '@tanstack/react-query';
import { getOr } from '@/utils/objects';

const DueSoonReminderBanners = () => {
  const { isBorrower } = useUserRoles();
  const { data } = useQuery({
    placeholderData: {},
    enabled: isBorrower,
    queryKey: ['viewBorrowedBooksReminder', isBorrower],
    queryFn: viewBorrowedBooksReminder,
    refetchOnWindowFocus: true,
    select: (queryResponse) => getOr(queryResponse, 'data', {})
  });

  const { has_due, has_late } = data;

  return (
    <>
      {has_due ? <ReminderBanner status={DUE_STATUSES.DUE_SOON} /> : ''}
      {has_late ? <ReminderBanner status={DUE_STATUSES.LATE} /> : ''}
    </>
  );
};

export default DueSoonReminderBanners;
