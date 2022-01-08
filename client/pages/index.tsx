import { GetServerSideProps } from "next";

import MsgList from "../components/MsgList";

import fetcher from "../fetcher";
import { Message } from "../types/message";

type HomeProps = {
  smsgs: Message[];
};

const Home = ({ smsgs }: HomeProps) => (
  <>
    <h1>SIMPLE SNS</h1>
    <MsgList smsgs={smsgs} />
  </>
);

export const getServerSideProps: GetServerSideProps = async () => {
  const smsgs = await fetcher("get", "/messages");
  return {
    props: { smsgs },
  };
};

export default Home;
