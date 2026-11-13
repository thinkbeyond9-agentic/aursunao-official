import React, { useState } from 'react';
import { Users, Filter, Sparkles, MapPin, Briefcase, ChevronRight, X, UserCheck, Activity } from 'lucide-react';
import { IcpPerson, IcpCohort, Story } from '../types';
import { ICP_COHORTS, COMMUNITY_PEOPLE } from '../icpDataset';

interface IcpCommunityDashboardProps {
  stories: Story[];
  selectedIcp: string;
  onSelectIcp: (icpId: string) => void;
  selectedPersonId: string | null;
  onSelectPerson: (personId: string | null) => void;
  lang?: 'en' | 'hi';
}

export const IcpCommunityDashboard: React.FC<IcpCommunityDashboardProps> = ({
  stories,
  selectedIcp,
  onSelectIcp,
  selectedPersonId,
  onSelectPerson,
  lang = 'en'
}) => {
  const [showPeopleDrawer, setShowPeopleDrawer] = useState(false);
  const [searchPerson, setSearchPerson] = useState('');

  const selectedPerson = COMMUNITY_PEOPLE.find((p) => p.id === selectedPersonId);

  const filteredPeople = COMMUNITY_PEOPLE.filter((p) => {
    if (selectedIcp !== 'all' && p.icpCategory !== selectedIcp) return false;
    if (searchPerson.trim()) {
      const q = searchPerson.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.occupation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate cohort story counts
  const cohortCounts = ICP_COHORTS.reduce((acc, c) => {
    acc[c.id] = stories.filter((s) => s.icpPersona === c.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="rounded-[24px] bg-[#121214] border border-white/10 p-5 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-32 bg-[#FF6B5B]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-[#FF6B5B] font-semibold">
            <Users size={14} />
            <span>
              {lang === 'en'
                ? 'Community Dataset • 52 ICP Voices'
                : 'कम्युनिटी डेटासेट • 52 वास्तविक लोग'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h3 className="font-display text-[26px] md:text-[34px] text-white leading-tight mt-1">
            {lang === 'en'
              ? '200+ Human Stories Across 8 Archetypes'
              : '8 प्रोफाइल्स में 200+ सच्ची मानवीय कहानियाँ'}
          </h3>
          <p className="font-sans text-[13px] text-white/60 max-w-[65ch] mt-1.5 leading-relaxed">
            {lang === 'en'
              ? 'Real anonymous rants, emotional conflicts, and breakthrough insights from founders, techies, medical residents, and aspirants across 24 Indian cities.'
              : 'फाउंडर्स, इंजीनियर्स, रेजिडेंट डॉक्टर्स और छोटे शहरों से आए युवाओं के 21 दिनों का वास्तविक मानसिक डेटा।'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
          <div className="rounded-[16px] bg-white/[0.04] border border-white/5 p-3 text-center">
            <div className="font-display text-[22px] md:text-[26px] text-white">200</div>
            <div className="font-sans text-[10px] uppercase tracking-wider text-white/50 mt-0.5">
              {lang === 'en' ? 'Stories' : 'कहानियाँ'}
            </div>
          </div>
          <div className="rounded-[16px] bg-white/[0.04] border border-white/5 p-3 text-center">
            <div className="font-display text-[22px] md:text-[26px] text-[#FF6B5B]">52</div>
            <div className="font-sans text-[10px] uppercase tracking-wider text-white/50 mt-0.5">
              {lang === 'en' ? 'People' : 'लोग'}
            </div>
          </div>
          <div className="rounded-[16px] bg-white/[0.04] border border-white/5 p-3 text-center">
            <div className="font-display text-[22px] md:text-[26px] text-white">8</div>
            <div className="font-sans text-[10px] uppercase tracking-wider text-white/50 mt-0.5">
              {lang === 'en' ? 'ICP Cohorts' : 'श्रेणियाँ'}
            </div>
          </div>
          <div className="rounded-[16px] bg-white/[0.04] border border-white/5 p-3 text-center">
            <div className="font-display text-[22px] md:text-[26px] text-white">24</div>
            <div className="font-sans text-[10px] uppercase tracking-wider text-white/50 mt-0.5">
              {lang === 'en' ? 'Cities' : 'शहर'}
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Selector Pills */}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="font-sans text-[11px] font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
            <Filter size={12} />
            <span>{lang === 'en' ? 'Filter by ICP Cohort:' : 'प्रोफाइल अनुसार फ़िल्टर करें:'}</span>
          </div>

          <button
            onClick={() => setShowPeopleDrawer(true)}
            className="font-sans text-[11px] font-bold text-[#FF6B5B] hover:text-[#FF5C5C] flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            <Users size={12} />
            <span>{lang === 'en' ? 'Browse All 52 People' : 'सभी 52 लोग देखें'}</span>
            <span className="text-[10px] opacity-60">→</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => {
              onSelectIcp('all');
              onSelectPerson(null);
            }}
            className={`rounded-full px-4 h-9 text-[11px] font-sans font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
              selectedIcp === 'all' && !selectedPersonId
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>✨</span>
            <span>{lang === 'en' ? 'All Archetypes (200)' : 'सभी वर्ग (200)'}</span>
          </button>

          {ICP_COHORTS.map((cohort) => {
            const count = cohortCounts[cohort.id] || 0;
            const isSelected = selectedIcp === cohort.id;
            return (
              <button
                key={cohort.id}
                onClick={() => {
                  onSelectIcp(cohort.id);
                  onSelectPerson(null);
                }}
                className={`rounded-full px-3.5 h-9 text-[11px] font-sans font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#FF6B5B] text-black border-[#FF6B5B] font-bold shadow-md'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{cohort.icon}</span>
                <span>{lang === 'en' ? cohort.name : cohort.nameHi}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-white/60'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Notification Bar */}
      {(selectedIcp !== 'all' || selectedPersonId) && (
        <div className="mt-4 rounded-[14px] bg-[#FF6B5B]/10 border border-[#FF6B5B]/20 px-4 py-2.5 flex items-center justify-between gap-3 text-[12px] font-sans">
          <div className="flex items-center gap-2 text-white">
            <span className="text-[#FF6B5B] font-bold">● Active View:</span>
            {selectedPerson ? (
              <span>
                Stories by <b>{selectedPerson.name}</b> ({selectedPerson.occupation}, {selectedPerson.city})
              </span>
            ) : (
              <span>
                Filtered by <b>{ICP_COHORTS.find((c) => c.id === selectedIcp)?.name}</b>
              </span>
            )}
          </div>
          <button
            onClick={() => {
              onSelectIcp('all');
              onSelectPerson(null);
            }}
            className="text-[11px] text-white/70 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 cursor-pointer transition"
          >
            <X size={12} />
            <span>{lang === 'en' ? 'Reset Filter' : 'रीसेट करें'}</span>
          </button>
        </div>
      )}

      {/* 52 People Directory Modal */}
      {showPeopleDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 grid place-items-center">
          <div className="w-full max-w-[840px] max-h-[88vh] flex flex-col rounded-[24px] bg-[#121214] border border-white/15 text-white shadow-2xl overflow-hidden fade-up">
            {/* Modal Header */}
            <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-[#FF6B5B]">
                  <Users size={13} />
                  <span>52 Community Voices Directory</span>
                </div>
                <h4 className="font-display text-[22px] md:text-[26px] mt-1">
                  {lang === 'en' ? 'Explore Real Community Profiles' : 'समुदाय के 52 सदस्यों से मिलें'}
                </h4>
              </div>
              <button
                onClick={() => setShowPeopleDrawer(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search input in modal */}
            <div className="px-5 md:px-6 pt-4 pb-2">
              <input
                value={searchPerson}
                onChange={(e) => setSearchPerson(e.target.value)}
                placeholder={lang === 'en' ? 'Search by name, city, or occupation (e.g. Bengaluru, Surgeon, UPSC)...' : 'नाम, शहर या काम से खोजें...'}
                className="w-full h-10 rounded-full bg-white/5 border border-white/10 px-4 text-[12px] font-sans outline-none text-white focus:border-[#FF6B5B]"
              />
            </div>

            {/* People Grid */}
            <div className="p-5 md:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredPeople.map((person) => {
                const cohort = ICP_COHORTS.find((c) => c.id === person.icpCategory);
                const isSelected = selectedPersonId === person.id;
                return (
                  <div
                    key={person.id}
                    onClick={() => {
                      onSelectPerson(person.id);
                      onSelectIcp(person.icpCategory);
                      setShowPeopleDrawer(false);
                    }}
                    className={`rounded-[16px] p-3.5 border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#FF6B5B]/15 border-[#FF6B5B]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold text-black"
                            style={{ backgroundColor: person.avatarColor }}
                          >
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-sans font-bold text-[13px] text-white">
                              {person.name}
                            </div>
                            <div className="font-mono text-[10px] text-white/50 flex items-center gap-1">
                              <MapPin size={9} />
                              <span>{person.city} • {person.age}y</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-base" role="img" aria-label={cohort?.name}>
                          {cohort?.icon}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] font-sans font-medium text-white/80 line-clamp-1">
                        {person.occupation}
                      </div>
                      <p className="mt-1 text-[11px] font-sans text-white/50 line-clamp-2 leading-relaxed">
                        {person.bio}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/60">
                      <span>{person.storyCount} stories</span>
                      <span className="text-[#FF6B5B] flex items-center gap-0.5">
                        View stories →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
