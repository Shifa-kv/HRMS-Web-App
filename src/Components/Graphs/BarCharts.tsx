import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

// const values = [{ name: '1', uv: 8 }];

const BarCharts = (data: any) => {
  const defaultData = Array.from({ length: 31 }, (_, index) => ({ name: `${index + 1}` }));
  const values = defaultData?.map((item, index) => {
    return data?.values?.find((value: any) => value?.name == item?.name) || item
  });

  const tootltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-defaultBg border p-2 rounded-lg">
          <p className="label text-xs text-white">{payload[0].value} hr</p>
        </div>
      );
    }
    return null;
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={200} height={40} data={values} margin={{ left: -30 }}>
        <XAxis dataKey="name" stroke='#1d322f' tickLine={false}  >
        </XAxis>
        <YAxis stroke='#1d322f' tickLine={false} >
        </YAxis>
        <Tooltip content={tootltipContent} />
        <Bar dataKey="uv" fill="#c4975b" />
      </BarChart>
    </ResponsiveContainer>
  )
}
export default BarCharts