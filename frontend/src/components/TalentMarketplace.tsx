import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  Filter,
  GraduationCap,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { matchTalent, type TalentMatchResponse } from '../api/workforceApi';

export function TalentMarketplace() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Python',
    'AWS',
    'Kubernetes',
    'Docker',
  ]);
  const [department, setDepartment] = useState('All');
  const [minMatch, setMinMatch] = useState(30);

  const [matchResults, setMatchResults] = useState<TalentMatchResponse | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      matchTalent({
        required_skills: selectedSkills,
        department: department !== 'All' ? department : undefined,
        min_match_percent: minMatch,
      }),
    onSuccess: (data) => {
      setMatchResults(data);
    },
  });

  const availableSkills = [
    'Python',
    'FastAPI',
    'TypeScript',
    'React',
    'AWS',
    'Azure',
    'Kubernetes',
    'Docker',
    'Terraform',
    'Machine Learning',
    'Generative AI',
    'PyTorch',
    'MLOps',
    'Cloud Security',
    'Zero Trust Architecture',
    'Executive Communication',
    'Engineering Leadership',
  ];

  const presets = [
    {
      title: 'Cloud DevOps & Platform Architect',
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Cloud Security'],
    },
    {
      title: 'Senior AI / ML Systems Engineer',
      skills: ['Python', 'Machine Learning', 'Generative AI', 'PyTorch', 'MLOps'],
    },
    {
      title: 'Lead Full-Stack Web Architect',
      skills: ['React', 'TypeScript', 'FastAPI', 'Python', 'Docker'],
    },
    {
      title: 'Cybersecurity Infrastructure Lead',
      skills: ['Cloud Security', 'Zero Trust Architecture', 'AWS', 'Kubernetes'],
    },
  ];

  function toggleSkill(skill: string) {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  }

  function handleSearchCandidates() {
    if (selectedSkills.length === 0) return;
    mutation.mutate();
  }

  return (
    <div className="view-container">
      {/* Marketplace Innovation Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.15), rgba(32, 201, 151, 0.12))',
          border: '1px solid rgba(129, 140, 248, 0.3)',
          borderRadius: 16,
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ maxWidth: 650 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                background: '#818cf8',
                color: '#071318',
                borderRadius: 8,
                padding: '4px 8px',
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Talent Mobility Engine
            </span>
            <span style={{ fontSize: 13, color: 'var(--cyan)', fontWeight: 600 }}>Internal Matchmaker</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>
            Internal Talent Marketplace: "Hire Less. Develop Within."
          </h2>
          <p style={{ color: 'var(--text-soft)', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
            Instantly surface high-potential internal candidates for critical architectural roles. Identifies precise skill adjacencies, calculates gap percentage, and generates customized upskilling roadmaps.
          </p>
        </div>

        <button
          className="primary-button"
          style={{ padding: '12px 24px' }}
          disabled={selectedSkills.length === 0 || mutation.isPending}
          onClick={handleSearchCandidates}
        >
          <Search size={16} />
          {mutation.isPending ? 'Matching Internal Talent...' : 'Find Internal Matches'}
        </button>
      </section>

      {/* Role Presets */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Role Specification Presets:
        </span>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              className="ghost-button"
              style={{ fontSize: 12, padding: '6px 14px' }}
              onClick={() => {
                setSelectedSkills(preset.skills);
                setMatchResults(null);
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--primary)' }} />
              {preset.title}
            </button>
          ))}
        </div>
      </section>

      {/* Required Skills Selection Matrix */}
      <section className="panel" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700 }}>Configure Target Role Skill Matrix</h4>
          <span style={{ fontSize: 12, color: 'var(--text-soft)' }}>
            {selectedSkills.length} skills selected
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {availableSkills.map((sk) => {
            const isSelected = selectedSkills.includes(sk);
            return (
              <button
                key={sk}
                onClick={() => toggleSkill(sk)}
                style={{
                  background: isSelected ? 'rgba(32, 201, 151, 0.2)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-soft)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {isSelected && <CheckCircle size={13} />}
                {sk}
              </button>
            );
          })}
        </div>
      </section>

      {/* Matching Candidates Roster */}
      {matchResults ? (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>
              Ranked Internal Candidates ({matchResults.totalCandidatesEvaluated} matches found)
            </h3>
            <span className="workspace-badge" style={{ backgroundColor: 'rgba(32, 201, 151, 0.15)', color: 'var(--primary)' }}>
              Avoided External Placement Fees: $45,000+
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
            {matchResults.candidates.map((cand) => (
              <article
                key={cand.employeeId}
                className="panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  borderLeft: `4px solid ${cand.matchPercentage >= 75 ? 'var(--primary)' : '#818cf8'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h4 style={{ fontSize: 16, fontWeight: 700 }}>{cand.name}</h4>
                      <span className="workspace-badge">{cand.employeeNumber}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>
                      {cand.currentRole} • {cand.department}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: cand.matchPercentage >= 75 ? 'var(--primary)' : '#818cf8',
                      }}
                    >
                      {cand.matchPercentage}%
                    </div>
                    <span style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Role Match
                    </span>
                  </div>
                </div>

                {/* Matched Skills */}
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Possessed Target Skills:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {cand.matchedSkills.map((ms, idx) => (
                      <span key={idx} className="skill-badge" style={{ fontSize: 11, padding: '3px 8px' }}>
                        {ms.skill} (Lvl {ms.proficiency})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                {cand.missingSkills.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: '#f87171', marginBottom: 6 }}>
                      Skill Gaps for this Role:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {cand.missingSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="workspace-badge"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: 11 }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Upskilling Roadmap */}
                <div
                  style={{
                    background: 'var(--bg-card)',
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    color: 'var(--text-soft)',
                    marginTop: 'auto',
                  }}
                >
                  <strong style={{ color: 'var(--text)' }}>Upskilling Pathway: </strong>
                  {cand.recommendedUpskilling.join('; ') || 'Ready for Immediate Role Transition'}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section
          className="panel"
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: 'var(--bg-panel)',
            border: '1px dashed var(--border)',
          }}
        >
          <UserCheck size={36} style={{ color: '#818cf8', marginBottom: 14 }} />
          <h4>Ready to Scan Internal Talent Pool</h4>
          <p style={{ color: 'var(--text-soft)', fontSize: 13, marginTop: 4 }}>
            Click <strong>Find Internal Matches</strong> above to rank all active employees against the selected skill matrix.
          </p>
        </section>
      )}
    </div>
  );
}
