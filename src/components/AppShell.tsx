interface AppShellProps {
  children: React.ReactNode;
  /** Sticky footer content (CTAs) pinned to the bottom of the column. */
  footer?: React.ReactNode;
}

/**
 * Centered mobile-width column for the whole app. On desktop it reads as a
 * phone-sized journal page on parchment; on mobile it fills the screen.
 */
export function AppShell({ children, footer }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col">
      <div className="grain relative flex flex-1 flex-col">
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      </div>
      {footer ? (
        <div
          className="sticky bottom-0 z-20 px-4 pb-6 pt-3"
          style={{
            background:
              "linear-gradient(to top, #ECDFC0 60%, rgba(236,223,192,0))",
          }}
        >
          <div className="mx-auto w-full max-w-[440px]">{footer}</div>
        </div>
      ) : null}
    </div>
  );
}
