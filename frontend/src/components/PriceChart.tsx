import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getMarketChart} from "../features/coins/coin.api.ts";
import {type AxisOptions, Chart} from "react-charts";
import {LoadingMd} from "./LoadingSpinner.tsx";
import * as React from "react";

export default function PriceChart({coinId, coinName}: {
  coinId: string;
  coinName: string;
}) {
  const [days, setDays] = useState(7);
  const [vs_currency] = useState(localStorage.getItem("vs_currency") || "usd");

  const {data: marketChart, isLoading: loadingMarketChart, error: marketChartError} = useQuery({
    queryKey: ['marketChart', coinId, days, vs_currency],
    queryFn: async () => {
      return await getMarketChart(coinId, days, vs_currency);
    }
  });

  type DailyPrice = {
    date: Date;
    price: number;
  }

  type Series = {
    label: string;
    data: DailyPrice[];
  }

  const data: Series[] = [
    {
      label: coinName,
      data: marketChart ? marketChart?.prices.map((price): DailyPrice => ({
        date: new Date(price[0]),
        price: price[1]
      })) : []
    }
  ];

  const primaryAxis = React.useMemo(
    (): AxisOptions<DailyPrice> => ({
      getValue: datum => datum.date,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    (): AxisOptions<DailyPrice>[] => [
      {
        getValue: datum => datum.price,
      },
    ],
    []
  );

  if (loadingMarketChart) {
    return <LoadingMd/>;
  } else if (marketChartError) {
    return <p className="text-danger text-center text-balance">{(marketChartError as Error).message}</p>;
  } else return (
    <>
      <select className="w-fit! ml-auto input-bar text-xs!" id="days" name="days"
              onChange={(e) => setDays(parseInt(e.target.value))}
              value={days}
      >
        <option value="7">7 Days</option>
        <option value="14">14 Days</option>
        <option value="30">30 Days</option>
        <option value="90">90 Days</option>
        <option value="180">180 Days</option>
        <option value="365">1 Year</option>
      </select>
      <div
        className="w-full min-h-[300px] p-4 bg-background-secondary rounded-md shadow-[0_0_10px_var(--color-accent)] overflow-hidden flex flex-col gap-4">
        {marketChart && !marketChartError && !loadingMarketChart && (
          <Chart options={{
            data,
            primaryAxis,
            secondaryAxes,
            dark: true,
            defaultColors: [
              "#615FFFFF"
            ]
          }}
          />
        )}
      </div>
    </>
  )
}