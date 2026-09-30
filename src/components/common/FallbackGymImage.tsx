import NoImageIcon from "@/components/icons/NoImageIcon";

export default function FallbackGymImage() {
  return (
    <div className="absolute inset-0 w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-300">
      <NoImageIcon className="mb-2" />
      <span className="text-xs font-bold tracking-tight text-gray-600">
        이미지 준비 중
      </span>
    </div>
  );
}
