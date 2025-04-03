import { z } from "zod";
import { createScopedLogger } from "@/utils/logger";
import { chatCompletionObject } from "@/utils/llms";
import type { UserEmailWithAI } from "@/utils/llms/types";
import type { EmailForLLM } from "@/utils/types";
import { stringifyEmail } from "@/utils/stringify-email";
import { getTodayForLLM } from "@/utils/llms/helpers";

const logger = createScopedLogger("DraftWithKnowledge");

const SYSTEM_PROMPT = `You are an expert assistant that drafts email replies using knowledge base information.
Write a polite and professional email that follows up on the previous conversation.
Keep it concise and friendly. Don't be pushy.
Use context from the previous emails and the provided knowledge base to make it relevant and accurate.
Don't mention that you're an AI.
Don't reply with a Subject. Only reply with the body of the email.
Keep it short.

IMPORTANT: Use placeholders sparingly! Only use them where you have limited information.
Never use placeholders for the user's name. You do not need to sign off with the user's name. Do not add a signature.
Do not invent information. For example, DO NOT offer to meet someone at a specific time as you don't know what time the user is available.`;

const USER_PROMPT = ({
  messages,
  user,
  instructions,
  knowledgeBaseContent,
  emailHistorySummary,
}: {
  messages: (EmailForLLM & { to: string })[];
  user: UserEmailWithAI;
  instructions: string | null;
  knowledgeBaseContent: string | null;
  emailHistorySummary: string | null;
}) => {
  const userInstructions = instructions
    ? `Additional user instructions:

<instructions>
${instructions}
</instructions>
`
    : "";

  const userAbout = user.about
    ? `Context about the user:
    
<userAbout>
${user.about}
</userAbout>
`
    : "";

  const relevantKnowledge = knowledgeBaseContent
    ? `Relevant knowledge base content:
    
<knowledge_base>
${knowledgeBaseContent}
</knowledge_base>
`
    : "";

  const historicalContext = emailHistorySummary
    ? `Historical email context:
    
<historical_context>
${emailHistorySummary}
</historical_context>
`
    : "";

  return `${userInstructions}
${userAbout}
${relevantKnowledge}
${historicalContext}

Here is the context of the email thread (from oldest to newest):
${messages
  .map(
    (msg) => `<email>
${stringifyEmail(msg, 3000)}
<date>${msg.date?.toISOString() ?? "unknown"}</date>
</email>`,
  )
  .join("\n")}
     
Please write a reply to the email.
${getTodayForLLM()}
IMPORTANT: The person you're writing an email for is: ${messages.at(-1)?.to}.`.trim();
};

const draftSchema = z.object({
  reply: z
    .string()
    .describe(
      "The complete email reply draft incorporating knowledge base information",
    ),
});

export async function aiDraftWithKnowledge({
  messages,
  user,
  instructions,
  knowledgeBaseContent,
  emailHistorySummary,
}: {
  messages: (EmailForLLM & { to: string })[];
  user: UserEmailWithAI;
  instructions: string | null;
  knowledgeBaseContent: string | null;
  emailHistorySummary: string | null;
}) {
  try {
    logger.info("Drafting email with knowledge base", {
      messageCount: messages.length,
      hasKnowledge: !!knowledgeBaseContent,
      hasHistory: !!emailHistorySummary,
    });

    const system = SYSTEM_PROMPT;
    const prompt = USER_PROMPT({
      messages,
      user,
      instructions,
      knowledgeBaseContent,
      emailHistorySummary,
    });

    logger.trace("Input", { system, prompt });

    const result = await chatCompletionObject({
      system,
      prompt,
      schema: draftSchema,
      usageLabel: "Email draft with knowledge",
      userAi: user,
      userEmail: user.email,
    });

    logger.trace("Output", result.object);

    return result.object.reply;
  } catch (error) {
    logger.error("Failed to draft email with knowledge", { error });
    return {
      error: "Failed to draft email using knowledge base",
    };
  }
}
