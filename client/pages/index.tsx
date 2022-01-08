import { GetServerSideProps } from "next";

import MsgList from "../components/MsgList";

import fetcher from "../fetcher";
import IMessage from "../interfaces/message";
import IUser from "../interfaces/user";

type HomeProps = {
  smsgs: IMessage[];
  users: Record<string, IUser>;
};

const Home = ({ smsgs, users }: HomeProps) => (
  <>
    <h1>SIMPLE SNS</h1>
    <MsgList smsgs={smsgs} users={users} />
  </>
);

export const getServerSideProps: GetServerSideProps = async () => {
  const smsgs = await fetcher("get", "/messages");
  const users = await fetcher("get", "/users");
  return {
    props: { smsgs, users },
  };
};

export default Home;
