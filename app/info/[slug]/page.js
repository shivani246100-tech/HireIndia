import { notFound } from "next/navigation";
import { cookies } from "next/headers";
const email = process.env.CONTACT_EMAIL || "support@example.com";
const phone = process.env.CONTACT_PHONE || "";
const C = {
hi: {
 about: ["हमारे बारे में", [
  "HireIndia एक ऑनलाइन जॉब पोर्टल है, जो नौकरी खोजने वालों और कंपनियों को आपस में जोड़ता है।",
  "उम्मीदवार मुफ़्त में अकाउंट बना सकते हैं, नौकरियाँ खोज सकते हैं, रिज्यूमे अपलोड कर सकते हैं और आवेदन कर सकते हैं।",
  "कंपनियाँ नौकरी पोस्ट करके आवेदन देख सकती हैं और उम्मीदवारों को शॉर्टलिस्ट कर सकती हैं।",
  "फ़र्ज़ी नौकरियों को रोकने के लिए हर नई जॉब पोस्ट हमारी टीम की मंज़ूरी के बाद ही दिखती है।",
  "हम नौकरी या इंटरव्यू की गारंटी नहीं देते। चयन का फ़ैसला संबंधित कंपनी करती है।"]],
 contact: ["संपर्क करें", [
  "किसी भी सवाल, शिकायत या सुझाव के लिए हमसे संपर्क करें।",
  "ईमेल: " + email,
  phone ? "फ़ोन: " + phone : "",
  "हम आमतौर पर 2 से 3 कार्यदिवसों में जवाब देते हैं।",
  "किसी जॉब पोस्ट को फ़र्ज़ी या संदिग्ध पाएँ, खासकर अगर वह पैसे माँगे, तो हमें तुरंत ईमेल करें।"]],
 privacy: ["प्राइवेसी पॉलिसी", [
  "हम कौन-सी जानकारी लेते हैं: नाम, ईमेल, मोबाइल नंबर, शहर, स्किल्स, शिक्षा, अनुभव का विवरण और आपका अपलोड किया रिज्यूमे।",
  "इसका उपयोग: आपका अकाउंट चलाने, आवेदन भेजने और नियोक्ताओं को आपकी प्रोफाइल दिखाने के लिए।",
  "किसे दिखती है: जिस कंपनी की जॉब पर आप आवेदन करते हैं, सिर्फ़ उसे आपकी प्रोफाइल और रिज्यूमे दिखता है। हम आपका डेटा बेचते नहीं हैं।",
  "रिज्यूमे के लिंक: आपका रिज्यूमे एक लिंक पर सेव होता है। जिसके पास वह सीधा लिंक हो, वह उसे खोल सकता है। इसलिए रिज्यूमे में आधार, बैंक या पासवर्ड जैसी संवेदनशील जानकारी न डालें।",
  "पेमेंट: पेमेंट Razorpay के ज़रिए होता है। हम आपके कार्ड या बैंक की जानकारी अपने पास नहीं रखते।",
  "कुकीज़: हम सिर्फ़ लॉगिन बनाए रखने और भाषा याद रखने के लिए कुकी इस्तेमाल करते हैं।",
  "डेटा हटवाना: अपना अकाउंट और डेटा हटवाने के लिए हमें " + email + " पर ईमेल करें।",
  "हम इस पॉलिसी में समय-समय पर बदलाव कर सकते हैं।"]],
 terms: ["नियम व शर्तें", [
  "इस साइट का उपयोग करके आप इन शर्तों को मानते हैं।",
  "आपकी जानकारी: आप जो जानकारी और रिज्यूमे देंगे, वह सही होनी चाहिए।",
  "नियोक्ता: सिर्फ़ असली नौकरियाँ पोस्ट करें। किसी उम्मीदवार से नौकरी के नाम पर पैसे माँगना सख़्त मना है। ऐसा पाए जाने पर अकाउंट बंद किया जाएगा।",
  "मंज़ूरी: हम किसी भी जॉब पोस्ट को बिना सूचना हटा या अस्वीकार कर सकते हैं।",
  "कोई गारंटी नहीं: हम नौकरी, इंटरव्यू या सही उम्मीदवार मिलने की गारंटी नहीं देते। भर्ती का फ़ैसला कंपनी का होता है।",
  "पेमेंट: पैसे के भुगतान और रिफंड का नियम रिफंड पॉलिसी में लिखा है।",
  "ज़िम्मेदारी की सीमा: साइट जैसी है वैसी दी जाती है। कंपनी और उम्मीदवार के बीच के लेन-देन की ज़िम्मेदारी हमारी नहीं है।",
  "लागू कानून: इन शर्तों पर भारत का कानून लागू होगा।"]],
 refund: ["रिफंड और कैंसलेशन पॉलिसी", [
  "उम्मीदवारों के लिए सारी सुविधाएँ मुफ़्त हैं, उन पर कोई शुल्क नहीं।",
  "नियोक्ता का PRO प्लान: ₹999 का एक बार का भुगतान, जिससे अनलिमिटेड जॉब पोस्टिंग मिलती है। भुगतान होते ही प्लान चालू हो जाता है।",
  "अगर पैसे कट गए पर प्लान चालू नहीं हुआ, तो 7 दिन के अंदर " + email + " पर पेमेंट ID के साथ ईमेल करें। जाँच के बाद पैसे 5 से 7 कार्यदिवसों में उसी तरीके से वापस किए जाएँगे।",
  "प्लान चालू होने के बाद सामान्यतः रिफंड नहीं मिलता, जब तक हमारी तरफ़ से कोई तकनीकी गलती न हो।",
  "फ़ेल हुए या डबल कटे पेमेंट का पैसा बैंक या Razorpay के नियमों के अनुसार वापस आता है।"]] },
en: {
 about: ["About us", [
  "HireIndia is an online job portal that connects job seekers with companies.",
  "Candidates can create a free account, search jobs, upload a resume and apply.",
  "Companies can post jobs, view applications and shortlist candidates.",
  "To reduce fake jobs, every new job post appears only after our team approves it.",
  "We do not guarantee a job or an interview. Hiring decisions are made by the company."]],
 contact: ["Contact us", [
  "Reach out for any question, complaint or suggestion.",
  "Email: " + email,
  phone ? "Phone: " + phone : "",
  "We usually reply within 2 to 3 working days.",
  "If you find a job post fake or suspicious, especially one that asks for money, please email us right away."]],
 privacy: ["Privacy Policy", [
  "What we collect: name, email, mobile number, city, skills, education, work experience details and the resume you upload.",
  "How we use it: to run your account, send applications and show your profile to employers.",
  "Who sees it: only the company whose job you apply to can see your profile and resume. We do not sell your data.",
  "Resume links: your resume is saved at a link. Anyone who has the direct link can open it, so do not put sensitive details such as ID numbers, bank details or passwords in your resume.",
  "Payments: payments are processed by Razorpay. We do not store your card or bank details.",
  "Cookies: we use cookies only to keep you logged in and remember your language.",
  "Deleting data: to delete your account and data, email us at " + email + ".",
  "We may update this policy from time to time."]],
 terms: ["Terms & Conditions", [
  "By using this site you agree to these terms.",
  "Your information: the information and resume you provide must be accurate.",
  "Employers: post only genuine jobs. Asking candidates for money in the name of a job is strictly prohibited and will lead to account closure.",
  "Approval: we may remove or reject any job post without notice.",
  "No guarantee: we do not guarantee jobs, interviews or finding the right candidate. Hiring decisions rest with the company.",
  "Payments: payment and refund rules are in the Refund Policy.",
  "Limitation: the site is provided as is. We are not responsible for dealings between companies and candidates.",
  "Governing law: these terms are governed by the laws of India."]],
 refund: ["Refund & Cancellation Policy", [
  "All features for candidates are free, with no charges.",
  "Employer PRO plan: a one-time payment of ₹999 for unlimited job postings. The plan activates as soon as payment is complete.",
  "If money is deducted but the plan is not activated, email " + email + " within 7 days with the payment ID. After checking, the amount is refunded to the original payment method within 5 to 7 working days.",
  "Once the plan is active, refunds are generally not given unless there is a technical error on our side.",
  "Failed or double-charged payments are returned as per bank and Razorpay rules."]] } };
export default function Info({ params }) {
  const lang = cookies().get("lang")?.value === "en" ? "en" : "hi";
  const p = C[lang][params.slug];
  if (!p) notFound();
  return (<main className="w"><div className="card"><h2 style={{ marginTop: 0 }}>{p[0]}</h2>
    {p[1].filter(Boolean).map((x, i) => <p key={i}>{x}</p>)}</div></main>);
}
