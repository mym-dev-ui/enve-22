# نظام التسجيل ولوحة التحكم

موقع تسجيل عربي (RTL) يرسل بيانات المستخدمين مباشرة إلى Firestore الخاص بلوحة تحكم منفصلة (nova-copy على Vercel) — اللوحة تشاهد كل خطوة لحظيًا. المشروع المشترك: Firebase `taameeni-v1`.

## Run & Operate

- `pnpm --filter @workspace/registration-app run dev` — تشغيل الموقع
- `pnpm --filter @workspace/registration-app run typecheck` — فحص الأنواع
- `pnpm run build` — بناء جميع الحزم

## Stack

- React + Vite + Tailwind v4
- framer-motion للحركات
- Firebase v12 (Firestore فقط) — متصل بنفس مشروع taameeni-v1
- pnpm workspaces

## Where things live

- `artifacts/registration-app/src/pages/landing.tsx` — صفحة الهبوط (Hero / Features / CTA)
- `artifacts/registration-app/src/components/RegisterForm.tsx` — فورم 3 خطوات (معلومات → حساب → OTP)
- `artifacts/registration-app/src/lib/firebase.ts` — إعدادات Firebase (مفاتيح web SDK علنية بطبيعتها)
- `artifacts/registration-app/src/lib/registration-service.ts` — كتابة Firestore (collection `pays`)

## Architecture decisions

- لا يوجد backend خاص — اللوحة الموجودة هي المستهلك المباشر لمجموعة `pays` في Firestore.
- كل خطوة في الفورم تنشئ/تحدّث نفس وثيقة Firestore حتى تظهر المراحل لحظيًا داخل اللوحة (`currentStep` 1→2→3، `status` draft→pending_review).
- يتم إرسال نبضة كل 15 ثانية (`online`/`lastSeen`) ليظهر المستخدم متصل في اللوحة، مع `markOffline` عند الإغلاق أو إعادة التعيين.
- أسماء الحقول مطابقة لما تقرأه اللوحة في `dashboard-v1/types.ts` (ownerName, identityNumber, phoneNumber, serialNumber, pinCode, phoneOtp...).

## Product

موقع هبوط احترافي ببطاقة رقمية، يدعو الزائر للتسجيل في 3 خطوات: المعلومات الشخصية، تفاصيل الحساب، ورمز التفعيل OTP. كل البيانات تظهر مباشرة داخل لوحة التحكم الموجودة.

## Gotchas

- لا تنشئ لوحة تحكم جديدة هنا — اللوحة موجودة في repo منفصل والاتصال يتم عبر Firestore فقط.
- مفاتيح Firebase web SDK علنية بطبيعتها؛ الحماية الفعلية تكون عبر Firestore Security Rules في مشروع Firebase.
- لا تشغّل `pnpm dev` من جذر المشروع — استخدم workflows.
