import React, { useState } from 'react';
import { TalentMarketplace } from '../components/TalentMarketplace';
import { uploadResume, type ParsedResumeResponse } from '../api/workforceApi';
import { FileUp, CheckCircle, AlertCircle, FileText, Sparkles, Layers } from 'lucide-react';

export function SkillMappingPage() {
  const [activeTab, setActiveTab] = useState<'MATCHING' | 'RESUME_UPLOAD'>('MATCHING');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedResumeResponse | null>(null);
  const [uploadError, setUploadError] = useState('');

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const res = await uploadResume(formData);
      setParsedResult(res);
    } catch (err: any) {
      setUploadError(err?.response?.data?.detail || err?.message || 'Resume parsing failed.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="view-container">
      {/* Sub-Navigation */}
      <section className="subnav-tabs">
        <button
          className={`subnav-tab ${activeTab === 'MATCHING' ? 'active' : ''}`}
          onClick={() => setActiveTab('MATCHING')}
        >
          <Sparkles size={15} style={{ marginRight: 6, display: 'inline' }} />
          Role Requirements & Talent Match
        </button>
        <button
          className={`subnav-tab ${activeTab === 'RESUME_UPLOAD' ? 'active' : ''}`}
          onClick={() => setActiveTab('RESUME_UPLOAD')}
        >
          <FileUp size={15} style={{ marginRight: 6, display: 'inline' }} />
          Resume Intelligence & Skill Parser
        </button>
      </section>

      {activeTab === 'MATCHING' && <TalentMarketplace />}

      {activeTab === 'RESUME_UPLOAD' && (
        <section className="dashboard-grid" style={{ marginTop: '20px' }}>
          {/* Upload Form */}
          <article className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-eyebrow">Document Intelligence</div>
                <h3 className="panel-title">Upload Candidate or Employee Resume</h3>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ color: 'var(--text-soft)', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
                Upload employee resumes in PDF or DOCX format. The NLP extraction engine automatically matches terms against the enterprise skill taxonomy, normalizes aliases, and calculates skill proficiency signals.
              </p>

              <form onSubmit={handleUpload}>
                <div
                  style={{
                    border: '2px dashed var(--border)',
                    borderRadius: '10px',
                    padding: '30px 20px',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-card)',
                    marginBottom: '16px',
                    cursor: 'pointer',
                  }}
                  onClick={() => document.getElementById('resume-file-input')?.click()}
                >
                  <FileUp size={36} style={{ color: 'var(--primary)', margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                    {selectedFile ? selectedFile.name : 'Select PDF or DOCX resume document'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-soft)' }}>
                    Maximum file size: 10MB • Deterministic privacy extraction
                  </div>
                  <input
                    id="resume-file-input"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                {uploadError && (
                  <div className="login-error" style={{ marginBottom: '16px' }} role="alert">
                    {uploadError}
                  </div>
                )}

                <button
                  type="submit"
                  className="primary-button"
                  disabled={!selectedFile || isUploading}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isUploading ? 'Extracting & Normalizing Skills...' : 'Extract Resume Profile'}
                </button>
              </form>
            </div>
          </article>

          {/* Extraction Output Panel */}
          <article className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-eyebrow">Extraction Result</div>
                <h3 className="panel-title">Normalized Skill Profile</h3>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              {!parsedResult ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-soft)' }}>
                  <FileText size={40} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                  <div>No resume processed yet in this session.</div>
                  <div style={{ fontSize: '12px', marginTop: '6px' }}>Upload a file on the left to inspect parsed competencies.</div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ color: 'var(--primary)', fontSize: '16px' }}>{parsedResult.profile.candidate_name}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-soft)' }}>
                        {parsedResult.profile.email || 'Email not detected'} • {parsedResult.profile.estimated_experience_years} years experience
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', background: 'rgba(32, 201, 151, 0.15)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
                      {parsedResult.profile.total_skills_detected} skills identified
                    </span>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-soft)', marginBottom: '8px' }}>
                      EXTRACTED SKILLS & TAXONOMY
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {parsedResult.profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 10px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            fontSize: '12px',
                          }}
                        >
                          <strong>{skill.name}</strong> ({skill.proficiency_label})
                        </span>
                      ))}
                    </div>
                  </div>

                  {parsedResult.profile.role_recommendations && parsedResult.profile.role_recommendations.length > 0 && (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-soft)', marginBottom: '8px' }}>
                        TOP ROLE ALIGNMENTS
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {parsedResult.profile.role_recommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              background: 'var(--bg-card)',
                              borderRadius: '6px',
                              fontSize: '13px',
                            }}
                          >
                            <span>{rec.role}</span>
                            <strong style={{ color: 'var(--primary)' }}>
                              {(rec.match_confidence * 100).toFixed(0)}% Match
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>
        </section>
      )}
    </div>
  );
}
