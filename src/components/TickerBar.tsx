import './TickerBar.css';

export default function TickerBar() {
    return (
        <div className="ticker-bar mono-text">
            <div className="ticker-scroll">
                <span>SYSTEM NOMINAL /// ALL PROCESSES OPERATING WITHIN NORMAL PARAMETERS</span>
                <span>---------------------</span>
                <span>CONNECTION STABLE</span>
                <span>---------------------</span>
                <span>SYSTEM NOMINAL /// ALL PROCESSES OPERATING WITHIN NORMAL PARAMETERS</span>
                <span>---------------------</span>
                <span>CONNECTION STABLE</span>
                <span>---------------------</span>
                <span>SYSTEM NOMINAL /// ALL PROCESSES OPERATING WITHIN NORMAL PARAMETERS</span>
            </div>
            {/* Overlay scanlines */}
            <div className="ticker-scanlines"></div>
        </div>
    );
}
