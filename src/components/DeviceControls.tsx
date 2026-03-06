import type { AppMode, FilterCategory } from '../App';
import './DeviceControls.css';

interface DeviceControlsProps {
    mode: AppMode;
    setMode: (m: AppMode) => void;
    filter: FilterCategory;
    setFilter: (f: FilterCategory) => void;
}

export default function DeviceControls({ mode, setMode, filter, setFilter }: DeviceControlsProps) {
    const categories: FilterCategory[] = ['ALL', 'Videogame', 'Website', 'Application', '3DCG'];

    return (
        <div className="device-controls">

            {/* Category Filter list mimicking a vertical panel */}
            <div className="control-panel filter-panel">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`panel-btn filter-btn ${filter === cat ? 'active' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="dashed-connector-v"></div>

            {/* Mode Switches */}
            <div className="control-panel modes-panel">
                <button
                    className={`panel-btn mode-btn ${mode === 'NUMS' ? 'active' : ''}`}
                    onClick={() => setMode('NUMS')}
                >
                    NUMS MODE
                </button>
                <button
                    className={`panel-btn mode-btn ${mode === 'INDEX' ? 'active' : ''}`}
                    onClick={() => setMode('INDEX')}
                >
                    INDEX MODE
                </button>
                <button
                    className={`panel-btn mode-btn about-btn ${mode === 'PROFILE' ? 'active' : ''}`}
                    onClick={() => setMode('PROFILE')}
                >
                    PROFILE
                </button>
            </div>

        </div>
    );
}
