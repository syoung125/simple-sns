import { GetServerSideProps } from "next";

import MsgList from "../components/MsgList";

import IMessage from "../interfaces/message";
import IUser from "../interfaces/user";

import { fetcher } from "../queryClient";
import { GET_MESSAGES } from "../graphql/message";
import { GET_USERS } from "../graphql/user";

type HomeProps = {
  smsgs: IMessage[];
  users: IUser[];
};

const Home = ({ smsgs, users }: HomeProps) => (
  <>
    <h1>SIMPLE SNS</h1>
    <MsgList smsgs={smsgs} users={users} />
  </>
);

export const getServerSideProps: GetServerSideProps = async () => {
  const { messages: smsgs } = await fetcher(GET_MESSAGES);
  const { users } = await fetcher(GET_USERS);
  return {
    props: { smsgs, users },
  };
};

export default Home;
