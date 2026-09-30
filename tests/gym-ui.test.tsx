import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GymCard from "@/components/home/GymCard";
import GymHero from "@/components/gym/GymHero";
import GymInfo from "@/components/gym/GymInfo";
import { MOCK_GYMS } from "@/constants/gyms";

describe("gym images", () => {
  it("replaces a failed card image and retries when the source changes", () => {
    const gym = MOCK_GYMS[0];
    const { rerender } = render(<GymCard {...gym} />);
    fireEvent.error(screen.getByRole("img", { name: gym.name }));
    expect(screen.queryByRole("img", { name: gym.name })).not.toBeInTheDocument();
    expect(screen.getByText("이미지 준비 중")).toBeInTheDocument();
    rerender(<GymCard {...gym} thumbnail="https://picsum.photos/seed/new/800/600" />);
    expect(screen.getByRole("img", { name: gym.name })).toBeInTheDocument();
  });

  it("keeps the gym name visible when the hero image fails", () => {
    const gym = MOCK_GYMS[0];
    render(<GymHero name={gym.name} address={gym.address} thumbnail={gym.thumbnail} />);
    fireEvent.error(screen.getByRole("img", { name: gym.name }));
    expect(screen.queryByRole("img", { name: gym.name })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: gym.name })).toBeInTheDocument();
  });
});

it("does not invent prices when a gym has no verified price data", () => {
  render(<GymInfo description="소개" hours={[]} facilities={[]} />);
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
  expect(screen.getByText(/요금 정보가 아직 등록되지 않았습니다/)).toBeInTheDocument();
});

it("renders only the prices supplied for the gym", () => {
  render(<GymInfo description="소개" hours={[]} facilities={[]} prices={[{ label: "일일 이용권", amount: 17000 }]} />);
  expect(screen.getByRole("table")).toHaveTextContent("17,000원");
  expect(screen.queryByText("22,000원")).not.toBeInTheDocument();
});
