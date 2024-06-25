import { ArcElement, Chart, ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
Chart.register(ArcElement);

const DougnutChart = ({ accounts }: DoughnutChartProps) => {
  const data: ChartData<'doughnut'> = {
    datasets: [
      {
        label: 'Banks',
        data: [1250, 2500, 3750],
        backgroundColor: ['#0747b6', '#2265d8', '#2f91fa'],
      },
    ],
    labels: ['Bank 1', 'Bank 2', 'Bank 3'],
  };

  return <Doughnut data={data} options={{ cutout: '60%' }} />;
};

export default DougnutChart;
