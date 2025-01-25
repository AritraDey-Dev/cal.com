import { Title } from "@tremor/react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc";

import { useFilterContext } from "../context/provider";
import { CardInsights } from "./Card";
import { LoadingInsight } from "./LoadingInsights";
import { TotalBookingUsersTable } from "./TotalBookingUsersTable";

export const MostCancelledBookingsTable = () => {
  const { t } = useLocale();
  const { filter } = useFilterContext();
  const { dateRange, selectedEventTypeId, isAll, initialConfig } = filter;
  const [startDate, endDate] = dateRange;
  const { selectedTeamId: teamId } = filter;

  const { data, isSuccess, isPending } = trpc.viewer.insights.mostCancelledBookings.useQuery(
    {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      teamId,
      eventTypeId: selectedEventTypeId ?? undefined,
      isAll,
    },
    {
      staleTime: 30000,
      trpc: {
        context: { skipBatch: true },
      },
      enabled: !!(initialConfig?.teamId || initialConfig?.userId || initialConfig?.isAll),
    }
  );

  if (isPending) return <LoadingInsight />;

  if (!isSuccess || !startDate || !endDate || !teamId) return null;

  return (
    <CardInsights>
      <Title className="text-emphasis">{t("most_cancelled_bookings")}</Title>
      <TotalBookingUsersTable data={data} />
    </CardInsights>
  );
};
