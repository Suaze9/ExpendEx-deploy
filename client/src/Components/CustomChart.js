import React from 'react'
//
import { Chart } from 'react-charts'

const CustomChart = (props) => {

  const { exps } = props;

  const data = React.useMemo(
    () => {

      if(!exps)
        return [];

      let returnVal = [];
      const dates = exps.expenses;

      if(!dates)
        return[];

      const seriesData = dates.map((date)=>{
        return [date.date, date.total];
      });
      returnVal.push({ label: 'Expenses', data: seriesData});
      return returnVal;

      // return [
      //   {
      //     label: 'Series 1',
      //     data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
      //   },
      //   {
      //     label: 'Series 2',
      //     data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
      //   }
      // ]
    },
    [exps]
  )

  const series = React.useMemo(
    () => ({
      type: 'bar'
    }),
    []
  )
  const axes = React.useMemo(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { type: 'linear', position: 'left', stacked: true}
    ],
    []
  )
  return (
    <div
      className="chartDiv"
    >
      <Chart data={data} series={series} axes={axes} tooltip />
    </div>
  )
}

export default CustomChart;