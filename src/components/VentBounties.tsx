import React, { useState, useEffect } from 'react';
import { VentBounty, UserState } from '../types';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Mic, 
  Building2, 
  Wallet, 
  Gift, 
  Clock, 
  ShieldCheck, 
  MapPin,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface VentBountiesProps {
  user: UserState;
  onSelectBountyForRecording: (bounty: VentBounty) => void;
  lang?: 'en' | 'hi';
}

export const VentBounties: React.FC<VentBountiesProps> = ({
  user,
  onSelectBountyForRecording,
  lang = 'en'
}) => {
  const [bounties, setBounties] = useState<VentBounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [walletPoints, setWalletPoints] = useState(user.loyaltyPointsBalance || user.creatorWalletBalance || 1250);
  const [redeemedReward, setRedeemedReward] = useState<string | null>(null);

  // New Sponsor Form State
  const [sponsorForm, setSponsorForm] = useState({
    brandName: '',
    brandCategory: 'FMCG Packaged Goods',
    bountyRewardPoints: 500,
    maxQuota: 20,
    targetEmotion: 'burnout',
    promptTitle: '',
    promptDescription: '',
    targetCities: 'Bengaluru, Mumbai, Delhi NCR',
    contactEmail: ''
  });
  const [isSubmittingSponsor, setIsSubmittingSponsor] = useState(false);

  useEffect(() => {
    fetchBounties();
  }, []);

  const fetchBounties = async () => {
    try {
      const res = await fetch('/api/bounties');
      const data = await res.json();
      if (data.bounties) {
        setBounties(data.bounties);
      }
    } catch (err) {
      console.error('Failed to fetch bounties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = (rewardName: string, costPoints: number) => {
    if (walletPoints < costPoints) return;
    setWalletPoints(prev => Math.max(0, prev - costPoints));
    setRedeemedReward(rewardName);
    setTimeout(() => {
      setRedeemedReward(null);
      setShowRedeemModal(false);
    }, 2800);
  };

  const handleCreateBounty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorForm.brandName || !sponsorForm.promptTitle) return;

    setIsSubmittingSponsor(true);
    try {
      const res = await fetch('/api/bounties/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sponsorForm,
          targetCities: sponsorForm.targetCities.split(',').map(c => c.trim()),
        }),
      });

      const data = await res.json();
      if (data.success && data.bounty) {
        setBounties(prev => [data.bounty, ...prev]);
        setShowSponsorModal(false);
        setSponsorForm({
          brandName: '',
          brandCategory: 'FMCG Packaged Goods',
          bountyRewardPoints: 500,
          maxQuota: 20,
          targetEmotion: 'burnout',
          promptTitle: '',
          promptDescription: '',
          targetCities: 'Bengaluru, Mumbai, Delhi NCR',
          contactEmail: ''
        });
      }
    } catch (err) {
      console.error('Failed to sponsor bounty:', err);
    } finally {
      setIsSubmittingSponsor(false);
    }
  };

  const getPoints = (b: VentBounty) => b.bountyRewardPoints || b.bountyRewardRupees || 500;

  return (
    <div id="vent-bounties-section" className="rounded-[24px] bg-[#141416] text-white border border-white/10 p-5 sm:p-6 shadow-xl">
      {/* Top Header & Loyalty Points Wallet Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#FFB300]/20 text-[#FFB300] grid place-items-center">
              <Award size={16} />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#FFB300] font-semibold">
              {lang === 'en' ? 'Community Loyalty & Rewards' : 'लॉयल्टी पॉइंट्स वेंट रिवॉर्ड्स'}
            </span>
          </div>
          <h3 className="font-display text-[22px] sm:text-[26px] mt-1 text-white leading-tight">
            {lang === 'en' ? 'Brand-Sponsored Vent Bounties' : 'ब्रांड-प्रायोजित वेंट बाउंटी'}
          </h3>
          <p className="font-sans text-[12.5px] text-white/60 max-w-[65ch] mt-1 leading-relaxed">
            {lang === 'en'
              ? 'Contribute honest anonymous voice vents to targeted prompts. Earn 500 to 1,200 Loyalty Points redeemable for wellness perks, therapy credits, and member privileges.'
              : 'ब्रांड्स लक्षित भावनाओं को प्रायोजित करते हैं। 500 से 1,200 लॉयल्टी पॉइंट्स पाने के लिए अपनी प्रामाणिक कहानी रिकॉर्ड करें।'}
          </p>
        </div>

        {/* Loyalty Wallet Card */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFB300]/20 text-[#FFB300] grid place-items-center shrink-0">
              <Wallet size={16} />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-white/50">Loyalty Points Balance</div>
              <div className="font-display text-[20px] font-bold text-[#FFB300] leading-tight">
                {walletPoints.toLocaleString('en-IN')} <span className="text-[11px] font-mono font-normal text-white/60">PTS</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowRedeemModal(true)}
              className="px-3.5 py-2 rounded-2xl bg-[#FFB300] hover:brightness-110 text-black font-sans text-[12px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Gift size={14} />
              <span>Redeem Points</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSponsorModal(true)}
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-sans text-[12px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Building2 size={13} />
              <span>Sponsor Bounty</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Bounties Grid (Compact layout) */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10.5px] font-mono uppercase tracking-wider text-white/60">
            {lang === 'en' ? 'Active Prompts • Earn Loyalty Points' : 'सक्रिय बाउंटी • पॉइंट्स कमाएं'}
          </span>
          <span className="text-[10.5px] font-mono text-[#25D366] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            Instant Points Credit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {bounties.map((bounty) => {
            const quotaPercent = Math.min(100, Math.round((bounty.claimedQuota / bounty.maxQuota) * 100));
            const isFull = bounty.claimedQuota >= bounty.maxQuota;
            const points = getPoints(bounty);

            return (
              <div
                key={bounty.id}
                className="rounded-[18px] bg-white/[0.03] border border-white/10 p-4 flex flex-col justify-between hover:bg-white/[0.06] transition-all duration-200 relative group"
              >
                <div>
                  {/* Brand & Reward Bar */}
                  <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xl p-1 rounded-lg bg-white/10 shrink-0">
                        {bounty.brandLogo}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-display text-[13px] font-semibold text-white">
                            {bounty.brandName}
                          </span>
                          <ShieldCheck size={12} className="text-[#25D366]" title="Verified Sponsor" />
                        </div>
                        <span className="text-[9.5px] font-mono text-white/50 block">
                          {bounty.brandCategory}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-display text-[16px] font-bold text-[#FFB300] leading-tight flex items-center gap-1 justify-end">
                        <Award size={13} className="text-[#FFB300]" />
                        <span>+{points.toLocaleString('en-IN')} PTS</span>
                      </div>
                      <span className="text-[9px] font-mono text-white/50 uppercase">Loyalty Reward</span>
                    </div>
                  </div>

                  {/* Bounty Title & Brief */}
                  <div className="mt-2.5">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className="text-[9.5px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FF6B5B]/15 text-[#FF6B5B] font-bold">
                        {bounty.targetEmotion}
                      </span>
                      <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                        {bounty.targetCities.slice(0, 2).join(', ')}
                      </span>
                    </div>

                    <h4 className="font-display text-[15px] text-white font-semibold leading-snug group-hover:text-[#FFB300] transition-colors">
                      {bounty.promptTitle}
                    </h4>
                    <p className="font-sans text-[12px] text-white/70 mt-1 leading-relaxed line-clamp-2">
                      {bounty.promptDescription}
                    </p>
                  </div>
                </div>

                {/* Quota Progress & Action Button */}
                <div className="mt-3.5 pt-2.5 border-t border-white/10">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-1">
                    <span>Quota: {bounty.claimedQuota} / {bounty.maxQuota} claimed</span>
                    <span className="text-white/70">{quotaPercent}% Filled</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden mb-2.5">
                    <div
                      style={{ width: `${quotaPercent}%` }}
                      className="h-full rounded-full bg-[#FFB300] transition-all duration-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectBountyForRecording(bounty)}
                    disabled={isFull}
                    className={`w-full py-2 px-3 rounded-full font-sans text-[11.5px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isFull
                        ? 'bg-white/10 text-white/40 cursor-not-allowed'
                        : 'bg-[#FF6B5B] hover:brightness-110 text-black shadow-md'
                    }`}
                  >
                    <Mic size={13} />
                    <span>{isFull ? 'Quota Completed' : `Record Vent & Earn ${points} Loyalty Points`}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redeem Loyalty Points Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 grid place-items-center">
          <div className="w-full max-w-[520px] rounded-[24px] bg-[#141416] text-white border border-white/15 p-5 sm:p-6 shadow-2xl relative fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Gift size={18} className="text-[#FFB300]" />
                <h4 className="font-display text-[18px] text-white font-bold">
                  Redeem Loyalty Points
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowRedeemModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20 transition cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-white/50 uppercase">Current Balance</span>
                <div className="font-display text-[20px] font-bold text-[#FFB300]">
                  {walletPoints.toLocaleString('en-IN')} <span className="text-[11px] font-mono text-white/60">PTS</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Verified Member Status
              </span>
            </div>

            {redeemedReward && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[12px] flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>Successfully redeemed <strong>{redeemedReward}</strong>! Voucher code sent to your registered session.</span>
              </div>
            )}

            <div className="mt-4 space-y-2.5">
              {[
                { name: '1-Month Guided Meditation Pass', cost: 500, desc: 'Unlimited access to sleep meditations and breathing tools.', icon: '🧘' },
                { name: '₹500 Audible / Wellness Credit', cost: 750, desc: 'Digital voucher for audiobooks and mental wellbeing.', icon: '🎧' },
                { name: 'Online Therapy Subsidy Coupon', cost: 1000, desc: '₹1,000 co-pay subsidy with certified mental health therapists.', icon: '🛋️' },
                { name: 'Aur Sunao Creator Lifetime Badge', cost: 1250, desc: 'Permanent ad-free access, unlimited audio export & custom avatars.', icon: '🌟' }
              ].map((reward) => (
                <div
                  key={reward.name}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 hover:bg-white/[0.06] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl shrink-0">{reward.icon}</span>
                    <div>
                      <div className="font-sans text-[13px] font-semibold text-white">{reward.name}</div>
                      <div className="font-sans text-[11px] text-white/60">{reward.desc}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRedeemReward(reward.name, reward.cost)}
                    disabled={walletPoints < reward.cost}
                    className={`shrink-0 px-3 py-1.5 rounded-full font-sans text-[11px] font-bold transition cursor-pointer ${
                      walletPoints >= reward.cost
                        ? 'bg-[#FFB300] hover:brightness-110 text-black shadow'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {reward.cost} PTS
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Brand Sponsor Modal */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md p-4 grid place-items-center">
          <div className="w-full max-w-[540px] rounded-[24px] bg-[#141416] text-white border border-white/15 p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Building2 size={17} className="text-[#FFB300]" />
                <h4 className="font-display text-[17px] text-white font-bold">
                  Sponsor a Vent Bounty (Loyalty Points Pool)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowSponsorModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20 transition cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleCreateBounty} className="mt-3.5 space-y-3 text-[12px] font-sans">
              <div>
                <label className="block text-white/70 font-mono text-[10.5px] mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SlumberWell Botanicals or Himalaya"
                  value={sponsorForm.brandName}
                  onChange={(e) => setSponsorForm(prev => ({ ...prev, brandName: e.target.value }))}
                  className="w-full rounded-xl bg-black/50 border border-white/15 p-2 text-white focus:outline-none focus:border-[#FFB300]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 font-mono text-[10.5px] mb-1">Loyalty Points Per Vent *</label>
                  <input
                    type="number"
                    min={250}
                    step={50}
                    value={sponsorForm.bountyRewardPoints}
                    onChange={(e) => setSponsorForm(prev => ({ ...prev, bountyRewardPoints: Number(e.target.value) }))}
                    className="w-full rounded-xl bg-black/50 border border-white/15 p-2 text-white focus:outline-none focus:border-[#FFB300]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 font-mono text-[10.5px] mb-1">Target Vent Quota *</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={sponsorForm.maxQuota}
                    onChange={(e) => setSponsorForm(prev => ({ ...prev, maxQuota: Number(e.target.value) }))}
                    className="w-full rounded-xl bg-black/50 border border-white/15 p-2 text-white focus:outline-none focus:border-[#FFB300]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-mono text-[10.5px] mb-1">Bounty Prompt Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 AM Burnout Rants & Unclosed Tabs"
                  value={sponsorForm.promptTitle}
                  onChange={(e) => setSponsorForm(prev => ({ ...prev, promptTitle: e.target.value }))}
                  className="w-full rounded-xl bg-black/50 border border-white/15 p-2 text-white focus:outline-none focus:border-[#FFB300]"
                />
              </div>

              <div>
                <label className="block text-white/70 font-mono text-[10.5px] mb-1">Detailed Brief / Question</label>
                <textarea
                  rows={2}
                  placeholder="What specific emotional tension or life moment should participants share?"
                  value={sponsorForm.promptDescription}
                  onChange={(e) => setSponsorForm(prev => ({ ...prev, promptDescription: e.target.value }))}
                  className="w-full rounded-xl bg-black/50 border border-white/15 p-2 text-white focus:outline-none focus:border-[#FFB300] resize-none"
                />
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 text-[10.5px] font-mono flex items-center justify-between">
                <span className="text-white/60">Total Points Pool Funded:</span>
                <span className="text-[#FFB300] font-bold text-[13px]">
                  {(sponsorForm.bountyRewardPoints * sponsorForm.maxQuota).toLocaleString('en-IN')} Loyalty Points
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSponsorModal(false)}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSponsor || !sponsorForm.brandName || !sponsorForm.promptTitle}
                  className="px-4 py-1.5 rounded-full bg-[#FFB300] hover:brightness-110 text-black font-bold flex items-center gap-1.5 transition"
                >
                  <Award size={13} />
                  <span>{isSubmittingSponsor ? 'Launching...' : 'Fund & Launch Bounty'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
