// copy pasted from PostHog
export const survey = {
  questions: [
    {
      key: "features",
      type: "multiple_choice",
      question: "Which features are you most interested in?",
      choices: [
        "AI Personal Assistant",
        "Bulk Unsubscriber",
        "Cold Email Blocker",
        "Reply/Follow-up Tracker",
        "Email Analytics",
        "Other",
      ],
    },
    // {
    //   key: "role",
    //   type: "single_choice",
    //   question: "Which role best describes you?",
    //   choices: [
    //     "Founder",
    //     "Executive",
    //     "Small Business Owner",
    //     "Assistant",
    //     "Investor",
    //     "Sales",
    //     "Marketing",
    //     "Customer Support",
    //     "Software Engineer",
    //     "Student",
    //     "Individual",
    //     "Other",
    //   ],
    // },
    // {
    //   key: "company_size",
    //   type: "single_choice",
    //   question: "What is the size of your company?",
    //   choices: [
    //     "Only me",
    //     "2-10 people",
    //     "11-100 people",
    //     "101-1000 people",
    //     "1000+ people",
    //   ],
    // },
    {
      key: "source",
      type: "single_choice",
      question: "How did you hear about Inbox Zero?",
      choices: [
        "Search",
        "Friend",
        "Twitter",
        "Facebook",
        "YouTube",
        "Reddit",
        "Newsletter",
        "Product Hunt",
        "HackerNews",
        "TikTok",
        "Instagram",
        "Other",
      ],
    },
    {
      key: "improvements",
      type: "open",
      question:
        "Last question! If you had a magic wand, what would you want to improve about your email experience?",
    },
  ],
};
