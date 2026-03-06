import type { AppMode, FilterCategory } from '../App';
import { SITE_SETTINGS, type PortfolioItem } from '../data/portfolio';
import './DeviceScreen.css';

interface DeviceScreenProps {
    mode: AppMode;
    filter: FilterCategory;
    activeProject: PortfolioItem;
    totalWorks: number;
}

export default function DeviceScreen({ mode, filter, activeProject, totalWorks }: DeviceScreenProps) {
    return (
        <div className="device-screen-container">
            <div className="led-screen">
                <div className="scanlines"></div>
                <div className="screen-content mono-text">
                    <div className="screen-row">
                        <span className="label">USER:</span>
                        <span className="value orange">{SITE_SETTINGS.username}</span>
                    </div>
                    <div className="screen-row">
                        <span className="label">PAGE:</span>
                        <span className="value orange">WORK {mode} MODE</span>
                    </div>
                    <div className="screen-row">
                        <span className="label">SORT:</span>
                        <span className="value orange">ALL WORKS</span>
                    </div>
                    <div className="screen-row">
                        <span className="label">SUMS:</span>
                        <span className="value orange">{filter} - {totalWorks}</span>
                    </div>
                    <div className="screen-row">
                        <span className="label">WORK:</span>
                        <span className="value cyan">{activeProject.title.toUpperCase()}</span>
                    </div>
                </div>
            </div>
            {/* Dashed line connecting Screen to the rest */}
            <div className="connector-vertical"></div>
        </div>
    );
}
