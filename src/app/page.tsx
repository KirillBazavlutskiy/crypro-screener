import SolidityScreenerService from "@/Services/SolidityScreenerService";
import s from './page.module.scss';
import StockCharts from "@/components/StockCharts/StockCharts";

export default async function Home() {
  const symbols = await SolidityScreenerService.FindAllSolidity();

  return (
      <div className={s.container}>
        <div className={s.navbar}>
          {
              symbols.map(symbol =>
                  <button
                      key={symbol}
                      // onClick={() => setActiveSymbol(symbol)}
                      // className={activeSymbol === symbol ? s.activeSymbol : ''}
                  >{symbol}</button>
              )
          }
        </div>

        <StockCharts activeSymbol={"BTCUSDT"} />
      </div>
  )
}
