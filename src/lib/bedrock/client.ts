import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Define the payload for bedrock
interface BedrockResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

// Generate fallback AI data so the application is fully functional during local testing without AWS keys!
function generateMockAIData(params: {
  occasion: string;
  recipientName: string;
  senderName: string;
  relationship: string;
  personalMessage?: string;
  favoriteMemories?: string[];
  specialMoments?: string[];
  futureGoals?: string[];
}) {
  const occasionTitle = params.occasion.charAt(0).toUpperCase() + params.occasion.slice(1);
  const relationshipText = params.relationship ? `my amazing ${params.relationship}` : 'you';
  
  const aiTitle = `To ${params.recipientName}: ${params.personalMessage ? params.personalMessage.substring(0, 30) + '...' : `A Beautiful ${occasionTitle} Celebration`}`;

  const aiStoryNarrative = `Our journey with ${params.recipientName} has been filled with countless laughs, support, and unforgettable memories. From the small everyday moments to major milestones, ${params.recipientName} has touched our lives in ways words can barely describe. This special website is a tribute to the warmth, kindness, and joy they bring into our lives every single day.`;

  const aiLetter = `Dear ${params.recipientName},\n\nI wanted to take a moment during this special ${params.occasion} to let you know how incredibly much you mean to me. As ${relationshipText}, you have been a constant source of inspiration, support, and happiness.\n\n${params.personalMessage || 'Every moment we share is a memory I treasure. Thank you for always being there, for the shared laughs, the listening ear, and the unwavering friendship. You make the world a brighter place just by being in it.'}\n\nI hope this website brings a massive smile to your face today. You deserve all the love, happiness, and success in the world.\n\nWith all my love,\n${params.senderName}`;

  const defaultTimeline = [
    {
      title: "The First Connection",
      date: "A memorable beginning",
      description: `The day our paths crossed and a beautiful journey began. Every great story has a beginning, and this was ours.`,
      icon: "✨"
    },
    {
      title: "A Shared Milestone",
      date: "Creating our foundation",
      description: `Navigating challenges and celebrating achievements together. One of our favorite chapters.`,
      icon: "🎉"
    },
    {
      title: "The Unforgettable Laughs",
      date: "Inside jokes and comfort",
      description: `Countless late-night conversations and inside jokes that define who we are to each other.`,
      icon: "❤️"
    },
    {
      title: "This Special Moment",
      date: "Today",
      description: `Celebrating you on this gorgeous ${params.occasion} website! Looking forward to many more beautiful memories.`,
      icon: "🌟"
    }
  ];

  // Adjust timeline based on user custom favorite memories if provided
  if (params.favoriteMemories && params.favoriteMemories.length > 0) {
    params.favoriteMemories.forEach((mem, index) => {
      if (index < 4) {
        defaultTimeline[index] = {
          title: `Memory #${index + 1}`,
          date: "A special day",
          description: mem,
          icon: index === 0 ? "✨" : index === 1 ? "🎉" : index === 2 ? "❤️" : "🌟"
        };
      }
    });
  }

  const aiTimeline = defaultTimeline;

  const aiQuotes = [
    {
      quote: "The best thing to hold onto in life is each other.",
      author: "Audrey Hepburn"
    },
    {
      quote: "In the end, it's not the years in your life that count. It's the life in your years.",
      author: "Abraham Lincoln"
    },
    {
      quote: `To the world you might be one person, but to me, you are the world.`,
      author: params.senderName
    }
  ];

  const aiPoem = `In the tapestry of life, you shine so bright,\n` +
                 `A guide through the day, a star in the night.\n` +
                 `On this special occasion, we celebrate you,\n` +
                 `For a heart that is warm, and a soul that is true.\n\n` +
                 `May laughter and happiness fill all your days,\n` +
                 `And success guide your steps in wonderful ways.\n` +
                 `Through seasons and changes, whatever may be,\n` +
                 `You'll remain a true treasure, to you and to me.`;

  return {
    ai_title: aiTitle,
    ai_story_narrative: aiStoryNarrative,
    ai_letter: aiLetter,
    ai_timeline: aiTimeline,
    ai_quotes: aiQuotes,
    ai_poem: aiPoem
  };
}

