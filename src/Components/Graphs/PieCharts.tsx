import { PieChart, Pie, Sector, Cell, Legend, ResponsiveContainer } from 'recharts';

const adata = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

const COLORS = ['#c4975b', '#f3bdaa', '#cfd0d1', '#8884d8', '#ffb5f8', '#baebab'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, payload, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text fontSize={12} x={x} y={y} stroke="#1d322f" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${payload.name}`}
        </text>
    );
};



const PieCharts = ({ data }: any) => {

    const filteredData: any = data && Object.keys(data).map((key) => ({
        name: key,
        value: data[key],
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart >
                <Pie
                    data={filteredData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {
                        filteredData?.map((item: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))
                    }
                </Pie>
                {/* <Legend   /> */}
            </PieChart>
        </ResponsiveContainer>
    )
}
export default PieCharts