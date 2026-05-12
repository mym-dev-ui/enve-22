import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// حفظ البيانات
export const saveVisitor = async (data: any) => {
  try {
    await addDoc(collection(db, "visitors"), data);
    console.log("تم حفظ البيانات");
  } catch (error) {
    console.error("خطأ:", error);
  }
};

// جلب البيانات للداشبورد
export const getVisitors = async () => {
  const querySnapshot = await getDocs(collection(db, "visitors"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};