import type { VercelRequest, VercelResponse } from '@vercel/node';

const VERIFIED_EMAIL = 'sanketr980@gmail.com';

const getResendKey = () => process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || '';

const buildHtml = (bodyType: string, data: any, recipient: string, finalRecipient: string) => {
  const redirectNoticeHtml = recipient.toLowerCase() !== VERIFIED_EMAIL && finalRecipient === VERIFIED_EMAIL
    ? `<div style="background-color: #fef3c7; color: #b45309; padding: 12px; border: 1px solid #fcd34d; border-radius: 6px; font-size: 13px; margin-bottom: 20px; font-family: sans-serif;"><strong>Sandbox Notice:</strong> This message was originally addressed to <code>${recipient}</code>, but was routed to your verified Resend email address (<code>${VERIFIED_EMAIL}</code>) to prevent API authorization errors in sandbox mode.</div>`
    : '';

  let contentHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4f46e5; margin-bottom: 4px;">SkillBridge AI</h2>
      <p style="font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 24px;">Bridging Academia and Industry</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
      ${redirectNoticeHtml}
  `;

  if (bodyType === 'welcome') {
    contentHtml += `
      <h3>Welcome to SkillBridge AI, ${data?.name || 'Learner'}!</h3>
      <p>Your journey from academic foundations to industrial coding excellence has begun.</p>
      <ul>
        <li><strong>Personalized AI Roadmaps</strong> to direct your studies.</li>
        <li><strong>Production-ready Projects</strong> to populate your portfolio.</li>
        <li><strong>Simulated Technical Interviews</strong> with automatic grading.</li>
      </ul>
      <p><a href="#" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500;">Get Started</a></p>
    `;
  } else if (bodyType === 'milestone') {
    contentHtml += `
      <h3>🎉 Milestone Unlocked!</h3>
      <p>Excellent progress! You have completed the milestone: <strong>"${data?.milestoneName || 'Skill Achievement'}"</strong>.</p>
      <p>Your readiness index has climbed to <strong>${data?.newScore || '82'}%</strong>.</p>
    `;
  } else if (bodyType === 'interview') {
    contentHtml += `
      <h3>⏳ Upcoming Prep Reminder</h3>
      <p>Hi ${data?.name || 'Student'}, your simulated technical screening for <strong>"${data?.role || 'Software Engineer'}"</strong> is scheduled.</p>
    `;
  } else if (bodyType === 'analytics') {
    contentHtml += `
      <h3 style="color: #4f46e5;">📊 Your SkillBridge AI Readiness Report</h3>
      <p>Hi there,</p>
      <p>We have compiled your latest career-readiness and technical competence assessment metrics.</p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid #cbd5e1;">
              <th style="padding: 10px 5px; font-weight: bold; font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">Performance Metric</th>
              <th style="padding: 10px 5px; font-weight: bold; font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; text-align: right;">Current Value</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 5px; font-size: 14px; color: #334155;">Completed Skills</td>
              <td style="padding: 12px 5px; font-size: 14px; color: #0f172a; text-align: right; font-weight: bold;">${data?.completedSkills ?? 0}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 5px; font-size: 14px; color: #334155;">Average Skill Progress</td>
              <td style="padding: 12px 5px; font-size: 14px; color: #4f46e5; text-align: right; font-weight: bold;">${data?.averageSkillProgress ?? 0}%</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 5px; font-size: 14px; color: #334155;">Built Repositories / Projects</td>
              <td style="padding: 12px 5px; font-size: 14px; color: #7c3aed; text-align: right; font-weight: bold;">${data?.totalProjects ?? 0}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 5px; font-size: 14px; color: #334155;">Approved Certificates</td>
              <td style="padding: 12px 5px; font-size: 14px; color: #0891b2; text-align: right; font-weight: bold;">${data?.totalCertificates ?? 0}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  } else {
    contentHtml += `
      <h3>Notification from SkillBridge</h3>
      <p>${data?.message || 'You have a new update waiting in your dashboard.'}</p>
    `;
  }

  contentHtml += `
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 32px; margin-bottom: 16px;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">SkillBridge AI Inc. • ${VERIFIED_EMAIL}</p>
    </div>
  `;

  return contentHtml;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, bodyType, data } = req.body || {};
  const recipient = typeof to === 'string' && to.trim() !== '' ? to.trim() : VERIFIED_EMAIL;
  const resendKey = getResendKey();

  let finalRecipient = recipient;
  if (resendKey && recipient.toLowerCase() !== VERIFIED_EMAIL) {
    finalRecipient = VERIFIED_EMAIL;
  }

  const contentHtml = buildHtml(bodyType, data, recipient, finalRecipient);

  try {
    if (resendKey) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`
        },
        body: JSON.stringify({
          from: 'SkillBridge AI <onboarding@resend.dev>',
          to: finalRecipient,
          subject: subject || 'SkillBridge Update',
          html: contentHtml
        })
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        console.warn('[Resend Email] Delivery restriction or error', errorText);
        return res.status(500).json({ success: false, message: 'Resend returned restriction response.', detail: errorText });
      }

      const json = await resendResponse.json();
      return res.status(200).json({ success: true, message: 'Real email sent successfully!', id: json.id });
    }

    console.log('[Email Mock Sent] content preview:', contentHtml);
    return res.status(200).json({ success: true, mocked: true, message: 'Email simulated successfully (no Resend API key configured).', content: contentHtml });
  } catch (err: any) {
    console.error('[Email Function Error]', err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
}
