import { CSSProperties, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./App.css";
import { CongestionDataType } from "./component/stat";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

async function getData(
  dow: string,
  hh: string
): Promise<{ label: Array<string>; data: Array<number> }> {
  const url = `/puzzle/congestion-train/stat/stations/219?dow=${dow}&hh=${hh}`; // 삼성역
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      appkey: "EiGninSCwg3HK7MB72kfD34BNljEJZ1R7nawXwlV",
    },
  };
  // let label:Array<string>;
  // let data:Array<string>;

  const response = await fetch(url, options);
  // .then(res => res.json())
  // .then(json => {
  //   console.log(json);
  // if (!response.ok){
  //   return response.status
  // }
  console.log(response);
  const data = (await response.json()) as CongestionDataType;
  console.log(data);

  const { stat } = data.contents;
  const datas = stat.reduce((res: Record<string, number[]>, { data }) => {
    const obj = { ...res };
    const temp = data.reduce(
      (acc: Record<string, number>, { hh, mm, congestionTrain }) => ({
        ...acc,
        [`${hh}${mm}`]: congestionTrain,
      }),
      {}
    );

    for (const key in temp) {
      if (temp[key] && temp[key] !== 0) {
        const [sum, count] = obj[key] ?? [0, 0];
        obj[key] = [sum + temp[key], count + 1];
      }
    }

    return obj;
  }, {});
  const result: number[] = [];
  for (const key in datas) {
    const [sum, cnt] = datas[key];
    result.push(Math.round(sum / cnt));
  }

  console.log(result);
  // })
  return {
    label: Object.keys(datas),
    data: result,
  };
}

export default function App() {
  const [chart, setChart] = useState<ChartData<"bar"> | null>(null);
  useEffect(() => {
    // 06:00 - 23:00
    (async () => {
      const labels: string[] = [];
      const datas: number[] = [];
      for (let i = 6; i < 7; i++) {
        const { label, data } = await getData(
          "MON",
          `${i < 10 ? `0${i}` : String(i)}`
        );
        labels.push(...label);
        datas.push(...data);
      }

      const chartData: ChartData<"bar"> = {
        labels,
        datasets: [
          {
            label: "지역명",
            data: datas,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };
      setChart(chartData);
    })();
  }, []);

  return (
    <>
      {chart ? (
        <Bar className="서울역 지하철혼잡도" options={options} data={chart} />
      ) : null}
    </>
  );
}

function setStats(json: any) {
  throw new Error("Function not implemented.");
}
