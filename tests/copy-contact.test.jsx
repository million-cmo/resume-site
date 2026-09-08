import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { App } from "../src/App.jsx";

let clipboardDescriptor;
beforeEach(() => { clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, "clipboard"); });
afterEach(() => {
  if (clipboardDescriptor) Object.defineProperty(navigator, "clipboard", clipboardDescriptor);
  else delete navigator.clipboard;
});

function setClipboard(writeText) {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: writeText ? { writeText } : undefined });
}

const copyButton = () => screen.getByRole("button", { name: /微信 zszzs123/ });
const feedback = () => screen.getByRole("status", { name: "复制状态" });

it("waits for a successful clipboard write, announces success and resets after 3.5 seconds", async () => {
  let resolve;
  const writeText = vi.fn(() => new Promise(done => { resolve = done; }));
  setClipboard(writeText);
  render(<App />);
  const button = copyButton();
  fireEvent.click(button);
  expect(writeText).toHaveBeenCalledWith("zszzs123");
  expect(button.disabled).toBe(true);
  expect(button.getAttribute("aria-busy")).toBe("true");
  expect(feedback().textContent).toBe("正在复制微信号…");
  expect(button.textContent).not.toContain("已复制");
  fireEvent.click(button);
  expect(writeText).toHaveBeenCalledOnce();
  await act(async () => resolve());
  expect(button.disabled).toBe(false);
  expect(button.textContent).toContain("已复制");
  expect(feedback().textContent).toBe("微信号已复制");
  expect(document.querySelector(".copy-toast").parentElement).toBe(document.body);
  expect(document.querySelector(".contact-grid").children).toHaveLength(3);
  act(() => vi.advanceTimersByTime(3500));
  expect(button.textContent).not.toContain("已复制");
  expect(feedback().textContent).toBe("");
});

it("shows failure instead of false success and allows a retry", async () => {
  const writeText = vi.fn().mockRejectedValueOnce(new Error("permission denied")).mockResolvedValue(undefined);
  setClipboard(writeText);
  render(<App />);
  await act(async () => fireEvent.click(copyButton()));
  expect(feedback().textContent).toContain("复制未成功");
  expect(feedback().textContent).toContain("手动复制");
  expect(copyButton().textContent).toContain("重试");
  expect(copyButton().textContent).not.toContain("已复制");
  act(() => vi.advanceTimersByTime(10000));
  expect(feedback().textContent).toContain("复制未成功");
  await act(async () => fireEvent.click(copyButton()));
  expect(writeText).toHaveBeenCalledTimes(2);
  expect(feedback().textContent).toBe("微信号已复制");
});

it("handles unavailable Clipboard API and returns focus when the notice is dismissed", async () => {
  setClipboard(undefined);
  render(<App />);
  const button = copyButton();
  await act(async () => fireEvent.click(button));
  expect(feedback().textContent).toContain("复制未成功");
  fireEvent.click(screen.getByRole("button", { name: "关闭复制提示" }));
  expect(feedback().textContent).toBe("");
  expect(button.dataset.copyState).toBe("idle");
  expect(document.activeElement).toBe(button);
});

it("localizes visible copied feedback immediately when switching languages", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  setClipboard(writeText);
  render(<App />);
  await act(async () => fireEvent.click(copyButton()));
  fireEvent.click(screen.getByRole("button", { name: "Switch to English" }));
  expect(screen.getByRole("status", { name: "Copy status" }).textContent).toBe("WeChat ID copied");
  const englishButton = screen.getByRole("button", { name: /WECHAT zszzs123/ });
  expect(englishButton.textContent).toContain("COPIED");
  await act(async () => fireEvent.click(englishButton));
  expect(writeText).toHaveBeenLastCalledWith("zszzs123");
});

it("restarts the success timer on a second successful copy", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  setClipboard(writeText);
  render(<App />);
  await act(async () => fireEvent.click(copyButton()));
  act(() => vi.advanceTimersByTime(3000));
  await act(async () => fireEvent.click(copyButton()));
  act(() => vi.advanceTimersByTime(1000));
  expect(feedback().textContent).toBe("微信号已复制");
  expect(writeText).toHaveBeenCalledTimes(2);
  act(() => vi.advanceTimersByTime(2500));
  expect(feedback().textContent).toBe("");
});

it("does not create a feedback timer if an in-flight copy finishes after unmount", async () => {
  let resolve;
  setClipboard(vi.fn(() => new Promise(done => { resolve = done; })));
  const { unmount } = render(<App />);
  fireEvent.click(copyButton());
  unmount();
  await act(async () => resolve());
  expect(vi.getTimerCount()).toBe(0);
  expect(document.querySelector(".copy-toast")).toBeNull();
});
