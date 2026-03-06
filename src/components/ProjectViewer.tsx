import { useEffect, useState } from 'react';
import { SITE_SETTINGS, type PortfolioItem } from '../data/portfolio';
import './ProjectViewer.css';

interface ProjectViewerProps {
    project: PortfolioItem;
    filteredWorks: PortfolioItem[];
    onSelectProject: (p: PortfolioItem) => void;
}

export default function ProjectViewer({ project, filteredWorks, onSelectProject }: ProjectViewerProps) {
    const [isFading, setIsFading] = useState(false);
    const [currentProject, setCurrentProject] = useState(project);

    // Smooth transition between projects
    useEffect(() => {
        if (project.id !== currentProject.id) {
            setIsFading(true);
            const timer = setTimeout(() => {
                setCurrentProject(project);
                setIsFading(false);
            }, 300); // 300ms fade out
            return () => clearTimeout(timer);
        }
    }, [project, currentProject.id]);

    // Helper to render image or video based on URL extension
    const renderMedia = (url: string | undefined, className?: string, style?: React.CSSProperties) => {
        if (!url) return <div className="no-thumb-text">None</div>;

        const isVideo = url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm');
        if (isVideo) {
            return (
                <video
                    src={url}
                    className={className}
                    style={{ ...style, objectFit: 'cover', width: '100%', height: '100%' }}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            );
        }
        return <img src={url} alt="media" className={className} style={style} />;
    };

    // Calculate surrounding projects for thumbnails
    const currentIndex = filteredWorks.findIndex(w => w.id === project.id);
    const getProjectOffset = (offset: number) => {
        if (!filteredWorks || filteredWorks.length === 0) return null;
        let newIndex = (currentIndex + offset) % filteredWorks.length;
        if (newIndex < 0) newIndex += filteredWorks.length;
        return filteredWorks[newIndex];
    };

    const surroundingProjects: (PortfolioItem | null)[] = [
        getProjectOffset(0),  // Current (Active)
        getProjectOffset(1),  // Next
        getProjectOffset(2),  // Next + 1
        getProjectOffset(3),  // Next + 2
    ];

    return (
        <div className="project-viewer-container">
            <div className="viewer-header">
                {/* Profile Image container */}
                {SITE_SETTINGS.profileImageUrl && (
                    <div className="profile-image-container">
                        <img src={SITE_SETTINGS.profileImageUrl} alt="Profile" />
                    </div>
                )}

                {/* Text and ECG Background Container */}
                <div className="header-text-content">
                    <h2 className="viewer-title">{currentProject.title}</h2>
                    <div className="viewer-meta">
                        <div className="meta-row">
                            <span className="meta-label">TAGS :</span>
                            <span className="meta-value">{currentProject.category}</span>
                        </div>
                        <div className="meta-row">
                            <span className="meta-label">YEAR :</span>
                            <span className="meta-value">{currentProject.year || 'N/A'}</span>
                        </div>
                        <div className="meta-row">
                            <span className="meta-label">DESC :</span>
                            <span className="meta-value">{currentProject.description}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`viewer-media-box ${isFading ? 'fading' : ''}`}>
                <div className="media-tabs">
                    <button className="media-tab active">IMAGES (tab)</button>
                    <button className="media-tab">VIDEOS (tab)</button>
                    <button className="media-tab">CREDIT (tab)</button>
                </div>
                <div className="media-content">
                    {currentProject.type === 'video' ? (
                        <div className="video-wrapper">
                            <iframe
                                src={currentProject.contentUrl}
                                title={currentProject.title}
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : currentProject.type === 'link' ? (
                        <div className="link-wrapper">
                            <img src={currentProject.thumbnail} alt="preview" />
                            <a href={currentProject.contentUrl} target="_blank" rel="noopener noreferrer" className="external-btn">
                                OPEN EXTERNAL LINK
                            </a>
                        </div>
                    ) : (
                        <img src={currentProject.contentUrl} alt={currentProject.title} className="main-image" />
                    )}
                </div>

                {/* Dynamic Thumbnails row */}
                <div className="thumbnails-row">
                    <span className="thumb-label">SELECT (↑↓)</span>
                    {surroundingProjects.map((proj: PortfolioItem | null, idx: number) => {
                        if (!proj) return null;
                        const isActive = idx === 0;
                        return (
                            <div
                                key={`thumb-${proj.id}-${idx}`}
                                className={`thumb-box ${isActive ? 'active' : ''}`}
                                onClick={() => onSelectProject(proj)}
                                style={{ cursor: 'pointer' }}
                            >
                                {renderMedia(proj.thumbnail, '', isActive ? {} : { filter: 'grayscale(1)', opacity: 0.5 })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
