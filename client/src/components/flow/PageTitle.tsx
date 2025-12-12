interface PageTitleProps {
  children: React.ReactNode;
}

export function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
      {children}
    </h1>
  );
}
