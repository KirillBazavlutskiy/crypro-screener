import * as d3 from "d3";
import {MutableRefObject} from "react";
import {CandleStickData} from "./components/TradingViewChart/TradingViewChart.tsx";

export const CreateCandleStickChart = (svgRef: MutableRefObject<SVGSVGElement | null>, klines: CandleStickData[]) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = d3.select(svgRef.current.parentElement);
    const width = container.node()?.getBoundingClientRect().width || 0;
    const height = container.node()?.getBoundingClientRect().height || 0;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // svgRef.current?.onresize(() => {
    //     const container = d3.select(svgRef.current?.parentElement);
    //     const width = container.node()?.getBoundingClientRect().width || 0;
    //     const height = container.node()?.getBoundingClientRect().height || 0;
    //
    //     svg.attr('viewBox', `0 0 ${width} ${height}`);
    // })

    const xScale = d3
        .scaleTime()
        .domain(d3.extent(klines, (d) => d.date) as [Date, Date])
        .range([50, width])
        .nice();

    const yScale = d3
        .scaleLinear()
        .domain([d3.min(klines, (d) => d.low)!, d3.max(klines, (d) => d.high)!])
        .range([height - 60, 0])
        // .nice();

    const xAxis = d3.axisBottom<Date>(xScale);
    const yAxis = d3.axisLeft<number>(yScale);

    svg.select<SVGSVGElement>('.x-axis').call(xAxis);
    svg.select<SVGSVGElement>('.y-axis').call(yAxis);


    const candlestick = svg.select('.candlestick-group').selectAll('.candlestick').data(klines);
    const lineHigh = svg.select('.line-high-group').selectAll('.line').data(klines);
    const lineLow = svg.select('.line-low-group').selectAll('.line').data(klines);

    const candleWidth = Math.floor((width / klines.length) * 0.5);

    candlestick
        .enter()
        .append('rect')
        .attr('class', 'candlestick')
        .merge(candlestick as d3.Selection<SVGRectElement, CandlestickData, SVGGElement, unknown>)
        .attr('x', (d) => xScale(d.date) - candleWidth / 2 )
        .attr('y', (d) => yScale(Math.max(d.open, d.close)))
        .attr('width', candleWidth)
        .attr('height', (d) => Math.abs(yScale(d.open) - yScale(d.close) === 0 ? 1 : Math.abs(yScale(d.open) - yScale(d.close))))
        .attr('stroke', (d) => (d.open > d.close ? '#eb3810' : '#017303'))
        .attr('fill', (d) => (d.open > d.close ? '#eb3810' : 'transparent'))

    lineHigh
        .enter()
        .append('line')
        .attr('class', 'line')
        .merge(lineHigh as d3.Selection<SVGLineElement, CandlestickData, SVGGElement, unknown>)
        .attr('x1', (d) => xScale(d.date)!)
        .attr('y1', (d) => yScale(d.high))
        .attr('x2', (d) => xScale(d.date)!)
        .attr('y2', (d) => yScale(Math.max(d.open, d.close)))
        .attr('stroke', (d) => (d.open > d.close ? '#eb3810' : '#017303'))
        .attr('stroke-width', 1);

    lineLow
        .enter()
        .append('line')
        .attr('class', 'line')
        .merge(lineLow as d3.Selection<SVGLineElement, CandlestickData, SVGGElement, unknown>)
        .attr('x1', (d) => xScale(d.date)!)
        .attr('y1', (d) => yScale(Math.min(d.open, d.close)))
        .attr('x2', (d) => xScale(d.date)!)
        .attr('y2', (d) => yScale(d.low))
        .attr('stroke', (d) => (d.open > d.close ? 'red' : '#017303'))
        .attr('stroke-width', 1);

    lineHigh.exit().remove();
    lineLow.exit().remove();

    candlestick.exit().remove();
}
