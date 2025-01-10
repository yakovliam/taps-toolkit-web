type UseMail = {
  sendMail: (email: string) => void;
};

const useMail = (): UseMail => {
  const sendMail = async (email: string) => {
    window.location = `mailto:${email}` as unknown as Location;
  };

  return {
    sendMail,
  };
};

export default useMail;
