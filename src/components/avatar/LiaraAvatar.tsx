import { AvatarImage } from "@/components/ui/avatar";

type LiaraAvatarProps = {
  name: string | undefined;
};

const LiaraAvatarImage = ({ name }: LiaraAvatarProps) => {
  return (
    <AvatarImage
      src={`https://avatar.iran.liara.run/username?username=${name || ""}`}
    />
  );
};

export default LiaraAvatarImage;
