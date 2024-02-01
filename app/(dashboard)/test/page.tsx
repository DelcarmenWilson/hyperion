import { AudioPlayer } from "@/components/custom/audio-player";

const TestPage = () => {
  return (
    <div>
      <AudioPlayer src={"/sounds/message.mp3"} />
    </div>
  );
};

export default TestPage;
