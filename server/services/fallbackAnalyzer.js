/**
 * Deterministic rule-based fallback analyzer.
 * Used when the Gemini API is unavailable or errors out.
 */

const SCAM_PATTERNS = [
  { pattern: /(?:you(?:'ve)?\s+)?won\s+(?:a\s+)?(?:\$|₹|Rs\.?|USD|INR)/i, sign: 'Claims you won money or a prize', weight: 25 },
  { pattern: /(?:click|tap|visit)\s+(?:this\s+)?(?:link|here|url|now)/i, sign: 'Urges you to click a link', weight: 15 },
  { pattern: /https?:\/\/[^\s]*(?:bit\.ly|tinyurl|t\.co|goo\.gl|rb\.gy|is\.gd|shorturl)/i, sign: 'Contains shortened/obfuscated URL', weight: 20 },
  { pattern: /(?:urgent|immediately|right\s+now|act\s+fast|limited\s+time|expire|hurry)/i, sign: 'Creates artificial urgency', weight: 15 },
  { pattern: /(?:bank\s+account|credit\s+card|debit\s+card|cvv|pin\s+number|otp|password|ssn|social\s+security)/i, sign: 'Requests sensitive financial or personal information', weight: 25 },
  { pattern: /(?:verify\s+your\s+(?:account|identity)|confirm\s+your\s+(?:details|information)|update\s+your\s+(?:payment|billing))/i, sign: 'Asks to verify/confirm personal details', weight: 20 },
  { pattern: /(?:nigerian?\s+prince|inheritance|lottery|beneficiary|unclaimed\s+funds)/i, sign: 'Classic advance-fee / inheritance scam language', weight: 30 },
  { pattern: /(?:work\s+from\s+home|earn\s+\$?\d+.*?(?:per|a|every)\s+(?:day|hour|week)|no\s+experience\s+(?:needed|required))/i, sign: 'Too-good-to-be-true job/money offer', weight: 20 },
  { pattern: /(?:send\s+(?:money|payment|gift\s+card)|wire\s+transfer|western\s+union|moneygram|bitcoin|crypto\s+wallet)/i, sign: 'Requests money transfer or gift cards', weight: 25 },
  { pattern: /(?:your\s+account\s+(?:has\s+been|is|will\s+be)\s+(?:suspended|locked|closed|compromised|hacked))/i, sign: 'Threatens account suspension/compromise', weight: 20 },
  { pattern: /(?:dear\s+(?:customer|user|sir|madam|valued\s+member|friend))/i, sign: 'Uses generic impersonal greeting', weight: 10 },
  { pattern: /(?:congratulations|congrats)[\s!]/i, sign: 'Opens with congratulatory hook', weight: 10 },
  { pattern: /(?:whatsapp|telegram)\s*(?:group|channel|number|msg)/i, sign: 'Redirects to external messaging platform', weight: 10 },
  { pattern: /(?:guaranteed\s+(?:income|returns|profit)|risk[- ]free|100%\s+(?:safe|guaranteed|free))/i, sign: 'Makes unrealistic guarantees', weight: 20 },
  { pattern: /(?:pay\s+(?:a\s+)?(?:small\s+)?(?:fee|charge|deposit|registration)|advance\s+(?:fee|payment))/i, sign: 'Requires upfront payment or fee', weight: 20 },
  { pattern: /(?:(?:free|cheap)\s+iphone|(?:free|cheap)\s+gift|claim\s+(?:your|now|free))/i, sign: 'Offers free expensive items as bait', weight: 15 },
  { pattern: /(?:data\s+entry|typing\s+job|copy\s*paste|survey\s+job|ad\s+(?:clicking|posting))/i, sign: 'Mentions common fake job types', weight: 15 },
];

const LANGUAGE_LABELS = {
  en: {
    explanation_safe: 'This message does not exhibit strong scam indicators based on our pattern analysis. However, always exercise caution with unsolicited messages. This scan alone cannot guarantee a message is safe.',
    explanation_low: 'This message contains a few minor indicators that are sometimes associated with scam messages. While it may be legitimate, review it carefully before taking any action.',
    explanation_medium: 'This message contains several patterns commonly found in scam messages. Exercise significant caution. Do not click any links, share personal information, or send money.',
    explanation_high: 'This message exhibits multiple strong indicators of a scam. It is highly likely an attempt to defraud you. Do not engage, click links, or share any information.',
    rec_safe: ['Stay cautious with unsolicited messages.', 'Never share personal information with unknown senders.', 'If in doubt, verify the sender through official channels.'],
    rec_low: ['Do not click any links in this message.', 'Verify the sender through official channels.', 'Do not share personal or financial information.', 'If the offer seems too good to be true, it probably is.'],
    rec_medium: ['Do NOT click any links or download attachments.', 'Do NOT share personal, financial, or login information.', 'Block the sender and report the message as spam.', 'If it claims to be from a company, contact them directly through their official website.', 'Report to your local cyber crime authority.'],
    rec_high: ['Do NOT respond to this message in any way.', 'Do NOT click any links or call any numbers in this message.', 'Block the sender immediately.', 'Report this to your local cyber crime authority.', 'If you have already shared information, change your passwords immediately and contact your bank.', 'Report to national fraud helpline.'],
  },
  hi: {
    explanation_safe: 'इस संदेश में हमारे पैटर्न विश्लेषण के आधार पर कोई मजबूत स्कैम संकेत नहीं दिखते। हालांकि, अनचाहे संदेशों के साथ हमेशा सावधानी बरतें। यह स्कैन अकेले किसी संदेश की सुरक्षा की गारंटी नहीं दे सकता।',
    explanation_low: 'इस संदेश में कुछ छोटे संकेत हैं जो कभी-कभी स्कैम संदेशों से जुड़े होते हैं। यह वैध हो सकता है, लेकिन कोई भी कार्रवाई करने से पहले ध्यान से देखें।',
    explanation_medium: 'इस संदेश में स्कैम संदेशों में आम तौर पर पाए जाने वाले कई पैटर्न हैं। बहुत सावधानी बरतें। किसी भी लिंक पर क्लिक न करें, व्यक्तिगत जानकारी साझा न करें, या पैसे न भेजें।',
    explanation_high: 'यह संदेश एक स्कैम के कई मजबूत संकेत दिखाता है। यह धोखाधड़ी का प्रयास होने की अत्यधिक संभावना है। संलग्न न हों, लिंक पर क्लिक न करें, या कोई जानकारी साझा न करें।',
    rec_safe: ['अनचाहे संदेशों के साथ सतर्क रहें।', 'अज्ञात प्रेषकों के साथ व्यक्तिगत जानकारी कभी साझा न करें।', 'संदेह होने पर, आधिकारिक चैनलों के माध्यम से प्रेषक को सत्यापित करें।'],
    rec_low: ['इस संदेश में किसी भी लिंक पर क्लिक न करें।', 'आधिकारिक चैनलों के माध्यम से प्रेषक को सत्यापित करें।', 'व्यक्तिगत या वित्तीय जानकारी साझा न करें।'],
    rec_medium: ['किसी भी लिंक पर क्लिक न करें या अटैचमेंट डाउनलोड न करें।', 'व्यक्तिगत, वित्तीय, या लॉगिन जानकारी साझा न करें।', 'प्रेषक को ब्लॉक करें और संदेश को स्पैम के रूप में रिपोर्ट करें।', 'स्थानीय साइबर अपराध प्राधिकरण को रिपोर्ट करें।'],
    rec_high: ['इस संदेश का किसी भी तरह से जवाब न दें।', 'किसी भी लिंक पर क्लिक न करें या किसी नंबर पर कॉल न करें।', 'प्रेषक को तुरंत ब्लॉक करें।', 'स्थानीय साइबर अपराध प्राधिकरण को रिपोर्ट करें।', 'यदि आपने पहले ही जानकारी साझा कर दी है, तो तुरंत अपने पासवर्ड बदलें और अपने बैंक से संपर्क करें।'],
  },
  te: {
    explanation_safe: 'మా ప్యాటర్న్ విశ్లేషణ ఆధారంగా ఈ సందేశంలో బలమైన స్కామ్ సూచికలు కనిపించలేదు. అయితే, అయాచిత సందేశాలతో ఎల్లప్పుడూ జాగ్రత్తగా ఉండండి. ఈ స్కాన్ మాత్రమే సందేశం సురక్షితమని హామీ ఇవ్వలేదు.',
    explanation_low: 'ఈ సందేశంలో స్కామ్ సందేశాలతో అప్పుడప్పుడు అనుబంధించబడే కొన్ని చిన్న సూచికలు ఉన్నాయి. ఇది చట్టబద్ధమైనది కావచ్చు, కానీ ఏదైనా చర్య తీసుకునే ముందు జాగ్రత్తగా సమీక్షించండి.',
    explanation_medium: 'ఈ సందేశంలో స్కామ్ సందేశాలలో సాధారణంగా కనిపించే అనేక నమూనాలు ఉన్నాయి. గణనీయమైన జాగ్రత్త వహించండి. ఏ లింక్‌లపైనా క్లిక్ చేయవద్దు, వ్యక్తిగత సమాచారాన్ని పంచుకోవద్దు లేదా డబ్బు పంపవద్దు.',
    explanation_high: 'ఈ సందేశం స్కామ్ యొక్క అనేక బలమైన సూచికలను ప్రదర్శిస్తుంది. ఇది మిమ్మల్ని మోసగించే ప్రయత్నం అయ్యే అవకాశం చాలా ఎక్కువ. నిమగ్నం కావద్దు, లింక్‌లపై క్లిక్ చేయవద్దు లేదా ఏ సమాచారాన్ని పంచుకోవద్దు.',
    rec_safe: ['అయాచిత సందేశాలతో జాగ్రత్తగా ఉండండి.', 'తెలియని పంపినవారితో వ్యక్తిగత సమాచారాన్ని ఎప్పుడూ పంచుకోవద్దు.', 'సందేహం ఉంటే, అధికారిక ఛానెల్‌ల ద్వారా పంపినవారిని ధృవీకరించండి.'],
    rec_low: ['ఈ సందేశంలోని ఏ లింక్‌లపైనా క్లిక్ చేయవద్దు.', 'అధికారిక ఛానెల్‌ల ద్వారా పంపినవారిని ధృవీకరించండి.', 'వ్యక్తిగత లేదా ఆర్థిక సమాచారాన్ని పంచుకోవద్దు.'],
    rec_medium: ['ఏ లింక్‌లపైనా క్లిక్ చేయవద్దు లేదా అటాచ్‌మెంట్‌లను డౌన్‌లోడ్ చేయవద్దు.', 'వ్యక్తిగత, ఆర్థిక లేదా లాగిన్ సమాచారాన్ని పంచుకోవద్దు.', 'పంపినవారిని బ్లాక్ చేసి, సందేశాన్ని స్పామ్‌గా రిపోర్ట్ చేయండి.', 'మీ స్థానిక సైబర్ క్రైమ్ అథారిటీకి రిపోర్ట్ చేయండి.'],
    rec_high: ['ఈ సందేశానికి ఏ విధంగానూ ప్రతిస్పందించవద్దు.', 'ఏ లింక్‌లపైనా క్లిక్ చేయవద్దు లేదా ఏ నంబర్‌లకు కాల్ చేయవద్దు.', 'పంపినవారిని వెంటనే బ్లాక్ చేయండి.', 'మీ స్థానిక సైబర్ క్రైమ్ అథారిటీకి రిపోర్ట్ చేయండి.', 'మీరు ఇప్పటికే సమాచారాన్ని పంచుకుంటే, వెంటనే మీ పాస్‌వర్డ్‌లు మార్చండి మరియు మీ బ్యాంక్‌ను సంప్రదించండి.'],
  },
};

export function fallbackAnalyze(message, language = 'en') {
  const matchedSigns = [];
  let totalScore = 0;

  for (const { pattern, sign, weight } of SCAM_PATTERNS) {
    if (pattern.test(message)) {
      matchedSigns.push(sign);
      totalScore += weight;
    }
  }

  const riskScore = Math.min(totalScore, 100);

  let riskLevel;
  if (riskScore >= 60) riskLevel = 'high';
  else if (riskScore >= 30) riskLevel = 'medium';
  else if (riskScore >= 10) riskLevel = 'low';
  else riskLevel = 'low';

  const labels = LANGUAGE_LABELS[language] || LANGUAGE_LABELS.en;

  let explanation, recommendations;
  if (riskScore < 10) {
    explanation = labels.explanation_safe;
    recommendations = labels.rec_safe;
  } else if (riskScore < 30) {
    explanation = labels.explanation_low;
    recommendations = labels.rec_low;
  } else if (riskScore < 60) {
    explanation = labels.explanation_medium;
    recommendations = labels.rec_medium;
  } else {
    explanation = labels.explanation_high;
    recommendations = labels.rec_high;
  }

  return {
    risk_level: riskLevel,
    risk_score: riskScore,
    warning_signs: matchedSigns.length > 0 ? matchedSigns : ['No strong scam indicators detected by pattern analysis'],
    explanation,
    recommendations,
    analysis_method: 'rule_based_fallback',
    disclaimer: 'This analysis is based on pattern matching and cannot guarantee accuracy. Even if no threats are detected, exercise caution with unsolicited messages.',
  };
}

