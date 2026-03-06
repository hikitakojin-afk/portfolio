import { SITE_SETTINGS } from '../data/portfolio';
import './ProfileViewer.css';

export default function ProfileViewer() {
    return (
        <div className="profile-viewer-container">
            <div className="profile-header">
                {/* Profile Image container - reuse styling from ProjectViewer if possible, or redefine here */}
                {SITE_SETTINGS.profileImageUrl && (
                    <div className="profile-image-container">
                        <img src={SITE_SETTINGS.profileImageUrl} alt="Profile" />
                    </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 className="profile-title">{SITE_SETTINGS.username}</h2>
                    <span style={{ color: 'var(--ch1-yellow)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        SYS. IDENTITY RECORD
                    </span>
                </div>
            </div>

            <div className="profile-content-box">
                <div className="profile-text">
                    {SITE_SETTINGS.profileText || 'No profile record found.'}
                </div>
            </div>
        </div>
    );
}
