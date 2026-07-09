import { apiUrl } from "./apiClient";

export const emailService = {
  async sendEmail(to: string, subject: string, bodyType: string, data: any): Promise<any> {
    try {
      const response = await fetch(apiUrl("/api/email/send"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, bodyType, data })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Email server returned error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (err) {
      console.error("[SkillBridge Email] Failed to deliver email through backend proxy.", err);
      return { success: false, error: err, message: err instanceof Error ? err.message : String(err) };
    }
  },

  async sendWelcomeEmail(to: string, name: string): Promise<any> {
    return this.sendEmail(
      to,
      "Welcome to SkillBridge AI! 🚀 Let's become Industry Ready",
      "welcome",
      { name }
    );
  },

  async sendMilestoneEmail(to: string, milestoneName: string, newScore: number): Promise<any> {
    return this.sendEmail(
      to,
      `🎉 Milestone Achieved: ${milestoneName}!`,
      "milestone",
      { milestoneName, newScore }
    );
  },

  async sendInterviewReminder(to: string, name: string, role: string): Promise<any> {
    return this.sendEmail(
      to,
      `⏳ SkillBridge Screening Alert: ${role} preparation active`,
      "interview",
      { name, role }
    );
  },

  async sendAnalyticsReport(to: string, stats: any): Promise<any> {
    return this.sendEmail(
      to,
      "📊 Your SkillBridge AI Readiness Report",
      "analytics",
      stats
    );
  }
};
