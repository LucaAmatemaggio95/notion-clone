"use client";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitle = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
      }}
      onInit={(typewriter) =>
        typewriter
          .typeString("🚀 Supercharged Productivity.")
          .pauseFor(1000)
          .deleteAll()
          .typeString("🤖 AI enhanced")
          .start()
      }
    />
  );
};

export default TypewriterTitle;
