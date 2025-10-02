export default function useDismissDialog() {
  const dismiss = () =>
    (document.querySelector('[data-state="open"]') as HTMLDivElement).click();
  return {
    dismiss,
  };
}
