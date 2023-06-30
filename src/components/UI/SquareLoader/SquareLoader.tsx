import s from "./SquareLoader.module.scss";

const SquareLoader = () => {
    return (
        <div className={s.loadingSpinContainer}>
            <div className={s.loadingSpin} />
        </div>
    );
};

export default SquareLoader;
