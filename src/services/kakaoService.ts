export async function getAddressFromCoords(lat: string, lon: string) {
  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode?x=${lon}&y=${lat}`,
      {
        headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return ""; // 에러나 문제 생기면 빈문자열 반환

    const data = await res.json();
    if (!data.documents?.length) return "";

    const haengjeongDong = data.documents.find(
      (doc: KakaoRegionDocument) => doc.region_type === "H",
    );
    const region = haengjeongDong || data.documents[0];
    return `${region.region_2depth_name} ${region.region_3depth_name}`;
  } catch (error) {
    console.error("Kakao AI Error: ", error);
    return "";
  }
}
