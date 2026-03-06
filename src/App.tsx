import { useState, useEffect } from 'react';
import './App.css';

// We will build these components next
import DeviceScreen from './components/DeviceScreen';
import DeviceControls from './components/DeviceControls';
import ProjectBrowser from './components/ProjectBrowser';
import ProjectViewer from './components/ProjectViewer';
import ProfileViewer from './components/ProfileViewer';
import TickerBar from './components/TickerBar';
import PortfolioEditor from './components/PortfolioEditor';
import { PORTFOLIO_DATA } from './data/portfolio';
import type { PortfolioItem } from './data/portfolio';

export type AppMode = 'NUMS' | 'INDEX' | 'PROFILE';
export type FilterCategory = 'ALL' | 'Videogame' | 'Website' | 'Application' | '3DCG';

function App() {
    const [mode, setMode] = useState<AppMode>('NUMS');
    const [filter, setFilter] = useState<FilterCategory>('ALL');
    // Safely initialize with the first item, or null if the array is empty
    const [activeProject, setActiveProject] = useState<PortfolioItem | null>(
        PORTFOLIO_DATA.length > 0 ? PORTFOLIO_DATA[0] : null
    );
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    // Derived filtered list
    const filteredWorks = filter === 'ALL'
        ? PORTFOLIO_DATA
        : PORTFOLIO_DATA.filter(work => work.category === filter);

    // Secret Dev Tool Shortcut (Ctrl + Shift + E)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
                e.preventDefault();
                setIsEditorOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Keyboard Navigation (SELECT ↑↓)
    useEffect(() => {
        const handleNavigation = (e: KeyboardEvent) => {
            if (isEditorOpen || !activeProject || filteredWorks.length === 0) return;

            // Allow default behavior for inputs/textareas
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

            const currentIndex = filteredWorks.findIndex(w => w.id === activeProject.id);
            if (currentIndex === -1) return;

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const nextIndex = currentIndex === 0 ? filteredWorks.length - 1 : currentIndex - 1;
                setActiveProject(filteredWorks[nextIndex]);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = currentIndex === filteredWorks.length - 1 ? 0 : currentIndex + 1;
                setActiveProject(filteredWorks[nextIndex]);
            }
        };

        window.addEventListener('keydown', handleNavigation);
        return () => window.removeEventListener('keydown', handleNavigation);
    }, [isEditorOpen, activeProject, filteredWorks]);

    // If activeProject is null but works exist (e.g., after loading/saving), set it
    useEffect(() => {
        if (!activeProject && filteredWorks.length > 0) {
            setActiveProject(filteredWorks[0]);
        }
    }, [filteredWorks, activeProject]);

    // Fallback UI or empty shell when no project is loaded at all
    // We still render the editor so the user can ADD items.
    if (!activeProject) {
        return (
            <>
                {isEditorOpen && <PortfolioEditor onClose={() => setIsEditorOpen(false)} />}
                <div className="device-wrapper">
                    <div className="device-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', minHeight: '600px' }}>
                        <h2>NO PORTFOLIO DATA (Press Ctrl+Shift+E to open Editor)</h2>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {isEditorOpen && <PortfolioEditor onClose={() => setIsEditorOpen(false)} />}
            <div className="device-wrapper">
                <div className="device-shell">
                    {/* Physical-looking layout map */}
                    <div className="device-grid">
                        {/* Left Column (Controls & Lists) */}
                        <div className="grid-left">
                            <DeviceScreen
                                mode={mode}
                                filter={filter}
                                activeProject={activeProject}
                                totalWorks={filteredWorks.length}
                            />
                            <div className="left-modules-row">
                                <DeviceControls
                                    mode={mode} setMode={setMode}
                                    filter={filter} setFilter={setFilter}
                                />
                                <div className="dashed-connector-h"></div>
                                <ProjectBrowser
                                    mode={mode}
                                    works={filteredWorks}
                                    activeProject={activeProject}
                                    onSelectProject={setActiveProject}
                                />
                            </div>
                        </div>

                        {/* Right Column (Viewer) */}
                        <div className="grid-right">
                            {mode === 'PROFILE' ? (
                                <ProfileViewer />
                            ) : (
                                <ProjectViewer
                                    project={activeProject}
                                    filteredWorks={filteredWorks}
                                    onSelectProject={setActiveProject}
                                />
                            )}
                        </div>
                    </div>

                    {/* Bottom Ticker */}
                    <TickerBar />
                </div>
            </div>
        </>
    );
}

export default App;
