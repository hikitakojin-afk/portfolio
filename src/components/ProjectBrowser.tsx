import type { AppMode } from '../App';
import type { PortfolioItem } from '../data/portfolio';
import './ProjectBrowser.css';

interface ProjectBrowserProps {
    mode: AppMode;
    works: PortfolioItem[];
    activeProject: PortfolioItem;
    onSelectProject: (p: PortfolioItem) => void;
}

export default function ProjectBrowser({ mode, works, activeProject, onSelectProject }: ProjectBrowserProps) {

    // Determine the empty pads we need to fill the grid if NUMS mode
    // Standard layout looks to have about 30 pads
    const PADS_TOTAL = 30;
    const pads = Array.from({ length: PADS_TOTAL }, (_, i) => {
        return works[i] || null; // Might be null if fewer works than pads
    });

    if (mode === 'INDEX') {
        return (
            <div className="project-browser list-mode">
                <div className="list-container">
                    {works.map((work) => (
                        <button
                            key={work.id}
                            className={`list-item ${activeProject.id === work.id ? 'active' : ''}`}
                            onClick={() => onSelectProject(work)}
                        >
                            <span className="list-category">{work.category}</span>
                            <span className="list-title">{work.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // NUMS Mode
    return (
        <div className="project-browser pads-mode">
            <div className="pads-grid">
                {pads.map((work, index) => {
                    const padNum = index + 1;
                    const isActive = work && activeProject.id === work.id;
                    return (
                        <button
                            key={`pad-${index}`}
                            className={`midi-pad ${isActive ? 'active' : ''} ${!work ? 'empty' : ''}`}
                            onClick={() => work && onSelectProject(work)}
                            disabled={!work}
                        >
                            <span className="pad-number">{padNum}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
