import { AreaChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Area } from 'recharts';

// const values = [{ name: '1', uv: 8 }];
type chartProps = {
    fill?: string,
    values:any
}
const AreaCharts = ({ fill = '#bfa7f9',values }: chartProps) => {
    const data:any = [
        {
            name: '1',
            uv: 4000,
        },
        {
            name: '2',
            uv: 3000,
        },
        {
            name: '5',
            uv: 3000,
            amt: 2210,
        },
        {
            name: '6',
            uv: 3000,
        },
        {
            name: '10',
            uv: 3000,
        },
    ];

    
    const tootltipContent = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-defaultBg border p-2 rounded-lg">
                    <p className="label text-xs text-white">{payload[0].value} person</p>
                </div>
            );
        }
        return null;
    };
    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={values.sort((a:any,b:any)=>a.name - b.name)} margin={{ left: -30 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={tootltipContent} />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill={fill} />
            </AreaChart>
        </ResponsiveContainer>

    )
}
export default AreaCharts