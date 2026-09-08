import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "../src/App.jsx";
import { flushFrame, frames, setMotionPreference } from "./setup.js";

function terminal() {
  const element = document.querySelector(".terminal-card-wrap");
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 400, height: 300 });
  return element;
}

describe("resume site user journeys", () => {
  it("keeps both placeholder project details unavailable without navigating to links or contact", () => {
    render(<App />);
    const buttons = screen.getAllByRole("button", { name: "详情待补充" });
    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button.disabled).toBe(true);
      fireEvent.click(button);
    }
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    expect(document.querySelectorAll("#projects a")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Switch to English" }));
    const englishButtons = screen.getAllByRole("button", { name: "DETAILS COMING SOON" });
    expect(englishButtons).toHaveLength(2);
    expect(englishButtons.every(button => button.disabled)).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "切换到中文" }));
    expect(screen.getAllByRole("button", { name: "详情待补充" })).toHaveLength(2);
  });

  it("keeps the original resume button and explains the missing PDF instead of navigating elsewhere", () => {
    render(<App />);
    const button = screen.getByRole("button", { name: "下载简历" });
    expect(button.disabled).toBe(false);
    expect(button.querySelector(".button-arrow").textContent).toBe("↓");
    expect(document.getElementById("resume-status").textContent).toBe("");
    fireEvent.click(button);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    expect(document.getElementById("resume-status").textContent).toContain("PDF 简历准备中");
    fireEvent.click(screen.getByRole("button", { name: "Switch to English" }));
    expect(screen.getByRole("button", { name: "DOWNLOAD RESUME" }).disabled).toBe(false);
    expect(document.getElementById("resume-status").textContent).toContain("The PDF resume is being prepared");
  });

  it("switches page copy, skill labels, tags, title and document language both ways", () => {
    render(<App />);
    expect(document.documentElement.lang).toBe("zh-CN");
    expect(screen.getAllByText("中国 · 上海")).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("ZSZ");
    expect(document.querySelector("footer").textContent).toContain("ZSZ");
    fireEvent.click(screen.getByRole("button", { name: "Switch to English" }));
    expect(document.documentElement.lang).toBe("en");
    expect(screen.getAllByText("SHANGHAI, CHINA")).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("ZSZ");
    expect(document.querySelector("footer").textContent).toContain("ZSZ");
    expect(document.title).toBe("ZSZ | Data Engineering × AI Exploration");
    expect(document.querySelector('meta[name="description"]').content).toBe(document.title);
    expect(screen.getByRole("button", { name: /Warehouse modeling/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Data operations/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Agent coding tools/ })).toBeTruthy();
    expect(screen.getByText("Scheduling")).toBeTruthy();
    expect(screen.getByText("Evaluation")).toBeTruthy();
    // The language selector intentionally keeps its native-language label.
    expect(document.body.textContent.replaceAll("中", "")).not.toMatch(/[\u3400-\u9fff]/);
    fireEvent.click(screen.getByRole("button", { name: "切换到中文" }));
    expect(document.documentElement.lang).toBe("zh-CN");
    expect(document.title).toBe("ZSZ｜数据开发 × AI 探索");
    expect(screen.getByRole("button", { name: /数据仓库建模/ })).toBeTruthy();
  });

  it("allows skills to expand and collapse by click without depending on hover", () => {
    render(<App />);
    const button = screen.getByRole("button", { name: /数据仓库建模/ });
    const detail = document.getElementById(button.getAttribute("aria-controls"));
    expect(detail.hidden).toBe(true);
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(detail.hidden).toBe(false);
    expect(detail.classList.contains("skill-detail--expanded")).toBe(true);
    expect(detail.textContent).toContain("维度建模");
    fireEvent.click(screen.getByRole("button", { name: "Switch to English" }));
    expect(detail.textContent).toContain("Dimensional modeling");
    fireEvent.click(screen.getByRole("button", { name: /Warehouse modeling/ }));
    expect(detail.hidden).toBe(true);
  });

  it("preserves transient mouse-hover skill details", () => {
    render(<App />);
    const button = screen.getByRole("button", { name: /Hive/ });
    fireEvent.pointerEnter(button.parentElement, { pointerType: "mouse" });
    expect(button.getAttribute("aria-expanded")).toBe("true");
    const detail = document.getElementById(button.getAttribute("aria-controls"));
    expect(detail.classList.contains("skill-detail--preview")).toBe(true);
    expect(detail.classList.contains("skill-detail--expanded")).toBe(false);
    fireEvent.pointerLeave(button.parentElement, { pointerType: "mouse" });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.querySelector(".skill-row.is-focused")).toBeNull();
    fireEvent.pointerEnter(button.parentElement, { pointerType: "mouse" });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.querySelector(".skill-row.is-focused")).toBeNull();
  });

  it("keeps hover previews separate from a clicked disclosure while moving between skills", () => {
    render(<App />);
    const hive = screen.getByRole("button", { name: /Hive/ });
    const spark = screen.getByRole("button", { name: /Spark/ });
    const hiveDetail = document.getElementById(hive.getAttribute("aria-controls"));
    const sparkDetail = document.getElementById(spark.getAttribute("aria-controls"));
    fireEvent.click(hive);
    fireEvent.pointerEnter(spark.parentElement, { pointerType: "mouse" });
    expect(hiveDetail.classList.contains("skill-detail--expanded")).toBe(true);
    expect(hiveDetail.hidden).toBe(false);
    expect(sparkDetail.classList.contains("skill-detail--preview")).toBe(true);
    fireEvent.pointerLeave(spark.parentElement, { pointerType: "mouse" });
    expect(sparkDetail.hidden).toBe(true);
    expect(hiveDetail.hidden).toBe(false);
    fireEvent.click(hive);
    expect(hiveDetail.hidden).toBe(true);
  });

  it("tilts on mouse movement without clicks and stops requesting frames after settling", () => {
    render(<App />);
    const element = terminal();
    fireEvent.pointerMove(element, { pointerType: "mouse", clientX: 400, clientY: 0 });
    act(flushFrame);
    expect(element.style.transform).toContain("rotateY(1.120deg)");
    act(() => { for (let i = 0; i < 100 && frames.size; i++) flushFrame(); });
    expect(frames.size).toBe(0);
    expect(element.style.transform).toContain("rotateY(7deg)");
    fireEvent.pointerLeave(element);
    act(() => { for (let i = 0; i < 100 && frames.size; i++) flushFrame(); });
    expect(element.style.transform).toContain("rotateY(0deg)");
  });

  it("does not tilt on touch and keeps normal smooth navigation", () => {
    render(<App />);
    fireEvent.pointerMove(terminal(), { pointerType: "touch", clientX: 400, clientY: 0 });
    expect(frames.size).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: /联系我/ }));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("respects reduced motion on initial load, including tilt, scroll and automatic timers", () => {
    setMotionPreference(true);
    render(<App />);
    const element = terminal();
    fireEvent.pointerMove(element, { pointerType: "mouse", clientX: 400, clientY: 0 });
    expect(frames.size).toBe(0);
    expect(element.style.transform).toBe("none");
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: /联系我/ }));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "instant", block: "start" });
    expect([...document.querySelectorAll(".content-section")].every((section) => section.classList.contains("is-visible"))).toBe(true);
  });

  it("cancels an in-flight tilt when the OS preference changes and recovers when disabled", () => {
    render(<App />);
    const element = terminal();
    fireEvent.pointerMove(element, { pointerType: "mouse", clientX: 400, clientY: 0 });
    act(flushFrame);
    expect(frames.size).toBeGreaterThan(0);
    act(() => setMotionPreference(true));
    expect(element.style.transform).toBe("none");
    expect(frames.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    act(() => setMotionPreference(false));
    fireEvent.pointerMove(element, { pointerType: "mouse", clientX: 400, clientY: 0 });
    act(flushFrame);
    expect(element.style.transform).toContain("rotateY(1.120deg)");
  });

  it("preserves demo play/pause state and cleans up animation work on unmount", () => {
    const { unmount } = render(<App />);
    const track = document.querySelector(".control-track span");
    const initial = track.style.width;
    fireEvent.click(screen.getAllByRole("button", { name: /播放演示/ })[0]);
    act(() => vi.advanceTimersByTime(240));
    expect(track.style.width).not.toBe(initial);
    fireEvent.click(screen.getAllByRole("button", { name: /暂停演示/ })[0]);
    const paused = track.style.width;
    act(() => vi.advanceTimersByTime(240));
    expect(track.style.width).toBe(paused);
    fireEvent.pointerMove(terminal(), { pointerType: "mouse", clientX: 400, clientY: 0 });
    unmount();
    expect(frames.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });
});
