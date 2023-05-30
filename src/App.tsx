import { CSSProperties, useEffect, useState} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './App.css'

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
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

async function getData(dow:string, hh:string): Promise<{label:Array<string>, data:Array<number>}>{
  const url = `/puzzle/congestion-train/stat/stations/219?dow=${dow}&hh=${hh}`; // 삼성역 
  const options = {
    method: 'GET',
    headers: {accept: 'application/json', appkey: 'EiGninSCwg3HK7MB72kfD34BNljEJZ1R7nawXwlV'}
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
  console.log(response)
  const data = await response.json();
  console.log(data)
  // const stat: {hh: string, mm: string, congestionTrain: number}[] = data.contents.stat[0].data ;

  let label:any;
  let chartData:any;
  // const zero_congest=[0, 0, 0, 0, 0, 0];
  const stat: any = data.contents.stat ;
  let len=stat.length()
  for(let i=0; i<len; i++){
    const tmp1: {hh: string, mm: string, congestionTrain: number}[]=stat[i].data;
    // label 생성
    const label_sub= tmp1.map(({hh, mm})=>
      hh+mm
    )
    // data 생성
    const chartData_sub = tmp1.map(({congestionTrain})=>
      congestionTrain
    )

    // 배열 내 원소 모두 0이면 스킵
    if(chartData_sub.every((item)=>item === 0)) continue;
    
    label.push(...label_sub);
    chartData.push(...chartData_sub);
    [['0800', 18],['0810', 18],['0820', 18],['0830', 18],['0840', 18],['0850', 18], ...,
    ['0800', 18],['0810', 18],['0820', 18],['0830', 18],['0840', 18],['0850', 18],]
  }

  // 각 시간별로 평균내기
  len=label.length();
    
  for(let i=0; i<len; i++){
    
  }
// })
  return {label, data: chartData};
}

export default function App() {
  const [chart, setChart] = useState<ChartData<'bar'> | null>(null)
  useEffect(() => {
    // 06:00 - 23:00
    (async()=>{
      const labels: string[] = [];
      const datas: number[] = [];
      for (let i = 6; i < 24; i++) {
        // const {l, d} = await Promise.all([getData('MON', '6'), getData('MON', '7'), getData('MON', '8')]).then()
        // const seriesResult = await Promise.all(Array.from({length: 24 - 6}, (_, idx)=> getData('MON', `${ idx + 6 < 10 ? `0${idx + 6}` : String(idx + 6)}`)))
        // seriesResult.forEach(({label, data})=>{
        //   labels.push(...label)
        //   datas.push(...data)
        // })

        const { label, data } = await getData('MON', `${ i < 10 ? `0${i}` : String(i)}`)
        labels.push(...label)
        datas.push(...data)        
      }
      
      console.log(labels, datas)
      const chartData: ChartData<'bar'> = {
        labels,
        datasets: [
          {
            label: '지역명',
            data: datas,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };
      setChart(chartData);
    })()
  }, []);

  return <>{chart ?
  <Bar className='서울역 지하철혼잡도' options={options} data={chart} />
  : 
  null}</>
}

function setStats(json: any) {
  throw new Error('Function not implemented.');
}

