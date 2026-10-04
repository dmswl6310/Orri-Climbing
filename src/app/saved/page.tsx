import type { Metadata } from "next";
import SavedList from "@/components/saved/SavedList";
import { getGymCardCatalog } from "@/services/gymService";

export const metadata: Metadata = { title: "이 기기에 저장한 암장" };
export default async function SavedPage() {
  const gyms = await getGymCardCatalog();
  return <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
    <h1 className="text-3xl font-black">이 기기에 저장한 암장</h1>
    <p className="text-sm text-gray-600 leading-relaxed">로그인 없이 이 브라우저에 저장합니다. 다른 기기·브라우저와 연동되지 않으며, 사이트 데이터를 삭제하면 목록도 사라집니다. 공용 기기에서는 저장 목록이 다른 사용자에게 보일 수 있어요.</p>
    <SavedList gyms={gyms} />
  </div>;
}