export async function generateMomentContent(params: {
  occasion: string;
  recipientName: string;
  senderName: string;
  relationship: string;
  personalMessage?: string;
  favoriteMemories?: string[];
  specialMoments?: string[];
  futureGoals?: string[];
}) {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const hasAWSCredentials = 
    !!process.env.AWS_ACCESS_KEY_ID && 
    !!process.env.AWS_SECRET_ACCESS_KEY && 
    !!process.env.AWS_REGION;

  const prompt = `You are a creative, highly emotional, and extremely polished AI writer. 
Generate beautiful, touching website content for a special life moment.

Occasion: ${params.occasion}
Recipient: ${params.recipientName}
Sender: ${params.senderName}
Relationship: ${params.relationship}
Personal Message: ${params.personalMessage || "None provided"}
Favorite Memories: ${params.favoriteMemories?.join(', ') || "None provided"}
Special Moments/Achievements: ${params.specialMoments?.join(', ') || "None provided"}
Future Goals/Bucket List: ${params.futureGoals?.join(', ') || "None provided"}

Generate a valid JSON object matching this structure EXACTLY.
{
  "ai_title": "A short, beautiful, customized title/headline for the website hero, 5-8 words",
  "ai_story_narrative": "A highly premium, captivating 3-paragraph narrative about the recipient and our shared journey, written in the third person or first-person plural ('We' or 'Our'). Keep it deeply emotional, warm, and poetic.",
  "ai_letter": "A deeply personal, touching letter from the sender to the recipient. Use 'I' (sender) and 'you' (recipient). Bring tears of joy to their eyes. It should feel authentic, not generic. It must incorporate their personal message and the dynamics of their relationship. Include page breaks using '\\n\\n'.",
  "ai_timeline": [
    {
      "title": "A beautiful milestone title",
      "date": "Approximate date or timeframe",
      "description": "Short touching description of the memory/achievement",
      "icon": "A single appropriate emoji (e.g. ✨, ❤️, 🎓, 🍾, 🎉)"
    }
  ], // Generate exactly 4 chronological key memories, incorporating the provided memories or creating beautiful defaults
  "ai_quotes": [
    {
      "quote": "A deeply philosophical or touching personalized quote about love/friendship/life",
      "author": "An appropriate author or custom attribution"
    }
  ], // Generate exactly 3 quotes
  "ai_poem": "A beautiful 2-3 stanza rhyming poem dedicated specifically to them on this occasion. It must feel custom and deeply creative."
}`;

  // 1. Google Gemini Engine (Preferred if Gemini key is available!)
  if (hasGeminiKey) {
    try {
      console.log("Using Google Gemini API Engine for AI generation...");
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.8
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const responseData = await response.json();
      const jsonString = responseData.candidates[0].content.parts[0].text.trim();
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Google Gemini Call Failed. Trying Bedrock fallback...", error);
    }
  }

  // 2. AWS Bedrock Claude Engine
  if (hasAWSCredentials) {
    try {
      console.log("Using AWS Bedrock Claude Engine for AI generation...");
      const client = new BedrockRuntimeClient({
        region: process.env.AWS_REGION!,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
      });

      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 4000,
          temperature: 0.8,
          messages: [
            {
              role: 'user',
              content: [{ type: 'text', text: prompt }]
            }
          ]
        })
      });

      const response = await client.send(command);
      const responseBody = new TextDecoder().decode(response.body);
      const parsedResponse = JSON.parse(responseBody) as BedrockResponse;
      const jsonString = parsedResponse.content[0].text.trim();
      
      const cleanJson = jsonString.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("AWS Bedrock Call Failed. Falling back to local generator:", error);
    }
  }

  // 3. Mock Sandbox Fallback
  console.warn("AI credentials missing. Using local mock generator.");
  await new Promise((resolve) => setTimeout(resolve, 2500));
  return generateMockAIData(params);
}
