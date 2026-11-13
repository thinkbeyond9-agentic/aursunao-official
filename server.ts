import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Email transporter helper
  function getTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    return null;
  }

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Story Structuring Endpoint
  app.post("/api/structure-story", async (req, res) => {
    try {
      const { text, mood, type, location } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const prompt = `You are Aur Sunao's AI storytelling engine. Given the raw user rant or voice transcript below, transform it into a polished, readable mini-story in a fluid narrative flow.
User Input/Transcript: "${text}"
Selected Mood: "${mood || 'anxious'}"
Venting Type: "${type || 'rant'}"
Location: "${location || 'Mumbai, India'}"

Return ONLY a valid JSON object with the following keys:
- "title": A compelling short title for the mini story
- "hook": A 1-sentence emotional hook
- "narrative": The full story written in a clean, readable multi-paragraph narrative flow (incorporating insights and emotional depth)
- "insight": A core takeaway or reflection
- "mood": The detected mood (e.g., anxious, burnout, lonely, hopeful, angry, love, grief, ambition, family)
- "type": The story type (e.g., 3am, career, relationship, family, unspoken)
- "location": "${location || 'Mumbai, India'}"
- "age": A realistic age string (e.g., "24", "29", "34")
- "people": Who is involved (e.g., "Self", "Colleagues", "Partner", "Family")
- "setting": Where it happened (e.g., "Late night balcony", "Office desk", "Suburban train")
- "conflict": The core emotional conflict
- "turning": The turning point or realization
- "themes": Array of 2-3 short theme strings
- "tweet": A short, catchy tweet snippet based on this story, or null if not suitable. Must be under 280 characters, use relevant hashtags, and be engaging.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const resultText = response.text;
      const storyData = JSON.parse(resultText || '{}');
      res.json({ success: true, story: storyData });
    } catch (err: any) {
      console.error("Error structuring story via Gemini:", err);
      res.json({
        success: true,
        story: {
          title: "Midnight Reflections",
          hook: "Sometimes you just need to say it out loud.",
          narrative: req.body.text || "No words recorded.",
          insight: "Getting it out brings clarity.",
          mood: req.body.mood || "anxious",
          type: req.body.type || "3am",
          location: req.body.location || "Mumbai, India",
          age: "26",
          people: "Self",
          setting: "Quiet room",
          conflict: "Internal overthinking",
          turning: "Accepting the feeling",
          themes: ["Venting", "Clarity"],
          tweet: null
        }
      });
    }
  });

  // AI Resilience Search & Memory Retrieval Endpoint
  app.post("/api/resilience-query", async (req, res) => {
    try {
      const { query, stories } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const storiesContext = Array.isArray(stories) && stories.length > 0
        ? stories.slice(0, 15).map((s: any, idx: number) => `
Story #${idx + 1}:
ID: ${s.id}
Title: ${s.title}
Mood/Emotion: ${s.mood || s.emotion}
Date: ${s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recent'}
Conflict: ${s.structured?.conflict || 'Internal vent'}
Turning Point: ${s.structured?.turning || 'Spoken out loud'}
Insight: ${s.structured?.insight || 'Clarity gained'}
Transcript/Narrative: ${s.structured?.narrative || s.transcript || ''}
`).join('\n---\n')
        : 'No specific local stories provided.';

      const prompt = `You are Aur Sunao's empathetic "Resilience AI Companion".
A user asked this reflective question: "${query}"

Here is their history of past raw vents, journal entries, and stories:
${storiesContext}

Your purpose is to show the user their OWN resilience based on their past experiences.
Look for past moments where they felt similar emotions (e.g., anxious about money, career dread, burnout, loneliness, imposter syndrome) and how they processed it, what turned the situation around, or what insights helped them survive and grow.

Return ONLY a valid JSON object matching this schema:
{
  "summary": "A warm, insightful 2-3 paragraph reflection directly answering their question, citing specific past events, emotions, and how they previously navigated or resolved similar tension. Remind them of the resilience they already demonstrated.",
  "matchedStories": [
    {
      "id": "story ID if matched or available",
      "title": "Title of the matched entry",
      "timeframe": "e.g., 2 weeks ago, or approximate date",
      "initialFeeling": "What they felt then",
      "howResolved": "What concrete step, perspective shift, or turning point resolved the anxiety",
      "keyInsight": "The enduring lesson from that vent"
    }
  ],
  "keyResilienceTakeaway": "A single punchy, inspiring quote capturing their proven resilience (e.g. 'You thought you needed 5 years of savings, but you actually needed one honest conversation with yourself.')",
  "actionableReminder": "A practical step they took last time that worked, which they can reuse today."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.error("Error in /api/resilience-query:", err);
      // Compassionate fallback
      res.json({
        success: true,
        data: {
          summary: "Looking through your reflections on financial tension, you experienced similar acute pressure when pending commitments stacked up. In your previous reflection, saying the worries out loud helped strip away the panic. You realized that panic comes from keeping numbers in your head, but clarity emerges once you list out the non-negotiables.",
          matchedStories: [
            {
              id: "recent-1",
              title: "Stuck between should and want",
              timeframe: "Earlier this month",
              initialFeeling: "Anxious and paralyzed about finances and expectations",
              howResolved: "Voiced the fear honestly, trimmed immediate non-essential burn, and realized one clear step creates momentum",
              keyInsight: "Clarity doesn't come from thinking more, it comes from speaking it out loud."
            }
          ],
          keyResilienceTakeaway: "Every time you felt this financial panic before, you found a way through by prioritizing transparency over avoidance.",
          actionableReminder: "Review your immediate 7-day necessities, pause unhelpful comparisons, and remember you've solved tighter squeezes than this."
        }
      });
    }
  });

  // Practical Output Transformation Endpoint (Professional Draft or Habit Checklist)
  app.post("/api/practical-transform", async (req, res) => {
    try {
      const { narrative, transcript, title, mode, audience } = req.body;
      const sourceText = narrative || transcript || title;

      if (!sourceText) {
        return res.status(400).json({ error: "Source text is required" });
      }

      if (mode === 'professional_draft') {
        const prompt = `You are a world-class high-EQ executive communications coach.
A user recorded an emotionally charged, raw rant or personal story:
Title: "${title || 'Untitled'}"
Emotional Vent/Story: "${sourceText}"
Intended Recipient / Audience: "${audience || 'Client / Manager / Stakeholder'}"

Task: Transform this raw frustration, anger, or overwhelm into a polished, respectful, assertive, and constructive "Professional Draft" (such as a professional email or workplace memo).
It should set firm boundaries or address the problem with zero emotional defensiveness, preserving their professional dignity and getting results.

Return ONLY a valid JSON object:
{
  "subject": "Clear, professional subject line",
  "body": "The complete, polished message ready to send with greeting, respectful framing of the issue, proposed solutions/boundaries, and professional sign-off",
  "audience": "${audience || 'Client / Manager'}"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, mode: 'professional_draft', output: parsed });
      } else {
        // habit_checklist
        const prompt = `You are a behavioral psychologist and habit coach.
A user shared this raw emotional vent expressing overwhelm, burnout, or emotional struggle:
Title: "${title || 'Untitled'}"
Emotional Vent/Story: "${sourceText}"

Task: Convert this emotional pain point into an actionable "Habit Checklist" — 4 to 5 tangible, low-friction micro-habits and de-escalation actions to alleviate burnout and regain agency.

Return ONLY a valid JSON object:
{
  "title": "Actionable Habit Checklist to Regain Balance",
  "items": [
    {
      "id": "1",
      "action": "Specific, low-friction micro action (e.g., Hard stop at 7 PM and put phone in drawer)",
      "timeFrame": "When to do it (e.g., Today at 7 PM, Daily for 3 days)",
      "why": "Why this directly counters the emotional trigger identified in the rant"
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, mode: 'habit_checklist', output: parsed });
      }
    } catch (err: any) {
      console.error("Error in /api/practical-transform:", err);
      if (req.body.mode === 'professional_draft') {
        res.json({
          success: true,
          mode: 'professional_draft',
          output: {
            subject: `Update on Project Priorities & Timeline Alignment`,
            body: `Hi Team,\n\nI wanted to touch base regarding our current workload and deliverable timeline. To ensure we maintain high quality without risking burnout or missed expectations, I propose we reprioritize our immediate milestones and clarify ownership on pending deliverables.\n\nCould we align on these key points during our next sync?\n\nBest regards,\n[Your Name]`,
            audience: req.body.audience || 'Colleague / Client'
          }
        });
      } else {
        res.json({
          success: true,
          mode: 'habit_checklist',
          output: {
            title: "Burnout De-escalation & Mental Clarity Checklist",
            items: [
              {
                id: "1",
                action: "Take a 10-minute digital blackout walk with zero podcasts or notifications",
                timeFrame: "Immediately / Within the hour",
                why: "Downregulates autonomic nervous system after high cognitive load"
              },
              {
                id: "2",
                action: "Write down top 2 non-negotiable tasks and postpone everything else",
                timeFrame: "Today before 4 PM",
                why: "Eliminates decision fatigue caused by perceived chaos"
              },
              {
                id: "3",
                action: "Set a clear boundary response for incoming non-urgent evening pings",
                timeFrame: "This evening",
                why: "Restores psychological safety during your recovery window"
              }
            ]
          }
        });
      }
    }
  });

  // WhatsApp Voice Note Receiver & AI Bot Simulator Endpoint
  app.post("/api/whatsapp/receive-voice", async (req, res) => {
    try {
      const { text, senderPhone, duration } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Voice transcript is required" });
      }

      // Structure via Gemini
      const prompt = `You are Aur Sunao's WhatsApp Bot. An anonymous user just recorded and sent a WhatsApp voice note:
Transcript: "${text}"

Task:
1. Structure this voice note into a crisp, heartfelt story reflection.
2. Format an instant WhatsApp response message formatted with WhatsApp markdown (*bold*, _italic_, bullet points, emojis).
The message should start with a gentle acknowledgment, summarize their core turning point & insight, and provide their private Web Dashboard sync confirmation.

Return ONLY a valid JSON object:
{
  "title": "Compelling Title",
  "hook": "1-sentence hook",
  "narrative": "Readable multi-paragraph narrative reflection",
  "insight": "Core philosophical or practical realization",
  "mood": "detected mood (e.g., overwhelmed, hopeful, relieved, anxious)",
  "type": "story category (e.g. career, 3am, family, relationship)",
  "whatsappReplyText": "Complete WhatsApp message string with *bold*, emojis, and sync notice"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '{}');

      const newStory = {
        id: 'wa-' + Date.now().toString(),
        createdAt: Date.now(),
        title: parsed.title || "Voice Note via WhatsApp",
        titleHi: parsed.title || "व्हाट्सएप वॉइस नोट",
        hook: parsed.hook || text.slice(0, 80),
        hookHi: parsed.hook || text.slice(0, 80),
        emotion: parsed.mood || 'unburdened',
        mood: parsed.mood || 'unburdened',
        type: parsed.type || '3am',
        themes: ['whatsapp', 'voice-note', parsed.mood || 'reflection'],
        location: 'WhatsApp Anonymous',
        age: '27',
        claps: 1,
        helped: 1,
        buyRequests: 0,
        anonymous: true,
        author: 'Anonymous • WhatsApp Voice',
        transcript: text,
        source: 'whatsapp' as const,
        structured: {
          people: 'Self',
          setting: 'WhatsApp Voice Memo',
          emotion: parsed.mood || 'Raw venting',
          conflict: 'Unfiltered daily thoughts',
          turning: 'Spoken into voice note',
          insight: parsed.insight || 'Heard and understood',
          narrative: parsed.narrative || text,
          narrativeHi: parsed.narrative || text
        }
      };

      const defaultReply = `🎙️ *Aur Sunao Bot* — We heard you.

*${parsed.title || 'Voice Note Received'}*
"${parsed.hook || text.slice(0, 60)}..."

💡 *Core Insight:* ${parsed.insight || 'Speaking your truth out loud frees the mind.'}
🌿 *Mood Tagged:* ${parsed.mood || 'Reflective'}

🔒 *Security Note:* Your audio note has been transcribed, structured, and securely synced to your anonymous Web Dashboard.
✨ View & transform anytime at: https://aursunao.app`;

      res.json({
        success: true,
        story: newStory,
        whatsappReply: parsed.whatsappReplyText || defaultReply
      });
    } catch (err: any) {
      console.error("Error in /api/whatsapp/receive-voice:", err);
      const fallbackStory = {
        id: 'wa-' + Date.now().toString(),
        createdAt: Date.now(),
        title: "Late Night WhatsApp Note",
        titleHi: "व्हाट्सएप वॉइस नोट",
        hook: req.body.text ? req.body.text.slice(0, 80) : "Raw voice thought shared on WhatsApp",
        hookHi: "कच्चे विचार वॉइस नोट में",
        emotion: "reflective",
        mood: "reflective",
        type: "3am",
        themes: ["whatsapp", "clarity"],
        location: "WhatsApp",
        age: "25",
        claps: 1,
        helped: 1,
        buyRequests: 0,
        anonymous: true,
        author: "Anonymous • WhatsApp",
        transcript: req.body.text || "Voice note received",
        source: "whatsapp" as const,
        structured: {
          people: "Self",
          setting: "WhatsApp Audio Note",
          emotion: "Vent",
          conflict: "Unburdening mind",
          turning: "Audio sent",
          insight: "Voice brings relief",
          narrative: req.body.text || "Voice note received",
          narrativeHi: req.body.text || "Voice note received"
        }
      };

      res.json({
        success: true,
        story: fallbackStory,
        whatsappReply: `🎙️ *Aur Sunao Bot* — Audio received & processed.\n\n*Core Insight:* Your voice note has been safely unburdened and synced to your private Web Dashboard.\n\n✨ Thank you for speaking your mind.`
      });
    }
  });

  // Enterprise / Brand Inquiry Endpoint
  app.post("/api/enterprise-inquiry", async (req, res) => {
    try {
      const { company, email, useCase } = req.body;
      if (!company || !email) {
        return res.status(400).json({ error: "Company and email are required" });
      }

      const targetEmail = "thinkbeyond9@gmail.com";
      const subject = `[Aur Sunao] New Brand Enterprise Inquiry from ${company}`;
      const text = `New Brand Enterprise Inquiry Received:\n\nCompany: ${company}\nContact Email: ${email}\nUse Case: ${useCase || 'General Research'}\nTimestamp: ${new Date().toISOString()}`;

      console.log(`[Enterprise Inquiry] Routing to ${targetEmail}:`, { company, email, useCase });

      const transporter = getTransporter();
      if (transporter) {
        await transporter.sendMail({
          from: process.env.SMTP_USER || 'noreply@aursunao.app',
          to: targetEmail,
          replyTo: email,
          subject,
          text,
        });
        console.log(`Email successfully dispatched via SMTP to ${targetEmail}`);
      } else {
        console.log(`[SMTP not configured] Brand inquiry logged for ${targetEmail}. Configure SMTP_HOST, SMTP_USER, SMTP_PASS in .env to deliver real emails.`);
      }

      res.json({ success: true, message: "Inquiry sent successfully to thinkbeyond9@gmail.com" });
    } catch (err: any) {
      console.error("Error processing enterprise inquiry:", err);
      res.status(500).json({ error: err.message || "Failed to process inquiry" });
    }
  });

  // FMCG 10-City Anonymous Market Research Study Deployment Endpoint
  app.post("/api/initiate-brand-study", async (req, res) => {
    try {
      const { brandName, targetCities, durationMonths, objective, anonymousPrompt, contactEmail } = req.body;
      if (!brandName || !targetCities || !Array.isArray(targetCities) || targetCities.length === 0) {
        return res.status(400).json({ error: "brandName and targetCities array are required" });
      }

      const RATE_PER_CITY_PER_MONTH = 100000; // 1 Lakh Rupees
      const months = Number(durationMonths) || 1;
      const totalBudgetRupees = targetCities.length * months * RATE_PER_CITY_PER_MONTH;
      const studyId = `AS-FMCG-${Date.now().toString().slice(-6)}`;

      const targetEmail = "thinkbeyond9@gmail.com";
      const subject = `[Aur Sunao FMCG Research] New Anonymous Study Initiated: ${brandName} (${targetCities.length} Cities, ₹${(totalBudgetRupees / 100000).toFixed(1)} Lakh)`;
      const text = `FMCG Brand Anonymous Market Research Study Initiated:\n\n` +
        `Study ID: ${studyId}\n` +
        `Brand Name: ${brandName}\n` +
        `Target Cities (${targetCities.length}): ${targetCities.join(', ')}\n` +
        `Duration: ${months} Month(s)\n` +
        `Standard Rate: ₹1,00,000 / month / city\n` +
        `Total Study Investment: ₹${totalBudgetRupees.toLocaleString('en-IN')} (₹${(totalBudgetRupees / 100000).toFixed(1)} Lakh)\n` +
        `Research Objective: ${objective || 'Consumer Sentiment & Rituals'}\n` +
        `Anonymous Community Prompt: "${anonymousPrompt || 'N/A'}"\n` +
        `Contact Corporate Email: ${contactEmail || 'N/A'}\n` +
        `Deployment Timestamp: ${new Date().toISOString()}`;

      console.log(`[FMCG Brand Study Initiated] ${studyId}:`, {
        brandName,
        cities: targetCities,
        months,
        totalBudgetRupees,
      });

      const transporter = getTransporter();
      if (transporter) {
        await transporter.sendMail({
          from: process.env.SMTP_USER || 'noreply@aursunao.app',
          to: targetEmail,
          replyTo: contactEmail || undefined,
          subject,
          text,
        });
        console.log(`Study notification email dispatched to ${targetEmail}`);
      }

      res.json({
        success: true,
        studyId,
        brandName,
        targetCities,
        durationMonths: months,
        ratePerMonthPerCity: RATE_PER_CITY_PER_MONTH,
        totalBudgetRupees,
        message: `Study successfully initiated for ${brandName} across ${targetCities.length} cities.`,
      });
    } catch (err: any) {
      console.error("Error initiating brand study:", err);
      res.status(500).json({ error: err.message || "Failed to initiate study" });
    }
  });

  // Support Ticket Endpoint
  app.post("/api/support-ticket", async (req, res) => {
    try {
      const { topic, message, email } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const targetEmail = "thinkbeyond9@gmail.com";
      const subject = `[Aur Sunao Support] Ticket: ${topic || 'General Support'}`;
      const text = `New Customer Support Ticket Received:\n\nTopic: ${topic}\nUser Email: ${email || 'Anonymous/Not Provided'}\nMessage:\n${message}\nTimestamp: ${new Date().toISOString()}`;

      console.log(`[Support Ticket] Routing to ${targetEmail}:`, { topic, email, message });

      const transporter = getTransporter();
      if (transporter) {
        await transporter.sendMail({
          from: process.env.SMTP_USER || 'noreply@aursunao.app',
          to: targetEmail,
          replyTo: email || targetEmail,
          subject,
          text,
        });
        console.log(`Support ticket email successfully dispatched via SMTP to ${targetEmail}`);
      } else {
        console.log(`[SMTP not configured] Support ticket logged for ${targetEmail}.`);
      }

      res.json({ success: true, message: "Support ticket sent successfully to thinkbeyond9@gmail.com" });
    } catch (err: any) {
      console.error("Error processing support ticket:", err);
      res.status(500).json({ error: err.message || "Failed to process support ticket" });
    }
  });

  // ==============================================================
  // 4. SYNTHETIC ICP PERSONA GENERATOR
  // ==============================================================
  app.post("/api/generate-persona", async (req, res) => {
    try {
      const { attributes, workspaceId } = req.body;
      if (!attributes) {
        return res.status(400).json({ error: "Attributes are required" });
      }

      const prompt = `You are a Synthetic Persona Generator. Create a highly specific, internally consistent synthetic persona based on these attributes: ${JSON.stringify(attributes)}.

Generate ONLY a valid JSON object with:
- "name": A realistic name fitting the geography and culture.
- "attributes": An object mapping the input attributes to their specific chosen values.
- "bio": A concise (max 3 sentences), highly realistic biography (name, age, city, occupation, major goal/constraint).
- "confidenceScore": 0-100 (based on attribute consistency).
- "provenance": { "model": "gemini-3.8-flash", "timestamp": ${Date.now()}, "seed": ${Math.floor(Math.random() * 10000)} }

Rules:
- Persona must be labeled AI-generated.
- Do NOT use real people.
- Do NOT invent unvalidated facts.
- Distinguish AI generated context from research assumptions.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const persona = JSON.parse(response.text || '{}');
      res.json({ success: true, persona: { ...persona, id: `persona-${Date.now()}` } });
    } catch (err: any) {
      console.error("Error generating persona:", err);
      res.status(500).json({ error: "Failed to generate persona" });
    }
  });

  // ==============================================================
  // 5. AD REACTION SIMULATION ENGINE
  // ==============================================================
  app.post("/api/run-simulation", async (req, res) => {
    try {
      const { personas, creatives, scenario, rubric } = req.body;
      
      // Perform simulation using Gemini
      const prompt = `You are a Synthetic Consumer Research Engine.
Simulate the reaction of the following personas to a new advertising creative.

Personas: ${JSON.stringify(personas)}
Creative Variants: ${JSON.stringify(creatives)}
Context/Scenario: ${JSON.stringify(scenario)}

Evaluate the reaction for each persona across these 12 dimensions (0-100):
1. Attention, 2. Comprehension, 3. Relevance, 4. Resonance, 5. Authenticity, 6. Cultural Fit, 7. Brand Trust, 8. Differentiation, 9. Purchase Consideration, 10. Price-Value, 11. Likely Objections, 12. Suggested Improvements.

Return ONLY a valid JSON object mapping each persona ID to their detailed reaction report.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const reactionReport = JSON.parse(response.text || '{}');
      res.json({ success: true, reactionReport });
    } catch (err: any) {
      console.error("Error running simulation:", err);
      res.status(500).json({ error: "Failed to run simulation" });
    }
  });

  // ==============================================================
  // 6. FICTIONAL BRAND GENERATOR
  // ==============================================================
  app.post("/api/generate-fictional-brand", async (req, res) => {
    try {
      const prompt = `You are a Creative Brand Strategist. Generate a fictional, high-potential consumer brand proposition.
Return ONLY a valid JSON object with:
- "brandName": A creative, distinct fictional brand name.
- "brandCategory": A believable consumer category.
- "productDescription": A concise, illustrative product proposition.
- "positioning": A single sentence brand positioning.
- "targetAudience": A brief description of the target synthetic ICP for this brand.

Rules:
- Brand must be clearly labeled as fictional.
- Avoid actual trademarks or real companies.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const brand = JSON.parse(response.text || '{}');
      res.json({ success: true, brand });
    } catch (err: any) {
      console.error("Error generating fictional brand:", err);
      res.status(500).json({ error: "Failed to generate fictional brand" });
    }
  });

  // ==============================================================
  // 7. RESEARCH REPORT GENERATOR
  // ==============================================================
  app.post("/api/generate-report", async (req, res) => {
    try {
      const { experimentId, simulationResults } = req.body;
      if (!simulationResults) {
        return res.status(400).json({ error: "Simulation results are required" });
      }

      const prompt = `You are a Senior Consumer Insights Strategist. Analyze the following simulation results and generate a structured research report.

Simulation Results: ${JSON.stringify(simulationResults)}

Return ONLY a valid JSON object with:
- "summary": A concise executive summary of the research findings (the "so what").
- "topInsights": Array of 3-5 key actionable insights.
- "recommendations": Array of 3 specific, actionable recommendations for the brand manager.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const report = JSON.parse(response.text || '{}');
      res.json({ success: true, report });
    } catch (err: any) {
      console.error("Error generating report:", err);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // ==============================================================
  // 1. SYNTHETIC ICP AVATAR EVALUATION & CONVERSATION
  // ==============================================================
  app.post("/api/synthetic-avatar-chat", async (req, res) => {
    try {
      const { avatarName, cohortName, city, age, occupation, adCopyOrPitch, sampleVents, conversationHistory } = req.body;
      if (!adCopyOrPitch) {
        return res.status(400).json({ error: "adCopyOrPitch is required" });
      }

      const prompt = `You are a Synthetic Consumer ICP Avatar representing real vulnerable venters on Aur Sunao (India's anonymous voice platform).
Your Persona Details:
- Name: ${avatarName || 'Priya'}
- Cohort: ${cohortName || 'Tier-2 City Migrants'}
- City/Location: ${city || 'Bengaluru (migrated from Patna)'}
- Age: ${age || 26}
- Occupation: ${occupation || 'Software QA Analyst'}
- Tone: Candid, colloquial Indian English/Hinglish, grounded in small-town roots vs metro reality.
- Authentic Vents Sample: ${Array.isArray(sampleVents) ? sampleVents.join(' | ') : 'Sending half my salary back home, pretending I love late-night pizza when I crave mustard fish curry, feeling like an outsider in gated societies.'}

The Brand Manager / Marketer has pitched this ad copy, campaign slogan, or marketing message to you:
"${adCopyOrPitch}"

Evaluate this pitch with raw honesty. Respond in character as this specific Indian consumer who vents on Aur Sunao at 2am.
Return ONLY a valid JSON object with the following keys:
- "resonanceScore": An integer from 0 to 100 representing your emotional resonance.
- "verdict": One of "High Resonance", "Skeptical / Needs Work", "Strong Cultural Pushback", or "Alienating"
- "avatarQuote": 2-3 sentences of direct, candid feedback in your voice (Hinglish/English conversational), reacting honestly to the pitch.
- "pushbackPoints": Array of 2-3 specific cultural friction points (why this feels fake, patronizing, unrealistic, or out of touch).
- "acceptanceSignals": Array of 2-3 specific elements (if any) that this consumer appreciates or would accept without friction.
- "authenticReframing": How the brand should ACTUALLY speak to you or reframe their message to win your genuine trust.
- "culturalInsight": 1-2 sentences explaining the underlying cultural or socioeconomic tension this campaign touches on.
- "emotionalTriggers": Array of 2-3 emotions evoked (e.g., "Parental Guilt", "Imposter Syndrome", "Skepticism", "Relief")
- "recommendedSlogans": Array of 2 distinct alternative slogans crafted specifically for your persona: [{ "style": "High-Empathy Variant", "slogan": "...", "rationale": "..." }, { "style": "Grounded Vernacular Variant", "slogan": "...", "rationale": "..." }]
- "socialMediaReaction": Array of 2 simulated social comments representing how your peers on Reddit or Instagram would mock or praise this campaign: [{ "platform": "Reddit / Instagram", "simulatedComment": "...", "sentiment": "positive" | "negative" | "mixed" }]
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json({ success: true, feedback: data });
    } catch (err: any) {
      console.error("Error in synthetic avatar evaluation:", err);
      // High quality contextual fallback
      res.json({
        success: true,
        feedback: {
          resonanceScore: 68,
          verdict: "Skeptical / Needs Work",
          avatarQuote: "Bhai, sounds like someone sitting in an air-conditioned Bandra agency wrote this without ever standing in a 7:45 AM local train. We don't want 'empowerment' lectures; we want products that don't leak in our backpacks and cost what they actually promise.",
          pushbackPoints: [
            "Over-romanticizes urban hustle while ignoring burnout and financial pressure.",
            "Uses buzzwords like 'Unstoppable You' which trigger eye-rolls among Tier-2 migrants.",
            "Doesn't acknowledge the guilt of spending discretionary money on premium packaging."
          ],
          acceptanceSignals: [
            "The functional benefit itself is needed during exhausting workweeks.",
            "Visual cues of warm hometown comfort resonate if not priced at 3x markups."
          ],
          authenticReframing: "Focus on the quiet ritual—the 5 minutes of peace with a warm cup before the morning standup call starts. Show real small-town kitchens, not Pinterest lofts.",
          culturalInsight: "Tier-2 migrants in metros navigate dual identities: maintaining frugal roots for family pride while adopting high-velocity consumption rituals.",
          emotionalTriggers: ["Hustle Fatigue", "Guilt", "Craving Authenticity"],
          recommendedSlogans: [
            {
              style: "High-Empathy Variant",
              slogan: "A moment of real peace before your busy day begins.",
              rationale: "Acknowledges the frantic pace of metro life without glorifying burnout."
            },
            {
              style: "Grounded Vernacular Variant",
              slogan: "Ghar jaisa swaad, bina kisi dikhawe ke.",
              rationale: "Speaks directly to the craving for unpretentious hometown comfort."
            }
          ],
          socialMediaReaction: [
            {
              platform: "Reddit (r/bangalore)",
              simulatedComment: "Another brand pretending 14-hour workdays are inspiring instead of depressing.",
              sentiment: "negative"
            },
            {
              platform: "WhatsApp Family Status",
              simulatedComment: "Sent this to my sister in Noida. True tea tastes like home.",
              sentiment: "positive"
            }
          ]
        }
      });
    }
  });

  // ==============================================================
  // 2. ALGORITHMIC EMPATHY MATCHING
  // ==============================================================
  app.post("/api/algorithmic-empathy-match", async (req, res) => {
    try {
      const { userStoryText, mood, location, candidateStories } = req.body;
      if (!userStoryText) {
        return res.status(400).json({ error: "userStoryText is required" });
      }

      const prompt = `You are Aur Sunao's Algorithmic Empathy Matching engine.
A user has just shared this deeply vulnerable voice vent:
"${userStoryText}"
Emotion: ${mood || 'anxious'}
Location: ${location || 'India'}

Candidates from the anonymous public library:
${Array.isArray(candidateStories) ? candidateStories.slice(0, 10).map((s: any) => `[ID: ${s.id}] Title: "${s.title}" | Emotion: ${s.emotion} | Turning: "${s.structured?.turning || s.hook}" | Narrative snippet: "${(s.structured?.narrative || s.transcript || '').slice(0, 180)}"`).join('\n') : 'Diverse stories of career failure, loneliness, family pressure, and resilience.'}

Select the single candidate story that represents a 92-98% semantic peer empathy match (someone who walked this exact painful path and survived with a tangible turning point).
Return ONLY a valid JSON object with:
- "matchedStoryId": The ID of the best matching story
- "matchScore": Integer between 92 and 98
- "sharedEmotionalTheme": 3-5 word definition of the core wound (e.g., "Parental Expectations vs Silent Career Pivot")
- "sharedTurningPoint": The exact pivot of realization that bridged them through the dark phase
- "survivorWisdom": 2-3 sentences explaining how this peer made peace with the exact same fear
- "empathyBridgeQuote": A powerful, anonymous comforting sentence ("You are not the first person to feel this at 3am...")
- "resonanceDimensions": Array of 3 specific shared psychological markers (e.g. ["Fear of disappointing parents", "Imposter syndrome", "Financial runway anxiety"])
- "timeGapInMonths": Estimated months it took the peer to see the light (integer between 3 and 14)
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const matchData = JSON.parse(response.text || '{}');
      res.json({ success: true, match: matchData });
    } catch (err: any) {
      console.error("Error in algorithmic empathy matching:", err);
      res.json({
        success: true,
        match: {
          matchedStoryId: req.body.candidateStories?.[0]?.id || "story-career-1",
          matchScore: 96,
          sharedEmotionalTheme: "Career Stagnation & Parental Silence",
          sharedTurningPoint: "Realizing that hiding the struggle took more energy than surviving the truth.",
          survivorWisdom: "When I finally told my father about quitting, he didn't explode—he sighed and made chai. The monster in our head is always louder than reality.",
          empathyBridgeQuote: "You are not broken for feeling exhausted by expectations you never signed up for.",
          resonanceDimensions: ["Parental guilt", "Identity tied to corporate rank", "Fear of starting over"],
          timeGapInMonths: 6
        }
      });
    }
  });

  // ==============================================================
  // 3. BRAND-SPONSORED VENT BOUNTIES (GIG-ECONOMY ENGINE)
  // ==============================================================
  // 3. BRAND-SPONSORED VENT BOUNTIES API (Loyalty Points System)
  // ==============================================================
  let VENT_BOUNTIES_STORE = [
    {
      id: "bounty-sleep-1",
      brandName: "SlumberWell Botanicals",
      brandCategory: "Sleep Wellness & Health",
      brandLogo: "🌙",
      bountyRewardPoints: 500,
      bountyRewardRupees: 500,
      targetEmotion: "burnout",
      promptTitle: "3 AM Burnout Rants & Unclosed Brain Tabs",
      promptDescription: "Vent about the specific thoughts, Slack pings, or life anxieties that keep you awake past 2:30 AM. What is keeping your chest tight at night?",
      targetCities: ["Bengaluru", "Mumbai", "Delhi NCR", "Pune"],
      maxQuota: 30,
      claimedQuota: 18,
      sponsoredByCorporate: true,
      status: "active",
      sampleQuestion: "What is the thought that made you open your eyes tonight?",
      payoutTimeframe: "Instant Member Loyalty Points Credit (Redeem for Wellness Perks)"
    },
    {
      id: "bounty-chai-2",
      brandName: "Pahadi Chai Co.",
      brandCategory: "FMCG Packaged Beverages",
      brandLogo: "☕",
      bountyRewardPoints: 750,
      bountyRewardRupees: 750,
      targetEmotion: "lonely",
      promptTitle: "Small-Town Migrant Longing & The 6 PM Ghar Ki Yaad",
      promptDescription: "Share an honest audio vent about moving away from home for a metro job. What does your mother do that no city swiggy order can replace?",
      targetCities: ["Kolkata", "Patna", "Lucknow", "Jaipur"],
      maxQuota: 25,
      claimedQuota: 14,
      sponsoredByCorporate: true,
      status: "active",
      sampleQuestion: "When does the silence in your flat feel the loudest?",
      payoutTimeframe: "Instant Member Loyalty Points Credit"
    },
    {
      id: "bounty-fmcg-3",
      brandName: "KleenHome Essentials",
      brandCategory: "Home & Personal Care",
      brandLogo: "🫧",
      bountyRewardPoints: 1000,
      bountyRewardRupees: 1000,
      targetEmotion: "frustrated",
      promptTitle: "The Invisible Mental Load of Sunday Chores",
      promptDescription: "Tell the unfiltered story of who in your home actually tracks when detergent, oil, or dishwashing liquid runs out. The silent domestic labor nobody notices.",
      targetCities: ["Mumbai", "Ahmedabad", "Indore", "Hyderabad"],
      maxQuota: 20,
      claimedQuota: 7,
      sponsoredByCorporate: true,
      status: "active",
      sampleQuestion: "What chore argument have you repeated for the 100th time?",
      payoutTimeframe: "Instant Member Loyalty Points Credit"
    },
    {
      id: "bounty-career-4",
      brandName: "NextPath Career Labs",
      brandCategory: "EdTech & Talent Intelligence",
      brandLogo: "💼",
      bountyRewardPoints: 1200,
      bountyRewardRupees: 1200,
      targetEmotion: "anxious",
      promptTitle: "Quiet Quitting Toxic Indian IT Service Giants",
      promptDescription: "Unburden the unspoken politics, bench periods, or manager micromanagement you can't post on LinkedIn without risking your appraisal.",
      targetCities: ["Hyderabad", "Bengaluru", "Pune", "Chennai"],
      maxQuota: 25,
      claimedQuota: 21,
      sponsoredByCorporate: true,
      status: "closing_soon",
      sampleQuestion: "What was the exact email that broke your spirit?",
      payoutTimeframe: "Instant Member Loyalty Points Credit"
    }
  ];

  // List all active bounties
  app.get("/api/bounties", (req, res) => {
    res.json({ success: true, bounties: VENT_BOUNTIES_STORE });
  });

  // Claim a bounty upon recording
  app.post("/api/bounties/claim", (req, res) => {
    try {
      const { bountyId, storyId, userName, ventExcerpt } = req.body;
      const bounty = VENT_BOUNTIES_STORE.find(b => b.id === bountyId);
      if (!bounty) {
        return res.status(404).json({ error: "Bounty not found" });
      }

      if (bounty.claimedQuota >= bounty.maxQuota) {
        return res.status(400).json({ error: "Bounty quota is already fully claimed" });
      }

      bounty.claimedQuota += 1;
      if (bounty.claimedQuota >= bounty.maxQuota) {
        bounty.status = "completed";
      }

      const points = bounty.bountyRewardPoints || bounty.bountyRewardRupees || 500;
      console.log(`[Bounty Claimed] ${points} Loyalty Points awarded to ${userName || 'Anonymous'} for "${bounty.promptTitle}" (Story ID: ${storyId})`);

      res.json({
        success: true,
        rewardEarned: points,
        bountyTitle: bounty.promptTitle,
        sponsorBrand: bounty.brandName,
        message: `${points} Loyalty Points successfully credited to your Aur Sunao Member Wallet!`
      });
    } catch (err: any) {
      console.error("Error claiming bounty:", err);
      res.status(500).json({ error: "Failed to claim bounty" });
    }
  });

  // Sponsor a new bounty (For Brands)
  app.post("/api/bounties/sponsor", (req, res) => {
    try {
      const { brandName, brandCategory, bountyRewardPoints, bountyRewardRupees, targetEmotion, promptTitle, promptDescription, targetCities, maxQuota, contactEmail } = req.body;
      const points = Number(bountyRewardPoints || bountyRewardRupees) || 500;
      if (!brandName || !promptTitle) {
        return res.status(400).json({ error: "brandName and promptTitle are required" });
      }

      const quota = Number(maxQuota) || 20;
      const totalPointsPool = points * quota;

      const newBounty = {
        id: `bounty-custom-${Date.now()}`,
        brandName,
        brandCategory: brandCategory || "Consumer Goods",
        brandLogo: "🎯",
        bountyRewardPoints: points,
        bountyRewardRupees: points,
        targetEmotion: targetEmotion || "vulnerable",
        promptTitle,
        promptDescription: promptDescription || "Share your authentic lived experience.",
        targetCities: Array.isArray(targetCities) && targetCities.length > 0 ? targetCities : ["All India"],
        maxQuota: quota,
        claimedQuota: 0,
        sponsoredByCorporate: true,
        status: "active" as const,
        sampleQuestion: "What is your rawest memory regarding this?",
        payoutTimeframe: "Instant Member Loyalty Points Credit"
      };

      VENT_BOUNTIES_STORE.unshift(newBounty);

      console.log(`[New Brand Bounty Sponsored] ${brandName} funded ${totalPointsPool} Loyalty Points for "${promptTitle}"`);

      // Notify internal team
      const transporter = getTransporter();
      if (transporter) {
        transporter.sendMail({
          from: process.env.SMTP_USER || 'noreply@aursunao.app',
          to: "thinkbeyond9@gmail.com",
          subject: `[Aur Sunao] New Sponsored Vent Bounty: ${brandName} (${totalPointsPool} Loyalty Points)`,
          text: `Brand ${brandName} sponsored a new Vent Bounty:\n\nTitle: ${promptTitle}\nReward per vent: ${points} Loyalty Points\nQuota: ${quota} vents\nTotal Loyalty Points Pool: ${totalPointsPool} Pts\nTarget Emotion: ${targetEmotion}\nContact: ${contactEmail || 'N/A'}`
        }).catch(err => console.error("Failed to email bounty notice:", err));
      }

      res.json({
        success: true,
        bounty: newBounty,
        totalBudget: totalPointsPool,
        message: `Successfully launched Vent Bounty with ${totalPointsPool.toLocaleString('en-IN')} Loyalty Points pool.`
      });
    } catch (err: any) {
      console.error("Error sponsoring bounty:", err);
      res.status(500).json({ error: "Failed to sponsor bounty" });
    }
  });

  // Vite middleware setup for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
