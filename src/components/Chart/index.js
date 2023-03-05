import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from "recharts";

export const LineChartComp = (props) => {
  return (
    <>
      <h4 className="title">{props.title}</h4>
      <LineChart
        width={props.width || 600}
        height={props.height || 300}
        data={props.data}
      >
        {props.lines.map((item) => (
          <Line type="monotone" dataKey={item.lineFor} stroke={item.color} />
        ))}
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey={props.xAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    </>
  );
};

export const BarChartComp = (props) => {
  return (
    <>
      <h4 className="title">{props.title}</h4>
      <BarChart 
        width={props.width || 900}
        height={props.height || 300}
        data={props.data}
      >
        {props.lines.map((item) => (
          <Bar dataKey={item.lineFor} fill={item.color} />
        ))}
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <XAxis dataKey={props.xAxis} />
        <YAxis dataKey={props.yAxis} />
        <Tooltip />
        <Legend />
      </BarChart >
    </>
  );
};
