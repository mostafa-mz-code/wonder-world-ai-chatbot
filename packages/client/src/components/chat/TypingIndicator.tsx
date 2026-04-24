const TypingIndicator = () => {
  return (
    <div className="flex  gap-1 bg-gray-200 p-3 rounded-full self-start">
      <Dot />
      <Dot />
      <Dot />
    </div>
  );
};

const Dot = () => {
  return <div className="size-2 rounded-full bg-black animate-pulse"></div>;
};

export default TypingIndicator;
