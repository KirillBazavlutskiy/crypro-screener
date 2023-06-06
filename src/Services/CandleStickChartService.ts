import * as d3 from "d3";
import {MutableRefObject} from "react";
import {CandleStickData} from "@/Models/BinanceKlines";

export default class CandleStickChartService {
    static zoomScale = 1;
    static CreateCandleStickChart = async (svgRef: MutableRefObject<SVGSVGElement | null>, klines: CandleStickData[], solidityPrice: number[]) => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const container = d3.select(svgRef.current.parentElement);
        const width = container.node()?.getBoundingClientRect().width || 0;
        const height = container.node()?.getBoundingClientRect().height || 0;

        svg.attr('viewBox', `0 0 ${width} ${height}`);

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(klines, (d) => d.date) as [Date, Date])
            .range([50, width - 20])
            .nice();

        const yScale = d3
            .scaleLinear()
            .domain([d3.min(klines, (d) => d.low)!, d3.max(klines, (d) => d.high)!])
            .range([height- 60, -15])
            .nice();

        const xAxis = d3.axisBottom<Date>(xScale);
        const yAxis = d3.axisLeft<number>(yScale);

        svg.select<SVGSVGElement>('.y-axis').call(yAxis);

        svg.append("g").attr("class", "y-axis");
        svg.append("g").attr("class", "x-axis");

        svg.select<SVGSVGElement>('.x-axis')
            .attr("transform", `translate(0, ${height - 25})`)
            .call(xAxis);

        svg.select<SVGSVGElement>('.y-axis').call(yAxis);

        svg.on("mousemove", handleMouseMove);
        svg.on("wheel", handleMouseWheel);

        let isDragging = false;
        let startMouseX = 0;
        let startMouseY = 0;
        let startXScaleDomain = xScale.domain();
        let startYScaleDomain = yScale.domain();

        function handleMouseMove() {
            const [mouseX, mouseY] = d3.pointer(event);

            if (isDragging) {
                const dx = mouseX - startMouseX;
                const dy = mouseY - startMouseY;

                // Обновление доменов шкал значений на основе перемещения мыши
                const newXDomain = [
                    startXScaleDomain[0].getTime() - dx * xScale.invert(1).getTime() + xScale.invert(0).getTime(),
                    startXScaleDomain[1].getTime() - dx * xScale.invert(1).getTime() + xScale.invert(0).getTime()
                ];

                const newYDomain = [
                    startYScaleDomain[0] + dy * yScale.invert(1) - yScale.invert(0),
                    startYScaleDomain[1] + dy * yScale.invert(1) - yScale.invert(0)
                ];

                // Установка новых доменов шкал значений
                xScale.domain(newXDomain);
                yScale.domain(newYDomain);

                // Обновление осей
                svg.select<SVGGElement>('.y-axis').call(yAxis);
                svg.select<SVGGElement>('.x-axis').call(xAxis);

                // Обновление графика
                // Ваш код для обновления графика на основе новых доменов
            }
        }

        function handleMouseWheel(event: WheelEvent) {
            CandleStickChartService.zoomScale = 1 + event.deltaY * 0.00001;

            // Обновление доменов шкал значений на основе масштабирования колесом мыши
            const newXDoman = xScale.domain().map((value) => value.getTime() * CandleStickChartService.zoomScale);

            // Установка новых доменов шкал значений
            xScale.domain(newXDoman);
            // yScale.domain(newYDoman);

            // Обновление осей
            svg.select<SVGSVGElement>('.y-axis').call(yAxis);
            svg.select<SVGSVGElement>('.x-axis').call(xAxis);

            // Обновление графика
            // Ваш код для обновления графика на основе новых доменов
            drowElements();
        }

        svg.on("mousedown", () => {
            isDragging = true;
            [startMouseX, startMouseY] = d3.pointer(svg.node());
            startXScaleDomain = xScale.domain();
            startYScaleDomain = yScale.domain();
        });

        svg.on("mouseup", () => {
            isDragging = false;
        });


        const candlestick = svg.select('.candlestick-group').selectAll<SVGRectElement, CandleStickData[]>('.candlestick').data(klines);
        const lineHigh = svg.select('.line-high-group').selectAll<SVGLineElement, CandleStickData[]>('.line').data(klines);
        const lineLow = svg.select('.line-low-group').selectAll<SVGLineElement, CandleStickData[]>('.line').data(klines);
        const solidityLine = svg.select('.solidity-lines-group').selectAll<SVGLineElement, number[]>('.solidityLine').data(solidityPrice);

        const candleWidth = Math.floor((width / klines.length) * 0.5);

        function drowElements() {
            candlestick
                .enter()
                .append('rect')
                .attr('class', 'candlestick')
                .merge(candlestick)
                .attr('x', (d) => xScale(d.date) - candleWidth / 2 )
                .attr('y', (d) => yScale(Math.max(d.open, d.close)))
                .attr('width', candleWidth)
                .attr('height', (d) => {
                    const candleHeight = Math.abs(yScale(d.open) - yScale(d.close));
                    return candleHeight === 0 ? 1 : candleHeight;
                })
                .attr('stroke', (d) => (d.open > d.close ? '#eb3810' : '#017303'))
                .attr('fill', (d) => (d.open > d.close ? '#eb3810' : 'transparent'))

            lineHigh
                .enter()
                .append('line')
                .attr('class', 'line')
                .merge(lineHigh)
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
                .merge(lineLow)
                .attr('x1', (d) => xScale(d.date)!)
                .attr('y1', (d) => yScale(Math.min(d.open, d.close)))
                .attr('x2', (d) => xScale(d.date)!)
                .attr('y2', (d) => yScale(d.low))
                .attr('stroke', (d) => (d.open > d.close ? 'red' : '#017303'))
                .attr('stroke-width', 1);

            solidityLine
                .enter()
                .append('line')
                .attr('class', 'solidityLine')
                .merge(solidityLine)
                .attr('x1', 0)
                .attr('y1', s => yScale(s))
                .attr('x2', 1000000000)
                .attr('y2', s => yScale(s))
                .attr('stroke', 'red')
                .attr('stroke-width', 2);
        }

        drowElements();

        lineHigh.exit().remove();
        lineLow.exit().remove();
        solidityLine.exit().remove();

        candlestick.exit().remove();
    }
}
