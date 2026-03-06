import { useState } from 'react';
import type { PortfolioItem, MediaType, SiteSettings, PortfolioDataPayload } from '../data/portfolio';
import PORTFOLIO_DATA_RAW from '../data/portfolio.json';
import './PortfolioEditor.css';

interface PortfolioEditorProps {
    onClose: () => void;
}

export default function PortfolioEditor({ onClose }: PortfolioEditorProps) {
    const rawData = PORTFOLIO_DATA_RAW as PortfolioDataPayload;

    // Initialize state with the current data
    const [settings, setSettings] = useState<SiteSettings>(rawData.settings || { username: 'tsuchifumazu-sys' });
    const [items, setItems] = useState<PortfolioItem[]>(rawData.items || []);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('Saving...');
        try {
            const payload: PortfolioDataPayload = { settings, items };
            const response = await fetch('/api/save-portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSaveMessage('Saved Successfully! (HMR will refresh site)');
                setTimeout(() => setSaveMessage(''), 3000);
            } else {
                setSaveMessage('Error saving data.');
            }
        } catch (error) {
            console.error(error);
            setSaveMessage('Failed to connect to dev server.');
        }
        setIsSaving(false);
    };

    const updateItem = (index: number, field: keyof PortfolioItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === items.length - 1) return;

        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = newItems[index];
        newItems[index] = newItems[targetIndex];
        newItems[targetIndex] = temp;
        setItems(newItems);
    };

    const deleteItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const addItem = () => {
        const newItem: PortfolioItem = {
            id: Date.now().toString(),
            type: 'image',
            title: 'NEW ITEM',
            description: 'Item description...',
            thumbnail: 'https://via.placeholder.com/800',
            contentUrl: 'https://via.placeholder.com/1600',
            category: '3DCG',
            year: new Date().getFullYear().toString()
        };
        setItems([...items, newItem]);
    };

    return (
        <div className="portfolio-editor-overlay">
            <div className="portfolio-editor-panel">
                <div className="editor-header">
                    <h2>DEV TOOLS: Portfolio Editor</h2>
                    <div className="header-actions">
                        <span className="save-message">{saveMessage}</span>
                        <button className="btn-save" onClick={handleSave} disabled={isSaving}>
                            💾 SAVE TO DISK
                        </button>
                        <button className="btn-close" onClick={onClose}>✕ CLOSE</button>
                    </div>
                </div>

                <div className="editor-content">
                    {/* GLOBAL SETTINGS */}
                    <div className="editor-item-card" style={{ flexDirection: 'column', gap: '1rem', border: '1px solid #4ade80' }}>
                        <h3 style={{ color: '#4ade80', margin: 0, fontSize: '1rem' }}>Global Site Settings</h3>
                        <div className="item-fields">
                            <div className="field-group">
                                <label>System Username (Top Left DeviceScreen):</label>
                                <input
                                    value={settings.username}
                                    onChange={e => setSettings({ ...settings, username: e.target.value })}
                                    placeholder="tsuchifumazu-sys"
                                />
                            </div>
                            <div className="field-group full-width">
                                <label>Profile Image URL:</label>
                                <input
                                    value={settings.profileImageUrl || ''}
                                    onChange={e => setSettings({ ...settings, profileImageUrl: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div className="field-group full-width">
                                <label>Profile Text (History/Bio):</label>
                                <textarea
                                    value={settings.profileText || ''}
                                    onChange={e => setSettings({ ...settings, profileText: e.target.value })}
                                    placeholder="Enter your career history or bio here..."
                                    style={{ minHeight: '100px' }}
                                />
                            </div>
                        </div>
                    </div>

                    <hr style={{ borderColor: '#333', margin: '1rem 0' }} />

                    {/* ITEMS LIST */}
                    {items.map((item, index) => (
                        <div key={item.id} className="editor-item-card">
                            <div className="item-controls">
                                <span className="item-index">#{index + 1}</span>
                                <button onClick={() => moveItem(index, 'up')} disabled={index === 0}>↑</button>
                                <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1}>↓</button>
                                <button className="btn-delete" onClick={() => deleteItem(index)}>🗑️</button>
                            </div>

                            <div className="item-fields">
                                <div className="field-group">
                                    <label>Title:</label>
                                    <input value={item.title} onChange={e => updateItem(index, 'title', e.target.value)} />
                                </div>
                                <div className="field-group">
                                    <label>Category (Tags):</label>
                                    <select value={item.category} onChange={e => updateItem(index, 'category', e.target.value)}>
                                        <option value="Videogame">Videogame</option>
                                        <option value="Website">Website</option>
                                        <option value="Application">Application</option>
                                        <option value="3DCG">3DCG</option>
                                    </select>
                                </div>
                                <div className="field-group">
                                    <label>Year:</label>
                                    <input value={item.year || ''} onChange={e => updateItem(index, 'year', e.target.value)} />
                                </div>
                                <div className="field-group full-width">
                                    <label>Description:</label>
                                    <textarea value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} />
                                </div>
                                <div className="field-group">
                                    <label>Type:</label>
                                    <select value={item.type} onChange={e => updateItem(index, 'type', e.target.value as MediaType)}>
                                        <option value="image">Image (Direct)</option>
                                        <option value="video">Video (Iframe)</option>
                                        <option value="link">External Link</option>
                                    </select>
                                </div>
                                <div className="field-group full-width">
                                    <label>Thumbnail URL:</label>
                                    <input value={item.thumbnail} onChange={e => updateItem(index, 'thumbnail', e.target.value)} />
                                </div>
                                <div className="field-group full-width">
                                    <label>Content/Embed URL:</label>
                                    <input value={item.contentUrl} onChange={e => updateItem(index, 'contentUrl', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn-add-item" onClick={addItem}>+ ADD NEW PORTFOLIO ITEM</button>
                </div>
            </div>
        </div>
    );
}
