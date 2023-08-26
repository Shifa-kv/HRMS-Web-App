import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const values = [
    {
        name: "Page A",
        late: 4000,
        pv: 2400,
        amt: 2400
    },
    {
        name: "Page B",
        late: 3000,
        pv: 1398,
        amt: 2210
    }
];


const StackedBarChart = ({data}:any) => {
    console.log(data)
    
    const CustomBar = (props: any) => {
        const { fill, x, y, width, height, radius } = props;
        return (
            <g>
                <rect x={x} y={y} width={width} height={height} rx={radius} ry={radius} fill={fill} />
            </g>
        );
    };
    const tootltipContent = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-defaultBg border p-2 rounded-lg">
                    <p className="label text-xs text-white">{payload[0].value} On-time</p>
                    <p className="label text-xs text-white">{payload[1].value} Late arrivals</p>
                    <p className="label text-xs text-white">{payload[2]?payload[2].value:0} Absent</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">

            <BarChart
                height={300}
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
                barSize={50}
            >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={tootltipContent} />
                <Legend
                    iconType="wye" 
                    payload={[
                        { value: 'Late Arrival', type: 'circle', color: '#c4975b' },
                        { value: 'On-time', type: 'circle', color: '#1d322f' },
                        { value: 'Absence', type: 'circle', color: '#cfd0d1' },
                    ]}
                />                
                <Bar dataKey="uv" stackId="a" fill="#1d322f" shape={<CustomBar radius={10} />} />
                <Bar dataKey="pv" stackId="a" fill="#c4975b" shape={<CustomBar radius={10} />} />
                <Bar dataKey="amt" stackId="a" fill="#cfd0d1" shape={<CustomBar radius={10} />} />
            </BarChart>
        </ResponsiveContainer>
    )
}
export default StackedBarChart