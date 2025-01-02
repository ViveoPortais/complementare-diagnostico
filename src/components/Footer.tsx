type isTall = {
  isTall: boolean;
}

export function Footer({ isTall }: isTall) {
  return (
    <div className={`flex gap-2 items-center justify-center border-t-2 important-color-footer w-full px-4 py-4 bg-white ${isTall ? '' : 'absolute bottom-0 left-0 right-0'}`}>
      <span
        className="font-bold"
      >
        1787-BR-2400102 - Out/2024 | © 2024 Bristol Myers Squibb Company.
      </span>
    </div>
  );
}
