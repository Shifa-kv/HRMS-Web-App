import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
type progressbar = {
    text?: any;
    value: number;
    pathColor?: string;
    trailColor?: string;
    height?: string;
}
const ProgressCircle = ({ 
    text,
    value,
    pathColor = '#bfa7f9',
    trailColor = '#1d322f',
    height = '100%'
    }: progressbar) => {

    const [progress, setProgress] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            setProgress(value);
        }, 1000);
    }, [progress])

    return (
        <CircularProgressbar value={progress} text={text} strokeWidth={20}
            styles={{
                // Customize the root svg element
                root: {
                    width: 'max-content',
                    maxHeight: `${height}`
                },
                // Customize the path, i.e. the "completed progress"
                path: {
                    // Path color
                    stroke: `${pathColor}`,
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'butt',
                    // Customize transition animation
                    transition: 'stroke-dashoffset 0.5s ease 0s',
                },
                // Customize the circle behind the path, i.e. the "total progress"
                trail: {
                    // Trail color
                    stroke: `${trailColor}`,
                    strokeWidth: 10
                },
                // Customize background - only used when the `background` prop is true
                background: {
                    
                },
                text: {
                    fontSize: '14px',
                }
            }}
        />

    )
}
export default ProgressCircle