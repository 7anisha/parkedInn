import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type PropsType = {
    plan: any
    width?: { md: number, lg: number }
    current?: string
    booked?: string[]
    onSelect?: (slot: string) => void
}

function unEntity(str: string) {
    const div = document.createElement('textarea');
    div.innerHTML = str
    return div.textContent || div.innerText || '';
}

const FloorPlanVizualizer = (props: PropsType) => {
    const propsWidth = window.innerWidth <= 768 ? (props.width?.md || 300) : (props.width?.lg || 600);
    const { page = {}, areas = [], slots = {}, lines = [], arrows = [] } = props.plan;
    const { width: pageWidth, height: pageHeight } = page;
    const [width, setWidth] = useState(propsWidth)
    const height = (pageHeight / pageWidth) * width;


    useEffect(() => {
        setWidth(propsWidth);
    }, [propsWidth]);

    const handleClick = (slot: string) => {
        if (props.booked?.includes(slot)) {
            return;
        }
        if (props.onSelect) {
            props.onSelect(slot)
        }
    }

    return <div>
        <div style={{ maxWidth: propsWidth, width, height }} className="overflow-scroll relative">
            {areas.map((area: any, index: number) => {
                const { x, y, width: areaWidth, height: areaHeight, value, rotation } = area;
                const left = (width / pageWidth) * x;
                const top = (height / pageHeight) * y;
                const w = (width / pageWidth) * areaWidth;
                const h = (height / pageHeight) * areaHeight;
                const fontSize = 7;
                return <div key={`area-${index}`} className="absolute border flex justify-center items-center capitalize border-base-content" style={{ left, top, width: w, height: h, fontSize, rotate: `${rotation}deg` }}>
                    {unEntity(value)}
                </div>
            })}
            {Object.keys(slots).map((slot: any, index: number) => {
                const { x, y, width: areaWidth, height: areaHeight, rotation = 0 } = slots[slot];
                const left = (width / pageWidth) * x;
                const top = (height / pageHeight) * y;
                const w = (width / pageWidth) * areaWidth;
                const h = (height / pageHeight) * areaHeight;
                const fontSize = 7;
                return <div
                    key={`slot-${index}`}
                    className={`absolute border border-base-content flex justify-center items-center capitalize ${props.current === slot ? "bg-success text-success-content" : props.booked?.includes(slot) ? "bg-gray-600 text-success-content cursor-not-allowed" : props.onSelect ? "bg-transparent cursor-pointer hover:bg-slate-600" : ""}`}
                    style={{ left, top, width: w, height: h, fontSize, rotate: `${rotation}deg` }}
                    onClick={() => handleClick(slot)}
                >
                    {slot}
                </div>
            })}
            {lines.map((line: any, index: number) => {
                const { source_x: x1, source_y: y1, target_x: x2, target_y: y2 } = line;
                const scaledX1 = (width / pageWidth) * x1;
                const scaledY1 = (height / pageHeight) * y1;
                const scaledX2 = (width / pageWidth) * x2;
                const scaledY2 = (height / pageHeight) * y2;
                const length = Math.sqrt((scaledX2 - scaledX1) ** 2 + (scaledY2 - scaledY1) ** 2);
                const angle = Math.atan2(scaledY2 - scaledY1, scaledX2 - scaledX1) * (180 / Math.PI);
                return <div key={`line-${index}`} className="absolute border border-base-content" style={{ left: scaledX1, top: scaledY1, width: length, height: 2, transform: `rotate(${angle}deg)`, transformOrigin: '0 0' }} />
            })}
            {arrows.map((arrow: any, index: number) => {
                const { start_x: x1, start_y: y1, end_x: x2, end_y: y2 } = arrow;
                const scaledX1 = (width / pageWidth) * x1;
                const scaledY1 = (height / pageHeight) * y1;
                const scaledX2 = (width / pageWidth) * x2;
                const scaledY2 = (height / pageHeight) * y2;
                const length = Math.sqrt((scaledX2 - scaledX1) ** 2 + (scaledY2 - scaledY1) ** 2);
                const angle = Math.atan2(scaledY2 - scaledY1, scaledX2 - scaledX1) * (180 / Math.PI);
                const arrowHeadAngle = Math.atan2(scaledY2 - scaledY1, scaledX2 - scaledX1) * (180 / Math.PI);
                return <div key={`arrow-${index}`}>
                    <div className="absolute border border-base-content" style={{ left: scaledX1, top: scaledY1, width: length, height: 2, transform: `rotate(${angle}deg)`, transformOrigin: '0 0' }} />
                    <div className="absolute border-transparent border-l-transparent bor border-t-base-content" style={{ left: scaledX2, top: scaledY2, borderWidth: "5px", transform: `rotate(${arrowHeadAngle - 90}deg) translate(-60%, -40%)`, transformOrigin: '0 0' }} />
                </div>
            })}
        </div>
        <div className="flex w-full justify-center items-center space-x-2 mt-4">
            <button className="btn btn-circle" type="button" onClick={() => setWidth((w) => w + 100)}>
                <span className="iconify text-2xl mingcute--zoom-in-line"></span>
            </button>
            <button className="btn btn-circle" type="button" onClick={() => setWidth((w) => w - 100)}>
                <span className="iconify text-2xl mingcute--zoom-out-line"></span>
            </button>
        </div>
    </div>
};

export default FloorPlanVizualizer;