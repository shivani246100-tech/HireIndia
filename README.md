# HireIndia – Vercel पर डिप्लॉय करने की गाइड
1. कोड GitHub पर पुश करें, फिर vercel.com → Add New → Project → repo चुनें।
2. Vercel → Storage में **Postgres (Neon)** बनाएं और **Blob** स्टोर बनाएं (ये DATABASE_URL और BLOB token खुद जोड़ देते हैं)।
3. Environment Variables में जोड़ें: AUTH_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_RAZORPAY_KEY_ID (.env.example देखें)।
4. Deploy दबाएं। बिल्ड के समय टेबल अपने आप बन जाएंगी (prisma db push)।
5. Razorpay में KYC पूरा करके live keys डालें; टेस्ट के लिए पहले test keys इस्तेमाल करें।
लोकल: `npm i && cp .env.example .env && npm run dev`
