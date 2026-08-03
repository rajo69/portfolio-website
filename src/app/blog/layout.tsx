/**
 * Blog chrome.
 *
 * The attention field is tuned to sit behind short, large display copy. Behind
 * a long article at reading size it competes with the text, so posts get a
 * scrim over it. Negative z keeps the scrim behind the article while the
 * parent's stacking context keeps it above the canvas, which means the field
 * stays visible as texture without being read as noise between the lines.
 */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative pt-10">
      <div aria-hidden="true" className="fixed inset-0 -z-10 bg-ink-900/80" />
      {children}
    </div>
  );
}
